import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { resolve,dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { isStagingBuild, assertSafeStagingTarget } from "../scripts/staging-migrations.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)),"..");
test("only Workers Builds on exact staging branch can run D1 migrations", () => {
  assert.equal(isStagingBuild({WORKERS_CI:"1",WORKERS_CI_BRANCH:"staging"}),true);
  assert.equal(isStagingBuild({WORKERS_CI:"1",WORKERS_CI_BRANCH:"main"}),false);
  assert.equal(isStagingBuild({WORKERS_CI:"1",WORKERS_CI_BRANCH:"feature/staging"}),false);
  assert.equal(isStagingBuild({WORKERS_CI_BRANCH:"staging"}),false);
});
test("migration config and preview resource are identical; no production binding", () => {
  assert.deepEqual(assertSafeStagingTarget(root),{
    databaseName:"abdul-portfolio-staging",
    databaseId:"863b6d6f-3197-4f34-b24d-2c43d0e0c4e4"
  });
});
test("main and local runs are no-op without touching Cloudflare", () => {
  for (const env of [
    {WORKERS_CI:"1",WORKERS_CI_BRANCH:"main"},
    {WORKERS_CI:"0",WORKERS_CI_BRANCH:"staging"}
  ]) {
    const result=spawnSync(process.execPath,["scripts/staging-migrations.mjs"],{
      cwd:root,encoding:"utf8",env:{...process.env,...env}
    });
    assert.equal(result.status,0,result.stderr);
    assert.match(result.stdout,/skipped/);
  }
});
test("staging dry run validates the real target but never sends mutations", () => {
  const result=spawnSync(process.execPath,["scripts/staging-migrations.mjs"],{
    cwd:root,encoding:"utf8",
    env:{...process.env,WORKERS_CI:"1",WORKERS_CI_BRANCH:"staging",STAGING_MIGRATION_DRY_RUN:"1"}
  });
  assert.equal(result.status,0,result.stderr);
  assert.match(result.stdout,/Verified D1 staging target/);
  assert.match(result.stdout,/Dry run only/);
});
