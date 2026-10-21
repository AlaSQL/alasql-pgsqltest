/**
 * Runs PostgreSQL regression test files, one per job, against its own AlaSQL instance (the worker is reused for
 * many files). Before each file the database is put back to the state after the setup (test_setup.sql).
 *
 * The runner does what psql and the server do around the statements, and sends every statement to AlaSQL as
 * written:
 *   - psql variables (\set, \getenv, \gset) are put into the statements (:name, :'name', :"name")
 *   - COPY ... FROM 'file' or FROM stdin is read by the runner and sent as INSERT statements
 *   - BEGIN, COMMIT, ROLLBACK, SAVEPOINT, RELEASE and ROLLBACK TO are emulated (AlaSQL's in-memory ROLLBACK
 *     changes nothing): table contents are saved and put back; after DDL the runner rebuilds from the setup and
 *     replays the committed statements. After an error inside a transaction, PostgreSQL refuses every statement
 *     until the transaction ends; the runner does the same and does not count those statements.
 *
 * Messages to the main thread: {start, line} before each statement (for the timeout), {check} after it, {done}.
 */
import fs from "fs";
import path from "path";
import { parseTest, parseScript } from "./psql.js";
import { check } from "./compare.js";

const alasql = require(process.env.ALASQL ? path.resolve(process.env.ALASQL) : "alasql");
alasql.options.modifier = "RECORDSET"; // the column list, also for columns that are NULL in every row
// PostgreSQL folds names that are not quoted to lower case: AlaSQL does the same with casesensitive off
alasql.options.casesensitive = process.env.PGTEST_CASESENSITIVE === "1";

const message = e => String(e && e.message !== undefined ? e.message : e).replace(/\s+/g, " ").trim() || "no error message";
const DDL = /^\s*(CREATE|DROP|ALTER|TRUNCATE|GRANT|REVOKE|COMMENT|RENAME)\b/i;
// a statement that changes nothing (functions with side effects aside)
const READ_ONLY = sql => /^\s*\(*\s*(SELECT|EXPLAIN|SHOW|VALUES|TABLE)\b/i.test(sql) && !/\bINTO\b|nextval|setval|set_config/i.test(sql);

const parsed = new Map();
const load = file => {
	if (!parsed.has(file.sql)) parsed.set(file.sql, parseTest(fs.readFileSync(file.sql, "utf8"), fs.existsSync(file.out) ? fs.readFileSync(file.out, "utf8") : ""));
	return parsed.get(file.sql);
};

// ---- AlaSQL state --------------------------------------------------------------------------------------------

function resetAll() {
	alasql.useid = "alasql";
	for (const id of Object.keys(alasql.databases)) if (id !== "alasql" && id !== "dbo") delete alasql.databases[id];
	const db = alasql.databases.alasql;
	db.tables = {};
	db.views = {};
	db.triggers = {};
	db.indices = {};
	db.sqlCache = {};
	db.astCache = {};
	alasql.tables = db.tables;
	alasql.sets = {};
}

// what a ROLLBACK must put back: per database its tables and views (by reference) and the table contents
function snapshot() {
	const dbs = {};
	for (const [id, db] of Object.entries(alasql.databases)) {
		const contents = {};
		for (const [name, t] of Object.entries(db.tables)) if (t) contents[name] = { data: t.data, uniqs: t.uniqs, indices: t.indices, identities: t.identities };
		dbs[id] = { db, tables: { ...db.tables }, views: { ...db.views }, contents: structuredClone(contents) };
	}
	return { dbs, useid: alasql.useid };
}

function restore(snap) {
	for (const id of Object.keys(alasql.databases)) if (!snap.dbs[id]) delete alasql.databases[id];
	for (const [id, s] of Object.entries(snap.dbs)) {
		alasql.databases[id] = s.db;
		s.db.tables = { ...s.tables };
		s.db.views = { ...s.views };
		const contents = structuredClone(s.contents);
		for (const [name, c] of Object.entries(contents)) if (s.db.tables[name]) Object.assign(s.db.tables[name], c);
		s.db.sqlCache = {};
		s.db.astCache = {};
	}
	alasql.useid = alasql.databases[snap.useid] ? snap.useid : "alasql";
	alasql.tables = alasql.databases[alasql.useid].tables;
}

// One statement as AlaSQL sees it: {error} | {columns, rows} | {count}
function exec(sql) {
	try {
		const res = alasql(sql);
		if (res && Array.isArray(res.data) && Array.isArray(res.columns)) {
			let cols = res.columns.map(c => c.columnid);
			if (!cols.length && res.data.length) cols = Object.keys(res.data[0]);
			return { columns: cols, rows: res.data.map(r => (Array.isArray(r) ? r : cols.map(c => r[c]))) };
		}
		if (Array.isArray(res)) return { columns: res.length ? Object.keys(res[0]) : [], rows: res.map(r => Object.values(r)) };
		return { count: typeof res === "number" ? res : null };
	} catch (e) {
		return { error: message(e) };
	}
}

// ---- psql --------------------------------------------------------------------------------------------------

function newSession(root) {
	return { vars: { ...(root ? { abs_srcdir: root, abs_builddir: root, libdir: root, dlsuffix: ".so" } : {}) }, nullDisplay: "", env: { PG_ABS_SRCDIR: root, PG_ABS_BUILDDIR: root, PG_LIBDIR: root, PG_DLSUFFIX: ".so" } };
}

const quoteLiteral = v => "'" + String(v).replace(/'/g, "''") + "'";
const quoteIdent = v => '"' + String(v).replace(/"/g, '""') + '"';

// :name, :'name' and :"name" outside strings, comments and casts (::)
function interpolate(sql, vars) {
	let out = "";
	let i = 0;
	while (i < sql.length) {
		const c = sql[i];
		const rest = sql.slice(i);
		if (c === "'" || c === '"') {
			const end = sql.indexOf(c, i + 1);
			const j = end < 0 ? sql.length : end + 1;
			out += sql.slice(i, j);
			i = j;
			continue;
		}
		if (rest.startsWith("--")) {
			const j = sql.indexOf("\n", i);
			const k = j < 0 ? sql.length : j;
			out += sql.slice(i, k);
			i = k;
			continue;
		}
		if (c === "$") {
			const tag = /^\$([A-Za-z_]\w*)?\$/.exec(rest);
			if (tag && !/\w/.test(sql[i - 1] || "")) {
				const end = sql.indexOf(tag[0], i + tag[0].length);
				const j = end < 0 ? sql.length : end + tag[0].length;
				out += sql.slice(i, j);
				i = j;
				continue;
			}
		}
		if (c === ":" && sql[i - 1] !== ":" && sql[i + 1] !== ":") {
			const m = /^:(?:'([A-Za-z_]\w*)'|"([A-Za-z_]\w*)"|([A-Za-z_]\w*))/.exec(rest);
			if (m) {
				const name = m[1] || m[2] || m[3];
				if (name in vars) {
					out += m[1] ? quoteLiteral(vars[name]) : m[2] ? quoteIdent(vars[name]) : vars[name];
					i += m[0].length;
					continue;
				}
			}
		}
		out += c;
		i++;
	}
	return out;
}

// the arguments of a meta-command: words, 'quoted' text, :var, :'var' (psql joins them for \set)
function metaArgs(args, vars) {
	const out = [];
	const re = /\s*(?:'((?:[^'\\]|''|\\.)*)'|:'(\w+)'|:"(\w+)"|:(\w+)|(\S+?))(?=\s|'|:|$)/gy;
	let m;
	let cur = "";
	let last = 0;
	while (last < args.length && (m = re.exec(args))) {
		if (/^\s/.test(m[0]) && cur !== "") {
			out.push(cur);
			cur = "";
		}
		if (m[1] !== undefined) cur += m[1].replace(/''/g, "'").replace(/\\(.)/g, "$1");
		else if (m[2]) cur += quoteLiteral(vars[m[2]] ?? "");
		else if (m[3]) cur += quoteIdent(vars[m[3]] ?? "");
		else if (m[4]) cur += vars[m[4]] ?? ":" + m[4];
		else if (m[5]) cur += m[5];
		last = re.lastIndex;
	}
	if (cur !== "") out.push(cur);
	return out;
}

function runMeta(it, session) {
	const a = metaArgs(it.args || "", session.vars);
	switch (it.cmd) {
		case "set":
			if (a.length) session.vars[a[0]] = a.slice(1).join("");
			return;
		case "unset":
			delete session.vars[a[0]];
			return;
		case "getenv":
			session.vars[a[0]] = session.env[a[1]] ?? "";
			return;
		case "pset":
			if (a[0] === "null") session.nullDisplay = a[1] ?? "";
			return;
	}
}

// ---- COPY --------------------------------------------------------------------------------------------------

const NUMERIC_TYPE = /^(INT|INTEGER|SMALLINT|BIGINT|INT2|INT4|INT8|SERIAL|BIGSERIAL|SMALLSERIAL|NUMERIC|DECIMAL|DEC|REAL|FLOAT|FLOAT4|FLOAT8|DOUBLE|NUMBER|MONEY|OID)/i;

// COPY t [(cols)] FROM 'file' | STDIN [ [WITH] (options) | CSV | DELIMITER 'x' | NULL 'x' | HEADER ]
function copyFrom(sql, data) {
	const m = /^\s*COPY\s+([\w."]+)\s*(?:\(([^)]*)\))?\s+FROM\s+('(?:[^']|'')*'|STDIN|STDOUT)\s*([\s\S]*?);?\s*$/i.exec(sql);
	if (!m) return null; // not a form the runner reads: AlaSQL gets it as written
	const table = m[1];
	const opts = m[4] || "";
	// only the options the runner reads; any other COPY (WHERE, FREEZE, ENCODING, FORCE_...) goes to AlaSQL
	const rest = opts.replace(/^\s*(WITH\s*)?\(?/i, "").replace(/\)?\s*$/, "");
	const known = /^(\s*,?\s*(FORMAT\s+(text|csv)|CSV|BINARY\s+false|DELIMITER\s+(AS\s+)?'(?:[^']|'')*'|NULL\s+(AS\s+)?'(?:[^']|'')*'|HEADER(\s+(true|false|on|off))?))*\s*$/i;
	if (!known.test(rest)) return null;
	const csv = /\bCSV\b|FORMAT\s+CSV/i.test(opts);
	const delim = (/DELIMITER\s+(?:AS\s+)?'((?:[^']|'')*)'/i.exec(opts) || [])[1] ?? (csv ? "," : "\t");
	const nullText = (/\bNULL\s+(?:AS\s+)?'((?:[^']|'')*)'/i.exec(opts) || [])[1] ?? (csv ? "" : "\\N");
	const header = /\bHEADER\b(?!\s+false)/i.test(opts);
	let lines = data;
	if (/^'/.test(m[3])) {
		const file = m[3].slice(1, -1).replace(/''/g, "'");
		if (!fs.existsSync(file)) return { error: `could not open file "${file}" for reading` };
		lines = fs.readFileSync(file, "utf8").split("\n");
		if (lines[lines.length - 1] === "") lines.pop();
		const end = lines.indexOf("\\.");
		if (end >= 0) lines = lines.slice(0, end);
	}
	if (header) lines = lines.slice(1);
	// the table's columns, for the column list and the types
	const [dbid, tid] = table.includes(".") ? table.split(".") : [alasql.useid, table];
	const t = alasql.databases[dbid] && alasql.databases[dbid].tables[tid];
	if (!t) return { error: `relation "${table}" does not exist` };
	const cols = m[2] ? m[2].split(",").map(c => c.trim()) : (t.columns || []).map(c => c.columnid);
	const types = cols.map(c => ((t.columns || []).find(x => x.columnid === c) || {}).dbtypeid || "");
	// numbers for numeric columns and booleans for boolean ones, as PostgreSQL reads the text; the rest as text
	const value = (v, i) => {
		if (v === null) return null;
		if (NUMERIC_TYPE.test(types[i]) && /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(v.trim())) return Number(v);
		if (/^BOOL/i.test(types[i]) && /^(t|f|true|false)$/i.test(v)) return /^t/i.test(v);
		return v;
	};
	const rows = [];
	for (const line of lines) {
		const fields = csv ? splitCsv(line, delim) : line.split(delim).map(f => (f === nullText ? null : unescapeText(f)));
		if (csv) for (let i = 0; i < fields.length; i++) if (fields[i] === nullText && !fields[i].quoted) fields[i] = null;
		if (fields.length !== cols.length) return { error: fields.length > cols.length ? "extra data after last expected column" : `missing data for column "${cols[fields.length]}"` };
		rows.push(fields.map((f, i) => value(f === null ? null : String(f), i)));
	}
	// one INSERT with parameters, sent to AlaSQL once per row
	const insert = `INSERT INTO ${table} (${cols.join(", ")}) VALUES (${cols.map(() => "?").join(", ")})`;
	for (const row of rows) {
		try {
			alasql(insert, row);
		} catch (e) {
			return { error: message(e) };
		}
	}
	return { count: rows.length };
}

const unescapeText = f => f.replace(/\\(.)/g, (_, c) => ({ t: "\t", n: "\n", r: "\r", b: "\b", f: "\f", v: "\v" })[c] ?? c);

function splitCsv(line, delim) {
	const out = [];
	let cur = "";
	let quoted = false;
	let wasQuoted = false;
	for (let i = 0; i < line.length; i++) {
		const c = line[i];
		if (quoted) {
			if (c === '"' && line[i + 1] === '"') (cur += '"'), i++;
			else if (c === '"') quoted = false;
			else cur += c;
		} else if (c === '"') (quoted = true), (wasQuoted = true);
		else if (c === delim) {
			out.push(wasQuoted ? Object.assign(new String(cur), { quoted: true }) : cur);
			cur = "";
			wasQuoted = false;
		} else cur += c;
	}
	out.push(wasQuoted ? Object.assign(new String(cur), { quoted: true }) : cur);
	return out;
}

// ---- running one item --------------------------------------------------------------------------------------

const TX_BEGIN = /^\s*(BEGIN|START\s+TRANSACTION)\b(?!\s*;?\s*\w+\s*:=)/i;
const TX_COMMIT = /^\s*(COMMIT|END)(\s+(WORK|TRANSACTION))?\s*(AND\s+NO\s+CHAIN)?\s*;?\s*$/i;
const TX_ROLLBACK = /^\s*(ROLLBACK|ABORT)(\s+(WORK|TRANSACTION))?\s*(AND\s+NO\s+CHAIN)?\s*;?\s*$/i;
const TX_SAVEPOINT = /^\s*SAVEPOINT\s+(\w+)\s*;?\s*$/i;
const TX_RELEASE = /^\s*RELEASE\s+(?:SAVEPOINT\s+)?(\w+)\s*;?\s*$/i;
const TX_ROLLBACK_TO = /^\s*ROLLBACK\s+(?:WORK\s+|TRANSACTION\s+)?TO\s+(?:SAVEPOINT\s+)?(\w+)\s*;?\s*$/i;

// A session runs items: psql meta-commands, the runner's own statements (transactions, COPY) and AlaSQL's
function makeRunner(session, options, hooks) {
	const tx = { open: false, aborted: false, snap: null, ddl: false, savepoints: [] };
	let committed = []; // statements since the setup that a rebuild must replay
	let pending = [];
	const counts = { rolledBack: 0, rebuilt: 0 };

	const replayable = (sql, data) => ({ sql, data });
	// COPY ... FROM is read by the runner and sent as INSERTs; a COPY form it does not read goes to AlaSQL
	const execItem = (sql, data) => {
		const copied = /^\s*COPY\b/i.test(sql) ? copyFrom(sql, data || []) : null;
		return copied ? { ...copied, byRunner: true } : exec(sql);
	};

	const rollbackTo = (snap, ddl) => {
		counts.rolledBack++;
		if (!ddl) return restore(snap);
		counts.rebuilt++;
		hooks.rebuild();
		// each replayed statement restarts the main thread's timeout, which is meant for one statement
		for (const s of committed) {
			hooks.progress();
			execItem(s.sql, s.data);
		}
	};

	// returns {result, runner: true} for statements the runner handles, {result} for AlaSQL's, or {aborted}
	function run(sql, data) {
		if (!options.nativeTransactions) {
			if (TX_ROLLBACK_TO.test(sql)) {
				const name = TX_ROLLBACK_TO.exec(sql)[1].toLowerCase();
				const k = tx.savepoints.map(s => s.name).lastIndexOf(name);
				// (a savepoint refused after an earlier error: PostgreSQL fails too, but the cause is the earlier error)
				if (tx.aborted && k < 0) return { aborted: true };
				if (!tx.open || k < 0) return { result: { error: `savepoint "${name}" does not exist` }, runner: true };
				const sp = tx.savepoints[k];
				tx.savepoints.length = k + 1;
				rollbackTo(sp.snap, tx.ddl);
				if (tx.ddl)
					for (const s of pending.slice(0, sp.pending)) {
						hooks.progress();
						execItem(s.sql, s.data);
					}
				pending.length = sp.pending;
				tx.aborted = false;
				return { result: { count: null }, runner: true };
			}
			if (TX_ROLLBACK.test(sql)) {
				if (tx.open) rollbackTo(tx.snap, tx.ddl);
				Object.assign(tx, { open: false, aborted: false, savepoints: [], ddl: false });
				pending = [];
				return { result: { count: null }, runner: true };
			}
			if (TX_COMMIT.test(sql)) {
				// COMMIT of a transaction that had an error is a ROLLBACK
				if (tx.open && tx.aborted) rollbackTo(tx.snap, tx.ddl);
				else committed.push(...pending);
				Object.assign(tx, { open: false, aborted: false, savepoints: [], ddl: false });
				pending = [];
				return { result: { count: null }, runner: true };
			}
			if (tx.aborted) return { aborted: true };
			if (TX_BEGIN.test(sql) && !/^\s*BEGIN\s+ATOMIC/i.test(sql)) {
				if (!tx.open) Object.assign(tx, { open: true, aborted: false, snap: snapshot(), ddl: false, savepoints: [] });
				return { result: { count: null }, runner: true };
			}
			if (TX_SAVEPOINT.test(sql)) {
				if (!tx.open) return { result: { error: "SAVEPOINT can only be used in transaction blocks" }, runner: true };
				tx.savepoints.push({ name: TX_SAVEPOINT.exec(sql)[1].toLowerCase(), snap: snapshot(), pending: pending.length });
				return { result: { count: null }, runner: true };
			}
			if (TX_RELEASE.test(sql)) {
				const name = TX_RELEASE.exec(sql)[1].toLowerCase();
				const k = tx.savepoints.map(s => s.name).lastIndexOf(name);
				if (!tx.open || k < 0) return { result: { error: `savepoint "${name}" does not exist` }, runner: true };
				tx.savepoints.length = k;
				return { result: { count: null }, runner: true };
			}
		}
		const result = execItem(sql, data);
		if (DDL.test(sql) && tx.open) tx.ddl = true;
		// a rebuild replays what changed the state; a statement that only reads is left out
		if (!result.error && !READ_ONLY(sql)) (tx.open ? pending : committed).push(replayable(sql, data));
		else if (tx.open) tx.aborted = true;
		return { result, runner: !!result.byRunner };
	}
	return { run, counts };
}

// ---- setup ---------------------------------------------------------------------------------------------------

let setupJob = null;
let setupSnap = null;
let setupReport = null;

function runSetup() {
	resetAll();
	const session = newSession(setupJob.root);
	const { items } = load(setupJob);
	const report = { file: setupJob.name, statements: 0, failed: [] };
	const runner = makeRunner(session, {}, { rebuild: () => {}, progress: () => {} });
	for (const it of items) {
		if (it.kind === "meta") {
			runMeta(it, session);
			continue;
		}
		const sql = interpolate(it.sql, session.vars);
		report.statements++;
		const r = runner.run(sql, it.copyData);
		if (r.result && r.result.error) report.failed.push({ line: it.line, sql, error: r.result.error });
	}
	alasql.useid = "alasql";
	alasql.tables = alasql.databases.alasql.tables;
	return report;
}

// ---- one test file -------------------------------------------------------------------------------------------

function runFile(job) {
	const { items, aligned } = load(job);
	const session = newSession(job.root);
	// a rebuild runs the setup again: ALTER TABLE changes table objects in place, so a saved state is not enough
	let current = 0;
	const runner = makeRunner(session, job.options, { rebuild: () => runSetup(), progress: () => self.postMessage({ start: true, line: current }) });
	let n = 0;
	for (const it of items) {
		if (it.kind === "meta") {
			runMeta(it, session);
			continue;
		}
		// a statement that timed out in an earlier attempt is left out; the statements before it are run again
		// (to rebuild the state) without being checked again
		if (job.skip && job.skip.includes(it.line)) continue;
		const quiet = job.quietUntil && it.line <= job.quietUntil;
		// a statement that only reads changes nothing to replay (unless \gset takes variables from it)
		if (quiet && !it.meta && READ_ONLY(it.sql)) continue;
		if (!quiet) n++;
		const sql = interpolate(it.sql, session.vars);
		current = it.line;
		self.postMessage({ start: true, line: it.line });
		const base = { line: it.line, sql };
		const t0 = performance.now();
		const r = runner.run(sql, it.copyData);
		base.ms = Math.round(performance.now() - t0);
		const exp = it.expected || { kind: "unread", why: "no expected output" };
		let c;
		if (r.aborted) c = { ...base, status: "skipped", why: "inside a transaction that had an error (PostgreSQL refuses the statement)" };
		else if (exp.kind === "unread") c = { ...base, status: "unread", why: exp.why };
		else if (exp.kind === "meta") c = { ...base, status: "unread", why: "psql meta-command" };
		else {
			const v = check(exp, r.result, sql, session.nullDisplay);
			c = { ...base, status: v.ok ? "pass" : "fail", why: v.why || "", runner: r.runner || undefined };
			if (!v.ok) c.expected = exp.kind === "rows" ? { columns: exp.columns, rows: exp.rows.slice(0, 20) } : exp;
			if (!v.ok) c.got = r.result.error ? { error: r.result.error } : r.result.rows ? r.result.rows.slice(0, 20) : r.result.count;
		}
		// \gset: the first row's columns become variables
		if (it.meta && /^gset$/.test(it.meta.cmd) && r.result && r.result.rows && r.result.rows.length === 1) {
			const prefix = (it.meta.args || "").trim();
			r.result.columns.forEach((col, i) => (session.vars[prefix + col] = r.result.rows[0][i] ?? ""));
		}
		if (!quiet) self.postMessage({ check: c });
	}
	return { statements: n, aligned, ...runner.counts };
}

// ---- messages ------------------------------------------------------------------------------------------------

let dirty = true; // the database is not in the saved setup state

self.addEventListener("message", ev => {
	const job = ev.data;
	if (job.setup) {
		setupJob = job.setup;
		dirty = true;
	}
	// every file starts from a fresh setup: most files change tables in place (ALTER TABLE, CREATE INDEX)
	if (dirty || !setupSnap) {
		setupReport = runSetup();
		setupSnap = snapshot();
		dirty = false;
	}
	if (job.reportSetup) {
		self.postMessage({ setup: setupReport });
		return;
	}
	let out;
	try {
		out = runFile(job);
	} catch (e) {
		out = { crashed: message(e), statements: 0 };
	}
	dirty = true;
	self.postMessage({ done: true, file: job.file, ...out });
});
