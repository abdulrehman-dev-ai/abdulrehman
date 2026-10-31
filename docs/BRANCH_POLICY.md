# Repository Branch Policy

Only two **permanent** Git branches are maintained:

- `staging`: all assistant-driven development, automatic CI, Vercel preview and Cloudflare Worker preview.
- `main`: protected production; changes arrive only after explicit owner approval via a reviewed `staging` → `main` PR.

## Daily workflow

1. Develop with focused commits on `staging` (no recurring feature branch proliferation).
2. Verify GitHub `verify` CI, staging deployment and smoke tests before proposing production.
3. Review the `staging` → `main` diff, keep public email/payments disabled until independently tested, and ask for explicit owner approval.
4. Squash-merge only once checks pass and the owner approves, then verify both Vercel and Cloudflare production deployments.
5. Do not force-push, directly edit `main`, or automatically promote `staging`.
6. Rollback using a reviewed revert PR and/or provider previous deployment; never reverse D1 schemas destructively.

## Archived 2026-10-31 legacy branches

Archive tags retain each exact historical commit *without adding long-lived branches*. These are historical code snapshots, **not deployed or merged production features**.

| Former branch | Git tag | Historical head SHA | Related PR | Note |
| --- | --- | --- | --- | --- |
| `feat/lead-inquiries-resend-20261029` | `archive/2026-10-31/lead-inquiries-resend` | `015f8749ae11f10b0a0766aa138f2ea40dca2d38` | #3 | Unfinished Resend direct inquiries; deferred until sender domain and secure delivery are ready |
| `feature/cloudflare-portfolio-platform` | `archive/2026-10-31/cloudflare-portfolio-platform` | `ae8b029621b10bb8781dbd022c8fe6c9222dd5f2` | #1 | Alternative platform/CMS implementation; not blindly merged into Next.js staging |
| `feature/portfolio-completion-2026` | `archive/2026-10-31/portfolio-completion` | `bc7fff19abcb76c51e422fcebd5b506682a0106d` | #2 | Older SEO/case study/checkout implementation; preserve for selective reuse |
| `feature/real-client-showcase-2026` | `archive/2026-10-31/real-client-showcase` | `5566ee0774c221d8c0c964a9569167137161dcd5` | — | Fully behind staging; no unique commits relative to staging |

Restore a historical file by reading it from its archive tag; reimplement or selectively port any valuable parts directly into `staging` after review. Do not recreate a permanent legacy branch.

Draft PR #5 (`staging` → `main`) remains open for a separately approved production release.
