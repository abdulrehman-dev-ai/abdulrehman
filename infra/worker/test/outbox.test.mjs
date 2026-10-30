import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { dirname,join } from "node:path";
import { fileURLToPath } from "node:url";
import { processOutbox } from "../src/outbox.mjs";

const migration = join(dirname(fileURLToPath(import.meta.url)), "../../d1/migrations/0001_platform.sql");
function createDb() {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(readFileSync(migration,"utf8"));
  return {
    sqlite,
    db: {
      prepare(query) {
        return {
          bind(...values) {
            const s=sqlite.prepare(query);
            return {
              async first() { return s.get(...values) ?? null; },
              async run() { return s.run(...values); },
            };
          }
        };
      },
    },
  };
}
const NOW=1793330000;
const ENVS = db => ({ DB: db, EMAIL_PIPELINE_READY:"true",
  RESEND_API_KEY:"test-api-key", RESEND_FROM_EMAIL:"noreply@verified.example" });
function job(sqlite, id="email-1", key="inquiry:test1:admin") {
  sqlite.prepare("INSERT INTO email_outbox(id,idempotency_key,entity_type,entity_id,purpose,recipient,subject,body_text,next_attempt_at) VALUES (?,?,?,?,?,?,?,?,?)")
    .run(id,key,"inquiry","lead-1","admin_notice","admin@example.com","Project inquiry","Some context",NOW-10);
}

test("unconfigured outbox never touches D1 or provider", async () => {
  const result = await processOutbox({});
  assert.deepEqual(result,{skipped:true,accepted:0,failed:0});
});
test("accepted email is recorded once and not resent on another scheduled tick", async () => {
  const {sqlite,db}=createDb();job(sqlite);
  const calls=[];
  const response=async(url,options)=>{
    calls.push({url,headers:options.headers,body:JSON.parse(options.body)});
    return new Response(JSON.stringify({id:"em_test_123"}),{status:200});
  };
  const a=await processOutbox(ENVS(db),{now:NOW,fetcher:response});
  const b=await processOutbox(ENVS(db),{now:NOW+300,fetcher:response});
  assert.deepEqual(a,{skipped:false,accepted:1,failed:0});
  assert.deepEqual(b,{skipped:false,accepted:0,failed:0});
  assert.equal(calls.length,1);
  assert.equal(calls[0].headers["Idempotency-Key"],"inquiry:test1:admin");
  assert.equal(calls[0].body.from,"noreply@verified.example");
  assert.equal(sqlite.prepare("SELECT status FROM email_outbox WHERE id='email-1'").get().status,"provider_accepted");
  assert.equal(sqlite.prepare("SELECT provider_message_id FROM email_outbox").get().provider_message_id,"em_test_123");
  sqlite.close();
});
test("transient provider failure is retried with the same idempotency key", async()=>{
  const {sqlite,db}=createDb();job(sqlite);
  const keys=[];
  const first=await processOutbox(ENVS(db),{now:NOW,fetcher:async(url,options)=>{
    keys.push(options.headers["Idempotency-Key"]);
    return new Response("throttled",{status:429});
  }});
  assert.equal(first.failed,1);
  assert.deepEqual(sqlite.prepare("SELECT status,attempts,next_attempt_at FROM email_outbox").get(),
    {status:"pending",attempts:1,next_attempt_at:NOW+60});
  const notYet=await processOutbox(ENVS(db),{now:NOW+59,fetcher:async()=>{throw Error("unexpected retry");}});
  assert.equal(notYet.accepted,0);
  const second=await processOutbox(ENVS(db),{now:NOW+61,fetcher:async(url,options)=>{
    keys.push(options.headers["Idempotency-Key"]);
    return new Response(JSON.stringify({id:"em_retry"}),{status:200});
  }});
  assert.equal(second.accepted,1);
  assert.deepEqual(keys,["inquiry:test1:admin","inquiry:test1:admin"]);
  sqlite.close();
});
test("non-retriable 4xx errors are retained for admin inspection",async()=>{
  const {sqlite,db}=createDb();job(sqlite);
  await processOutbox(ENVS(db),{now:NOW,fetcher:async()=>new Response("bad sender",{status:422})});
  assert.deepEqual(sqlite.prepare("SELECT status,attempts,last_error_code FROM email_outbox").get(),
    {status:"failed",attempts:1,last_error_code:"HTTP_422"});
  sqlite.close();
});
