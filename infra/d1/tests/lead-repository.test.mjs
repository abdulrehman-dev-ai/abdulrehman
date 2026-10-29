import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { validateInquiry, recordInquiryAndQueue, InvalidInquiryError } from "../../../src/server/leads/d1.ts";

function adapter() {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec("PRAGMA foreign_keys=ON");
  const migration = join(dirname(fileURLToPath(import.meta.url)), "../migrations/0001_platform.sql");
  sqlite.exec(readFileSync(migration, "utf8"));
  return {
    sqlite,
    db: {
      prepare(sql) {
        const query = sqlite.prepare(sql);
        return {
          bind(...values) {
            return {
              async first() { return query.get(...values) ?? null; },
              async run() { return query.run(...values); },
              // Reusable in db.batch to exercise the same bound statements
              _execute() { return query.run(...values); },
            };
          },
        };
      },
      async batch(statements) {
        sqlite.exec("BEGIN IMMEDIATE");
        try {
          const result = statements.map(statement => statement._execute());
          sqlite.exec("COMMIT");
          return result;
        } catch (error) {
          sqlite.exec("ROLLBACK");
          throw error;
        }
      },
    },
  };
}

const inquiry = {
  kind: "Cloud migration / DevOps", budget: "Let's discuss",
  sender: "client@example.com", goal: "Migrate our WordPress site safely",
  details: "Improve speed and establish backups.",
};
const key = "7c37dbf8-9166-4e3c-a78a-62e44900a50a";

test("public inquiry input is validated before any DB mutation", () => {
  assert.equal(validateInquiry(inquiry).sender, "client@example.com");
  assert.throws(() => validateInquiry({ ...inquiry, kind: "Unknown" }), InvalidInquiryError);
  assert.throws(() => validateInquiry({ ...inquiry, sender: "invalid" }), InvalidInquiryError);
  assert.throws(() => validateInquiry({ ...inquiry, details: "x".repeat(2401) }), InvalidInquiryError);
});

test("one accepted inquiry creates one durable lead, event and pending email, including retries", async () => {
  const { db, sqlite } = adapter();
  const a = await recordInquiryAndQueue(db, inquiry, key, "admin@example.com");
  const retry = await recordInquiryAndQueue(db, inquiry, key, "admin@example.com");
  assert.deepEqual(retry, { id: a.id, duplicate: true });
  for (const table of ["inquiries", "inquiry_events", "email_outbox"])
    assert.equal(sqlite.prepare("SELECT COUNT(*) AS n FROM " + table).get().n, 1);
  assert.equal(sqlite.prepare("SELECT status FROM email_outbox").get().status, "pending");
  assert.throws(() => validateInquiry({ ...inquiry, goal: "short" }), InvalidInquiryError);
  await assert.rejects(
    recordInquiryAndQueue(db, { ...inquiry, goal: "Entirely different request" }, key, "admin@example.com"),
    InvalidInquiryError
  );
  sqlite.close();
});

test("missing notification recipient refuses to accept an untracked lead", async () => {
  const { db, sqlite } = adapter();
  await assert.rejects(recordInquiryAndQueue(db, inquiry, key, ""), /not configured/);
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS n FROM inquiries").get().n, 0);
  sqlite.close();
});
