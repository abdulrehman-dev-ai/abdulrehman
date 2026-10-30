import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.mjs";

test("public health check is stateless, safe and no-store", async () => {
  const response = await worker.fetch(new Request("https://api.example.workers.dev/healthz"), {});
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), { service: "portfolio-api", status: "ok", ready_for_traffic: false, version: "bootstrap-1" });
});
test("public API routes are closed until backend, D1 and abuse controls are configured", async () => {
  for (const method of ["GET", "POST", "OPTIONS"]) {
    const response = await worker.fetch(new Request("https://api.example.workers.dev/api/inquiries", { method }), {});
    assert.equal(response.status, 503);
    assert.equal((await response.json()).code, "SERVICE_NOT_CONFIGURED");
  }
});
test("unrecognized routes cannot leak anything", async () => {
  const response = await worker.fetch(new Request("https://api.example.workers.dev/internal"), {});
  assert.equal(response.status, 404);
  assert.equal(response.headers.get("access-control-allow-origin"), null);
});

test("readiness fails closed until backend is configured", async () => {
  const result = await worker.fetch(new Request("https://api.example.workers.dev/readyz"), {});
  assert.equal(result.status, 503);
});
