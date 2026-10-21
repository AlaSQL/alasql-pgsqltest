# alasql-pgsqltest

The PostgreSQL regression tests (`src/test/regress` of the PostgreSQL source) run against [AlaSQL](https://github.com/AlaSQL/alasql). It is the companion of [alasql-sqllogictest](https://github.com/AlaSQL/alasql-sqllogictest) and [alasql-nistsqltest](https://github.com/AlaSQL/alasql-nistsqltest): the same kind of long-running runner with a pool of workers, a Markdown report written as it goes, sampled failures, and every failure as JSON with `--debug`.

```sh
bun install
yarn test           # writes results/output.md
```

## Commands

| Command | What it does |
|---|---|
| `yarn test [flags]` | Runs `runner/run.js` and writes the report to `results/output.md`; flags go to the runner, for example `yarn test --debug` |
| `yarn triage` | Groups the statements of the last `--debug` run that did not pass by kind, the largest first |
| `yarn fetch --force` | Downloads the tests again from the PostgreSQL source at the commit in `runner/fetch.js` (`--commit=<sha>` for another); the files are already in the repository |

| Flag | |
|---|---|
| `--only-run=FILE[,FILE]` | Run exactly these files, for example `--only-run=pg/sql/boolean.sql` |
| `--include=REGEX`, `--exclude=REGEX` | Filter the test files by name |
| `--concurrency=N` | Number of workers (default: the number of cores) |
| `--timeout=20` | Seconds one statement may take. A statement that takes longer counts as failed, and the file is run again without it |
| `--debug` | Also write every statement that did not pass, with the SQL, the expected and the actual result, to `results/debug.jsonl` (replaced on every run, not committed) |
| `--printAllErrors` | Print every failure instead of a sample |
| `--curiousErrorprinting=0.01` | Share of repeated failures printed besides the first of each kind (the first is always printed) |
| `--truncSQLStatement=300` | Cut printed SQL after this many characters |
| `--native-transactions` | Send `BEGIN`, `COMMIT`, `ROLLBACK`, `SAVEPOINT` to AlaSQL instead of emulating them |
| `--casesensitive` | Keep AlaSQL's default, where names are case-sensitive |
| `--setup` | Print every failed setup statement, not a sample |

`ALASQL=path/to/alasql.fs.js yarn test` tests another build (for example a local `dist/`); by default the npm package.

## How it runs

PostgreSQL runs each test script with `psql -a` and compares the whole output with `expected/<name>.out`. That file is the script, echoed line by line, with the output of each statement after it. The runner reads it back the same way.

1. **Expected results.** `runner/psql.js` splits the script into statements and psql commands (`\set`, `\pset`, ...), walks the expected output along the echoed lines, and gives each statement its output: a table, an `ERROR:`, or nothing. NOTICE and WARNING lines are not compared. 238 of the 241 scripts line up to the end; output the runner cannot read (another `\pset` format, `\d` describe output) is "not checked".
2. **Setup.** `test_setup.sql` runs before every file, in a fresh database. It creates and loads `onek`, `tenk1`, `INT4_TBL` and the other shared tables.
3. **Test files.** The files of `parallel_schedule` run in parallel, each from the state after the setup. Most PostgreSQL tests need only `test_setup`; the few that use a table from an earlier test in the schedule fail here where they find it missing.
4. **Checks.** Every SQL statement is one check: the same rows (values as psql prints them, numbers compared as numbers, rows in any order unless the statement has `ORDER BY`), an error where PostgreSQL gives one (the message is not compared), or no error. Column names are not compared.
5. **Score.** A statement passes, fails, is "not checked" (expected output the runner does not read) or "not run" (it comes after an error inside a transaction, where PostgreSQL refuses every statement until `ROLLBACK`). Only passed and failed statements count.

What the runner does besides sending the statements to AlaSQL (everything else goes to AlaSQL as written, so its answer is AlaSQL's own):

| PostgreSQL | What the runner does |
|---|---|
| psql variables: `\set`, `\getenv`, `\gset`, `:name`, `:'name'`, `:"name"` | kept by the runner and put into the statements, as psql does; `abs_srcdir` is the `pg/` folder |
| `\pset null 'text'` | NULL is printed as that text when results are compared |
| other psql commands (`\d`, `\x`, `\c`, ...) | not run; their output is not compared |
| `COPY t FROM 'file'` and `COPY t FROM stdin` (text or CSV) | read by the runner and sent to AlaSQL as `INSERT INTO t (...) VALUES ...`, numbers as numbers; other `COPY` forms go to AlaSQL as written |
| `BEGIN`, `COMMIT`, `END`, `ROLLBACK`, `ABORT`, `SAVEPOINT`, `RELEASE`, `ROLLBACK TO` | emulated, because AlaSQL's in-memory `ROLLBACK` changes nothing: table contents are saved and put back; after DDL the runner rebuilds from the setup and replays the committed statements. `--native-transactions` turns this off |
| unquoted names are folded to lower case | AlaSQL's own option `casesensitive: false` (the runner sets it) |

## Licence

The files in `pg/` are part of PostgreSQL: Portions Copyright (c) 1996-2026, PostgreSQL Global Development Group, Portions Copyright (c) 1994, The Regents of the University of California. They are distributed under the PostgreSQL Licence in `pg/COPYRIGHT`. They are unchanged; `pg/SOURCE` names the commit they come from. The runner is MIT licensed.
