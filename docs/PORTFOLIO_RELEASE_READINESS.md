# Portfolio production readiness

This document tracks implementation gates for the Next.js portfolio. Do not mark a feature as live solely because its route or UI component exists.

## Implemented in the current feature branch

- Four project case studies (Ocean Yacht Registration, Maqwi Organics, WordPress migration, inventory/asset management)
- Normalized canonical hostname and robots sitemap URL
- Checkout endpoint launch gates (disabled by default)
- Client-side service quote request fallback (disabled checkout by default)

## Launch blockers

1. **Deployment access:** the connected Vercel account currently exposes only `nexium-resume-tailor`, not this portfolio. Confirm the owning team/account or provision a target deployment before releasing.
2. **Durable orders:** `src/lib/orders.ts` writes JSON files under `data/orders`. Serverless filesystems are not a persistent order database. Replace with Cloudflare D1 or other production database and test retries, idempotency, and concurrency.
3. **Payments:** verify merchant credentials, server-side callback signatures, order amount matching, webhook replay protection, and failed-payment flows in sandbox; enable real payment collection only after approval.
4. **Email:** set up Resend API key and verified sending domain, implement transactional templates and retries; never expose API keys in client code.
5. **Admin/CMS:** implement authenticated, authorization-checked CRUD for project content and blogs, moderated reviews, order states, and audit logs. Protect mutations from CSRF and privilege escalation.
6. **Build:** run dependency installation, lint/type checks and production build; address existing `ignoreBuildErrors: true` before release.
7. **Quality:** test mobile layouts, keyboard access, cross-browser rendering, metadata, image assets and sitemap.
8. **Privacy:** review publicly displayed banking, phone and physical address details in `src/app/resources/content.js` and remove any personal information not intended for publication.

## Feature flags

- `ORDER_CHECKOUT_ENABLED`: server-side control. Defaults to off; both order creation and card checkout return HTTP 503 when not explicitly `true`.
- `NEXT_PUBLIC_ORDER_CHECKOUT_ENABLED`: client-side presentation control. Defaults to off and displays a request-a-quote flow.

**Do not set either flag to true until persistence, payment verification, and launch approval are complete.**

## Release procedure

Open a pull request, inspect branch differences, run automated checks and verify a preview deployment. Merge only when those checks pass. Keep an ability to roll back to a known-good deployment. Production payment launch requires separate authorization.
