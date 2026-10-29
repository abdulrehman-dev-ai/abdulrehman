# Staging / production migration gates

## Existing state
- Live: Next.js 16 / Vercel public domain, premium neumorphic UI.
- PR #1: experimental **different** Cloudflare Pages implementation; do not merge its public UI over Next.js.
- PR #3: email-only Resend/Turnstile draft; it does not persist leads and is not production-ready.
- No target D1 production/staging bindings are verified. No Resend customer sending is verified.

## Release workflow

1. Use `staging` as the integration branch. Leave `main` as the source of currently serving production.
2. Every PR targets staging first. GitHub workflow validates schema tests, TypeScript, Next production build and smoke tests.
3. Evaluate `vinext init` **only on staging** (or a throwaway local checkout). Keep `next build` and Vercel untouched until Workers preview shows parity. Check CSS modules, SCSS, MDX, next/font/google, Next Image, dynamic blog and case study paths, header/CTA, 404, API, order fail-safe and social metadata.
4. Worker `env.DB` is the only authoritative DB binding. Create separately scoped D1 databases `abdul-portfolio-staging` and `abdul-portfolio-production`, migrate **staging only** after checking target name and ID.
5. Verify Turnstile allowed hostnames and Resend verified sender (or test-only account inbox) and store secrets in provider's secret management. Do not put credentials in GitHub or chat.
6. Test request validation, duplicate idempotency, atomic D1 insert + email outbox, retries/backoff, provider 429/5xx, webhook signature and bounce recording. Include automated abuse tests and manual mobile E2E.
7. Protect private admin routes with Cloudflare Access **and verified identity**; log all modifications.
8. Keep ordering and payment endpoints disabled until a real payment gateway, order reconciliation and refunds are independently certified.
9. Back up production and record rollback procedure; deploy to Cloudflare's staging hostname without changing public DNS. Prove page and API parity across browsers and obtain final release sign-off.
10. Only then move a **user-owned custom domain**. The Vercel-provided `vercel.app` domain remains with Vercel.
11. Monitor error, email delivery, D1 read/write/storage, Workers CPU/requests and free tier. Do not assume no unexpected charges.
12. After successful release, archive reviewable old PR work and delete only branches safe to remove, retaining `main` and `staging`.

## Do not do yet

- Do not deploy the separate Cloudflare Pages HTML prototype instead of Next.js.
- Do not connect preview to live customer DB or Resend live sending.
- Do not migrate D1 with placeholder binding IDs.
- Do not enable online payments, public order processing or unsupported Fiverr review embeds.
- Do not claim Vercel Hobby is a verified long-term commercial hosting solution.

## Commands for CI / developer (not run against production automatically)

```sh
node --test infra/d1/tests/schema.test.mjs
npm ci
npx tsc --noEmit
npm run build
```

Cloudflare migration CLI setup follows after verified account, database creation, Worker adapter integration and environment-specific configuration.
