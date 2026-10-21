/**
 * Reads a PostgreSQL regression test: the script (sql/<name>.sql) as psql runs it, and the expected output
 * (expected/<name>.out), which is the script echoed by psql (`-a`, blank lines left out) with the output of each
 * statement after it.
 *
 *   parseScript(text)        -> items: {kind: "sql", sql, line, endLine, copyData?, meta?} | {kind: "meta", cmd, args, line}
 *   parseTest(sqlText, out)  -> the items of the script, each with `expected`:
 *        {kind: "none"}                            no output (a command, quiet mode)
 *        {kind: "rows", columns, rows, count}      a result table (aligned format)
 *        {kind: "error", message}                  ERROR: ...
 *        {kind: "unread", why}                     output the runner cannot read (another \pset format, ...)
 *        {kind: "meta"}                            a psql meta-command (its output is not compared)
 *      and `notices` (NOTICE, WARNING, INFO lines, not compared).
 *      Returns {items, aligned}: aligned is false when the output stopped matching the script; the items after
 *      that point get {kind: "unread"}.
 */

// ---- the script ----------------------------------------------------------------------------------------------

export function parseScript(text) {
	const lines = text.split("\n");
	const items = [];
	let buf = []; // lines of the statement being read
	let bufLine = 0;
	let copyFor = null; // a COPY ... FROM stdin statement waiting for its data lines
	// lexer state that runs across lines
	let quote = null; // "'", '"', or a dollar tag "$tag$"
	let blockDepth = 0; // /* */ comments nest in PostgreSQL
	let parens = 0;
	const quotedLines = new Set(); // lines that start inside a string or dollar quote (psql echoes them even when blank)

	const flush = (end, line) => {
		const sql = buf.join("\n").trim();
		buf = [];
		if (!sql) return;
		const item = { kind: "sql", sql, line: bufLine, endLine: line, terminator: end };
		items.push(item);
		if (/^\s*COPY\b[\s\S]*\bFROM\s+(STDIN|STDOUT)\b/i.test(sql)) {
			copyFor = item;
			item.copyData = [];
		}
	};

	for (let i = 0; i < lines.length; i++) {
		const raw = lines[i];
		const lineNo = i + 1;
		if (quote) quotedLines.add(lineNo);
		if (copyFor) {
			// data lines of COPY FROM stdin, up to \.  (psql does not echo them)
			if (raw === "\\.") {
				copyFor = null;
				continue;
			}
			copyFor.copyData.push(raw);
			continue;
		}
		if (!buf.length && !quote && !blockDepth && /^\s*\\/.test(raw)) {
			// a meta-command on its own line
			const m = /^\s*\\(\S+)\s*(.*)$/.exec(raw);
			items.push({ kind: "meta", cmd: m[1], args: m[2], line: lineNo, endLine: lineNo, text: raw });
			continue;
		}
		if (!buf.length) bufLine = lineNo;
		// scan the line for the end of a statement
		let start = 0;
		let j = 0;
		while (j < raw.length) {
			const c = raw[j];
			const rest = raw.slice(j);
			if (blockDepth) {
				if (rest.startsWith("*/")) blockDepth--, (j += 2);
				else if (rest.startsWith("/*")) blockDepth++, (j += 2);
				else j++;
				continue;
			}
			if (quote) {
				if (quote === "'" || quote === "E'") {
					if (quote === "E'" && c === "\\") j += 2;
					else if (c === "'" && raw[j + 1] === "'") j += 2;
					else if (c === "'") (quote = null), j++;
					else j++;
				} else if (quote === '"') {
					if (c === '"' && raw[j + 1] === '"') j += 2;
					else if (c === '"') (quote = null), j++;
					else j++;
				} else if (rest.startsWith(quote)) (j += quote.length), (quote = null);
				else j++;
				continue;
			}
			if (rest.startsWith("--")) break;
			if (rest.startsWith("/*")) {
				blockDepth++;
				j += 2;
				continue;
			}
			if ((c === "E" || c === "e") && raw[j + 1] === "'" && !/\w/.test(raw[j - 1] || "")) {
				quote = "E'";
				j += 2;
				continue;
			}
			if (c === "'" || c === '"') {
				quote = c;
				j++;
				continue;
			}
			if (c === "$") {
				const tag = /^\$([A-Za-z_]\w*)?\$/.exec(rest);
				if (tag && !/\w/.test(raw[j - 1] || "")) {
					quote = tag[0];
					j += tag[0].length;
					continue;
				}
			}
			if (c === "(") parens++;
			if (c === ")") parens = Math.max(0, parens - 1);
			if (c === ";" && !parens) {
				buf.push(raw.slice(start, j + 1));
				flush(";", lineNo);
				start = j + 1;
				j++;
				continue;
			}
			if (c === "\\" && !parens) {
				// a meta-command ends the statement: \gset, \g, \gx, \gexec, \bind ...
				const m = /^\\(\S+)\s*(.*)$/.exec(rest);
				buf.push(raw.slice(start, j));
				const stmtLine = lineNo;
				flush("\\" + m[1], stmtLine);
				items[items.length - 1] && (items[items.length - 1].meta = { cmd: m[1], args: m[2] });
				start = raw.length;
				break;
			}
			j++;
		}
		const tail = raw.slice(start);
		// after a ";" the rest of the line is a new statement, unless it is only a comment
		if (buf.length || (tail.trim() && !/^\s*--/.test(tail))) {
			if (!buf.length) bufLine = lineNo;
			buf.push(tail);
		}
		if (buf.length && !buf.join("").trim()) buf = [];
	}
	if (buf.length) flush("", lines.length);
	items.quotedLines = quotedLines;
	return items;
}

// ---- the expected output -------------------------------------------------------------------------------------

const isTableSeparator = l => /^-+(\+-+)*$/.test(l) || l === "--" || /^-*$/.test(l);
const isCountLine = l => /^\(\d+ rows?\)$/.test(l);
const isMessage = l => /^(ERROR|NOTICE|WARNING|INFO|DETAIL|HINT|CONTEXT|QUERY|LINE \d+|LOCATION|STATEMENT):/.test(l);

// The lines of a message: LINE n and its caret, DETAIL, HINT, CONTEXT and their continuation lines (a DETAIL
// such as "drop cascades to ..." goes on unindented), up to a blank line, the next message or a table header
const messageGoesOn = (lines, i) =>
	i < lines.length && lines[i] !== "" && !/^(ERROR|NOTICE|WARNING|INFO):/.test(lines[i]) && !(i + 1 < lines.length && /^-+(\+-+)*$/.test(lines[i + 1])) && !isCountLine(lines[i]);

// Splits the output after one script line into blocks: tables, errors (with LINE/DETAIL/HINT...), notices
function readBlocks(lines) {
	const blocks = [];
	let i = 0;
	while (i < lines.length) {
		const l = lines[i];
		if (l === "") {
			i++;
			continue;
		}
		if (/^ERROR:/.test(l)) {
			const msg = [l.replace(/^ERROR:\s*/, "")];
			i++;
			// the error's own lines: LINE n, the caret under it, DETAIL, HINT, CONTEXT and their indented continuations
			while (messageGoesOn(lines, i)) i++;
			blocks.push({ kind: "error", message: msg[0] });
			continue;
		}
		if (/^(NOTICE|WARNING|INFO):/.test(l)) {
			i++;
			while (messageGoesOn(lines, i)) i++;
			blocks.push({ kind: "notice", message: l });
			continue;
		}
		// a table without columns: "--" and the row count
		if (l === "--" && i + 1 < lines.length && isCountLine(lines[i + 1])) {
			const count = Number(/\d+/.exec(lines[i + 1])[0]);
			blocks.push({ kind: "rows", columns: [], rows: Array.from({ length: count }, () => []), count });
			i += 2;
			continue;
		}
		// a table: header, separator, rows, (n rows)
		if (i + 1 < lines.length && isTableSeparator(lines[i + 1]) && lines[i + 1] !== "") {
			const header = l;
			const sep = lines[i + 1];
			let k = i + 2;
			const body = [];
			while (k < lines.length && !isCountLine(lines[k])) body.push(lines[k++]);
			if (k >= lines.length) {
				blocks.push({ kind: "unread", why: "a table without its row count" });
				return blocks;
			}
			blocks.push(readTable(header, sep, body, Number(/\d+/.exec(lines[k])[0])));
			i = k + 1;
			continue;
		}
		blocks.push({ kind: "unread", why: "output the runner does not read: " + l.slice(0, 60) });
		// skip to the next blank line
		while (i < lines.length && lines[i] !== "") i++;
	}
	return blocks;
}

function readTable(header, sep, body, count) {
	// column boundaries from the separator: "------+------"
	const widths = sep === "--" || sep === "" ? [] : sep.split("+").map(s => s.length);
	const cut = line => {
		const cells = [];
		let pos = 0;
		for (let c = 0; c < widths.length; c++) {
			cells.push(line.slice(pos, pos + widths[c]));
			pos += widths[c] + 1; // the "|" or "+" between columns
		}
		return cells;
	};
	const columns = widths.length ? cut(header).map(s => s.trim()) : [];
	const rows = [];
	let cont = false; // the previous line ended a cell with "+": the value goes on in this line
	for (const line of body) {
		const cells = cut(line);
		// a value with a newline: the line ends with " +" (or a cell is followed by "+" instead of "|")
		const wraps = /\+$/.test(line) || widths.some((w, c) => line[widths.slice(0, c + 1).reduce((a, b) => a + b + 1, 0) - 1] === "+" && c < widths.length - 1);
		const values = cells.map(s => s.replace(/\s+\+?$/, "").replace(/^ /, ""));
		if (cont && rows.length) {
			const prev = rows[rows.length - 1];
			for (let c = 0; c < values.length; c++) if (values[c] !== "") prev[c] = (prev[c] ?? "") + "\n" + values[c].trimStart();
		} else rows.push(values);
		cont = wraps;
	}
	if (rows.length !== count) return { kind: "unread", why: `a table the runner cannot cut into ${count} rows` };
	return { kind: "rows", columns, rows: rows.map(r => r.map(v => v.trim())), count };
}

// does this statement give a table in psql (when it does not fail)?
const givesRows = item => item.kind === "sql" && (/^\s*\(*\s*(SELECT|VALUES|WITH|TABLE|SHOW|EXPLAIN|FETCH|MOVE|EXECUTE)\b/i.test(item.sql) && !/^\s*WITH\b[\s\S]*\)\s*(INSERT|UPDATE|DELETE|MERGE)\b(?![\s\S]*\bRETURNING\b)/i.test(item.sql) || /\bRETURNING\b/i.test(item.sql));

/**
 * Walks the expected output along the script. psql echoes every non-blank script line (except COPY data) as it
 * reads it, then prints the output of each statement that ends on that line.
 */
export function parseTest(sqlText, outText) {
	const lines = sqlText.split("\n");
	const items = parseScript(sqlText);
	const out = outText.split("\n");
	if (out[out.length - 1] === "") out.pop();

	// which item echoes which line: a line belongs to the first item on it; lines between items (comments)
	// belong to the next item; COPY data and blank lines are not echoed
	const copyLines = new Set();
	for (const it of items) if (it.copyData) for (let k = 0; k <= it.copyData.length; k++) copyLines.add(it.endLine + 1 + k);
	let next = 1; // the first line not given to an item yet
	let echoOn = true; // \set ECHO none turns the echo off, \set ECHO all on again
	for (const it of items) {
		it.echo = [];
		// psql skips blank lines, except inside a string or a dollar-quoted body
		if (echoOn) for (let l = next; l <= it.endLine; l++) if ((lines[l - 1].trim() !== "" || items.quotedLines.has(l)) && !copyLines.has(l)) it.echo.push(lines[l - 1]);
		next = Math.max(next, it.endLine + 1);
		while (copyLines.has(next)) next++;
		const echoSet = it.kind === "meta" && it.cmd === "set" && /^ECHO\b\s*(\S*)/.exec(it.args);
		if (echoSet) echoOn = echoSet[1] === "all" || echoSet[1] === "queries";
		it.echoOff = !echoOn && !echoSet;
	}

	let o = 0;
	let aligned = true;
	for (let n = 0; n < items.length; n++) {
		const it = items[n];
		it.notices = [];
		if (!aligned) {
			it.expected = { kind: "unread", why: "the expected output stopped matching the script before this statement" };
			continue;
		}
		for (const s of it.echo) {
			if (out[o] === s) o++;
			else {
				aligned = false;
				break;
			}
		}
		if (!aligned) {
			it.expected = { kind: "unread", why: "the expected output stopped matching the script at this statement" };
			continue;
		}
		// the statements that end on the same line (and echo nothing of their own) share the output
		const group = [it];
		// (statements read while the echo is off print their output in the same place)
		while (n + 1 < items.length && items[n + 1].echo.length === 0) group.push(items[++n]);
		// the output runs up to the next echoed line
		const following = items.slice(n + 1).find(x => x.echo.length);
		const start = o;
		if (!following) o = out.length;
		else {
			// the whole echo of the next statement must follow, not only its first line ("--" is also the
			// separator of a table without columns)
			const at = k => following.echo.every((e, x) => out[k + x] === e);
			while (o < out.length && !at(o)) o++;
			if (o >= out.length) aligned = false;
		}
		assign(group, readBlocks(out.slice(start, o)));
		for (const g of group) if (g.echoOff && g.kind === "sql") g.expected = { kind: "unread", why: "read while the psql echo is off" };
	}
	return { items, aligned };
}

// gives the blocks of output to the statements that end on one line
function assign(group, blocks) {
	const real = blocks.filter(b => b.kind !== "notice");
	const notices = blocks.filter(b => b.kind === "notice").map(b => b.message);
	group[0].notices = notices;
	if (group.length === 1) {
		const it = group[0];
		if (it.kind === "meta") it.expected = { kind: "meta" };
		else if (real.length === 0) it.expected = { kind: "none" };
		else if (real.length === 1) it.expected = real[0];
		else it.expected = real.find(b => b.kind === "unread") || { kind: "unread", why: "more than one result for one statement" };
		return;
	}
	// several statements on one line: tables go to the statements that give rows, errors in order
	let b = 0;
	for (const it of group) {
		const next = real[b];
		if (it.kind === "meta") it.expected = { kind: "meta" };
		else if (next && (next.kind === "error" || next.kind === "unread" || (next.kind === "rows" && givesRows(it)))) {
			it.expected = next;
			b++;
		} else it.expected = { kind: "none" };
	}
	if (b !== real.length) for (const it of group) if (it.kind === "sql") it.expected = { kind: "unread", why: "several statements on one line, the runner cannot tell whose output is whose" };
}
