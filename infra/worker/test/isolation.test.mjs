import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const base = dirname(dirname(fileURLToPath(import.meta.url)));
const read = filename => JSON.parse(readFileSync(resolve(base, filename), "utf8"));
const id = "863b6d6f-3197-4f34-b24d-2c43d0e0c4e4";

test("production config cannot write to the staging D1 resource", () => {
  const config = read("wrangler.jsonc");
  assert.equal(config.name, "abdul-portfolio-api");
  assert.equal(config.d1_databases?.length, 1);
  assert.equal(config.d1_databases[0].binding, "DB");
  assert.equal(config.d1_databases[0].database_name, "abdul-portfolio-production");
  assert.equal(config.d1_databases[0].database_id, "d24afa50-9b82-4b50-86b3-dc538396026b");
  assert.notEqual(config.d1_databases[0].database_id, id,
    "Never attach preview D1 as a production binding");
  assert.equal(config.vars?.INQUIRIES_ENABLED, undefined,
    "Lead writes must not be enabled in source configuration");
});

test("Cloudflare previews explicitly use the staging D1 database", () => {
  const config = read("wrangler.jsonc");
  assert.deepEqual(config.previews.d1_databases, [
    { binding:"DB",database_name:"abdul-portfolio-staging",database_id:id },
  ]);
});

test("migration config targets only the exact staging database and checked-in schema", () => {
  const config = read("wrangler.preview-migrations.jsonc");
  assert.equal(config.d1_databases.length,1);
  assert.equal(config.d1_databases[0].database_id,id);
  assert.equal(config.d1_databases[0].database_name,"abdul-portfolio-staging");
  assert.equal(config.d1_databases[0].binding,"DB");
  const migrations = resolve(base,config.d1_databases[0].migrations_dir);
  const schema = readFileSync(resolve(migrations,"0001_platform.sql"),"utf8");
  assert.match(schema,/CREATE TABLE inquiries/);
  assert.match(schema,/CREATE TABLE email_outbox/);
});
