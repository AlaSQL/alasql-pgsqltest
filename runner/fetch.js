/**
 * Downloads the PostgreSQL regression tests (src/test/regress of the PostgreSQL source) at a fixed commit and
 * puts the parts this runner uses into pg/:
 *
 *   pg/sql/                the test scripts
 *   pg/expected/           the expected output of each script (psql -a), with alternative outputs (name_1.out)
 *   pg/data/               the data files that the scripts load with COPY
 *   pg/parallel_schedule   the order of the tests
 *   pg/resultmap, pg/README, pg/COPYRIGHT, pg/SOURCE (the commit)
 *
 * The files are used as PostgreSQL has them: the runner never edits a file.
 *
 *   bun run runner/fetch.js [--force] [--commit=<sha>]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const commitArg = process.argv.find(a => a.startsWith("--commit="));
const commit = commitArg ? commitArg.split("=")[1] : "6b9f40d49ae33eb0b4a7c77666fe4971ef7ba087"; // master, 2026-10-21
const url = `https://codeload.github.com/postgres/postgres/tar.gz/${commit}`;
const target = path.join(root, "pg");
const regress = `postgres-${commit}/src/test/regress`;
const keep = ["sql", "expected", "data", "parallel_schedule", "resultmap", "README"];

if (fs.existsSync(path.join(target, "parallel_schedule")) && !process.argv.includes("--force")) {
	console.log("pg/ is already there (use --force to fetch it again)");
	process.exit(0);
}

console.log("Downloading " + url);
const res = await fetch(url);
if (!res.ok) throw new Error("Download failed: HTTP " + res.status);
const tmp = fs.mkdtempSync(path.join(root, ".fetch-"));
try {
	fs.writeFileSync(path.join(tmp, "pg.tar.gz"), Buffer.from(await res.arrayBuffer()));
	const tar = Bun.spawnSync(["tar", "-xzf", path.join(tmp, "pg.tar.gz"), "-C", tmp, regress, `postgres-${commit}/COPYRIGHT`]);
	if (tar.exitCode !== 0) throw new Error("tar failed: " + tar.stderr.toString());
	fs.rmSync(target, { recursive: true, force: true });
	fs.mkdirSync(target);
	for (const entry of keep) fs.cpSync(path.join(tmp, regress, entry), path.join(target, entry), { recursive: true });
	fs.copyFileSync(path.join(tmp, `postgres-${commit}`, "COPYRIGHT"), path.join(target, "COPYRIGHT"));
	fs.writeFileSync(path.join(target, "SOURCE"), `postgres/postgres@${commit}\n`);
} finally {
	fs.rmSync(tmp, { recursive: true, force: true });
}
const count = d => fs.readdirSync(path.join(target, d)).length;
console.log(`pg/ ready: ${count("sql")} files in sql/, ${count("expected")} in expected/, ${count("data")} in data/`);
