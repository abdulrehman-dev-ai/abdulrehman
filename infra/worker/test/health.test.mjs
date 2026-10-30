import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.mjs";

test("health endpoint never leaks operational secrets", async () => {
  const response = await worker.fetch(new Request("https://portfolio.workers.dev/healthz"), {
    TURNSTILE_SECRET_KEY: "secret", ADMIN_EMAIL: "example@test.com"
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), {
    service: "portfolio-api", status: "ok", ready_for_traffic: false, version: "bootstrap-2",
  });
});

test("all submission and readiness routes fail closed without configured D1 and email pipeline", async () => {
  const badConfig = {
    INQUIRIES_ENABLED: "true", ADMIN_EMAIL: "admin@example.com",
    TURNSTILE_SECRET_KEY: "a", PUBLIC_ORIGINS: "https://site.example"
  };
  for (const env of [{}, badConfig]) {
    for (const method of ["GET", "POST", "OPTIONS"]) {
      const response = await worker.fetch(new Request("https://portfolio.workers.dev/api/inquiries", { method }), env);
      assert.equal(response.status, 503);
      assert.equal((await response.json()).code, "SERVICE_NOT_CONFIGURED");
    }
    assert.equal((await worker.fetch(new Request("https://portfolio.workers.dev/readyz"), env)).status, 503);
  }
});

test("unknown endpoint is not accessible and no permissive CORS is returned", async () => {
  const response = await worker.fetch(new Request("https://portfolio.workers.dev/admin"), {});
  assert.equal(response.status, 404);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), null);
});

test("origins are checked before enabling cross-origin submission", async () => {
  const dummyDB = { prepare() { throw new Error("DB should not be reached"); } };
  const env = { DB: dummyDB, INQUIRIES_ENABLED:"true", EMAIL_PIPELINE_READY:"true",
    ADMIN_EMAIL:"admin@example.com",TURNSTILE_SECRET_KEY:"test",
    PUBLIC_ORIGINS:"https://staging.example.com" };
  const rejected = await worker.fetch(new Request("https://portfolio.workers.dev/api/inquiries", {
    method:"OPTIONS",headers:{Origin:"https://attacker.example"}
  }),env);
  assert.equal(rejected.status,403);
  assert.equal(rejected.headers.get("Access-Control-Allow-Origin"),null);
  const allowed = await worker.fetch(new Request("https://portfolio.workers.dev/api/inquiries",{
    method:"OPTIONS",headers:{Origin:"https://staging.example.com"}
  }),env);
  assert.equal(allowed.status,204);
  assert.equal(allowed.headers.get("Access-Control-Allow-Origin"),"https://staging.example.com");
});
