# Implementation verification — 18 October 2026

The Cloudflare version is implemented on feature/cloudflare-portfolio-platform. Source has been uploaded through the authenticated GitHub browser editor. The existing Vercel site has not been changed. Cloudflare resources, DNS and Resend live sending have not been configured.

## Automated checks

11 Node/SQLite integration tests pass. They run the production route handlers against an in-memory SQLite adapter matching the D1 statements:

1. Public routes, not-found responses, security headers and draft visibility.
2. Signed sessions, signature tampering and unauthorized admin access.
3. Login, secure cookie attributes and failed-login rate limits.
4. Cross-origin writes and request size limits.
5. Server-controlled catalog prices, persistent requests and duplicate request keys.
6. Invalid service requests and stored contact enquiries.
7. Content create/update/delete, publishing and HTML escaping.
8. Testimonial source, rating, permission and unsafe URL validation.
9. Order state transitions, payment confirmation, single-use invitations and moderation.
10. Email provider failures, retained outbox records and stable idempotency keys.
11. Disabled email makes no provider request; sandbox delivery reaches only the configured test inbox and records test_sent.

Both migrations apply successfully to a fresh local Cloudflare D1 database using Wrangler 4.143.1. Pages Functions compile successfully using Wrangler. CI is included for tests and compilation.

These checks do not establish production account configuration, deliverability or live D1 behavior.

## Browser checks

Chromium was run against the actual HTTP handlers with a local test database. No browser JavaScript errors were observed.

- Homepage inspected at 1440, 768, 390 and 320 pixels; no horizontal page overflow after correcting the narrow-phone hero.
- Mobile menu navigation and service selection.
- Mobile order submission, successful reference display, and saved request visible in admin.
- Admin sign-in and order listing.
- Blog draft creation through the dashboard.
- Phone-width route checks for work, a case study, services, service details, about, contact, blog, reviews and privacy policy.

Browser screenshots were inspected internally and are not included in this package.

## Outstanding account-dependent checks

- Create/bind separate Cloudflare production and preview databases; apply migrations to the intended new database.
- Configure admin credentials, public URL, Resend sending key and verified sender.
- Confirm test messages actually arrive and handle any sender/DNS issues.
- Verify the deployed Pages URL and the complete order/review lifecycle on Cloudflare.
- Confirm real payment instructions independently. This build supports order requests and manually verified bank payment statuses; it does not process card payments.
- Supply permitted Fiverr testimonial excerpts and original source evidence. No live review feed or review text has been imported.
- Confirm opening orders and the final domain migration after the deployed checks pass.

Do not call this a live deployment until these account-dependent checks are complete.
