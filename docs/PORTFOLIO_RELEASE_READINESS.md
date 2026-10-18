# Portfolio Release Readiness

## Code implemented (feature branch)

- Four recent project case studies in MDX
- Responsive capability cards, updated project calls to action and canonical URL/sitemap corrections
- Server-rendered reviews page, Turnstile-protected review submissions and authenticated moderation
- GitHub-backed admin CMS for blog and project content at `/admin`
- Orders and reviews operations dashboard at `/admin/operations`
- Cloudflare D1 database schema (`db/schema.sql`) and REST client replacing local JSON order persistence
- Resend contact inquiry endpoint with Turnstile validation
- Default-disabled checkout endpoints, request-a-quote alternative and disabled unverified PayFast callback
- GitHub Actions TypeScript validation and production build

## Production enablement requirements

1. Connect a deployment account with access to the portfolio app. Current Vercel connection only lists the unrelated `nexium-resume-tailor` project.
2. Provision Cloudflare D1; apply `db/schema.sql`; set `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_D1_DATABASE_ID` and `CLOUDFLARE_API_TOKEN` as server-only environment variables with narrow permissions.
3. For the admin CMS set `ADMIN_SESSION_SECRET`, `ADMIN_PASSWORD_SCRYPT`, `GITHUB_CONTENT_TOKEN` and (optionally) `GITHUB_CONTENT_BRANCH`. Restrict GitHub token to this repository. Add edge throttling, MFA or Cloudflare Access for production admin sign-in.
4. Verify Resend sending domain; set `RESEND_API_KEY`, `RESEND_FROM_EMAIL` and `CONTACT_RECIPIENT_EMAIL`.
5. Configure Turnstile keys: server-only `TURNSTILE_SECRET_KEY`, public `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
6. Complete and test verified PayFast callback processing, idempotent payment events, replay protections, settlement reconciliation and sandbox-to-live migration. The existing callback intentionally returns 503 rather than trusting unauthenticated status fields.
7. Run migration tests, order concurrency/retry tests, contact and review anti-abuse tests, authenticated admin flows, cross-browser responsive testing, accessibility checks, dependency vulnerability remediation and backup/restore verification.
8. Review all publicly displayed business address, phone and bank-account details for publication consent.

## Payment activation

- `ORDER_CHECKOUT_ENABLED`: server guard, default off.
- `NEXT_PUBLIC_ORDER_CHECKOUT_ENABLED`: client guard, default off.

Do **not** set either to true until payment and order-processing verification has passed and production payment launch is explicitly approved.

## Deployment

All features are currently development-branch source code, not verified live integrations. Merge only when CI, environment setup, preview testing and security checks have passed. No live deployment was performed by this implementation.
