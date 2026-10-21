/**
 * Runs the PostgreSQL regression tests (src/test/regress) against AlaSQL with a pool of persistent workers and
 * prints a Markdown report to stdout, one section per test file as it finishes (yarn test writes it to
 * results/output.md).
 *
 * Each SQL statement is one check: its result must be what PostgreSQL printed in expected/<name>.out (the same
 * rows, the same error or no error).
 *
 *   --only-run=pg/sql/boolean.sql[,...]   exactly these files
 *   --include=REGEX  --exclude=REGEX      filter the files of parallel_schedule by name
 *   --concurrency=N                       workers (default: the number of cores)
 *   --timeout=20                          seconds one statement may take before the file is stopped
 *   --debug                               also write every check that is not a pass, as one JSON line, to
 *                                         results/debug.jsonl (replaced on every run)
 *   --printAllErrors                      print every failure, not a sample
 *   --curiousErrorprinting=0.01           share of repeated failures printed besides the first of each kind
 *   --truncSQLStatement=300               cut printed SQL after this many characters
 *   --native-transactions                 send BEGIN / COMMIT / ROLLBACK / SAVEPOINT to AlaSQL instead of emulating them
 *   --casesensitive                       keep AlaSQL's default (names are case-sensitive) instead of casesensitive: false
 *   --setup                               print every failed setup statement, not a sample
 *
 * ALASQL=path/to/alasql.fs.js tests another build, by default the npm package.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pg = path.join(root, "pg");
const alasql = require(process.env.ALASQL ? path.resolve(process.env.ALASQL) : "alasql");

const args = Bun.argv.slice(2);
const arg = (name, def) => {
	const i = args.findIndex(a => a === name || a.startsWith(name + "="));
	if (i < 0) return def;
	if (args[i].includes("=")) return args[i].slice(args[i].indexOf("=") + 1);
	const v = args[i + 1];
	return !v || v.startsWith("--") ? true : v;
};
const flag = name => args.includes(name);
const config = {
	onlyRun: arg("--only-run", ""),
	include: arg("--include", ""),
	exclude: arg("--exclude", ""),
	concurrency: Math.max(1, Number(arg("--concurrency", String(navigator.hardwareConcurrency || 4)))),
	timeout: Number(arg("--timeout", "20")),
	debug: flag("--debug"),
	printAllErrors: flag("--printAllErrors"),
	curious: Number(arg("--curiousErrorprinting", "0.01")),
	trunc: Number(arg("--truncSQLStatement", "300")),
	nativeTransactions: flag("--native-transactions"),
	setupDetails: flag("--setup"),
	casesensitive: flag("--casesensitive"),
};
// read by the workers when they load AlaSQL
if (config.casesensitive) process.env.PGTEST_CASESENSITIVE = "1";

if (!fs.existsSync(path.join(pg, "parallel_schedule"))) {
	console.error("The PostgreSQL files are missing: run `yarn fetch` first");
	process.exit(1);
}

// ---- what to run ---------------------------------------------------------------------------------------------

const testFile = name => ({ name, file: `pg/sql/${name}.sql`, sql: path.join(pg, "sql", name + ".sql"), out: path.join(pg, "expected", name + ".out"), root: pg });
// parallel_schedule: "test: a b c" lines, in order; test_setup is the setup of every file
const schedule = fs
	.readFileSync(path.join(pg, "parallel_schedule"), "utf8")
	.split("\n")
	.filter(l => /^test:/.test(l))
	.flatMap(l => l.replace(/^test:\s*/, "").split(/\s+/).filter(Boolean));
const setup = testFile("test_setup");

let jobs = schedule.filter(n => n !== "test_setup" && fs.existsSync(path.join(pg, "sql", n + ".sql"))).map(testFile);
if (config.onlyRun) {
	if (config.onlyRun === true) {
		console.error("--only-run needs a file: --only-run=pg/sql/boolean.sql");
		process.exit(1);
	}
	jobs = config.onlyRun.split(",").map(f => {
		const p = path.resolve(root, f.trim());
		if (!fs.existsSync(p)) {
			console.error("No such test file: " + p);
			process.exit(1);
		}
		return testFile(path.basename(p, ".sql"));
	});
} else {
	if (config.include) jobs = jobs.filter(j => new RegExp(config.include).test(j.name));
	if (config.exclude) jobs = jobs.filter(j => !new RegExp(config.exclude).test(j.name));
}

const debugPath = path.join(root, "results/debug.jsonl");
if (config.debug) {
	fs.mkdirSync(path.dirname(debugPath), { recursive: true });
	fs.writeFileSync(debugPath, "");
}

// ---- report helpers ------------------------------------------------------------------------------------------

const fmt = n => n.toLocaleString("en-US");
const pct = (a, b) => (b ? Math.floor((100 * a) / b) : 0);
const trunc = (s, n) => (n > 1 && s.length > n ? s.slice(0, n - 1) + "…" : s);
const oneLine = s => s.replace(/\s+/g, " ").trim();
// the kind of a failure, for printing the first of each kind in the run: the reason without values and names
const kindOf = c =>
	c.status +
	":" +
	c.why
		.replace(/Parse error[\s\S]*/, "Parse error")
		.replace(/(rows? (?:\d+ )?differs?|expected \d+ (?:rows|columns), got)[\s\S]*/, "$1")
		.replace(/\(In [\s\S]*$/, "") // the code of a missing function
		.replace(/\[[^\]]*\]/g, "[]") // alasql.fn["name"]
		.replace(/\((?:[^()]|\([^()]*\))*\)/g, "()") // expected an error (message)
		.replace(/^((?:[^:]*:){2})[\s\S]*$/, "$1") // names and values after "error: Table does not exist:"
		.replace(/'[^']*'|"[^"]*"/g, "")
		.replace(/[^a-z]/gi, "")
		.slice(0, 60);
const seen = new Set();
let failures = 0;

const total = { files: 0, statements: 0, pass: 0, fail: 0, unread: 0, skipped: 0, filesClean: 0, rolledBack: 0, rebuilt: 0, crashed: 0, timedOut: 0 };

function report(index, job, res) {
	const out = [];
	out.push("", "---- ---- ---- ---- ---- ---- ----", `### ${index}/${jobs.length} \`${job.file}\``, "");
	if (res.crashed) out.push("Runner error: " + res.crashed, "");
	for (const t of res.stopped) out.push(`The statement at line ${t.line} ran for more than ${config.timeout} s (${t.reason}): it counts as failed, and the file was run again without it.`, "");
	if (res.stopped.length >= 5 && res.dead) out.push("After 5 timeouts the rest of the file was not run.", "");
	if (res.aligned === false) out.push("The expected output stops matching the script part way; the statements after that point are not checked.", "");
	const n = { pass: 0, fail: 0, unread: 0, skipped: 0 };
	for (const c of res.checks) {
		n[c.status]++;
		total[c.status]++;
		if (c.status !== "fail") continue;
		const kind = kindOf(c);
		const curious = config.curious > 0 && failures++ % Math.max(1, Math.round(1 / config.curious)) === 0;
		if (config.printAllErrors || !seen.has(kind) || curious) {
			seen.add(kind);
			out.push("```sql", trunc(oneLine(c.sql), config.trunc), "", `line ${c.line} => ${trunc(c.why, config.trunc)}`, "```", "");
		}
	}
	total.files++;
	total.statements += res.checks.length;
	total.rolledBack += res.rolledBack || 0;
	total.rebuilt += res.rebuilt || 0;
	if (res.crashed) total.crashed++;
	if (res.stopped.length) total.timedOut++;
	const checked = n.pass + n.fail;
	if (n.fail === 0 && checked && !res.crashed) total.filesClean++;
	out.push(`#### ${n.fail === 0 && !res.crashed ? "★" : "☓"} Ran ${fmt(res.checks.length)} statements`, "");
	if (n.fail) out.push(`* ${fmt(n.fail)} failed`);
	if (n.unread) out.push(`* ${fmt(n.unread)} not checked (expected output the runner does not read)`);
	if (n.skipped) out.push(`* ${fmt(n.skipped)} not run (inside a transaction that had an error)`);
	out.push(`* ${pct(n.pass, checked)}% of the checked statements were OK`, "");
	console.log(out.join("\n"));
	if (config.debug) {
		// every statement that did not pass, and every slow one (over a second)
		const lines = res.checks.filter(c => c.status !== "pass" || c.ms > 1000).map(c => JSON.stringify({ file: job.file, ...c }));
		if (lines.length) fs.appendFileSync(debugPath, lines.join("\n") + "\n");
	}
}

// ---- workers -------------------------------------------------------------------------------------------------

const started = performance.now();
console.log("# PostgreSQL regression test results for AlaSQL\n");
console.log("`" + new Date().toISOString() + " target: alasql@" + alasql.version + "`\n");
const source = fs.existsSync(path.join(pg, "SOURCE")) ? fs.readFileSync(path.join(pg, "SOURCE"), "utf8").trim() : "";
console.log(`PostgreSQL regression tests (src/test/regress${source ? ", " + source : ""}): ${jobs.length} test files from parallel_schedule, each run after test_setup${config.nativeTransactions ? ", transactions sent to AlaSQL" : ", transactions emulated by the runner"}, \`casesensitive: ${config.casesensitive}\`.\n`);

const newWorker = () => new Worker(new URL("./worker.js", import.meta.url).href, { type: "module" });

// The setup once, to report it
{
	const w = newWorker();
	const s = await new Promise((resolve, reject) => {
		w.onmessage = ev => ev.data.setup && resolve(ev.data.setup);
		w.onerror = reject;
		w.postMessage({ setup, reportSetup: true });
	});
	w.terminate();
	console.log(`## Setup\n\n\`pg/sql/test_setup.sql\`: ${fmt(s.statements)} statements, ${fmt(s.failed.length)} failed.\n`);
	const kindOfSetup = f => f.sql.replace(/;\s*$/, "").split(/\s+/).slice(0, 2).join(" ").toUpperCase() + ": " + (/^Parse error/.test(f.error) ? "Parse error" : f.error.replace(/'[^']*'|"[^"]*"/g, "…").replace(/\d+/g, "N").slice(0, 70));
	const kinds = new Map();
	for (const x of s.failed) kinds.set(kindOfSetup(x), (kinds.get(kindOfSetup(x)) || 0) + 1);
	if (kinds.size) {
		console.log("| Failure | Statements |\n|---|---|");
		for (const [k, c] of [...kinds].sort((a, b) => b[1] - a[1])) console.log(`| ${k.replace(/\|/g, "\\|")} | ${fmt(c)} |`);
		console.log("");
	}
	const seenSetup = new Set();
	const shown = config.setupDetails ? s.failed : s.failed.filter(x => !seenSetup.has(kindOfSetup(x)) && seenSetup.add(kindOfSetup(x)));
	for (const x of shown) console.log("```sql\n" + trunc(oneLine(x.sql), config.trunc) + `\n\ntest_setup.sql:${x.line}\n=> ` + trunc(x.error, config.trunc) + "\n```\n");
	if (!config.setupDetails && s.failed.length) console.log(`_The first failure of each kind is shown; run with --setup to see every failed statement_\n`);
}

// the SQL of the statement at a line, for a statement that timed out
const scripts = new Map();
const sqlAt = (job, line) => {
	if (!scripts.has(job.sql)) scripts.set(job.sql, fs.readFileSync(job.sql, "utf8").split("\n"));
	const lines = scripts.get(job.sql);
	const out = [];
	for (let i = line - 1; i < lines.length; i++) {
		out.push(lines[i]);
		if (/;\s*(--.*)?$/.test(lines[i])) break;
	}
	return out.join("\n");
};

// one file in a worker, with a watchdog: a statement that runs longer than --timeout stops the file
function runJob(w, job) {
	return new Promise(resolve => {
		const checks = [];
		let current = null;
		let timer = null;
		const finish = res => {
			clearTimeout(timer);
			resolve({ checks, ...res });
		};
		const arm = () => {
			clearTimeout(timer);
			timer = setTimeout(() => finish({ timedOut: { line: current, reason: "timeout" }, dead: true }), config.timeout * 1000);
		};
		w.onmessage = ev => {
			const m = ev.data;
			if (m.start) {
				current = m.line;
				arm();
			} else if (m.check) checks.push(m.check);
			else if (m.done) finish(m);
		};
		w.onerror = e => finish({ timedOut: { line: current, reason: "the worker stopped: " + (e.message || "error") }, dead: true });
		arm();
		w.postMessage({ ...job, setup: w.needsSetup ? setup : undefined, options: { nativeTransactions: config.nativeTransactions } });
		w.needsSetup = false;
	});
}

const queue = jobs.map((j, i) => ({ ...j, index: i + 1 }));
let done = 0;
await Promise.all(
	Array.from({ length: Math.min(config.concurrency, Math.max(1, jobs.length)) }, async () => {
		let w = newWorker();
		w.needsSetup = true;
		while (queue.length) {
			const job = queue.shift();
			// a statement that runs longer than --timeout blocks the worker: replace the worker and run the file again
			// without that statement (up to 5 times per file)
			const checks = [];
			const stopped = [];
			let attempt = { ...job };
			let res;
			for (;;) {
				res = await runJob(w, attempt);
				checks.push(...res.checks);
				if (!res.dead) break;
				w.terminate();
				w = newWorker();
				w.needsSetup = true;
				stopped.push(res.timedOut);
				checks.push({ line: res.timedOut.line, sql: sqlAt(job, res.timedOut.line), status: "fail", why: `timeout: ran for more than ${config.timeout} s` + (res.timedOut.reason === "timeout" ? "" : ` (${res.timedOut.reason})`) });
				if (stopped.length >= 5) break;
				attempt = { ...job, skip: stopped.map(t => t.line), quietUntil: res.timedOut.line };
			}
			done++;
			report(done, job, { ...res, checks, stopped });
		}
		w.terminate();
	}),
);

const checked = total.pass + total.fail;
console.log("\n-----------------------------\n");
console.log("## Final result\n");
console.log(`* \`alasql@${alasql.version}\` (Bun ${Bun.version})`);
console.log(`* Test files: ${fmt(total.files)}, ${fmt(total.filesClean)} without a failure${total.timedOut ? `, ${fmt(total.timedOut)} with a statement over the ${config.timeout} s timeout` : ""}${total.crashed ? `, ${fmt(total.crashed)} stopped by a runner error` : ""}`);
console.log(`* Statements: ${fmt(total.statements)}: ${fmt(total.pass)} passed, ${fmt(total.fail)} failed, ${fmt(total.unread)} not checked, ${fmt(total.skipped)} not run`);
console.log(`* ROLLBACK emulated ${fmt(total.rolledBack)} times (${fmt(total.rebuilt)} by rebuilding after DDL)`);
console.log(`* Final score: ${pct(total.pass, checked)} % of the checked statements were OK\n`);
console.log(`Total script time: ${((performance.now() - started) / 1000).toFixed(1)}s\n`);
console.log("_Repeated failures are sampled; run with --printAllErrors to see every one, or --debug for results/debug.jsonl_");
