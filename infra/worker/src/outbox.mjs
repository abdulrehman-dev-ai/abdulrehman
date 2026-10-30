/**
 * Durable D1 outbox processor. Called only by a Cloudflare Cron Trigger.
 * Requires a verified Resend sender and environment-scoped secrets.
 * The public API never sends email synchronously.
 */
const MAX_ATTEMPTS = 5;
const MAX_PER_TICK = 5;
const FROM_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nowSeconds = () => Math.floor(Date.now() / 1000);
const backoff = attempt => Math.min(3600, 60 * 2 ** Math.max(0, attempt - 1));

export function outboxConfigured(env) {
  return env?.EMAIL_PIPELINE_READY === "true" && !!env.DB &&
    typeof env.RESEND_API_KEY === "string" && !!env.RESEND_API_KEY &&
    typeof env.RESEND_FROM_EMAIL === "string" && FROM_PATTERN.test(env.RESEND_FROM_EMAIL);
}

/**
 * A claimed job is leased atomically, so two concurrent ticks cannot send it.
 * Resend Idempotency-Key additionally protects retries after provider acceptance
 * if the worker crashed before persisting the provider message ID.
 */
export async function processOutbox(env, { fetcher = fetch, now = nowSeconds() } = {}) {
  if (!outboxConfigured(env)) return { skipped: true, accepted: 0, failed: 0 };
  const db = env.DB;
  let accepted = 0, failed = 0;
  for (let i = 0; i < MAX_PER_TICK; i++) {
    const candidate = await db.prepare(
      "SELECT id FROM email_outbox WHERE attempts < ? AND " +
      "((status='pending' AND next_attempt_at<=?) OR " +
      "(status='sending' AND leased_until<=?)) " +
      "ORDER BY next_attempt_at ASC LIMIT 1"
    ).bind(MAX_ATTEMPTS, now, now).first();
    if (!candidate) break;

    const job = await db.prepare(
      "UPDATE email_outbox SET status='sending', attempts=attempts+1, " +
      "leased_until=?, updated_at=? WHERE id=? AND attempts < ? AND " +
      "((status='pending' AND next_attempt_at<=?) OR " +
      "(status='sending' AND leased_until<=?)) " +
      "RETURNING id,recipient,subject,body_text,idempotency_key,attempts"
    ).bind(now + 90, now, candidate.id, MAX_ATTEMPTS, now, now).first();
    if (!job) continue;

    let statusCode = 0, messageId = null;
    try {
      const response = await fetcher("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + env.RESEND_API_KEY,
          "Content-Type": "application/json",
          "Idempotency-Key": job.idempotency_key,
        },
        body: JSON.stringify({
          from: env.RESEND_FROM_EMAIL,
          to: [job.recipient],
          subject: job.subject,
          text: job.body_text,
        }),
        signal: AbortSignal.timeout(10000),
      });
      statusCode = response.status;
      if (response.ok) {
        const payload = await response.json();
        if (typeof payload?.id === "string" && payload.id.length <= 120)
          messageId = payload.id;
      }
    } catch {
      // Network errors and timeouts are transient; retry via the same key.
      statusCode = 0;
    }

    if (messageId) {
      await db.prepare(
        "UPDATE email_outbox SET status='provider_accepted', provider_message_id=?, " +
        "accepted_at=?,leased_until=NULL,last_error_code=NULL,updated_at=? " +
        "WHERE id=? AND status='sending'"
      ).bind(messageId, now, now, job.id).run();
      accepted++;
      continue;
    }

    const transient = statusCode === 0 || statusCode === 408 ||
      statusCode === 409 || statusCode === 429 || statusCode >= 500 ||
      (statusCode >= 200 && statusCode < 300); // malformed success response
    const retry = transient && job.attempts < MAX_ATTEMPTS;
    const next = now + backoff(job.attempts);
    const code = statusCode ? "HTTP_" + statusCode : "NETWORK_ERROR";
    await db.prepare(
      "UPDATE email_outbox SET status=?, next_attempt_at=?, leased_until=NULL, " +
      "last_error_code=?,updated_at=? WHERE id=? AND status='sending'"
    ).bind(retry ? "pending" : "failed", next, code, now, job.id).run();
    failed++;
  }
  return { skipped: false, accepted, failed };
}
