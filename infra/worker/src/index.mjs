// Cloudflare Worker API. Public mutation paths are disabled by default.
// Business rules are shared with the D1 repository under src/server/leads.
// Do not enable INQUIRIES_ENABLED without D1 migrations, abuse controls,
// verified Turnstile, tested Resend outbox consumer and private CRM visibility.
import { recordInquiryAndQueue, InvalidInquiryError, validateInquiry } from "../../../src/server/leads/d1.ts";
import { processOutbox, outboxConfigured } from "./outbox.mjs";

const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer",
    ...headers,
  },
});

const allowedOrigins = env => String(env.PUBLIC_ORIGINS || "")
  .split(",").map(origin => origin.trim()).filter(origin => {
    try {
      const url = new URL(origin);
      return url.origin === origin && url.protocol === "https:";
    } catch { return false; }
  });

function corsHeaders(origin) {
  return { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type", "Vary": "Origin" };
}
function isReady(env) {
  return env.INQUIRIES_ENABLED === "true" &&
    env.EMAIL_PIPELINE_READY === "true" &&
    outboxConfigured(env) && !!env.TURNSTILE_SECRET_KEY && !!env.ADMIN_EMAIL &&
    !!env.RATE_LIMIT_PEPPER &&
    allowedOrigins(env).length > 0;
}
async function parsePayload(request) {
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return { error: "Expected JSON.", status: 415 };
  }
  const text = await request.text();
  if (text.length > 8000) return { error: "Request is too large.", status: 413 };
  try {
    const data = JSON.parse(text);
    if (!data || typeof data !== "object" || Array.isArray(data))
      return { error: "Invalid request.", status: 400 };
    return { data };
  } catch {
    return { error: "Invalid JSON.", status: 400 };
  }
}
async function verifyChallenge(token, env, origin, fetcher) {
  if (typeof token !== "string" || token.length < 10 || token.length > 2048) return false;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const result = await fetcher("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token }),
      signal: controller.signal,
    });
    if (!result.ok) return false;
    const data = await result.json();
    return data?.success === true && data.hostname === new URL(origin).hostname;
  } finally {
    clearTimeout(timeout);
  }
}
async function checkRateLimit(env, request) {
  // Cloudflare supplies CF-Connecting-IP to the Worker, not to the browser.
  // Store only SHA-256 hash of origin, bucket and IP; no raw IP persisted.
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const epochSeconds = Math.floor(Date.now() / 1000);
  const windowStart = Math.floor(epochSeconds / 900) * 900;
  const value = "lead:" + env.RATE_LIMIT_PEPPER + ":" + ip;
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value))))
    .map(x => x.toString(16).padStart(2, "0")).join("");
  const row = await env.DB.prepare(
    "INSERT INTO rate_limit_buckets(bucket_key,window_start,hit_count,expires_at) VALUES (?,?,1,?) " +
    "ON CONFLICT(bucket_key,window_start) DO UPDATE SET hit_count=hit_count+1 RETURNING hit_count"
  ).bind(hash, windowStart, windowStart + 1800).first();
  return Number(row?.hit_count ?? 100) <= 5;
}
async function inquiry(request, env, fetcher) {
  if (!isReady(env)) {
    return json({ code: "SERVICE_NOT_CONFIGURED", error: "Direct project submissions are not available yet." }, 503);
  }
  const origin = request.headers.get("origin") || "";
  if (!allowedOrigins(env).includes(origin)) {
    return json({ error: "Origin not allowed." }, 403);
  }
  const cors = corsHeaders(origin);
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: { ...cors, "Cache-Control": "no-store" } });
  }
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405, cors);

  const payload = await parsePayload(request);
  if ("error" in payload) return json({ error: payload.error }, payload.status, cors);
  const body = payload.data;
  if (typeof body.website === "string" && body.website.trim())
    return json({ ok: true }, 202, cors); // bot trap: nothing stored
  try {
    validateInquiry(body);
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.requestKey))
      return json({ error: "Invalid inquiry reference." }, 400, cors);
  } catch (error) {
    if (error instanceof InvalidInquiryError) return json({ error: error.message }, 400, cors);
    return json({ error: "Invalid request." }, 400, cors);
  }
  try {
    if (!await checkRateLimit(env, request))
      return json({ error: "Please wait and try again later." }, 429, cors);
  } catch {
    console.error("Inquiry rate-limit storage unavailable");
    return json({ error: "Temporarily unable to accept inquiries." }, 503, cors);
  }
  let verified = false;
  try {
    verified = await verifyChallenge(body.turnstileToken, env, origin, fetcher);
  } catch {
    return json({ error: "Verification service unavailable." }, 503, cors);
  }
  if (!verified) return json({ error: "Security verification failed." }, 403, cors);
  try {
    const result = await recordInquiryAndQueue(env.DB, body, body.requestKey, env.ADMIN_EMAIL);
    return json({ ok: true, reference: result.id, duplicate: result.duplicate }, result.duplicate ? 200 : 201, cors);
  } catch (error) {
    if (error instanceof InvalidInquiryError) return json({ error: error.message }, 400, cors);
    console.error("D1 project inquiry persistence failed"); // never log PII
    return json({ error: "Unable to save the inquiry. Please use email instead." }, 503, cors);
  }
}
export default {
  async scheduled(controller, env, ctx) {
    // Never run when D1/Resend secrets or the pipeline switch are missing.
    const run = processOutbox(env);
    if (ctx?.waitUntil) ctx.waitUntil(run);
    else await run;
  },
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/healthz" && request.method === "GET") {
      return json({ service: "portfolio-api", status: "ok",
        ready_for_traffic: isReady(env), version: "bootstrap-2" });
    }
    if (url.pathname === "/readyz") {
      if (!isReady(env)) return json({ service: "portfolio-api", status: "not_ready" }, 503);
      return json({ service: "portfolio-api", status: "ready" }, 200);
    }
    if (url.pathname === "/api/inquiries") return inquiry(request, env, fetch);
    if (url.pathname.startsWith("/api/")) {
      return json({ error: "This API is not accepting public requests.", code: "SERVICE_NOT_CONFIGURED" }, 503);
    }
    return json({ error: "Not found." }, 404);
  },
};
