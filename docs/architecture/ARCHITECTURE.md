# Portfolio Platform v2 — Locked Target Architecture

**Decision date:** 2026-10-29  
**Status:** LOCKED target; deployment remains gated by compatibility and account verification.  
**Owner:** Abdul Rehman  
**Source of truth:** This document. Changes require a new ADR and explicit migration/release review.

## Product boundary

The portfolio is a commercial lead-generation, client-services, content and operations platform. It keeps the existing premium neumorphic Next.js UI and its real case studies, design language, metadata and existing public URLs. Do not replace the live Next.js frontend with the separate legacy Cloudflare Pages HTML prototype.

## Architecture and responsibilities

- **UI + server rendering:** one Next.js 16 app, existing repository. Content pages, project brief UI, authenticated admin UI, SEO.
- **Primary hosting (target):** Cloudflare Workers, with Cloudflare-recommended **vinext** deployment path tested first. vinext is beta; benchmark actual route, MDX, fonts, images and React components before adoption. Evaluate the OpenNext/Workers adapter if needed. Maintain the existing Vercel deployment until cutover.
- **Backend:** Next.js route handlers/server-side modules executing on the same Cloudflare Workers deployment. One authoritative set of business rules, no competing second backend on Vercel. Keep domain logic separate from route adapters.
- **Database:** Cloudflare D1 (SQLite), via Workers bindings only. SQL migrations are versioned in `infra/d1/migrations`. Distinct staging and production databases; no live data in previews.
- **Admin security:** Cloudflare Access for identity *plus* server-side verification of Access JWT, audience and issuer, least-privilege role checks and audit events. Never authorize based solely on client-visible headers, cookies or UI hiding.
- **Public abuse protection:** verified Cloudflare Turnstile, origin rules, request size/field validation, shared durable rate limiting, duplicate submission idempotency. All fail closed; an explicit email fallback may remain available.
- **Email:** Resend transactional sender with verified domain. Store the accepted lead and its notification job **in the same D1 batch/transaction** before returning success. Idempotent outbox delivery, bounded retries, status recording, delivery/bounce webhooks with verified signatures, admin-visible failures. Email provider acceptance is not proof of inbox delivery.
- **Media:** existing repository assets initially. Introduce Cloudflare R2 for client/media uploads only after image and permissions workflows require it; never store unrestricted file uploads in D1.
- **Data:** D1 tables for inquiries, events, content, services, orders, reviews, outbox, delivery events, audit and rate limits. Retention and deletion policies must be implemented before storing significant live personal data.
- **Observability:** privacy-safe error reporting, health checks, usage dashboards, monthly free-tier and cost alerts. No customer message bodies or API keys in logs.
- **Payments:** quote first. Card/online payments explicitly DISABLED until provider callback authenticity, order persistence, reconciliation, refund/error handling and end-to-end staging verification.
- **Review integrity:** publish testimonials only with provenance and explicit permission. Never scrape unsupported Fiverr review widgets or fabricate reviews.
- **Source control:** `main` = public production, `staging` = isolated verification, short-lived feature branches as needed; clean up reviewed/merged old branches, not blindly delete open PR work.
- **Credentials:** environment-scoped secrets, no passwords or tokens in source or chat, separated staging/test and production recipients.

## Release constraints

1. Keep `https://abdulrehmansarwar.vercel.app` serving the existing site, with the original UI intact, throughout migration.
2. Measure compatibility of vinext/Next.js 16 with SSR, MDX, next/font, Next Image, contact UI, navigation, CSP, API routes, caching, and build size. Validate access to D1 bindings under the chosen runtime and Workers CPU/bundle constraints.
3. Test D1 migrations on a fresh **local** DB, then independently provision isolated staging D1 + bindings. No production D1 migration until rollback/backups exist.
4. Finish Resend verified-domain setup and Turnstile hostname-scoped site/secret. Re-test actual delivery to owned inbox and failure paths before live launch.
5. Run automated unit/schema tests, typecheck, build, route/API smoke, mobile/accessibility/performance checks, security checks, and preview verification.
6. Release to Cloudflare production behind a separate test hostname or equivalent gated deployment, verify metrics and rollback, then perform a deliberate DNS/custom-domain cutover. The Vercel-owned `vercel.app` hostname cannot be reassigned.
7. If full-stack Next.js on Workers is not compatible or cannot meet pricing/security/performance requirements, preserve Vercel and use a **commercially permitted** plan (or reconsider hosting) before enabling commercial traffic. Do not deploy an unverified architecture to preserve a free tier.

## Existing work to reuse safely

- **PR #1**: Separate Cloudflare Pages prototype, D1 migrations, admin/outbox/review tests. Reuse tested domain behavior, validation, migration concepts; do not merge its replacement HTML site over Next.js.
- **PR #3**: Resend + Turnstile contact form on a draft feature branch, email-only. Retain as a reviewable intermediate until durable D1-first submission can replace its non-persistent email flow. Do not promote an email-only API as the final CRM.
- **Current `main`**: production Next.js site, safe-disabled online ordering, real portfolio work, public blog, design system.

## First delivery milestones

- M0: architecture lock, staging branch and CI, D1 schema and local tests.
- M1: prove existing Next.js site runs with Workers adapter, no UI regressions.
- M2: D1-backed inquiry API + outbox + spam controls + idempotency + staging DB.
- M3: Resend delivery, retry/webhook and private admin lead inbox.
- M4: content CMS, reviews, quotations/orders (no active payments), media.
- M5: release readiness, monitoring/backups, controlled production cutover.

**Current stage:** M0 work started. Architecture is **not** the same as verified deployment. No claim of connected Cloudflare database, Resend sender or operational customer email until tested.
