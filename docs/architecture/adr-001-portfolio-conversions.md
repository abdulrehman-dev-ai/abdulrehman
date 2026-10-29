# ADR 001: Portfolio conversion platform foundations

**Status:** Accepted for the inquiry MVP; database and CMS implementation remain follow-up work.

## Constraints

- Keep the existing Next.js application and production Vercel domain stable.
- No changes to production until preview and CI checks are green and provider configuration is verified.
- Keep costs modest and minimize operational services until they deliver real value.
- Develop related changes on one short-lived feature branch, review through one PR, then merge and clean up the branch after release.

## Lead capture MVP

- **Web UI:** shared project brief component, preserve email and copy fallback.
- **API:** Next.js server-side route `POST /api/inquiries` with field length limits, allowed categories, origin checking, no-cache response, and request-size cap.
- **Abuse prevention:** server-verified Cloudflare Turnstile and hidden honeypot; reject if verification is unavailable. A token must be validated before attempting email.
- **Email:** Resend server-side API. Credential and sender address stay in protected environment configuration, never in client bundles or version control.
- **Failure behavior:** no false success if the email provider fails or configuration is missing. A 200 response means the provider accepted the message, not that it reached the inbox.
- **No durable storage yet:** do not label this version a CRM. Track delivery errors using privacy-safe metadata, not full lead messages in application logs.

## Next step: durable, auditable lead records

Before scaling, add a managed database and schema for `leads`, `lead_events`, and `delivery_attempts`.
Store status, timestamps, source, reference ID, and consent-relevant fields. Use strict server-side authorization and separate private admin views. Never store raw API keys or sensitive message bodies in logs.

Do not use the Vercel function filesystem: it is ephemeral and cannot provide durable persistence.
A durable, centrally managed SQL database is preferable for lead tracking, blog content, reviews, orders, and administrative queries. Select the provider after verifying the connected infrastructure and operational cost: avoid introducing a cross-cloud database API that requires exposing broad Cloudflare account credentials to the application.

For reliable notifications, persist the lead before enqueueing or attempting email, use an idempotency key, and record delivery state. If delivery fails, support retries with limits and alerts. Until this is implemented, the website must keep a separate user-visible email option.

## Growth roadmap

1. **Lead intake hardening:** enable configured challenge and Resend, complete actual provider delivery tests, add monitoring and rate limits.
2. **Lead CRM:** durable lead table, private dashboard, qualified / contacted / proposed / won / lost statuses, filters, audit events and notifications.
3. **Content workflow:** authenticated draft/publish/edit blog and case study CMS with structured data and SEO metadata.
4. **Trust:** first-party client testimonials with explicit consent and verified provenance; embed third-party reviews only where the platform permits.
5. **Ordering:** only enable payment checkout after database-backed orders, provider signature verification, reconciliation and failure recovery have passed staging tests.

## Release process

- Maintain `main` as stable production; one focused feature branch and one PR for this work.
- Run TypeScript, production build, API negative-path checks and browser QA on previews.
- Keep separate staging configuration and production credentials, use least-privilege secrets.
- Merge only after tests and configured delivery are demonstrated, then monitor deployment and error rates.
