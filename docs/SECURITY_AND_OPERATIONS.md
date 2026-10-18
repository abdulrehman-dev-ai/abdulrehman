# Security and operations

## Current production risks

The original implementation persisted orders to the local file system and accepted unauthenticated payment success callbacks. The new branch keeps checkout disabled by default and blocks callback-driven status changes until the payment provider verification protocol and a durable store are implemented and tested.

## Required for launch

- Cloudflare D1 (or equivalent durable transactional database): orders, payment events, idempotency keys, admin edits and review moderation.
- Authenticated admin access: identity provider, role checks, session expiry, audit log and server-side route authorization.
- Resend: server-only API key, verified sender domain, restricted email templates and rate-limited contact submissions.
- PayFast: trusted processor verification on callbacks (not browser redirect parameters), transaction amount/currency matching, duplicate event handling and staged test payments.
- Abuse protection: bot checks, strict validation, rate limits and notification throttles.
- Health monitoring, backup/restore test, privacy disclosure and rollback strategy.

Do not publish bank details or expose API secrets through public JavaScript bundles.

## Deployment

No production release is implied by successful GitHub commits. Review pull-request CI and preview URLs before merge. The Vercel account currently connected to ChatGPT does not expose the portfolio deployment.
