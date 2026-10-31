/**
 * Read-only Cloudflare D1 staging schema check. Never applies migrations.
 * Requires narrowly scoped Cloudflare token and account ID supplied as secrets.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { assertSafeStagingTarget } from "./staging-migrations.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { databaseId } = assertSafeStagingTarget(root);
const token = process.env.CLOUDFLARE_API_TOKEN;
const account = process.env.CLOUDFLARE_ACCOUNT_ID;
if (!token || !account) throw new Error("Cloudflare D1 credentials unavailable.");
if (!/^[a-f0-9]{32}$/i.test(account)) throw new Error("Unexpected Cloudflare account identifier.");
const expected = ["inquiries", "email_outbox", "rate_limit_buckets", "d1_migrations"];
const response = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${account}/d1/database/${databaseId}/query`,
  {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({
      sql: "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('inquiries','email_outbox','rate_limit_buckets','d1_migrations')"
    }),
    signal: AbortSignal.timeout(20000)
  }
);
if (!response.ok) throw new Error(`Cloudflare D1 query failed: HTTP ${response.status}`);
const payload = await response.json();
if (!payload.success || !Array.isArray(payload.result)) throw new Error("Cloudflare D1 query unsuccessful.");
const rows = payload.result.flatMap(item => item.results || []);
const found = new Set(rows.map(row => row.name));
for (const name of expected) {
  if (!found.has(name)) throw new Error(`Missing staging D1 table: ${name}`);
}
console.log("Verified staging D1 schema: " + expected.join(", "));
