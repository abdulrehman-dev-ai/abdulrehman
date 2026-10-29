import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

const schemaPath = join(dirname(fileURLToPath(import.meta.url)), "../migrations/0001_platform.sql");
function newDb() {
  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys=ON;");
  db.exec(readFileSync(schemaPath, "utf8"));
  return db;
}
function sampleLead(id = "lead-1", key = "submitted-once") {
  return [id, key, "client@example.com", "Full-stack application", "Let's discuss", "Build a secure platform"];
}
const insertLead = "INSERT INTO inquiries(id,request_key,client_email,project_type,budget_band,goal) VALUES (?,?,?,?,?,?)";

test("fresh D1-compatible schema has all core platform tables, with foreign keys enabled", () => {
  const db = newDb();
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all().map(x => x.name);
  for (const name of ["inquiries", "inquiry_events", "content_entries", "orders", "reviews", "email_outbox", "email_delivery_events", "admin_audit", "rate_limit_buckets"]) {
    assert.ok(tables.includes(name), name + " table missing");
  }
  assert.equal(db.prepare("PRAGMA foreign_keys").get().foreign_keys, 1);
  assert.deepEqual(db.prepare("PRAGMA foreign_key_check").all(), []);
  db.close();
});

test("lead and outbox persist as one atomic write; duplicate lead cannot be accepted twice", () => {
  const db = newDb();
  const putJob = db.prepare("INSERT INTO email_outbox(id,idempotency_key,entity_type,entity_id,purpose,recipient,subject,body_text) VALUES (?,?,?,?,?,?,?,?)");
  db.exec("BEGIN IMMEDIATE");
  db.prepare(insertLead).run(...sampleLead());
  putJob.run("mail-1","lead-1:admin-notice","inquiry","lead-1","admin_notice","admin@example.com","New inquiry","Contact details");
  db.exec("COMMIT");
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM inquiries").get().n, 1);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM email_outbox").get().n, 1);
  assert.throws(() => db.prepare(insertLead).run(...sampleLead("lead-2", "submitted-once")), /UNIQUE/);
  assert.throws(() => putJob.run("mail-2","lead-1:admin-notice","inquiry","lead-1","admin_notice","admin@example.com","New inquiry","Again"), /UNIQUE/);
  assert.equal(db.prepare("SELECT status FROM email_outbox WHERE id='mail-1'").get().status, "pending");
  db.close();
});

test("transactions roll back invalid lead and never leave an orphan email job", () => {
  const db = newDb();
  db.exec("BEGIN");
  db.prepare(insertLead).run(...sampleLead());
  assert.throws(() => db.prepare("INSERT INTO inquiries(id,request_key,client_email,project_type,budget_band,goal,status) VALUES (?,?,?,?,?,?,?)").run("bad","bad-key","a@b.test","Other","flexible","Ten chars minimum", "INVALID"), /CHECK/);
  db.exec("ROLLBACK");
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM inquiries").get().n, 0);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM email_outbox").get().n, 0);
  db.close();
});

test("drafts, review consent and foreign keys are enforced by the database", () => {
  const db = newDb();
  const insertContent = db.prepare("INSERT INTO content_entries(id,kind,slug,title) VALUES (?,?,?,?)");
  insertContent.run("post-1","post","secure-cloud","Secure cloud");
  insertContent.run("project-1","project","secure-cloud","Secure cloud project");
  assert.throws(() => insertContent.run("post-2","post","secure-cloud","Duplicate"), /UNIQUE/);
  assert.equal(db.prepare("SELECT status FROM content_entries WHERE id='post-1'").get().status, "draft");
  assert.throws(() => db.prepare("INSERT INTO inquiry_events(id,inquiry_id,event_type) VALUES ('e1','nonexistent','created')").run(), /FOREIGN KEY/);
  assert.throws(() => db.prepare("INSERT INTO reviews(id,source_name,author_display_name,rating,body,status) VALUES ('r1','Fiverr','Test person',5,'Verified review','approved')").run(), /CHECK/);
  db.prepare("INSERT INTO reviews(id,source_name,author_display_name,rating,body,status,permission_at) VALUES ('r2','Fiverr','Test person',5,'Verified review','approved',?)").run(1793260000);
  db.close();
});
