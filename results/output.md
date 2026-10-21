# PostgreSQL regression test results for AlaSQL

`2026-10-21T12:28:37.951Z target: alasql@4.21.0`

PostgreSQL regression tests (src/test/regress, postgres/postgres@6b9f40d49ae33eb0b4a7c77666fe4971ef7ba087): 238 test files from parallel_schedule, each run after test_setup, transactions emulated by the runner, `casesensitive: false`.

## Setup

`pg/sql/test_setup.sql`: 68 statements, 42 failed.

| Failure | Statements |
|---|---|
| VACUUM ANALYZE: Parse error | 11 |
| CREATE TABLE: Parse error | 7 |
| CREATE FUNCTION: Parse error | 5 |
| CREATE TYPE: Parse error | 3 |
| INSERT INTO: Parse error | 2 |
| CREATE OPERATOR: Parse error | 2 |
| GRANT ALL: Parse error | 1 |
| CREATE TABLESPACE: Parse error | 1 |
| VACUUM CHAR_TBL: Parse error | 1 |
| VACUUM FLOAT8_TBL: Parse error | 1 |
| VACUUM INT2_TBL: Parse error | 1 |
| VACUUM INT4_TBL: Parse error | 1 |
| VACUUM INT8_TBL: Parse error | 1 |
| VACUUM TEXT_TBL: Parse error | 1 |
| VACUUM VARCHAR_TBL: Parse error | 1 |
| COPY EMP: relation … does not exist | 1 |
| COPY STUDENT: relation … does not exist | 1 |
| COPY STUD_EMP: relation … does not exist | 1 |

```sql
GRANT ALL ON SCHEMA public TO public;

test_setup.sql:24
=> Parse error on line 1: GRANT ALL ON SCHEMA public ------^ Expecting 'EOF', 'COMMA', 'LPAR', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'ALL'
```

```sql
CREATE TABLESPACE regress_tblspace LOCATION '';

test_setup.sql:28
=> Parse error on line 1: CREATE TABLESPACE regress_tblspace LOC ------------------^ Expecting 'DATABASE', got 'LITERAL'
```

```sql
VACUUM CHAR_TBL;

test_setup.sql:45
=> Parse error on line 1: VACUUM CHAR_TBL; -------^ Expecting 'EOF', 'COMMA', 'LPAR', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'LITERAL'
```

```sql
VACUUM FLOAT8_TBL;

test_setup.sql:55
=> Parse error on line 1: VACUUM FLOAT8_TBL; -------^ Expecting 'EOF', 'COMMA', 'LPAR', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'LITERAL'
```

```sql
VACUUM INT2_TBL;

test_setup.sql:65
=> Parse error on line 1: VACUUM INT2_TBL; -------^ Expecting 'EOF', 'COMMA', 'LPAR', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'LITERAL'
```

```sql
VACUUM INT4_TBL;

test_setup.sql:75
=> Parse error on line 1: VACUUM INT4_TBL; -------^ Expecting 'EOF', 'COMMA', 'LPAR', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'LITERAL'
```

```sql
VACUUM INT8_TBL;

test_setup.sql:85
=> Parse error on line 1: VACUUM INT8_TBL; -------^ Expecting 'EOF', 'COMMA', 'LPAR', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'LITERAL'
```

```sql
VACUUM TEXT_TBL;

test_setup.sql:107
=> Parse error on line 1: VACUUM TEXT_TBL; -------^ Expecting 'EOF', 'COMMA', 'LPAR', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'LITERAL'
```

```sql
VACUUM VARCHAR_TBL;

test_setup.sql:116
=> Parse error on line 1: VACUUM VARCHAR_TBL; -------^ Expecting 'EOF', 'COMMA', 'LPAR', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'LITERAL'
```

```sql
VACUUM ANALYZE onek;

test_setup.sql:139
=> Parse error on line 1: VACUUM ANALYZE onek; -------^ Expecting 'EOF', 'COMMA', 'LPAR', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'LITERAL'
```

```sql
CREATE TABLE onek2 AS SELECT * FROM onek;

test_setup.sql:141
=> Parse error on line 1: CREATE TABLE onek2 AS SELECT * FROM one -------------------^ Expecting 'EOF', 'LPAR', 'END', 'ELSE', 'GO', 'SEMICOLON', got 'AS'
```

```sql
COPY emp FROM '/Users/mwulff/git/alasql-pgsqltest/pg/data/emp.data';

test_setup.sql:186
=> relation "emp" does not exist
```

```sql
COPY student FROM '/Users/mwulff/git/alasql-pgsqltest/pg/data/student.data';

test_setup.sql:194
=> relation "student" does not exist
```

```sql
COPY stud_emp FROM '/Users/mwulff/git/alasql-pgsqltest/pg/data/stud_emp.data';

test_setup.sql:202
=> relation "stud_emp" does not exist
```

```sql
INSERT INTO ihighway SELECT * FROM ONLY road WHERE name ~ 'I- .*';

test_setup.sql:216
=> Parse error on line 3: ... SELECT * FROM ONLY road WHERE n ----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'LPAR', 'DOLLAR', 'AT', 'COLON', 'IF', 'QUESTION', 'INSERTED', 'CURRENT_DATE', 'REPLACE', 'DATEADD', 'DATEDIFF', 'TIMESTAMPDIFF', 'INTERVAL', 'S…
```

```sql
create type stoplight as enum ('red', 'yellow', 'green');

test_setup.sql:236
=> Parse error on line 1: create type stoplight as enum (' ------------^ Expecting 'DATABASE', got 'LITERAL'
```

```sql
CREATE FUNCTION binary_coercible(oid, oid) RETURNS bool AS '/Users/mwulff/git/alasql-pgsqltest/pg/regress.so', 'binary_coercible' LANGUAGE C STRICT STABLE PARALLEL SAFE;

test_setup.sql:250
=> Parse error on line 1: ...ION binary_coercible(oid, oid) RETUR -----------------------^ Expecting 'AS', got 'LPAR'
```

```sql
create operator class part_test_int4_ops for type int4 using hash as operator 1 =, function 2 part_hashint4_noop(int4, int8);

test_setup.sql:265
=> Parse error on line 1: create operator class part_test_int4 ----------------^ Expecting 'DATABASE', got 'CLASS'
```

_The first failure of each kind is shown; run with --setup to see every failed statement_


---- ---- ---- ---- ---- ---- ----
### 1/238 `pg/sql/varchar.sql`

```sql
CREATE TEMP TABLE VARCHAR_TBL(f1 varchar(1));

line 10 => error: Can not create table 'varchar_tbl', because it already exists in the database 'alasql'
```

```sql
INSERT INTO VARCHAR_TBL (f1) VALUES ('cd');

line 27 => expected an error (value too long for type character varying(1)), got success
```

```sql
SELECT * FROM VARCHAR_TBL;

line 31 => expected 7 rows, got 12
```

```sql
SELECT c.* FROM VARCHAR_TBL c WHERE c.f1 <= 'a';

line 45 => rows differ (in any order): expected 2, got 3
```

```sql
SELECT * FROM VARCHAR_TBL;

line 68 => error: Table does not exist: varchar_tbl
```

```sql
SELECT pg_input_is_valid('abcd ', 'varchar(4)');

line 71 => error: alasql.fn["pg_input_is_valid"] is not a function. (In 'alasql.fn["pg_input_is_valid"]('abcd ','varchar(4)')', 'alasql.fn["pg_input_is_valid"]' is undefined)
```

```sql
SELECT * FROM pg_input_error_info('abcde', 'varchar(4)');

line 73 => error: alasql.from["PG_INPUT_ERROR_INFO"] is not a function. (In 'alasql.from["PG_INPUT_ERROR_INFO"]('abcde','varchar(4)',cb,idx,query)', 'alasql.from["PG_INPUT_ERROR_INFO"]' is undefined)
```

#### ☓ Ran 22 statements

* 13 failed
* 40% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 2/238 `pg/sql/name.sql`

```sql
SELECT name 'name string' = name 'name string' AS "True";

line 7 => error: Parse error on line 1: ... name 'name string' = name 'name string' -----------------------^ Expecting 'EOF', 'WITH', 'COMMA', 'RPAR', 'PIVOT', 'UNPIVOT', 'REMOVE', 'ORDER', 'WHERE', 'UNION', 'INTERSECT', 'EXCEPT', 'FROM', 'INTO', 'GROUP', 'LIMIT', 'OFFSET', 'END', 'ELSE', 'OUTPUT', 'GO', 'SE…
```

#### ☓ Ran 40 statements

* 17 failed
* 57% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 3/238 `pg/sql/char.sql`

#### ☓ Ran 32 statements

* 23 failed
* 28% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 4/238 `pg/sql/int2.sql`

```sql
SELECT (-32768)::int2 * (-1)::int2;

line 95 => expected an error (smallint out of range), got 1 rows
```

```sql
SELECT int2 '0b100101';

line 122 => error: undefined is not an object (evaluating 'query.sources[0].databaseid')
```

```sql
SELECT int2 '0x7FFF';

line 135 => error: undefined is not an object (evaluating 'query.sources[0].databaseid')
```

#### ☓ Ran 76 statements

* 56 failed
* 26% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 5/238 `pg/sql/text.sql`

#### ☓ Ran 74 statements

* 58 failed
* 21% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 6/238 `pg/sql/int4.sql`

```sql
SELECT i.f1, i.f1 / int2 '2' AS x FROM INT4_TBL i;

line 86 => error: Parse error on line 1: ...f1, i.f1 / int2 '2' AS x FROM INT4_TBL i -----------------------^ Expecting 'EOF', 'WITH', 'COMMA', 'RPAR', 'PIVOT', 'UNPIVOT', 'REMOVE', 'ORDER', 'WHERE', 'UNION', 'INTERSECT', 'EXCEPT', 'FROM', 'INTO', 'GROUP', 'LIMIT', 'OFFSET', 'END', 'ELSE', 'OUTPUT', 'GO', 'SE…
```

#### ☓ Ran 101 statements

* 64 failed
* 36% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 7/238 `pg/sql/boolean.sql`

```sql
SELECT d, b IS TRUE AS istrue, b IS NOT TRUE AS isnottrue, b IS FALSE AS isfalse, b IS NOT FALSE AS isnotfalse, b IS UNKNOWN AS isunknown, b IS NOT UNKNOWN AS isnotunknown FROM booltbl3 ORDER BY o;

line 217 => row 2 differs: expected false | f | t | t | f | f | t, got false | f | t | t | f | f | f
```

#### ☓ Ran 98 statements

* 60 failed
* 38% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 8/238 `pg/sql/int8.sql`

```sql
SELECT pg_input_is_valid('asdf', 'int8');

line 21 => error: alasql.fn["pg_input_is_valid"] is not a function. (In 'alasql.fn["pg_input_is_valid"]('asdf','int8')', 'alasql.fn["pg_input_is_valid"]' is undefined)
```

```sql
SELECT * FROM generate_series('+4567890123456789'::int8, '+4567890123456799'::int8);

line 200 => error: alasql.from["GENERATE_SERIES"] is not a function. (In 'alasql.from["GENERATE_SERIES"](alasql.stdfn.CONVERT('+4567890123456789', { dbtypeid: "int8", dbsize: undefined, dbprecision: undefined, style: undefined }),alasql.stdfn.CONVERT('+4567890123456799', { dbtypeid: "int8", dbsize: undefined, …
```

#### ☓ Ran 174 statements

* 137 failed
* 1 not checked (expected output the runner does not read)
* 20% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 9/238 `pg/sql/oid.sql`

#### ☓ Ran 38 statements

* 28 failed
* 26% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 10/238 `pg/sql/float4.sql`

```sql
SELECT f.f1, f.f1 + '-10' AS x FROM FLOAT4_TBL f WHERE f.f1 > '0.0';

line 80 => expected 3 rows, got 14
```

#### ☓ Ran 100 statements

* 87 failed
* 13% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 11/238 `pg/sql/bit.sql`

```sql
SELECT POSITION(B'111010110' IN B'0000011101011111010110');

line 162 => error: Parse error on line 1: SELECT POSITION(B'111010110' IN B'000 -----------------^ Expecting 'EOF', 'COMMA', 'RPAR', 'IN', 'LIKE', 'ARROW', 'DOT', 'CARET', 'EQ', 'SLASH', 'EXCLAMATION', 'MODULO', 'GT', 'LT', 'GTGT', 'LTLT', 'NOT', 'AND', 'OR', 'PLUS', 'STAR', 'RBRA', 'END', 'ELSE', 'REGEXP', 'T…
```

```sql
INSERT INTO bit_defaults DEFAULT VALUES;

line 239 => error: Table 'bit_defaults' could not be found
```

#### ☓ Ran 132 statements

* 103 failed
* 21% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 12/238 `pg/sql/float8.sql`

```sql
SELECT power(float8 '144', float8 'NaN');

line 131 => error: Parse error on line 1: SELECT power(float8 '144', float8 'NaN') --------------------^ Expecting 'EOF', 'COMMA', 'RPAR', 'IN', 'LIKE', 'ARROW', 'DOT', 'CARET', 'EQ', 'SLASH', 'EXCLAMATION', 'MODULO', 'GT', 'LT', 'GTGT', 'LTLT', 'NOT', 'AND', 'OR', 'PLUS', 'STAR', 'RBRA', 'END', 'ELSE', 'REGEX…
```

#### ☓ Ran 184 statements

* 151 failed
* 17% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 13/238 `pg/sql/uuid.sql`

```sql
INSERT INTO guid1(guid_field) VALUES('111-11111-1111-1111-1111-111111111111');

line 26 => expected an error (invalid input syntax for type uuid: "111-11111-1111-1111-1111-111111111111"), got success
```

```sql
DROP TABLE guid1, guid2, guid3 CASCADE;

line 206 => error: Parsing halted while starting to recover from another error.
```

#### ☓ Ran 92 statements

* 76 failed
* 17% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 14/238 `pg/sql/money.sql`

```sql
SELECT cash_words(m) FROM money_data;

line 49 => error: alasql.fn["cash_words"] is not a function. (In 'alasql.fn["cash_words"](p['money_data']['m'])', 'alasql.fn["cash_words"]' is undefined)
```

#### ☓ Ran 113 statements

* 92 failed
* 18% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 15/238 `pg/sql/pg_lsn.sql`

#### ☓ Ran 31 statements

* 24 failed
* 22% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 16/238 `pg/sql/regproc.sql`

```sql
SELECT to_regprocedure('abs(numeric)');

line 22 => error: alasql.fn["to_regprocedure"] is not a function. (In 'alasql.fn["to_regprocedure"]('abs(numeric)')', 'alasql.fn["to_regprocedure"]' is undefined)
```

```sql
SELECT * FROM pg_input_error_info('ng_catalog.abs(numeric', 'regprocedure');

line 184 => error: alasql.from["PG_INPUT_ERROR_INFO"]('ng_catalog.abs is not a function. (In 'alasql.from["PG_INPUT_ERROR_INFO"]('ng_catalog.abs(numeric','regprocedure',cb,idx,query)', 'alasql.from["PG_INPUT_ERROR_INFO"]('ng_catalog.abs' is undefined)
```

#### ☓ Ran 136 statements

* 106 failed
* 22% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 17/238 `pg/sql/md5.sql`

```sql
select md5('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') = 'd174ab98d277d9f5a5611c2c9f419d9f' AS "TRUE";

line 20 => error: alasql.fn["md5"] is not a function. (In 'alasql.fn["md5"]('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')', 'alasql.fn["md5"]' is undefined)
```

#### ☓ Ran 14 statements

* 14 failed
* 0% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 18/238 `pg/sql/rangetypes.sql`

```sql
select range_intersect_agg(nr) from numrange_test;

line 142 => error: alasql.fn["range_intersect_agg"] is not a function. (In 'alasql.fn["range_intersect_agg"](p['numrange_test']['nr'])', 'alasql.fn["range_intersect_agg"]' is undefined)
```

```sql
select int4range(1, 10, '[)');

line 211 => error: undefined is not a function (near '...alasql.fn["int4range"](1,10,'[)')...')
```

```sql
select daterange('2000-01-10'::date, '2000-01-20'::date, '[)');

line 218 => error: undefined is not a function (near '...alasql.fn["daterange"](alasql.stdfn.CONVERT('2000-01-10', { dbtypeid: "date", dbsize: undefined, dbprecision: undefined, style: undefined }),alasql.stdfn.CONVERT('2000-01-20', { dbtypeid: "date", dbsize: undefined, dbprecision: undefined, style: undefine…
```

```sql
select daterange('2000-01-10'::date, '2000-01-20'::date, '(]');

line 219 => error: alasql.fn["daterange"](alasql.stdfn.CONVERT('2000-01-10', { dbtypeid: "date", dbsize: undefined, dbprecision: undefined, style: undefined }),alasql.stdfn.CONVERT('2000-01-20', { dbtypeid: "date", dbsize: undefined, dbprecision: undefined, style: undefined }),' is not a function. (In 'alasql.…
```

```sql
select count(*) from test_range_gist where ir &> int4range(100,500);

line 311 => error: Parse error on line 1: ...ange_gist where ir &> int4range(100,500) -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'LPAR', 'NUMBER', 'SHARP', 'DOLLAR', 'AT', 'VALUE', 'COLON', 'NOT', 'IF', 'PLUS', 'STAR', 'QUESTION', 'INSERTED', 'FIRST', 'LAST…
```

```sql
select anyarray_anyrange_func(ARRAY[1,2], int4range(10,20));

line 514 => error: alasql.fn["int4range"] is not a function. (In 'alasql.fn["int4range"](10,20)', 'alasql.fn["int4range"]' is undefined)
```

```sql
drop table text_support_test;

line 722 => error: Can not drop table "text_support_test" because it does not exist in the database.
```

#### ☓ Ran 428 statements

* 345 failed
* 19% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 19/238 `pg/sql/numerology.sql`

```sql
SELECT f1 FROM TEMP_INT4 ORDER BY f1;

line 131 => expected 9 rows, got 0
```

#### ☓ Ran 89 statements

* 55 failed
* 38% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 20/238 `pg/sql/point.sql`

```sql
INSERT INTO POINT_TBL(f1) VALUES ('(10.0,10.0');

line 17 => expected an error (invalid input syntax for type point: "(10.0,10.0"), got success
```

#### ☓ Ran 43 statements

* 38 failed
* 11% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 21/238 `pg/sql/line.sql`

#### ☓ Ran 35 statements

* 24 failed
* 31% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 22/238 `pg/sql/lseg.sql`

#### ☓ Ran 16 statements

* 8 failed
* 50% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 23/238 `pg/sql/strings.sql`

```sql
SELECT reverse('\xabcd'::bytea);

line 74 => error: alasql.fn["reverse"] is not a function. (In 'alasql.fn["reverse"](alasql.stdfn.CONVERT('\\xabcd', { dbtypeid: "bytea", dbsize: undefined, dbprecision: undefined, style: undefined }))', 'alasql.fn["reverse"]' is undefined)
```

```sql
SELECT regexp_like('abc', ' a . c ', 'x');

line 277 => error: Invalid flags supplied to RegExp constructor.
```

```sql
SELECT regexp_instr('1234567890', '(123)(4(56)(78))', 1, 1, 0, 'i', 4);

line 292 => error: alasql.fn["regexp_instr"] is not a function. (In 'alasql.fn["regexp_instr"]('1234567890','(123)(4(56)(78))',1,1,0,'i',4)', 'alasql.fn["regexp_instr"]' is undefined)
```

```sql
TRUNCATE TABLE toasttest_oid;

line 608 => error: Cannot truncate table becaues it does not exist
```

```sql
SELECT pg_relation_size(reltoastrelid) = 0 AS is_empty FROM pg_class where relname = 'toasttest_oid';

line 623 => error: Table does not exist: pg_class
```

```sql
SELECT count(*) FROM :upd_oid8_toast WHERE chunk_seq = 0;

line 757 => error: Data source number 0 in undefined
```

```sql
SELECT strpos('abcdef', 'cd') AS "pos_3";

line 876 => error: alasql.fn["strpos"] is not a function. (In 'alasql.fn["strpos"]('abcdef','cd')', 'alasql.fn["strpos"]' is undefined)
```

```sql
SELECT get_bit('\x1234567890abcdef00'::bytea, 43);

line 1111 => error: alasql.fn["get_bit"] is not a function. (In 'alasql.fn["get_bit"](alasql.stdfn.CONVERT('\\x1234567890abcdef00', { dbtypeid: "bytea", dbsize: undefined, dbprecision: undefined, style: undefined }),43)', 'alasql.fn["get_bit"]' is undefined)
```

#### ☓ Ran 665 statements

* 480 failed
* 9 not run (inside a transaction that had an error)
* 26% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 24/238 `pg/sql/box.sql`

```sql
INSERT INTO BOX_TBL (f1) VALUES ('(1, 2, 3, 4]');

line 42 => expected an error (invalid input syntax for type box: "(1, 2, 3, 4]"), got success
```

```sql
INSERT INTO BOX_TBL (f1) VALUES ('asdfasdf(ad');

line 46 => expected an error (invalid input syntax for type box: "asdfasdf(ad"), got success
```

```sql
SELECT * FROM box_temp WHERE f1 |>> '(37,38),(39,40)';

line 176 => error: Parse error on line 1: ... box_temp WHERE f1 |>> '(37,38),(39,40)' -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'LPAR', 'NUMBER', 'SHARP', 'DOLLAR', 'AT', 'VALUE', 'COLON', 'NOT', 'IF', 'PLUS', 'STAR', 'QUESTION', 'INSERTED', 'FIRST', 'LAST…
```

#### ☓ Ran 101 statements

* 81 failed
* 19% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 25/238 `pg/sql/path.sql`

```sql
INSERT INTO PATH_TBL VALUES ('(1,2,3,4');

line 34 => expected an error (invalid input syntax for type path: "(1,2,3,4"), got success
```

```sql
SELECT f1 AS open_path FROM PATH_TBL WHERE isopen(f1);

line 38 => error: Column does not exist: f1
```

#### ☓ Ran 23 statements

* 13 failed
* 43% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 26/238 `pg/sql/polygon.sql`

```sql
INSERT INTO POLYGON_TBL(f1) VALUES ('(0.0 0.0');

line 26 => expected an error (invalid input syntax for type polygon: "(0.0 0.0"), got success
```

#### ☓ Ran 62 statements

* 44 failed
* 29% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 27/238 `pg/sql/circle.sql`

```sql
INSERT INTO CIRCLE_TBL VALUES ('1abc,3,5');

line 35 => expected an error (invalid input syntax for type circle: "1abc,3,5"), got success
```

```sql
INSERT INTO CIRCLE_TBL VALUES ('(3,(1,2),3)');

line 37 => expected an error (invalid input syntax for type circle: "(3,(1,2),3)"), got success
```

#### ☓ Ran 22 statements

* 12 failed
* 45% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 28/238 `pg/sql/time.sql`

#### ☓ Ran 44 statements

* 26 failed
* 40% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 29/238 `pg/sql/date.sql`

```sql
SELECT date '01 08 1999';

line 135 => error: undefined is not an object (evaluating 'query.sources[0].databaseid')
```

```sql
SELECT DATE_TRUNC('CENTURY', DATE '1970-03-20');

line 318 => error: Parse error on line 1: ...UNC('CENTURY', DATE '1970-03-20'); -----------------------^ Expecting 'EOF', 'COMMA', 'RPAR', 'IN', 'LIKE', 'ARROW', 'DOT', 'CARET', 'EQ', 'SLASH', 'EXCLAMATION', 'MODULO', 'GT', 'LT', 'GTGT', 'LTLT', 'NOT', 'AND', 'OR', 'PLUS', 'STAR', 'RBRA', 'END', 'ELSE', 'REGEX…
```

#### ☓ Ran 271 statements

* 198 failed
* 26% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 30/238 `pg/sql/txid.sql`

#### ☓ Ran 47 statements

* 19 failed
* 9 not run (inside a transaction that had an error)
* 50% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 31/238 `pg/sql/enum.sql`

```sql
alter type insenum add value 'i28' before 'L2';

line 117 => error: Parse error on line 1: alter type insenum add val ------^ Expecting 'TABLE', got 'LITERAL'
```

```sql
SELECT 'red' = ANY ('{red,green,blue}'::rainbow[]);

line 213 => error: y[0].some is not a function. (In 'y[0].some(function(b){return (y[1])===b})', 'y[0].some' is undefined)
```

```sql
SELECT 'red' = ALL ('{red,green,blue}'::rainbow[]);

line 215 => error: y[0].every is not a function. (In 'y[0].every(function(b){return (y[1])===b})', 'y[0].every' is undefined)
```

#### ☓ Ran 171 statements

* 112 failed
* 1 not checked (expected output the runner does not read)
* 17 not run (inside a transaction that had an error)
* 26% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 32/238 `pg/sql/macaddr.sql`

#### ☓ Ran 35 statements

* 13 failed
* 62% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 33/238 `pg/sql/interval.sql`

```sql
INSERT INTO INTERVAL_TBL (f1) VALUES ('-infinity');

line 33 => error: Table 'interval_tbl' could not be found
```

```sql
COPY INTERVAL_MULDIV_TBL FROM STDIN;

line 127 => error: relation "INTERVAL_MULDIV_TBL" does not exist
```

```sql
SELECT interval '-23 hours 45 min 12.34 sec', interval '-1 day 23 hours 45 min 12.34 sec', interval '-1 year 2 months 1 day 23 hours 45 min 12.34 sec', interval '-1 year 2 months 1 day 23 hours 45 min +12.34 sec';

line 297 => error: Parse error on line 1: ...rs 45 min 12.34 sec', interval ' -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'IN', 'LIKE', 'ARROW', 'DOT', 'CARET', 'EQ', 'SLASH', 'EXCLAMATION', 'MODULO', 'GT', 'LT', 'GTGT', 'LTLT', 'NOT', 'AND', 'OR', 'PLUS', '…
```

#### ☓ Ran 446 statements

* 207 failed
* 53% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 34/238 `pg/sql/timetz.sql`

```sql
SELECT f1 AS "None" FROM TIMETZ_TBL WHERE f1 < '00:00-07';

line 34 => error: Table does not exist: timetz_tbl
```

#### ☓ Ran 57 statements

* 45 failed
* 4 not run (inside a transaction that had an error)
* 15% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 35/238 `pg/sql/inet.sql`

```sql
SELECT '127.0.0.1'::inet + 10000000000;

line 157 => expected an error (result is out of range), got 1 rows
```

#### ☓ Ran 116 statements

* 85 failed
* 26% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 36/238 `pg/sql/macaddr8.sql`

#### ☓ Ran 71 statements

* 31 failed
* 56% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 37/238 `pg/sql/timestamp.sql`

```sql
INSERT INTO TIMESTAMP_TBL VALUES ('Feb 15 17:32:01 1997');

line 114 => error: Table 'timestamp_tbl' could not be found
```

#### ☓ Ran 177 statements

* 138 failed
* 12 not run (inside a transaction that had an error)
* 16% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 38/238 `pg/sql/geometry.sql`

```sql
SELECT p.f1, b.f1, p.f1 <-> b.f1 AS dist_pb, b.f1 <-> p.f1 AS dist_bp FROM POINT_TBL p, BOX_TBL b;

line 80 => error: Parse error on line 1: ...T p.f1, b.f1, p.f1 <-> b.f1 AS dist_pb, -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'LPAR', 'NUMBER', 'SHARP', 'DOLLAR', 'AT', 'VALUE', 'COLON', 'NOT', 'IF', 'ALL', 'ANY', 'PLUS', 'STAR', 'QUESTION', 'INSERTED', '…
```

```sql
SELECT c1.f1, c2.f1 FROM CIRCLE_TBL c1, CIRCLE_TBL c2 WHERE c1.f1 &< c2.f1;

line 427 => error: Parse error on line 1: ...TBL c2 WHERE c1.f1 &< c2.f1; -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'LPAR', 'NUMBER', 'SHARP', 'DOLLAR', 'AT', 'VALUE', 'COLON', 'NOT', 'IF', 'PLUS', 'STAR', 'QUESTION', 'INSERTED', 'FIRST', 'LAST', 'DELETED'…
```

#### ☓ Ran 162 statements

* 152 failed
* 6% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 39/238 `pg/sql/tstypes.sql`

```sql
SELECT 'a | ff' < 'b & c'::tsquery as "false";

line 86 => rows differ (in any order): expected f, got t
```

```sql
SELECT ts_rank_cd(' a:1 sa:2C d g'::tsvector, 'a | s');

line 203 => error: alasql.fn["ts_rank_cd"] is not a function. (In 'alasql.fn["ts_rank_cd"](alasql.stdfn.CONVERT(' a:1 sa:2C d g', { dbtypeid: "tsvector", dbsize: undefined, dbprecision: undefined, style: undefined }),'a | s')', 'alasql.fn["ts_rank_cd"]' is undefined)
```

#### ☓ Ran 238 statements

* 227 failed
* 4% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 40/238 `pg/sql/horology.sql`

```sql
SELECT time with time zone '040506.789-08';

line 53 => error: Parse error on line 1: SELECT time with time zone '0405 ------------^ Expecting 'EOF', 'END', 'ELSE', 'GO', 'SEMICOLON', got 'WITH'
```

```sql
SELECT (timestamp with time zone '2000-11-26', timestamp with time zone '2000-11-27') OVERLAPS (timestamp with time zone '2000-11-27 12:00', timestamp with time zone '2000-11-30') AS "False";

line 266 => error: Parse error on line 1: SELECT (timestamp with time zone '2000 ------------------^ Expecting 'RPAR', 'IN', 'LIKE', 'ARROW', 'DOT', 'CARET', 'EQ', 'SLASH', 'EXCLAMATION', 'MODULO', 'GT', 'LT', 'GTGT', 'LTLT', 'NOT', 'AND', 'OR', 'PLUS', 'STAR', 'REGEXP', 'TILDA', 'GLOB', 'NOT_LIKE', 'BARBAR', …
```

```sql
SELECT to_timestamp('2011-12-18 11:38 P.M.', 'YYYY-MM-DD HH12:MI P.M.');

line 533 => error: alasql.fn["to_timestamp"] is not a function. (In 'alasql.fn["to_timestamp"]('2011-12-18 11:38 P.M.','YYYY-MM-DD HH12:MI P.M.')', 'alasql.fn["to_timestamp"]' is undefined)
```

#### ☓ Ran 399 statements

* 317 failed
* 20% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 41/238 `pg/sql/regex.sql`

```sql
select regexp_matches('b', 'a*(?<!a)b+');

line 49 => error: alasql.fn["regexp_matches"] is not a function. (In 'alasql.fn["regexp_matches"]('b','a*(?<!a)b+')', 'alasql.fn["regexp_matches"]' is undefined)
```

#### ☓ Ran 104 statements

* 61 failed
* 41% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 42/238 `pg/sql/multirangetypes.sql`

```sql
select '{(],a)}'::textmultirange;

line 19 => expected an error (malformed range literal: "(]"), got 1 rows
```

```sql
INSERT INTO nummultirange_test VALUES(nummultirange(numrange(1.7, 1.7, '[]'), numrange(1.7, 1.9)));

line 111 => error: alasql.fn["numrange"] is not a function. (In 'alasql.fn["numrange"](1.7,1.7,'[]')', 'alasql.fn["numrange"]' is undefined)
```

```sql
SELECT nummultirange() <@ nummultirange();

line 229 => error: Parse error on line 1: ...e() <@ nummultirange(); -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'EOF', 'WITH', 'COMMA', 'AS', 'RPAR', 'PIVOT', 'UNPIVOT', 'IN', 'REMOVE', 'LIKE', 'ARROW', 'DOT', 'ORDER', 'CARET', 'EQ', 'WHERE', 'NUMBER', 'SLA…
```

```sql
select numrange(1,2) << nummultirange();

line 341 => error: alasql.fn["numrange"] is not a function. (In 'alasql.fn["numrange"](1,2)', 'alasql.fn["numrange"]' is undefined)
```

```sql
SELECT '{[1,4), [7,10)}'::nummultirange * '{[0,2), [3,8), [9,12)}'::nummultirange;

line 453 => rows differ (in any order): expected {[1,2),[3,4),[7,8),[9,10)}, got ''
```

```sql
INSERT INTO nummultirange_test2 VALUES(nummultirange(numrange(1.1, 2.2)));

line 636 => error: alasql.fn["numrange"] is not a function. (In 'alasql.fn["numrange"](1.1,2.2)', 'alasql.fn["numrange"]' is undefined)
```

#### ☓ Ran 638 statements

* 552 failed
* 13% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 43/238 `pg/sql/numeric.sql`

```sql
INSERT INTO num_result SELECT id, 0, LN(ABS(val)) FROM num_data WHERE val != '0.0';

line 605 => error: alasql.fn["ln"] is not a function. (In 'alasql.fn["ln"](Math.abs(p['num_data']['val']))', 'alasql.fn["ln"]' is undefined)
```

```sql
SELECT to_char(val, '9G999G999G999G999G999') FROM num_data;

line 972 => error: alasql.fn["to_char"] is not a function. (In 'alasql.fn["to_char"](p['num_data']['val'],'9G999G999G999G999G999')', 'alasql.fn["to_char"]' is undefined)
```

```sql
INSERT INTO num_input_test(n1) VALUES ('1.2e34_');

line 1178 => expected an error (invalid input syntax for type numeric: "1.2e34_"), got success
```

```sql
select ln(0.0456789);

line 1404 => error: alasql.fn["ln"] is not a function. (In 'alasql.fn["ln"](0.0456789)', 'alasql.fn["ln"]' is undefined)
```

#### ☓ Ran 1,062 statements

* 372 failed
* 1 not checked (expected output the runner does not read)
* 6 not run (inside a transaction that had an error)
* 64% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 44/238 `pg/sql/misc_sanity.sql`

#### ☓ Ran 5 statements

* 5 failed
* 0% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 45/238 `pg/sql/comments.sql`

#### ☓ Ran 7 statements

* 2 failed
* 71% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 46/238 `pg/sql/timestamptz.sql`

```sql
INSERT INTO TIMESTAMPTZ_TBL VALUES ('2000-03-15 02:14:05 MST+7:00');

line 80 => error: Table 'timestamptz_tbl' could not be found
```

```sql
SELECT d1 as timestamptz, date_part( 'year', d1) AS year, date_part( 'month', d1) AS month, date_part( 'day', d1) AS day, date_part( 'hour', d1) AS hour, date_part( 'minute', d1) AS minute, date_part( 'second', d1) AS second FROM TIMESTAMPTZ_TBL;

line 294 => error: Table does not exist: timestamptz_tbl
```

```sql
SELECT '2011-03-27 02:00:00'::timestamp AT TIME ZONE 'Europe/Moscow';

line 562 => rows differ (in any order): expected Sat Mar 26 23:00:00 2011 UTC, got 2011-03-27 02:00:00
```

#### ☓ Ran 404 statements

* 313 failed
* 24 not run (inside a transaction that had an error)
* 17% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 47/238 `pg/sql/type_sanity.sql`

```sql
SELECT t1.oid, t1.typname, p1.oid, p1.proname FROM pg_type AS t1, pg_proc AS p1 WHERE t1.typoutput = p1.oid AND p1.provolatile NOT IN ('i', 's');

line 162 => error: Table does not exist: pg_type
```

#### ☓ Ran 68 statements

* 68 failed
* 0% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 48/238 `pg/sql/opr_sanity.sql`

```sql
SELECT p.oid, p.proname, c.oid, c.conname FROM pg_proc p, pg_conversion c WHERE p.oid = c.conproc AND (p.prorettype != 'int4'::regtype OR p.proretset OR p.pronargs != 6 OR p.proargtypes[0] != 'int4'::regtype OR p.proargtypes[1] != 'int4'::regtype OR p.proargtypes[2] != 'cstring'::regtype OR p.proar…

line 533 => error: Parse error on line 6: ...R p.proargtypes[0] != 'int4'::regty ----------------------^ Expecting 'RPAR', 'IN', 'LIKE', 'ARROW', 'DOT', 'CARET', 'EQ', 'SLASH', 'EXCLAMATION', 'MODULO', 'GT', 'LT', 'GTGT', 'LTLT', 'NOT', 'AND', 'OR', 'PLUS', 'STAR', 'REGEXP', 'TILDA', 'GLOB', 'NOT_LIKE', 'BARBA…
```

#### ☓ Ran 131 statements

* 129 failed
* 2 not checked (expected output the runner does not read)
* 0% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 49/238 `pg/sql/unicode.sql`

```sql
SELECT normalize(U&'\D788\11A8', NFC) = U&'\D789' COLLATE "C" AS hangul_lvt_last_lv;

line 47 => error: Parse error on line 1: ...', NFC) = U&'\D789' COLLATE "C" AS hangu -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'EOF', 'WITH', 'COMMA', 'AS', 'RPAR', 'PIVOT', 'UNPIVOT', 'IN', 'REMOVE', 'LIKE', 'ARROW', 'DOT', 'ORDER', 'CARET', 'EQ', 'WHERE…
```

#### ☓ Ran 29 statements

* 27 failed
* 6% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 50/238 `pg/sql/pg_dependencies.sql`

#### ☓ Ran 93 statements

* 92 failed
* 1 not checked (expected output the runner does not read)
* 0% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 51/238 `pg/sql/pg_ndistinct.sql`

```sql
SELECT 'null'::pg_ndistinct;

line 4 => expected an error (malformed pg_ndistinct: "null"), got 1 rows
```

#### ☓ Ran 75 statements

* 73 failed
* 2 not checked (expected output the runner does not read)
* 0% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 52/238 `pg/sql/oid8.sql`

```sql
SELECT btoid8cmp(1::oid8, 2::oid8) < 0 AS val_lower;

line 79 => error: alasql.fn["btoid8cmp"] is not a function. (In 'alasql.fn["btoid8cmp"](alasql.stdfn.CONVERT(1, { dbtypeid: "oid8", dbsize: undefined, dbprecision: undefined, style: undefined }),alasql.stdfn.CONVERT(2, { dbtypeid: "oid8", dbsize: undefined, dbprecision: undefined, style: undefined }))', 'alas…
```

#### ☓ Ran 49 statements

* 32 failed
* 34% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 53/238 `pg/sql/mvcc.sql`

#### ☓ Ran 11 statements

* 1 failed
* 8 not run (inside a transaction that had an error)
* 66% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 54/238 `pg/sql/database.sql`

```sql
DROP DATABASE regression_utf8;

line 22 => error: Database 'regression_utf8' does not exist
```

#### ☓ Ran 16 statements

* 13 failed
* 1 not run (inside a transaction that had an error)
* 13% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 55/238 `pg/sql/euc_kr.sql`

#### ☓ Ran 2 statements

* 2 failed
* 0% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 56/238 `pg/sql/encoding.sql`

#### ☓ Ran 75 statements

* 55 failed
* 26% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 57/238 `pg/sql/copyselect.sql`

The expected output stops matching the script part way; the statements after that point are not checked.

#### ☓ Ran 36 statements

* 1 failed
* 14 not checked (expected output the runner does not read)
* 95% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 58/238 `pg/sql/expressions.sql`

#### ☓ Ran 79 statements

* 22 failed
* 46 not run (inside a transaction that had an error)
* 33% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 59/238 `pg/sql/copyencoding.sql`

```sql
COPY (SELECT E'\u3042') TO '/Users/mwulff/git/alasql-pgsqltest/pg/results/copyencoding_utf8.csv' WITH (FORMAT csv, ENCODING 'UTF8');

line 23 => error: Parse error on line 1: COPY (SELECT E'\u3042') TO ------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', got 'SELECT'
```

```sql
COPY copy_encoding_tab FROM '/Users/mwulff/git/alasql-pgsqltest/pg/results/copyencoding_utf8.csv' WITH (FORMAT csv);

line 40 => error: could not open file "/Users/mwulff/git/alasql-pgsqltest/pg/results/copyencoding_utf8.csv" for reading
```

#### ☓ Ran 27 statements

* 23 failed
* 14% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 60/238 `pg/sql/copydml.sql`

#### ☓ Ran 59 statements

* 33 failed
* 3 not checked (expected output the runner does not read)
* 41% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 61/238 `pg/sql/insert.sql`

```sql
insert into inserttest values (DEFAULT, 7);

line 9 => error: The number of values (2) does not match the number of table columns (3). If using a subquery, use INSERT INTO ... SELECT instead of INSERT INTO ... VALUES (SELECT ...)
```

```sql
insert into inserttestb (f3, f4[1].if2[1], f4[1].if2[2]) select row(1,'{x}')::insert_test_domain, 'bear', 'beer';

line 141 => error: Parse error on line 1: ... inserttestb (f3, f4[1].if2[1], f4[1].if -----------------------^ Expecting 'EOF', 'WITH', 'COMMA', 'RPAR', 'PIVOT', 'UNPIVOT', 'DOT', 'ORDER', 'EQ', 'WHERE', 'UNION', 'INTERSECT', 'EXCEPT', 'FROM', 'INTO', 'CROSS', 'OUTER', 'NATURAL', 'JOIN', 'INNER', 'LEFT', 'RIGH…
```

```sql
alter table mlparted11 drop a;

line 377 => error: Parse error on line 1: ...ble mlparted11 drop a; -----------------------^ Expecting 'COLUMN', got 'LITERAL'
```

```sql
select tableoid::regclass::text, * from mcrparted order by 1;

line 584 => error: Table does not exist: mcrparted
```

#### ☓ Ran 387 statements

* 293 failed
* 24% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 62/238 `pg/sql/create_function_c.sql`

#### ☓ Ran 5 statements

* 2 failed
* 60% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 63/238 `pg/sql/create_misc.sql`

```sql
INSERT INTO f_star (class, e, f) VALUES ('f', '-11'::int2, '(1111111,3333333),(2222222,4444444)'::polygon);

line 155 => error: Parse error on line 1: INSERT INTO f_star (class, e, f) VALU --------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'LPAR', 'SEARCH', 'NUMBER', 'SHARP', 'DOLLAR', 'AT', 'VALUE', 'COLON', 'NOT', 'IF', 'PLUS', 'STAR', 'QUESTION', 'SELECT', 'INSERTED', 'FI…
```

#### ☓ Ran 88 statements

* 88 failed
* 0% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 64/238 `pg/sql/copy.sql`

```sql
copy header_copytest from stdin with (header match);

line 416 => error: Parse error on line 1: copy header_copytest from -----^ Expecting 'EOF', 'COMMA', 'LPAR', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'LITERAL'
```

#### ☓ Ran 191 statements

* 93 failed
* 33 not checked (expected output the runner does not read)
* 4 not run (inside a transaction that had an error)
* 39% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 65/238 `pg/sql/stats_import.sql`

```sql
SELECT * FROM stats_import.pg_stats_stable WHERE schemaname = 'stats_import' AND tablename = 'test' AND inherited = false AND attname = 'id';

line 684 => error: Parse error on line 3: ..._stats_stableWHERE schemaname = 'stats_ ----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'LPAR', 'NUMBER', 'SHARP', 'DOLLAR', 'AT', 'VALUE', 'COLON', 'NOT', 'IF', 'PLUS', 'STAR', 'QUESTION', 'INSERTED', 'FIRST', 'LAST',…
```

```sql
SELECT COUNT(*), e.inherited FROM pg_stats_ext AS e WHERE e.statistics_schemaname = 'stats_import' AND e.statistics_name = 'test_stat' GROUP BY e.inherited;

line 1575 => error: Table does not exist: pg_stats_ext
```

```sql
SELECT pg_catalog.pg_restore_extended_stats( 'schemaname', 'stats_import', 'relname', 'test', 'statistics_schemaname', 'stats_import', 'statistics_name', 'test_stat_mcelem', 'inherited', false, 'exprs', '[ { "most_common_elems": "{-1,0,1,2,3}", "most_common_elem_freqs": null } ]'::jsonb);

line 2557 => error: Parse error on line 1: ...store_extended_stats( 'schemaname', 's -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'EOF', 'WITH', 'COMMA', 'AS', 'RPAR', 'PIVOT', 'UNPIVOT', 'IN', 'REMOVE', 'LIKE', 'ARROW', 'DOT', 'ORDER', 'CARET', 'EQ', 'WHERE',…
```

#### ☓ Ran 389 statements

* 294 failed
* 20 not checked (expected output the runner does not read)
* 6 not run (inside a transaction that had an error)
* 19% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 66/238 `pg/sql/create_schema.sql`

#### ☓ Ran 29 statements

* 14 failed
* 51% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 67/238 `pg/sql/create_type.sql`

#### ☓ Ran 95 statements

* 60 failed
* 36% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 68/238 `pg/sql/xid.sql`

```sql
select ''::xid;

line 14 => expected an error (invalid input syntax for type xid: ""), got 1 rows
```

#### ☓ Ran 84 statements

* 43 failed
* 9 not run (inside a transaction that had an error)
* 42% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 69/238 `pg/sql/create_procedure.sql`

```sql
CALL ptest1(substring(random()::numeric(20,15)::text, 1, 1));

line 26 => error: y.substr is not a function. (In 'y.substr(1-1,1)', 'y.substr' is undefined)
```

```sql
CALL ptest11(null, 11, 12, 13);

line 212 => error: alasql.fn["ptest11"] is not a function. (In 'alasql.fn["ptest11"](undefined,11,12,13)', 'alasql.fn["ptest11"]' is undefined)
```

#### ☓ Ran 109 statements

* 80 failed
* 2 not run (inside a transaction that had an error)
* 25% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 70/238 `pg/sql/create_index_spgist.sql`

```sql
SELECT count(*) FROM kd_point_tbl WHERE p |>> '(5000, 4000)';

line 192 => error: Parse error on line 1: ..._point_tbl WHERE p |>> '(5000, 4000)'; -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'LPAR', 'NUMBER', 'SHARP', 'DOLLAR', 'AT', 'VALUE', 'COLON', 'NOT', 'IF', 'PLUS', 'STAR', 'QUESTION', 'INSERTED', 'FIRST', 'LAST',…
```

```sql
SELECT count(*) FROM radix_text_tbl WHERE t >= 'Worth St ';

line 413 => error: Table does not exist: radix_text_tbl
```

#### ☓ Ran 202 statements

* 192 failed
* 4% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 71/238 `pg/sql/index_including.sql`

```sql
CREATE INDEX nametbl_c1_c2_idx ON nametbl (c2, c1) INCLUDE (c3);

line 225 => error: Parse error on line 1: ...ON nametbl (c2, c1) INCLUDE (c3); -----------------------^ Expecting 'EOF', 'END', 'ELSE', 'GO', 'SEMICOLON', got 'LITERAL'
```

#### ☓ Ran 139 statements

* 90 failed
* 35% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 72/238 `pg/sql/create_table.sql`

```sql
CREATE TABLE range2_default PARTITION OF range_parted2 DEFAULT;

line 474 => error: Parse error on line 1: ...ABLE range2_default PARTITION OF range_p -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'EOF', 'EndTransaction', 'WITH', 'COMMA', 'AS', 'LPAR', 'RPAR', 'SEARCH', 'PIVOT', 'FOR', 'UNPIVOT', 'IN', 'REMOVE', 'LIKE', 'AR…
```

```sql
create index part_column_drop_d_pred on part_column_drop(d) where d = 2;

line 747 => error: Parse error on line 1: ...part_column_drop(d) where d = 2; -----------------------^ Expecting 'EOF', 'END', 'ELSE', 'GO', 'SEMICOLON', got 'WHERE'
```

#### ☓ Ran 334 statements

* 200 failed
* 1 not checked (expected output the runner does not read)
* 3 not run (inside a transaction that had an error)
* 39% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 73/238 `pg/sql/index_including_gist.sql`

#### ☓ Ran 50 statements

* 33 failed
* 34% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 74/238 `pg/sql/create_aggregate.sql`

#### ☓ Ran 60 statements

* 44 failed
* 26% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 75/238 `pg/sql/create_function_sql.sql`

```sql
CREATE FUNCTION functest_C_2(int) RETURNS bool LANGUAGE 'sql' SECURITY DEFINER AS 'SELECT $1 = 0';

line 68 => error: Parse error on line 1: ...UNCTION functest_C_2(int) RETURNS bool L -----------------------^ Expecting 'AS', got 'LPAR'
```

```sql
SELECT voidtest2(11,22);

line 387 => error: alasql.fn["voidtest2"] is not a function. (In 'alasql.fn["voidtest2"](11,22)', 'alasql.fn["voidtest2"]' is undefined)
```

#### ☓ Ran 181 statements

* 147 failed
* 18% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 76/238 `pg/sql/create_cast.sql`

#### ☓ Ran 24 statements

* 21 failed
* 12% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 77/238 `pg/sql/create_view.sql`

```sql
CREATE TABLE temp_view_test.tt1 (y1 int, f2 int, f3 text);

line 318 => error: undefined is not an object (evaluating 'db.tables')
```

```sql
ALTER TABLE tmp1 RENAME TO tx1;

line 369 => error: Can not rename a table "tmp1" to "tx1" because the table with this name already exists
```

```sql
alter table tt3 add column c int;

line 447 => error: Cannot add column "c" because it already exists in table "tt3"
```

```sql
alter table tt14t drop column f3;

line 657 => error: Cannot drop column "f3" because it was not found in the table tt14t"
```

```sql
create view tt201v as select ('2022-12-01'::date + '1 day'::interval) at time zone 'UTC' as atz, extract(day from now()) as extr, (now(), '1 day'::interval) overlaps (current_timestamp(2), '1 day'::interval) as o, 'foo' is normalized isn, 'foo' is nfkc normalized isnn, normalize('foo') as n, normal…

line 720 => error: Parse error on line 3: ...1'::date + '1 day'::interval) at time zo -----------------------^ Expecting 'LITERAL', 'ENUM', got 'INTERVAL'
```

#### ☓ Ran 310 statements

* 175 failed
* 9 not run (inside a transaction that had an error)
* 41% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 78/238 `pg/sql/select.sql`

```sql
explain (costs off) select * from list_parted_tbl;

line 272 => error: Parse error on line 1: explain (costs off) select * ---------^ Expecting 'LPAR', 'SEARCH', 'SELECT', got 'LITERAL'
```

#### ☓ Ran 91 statements

* 78 failed
* 1 not run (inside a transaction that had an error)
* 13% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 79/238 `pg/sql/typed_table.sql`

#### ☓ Ran 32 statements

* 18 failed
* 43% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 80/238 `pg/sql/drop_if_exists.sql`

```sql
DROP TABLE IF EXISTS no_such_schema.foo;

line 266 => error: undefined is not an object (evaluating 'db.tables')
```

#### ☓ Ran 161 statements

* 98 failed
* 39% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 81/238 `pg/sql/inherit.sql`

```sql
explain (verbose, costs off) update some_tab set a = a + 1 where false returning b, a;

line 130 => error: Parse error on line 1: explain (verbose, costs off) ---------^ Expecting 'LPAR', 'SEARCH', 'SELECT', got 'LITERAL'
```

```sql
create table cc (c int constraint check_c check (c <> 0)) inherits (ac, bc);

line 328 => error: Parse error on line 1: ...ate table cc (c int constraint check_c c -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'EOF', 'EndTransaction', 'WITH', 'COMMA', 'AS', 'LPAR', 'RPAR', 'SEARCH', 'PIVOT', 'FOR', 'UNPIVOT', 'IN', 'REMOVE', 'LIKE', 'AR…
```

```sql
alter table p1_c1 alter constraint p1_a_check not enforced;

line 563 => error: Parse error on line 1: alter table p1_c1 alter constraint p1_ ------------------^ Expecting 'LITERAL', 'EOF', 'COMMA', 'AS', 'LPAR', 'RPAR', 'SEARCH', 'DOT', 'WHERE', 'DOLLAR', 'AT', 'SET', 'TO', 'VALUE', 'COLON', 'NOT', 'QUESTION', 'UNIQUE', 'SELECT', 'INDEX', 'ON', 'NULL', 'BRAQUESTION', '…
```

```sql
reset enable_seqscan;

line 752 => error: Parse error on line 1: reset enable_seqscan; ------^ Expecting 'EOF', 'COMMA', 'LPAR', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'LITERAL'
```

```sql
drop table inh_nn_parent, inh_nn_child, inh_nn_child2;

line 1041 => error: Can not drop table "inh_nn_child" because it does not exist in the database.
```

```sql
create table range_list_parted ( a int, b char(2) ) partition by range (a);

line 1329 => error: Parse error on line 4: ...a int, b char(2)) partition by range ( ---------------------^ Expecting 'LITERAL', 'EOF', 'COLLATE', 'END', 'ELSE', 'DEFAULT', 'IDENTITY', 'GO', 'SEMICOLON', got 'PARTITION'
```

```sql
create table bool_rp_false_2k partition of bool_rp for values from (false,1000) to (false,2000);

line 1504 => error: Parse error on line 1: ...le bool_rp_false_2k partition of bool_rp -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'EOF', 'EndTransaction', 'WITH', 'COMMA', 'AS', 'LPAR', 'RPAR', 'SEARCH', 'PIVOT', 'FOR', 'UNPIVOT', 'IN', 'REMOVE', 'LIKE', 'AR…
```

#### ☓ Ran 944 statements

* 743 failed
* 1 not checked (expected output the runner does not read)
* 4 not run (inside a transaction that had an error)
* 20% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 82/238 `pg/sql/create_operator.sql`

#### ☓ Ran 95 statements

* 16 failed
* 31 not run (inside a transaction that had an error)
* 75% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 83/238 `pg/sql/roleattributes.sql`

```sql
SELECT rolname, rolsuper, rolinherit, rolcreaterole, rolcreatedb, rolcanlogin, rolreplication, rolbypassrls, rolconnlimit, rolpassword, rolvaliduntil FROM pg_authid WHERE rolname = 'regress_test_createrole';

line 30 => error: Table does not exist: pg_authid
```

#### ☓ Ran 80 statements

* 80 failed
* 0% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 84/238 `pg/sql/updatable_views.sql`

```sql
SELECT * FROM base_tbl;

line 121 => expected 6 rows, got 0
```

```sql
CREATE TRIGGER rw_view1_del_trig INSTEAD OF DELETE ON rw_view1 FOR EACH ROW EXECUTE PROCEDURE rw_view1_trig_fn();

line 484 => error: Parse error on line 1: ...ELETE ON rw_view1 FOR EACH ROW EXECUTE ----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'EOF', 'EndTransaction', 'WITH', 'AS', 'LPAR', 'SEARCH', 'EQ', 'SET', 'IF', 'SELECT', 'JAVASCRIPT', 'CREATE', 'REPLACE', 'END', 'EL…
```

```sql
UPDATE rw_view2 SET b = 'bar' WHERE a = 1;

line 721 => expected an error (permission denied for view rw_view1), got success
```

```sql
SET SESSION AUTHORIZATION regress_view_user1;

line 909 => error: Parse error on line 1: SET SESSION AUTHORIZATION regres ------------^ Expecting 'ARROW', 'DOT', 'EQ', 'ON', 'OFF', got 'LITERAL'
```

```sql
INSERT INTO base_tbl VALUES (1, 'Row 1');

line 1063 => error: Cannot insert record, because it already exists in primary key index
```

```sql
INSERT INTO rw_view2(base_a) VALUES (1.1) RETURNING t;

line 1148 => error: Parse error on line 1: ...ase_a) VALUES (1.1) RETURNING t; -----------------------^ Expecting 'EOF', 'COMMA', 'RPAR', 'END', 'WHEN', 'ELSE', 'OUTPUT', 'GO', 'SEMICOLON', got 'LITERAL'
```

```sql
DROP TABLE base_tbl, ref_tbl CASCADE;

line 1393 => error: Parsing halted while starting to recover from another error.
```

```sql
DROP TABLE t1, t11, t12, t111 CASCADE;

line 1677 => error: Parsing halted while starting to recover from another error.
```

```sql
set session authorization regress_view_user2;

line 1994 => error: Parse error on line 1: set session authorization regres ------------^ Expecting 'ARROW', 'DOT', 'EQ', 'ON', 'OFF', got 'LITERAL'
```

#### ☓ Ran 1,117 statements

* 802 failed
* 5 not checked (expected output the runner does not read)
* 27% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 85/238 `pg/sql/hash_func.sql`

#### ☓ Ran 44 statements

* 40 failed
* 9% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 86/238 `pg/sql/errors.sql`

```sql
alter table nonesuch rename to newnonesuch;

line 74 => expected an error (relation "nonesuch" does not exist), got success
```

#### ☓ Ran 87 statements

* 17 failed
* 80% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 87/238 `pg/sql/insert_conflict.sql`

```sql
drop table capitals;

line 397 => error: Can not drop table "capitals" because it does not exist in the database.
```

```sql
insert into namedconstraint values (1, 'y', 'second') on conflict on constraint namedconstraint_a_key do update set c = excluded.c;

line 659 => error: Parse error on line 1: ...1, 'y', 'second') on conflict on const ----------------------^ Expecting 'EOF', 'COMMA', 'RPAR', 'END', 'WHEN', 'ELSE', 'OUTPUT', 'GO', 'SEMICOLON', got 'ON'
```

#### ☓ Ran 353 statements

* 210 failed
* 40% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 88/238 `pg/sql/infinite_recurse.sql`

#### ☓ Ran 3 statements

* 2 failed
* 33% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 89/238 `pg/sql/sanity_check.sql`

#### ☓ Ran 3 statements

* 3 failed
* 0% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 90/238 `pg/sql/vacuum.sql`

```sql
SELECT pg_relation_size('vac_truncate_test') = 0;

line 199 => error: alasql.fn["pg_relation_size"] is not a function. (In 'alasql.fn["pg_relation_size"]('vac_truncate_test')', 'alasql.fn["pg_relation_size"]' is undefined)
```

```sql
VACUUM (ANALYZE) pg_catalog.pg_authid;

line 440 => error: Parse error on line 1: VACUUM (ANALYZE) pg_catalog.pg_authid -----------------^ Expecting 'EOF', 'COMMA', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'LITERAL'
```

#### ☓ Ran 338 statements

* 227 failed
* 17 not run (inside a transaction that had an error)
* 29% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 91/238 `pg/sql/select_into.sql`

```sql
CREATE VIEW foo AS SELECT 1 INTO int4_tbl;

line 116 => expected an error (views must not contain SELECT INTO), got success
```

#### ☓ Ran 67 statements

* 51 failed
* 23% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 92/238 `pg/sql/select_distinct_on.sql`

#### ☓ Ran 23 statements

* 19 failed
* 17% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 93/238 `pg/sql/select_distinct.sql`

#### ☓ Ran 101 statements

* 65 failed
* 35% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 94/238 `pg/sql/select_implicit.sql`

```sql
SELECT a%2, count(b) FROM test_missing_target GROUP BY test_missing_target.a%2 ORDER BY test_missing_target.a%2;

line 100 => row 1 differs: expected 0 | 5, got '' | 5
```

#### ☓ Ran 44 statements

* 18 failed
* 59% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 95/238 `pg/sql/select_having.sql`

#### ☓ Ran 23 statements

* 6 failed
* 73% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 96/238 `pg/sql/create_am.sql`

#### ☓ Ran 142 statements

* 50 failed
* 58 not run (inside a transaction that had an error)
* 40% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 97/238 `pg/sql/triggers.sql`

```sql
COPY main_table (a, b) FROM stdin;

line 149 => error: Cannot insert record, because it already exists in unique index
```

```sql
COMMENT ON TRIGGER before_ins_stmt_trig ON main_table IS NULL;

line 159 => error: Parse error on line 1: COMMENT ON TRIGGER before_in --------^ Expecting 'EOF', 'COMMA', 'LPAR', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'ON'
```

```sql
UPDATE main_table SET a = 50, b = 60;

line 189 => error: Record already exists
```

```sql
insert into trigtest2 values(1);

line 326 => error: Foreign key "1" not found in table "trigtest"
```

```sql
create trigger depth_b_tr before insert on depth_b for each row execute procedure depth_b_tf();

line 904 => error: Parse error on line 1: ...insert on depth_b for each row execute ----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'EOF', 'EndTransaction', 'WITH', 'AS', 'LPAR', 'SEARCH', 'EQ', 'SET', 'IF', 'SELECT', 'JAVASCRIPT', 'CREATE', 'REPLACE', 'END', 'EL…
```

```sql
drop table trigpart3;

line 1271 => error: Can not drop table "trigpart3" because it does not exist in the database.
```

```sql
update parted set c = c || ' v6';

line 1532 => error: undefined is not an object (evaluating 'alasql.databases[databaseid].tables[tableid].onupdatefns')
```

```sql
alter table parted_trigger_2 drop column drp;

line 1681 => error: Cannot drop column "drp" because it was not found in the table parted_trigger_2"
```

```sql
alter table only parent enable always trigger tg;

line 1764 => error: Parse error on line 1: alter table only parent enable a ------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'DQSTRING', got 'ONLY'
```

```sql
drop trigger trans_tab_parent_update_trig on trans_tab_parent;

line 2081 => error: Parse error on line 1: ..._parent_update_trig on trans_tab_parent; -----------------------^ Expecting 'EOF', 'END', 'ELSE', 'GO', 'SEMICOLON', got 'ON'
```

```sql
create table parted_trig_1 partition of parted_trig for values from (0) to (1000) partition by range (a);

line 2546 => error: Parse error on line 1: ...table parted_trig_1 partition of parted_ -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'EOF', 'EndTransaction', 'WITH', 'COMMA', 'AS', 'LPAR', 'RPAR', 'SEARCH', 'PIVOT', 'FOR', 'UNPIVOT', 'IN', 'REMOVE', 'LIKE', 'AR…
```

#### ☓ Ran 1,039 statements

* 717 failed
* 31 not checked (expected output the runner does not read)
* 18 not run (inside a transaction that had an error)
* 27% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 98/238 `pg/sql/constraints.sql`

```sql
SELECT * FROM NE_CHECK_TBL;

line 80 => error: Table does not exist: ne_check_tbl
```

```sql
COMMIT;

line 462 => expected an error (duplicate key value violates unique constraint "unique_tbl_i_key"), got success
```

```sql
ALTER TABLE notnull_tbl3 ALTER A DROP NOT NULL;

line 787 => error: Parse error on line 1: ... TABLE notnull_tbl3 ALTER A DROP NOT NUL -----------------------^ Expecting 'LITERAL', 'EOF', 'COMMA', 'AS', 'LPAR', 'RPAR', 'SEARCH', 'DOT', 'WHERE', 'DOLLAR', 'AT', 'SET', 'TO', 'VALUE', 'COLON', 'NOT', 'QUESTION', 'UNIQUE', 'SELECT', 'INDEX', 'ON', 'NULL', 'BRAQU…
```

```sql
ALTER TABLE notnull_tbl1_upg ADD CONSTRAINT nn NOT NULL a NOT VALID;

line 1027 => error: Parse error on line 1: ...otnull_tbl1_upg ADD CONSTRAINT nn NOT NU -----------------------^ Expecting 'COLUMN', got 'CONSTRAINT'
```

#### ☓ Ran 597 statements

* 363 failed
* 22 not run (inside a transaction that had an error)
* 36% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 99/238 `pg/sql/case.sql`

```sql
UPDATE CASE_TBL SET i = CASE WHEN i >= 3 THEN (- i) ELSE (2 * i) END;

line 155 => error: Cannot declare a let variable twice: 'r'.
```

#### ☓ Ran 64 statements

* 15 failed
* 12 not run (inside a transaction that had an error)
* 71% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 100/238 `pg/sql/random.sql`

```sql
SELECT random_normal() FROM generate_series(1, 10);

line 269 => error: alasql.from["GENERATE_SERIES"] is not a function. (In 'alasql.from["GENERATE_SERIES"](1,10,cb,idx,query)', 'alasql.from["GENERATE_SERIES"]' is undefined)
```

#### ☓ Ran 68 statements

* 67 failed
* 1% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 101/238 `pg/sql/arrays.sql`

```sql
update arrtest1 set i[8:10] = array[18,null,20], t[8:10] = array['p18',null,'p20'];

line 213 => error: Parse error on line 1: ...pdate arrtest1 set i[8:10] = array[18,nu -----------------------^ Expecting 'EOF', 'WITH', 'COMMA', 'RPAR', 'PIVOT', 'UNPIVOT', 'DOT', 'ORDER', 'EQ', 'WHERE', 'UNION', 'INTERSECT', 'EXCEPT', 'FROM', 'INTO', 'CROSS', 'OUTER', 'NATURAL', 'JOIN', 'INNER', 'LEFT', 'RIGH…
```

```sql
insert into arr_pk_tbl(pk, f1[1:2]) values (1, '{6,7,8}') on conflict (pk) do update set f1[1] = excluded.f1[1], f1[2] = excluded.f1[2], f1[3] = excluded.f1[3] returning pk, f1;

line 430 => error: Parse error on line 1: ...to arr_pk_tbl(pk, f1[1:2]) values (1, '{ -----------------------^ Expecting 'EOF', 'WITH', 'COMMA', 'RPAR', 'PIVOT', 'UNPIVOT', 'DOT', 'ORDER', 'EQ', 'WHERE', 'UNION', 'INTERSECT', 'EXCEPT', 'FROM', 'INTO', 'CROSS', 'OUTER', 'NATURAL', 'JOIN', 'INNER', 'LEFT', 'RIGH…
```

```sql
select a, a = '{}' as is_eq, array_dims(a) from (select array_fill(42, array[0]) as a) ss;

line 608 => error: null is not an object (evaluating 'data.data')
```

```sql
select string_to_array('1,2,3,4,,6', ',', '');

line 634 => error: alasql.fn["string_to_array"] is not a function. (In 'alasql.fn["string_to_array"]('1,2,3,4,,6',',','')', 'alasql.fn["string_to_array"]' is undefined)
```

```sql
select * from unnest(array[1,2,3]);

line 699 => expected 1 columns, got 0
```

```sql
SELECT width_bucket(5, '{}');

line 825 => error: alasql.fn["width_bucket"] is not a function. (In 'alasql.fn["width_bucket"](5,'{}')', 'alasql.fn["width_bucket"]' is undefined)
```

#### ☓ Ran 518 statements

* 408 failed
* 21% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 102/238 `pg/sql/btree_index.sql`

```sql
explain (costs off) select proname from pg_proc where proname ilike '00%foo' order by 1;

line 373 => error: Parse error on line 1: explain (costs off)select pr ---------^ Expecting 'LPAR', 'SEARCH', 'SELECT', got 'LITERAL'
```

#### ☓ Ran 159 statements

* 115 failed
* 2 not run (inside a transaction that had an error)
* 26% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 103/238 `pg/sql/aggregates.sql`

```sql
SELECT avg(b)::numeric(10,3) AS avg_107_943 FROM aggtest;

line 35 => error: g is not defined
```

```sql
select avg('NaN'::numeric) from generate_series(1,3);

line 97 => error: alasql.from["GENERATE_SERIES"] is not a function. (In 'alasql.from["GENERATE_SERIES"](1,3,cb,idx,query)', 'alasql.from["GENERATE_SERIES"]' is undefined)
```

```sql
create index minmaxtest2i on minmaxtest2(f1 desc);

line 487 => error: undefined is not an object (evaluating 'table.xcolumns')
```

```sql
select * from agg_view1;

line 872 => error: Table does not exist: agg_view1
```

```sql
EXPLAIN (COSTS OFF) SELECT count(*) FROM btg t1 JOIN btg t2 ON t1.w = t2.w AND t1.x = t2.x AND t1.z = t2.z GROUP BY t1.w, t1.z, t1.x;

line 1445 => error: Parse error on line 1: EXPLAIN (COSTS OFF)SELECT co ---------^ Expecting 'LPAR', 'SEARCH', 'SELECT', got 'LITERAL'
```

#### ☓ Ran 588 statements

* 410 failed
* 48 not run (inside a transaction that had an error)
* 24% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 104/238 `pg/sql/update.sql`

```sql
CREATE TABLE part_b_10_b_20 (e varchar, c numeric, a text, b bigint, d int) PARTITION BY RANGE (c);

line 184 => error: Parse error on line 1: ...t, b bigint, d int) PARTITION BY RANGE ( -----------------------^ Expecting 'LITERAL', 'EOF', 'COLLATE', 'END', 'ELSE', 'DEFAULT', 'IDENTITY', 'GO', 'SEMICOLON', got 'PARTITION'
```

```sql
CREATE TRIGGER parent_delete_trig AFTER DELETE ON range_parted for each statement execute procedure trigfunc();

line 438 => error: Parse error on line 2: ...ETE ON range_parted for each statement e -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'EOF', 'EndTransaction', 'WITH', 'AS', 'LPAR', 'SEARCH', 'EQ', 'SET', 'IF', 'SELECT', 'JAVASCRIPT', 'CREATE', 'REPLACE', 'END', …
```

#### ☓ Ran 286 statements

* 236 failed
* 17% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 105/238 `pg/sql/delete.sql`

```sql
SELECT id, a, char_length(b) FROM delete_test;

line 18 => error: alasql.fn["char_length"] is not a function. (In 'alasql.fn["char_length"](p['delete_test']['b'])', 'alasql.fn["char_length"]' is undefined)
```

#### ☓ Ran 10 statements

* 4 failed
* 60% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 106/238 `pg/sql/namespace.sql`

```sql
CREATE SCHEMA IF NOT EXISTS test_ns_schema_renamed;

line 57 => error: Database 'test_ns_schema_renamed' already exists
```

#### ☓ Ran 42 statements

* 30 failed
* 3 not run (inside a transaction that had an error)
* 23% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 107/238 `pg/sql/prepared_xacts.sql`

#### ☓ Ran 96 statements

* 8 failed
* 75 not run (inside a transaction that had an error)
* 61% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 108/238 `pg/sql/brin.sql`

#### ☓ Ran 77 statements

* 50 failed
* 2 not run (inside a transaction that had an error)
* 33% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 109/238 `pg/sql/hash_index.sql`

```sql
SELECT * FROM hash_f8_heap WHERE hash_f8_heap.random = '444705537'::float8;

line 113 => expected 1 rows, got 0
```

#### ☓ Ran 111 statements

* 64 failed
* 4 not run (inside a transaction that had an error)
* 40% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 110/238 `pg/sql/gin.sql`

```sql
create unlogged table t_gin_test_tbl(i int4[], j int4[]);

line 176 => error: Parse error on line 1: create unlogged table t_gin_test_tbl ----------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'EOF', 'EndTransaction', 'WITH', 'COMMA', 'AS', 'LPAR', 'RPAR', 'SEARCH', 'PIVOT', 'FOR', 'UNPIVOT', 'IN', 'REMOVE', 'LIKE', 'ARROW', 'DOT', '…
```

#### ☓ Ran 59 statements

* 50 failed
* 15% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 111/238 `pg/sql/spgist.sql`

#### ☓ Ran 39 statements

* 26 failed
* 33% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 112/238 `pg/sql/gist.sql`

#### ☓ Ran 84 statements

* 60 failed
* 28% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 113/238 `pg/sql/init_privs.sql`

#### ☓ Ran 4 statements

* 4 failed
* 0% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 114/238 `pg/sql/security_label.sql`

```sql
CREATE FUNCTION seclabel_four() RETURNS integer AS $$SELECT 4$$ language sql;

line 19 => error: Parse error on line 1: ...NCTION seclabel_four() RETURNS integer A -----------------------^ Expecting 'AS', got 'LPAR'
```

#### ☓ Ran 28 statements

* 14 failed
* 50% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 115/238 `pg/sql/collate.sql`

```sql
CREATE COLLATION builtin_c ( PROVIDER = builtin, LOCALE = "C" );

line 247 => error: Parse error on line 1: CREATE COLLATION builtin_c ( PROVIDER -----------------^ Expecting 'DATABASE', got 'LITERAL'
```

#### ☓ Ran 146 statements

* 106 failed
* 27% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 116/238 `pg/sql/matview.sql`

```sql
SELECT * FROM mvtest_mv_v_3;

line 189 => error: Table does not exist: mvtest_mv_v_3
```

#### ☓ Ran 181 statements

* 138 failed
* 3 not run (inside a transaction that had an error)
* 22% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 117/238 `pg/sql/portals.sql`

```sql
DECLARE c1 CURSOR FOR SELECT * FROM uctest a, uctest b WHERE a.f1 = b.f1 + 5 FOR UPDATE;

line 461 => error: Parse error on line 1: DECLARE c1 CURSOR FOR SELECT --------^ Expecting 'AT', got 'LITERAL'
```

#### ☓ Ran 354 statements

* 70 failed
* 197 not run (inside a transaction that had an error)
* 55% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 118/238 `pg/sql/replica_identity.sql`

#### ☓ Ran 76 statements

* 48 failed
* 36% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 119/238 `pg/sql/lock.sql`

```sql
REVOKE UPDATE ON TABLE lock_view1 FROM regress_rol_lock1;

line 145 => error: Parse error on line 1: REVOKE UPDATE ON TABLE lock -------^ Expecting 'EOF', 'COMMA', 'LPAR', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'UPDATE'
```

#### ☓ Ran 131 statements

* 50 failed
* 22 not run (inside a transaction that had an error)
* 54% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 120/238 `pg/sql/rowsecurity.sql`

```sql
SELECT * FROM document TABLESAMPLE BERNOULLI(50) REPEATABLE(0) WHERE f_leak(dtitle) ORDER BY did;

line 289 => error: Parse error on line 1: ...ocument TABLESAMPLE BERNOULLI(50) REPEAT -----------------------^ Expecting 'EOF', 'WITH', 'COMMA', 'RPAR', 'PIVOT', 'UNPIVOT', 'ORDER', 'WHERE', 'UNION', 'INTERSECT', 'EXCEPT', 'CROSS', 'OUTER', 'NATURAL', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'SEMI', 'ANTI', '…
```

```sql
SELECT * FROM part_document WHERE f_leak(dtitle) ORDER BY did;

line 523 => error: Table does not exist: part_document
```

```sql
EXPLAIN (COSTS OFF) SELECT * FROM s1 WHERE f_leak(b);

line 731 => error: Parse error on line 1: EXPLAIN (COSTS OFF) SELECT * ---------^ Expecting 'LPAR', 'SEARCH', 'SELECT', got 'LITERAL'
```

```sql
DROP POLICY p3_update_novels ON document;

line 1014 => error: Parse error on line 1: DROP POLICY p3_update_novels ON ------------^ Expecting 'DATABASE', got 'LITERAL'
```

```sql
CREATE VIEW rls_view WITH (security_invoker) AS SELECT * FROM z1 WHERE f_leak(b);

line 1374 => error: Parse error on line 1: ...REATE VIEW rls_view WITH (security_invok -----------------------^ Expecting 'LITERAL', 'EOF', 'COMMA', 'AS', 'LPAR', 'RPAR', 'SEARCH', 'DOT', 'WHERE', 'DOLLAR', 'AT', 'SET', 'TO', 'VALUE', 'COLON', 'NOT', 'QUESTION', 'UNIQUE', 'SELECT', 'INDEX', 'ON', 'NULL', 'BRAQU…
```

```sql
CREATE TABLE t1 (a integer, b text);

line 1594 => error: Can not create table 't1', because it already exists in the database 'alasql'
```

```sql
SET row_security TO OFF;

line 1825 => error: Parse error on line 1: SET row_security TO OFF; -----------------^ Expecting 'ARROW', 'DOT', 'EQ', 'ON', 'OFF', got 'TO'
```

```sql
ALTER TABLE r1 ENABLE ROW LEVEL SECURITY;

line 2216 => error: Parse error on line 1: ALTER TABLE r1 ENABLE ROW LEVEL SEC ---------------^ Expecting 'DROP', 'RENAME', 'ADD', 'MODIFY', got 'LITERAL'
```

```sql
GRANT SELECT ON rls_child_tbl TO regress_rls_alice;

line 2463 => error: Parse error on line 1: GRANT SELECT ON rls_child_ ------^ Expecting 'EOF', 'COMMA', 'LPAR', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'SELECT'
```

```sql
ALTER TABLE rls_tbl_force FORCE ROW LEVEL SECURITY;

line 2651 => error: Parse error on line 1: ...TABLE rls_tbl_force FORCE ROW LEVEL SECU -----------------------^ Expecting 'DROP', 'RENAME', 'ADD', 'MODIFY', got 'LITERAL'
```

#### ☓ Ran 1,318 statements

* 985 failed
* 18 not checked (expected output the runner does not read)
* 55 not run (inside a transaction that had an error)
* 20% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 121/238 `pg/sql/create_index.sql`

```sql
RESET enable_indexscan;

line 260 => error: Parse error on line 1: RESET enable_indexscan; ------^ Expecting 'EOF', 'COMMA', 'LPAR', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'LITERAL'
```

```sql
DROP INDEX CONCURRENTLY "concur_index4";

line 585 => error: Parse error on line 1: ... INDEX CONCURRENTLY "concur_index4"; -----------------------^ Expecting 'LITERAL', 'EOF', 'COMMA', 'AS', 'LPAR', 'RPAR', 'SEARCH', 'DOT', 'WHERE', 'DOLLAR', 'AT', 'SET', 'TO', 'VALUE', 'COLON', 'NOT', 'QUESTION', 'UNIQUE', 'SELECT', 'INDEX', 'ON', 'NULL', 'BRAQUESTI…
```

```sql
explain (costs off) SELECT unique1 FROM tenk1 WHERE unique1 > 9996 and unique1 >= 9999;

line 959 => error: Parse error on line 1: explain (costs off)SELECT un ---------^ Expecting 'LPAR', 'SEARCH', 'SELECT', got 'LITERAL'
```

```sql
ALTER INDEX concur_exprs_index_expr ALTER COLUMN 1 SET STATISTICS 100;

line 1351 => error: Parse error on line 1: ALTER INDEX concur_exprs_i ------^ Expecting 'TABLE', got 'INDEX'
```

#### ☓ Ran 684 statements

* 462 failed
* 5 not run (inside a transaction that had an error)
* 31% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 122/238 `pg/sql/object_address.sql`

```sql
CREATE STATISTICS addr_nsp.gentable_stat ON a, b FROM addr_nsp.gentable;

line 59 => error: Parse error on line 1: CREATE STATISTICS addr_nsp.gentable_st ------------------^ Expecting 'DATABASE', got 'LITERAL'
```

#### ☓ Ran 87 statements

* 44 failed
* 2 not checked (expected output the runner does not read)
* 2 not run (inside a transaction that had an error)
* 46% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 123/238 `pg/sql/drop_operator.sql`

#### ☓ Ran 12 statements

* 12 failed
* 0% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 124/238 `pg/sql/tablesample.sql`

#### ☓ Ran 58 statements

* 31 failed
* 14 not run (inside a transaction that had an error)
* 29% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 125/238 `pg/sql/password.sql`

#### ☓ Ran 53 statements

* 44 failed
* 16% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 126/238 `pg/sql/transactions.sql`

```sql
SET TRANSACTION READ ONLY;

line 69 => error: Parsing halted while starting to recover from another error.
```

#### ☓ Ran 433 statements

* 59 failed
* 7 not checked (expected output the runner does not read)
* 122 not run (inside a transaction that had an error)
* 80% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 127/238 `pg/sql/groupingsets.sql`

```sql
select sum(c) from gstest2 group by grouping sets(grouping sets(rollup(c), grouping sets(cube(c)))) order by 1 desc;

line 94 => error: gv.toJS is not a function. (In 'gv.toJS("p", query.sources[0].alias, query.defcols)', 'gv.toJS' is undefined)
```

```sql
select a, b, sum(v.x) from (values (1),(2)) v(x), gstest_data(v.x) group by rollup (a,b);

line 286 => error: Parse error on line 2: ... from (values (1),(2)) v(x), gstest_dat -----------------------^ Expecting 'LPAR', 'SEARCH', 'SELECT', got 'NUMBER'
```

```sql
explain (costs off) select (select grouping(v1)) from (values ((select 1))) v(v1) group by v1;

line 681 => error: Parse error on line 1: explain (costs off)select (s ---------^ Expecting 'LPAR', 'SEARCH', 'SELECT', got 'LITERAL'
```

#### ☓ Ran 219 statements

* 167 failed
* 1 not checked (expected output the runner does not read)
* 11 not run (inside a transaction that had an error)
* 19% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 128/238 `pg/sql/identity.sql`

```sql
ALTER TABLE itest18 SET UNLOGGED, ALTER COLUMN a ADD GENERATED ALWAYS AS IDENTITY;

line 226 => error: Parse error on line 1: ALTER TABLE itest18 SET UNLOGGED, ALTER --------------------^ Expecting 'DROP', 'RENAME', 'ADD', 'MODIFY', got 'SET'
```

```sql
CREATE TABLE itest15 (id integer NOT NULL GENERATED ALWAYS AS IDENTITY);

line 484 => error: Parse error on line 1: ...id integer NOT NULL GENERATED ALWAYS AS -----------------------^ Expecting 'EOF', 'COMMA', 'RPAR', 'NOT', 'UNIQUE', 'ON', 'NULL', 'END', 'ELSE', 'DEFAULT', 'IDENTITY', 'CHECK', 'PRIMARY', 'FOREIGN', 'REFERENCES', 'GO', 'SEMICOLON', got 'LITERAL'
```

#### ☓ Ran 271 statements

* 194 failed
* 1 not run (inside a transaction that had an error)
* 28% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 129/238 `pg/sql/brin_bloom.sql`

#### ☓ Ran 40 statements

* 30 failed
* 25% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 130/238 `pg/sql/brin_multi.sql`

```sql
SELECT COUNT(*) FROM brin_test_multi_1 WHERE b <= 150;

line 468 => error: Table does not exist: brin_test_multi_1
```

#### ☓ Ran 172 statements

* 139 failed
* 19% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 131/238 `pg/sql/generated_stored.sql`

```sql
DELETE FROM gtest1 WHERE a >= 3;

line 64 => error: undefined is not an object (evaluating 'table.data')
```

```sql
INSERT INTO gtest12 VALUES (1, 10), (2, 20);

line 305 => error: Table 'gtest12' could not be found
```

```sql
CREATE TABLE gtest_child (f1 date NOT NULL, f2 bigint, f3 bigint GENERATED ALWAYS AS (f2 * 2) STORED);

line 516 => error: Parse error on line 1: ...nt GENERATED ALWAYS AS (f2 * 2) STORED); -----------------------^ Expecting 'EOF', 'COMMA', 'RPAR', 'NOT', 'UNIQUE', 'ON', 'NULL', 'END', 'ELSE', 'DEFAULT', 'IDENTITY', 'CHECK', 'PRIMARY', 'FOREIGN', 'REFERENCES', 'GO', 'SEMICOLON', got 'AS'
```

```sql
CREATE TABLE gtest28b (LIKE gtest28a INCLUDING GENERATED);

line 848 => error: Parse error on line 1: ...ATE TABLE gtest28b (LIKE gtest28a INCLUD -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'AS', 'DQSTRING', got 'LIKE'
```

#### ☓ Ran 472 statements

* 328 failed
* 3 not checked (expected output the runner does not read)
* 1 not run (inside a transaction that had an error)
* 29% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 132/238 `pg/sql/alter_operator.sql`

#### ☓ Ran 65 statements

* 54 failed
* 16% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 133/238 `pg/sql/create_table_like.sql`

```sql
CREATE TABLE test_like_gen_2 (LIKE test_like_gen_1);

line 58 => error: Parse error on line 1: ...LE test_like_gen_2 (LIKE test_like_gen_1 -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'AS', 'DQSTRING', got 'LIKE'
```

```sql
SELECT attname, attcompression FROM pg_attribute WHERE attrelid = 'ctl_foreign_table2'::regclass and attnum > 0 ORDER BY attnum;

line 276 => error: Table does not exist: pg_attribute
```

#### ☓ Ran 179 statements

* 143 failed
* 1 not run (inside a transaction that had an error)
* 19% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 134/238 `pg/sql/join_hash.sql`

#### ☓ Ran 281 statements

* 3 failed
* 272 not run (inside a transaction that had an error)
* 66% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 135/238 `pg/sql/misc.sql`

#### ☓ Ran 61 statements

* 52 failed
* 1 not checked (expected output the runner does not read)
* 13% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 136/238 `pg/sql/async.sql`

#### ☓ Ran 11 statements

* 8 failed
* 27% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 137/238 `pg/sql/dbsize.sql`

#### ☓ Ran 25 statements

* 9 failed
* 64% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 138/238 `pg/sql/misc_functions.sql`

```sql
SELECT num_nonnulls(VARIADIC NULL::text[]);

line 30 => error: Parse error on line 1: ...m_nonnulls(VARIADIC NULL::text[]); -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'EOF', 'EndTransaction', 'WITH', 'COMMA', 'AS', 'LPAR', 'RPAR', 'SEARCH', 'PIVOT', 'FOR', 'UNPIVOT', 'IN', 'REMOVE', 'LIKE', 'ARROW', …
```

```sql
SELECT has_function_privilege('regress_current_logfile', 'pg_current_logfile()', 'EXECUTE');

line 303 => error: alasql.fn["has_function_privilege"] is not a function. (In 'alasql.fn["has_function_privilege"]('regress_current_logfile','pg_current_logfile()','EXECUTE')', 'alasql.fn["has_function_privilege"]' is undefined)
```

#### ☓ Ran 159 statements

* 144 failed
* 9% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 139/238 `pg/sql/nls.sql`

#### ☓ Ran 5 statements

* 4 failed
* 20% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 140/238 `pg/sql/tsrf.sql`

#### ☓ Ran 76 statements

* 60 failed
* 21% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 141/238 `pg/sql/sysviews.sql`

```sql
select count(*) > 0 as ok, count(*) FILTER (WHERE error IS NOT NULL) = 0 AS no_err from pg_hba_file_rules;

line 54 => error: Parse error on line 1: ...ok, count(*) FILTER (WHERE error IS NOT -----------------------^ Expecting 'EOF', 'WITH', 'COMMA', 'RPAR', 'PIVOT', 'UNPIVOT', 'REMOVE', 'ORDER', 'WHERE', 'UNION', 'INTERSECT', 'EXCEPT', 'FROM', 'INTO', 'GROUP', 'LIMIT', 'OFFSET', 'END', 'ELSE', 'OUTPUT', 'GO', 'SEM…
```

#### ☓ Ran 30 statements

* 24 failed
* 2 not run (inside a transaction that had an error)
* 14% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 142/238 `pg/sql/tid.sql`

#### ☓ Ran 52 statements

* 34 failed
* 34% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 143/238 `pg/sql/privileges.sql`

```sql
GRANT regress_priv_user1 TO regress_priv_user6 GRANTED BY regress_priv_user5;

line 87 => error: Parse error on line 1: GRANT regress_priv_user1 T ------^ Expecting 'EOF', 'COMMA', 'LPAR', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'LITERAL'
```

```sql
INSERT INTO atest1 VALUES (2, 'two');

line 290 => expected an error (permission denied for table atest1), got success
```

```sql
UPDATE atest5 SET one = 8;

line 560 => expected an error (permission denied for table atest5), got success
```

```sql
LOCK atestp1;

line 863 => error: Parse error on line 1: LOCK atestp1; -----^ Expecting 'EOF', 'COMMA', 'LPAR', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'LITERAL'
```

```sql
select has_table_privilege(NULL,'pg_authid','select');

line 1105 => error: alasql.fn["has_table_privilege"] is not a function. (In 'alasql.fn["has_table_privilege"](undefined,'pg_authid','select')', 'alasql.fn["has_table_privilege"]' is undefined)
```

```sql
CREATE UNIQUE INDEX ON sro_index_mv (c) WHERE unwanted_grant_nofail(1) > 0;

line 1336 => error: Parse error on line 1: CREATE UNIQUE INDEX ON sro_index_mv (c) --------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'DQSTRING', got 'ON'
```

```sql
DO $$BEGIN EXECUTE format( 'ALTER DATABASE %I OWNER TO regress_priv_group2', current_catalog); END$$;

line 1566 => error: Parse error on line 1: DO $$BEGIN EXECUTE form ---^ Expecting 'EOF', 'COMMA', 'LPAR', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'DOLLAR'
```

```sql
ALTER SCHEMA testns OWNER TO regress_schemauser2;

line 1860 => error: Parse error on line 1: ALTER SCHEMA testns OWNER ------^ Expecting 'TABLE', got 'DATABASE'
```

```sql
GRANT regress_group TO regress_group_direct_manager WITH INHERIT FALSE, ADMIN TRUE;

line 2090 => error: Parse error on line 1: GRANT regress_group TO reg ------^ Expecting 'EOF', 'COMMA', 'LPAR', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'LITERAL'
```

```sql
RESET ROLE;

line 2243 => error: Parse error on line 1: RESET ROLE; ------^ Expecting 'EOF', 'COMMA', 'LPAR', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'LITERAL'
```

#### ☓ Ran 1,420 statements

* 953 failed
* 1 not checked (expected output the runner does not read)
* 73 not run (inside a transaction that had an error)
* 29% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 144/238 `pg/sql/collate.utf8.sql`

#### ☓ Ran 59 statements

* 57 failed
* 3% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 145/238 `pg/sql/alter_generic.sql`

```sql
CREATE CONVERSION alt_conv2 FOR 'LATIN1' TO 'UTF8' FROM iso8859_1_to_utf8;

line 121 => error: Parse error on line 1: CREATE CONVERSION alt_conv2 FOR 'LATIN ------------------^ Expecting 'DATABASE', got 'LITERAL'
```

```sql
ALTER STATISTICS alt_stat1 RENAME TO alt_stat3;

line 471 => error: Parse error on line 1: ALTER STATISTICS alt_stat1 ------^ Expecting 'TABLE', got 'LITERAL'
```

#### ☓ Ran 333 statements

* 194 failed
* 25 not run (inside a transaction that had an error)
* 37% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 146/238 `pg/sql/tidrangescan.sql`

#### ☓ Ran 74 statements

* 38 failed
* 28 not run (inside a transaction that had an error)
* 17% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 147/238 `pg/sql/incremental_sort.sql`

```sql
insert into t(a, b) select i/100 + 1, i + 1 from generate_series(0, 999) n(i);

line 117 => error: Parse error on line 1: ...ate_series(0, 999) n(i); -----------------------^ Expecting 'EOF', 'WITH', 'COMMA', 'RPAR', 'PIVOT', 'UNPIVOT', 'ORDER', 'WHERE', 'UNION', 'INTERSECT', 'EXCEPT', 'CROSS', 'OUTER', 'NATURAL', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'SEMI', 'ANTI', 'ON', 'USING', 'G…
```

#### ☓ Ran 134 statements

* 103 failed
* 5 not run (inside a transaction that had an error)
* 20% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 148/238 `pg/sql/collate.icu.utf8.sql`

The expected output stops matching the script part way; the statements after that point are not checked.

```sql
CREATE TABLE collate_test3 ( a int, b text COLLATE "C" );

line 52 => error: Parse error on line 3: ... a int, b text COLLATE "C"); ----------------------^ Expecting 'EOF', 'COMMA', 'RPAR', 'NOT', 'UNIQUE', 'ON', 'NULL', 'END', 'ELSE', 'DEFAULT', 'IDENTITY', 'CHECK', 'PRIMARY', 'FOREIGN', 'REFERENCES', 'GO', 'SEMICOLON', got 'COLLATE'
```

#### ☓ Ran 755 statements

* 64 failed
* 673 not checked (expected output the runner does not read)
* 10 not run (inside a transaction that had an error)
* 11% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 149/238 `pg/sql/create_role.sql`

```sql
SELECT shobj_description('regress_hasprivs'::regrole, 'pg_authid') IS NULL AS no_comment;

line 101 => error: alasql.fn["shobj_description"] is not a function. (In 'alasql.fn["shobj_description"](alasql.stdfn.CONVERT('regress_hasprivs', { dbtypeid: "regrole", dbsize: undefined, dbprecision: undefined, style: undefined }),'pg_authid')', 'alasql.fn["shobj_description"]' is undefined)
```

#### ☓ Ran 144 statements

* 92 failed
* 36% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 150/238 `pg/sql/rules.sql`

```sql
select * from rtest_admin order by pname, sysname;

line 266 => row 1 differs: expected bm | pluto, got bm | neptun
```

```sql
create rule t1_ins_1 as on insert to t1 where new.a >= 0 and new.a < 10 do instead insert into t1_1 values (new.a);

line 947 => error: Parse error on line 1: create rule t1_ins_1 as on inser ------------^ Expecting 'DATABASE', got 'LITERAL'
```

```sql
CREATE RULE rule1 AS ON INSERT TO rule_merge1 DO INSTEAD INSERT INTO rule_merge2 VALUES (NEW.*);

line 1280 => error: Parse error on line 1: CREATE RULE rule1 AS ON INSERT T ------------^ Expecting 'DATABASE', got 'LITERAL'
```

#### ☓ Ran 630 statements

* 284 failed
* 3 not checked (expected output the runner does not read)
* 54% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 151/238 `pg/sql/generated_virtual.sql`

```sql
CREATE TABLE gtest3 (a int, b int GENERATED ALWAYS AS (a * 3) VIRTUAL);

line 193 => error: Parse error on line 1: ...nt GENERATED ALWAYS AS (a * 3) VIRTUAL); -----------------------^ Expecting 'EOF', 'COMMA', 'RPAR', 'NOT', 'UNIQUE', 'ON', 'NULL', 'END', 'ELSE', 'DEFAULT', 'IDENTITY', 'CHECK', 'PRIMARY', 'FOREIGN', 'REFERENCES', 'GO', 'SEMICOLON', got 'AS'
```

```sql
CREATE TABLE gtest22c (a int, b int GENERATED ALWAYS AS (a * 2) VIRTUAL);

line 442 => error: Parse error on line 1: ...nt GENERATED ALWAYS AS (a * 2) VIRTUAL); -----------------------^ Expecting 'EOF', 'COMMA', 'RPAR', 'NOT', 'UNIQUE', 'ON', 'NULL', 'END', 'ELSE', 'DEFAULT', 'IDENTITY', 'CHECK', 'PRIMARY', 'FOREIGN', 'REFERENCES', 'GO', 'SEMICOLON', got 'AS'
```

```sql
SELECT * FROM gtest26 ORDER BY a;

line 836 => error: Table does not exist: gtest26
```

#### ☓ Ran 485 statements

* 328 failed
* 3 not checked (expected output the runner does not read)
* 5 not run (inside a transaction that had an error)
* 31% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 152/238 `pg/sql/psql_crosstab.sql`

#### ☓ Ran 31 statements

* 11 failed
* 17 not checked (expected output the runner does not read)
* 21% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 153/238 `pg/sql/psql.sql`

The expected output stops matching the script part way; the statements after that point are not checked.

```sql
SET ROLE TO regress_display_role;

line 572 => error: Parse error on line 1: SET ROLE TO regress_display_r ---------^ Expecting 'ARROW', 'DOT', 'EQ', 'ON', 'OFF', got 'TO'
```

#### ☓ Ran 227 statements

* 48 failed
* 154 not checked (expected output the runner does not read)
* 1 not run (inside a transaction that had an error)
* 33% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 154/238 `pg/sql/amutils.sql`

#### ☓ Ran 10 statements

* 8 failed
* 20% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 155/238 `pg/sql/stats_ext.sql`

```sql
CREATE STATISTICS ab1_exprstat_6 ON (case a when 1 then true else false end), b FROM ab1;

line 204 => error: Parse error on line 1: CREATE STATISTICS ab1_exprstat_6 ON ------------------^ Expecting 'DATABASE', got 'LITERAL'
```

```sql
CREATE STATISTICS s12 (ndistinct) ON c, d FROM ndistinct;

line 466 => error: Parse error on line 1: CREATE STATISTICS s12 (ndistinct) ON c ------------------^ Expecting 'DATABASE', got 'LITERAL'
```

```sql
SELECT * FROM check_estimated_rows('SELECT * FROM functional_dependencies WHERE a IN (1, 51) AND b = ALL (ARRAY[''1''])');

line 699 => error: alasql.from["CHECK_ESTIMATED_ROWS"] is not a function. (In 'alasql.from["CHECK_ESTIMATED_ROWS"]('SELECT * FROM functional_dependencies WHERE a IN (1, 51) AND b = ALL (ARRAY[\'1\'])',null,cb,idx,query)', 'alasql.from["CHECK_ESTIMATED_ROWS"]' is undefined)
```

```sql
SELECT * FROM check_estimated_rows('SELECT * FROM functional_dependencies_multi WHERE a = 0 AND b = 0');

line 938 => error: alasql.from["CHECK_ESTIMATED_ROWS"] is not a function. (In 'alasql.from["CHECK_ESTIMATED_ROWS"]('SELECT * FROM functional_dependencies_multi WHERE a = 0 AND b = 0',null,cb,idx,query)', 'alasql.from["CHECK_ESTIMATED_ROWS"]' is undefined)
```

```sql
CREATE STATISTICS mcv_lists_stats_1 ON (mod(a,20)) FROM mcv_lists;

line 1164 => error: Parse error on line 1: CREATE STATISTICS mcv_lists_stats_1 ON ------------------^ Expecting 'DATABASE', got 'LITERAL'
```

```sql
SELECT * FROM check_estimated_rows('SELECT * FROM mcv_lists_partial WHERE (a = 0 AND b = 0 AND c = 0) OR (a = 1 AND b = 1 AND c = 1) OR (a = 2 AND b = 2 AND c = 2)');

line 1443 => error: alasql.from["CHECK_ESTIMATED_ROWS"] is not a function. (In 'alasql.from["CHECK_ESTIMATED_ROWS"]('SELECT * FROM mcv_lists_partial WHERE (a = 0 AND b = 0 AND c = 0) OR (a = 1 AND b = 1 AND c = 1) OR (a = 2 AND b = 2 AND c = 2)',null,cb,idx,query)', 'alasql.from["CHECK_ESTIMATED_ROWS"]' is unde…
```

```sql
create role regress_stats_ext nosuperuser;

line 1673 => error: Parse error on line 1: create role regress_stats_ext no ------------^ Expecting 'DATABASE', got 'LITERAL'
```

```sql
INSERT INTO grouping_unique (x) SELECT gs FROM generate_series(1,1000) AS gs;

line 1854 => error: alasql.from["GENERATE_SERIES"] is not a function. (In 'alasql.from["GENERATE_SERIES"](1,1000,cb,idx,query)', 'alasql.from["GENERATE_SERIES"]' is undefined)
```

#### ☓ Ran 889 statements

* 793 failed
* 10% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 156/238 `pg/sql/collate.linux.utf8.sql`

```sql
SELECT a, coalesce(b, 'foo') FROM collate_test3 ORDER BY 2;

line 209 => error: Table does not exist: collate_test3
```

#### ☓ Ran 206 statements

* 172 failed
* 16% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 157/238 `pg/sql/psql_pipeline.sql`

```sql
SELECT

line 221 => error: undefined is not an object (evaluating 'query.sources[0].databaseid')
```

```sql
SAVEPOINT a

line 413 => error: SAVEPOINT can only be used in transaction blocks
```

```sql
ROLLBACK TO SAVEPOINT a

line 415 => error: savepoint "a" does not exist
```

#### ☓ Ran 152 statements

* 35 failed
* 9 not checked (expected output the runner does not read)
* 75% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 158/238 `pg/sql/collate.windows.win1252.sql`

```sql
SELECT min(b), max(b) FROM collate_test3;

line 188 => error: Table does not exist: collate_test3
```

#### ☓ Ran 173 statements

* 142 failed
* 17% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 159/238 `pg/sql/write_parallel.sql`

#### ☓ Ran 22 statements

* 1 failed
* 15 not run (inside a transaction that had an error)
* 85% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 160/238 `pg/sql/select_parallel.sql`

#### ☓ Ran 250 statements

* 17 failed
* 219 not run (inside a transaction that had an error)
* 45% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 161/238 `pg/sql/vacuum_parallel.sql`

```sql
VACUUM (PARALLEL 4, INDEX_CLEANUP ON) parallel_vacuum_table;

line 36 => error: Parse error on line 1: VACUUM (PARALLEL 4, INDEX_CLEANUP ON) -----------------^ Expecting 'EOF', 'COMMA', 'LPAR', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'NUMBER'
```

#### ☓ Ran 14 statements

* 13 failed
* 1 not checked (expected output the runner does not read)
* 0% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 162/238 `pg/sql/maintain_every.sql`

#### ☓ Ran 16 statements

* 15 failed
* 6% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 163/238 `pg/sql/publication.sql`

```sql
ALTER PUBLICATION testpub_forparted1 SET (publish='insert');

line 316 => error: Parse error on line 1: ALTER PUBLICATION testpub_ ------^ Expecting 'TABLE', got 'LITERAL'
```

```sql
ALTER PUBLICATION testpub6 SET TABLE rf_tbl_abcd_part_pk_1 WHERE (a > 99);

line 566 => error: Parse error on line 1: ALTER PUBLICATION testpub6 ------^ Expecting 'TABLE', got 'LITERAL'
```

```sql
ALTER PUBLICATION testpub_tbl9 DROP TABLE public.testpub_tbl7;

line 835 => error: Parse error on line 1: ALTER PUBLICATION testpub_ ------^ Expecting 'TABLE', got 'LITERAL'
```

```sql
SET ROLE regress_publication_user3;

line 1094 => error: Parse error on line 1: SET ROLE regress_publication_... ---------^ Expecting 'ARROW', 'DOT', 'EQ', 'ON', 'OFF', got 'LITERAL'
```

```sql
DROP SCHEMA sch2 cascade;

line 1383 => error: Parsing halted while starting to recover from another error.
```

#### ☓ Ran 853 statements

* 580 failed
* 2 not checked (expected output the runner does not read)
* 31% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 164/238 `pg/sql/select_views.sql`

```sql
SELECT * FROM toyemp WHERE name = 'sharon';

line 10 => error: Table does not exist: toyemp
```

#### ☓ Ran 52 statements

* 43 failed
* 17% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 165/238 `pg/sql/without_overlaps.sql`

```sql
INSERT INTO temporal_rng (id, valid_at) VALUES ('[1,2)', daterange('2018-01-02', '2018-02-03'));

line 286 => error: alasql.fn["daterange"] is not a function. (In 'alasql.fn["daterange"]('2018-01-02','2018-02-03')', 'alasql.fn["daterange"]' is undefined)
```

```sql
ALTER TABLE temporal3 RENAME COLUMN valid_at TO valid_thru;

line 680 => error: undefined is not an object (evaluating 'table.xcolumns')
```

```sql
SELECT * FROM temporal_mltrng3 ORDER BY id, valid_at;

line 931 => error: Table does not exist: temporal_mltrng3
```

```sql
INSERT INTO temporal_mltrng (id, valid_at) VALUES ('[1,2)', datemultirange(daterange('2018-01-02', '2018-02-03'))), ('[1,2)', datemultirange(daterange('2018-03-03', '2018-04-04'))), ('[2,3)', datemultirange(daterange('2018-01-01', '2018-01-05'))), ('[3,4)', datemultirange(daterange('2018-01-01', NU…

line 1606 => error: alasql.fn["daterange"] is not a function. (In 'alasql.fn["daterange"]('2018-01-02','2018-02-03')', 'alasql.fn["daterange"]' is undefined)
```

#### ☓ Ran 658 statements

* 452 failed
* 15 not run (inside a transaction that had an error)
* 29% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 166/238 `pg/sql/portals_p2.sql`

#### ☓ Ran 41 statements

* 1 failed
* 38 not run (inside a transaction that had an error)
* 66% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 167/238 `pg/sql/dependency.sql`

```sql
REVOKE SELECT ON deptest FROM GROUP regress_dep_group;

line 20 => error: Parse error on line 1: REVOKE SELECT ON deptest FR -------^ Expecting 'EOF', 'COMMA', 'LPAR', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'SELECT'
```

#### ☓ Ran 62 statements

* 46 failed
* 25% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 168/238 `pg/sql/subscription.sql`

```sql
REVOKE CREATE ON DATABASE REGRESSION FROM regress_subscription_user3;

line 191 => error: Parse error on line 1: REVOKE CREATE ON DATABASE R -------^ Expecting 'EOF', 'COMMA', 'LPAR', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'CREATE'
```

```sql
DELETE FROM :conflict_log_table;

line 558 => error: DELETE requires an array for parameter conflict_log_table
```

```sql
ALTER SUBSCRIPTION regress_conflict_test2 SET (conflict_log_destination = 'all');

line 576 => error: Parse error on line 1: ALTER SUBSCRIPTION regress ------^ Expecting 'TABLE', got 'LITERAL'
```

```sql
DELETE FROM :clt;

line 699 => error: DELETE requires an array for parameter clt
```

#### ☓ Ran 303 statements

* 198 failed
* 1 not run (inside a transaction that had an error)
* 34% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 169/238 `pg/sql/guc.sql`

```sql
SET SESSION AUTHORIZATION regress_guc_user;

line 204 => error: Parse error on line 1: SET SESSION AUTHORIZATION regres ------------^ Expecting 'ARROW', 'DOT', 'EQ', 'ON', 'OFF', got 'LITERAL'
```

#### ☓ Ran 248 statements

* 130 failed
* 69 not run (inside a transaction that had an error)
* 27% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 170/238 `pg/sql/bitmapops.sql`

#### ☓ Ran 12 statements

* 9 failed
* 25% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 171/238 `pg/sql/tsearch.sql`

```sql
SELECT count(*) FROM test_tsvector WHERE a @@ '!qe <2> qt';

line 74 => error: Parse error on line 1: ...st_tsvector WHERE a @@ '!qe <2> qt'; -----------------------^ Expecting 'EOF', 'WITH', 'RPAR', 'IN', 'LIKE', 'ARROW', 'DOT', 'ORDER', 'CARET', 'EQ', 'SLASH', 'EXCLAMATION', 'MODULO', 'GT', 'LT', 'GTGT', 'LTLT', 'NOT', 'UNION', 'INTERSECT', 'EXCEPT', 'AND', 'OR', 'PL…
```

```sql
SELECT count(*) FROM test_tsvector WHERE a @@ '!pl <-> yh';

line 207 => error: Parse error on line 1: ...st_tsvector WHERE a @@ '!pl <-> yh'; -----------------------^ Expecting 'EOF', 'WITH', 'RPAR', 'IN', 'LIKE', 'ARROW', 'DOT', 'ORDER', 'CARET', 'EQ', 'SLASH', 'EXCLAMATION', 'MODULO', 'GT', 'LT', 'GTGT', 'LTLT', 'NOT', 'UNION', 'INTERSECT', 'EXCEPT', 'AND', 'OR', 'PL…
```

```sql
SELECT plainto_tsquery('english', 'the and z 1))& fghj');

line 316 => error: undefined is not a function (near '...alasql.fn["plainto_tsquery"]('english','the and z 1))& fghj')...')
```

```sql
SELECT to_tsquery('english', '((a <-> 1) <-> s) <-> 2');

line 356 => error: alasql.fn["to_tsquery"] is not a function. (In 'alasql.fn["to_tsquery"]('english','((a <-> 1) <-> s) <-> 2')', 'alasql.fn["to_tsquery"]' is undefined)
```

```sql
SELECT count(*) FROM test_tsvector WHERE a @@ to_tsquery('345&qwerty');

line 776 => error: Parse error on line 1: ...st_tsvector WHERE a @@ to_tsquery('345&q -----------------------^ Expecting 'EOF', 'WITH', 'RPAR', 'IN', 'LIKE', 'ARROW', 'DOT', 'ORDER', 'CARET', 'EQ', 'SLASH', 'EXCLAMATION', 'MODULO', 'GT', 'LT', 'GTGT', 'LTLT', 'NOT', 'UNION', 'INTERSECT', 'EXCEPT', 'AND', 'OR',…
```

```sql
select websearch_to_tsquery('simple', 'fat (cat OR rat');

line 847 => error: alasql.fn["websearch_to_tsquery"]('simple','fat is not a function. (In 'alasql.fn["websearch_to_tsquery"]('simple','fat (cat OR rat')', 'alasql.fn["websearch_to_tsquery"]('simple','fat ' is undefined)
```

```sql
select websearch_to_tsquery('simple', 'fat or(rat');

line 852 => error: alasql.fn["websearch_to_tsquery"]('simple','fat or is not a function. (In 'alasql.fn["websearch_to_tsquery"]('simple','fat or(rat')', 'alasql.fn["websearch_to_tsquery"]('simple','fat or' is undefined)
```

```sql
select websearch_to_tsquery('english', '(()) )))) this ||| is && -fine, "dear friend" OR good');

line 888 => error: undefined is not a function (near '...alasql.fn["websearch_to_tsquery"]('english','(()) )))) this ||| is && -fine, \"dear friend\" OR good')...')
```

#### ☓ Ran 447 statements

* 406 failed
* 1 not checked (expected output the runner does not read)
* 8% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 172/238 `pg/sql/tsdicts.sql`

```sql
SELECT ts_lexize('hunspell', 'skies');

line 34 => error: alasql.fn["ts_lexize"] is not a function. (In 'alasql.fn["ts_lexize"]('hunspell','skies')', 'alasql.fn["ts_lexize"]' is undefined)
```

```sql
ALTER TEXT SEARCH CONFIGURATION dummy_tst ALTER MAPPING FOR word, word WITH ispell;

line 258 => error: Parse error on line 1: ALTER TEXT SEARCH CONFIGUR ------^ Expecting 'TABLE', got 'LITERAL'
```

#### ☓ Ran 131 statements

* 122 failed
* 6% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 173/238 `pg/sql/foreign_data.sql`

```sql
SET ROLE regress_test_role;

line 210 => error: Parse error on line 1: SET ROLE regress_test_role; ---------^ Expecting 'ARROW', 'DOT', 'EQ', 'ON', 'OFF', got 'LITERAL'
```

```sql
ALTER FOREIGN TABLE ft1 ALTER COLUMN c8 TYPE char(10);

line 410 => error: Parse error on line 1: ALTER FOREIGN TABLE ft1 AL ------^ Expecting 'TABLE', got 'FOREIGN'
```

```sql
CREATE USER MAPPING FOR current_user SERVER s9;

line 577 => error: Parse error on line 1: CREATE USER MAPPING FOR current_ ------------^ Expecting 'DATABASE', got 'LITERAL'
```

#### ☓ Ran 542 statements

* 395 failed
* 27% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 174/238 `pg/sql/combocid.sql`

```sql
SELECT ctid,cmin,* FROM combocidtest;

line 23 => error: Column does not exist: ctid
```

#### ☓ Ran 62 statements

* 7 failed
* 19 not run (inside a transaction that had an error)
* 83% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 175/238 `pg/sql/xmlmap.sql`

#### ☓ Ran 40 statements

* 34 failed
* 15% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 176/238 `pg/sql/window.sql`

```sql
SELECT sum(unique1) over (rows between 2 preceding and 1 preceding), unique1, four FROM tenk1 WHERE unique1 < 10;

line 238 => error: Parse error on line 1: ... sum(unique1) over (rows between 2 prece -----------------------^ Expecting 'RPAR', 'ORDER', 'PARTITION', got 'ROWS'
```

```sql
select id, f_time, first_value(id) over w, last_value(id) over w from datetimes window w as (order by f_time desc range between '70 min' preceding and '2 hours' following);

line 720 => error: Parse error on line 1: ...irst_value(id) over w, last_value(id) ov -----------------------^ Expecting 'LPAR', got 'LITERAL'
```

```sql
EXPLAIN (COSTS OFF) SELECT * FROM (SELECT empno, salary, count(*) OVER (ORDER BY salary ROWS BETWEEN UNBOUNDED PRECEDING AND 0 PRECEDING EXCLUDE CURRENT ROW) c FROM empsalary) emp WHERE c <= 3;

line 1491 => error: Parse error on line 1: EXPLAIN (COSTS OFF)SELECT * ---------^ Expecting 'LPAR', 'SEARCH', 'SELECT', got 'LITERAL'
```

```sql
SELECT name, orbit, nth_value(orbit, 2) RESPECT NULLS OVER w1, nth_value(orbit, 2) IGNORE NULLS OVER w1, nth_value(orbit, 2) RESPECT NULLS OVER w2, nth_value(orbit, 2) IGNORE NULLS OVER w2 FROM planets WINDOW w1 AS (ORDER BY name ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING), w2 AS (ORD…

line 2177 => error: Parsing halted while starting to recover from another error.
```

#### ☓ Ran 456 statements

* 384 failed
* 15% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 177/238 `pg/sql/functional_deps.sql`

```sql
SELECT product_id, p.name, (sum(s.units) * p.price) AS sales FROM products p LEFT JOIN sales s USING (product_id) GROUP BY product_id, p.name, p.price;

line 89 => error: Cannot resolve column "product_id" because it exists in two source tables
```

#### ☓ Ran 40 statements

* 13 failed
* 67% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 178/238 `pg/sql/indirect_toast.sql`

#### ☓ Ran 28 statements

* 25 failed
* 10% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 179/238 `pg/sql/equivclass.sql`

```sql
explain (costs off) select * from ec1, ec2 where ff = x1 and x1 = '42'::int8alias2;

line 132 => error: Parse error on line 1: explain (costs off) select ---------^ Expecting 'LPAR', 'SEARCH', 'SELECT', got 'LITERAL'
```

#### ☓ Ran 96 statements

* 64 failed
* 9 not run (inside a transaction that had an error)
* 26% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 180/238 `pg/sql/advisory_lock.sql`

#### ☓ Ran 38 statements

* 21 failed
* 9 not run (inside a transaction that had an error)
* 27% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 181/238 `pg/sql/json.sql`

```sql
SELECT test_json->'field2' FROM test_json WHERE json_type = 'object';

line 225 => error: Parse error on line 1: SELECT test_json->'field2'FROM test_j ------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'LPAR', 'NUMBER', 'IF', 'CURRENT_DATE', 'REPLACE', 'DATEADD', 'DATEDIFF', 'TIMESTAMPDIFF', 'INTERVAL', got 'STRING'
```

```sql
select '"foo"'::json #>> array['z'];

line 411 => error: Parse error on line 1: ...elect '"foo"'::json #>> array['z']; -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'EOF', 'WITH', 'COMMA', 'AS', 'RPAR', 'PIVOT', 'UNPIVOT', 'IN', 'REMOVE', 'LIKE', 'ARROW', 'DOT', 'ORDER', 'CARET', 'EQ', 'WHERE', 'N…
```

```sql
DROP DOMAIN j_ordered_pair;

line 631 => error: Parse error on line 1: DROP DOMAIN j_ordered_pair; ------------^ Expecting 'DATABASE', got 'LITERAL'
```

```sql
SELECT json_object_agg(1, NULL::json);

line 699 => error: Cannot convert string to JSON
```

```sql
select ts_headline('{}'::json, tsquery('aaa & bbb'));

line 910 => error: alasql.fn["tsquery"] is not a function. (In 'alasql.fn["tsquery"]('aaa & bbb')', 'alasql.fn["tsquery"]' is undefined)
```

#### ☓ Ran 476 statements

* 354 failed
* 3 not run (inside a transaction that had an error)
* 25% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 182/238 `pg/sql/stats_rewrite.sql`

#### ☓ Ran 169 statements

* 43 failed
* 113 not run (inside a transaction that had an error)
* 23% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 183/238 `pg/sql/jsonb.sql`

```sql
SELECT test_json ->> 'field2' FROM test_jsonb WHERE json_type = 'scalar';

line 165 => error: Parse error on line 1: SELECT test_json ->> 'field2' FROM test -------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'LPAR', 'NUMBER', 'IF', 'CURRENT_DATE', 'REPLACE', 'DATEADD', 'DATEDIFF', 'TIMESTAMPDIFF', 'INTERVAL', got 'GT'
```

```sql
SELECT '{"a":"b"}'::jsonb <@ '{"a":"b", "b":1, "c":null}';

line 259 => error: Unexpected identifier 'a'. Expected ')' to end a compound expression.
```

```sql
SELECT count(*) from testjsonb WHERE j->'array' ? '5'::text;

line 308 => error: Parse error on line 1: ...testjsonb WHERE j->'array' ? '5'::text; -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'LPAR', 'NUMBER', 'IF', 'CURRENT_DATE', 'REPLACE', 'DATEADD', 'DATEDIFF', 'TIMESTAMPDIFF', 'INTERVAL', got 'STRING'
```

```sql
select '{"a": {"b":{"c": "foo"}}}'::jsonb #> array['a','b'];

line 523 => error: Parse error on line 1: ...": "foo"}}}'::jsonb #> array['a','b']; -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'EOF', 'WITH', 'COMMA', 'AS', 'RPAR', 'PIVOT', 'UNPIVOT', 'IN', 'REMOVE', 'LIKE', 'ARROW', 'DOT', 'ORDER', 'CARET', 'EQ', 'WHERE',…
```

```sql
create type jsb_char2 as (a char(2));

line 704 => error: Parse error on line 1: create type jsb_char2 as (a char ------------^ Expecting 'DATABASE', got 'LITERAL'
```

```sql
SELECT count(*) FROM testjsonb WHERE j @> '{"wait":"CC"}';

line 877 => error: Parse error on line 1: ...M testjsonb WHERE j @> '{"wait":"CC"}'; -----------------------^ Expecting 'EOF', 'WITH', 'RPAR', 'IN', 'LIKE', 'ARROW', 'DOT', 'ORDER', 'CARET', 'EQ', 'SLASH', 'EXCLAMATION', 'MODULO', 'GT', 'LT', 'GTGT', 'LTLT', 'NOT', 'UNION', 'INTERSECT', 'EXCEPT', 'AND', 'OR', …
```

```sql
SELECT '{"ff":{"a":12,"b":16},"qq":123,"x":[1,2],"Y":null}'::jsonb -> 'ff', '{"ff":{"a":12,"b":16},"qq":123,"x":[1,2],"Y":null}'::jsonb -> 'qq', ('{"ff":{"a":12,"b":16},"qq":123,"x":[1,2],"Y":null}'::jsonb -> 'Y') IS NULL AS f, ('{"ff":{"a":12,"b":16},"qq":123,"x":[1,2],"Y":null}'::jsonb ->> 'Y') I…

line 1015 => error: Parse error on line 2: ...Y":null}'::jsonb -> 'ff', '{"ff":{"a": -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'LPAR', 'NUMBER', 'IF', 'CURRENT_DATE', 'REPLACE', 'DATEADD', 'DATEDIFF', 'TIMESTAMPDIFF', 'INTERVAL', got 'STRING'
```

```sql
select '"a"'::jsonb || '{"a":1}';

line 1172 => rows differ (in any order): expected ["a", {"a": 1}], got "a"{"a":1}
```

```sql
select jsonb_insert('{"a": {"b": "value"}}', '{a, c}', '"new_value"', true);

line 1333 => error: alasql.fn["jsonb_insert"] is not a function. (In 'alasql.fn["jsonb_insert"]('{\"a\": {\"b\": \"value\"}}','{a, c}','\"new_value\"',true)', 'alasql.fn["jsonb_insert"]' is undefined)
```

```sql
select to_tsvector('""'::jsonb);

line 1564 => error: alasql.fn["to_tsvector"] is not a function. (In 'alasql.fn["to_tsvector"](alasql.stdfn.CONVERT('\"\"', { dbtypeid: "jsonb", dbsize: undefined, dbprecision: undefined, style: undefined }))', 'alasql.fn["to_tsvector"]' is undefined)
```

#### ☓ Ran 1,111 statements

* 895 failed
* 1 not checked (expected output the runner does not read)
* 3 not run (inside a transaction that had an error)
* 19% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 184/238 `pg/sql/json_encoding.sql`

#### ☓ Ran 44 statements

* 30 failed
* 31% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 185/238 `pg/sql/jsonpath.sql`

```sql
select '$.g ? (@.a == 1 && @.a == 4)'::jsonpath;

line 41 => rows differ (in any order): expected $."g"?(@."a" == 1 && @."a" == 4), got $.g ? (@.a == 1 && @.a == 4)
```

```sql
select '$.replace("hello")'::jsonpath;

line 95 => expected an error (syntax error at or near ")" of jsonpath input), got 1 rows
```

```sql
select '$.trim(42)'::jsonpath;

line 109 => expected an error (syntax error at or near "(" of jsonpath input), got 1 rows
```

```sql
select '$ ? (@.a < +1e-1)'::jsonpath;

line 186 => rows differ (in any order): expected $?(@."a" < 0.1), got $ ? (@.a < +1e-1)
```

#### ☓ Ran 260 statements

* 204 failed
* 21% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 186/238 `pg/sql/jsonpath_encoding.sql`

```sql
select '$."dollar \u0024 character"'::jsonpath as correct_everywhere;

line 56 => rows differ (in any order): expected $."dollar $ character", got $."dollar \u0024 character"
```

#### ☓ Ran 32 statements

* 28 failed
* 12% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 187/238 `pg/sql/sqljson.sql`

```sql
SELECT JSON_ARRAY('a', NULL, 'b' ABSENT ON NULL);

line 197 => error: Parse error on line 1: ...RAY('a', NULL, 'b' ABSENT ON NULL); -----------------------^ Expecting 'EOF', 'COMMA', 'RPAR', 'IN', 'LIKE', 'ARROW', 'DOT', 'CARET', 'EQ', 'SLASH', 'EXCLAMATION', 'MODULO', 'GT', 'LT', 'GTGT', 'LTLT', 'NOT', 'AND', 'OR', 'PLUS', 'STAR', 'RBRA', 'END', 'ELSE', 'REGE…
```

```sql
CREATE VIEW domain_isjson AS WITH cte(a) AS (VALUES('{"a": 1, "a": 2}')) SELECT a::jd1 IS JSON WITH UNIQUE KEYS as jd1, a::jd3 IS JSON WITH UNIQUE KEYS as jd3, a::jd4 IS JSON WITH UNIQUE KEYS as jd4 FROM cte;

line 604 => error: Parse error on line 1: ...EW domain_isjson ASWITH cte(a) AS (VALU ----------------------^ Expecting 'LPAR', 'SEARCH', 'SELECT', got 'WITH'
```

#### ☓ Ran 332 statements

* 225 failed
* 1 not checked (expected output the runner does not read)
* 32% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 188/238 `pg/sql/sqljson_queryfuncs.sql`

```sql
SELECT JSON_VALUE(jsonb 'null', '$a' PASSING point ' (1, 2 )' AS a RETURNING point ERROR ON ERROR);

line 133 => error: Parse error on line 1: ...CT JSON_VALUE(jsonb 'null', '$a' PASSING -----------------------^ Expecting 'EOF', 'COMMA', 'RPAR', 'IN', 'LIKE', 'ARROW', 'DOT', 'CARET', 'EQ', 'SLASH', 'EXCLAMATION', 'MODULO', 'GT', 'LT', 'GTGT', 'LTLT', 'NOT', 'AND', 'OR', 'PLUS', 'STAR', 'RBRA', 'END', 'ELSE', …
```

```sql
CREATE INDEX ON test_jsonb_mutability (JSON_QUERY(js, '$.split_part(",", 2)'));

line 420 => error: Parse error on line 1: CREATE INDEX ON test_jsonb_mutabi -------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'DQSTRING', got 'ON'
```

#### ☓ Ran 333 statements

* 212 failed
* 36% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 189/238 `pg/sql/jsonb_jsonpath.sql`

```sql
select jsonb_path_query('[12, {"a": 13}, {"b": 14}]', 'lax $[0 to 10].a');

line 78 => error: alasql.fn["jsonb_path_query"] is not a function. (In 'alasql.fn["jsonb_path_query"]('[12, {\"a\": 13}, {\"b\": 14}]','lax $[0 to 10].a')', 'alasql.fn["jsonb_path_query"]' is undefined)
```

```sql
select jsonb_path_query('[1,2,0,3]', '$[*] ? (2 / @ > 0)');

line 218 => error: alasql.fn["jsonb_path_query"] is not a function. (In 'alasql.fn["jsonb_path_query"]('[1,2,0,3]','$[*] ? (2 / @ > 0)')', 'alasql.fn["jsonb_path_query"]' is undefined)
```

```sql
select jsonb_path_query('"10-03-2017"', '$.datetime("dd-mm-yyyy").type()');

line 373 => error: alasql.fn["jsonb_path_query"] is not a function. (In 'alasql.fn["jsonb_path_query"]('\"10-03-2017\"','$.datetime(\"dd-mm-yyyy\").type()')', 'alasql.fn["jsonb_path_query"]' is undefined)
```

```sql
select jsonb_path_query('"+123"', '$.integer()');

line 559 => error: alasql.fn["jsonb_path_query"] is not a function. (In 'alasql.fn["jsonb_path_query"]('\"+123\"','$.integer()')', 'alasql.fn["jsonb_path_query"]' is undefined)
```

```sql
select jsonb '"12:34:56"' @? '$.time()';

line 752 => error: Parse error on line 1: ... jsonb '"12:34:56"' @? '$.time()'; -----------------------^ Expecting 'EOF', 'WITH', 'COMMA', 'RPAR', 'PIVOT', 'UNPIVOT', 'REMOVE', 'ORDER', 'WHERE', 'UNION', 'INTERSECT', 'EXCEPT', 'FROM', 'INTO', 'GROUP', 'LIMIT', 'OFFSET', 'END', 'ELSE', 'OUTPUT', 'GO', 'SEMICOLO…
```

```sql
select jsonb_path_query_tz( '["2017-03-10", "2017-03-11", "2017-03-09", "2017-03-10 00:00:00", "2017-03-10 12:34:56", "2017-03-10 01:02:03+04", "2017-03-10 03:00:00+03"]', '$[*].datetime() ? (@ >= "2017-03-10".date())');

line 954 => error: alasql.fn["jsonb_path_query_tz"] is not a function. (In 'alasql.fn["jsonb_path_query_tz"]('[\"2017-03-10\", \"2017-03-11\", \"2017-03-09\", \"2017-03-10 00:00:00\", \"2017-03-10 12:34:56\", \"2017-03-10 01:02:03+04\", \"2017-03-10 03:00:00+03\"]','$[*].datetime() ? (@ >= \"2017-03-10\".date(…
```

#### ☓ Ran 928 statements

* 639 failed
* 4 not run (inside a transaction that had an error)
* 30% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 190/238 `pg/sql/sqljson_jsontable.sql`

```sql
CREATE VIEW jsonb_table_view6 AS SELECT * FROM JSON_TABLE( jsonb 'null', 'lax $[*]' PASSING 1 + 2 AS a, json '"foo"' AS "b c" COLUMNS ( js2 json PATH '$', jsb2w jsonb PATH '$' WITH WRAPPER, jsb2q jsonb PATH '$' OMIT QUOTES, ia int[] PATH '$', ta text[] PATH '$', jba jsonb[] PATH '$'));

line 188 => error: Parse error on line 4: ...JSON_TABLE( jsonb 'null', 'lax $[*]' P ----------------------^ Expecting 'EOF', 'COMMA', 'RPAR', 'IN', 'LIKE', 'ARROW', 'DOT', 'CARET', 'EQ', 'SLASH', 'EXCLAMATION', 'MODULO', 'GT', 'LT', 'GTGT', 'LTLT', 'NOT', 'AND', 'OR', 'PLUS', 'STAR', 'RBRA', 'END', 'ELSE', 'RE…
```

#### ☓ Ran 156 statements

* 103 failed
* 33% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 191/238 `pg/sql/plancache.sql`

```sql
select cache_test(2);

line 74 => error: alasql.fn["cache_test"] is not a function. (In 'alasql.fn["cache_test"](2)', 'alasql.fn["cache_test"]' is undefined)
```

#### ☓ Ran 97 statements

* 86 failed
* 11% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 192/238 `pg/sql/limit.sql`

#### ☓ Ran 80 statements

* 31 failed
* 36 not run (inside a transaction that had an error)
* 29% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 193/238 `pg/sql/merge.sql`

```sql
CREATE USER regress_merge_none;

line 7 => error: Parse error on line 1: CREATE USER regress_merge_none; ------------^ Expecting 'DATABASE', got 'LITERAL'
```

```sql
SELECT * FROM wq_target;

line 602 => error: Table does not exist: wq_target
```

```sql
DROP TABLE pa_target CASCADE;

line 1436 => error: Parsing halted while starting to recover from another error.
```

```sql
DROP USER regress_merge_privs;

line 1839 => error: Parse error on line 1: DROP USER regress_merge_privs; ----------^ Expecting 'DATABASE', got 'LITERAL'
```

#### ☓ Ran 572 statements

* 305 failed
* 1 not checked (expected output the runner does not read)
* 64 not run (inside a transaction that had an error)
* 39% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 194/238 `pg/sql/plpgsql.sql`

```sql
update PSlot set slotlink = 'PS.not.there' where slotname = 'PS.base.a1';

line 1412 => expected an error (PS.not.there         does not exist), got success
```

```sql
create function refcursor_test2(int, int) returns boolean as $$ declare c1 cursor (param1 int, param2 int) for select * from rc_test where a > param1 and b > param2; nonsense record; begin open c1($1, $2); fetch c1 into nonsense; close c1; if found then return true; else return false; end if; end $…

line 1917 => error: Parse error on line 1: ...tion refcursor_test2(int, int) returns b -----------------------^ Expecting 'AS', got 'LPAR'
```

```sql
do $$ declare x int; y int; begin select 1 into x, y; select 1,2 into x, y; select 1,2,3 into x, y; end $$;

line 2645 => error: Parse error on line 1: do $$declare x int; ---^ Expecting 'EOF', 'COMMA', 'LPAR', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'DOLLAR'
```

```sql
explain (verbose, costs off) select error_trap_test();

line 3435 => error: Parse error on line 1: explain (verbose, costs off) ---------^ Expecting 'LPAR', 'SEARCH', 'SELECT', got 'LITERAL'
```

```sql
create or replace function foreach_test(anyarray) returns void as $$ declare r record; begin foreach r in array $1 loop raise notice '%', r; end loop; end; $$ language plpgsql;

line 4029 => error: Parse error on line 1: create or replace function -------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'CLASS', 'VERTEX', 'EDGE', 'UNIQUE', 'INDEX', 'FUNCTION', 'AGGREGATE', 'TABLE', 'TEMP', 'DATABASE', 'VIEW', 'GRAPH', 'TRIGGER', got 'OR'
```

```sql
CREATE TABLE pt_part1 PARTITION OF partitioned_table FOR VALUES IN (1);

line 4715 => error: Parse error on line 1: ...EATE TABLE pt_part1 PARTITION OF partiti -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'EOF', 'EndTransaction', 'WITH', 'COMMA', 'AS', 'LPAR', 'RPAR', 'SEARCH', 'PIVOT', 'FOR', 'UNPIVOT', 'IN', 'REMOVE', 'LIKE', 'AR…
```

#### ☓ Ran 935 statements

* 605 failed
* 15 not run (inside a transaction that had an error)
* 34% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 195/238 `pg/sql/domain.sql`

```sql
insert into dcomptable (d1[1].r) values(99);

line 249 => error: Parse error on line 1: ... into dcomptable (d1[1].r) values(99); -----------------------^ Expecting 'COMMA', 'RPAR', 'IN', 'LIKE', 'ARROW', 'DOT', 'CARET', 'EQ', 'SLASH', 'EXCLAMATION', 'MODULO', 'GT', 'LT', 'GTGT', 'LTLT', 'NOT', 'AND', 'OR', 'PLUS', 'STAR', 'REGEXP', 'TILDA', 'GLOB', 'NOT_…
```

```sql
select * from domview;

line 549 => expected an error (domain dom does not allow null values), got 0 rows
```

```sql
select pg_basetype('mytext'::regtype);

line 880 => error: alasql.fn["pg_basetype"] is not a function. (In 'alasql.fn["pg_basetype"](alasql.stdfn.CONVERT('mytext', { dbtypeid: "regtype", dbsize: undefined, dbprecision: undefined, style: undefined }))', 'alasql.fn["pg_basetype"]' is undefined)
```

#### ☓ Ran 482 statements

* 302 failed
* 37% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 196/238 `pg/sql/rangefuncs.sql`

```sql
DROP VIEW vw_getrngfunc;

line 166 => error: Can not drop table "vw_getrngfunc" because it does not exist in the database.
```

```sql
SELECT * FROM rngfunc(42);

line 349 => error: alasql.from["RNGFUNC"] is not a function. (In 'alasql.from["RNGFUNC"](42,null,cb,idx,query)', 'alasql.from["RNGFUNC"]' is undefined)
```

```sql
select testrngfunc();

line 616 => error: alasql.fn["testrngfunc"] is not a function. (In 'alasql.fn["testrngfunc"]()', 'alasql.fn["testrngfunc"]' is undefined)
```

#### ☓ Ran 428 statements

* 349 failed
* 17 not run (inside a transaction that had an error)
* 15% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 197/238 `pg/sql/prepare.sql`

#### ☓ Ran 33 statements

* 27 failed
* 1 not checked (expected output the runner does not read)
* 15% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 198/238 `pg/sql/conversion.sql`

```sql
select description, (test_conv(inbytes, 'utf8', 'utf8')).* from utf8_verification_inputs;

line 121 => error: Parse error on line 1: ...s, 'utf8', 'utf8')).* from utf8_verifica -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'LPAR', 'NUMBER', 'IF', 'CURRENT_DATE', 'REPLACE', 'DATEADD', 'DATEDIFF', 'TIMESTAMPDIFF', 'INTERVAL', got 'STAR'
```

#### ☓ Ran 55 statements

* 38 failed
* 30% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 199/238 `pg/sql/copy2.sql`

```sql
COPY x (b, c, d, e) from stdin delimiter ',' null 'x';

line 161 => error: extra data after last expected column
```

```sql
COPY testnl FROM stdin CSV;

line 261 => error: missing data for column "c"
```

```sql
DROP TABLE vistest;

line 698 => error: Can not drop table "vistest" because it does not exist in the database.
```

#### ☓ Ran 307 statements

* 105 failed
* 25 not checked (expected output the runner does not read)
* 26 not run (inside a transaction that had an error)
* 58% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 200/238 `pg/sql/truncate.sql`

```sql
DROP TABLE truncparted;

line 246 => error: Can not drop table "truncparted" because it does not exist in the database.
```

#### ☓ Ran 193 statements

* 111 failed
* 18 not run (inside a transaction that had an error)
* 36% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 201/238 `pg/sql/temp.sql`

```sql
UPDATE test_temp SET cnt = cnt + 1 WHERE a = -1;

line 404 => error: undefined is not an object (evaluating 'alasql.databases[databaseid].tables[tableid].onupdatefns')
```

#### ☓ Ran 207 statements

* 67 failed
* 74 not run (inside a transaction that had an error)
* 49% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 202/238 `pg/sql/foreign_key.sql`

```sql
REVOKE UPDATE ON PKTABLE FROM regress_foreign_key_user;

line 352 => error: Parse error on line 1: REVOKE UPDATE ON PKTABLE FR -------^ Expecting 'EOF', 'COMMA', 'LPAR', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'UPDATE'
```

```sql
INSERT INTO FKTABLE VALUES (NULL, 2, 3, 2);

line 415 => error: Invalid foreign key on table fktable
```

```sql
INSERT INTO fktable VALUES (100, 200);

line 950 => error: Foreign key "200" not found in table "pktable"
```

```sql
SELECT conname, convalidated, conrelid::regclass FROM pg_constraint WHERE conrelid::regclass::text like 'fk_partitioned_fk%' ORDER BY conname COLLATE "C";

line 1572 => error: Parse error on line 2: ... BY conname COLLATE "C"; -----------------------^ Expecting 'NOCASE', got 'DQSTRING'
```

```sql
ALTER TABLE fk_partitioned_fk_6 ATTACH PARTITION fk_partitioned_fk_6_1 FOR VALUES IN (1);

line 1847 => error: Parse error on line 1: ...fk_partitioned_fk_6 ATTACH PARTITION fk_ -----------------------^ Expecting 'LITERAL', 'EOF', 'COMMA', 'AS', 'LPAR', 'RPAR', 'SEARCH', 'DOT', 'WHERE', 'DOLLAR', 'AT', 'SET', 'TO', 'VALUE', 'COLON', 'NOT', 'QUESTION', 'UNIQUE', 'SELECT', 'INDEX', 'ON', 'NULL', 'BRAQU…
```

```sql
CREATE TABLE droppk2 PARTITION OF droppk FOR VALUES FROM (1000) TO (2000) PARTITION BY RANGE (a);

line 2136 => error: Parse error on line 1: ...REATE TABLE droppk2 PARTITION OF droppk -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'EOF', 'EndTransaction', 'WITH', 'COMMA', 'AS', 'LPAR', 'RPAR', 'SEARCH', 'PIVOT', 'FOR', 'UNPIVOT', 'IN', 'REMOVE', 'LIKE', 'ARR…
```

```sql
DROP TABLE fk;

line 2327 => error: Can not drop table "fk" because it does not exist in the database.
```

```sql
ALTER TABLE fk_r_1 DROP COLUMN x;

line 2568 => error: undefined is not an object (evaluating 'table.columns')
```

#### ☓ Ran 1,646 statements

* 777 failed
* 218 not run (inside a transaction that had an error)
* 45% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 203/238 `pg/sql/polymorphism.sql`

```sql
select polyf(2, 4) as int, polyf(2, 4.5) as num;

line 60 => error: alasql.fn["polyf"] is not a function. (In 'alasql.fn["polyf"](2,4)', 'alasql.fn["polyf"]' is undefined)
```

```sql
SELECT array_larger_accum(i) FROM (VALUES (ARRAY[row(1,2),row(3,4)]), (ARRAY[row(5,6),row(7,8)])) as t(i);

line 582 => error: Parse error on line 2: ...FROM (VALUES (ARRAY[row(1,2),row(3,4)]), -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'LPAR', 'NUMBER', 'SHARP', 'DOLLAR', 'AT', 'VALUE', 'COLON', 'NOT', 'IF', 'PLUS', 'STAR', 'QUESTION', 'INSERTED', 'FIRST', 'LAST…
```

```sql
select (dfunc('Hello World', 20, '2009-07-25'::date)).*;

line 902 => error: Parse error on line 1: ...2009-07-25'::date)).*; -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'LPAR', 'NUMBER', 'IF', 'CURRENT_DATE', 'REPLACE', 'DATEADD', 'DATEDIFF', 'TIMESTAMPDIFF', 'INTERVAL', got 'STAR'
```

```sql
drop function anyctest(variadic anycompatiblearray);

line 1157 => error: Parse error on line 1: drop function anyctest(va -----^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'CLASS', 'INDEX', 'TABLE', 'DATABASE', 'VIEW', 'TRIGGER', got 'FUNCTION'
```

#### ☓ Ran 436 statements

* 317 failed
* 1 not checked (expected output the runner does not read)
* 27% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 204/238 `pg/sql/rowtypes.sql`

```sql
select row(1, 3)::testtype1 *>= row(1, 2)::testtype1;

line 269 => error: Parse error on line 1: select row(1, 3)::testtype1 *>= ------------^ Expecting 'RPAR', 'IN', 'LIKE', 'ARROW', 'DOT', 'CARET', 'EQ', 'SLASH', 'EXCLAMATION', 'MODULO', 'GT', 'LT', 'GTGT', 'LTLT', 'NOT', 'AND', 'OR', 'PLUS', 'STAR', 'REGEXP', 'TILDA', 'GLOB', 'NOT_LIKE', 'BARBAR', 'MINUS', 'AMP…
```

#### ☓ Ran 237 statements

* 182 failed
* 6 not run (inside a transaction that had an error)
* 21% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 205/238 `pg/sql/returning.sql`

```sql
UPDATE foo SET f4 = f4 + f3 WHERE f4 = 99 RETURNING *;

line 66 => error: Parse error on line 1: ... + f3 WHERE f4 = 99 RETURNING *; -----------------------^ Expecting 'EOF', 'IN', 'LIKE', 'ARROW', 'DOT', 'CARET', 'EQ', 'SLASH', 'EXCLAMATION', 'MODULO', 'GT', 'LT', 'GTGT', 'LTLT', 'NOT', 'AND', 'OR', 'PLUS', 'STAR', 'END', 'ELSE', 'REGEXP', 'TILDA', 'GLOB', 'NOT_L…
```

```sql
EXPLAIN (VERBOSE, COSTS OFF) WITH x AS (UPDATE returning_e2 SET c = c + 1 RETURNING WITH (OLD AS o, NEW AS n) n.k, o.c AS oc) UPDATE returning_e1 SET c = c + 1 RETURNING WITH (OLD AS p) p.c, (SELECT count(*) FROM x WHERE x.oc = p.c) AS m;

line 443 => error: Parse error on line 1: EXPLAIN (VERBOSE, COSTS OFF) ---------^ Expecting 'LPAR', 'SEARCH', 'SELECT', got 'LITERAL'
```

#### ☓ Ran 159 statements

* 121 failed
* 23% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 206/238 `pg/sql/with.sql`

```sql
WITH q1(x,y) AS (SELECT 1,2) SELECT * FROM q1, q1 AS q2;

line 6 => error: renameColumns is not defined
```

```sql
WITH outermost(x) AS ( SELECT 1 UNION (WITH innermost as (SELECT 2) SELECT * FROM innermost UNION SELECT 3) ) SELECT * FROM outermost ORDER BY 1;

line 1143 => error: Parse error on line 3: ... SELECT 1 UNION (WITH innermost as (S ----------------------^ Expecting 'LPAR', 'SEARCH', 'SELECT', got 'WITH'
```

```sql
INSERT INTO child2 VALUES ( 23, 'c21' ),( 24, 'c22' );

line 1667 => error: Table 'child2' could not be found
```

#### ☓ Ran 311 statements

* 219 failed
* 1 not run (inside a transaction that had an error)
* 29% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 207/238 `pg/sql/union.sql`

```sql
create type ct1 as (f1 varbit);

line 244 => error: Parse error on line 1: create type ct1 as (f1 varbit); ------------^ Expecting 'DATABASE', got 'LITERAL'
```

#### ☓ Ran 216 statements

* 177 failed
* 18% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 208/238 `pg/sql/xml.sql`

```sql
INSERT INTO xmltest VALUES (3, '<value>three</wrong> ');

line 8 => expected an error (invalid XML content), got success
```

```sql
SELECT xml '<!-- in SQL:2006+ a doc is content too--> <?y z?> <!DOCTYPE a><a/>';

line 249 => error: undefined is not an object (evaluating 'query.sources[0].databaseid')
```

```sql
EXPLAIN (VERBOSE, FORMAT JSON, COSTS OFF) SELECT f.* FROM xmldata, LATERAL xmltable('/ROWS/ROW[COUNTRY_NAME="Japan" or COUNTRY_NAME="India"]' PASSING data COLUMNS "COUNTRY_NAME" text, "REGION_ID" int) AS f WHERE "COUNTRY_NAME" = 'Japan';

line 564 => error: Parse error on line 1: EXPLAIN (VERBOSE, FORMAT JSON ---------^ Expecting 'LPAR', 'SEARCH', 'SELECT', got 'LITERAL'
```

#### ☓ Ran 274 statements

* 217 failed
* 1 not checked (expected output the runner does not read)
* 20% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 209/238 `pg/sql/sequence.sql`

```sql
ALTER SEQUENCE sequence_test2 RESTART WITH -24 START WITH -24 INCREMENT BY -4 MINVALUE -36 MAXVALUE -5 CYCLE;

line 207 => error: Parse error on line 1: ALTER SEQUENCE sequence_te ------^ Expecting 'TABLE', got 'LITERAL'
```

#### ☓ Ran 261 statements

* 140 failed
* 53 not run (inside a transaction that had an error)
* 32% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 210/238 `pg/sql/partition_join.sql`

```sql
SELECT t1.a, ss.t2a, ss.t2c FROM prt1 t1 LEFT JOIN LATERAL (SELECT t2.a AS t2a, t3.a AS t3a, t2.b t2b, t2.c t2c, least(t1.a,t2.a,t3.a) FROM prt1 t2 JOIN prt2 t3 ON (t2.a = t3.b)) ss ON t1.c = ss.t2c WHERE (t1.b + coalesce(ss.t2b, 0)) = 0 ORDER BY t1.a;

line 109 => error: Parse error on line 2: ... JOIN LATERAL (SELECT t2.a AS t2a, ----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'LPAR', 'RPAR', 'NUMBER', 'SHARP', 'DOLLAR', 'AT', 'VALUE', 'COLON', 'NOT', 'IF', 'ALL', 'PLUS', 'STAR', 'QUESTION', 'DISTINCT', 'INSER…
```

```sql
CREATE TABLE plt1_p2 PARTITION OF plt1 FOR VALUES IN ('0001', '0005', '0002', '0009');

line 335 => error: Parse error on line 1: ...REATE TABLE plt1_p2 PARTITION OF plt1 FO -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'EOF', 'EndTransaction', 'WITH', 'COMMA', 'AS', 'LPAR', 'RPAR', 'SEARCH', 'PIVOT', 'FOR', 'UNPIVOT', 'IN', 'REMOVE', 'LIKE', 'AR…
```

```sql
CREATE TABLE prt2_n_p2 PARTITION OF prt2_n FOR VALUES IN ('0001', '0005', '0002', '0009', '0008', '0011');

line 531 => error: Parse error on line 1: ...ATE TABLE prt2_n_p2 PARTITION OF prt2_n -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'EOF', 'EndTransaction', 'WITH', 'COMMA', 'AS', 'LPAR', 'RPAR', 'SEARCH', 'PIVOT', 'FOR', 'UNPIVOT', 'IN', 'REMOVE', 'LIKE', 'ARR…
```

```sql
ALTER TABLE prt1_adv DETACH PARTITION prt1_adv_p3;

line 766 => error: Parse error on line 1: ...LTER TABLE prt1_adv DETACH PARTITION prt -----------------------^ Expecting 'LITERAL', 'EOF', 'COMMA', 'AS', 'LPAR', 'RPAR', 'SEARCH', 'DOT', 'WHERE', 'DOLLAR', 'AT', 'SET', 'TO', 'VALUE', 'COLON', 'NOT', 'QUESTION', 'UNIQUE', 'SELECT', 'INDEX', 'ON', 'NULL', 'BRAQU…
```

```sql
DROP TABLE plt2_adv_p2_2;

line 967 => error: Can not drop table "plt2_adv_p2_2" because it does not exist in the database.
```

```sql
CREATE TABLE plt2_adv_p2 PARTITION OF plt2_adv FOR VALUES IN (NULL);

line 1162 => error: Parse error on line 1: ...E TABLE plt2_adv_p2 PARTITION OF plt2_ad -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'EOF', 'EndTransaction', 'WITH', 'COMMA', 'AS', 'LPAR', 'RPAR', 'SEARCH', 'PIVOT', 'FOR', 'UNPIVOT', 'IN', 'REMOVE', 'LIKE', 'AR…
```

#### ☓ Ran 644 statements

* 636 failed
* 2 not run (inside a transaction that had an error)
* 0% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 211/238 `pg/sql/reloptions.sql`

```sql
SELECT reloptions FROM pg_class WHERE oid = 'reloptions_test'::regclass;

line 44 => error: Table does not exist: pg_class
```

#### ☓ Ran 82 statements

* 54 failed
* 34% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 212/238 `pg/sql/hash_part.sql`

#### ☓ Ran 29 statements

* 17 failed
* 41% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 213/238 `pg/sql/partition_aggregate.sql`

```sql
EXPLAIN (COSTS OFF) SELECT a, sum(b order by a) FROM pagg_tab GROUP BY a ORDER BY 1, 2;

line 99 => error: Parse error on line 1: EXPLAIN (COSTS OFF)SELECT a, ---------^ Expecting 'LPAR', 'SEARCH', 'SELECT', got 'LITERAL'
```

#### ☓ Ran 138 statements

* 136 failed
* 1% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 214/238 `pg/sql/partition_info.sql`

```sql
SELECT * FROM pg_partition_tree(NULL);

line 4 => error: alasql.from["PG_PARTITION_TREE"] is not a function. (In 'alasql.from["PG_PARTITION_TREE"](undefined,null,cb,idx,query)', 'alasql.from["PG_PARTITION_TREE"]' is undefined)
```

#### ☓ Ran 78 statements

* 74 failed
* 5% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 215/238 `pg/sql/partition_prune.sql`

```sql
create table rlp (a int, b varchar) partition by range (a);

line 56 => error: Parse error on line 1: ... (a int, b varchar) partition by range ( -----------------------^ Expecting 'LITERAL', 'EOF', 'COLLATE', 'END', 'ELSE', 'DEFAULT', 'IDENTITY', 'GO', 'SEMICOLON', got 'PARTITION'
```

```sql
create table mc2p5 partition of mc2p for values from (2, maxvalue) to (maxvalue, maxvalue);

line 181 => error: Parse error on line 1: create table mc2p5 partition of mc2p fo -------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'EOF', 'EndTransaction', 'WITH', 'COMMA', 'AS', 'LPAR', 'RPAR', 'SEARCH', 'PIVOT', 'FOR', 'UNPIVOT', 'IN', 'REMOVE', 'LIKE', 'ARROW', 'D…
```

```sql
delete from iboolpart where a is null;

line 334 => error: undefined is not an object (evaluating 'table.data')
```

```sql
explain (costs off) select * from hp where a is null and b is null;

line 533 => error: Parse error on line 1: explain (costs off) select * ---------^ Expecting 'LPAR', 'SEARCH', 'SELECT', got 'LITERAL'
```

```sql
table ab;

line 812 => error: Parse error on line 1: table ab; ^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'EOF', 'EXPLAIN', 'EndTransaction', 'WITH', 'LPAR', 'SEARCH', 'EQ', 'SET', 'IF', 'SELECT', 'JAVASCRIPT', 'CREATE', 'REPLACE', 'UPDATE', 'DELETE', 'INSERT', 'DROP', 'ALTER', 'RENAME', 'A…
```

```sql
execute mt_q1(15);

line 1066 => error: alasql.fn["mt_q1"] is not a function. (In 'alasql.fn["mt_q1"](15)', 'alasql.fn["mt_q1"]' is undefined)
```

```sql
create table listp1 partition of listp for values in(1);

line 1259 => error: Parse error on line 1: create table listp1 partition of listp f --------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'EOF', 'EndTransaction', 'WITH', 'COMMA', 'AS', 'LPAR', 'RPAR', 'SEARCH', 'PIVOT', 'FOR', 'UNPIVOT', 'IN', 'REMOVE', 'LIKE', 'ARROW', …
```

```sql
create table phv_part_null partition of phv_part for values in (null);

line 1552 => error: Parse error on line 1: ...table phv_part_null partition of phv_par -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'EOF', 'EndTransaction', 'WITH', 'COMMA', 'AS', 'LPAR', 'RPAR', 'SEARCH', 'PIVOT', 'FOR', 'UNPIVOT', 'IN', 'REMOVE', 'LIKE', 'AR…
```

#### ☓ Ran 810 statements

* 745 failed
* 2 not checked (expected output the runner does not read)
* 10 not run (inside a transaction that had an error)
* 6% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 216/238 `pg/sql/indexing.sql`

```sql
create table idxpart22 partition of idxpart2 for values from (200) to (300);

line 165 => error: Parse error on line 1: ...ate table idxpart22 partition of idxpart -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'EOF', 'EndTransaction', 'WITH', 'COMMA', 'AS', 'LPAR', 'RPAR', 'SEARCH', 'PIVOT', 'FOR', 'UNPIVOT', 'IN', 'REMOVE', 'LIKE', 'AR…
```

```sql
create table idxpart2 partition of idxpart for values from (250) to (500);

line 350 => error: Parse error on line 1: ...eate table idxpart2 partition of idxpart -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'EOF', 'EndTransaction', 'WITH', 'COMMA', 'AS', 'LPAR', 'RPAR', 'SEARCH', 'PIVOT', 'FOR', 'UNPIVOT', 'IN', 'REMOVE', 'LIKE', 'AR…
```

```sql
alter table idxpart1 drop column drop_1;

line 489 => error: Cannot drop column "drop_1" because it was not found in the table idxpart1"
```

```sql
alter table idxpart drop column drop_2;

line 506 => error: undefined is not an object (evaluating 'table.columns')
```

```sql
create table idxpart0 (like idxpart);

line 726 => error: Parse error on line 1: ...ate table idxpart0 (like idxpart); -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'AS', 'DQSTRING', got 'LIKE'
```

```sql
alter table parted_index_col_drop drop column c;

line 883 => error: undefined is not an object (evaluating 'table.columns')
```

#### ☓ Ran 623 statements

* 522 failed
* 1 not checked (expected output the runner does not read)
* 11 not run (inside a transaction that had an error)
* 14% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 217/238 `pg/sql/memoize.sql`

```sql
RESET parallel_setup_cost;

line 248 => error: Parse error on line 1: RESET parallel_setup_cost; ------^ Expecting 'EOF', 'COMMA', 'LPAR', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'LITERAL'
```

#### ☓ Ran 82 statements

* 66 failed
* 19% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 218/238 `pg/sql/explain.sql`

#### ☓ Ran 61 statements

* 41 failed
* 3 not checked (expected output the runner does not read)
* 2 not run (inside a transaction that had an error)
* 26% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 219/238 `pg/sql/predicate.sql`

```sql
EXPLAIN (COSTS OFF) SELECT * FROM pred_tab WHERE (CASE WHEN c > 0 THEN b ELSE a END) IS NULL;

line 284 => error: Parse error on line 1: EXPLAIN (COSTS OFF)SELECT * ---------^ Expecting 'LPAR', 'SEARCH', 'SELECT', got 'LITERAL'
```

#### ☓ Ran 137 statements

* 103 failed
* 24% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 220/238 `pg/sql/numa.sql`

#### ☓ Ran 3 statements

* 3 failed
* 0% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 221/238 `pg/sql/largeobject.sql`

#### ☓ Ran 127 statements

* 39 failed
* 38 not run (inside a transaction that had an error)
* 56% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 222/238 `pg/sql/eager_aggregate.sql`

```sql
SELECT t1.a, avg(t2.c) FROM eager_agg_t1 t1 JOIN eager_agg_t2 t2 ON t1.b = t2.b GROUP BY t1.a ORDER BY t1.a;

line 31 => expected 9 rows, got 0
```

#### ☓ Ran 125 statements

* 104 failed
* 16% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 223/238 `pg/sql/planner_est.sql`

```sql
SELECT explain_mask_costs($$ SELECT * FROM generate_series(TIMESTAMPTZ '2024-02-01', TIMESTAMPTZ '2024-03-01', INTERVAL '1 day', 'UTC') g(s);$$, true, true, false, true);

line 66 => error: Parse error on line 1: ...explain_mask_costs($$SELECT * FROM gene -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'NUMBER', got 'DOLLAR'
```

#### ☓ Ran 22 statements

* 21 failed
* 4% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 224/238 `pg/sql/compression.sql`

#### ☓ Ran 60 statements

* 48 failed
* 20% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 225/238 `pg/sql/compression_lz4.sql`

```sql
ALTER TABLE cmdata_pglz ALTER COLUMN f1 SET COMPRESSION pglz;

line 100 => error: Parse error on line 1: ...R TABLE cmdata_pglz ALTER COLUMN f1 SET -----------------------^ Expecting 'LITERAL', 'EOF', 'COMMA', 'AS', 'LPAR', 'RPAR', 'SEARCH', 'DOT', 'WHERE', 'DOLLAR', 'AT', 'SET', 'TO', 'VALUE', 'COLON', 'NOT', 'QUESTION', 'UNIQUE', 'SELECT', 'INDEX', 'ON', 'NULL', 'BRAQUE…
```

#### ☓ Ran 67 statements

* 48 failed
* 28% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 226/238 `pg/sql/tuplesort.sql`

#### ☓ Ran 108 statements

* 26 failed
* 54 not run (inside a transaction that had an error)
* 51% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 227/238 `pg/sql/compression_pglz.sql`

#### ☓ Ran 18 statements

* 7 failed
* 61% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 228/238 `pg/sql/oidjoins.sql`

#### ☓ Ran 1 statements

* 1 failed
* 0% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 229/238 `pg/sql/tidscan.sql`

#### ☓ Ran 49 statements

* 28 failed
* 12 not run (inside a transaction that had an error)
* 24% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 230/238 `pg/sql/event_trigger_login.sql`

#### ☓ Ran 11 statements

* 9 failed
* 18% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 231/238 `pg/sql/event_trigger.sql`

```sql
create procedure p1() language plpgsql as $$ begin create table event_trigger_fire7 (a int); end $$;

line 122 => error: Parse error on line 1: create procedure p1()language plpgsq -----------------^ Expecting 'DATABASE', got 'LITERAL'
```

```sql
CREATE EVENT TRIGGER regress_reindex_end_snap ON ddl_command_end EXECUTE FUNCTION reindex_end_command_snap();

line 507 => error: Parse error on line 1: CREATE EVENT TRIGGER regress_rein -------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'EOF', 'EndTransaction', 'WITH', 'COMMA', 'AS', 'LPAR', 'RPAR', 'SEARCH', 'PIVOT', 'FOR', 'UNPIVOT', 'IN', 'REMOVE', 'LIKE', 'ARROW', 'DOT', 'ORDER'…
```

#### ☓ Ran 232 statements

* 172 failed
* 5 not run (inside a transaction that had an error)
* 24% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 232/238 `pg/sql/alter_table.sql`

```sql
DROP TABLE alter_idx_rename_test_2;

line 259 => error: Can not drop table "alter_idx_rename_test_2" because it does not exist in the database.
```

```sql
insert into atacc3 (test2) values (3);

line 619 => error: Table 'atacc3' could not be found
```

```sql
select a,b,c,d from atacc1;

line 1031 => expected an error (column "a" does not exist), got 1 rows
```

```sql
insert into atacc1 (b,c,d) values (11,12,13);

line 1052 => error: Wrong NULL value in NOT NULL column a
```

```sql
alter table p1 drop column f1;

line 1262 => error: Cannot drop column "f1" because it was not found in the table p1"
```

```sql
drop domain mytype cascade;

line 1364 => error: Parse error on line 1: drop domain mytype cascade; ------------^ Expecting 'DATABASE', got 'LITERAL'
```

```sql
CREATE FUNCTION check_ddl_rewrite(p_tablename regclass, p_ddl text) RETURNS boolean LANGUAGE plpgsql AS $$ DECLARE v_relfilenode oid; BEGIN v_relfilenode := relfilenode FROM pg_class WHERE oid = p_tablename; EXECUTE p_ddl; RETURN v_relfilenode <> (SELECT relfilenode FROM pg_class WHERE oid = p_tabl…

line 1703 => error: Parse error on line 1: ...ON check_ddl_rewrite(p_tablename regclas -----------------------^ Expecting 'AS', got 'LPAR'
```

```sql
CREATE TYPE test_type_empty AS ();

line 2083 => error: Parse error on line 1: CREATE TYPE test_type_empty AS ( ------------^ Expecting 'DATABASE', got 'LITERAL'
```

```sql
ALTER TABLE test_add_column DROP c6;

line 2366 => error: Parse error on line 2: ...st_add_column DROP c6; ----------------------^ Expecting 'COLUMN', got 'LITERAL'
```

```sql
ALTER TABLE list_parted2 DETACH PARTITION part_7;

line 2718 => error: Parse error on line 1: ... TABLE list_parted2 DETACH PARTITION par -----------------------^ Expecting 'LITERAL', 'EOF', 'COMMA', 'AS', 'LPAR', 'RPAR', 'SEARCH', 'DOT', 'WHERE', 'DOLLAR', 'AT', 'SET', 'TO', 'VALUE', 'COLON', 'NOT', 'QUESTION', 'UNIQUE', 'SELECT', 'INDEX', 'ON', 'NULL', 'BRAQU…
```

```sql
drop table defpart_attach_test;

line 3014 => error: Can not drop table "defpart_attach_test" because it does not exist in the database.
```

#### ☓ Ran 1,698 statements

* 905 failed
* 1 not checked (expected output the runner does not read)
* 34 not run (inside a transaction that had an error)
* 45% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 233/238 `pg/sql/tablespace.sql`

```sql
REINDEX (TABLESPACE regress_tblspace, CONCURRENTLY) TABLE tbspace_reindex_part;

line 143 => error: Parse error on line 1: REINDEX (TABLESPACE regress_ --------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'DQSTRING', got 'LPAR'
```

```sql
CREATE ROLE regress_tablespace_user2 login;

line 406 => error: Parse error on line 1: CREATE ROLE regress_tablespace_u... ------------^ Expecting 'DATABASE', got 'LITERAL'
```

#### ☓ Ran 205 statements

* 156 failed
* 1 not run (inside a transaction that had an error)
* 23% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 234/238 `pg/sql/fast_default.sql`

```sql
DROP FUNCTION foolme(timestamptz);

line 325 => error: Parse error on line 1: DROP FUNCTION foolme(time -----^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'CLASS', 'INDEX', 'TABLE', 'DATABASE', 'VIEW', 'TRIGGER', got 'FUNCTION'
```

#### ☓ Ran 295 statements

* 167 failed
* 8 not run (inside a transaction that had an error)
* 41% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 235/238 `pg/sql/cluster.sql`

```sql
SELECT pg_class.relname FROM pg_index, pg_class, pg_class AS pg_class_2 WHERE pg_class.oid=indexrelid AND indrelid=pg_class_2.oid AND pg_class_2.relname = 'clstr_tst' AND indisclustered;

line 100 => error: Table does not exist: pg_index
```

```sql
CREATE INDEX clstr_matview_idx ON clstr_matview (i);

line 380 => error: undefined is not an object (evaluating 'table.xcolumns')
```

#### ☓ Ran 283 statements

* 141 failed
* 14 not run (inside a transaction that had an error)
* 47% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 236/238 `pg/sql/stats.sql`

```sql
SELECT pg_stat_get_live_tuples(drop_stats_test_subxact);

line 336 => error: undefined is not an object (evaluating 'p['undefined']['drop_stats_test_subxact']')
```

```sql
SELECT pg_stat_have_stats('index', :dboid, stats_test_idx1);

line 671 => error: undefined is not an object (evaluating 'p['undefined']['stats_test_idx1']')
```

```sql
DROP FUNCTION wait_for_hot_stats();

line 975 => error: Parse error on line 1: DROP FUNCTION wait_for_ho -----^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'CLASS', 'INDEX', 'TABLE', 'DATABASE', 'VIEW', 'TRIGGER', got 'FUNCTION'
```

#### ☓ Ran 527 statements

* 298 failed
* 2 not checked (expected output the runner does not read)
* 104 not run (inside a transaction that had an error)
* 29% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 237/238 `pg/sql/join.sql`

```sql
explain (costs off) select * from int4_tbl t1 left join ((select t2.f1 from int4_tbl t2 left join int4_tbl t3 on t2.f1 > 0 where t3.f1 is null) s left join tenk1 t4 on s.f1 > 1) on s.f1 = t1.f1;

line 518 => error: Parse error on line 1: explain (costs off)select * ---------^ Expecting 'LPAR', 'SEARCH', 'SELECT', got 'LITERAL'
```

```sql
select * from zt2 left join zt3 on (f2 = f3) left join zv1 on (f3 = f1) where f2 = 53;

line 1303 => error: alasql.databases[source.databaseid].tables[source.tableid].select is not a function. (In 'alasql.databases[source.databaseid].tables[source.tableid].select(params)', 'alasql.databases[source.databaseid].tables[source.tableid].select' is undefined)
```

```sql
explain (costs off) select * from int8_tbl t1 left join (select q1 as x, 42 as y from int8_tbl t2) ss on t1.q2 = ss.x where 1 = (select 1 from int8_tbl t3 where ss.y is not null limit 1) order by 1,2;

line 1640 => error: Parse error on line 1: explain (costs off)select * ---------^ Expecting 'LPAR', 'SEARCH', 'SELECT', got 'LITERAL'
```

```sql
explain (verbose, costs off) select * from text_tbl t1 left join int8_tbl i8 on i8.q2 = 123, lateral (select i8.q1, t2.f1 from text_tbl t2 limit 1) as ss where t1.f1 = ss.f1;

line 2413 => error: Parse error on line 1: explain (verbose, costs off) ---------^ Expecting 'LPAR', 'SEARCH', 'SELECT', got 'LITERAL'
```

```sql
EXPLAIN (COSTS OFF) SELECT * FROM sj j1, sj j2 WHERE j1.b = j2.b AND 1 = j1.a AND j2.a = 1;

line 3658 => error: Parse error on line 1: EXPLAIN (COSTS OFF)SELECT * ---------^ Expecting 'LPAR', 'SEARCH', 'SELECT', got 'LITERAL'
```

```sql
select * from (values(1)) x(lb), lateral generate_series(lb,4) x4;

line 4149 => error: Parse error on line 1: ...ct * from (values(1)) x(lb), lateral g -----------------------^ Expecting 'COMMA', 'CROSS', 'OUTER', 'NATURAL', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'SEMI', 'ANTI', got 'RPAR'
```

```sql
reset enable_hashjoin;

line 4689 => error: Parse error on line 1: reset enable_hashjoin; ------^ Expecting 'EOF', 'COMMA', 'LPAR', 'RPAR', 'END', 'ELSE', 'COLONDASH', 'GO', 'SEMICOLON', got 'LITERAL'
```

#### ☓ Ran 1,105 statements

* 606 failed
* 157 not run (inside a transaction that had an error)
* 36% of the checked statements were OK


---- ---- ---- ---- ---- ---- ----
### 238/238 `pg/sql/subselect.sql`

The statement at line 700 ran for more than 20 s (timeout): it counts as failed, and the file was run again without it.

```sql
delete from road where exists ( select 1 from int4_tbl cross join ( select f1, array(select q1 from int8_tbl) as arr from text_tbl ) ss where road.name = ss.f1 );

line 520 => error: Parse error on line 6: ... ( select f1, array(select q1 from int8_ -----------------------^ Expecting 'LITERAL', 'BRALITERAL', 'KEY', 'OPEN', 'CLOSE', 'SEPARATOR', 'LPAR', 'NUMBER', 'SHARP', 'DOLLAR', 'AT', 'VALUE', 'COLON', 'NOT', 'IF', 'ALL', 'PLUS', 'STAR', 'QUESTION', 'DISTINCT', 'INSERT…
```

```sql
select a.thousand from tenk1 a, tenk1 b where a.thousand = b.thousand and exists ( select 1 from tenk1 c where b.hundred = c.hundred and not exists ( select 1 from tenk1 d where a.thousand = d.thousand ) );

line 700 => timeout: ran for more than 20 s
```

```sql
explain (verbose, costs off) with recursive x(a) as ((values ('a'), ('b')) union all (with z as not materialized (select * from x) select z.a || z1.a as a from z cross join z as z1 where length(z.a || z1.a) < 5)) select * from x;

line 1388 => error: Parse error on line 1: explain (verbose, costs off) ---------^ Expecting 'LPAR', 'SEARCH', 'SELECT', got 'LITERAL'
```

#### ☓ Ran 429 statements

* 213 failed
* 76 not run (inside a transaction that had an error)
* 39% of the checked statements were OK


-----------------------------

## Final result

* `alasql@4.21.0` (Bun 1.4.3)
* Test files: 238, 0 without a failure, 1 with a statement over the 20 s timeout
* Statements: 53,042: 14,353 passed, 34,743 failed, 1,052 not checked, 2,894 not run
* ROLLBACK emulated 678 times (210 by rebuilding after DDL)
* Final score: 29 % of the checked statements were OK

Total script time: 58.3s

_Repeated failures are sampled; run with --printAllErrors to see every one, or --debug for results/debug.jsonl_
