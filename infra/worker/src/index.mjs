// Safe bootstrap. Keep public lead writes disabled until D1 + Turnstile
// + isolated staging configuration and delivery monitoring are verified.
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer",
    "access-control-allow-origin": "null",
  },
});

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/healthz" && request.method === "GET") {
      // Operational check must never reveal secrets, account IDs or customer data.
      return json({ service: "portfolio-api", status: "ok", version: "bootstrap-1" });
    }
    if (url.pathname.startsWith("/api/")) {
      return json({
        error: "The Cloudflare API is not accepting public submissions yet.",
        code: "SERVICE_NOT_CONFIGURED",
      }, 503);
    }
    return json({ error: "Not found." }, 404);
  },
};
