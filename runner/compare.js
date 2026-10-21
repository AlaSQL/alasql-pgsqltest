/**
 * Compares what AlaSQL did with what PostgreSQL printed for one statement.
 *
 *   check(expected, got, sql, nullDisplay) -> {ok: true} | {ok: false, why}
 *
 * expected: from psql.js ({kind: "none" | "rows" | "error"}); got: {error} or {columns, rows} or {count}.
 * Values are compared as psql prints them: NULL as the \pset null text (empty by default), booleans as t and f,
 * numbers equal when they are the same number (1.50 is 1.5), and a float equal when it rounds to the digits
 * PostgreSQL printed. Without ORDER BY the rows may come in any order.
 */

// a JavaScript value as psql prints it
export function pgText(v, nullDisplay = "") {
	if (v === null || v === undefined) return nullDisplay;
	if (v === true) return "t";
	if (v === false) return "f";
	if (typeof v === "number") {
		if (Number.isNaN(v)) return "NaN";
		if (v === Infinity) return "Infinity";
		if (v === -Infinity) return "-Infinity";
		return Object.is(v, -0) ? "-0" : String(v);
	}
	if (typeof v === "bigint") return String(v);
	if (v instanceof Date) return isNaN(v) ? "Invalid Date" : v.toISOString();
	if (Array.isArray(v)) return "{" + v.map(x => (x === null || x === undefined ? "NULL" : pgText(x))).join(",") + "}";
	if (typeof v === "object") return JSON.stringify(v);
	return String(v);
}

const NUM = /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/;

// one printed value against one of ours
function same(exp, got) {
	if (exp === got) return true;
	if (NUM.test(exp) && NUM.test(got)) {
		const a = Number(exp);
		const b = Number(got);
		if (a === b) return true;
		// PostgreSQL printed fewer digits (float4, numeric scale): equal when ours rounds to them
		const digits = exp.replace(/[eE].*/, "").replace(/[-+.]/g, "").replace(/^0+/, "").length;
		if (digits > 0 && digits < 17 && Number(b.toPrecision(digits)) === a) return true;
	}
	return false;
}

const show = row => row.map(v => (v === "" ? "''" : v)).join(" | ");

export function check(expected, got, sql, nullDisplay = "") {
	if (expected.kind === "error") {
		if (got.error) return { ok: true };
		return { ok: false, why: "expected an error (" + expected.message + "), got " + (got.rows ? got.rows.length + " rows" : "success") };
	}
	if (got.error) return { ok: false, why: "error: " + got.error };
	if (expected.kind === "none") {
		// a command: success is enough, but a SELECT that psql printed nothing for is not a SELECT
		return { ok: true };
	}
	if (expected.kind !== "rows") return { ok: false, why: "nothing to compare" };
	if (!got.rows) return { ok: false, why: `expected ${expected.count} rows, got ${got.count !== null && got.count !== undefined ? "the count " + got.count : "no result set"}` };
	const ours = got.rows.map(r => r.map(v => pgText(v, nullDisplay).trim()));
	const theirs = expected.rows;
	if (ours.length !== theirs.length) return { ok: false, why: `expected ${theirs.length} rows, got ${ours.length}` };
	const width = expected.columns.length;
	if (ours.length && ours[0].length !== width) return { ok: false, why: `expected ${width} columns, got ${ours[0].length}` };
	const rowsSame = (a, b) => a.length === b.length && a.every((v, i) => same(b[i], v));
	const firstDiff = (a, b) => a.findIndex((r, i) => !rowsSame(r, b[i]));
	let d = firstDiff(ours, theirs);
	if (d < 0) return { ok: true };
	// without ORDER BY the order of the rows is not part of the result
	if (!/\bORDER\s+BY\b/i.test(sql)) {
		const key = r => r.map(v => (NUM.test(v) ? String(Number(v)) : v)).join("\u0001");
		const a = [...ours].sort((x, y) => (key(x) < key(y) ? -1 : key(x) > key(y) ? 1 : 0));
		const b = [...theirs].sort((x, y) => (key(x) < key(y) ? -1 : key(x) > key(y) ? 1 : 0));
		const d2 = firstDiff(a, b);
		if (d2 < 0) return { ok: true };
		return { ok: false, why: `rows differ (in any order): expected ${show(b[d2])}, got ${show(a[d2])}` };
	}
	return { ok: false, why: `row ${d + 1} differs: expected ${show(theirs[d])}, got ${show(ours[d])}` };
}
