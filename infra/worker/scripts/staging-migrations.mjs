/**
 * Cloudflare Workers Builds build command: node scripts/staging-migrations.mjs
 * Deliberately refuses to migrate any database except the verified staging D1.
 * On production branch it performs no remote operations.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const STAGING_DATABASE_ID = "863b6d6f-3197-4f34-b24d-2c43d0e0c4e4";
const STAGING_DATABASE_NAME = "abdul-portfolio-staging";
const FILE = "wrangler.preview-migrations.jsonc";

export function isStagingBuild(env) {
  return env.WORKERS_CI === "1" && env.WORKERS_CI_BRANCH === "staging";
}
export function assertSafeStagingTarget(root = ROOT) {
  const migration = JSON.parse(readFileSync(resolve(root, FILE), "utf8"));
  const runtime = JSON.parse(readFileSync(resolve(root, "wrangler.jsonc"), "utf8"));
  const binding = migration?.d1_databases?.[0];
  const preview = runtime?.previews?.d1_databases?.[0];
  if (migration?.d1_databases?.length !== 1 ||
      runtime?.d1_databases !== undefined ||
      runtime?.previews?.d1_databases?.length !== 1 ||
      binding?.database_name !== STAGING_DATABASE_NAME ||
      binding?.database_id !== STAGING_DATABASE_ID ||
      binding?.binding !== "DB" ||
      preview?.database_name !== STAGING_DATABASE_NAME ||
      preview?.database_id !== STAGING_DATABASE_ID ||
      preview?.binding !== "DB") {
    throw new Error("Unsafe D1 migration target: staging/preview config mismatch.");
  }
  const migrationDir = resolve(root, binding.migrations_dir);
  const schema = readFileSync(resolve(migrationDir, "0001_platform.sql"), "utf8");
  if (!schema.includes("CREATE TABLE inquiries") ||
      !schema.includes("CREATE TABLE email_outbox")) {
    throw new Error("Required initial schema is missing.");
  }
  return { databaseName: STAGING_DATABASE_NAME, databaseId: STAGING_DATABASE_ID };
}
export function main(env = process.env) {
  if (!isStagingBuild(env)) {
    console.log("D1 migrations skipped: not a Cloudflare staging build.");
    return 0;
  }
  const target = assertSafeStagingTarget();
  console.log("Verified D1 staging target:", target.databaseName, target.databaseId);
  if (env.STAGING_MIGRATION_DRY_RUN === "1") {
    console.log("Dry run only: no Cloudflare mutation.");
    return 0;
  }
  // No shell interpolation and no generic DB binding. Target is exact, reviewed UUID.
  const result = spawnSync("npx", [
    "--yes", "wrangler@4.156.0", "d1", "migrations", "apply",
    STAGING_DATABASE_NAME, "--remote", "--config", FILE
  ], { cwd: ROOT, stdio: "inherit", timeout: 180000 });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error("Staging D1 migration failed; preview build must stop.");
  console.log("Staging migration completed or was already applied.");
  return 0;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { process.exitCode = main(); }
  catch (error) {
    console.error(error instanceof Error ? error.message : "Migration failed");
    process.exitCode = 1;
  }
}
