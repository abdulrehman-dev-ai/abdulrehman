# Laptop-free operation — one-time connection and mobile flow

## Current platform
- Live frontend (Next.js/Vercel): https://abdulrehmansarwar.vercel.app
- Staging frontend (stable Vercel branch alias): https://abdulrehmansarwar-git-staging-abdul-rehman-ai-devs-projects.vercel.app
- Source of truth: https://github.com/abdulrehman-dev-ai/abdulrehman
- Long-lived branches: `main` and `staging`.
- Cloudflare Worker bootstrap lives in `infra/worker`. It exposes `GET /healthz`; every `/api/*` endpoint is intentionally closed (HTTP 503). This is not yet a functional CRM.
- No custom domain is required to create a Worker or test its `workers.dev` URL.
- Resend production mail requires a verified sender domain; do not treat a test email as proof of customer delivery.

## Owner setup — phone browser, one time

**A. Cloudflare native Git deployment — NO manual GitHub API token needed.**

1. In Cloudflare **Workers & Pages**, choose **Create application → GitHub**.
2. Authorize access to the existing repository `abdulrehman-dev-ai/abdulrehman` (prefer repository-only permissions).
3. Set the Worker name `abdul-portfolio-api`, root directory `infra/worker`, production branch `main`.
4. Choose no build command (single JavaScript module); deploy command `npx --yes wrangler@4.151.3 deploy`. Enable Worker Previews on the staging branch; preview command `npx --yes wrangler@4.151.3 preview`.
5. First production bootstrap can be public at `*.workers.dev/healthz`, but business routes return 503 until the backend is finished. Confirm the response contains `service: portfolio-api`, `status: ok`, and `ready_for_traffic: false`. `/readyz` intentionally returns 503 until the real backend is configured.
6. IMPORTANT: **Do not** add a production D1 binding to Worker Previews. Later provision separate D1 staging and production databases and configure Worker Previews to bind to the isolated staging D1. If the dashboard uses shared bindings by default, disable preview builds until isolation is confirmed.
7. Send the Worker URL back in chat (not a token). Cloudflare's native Git builds then run on pushes independently of GitHub Actions minutes.

**B. Vercel frontend — already auto-deploying.**
- `main` pushes automatically update the live `vercel.app` URL.
- `staging` pushes create a Vercel preview and update the stable branch alias.
- Preview may require your Vercel login; do not remove SSO just to bypass preview protection.
- Existing Vercel project environment variables are currently empty; later add only required per-environment *server-side* API URLs/secrets.

**C. Resend**
- Account creation alone is sufficient for UI/template development.
- For staging sending, use Resend test mode with your own authorized inbox. Configure secrets inside Cloudflare only when the API integration is implemented.
- For real customer mail, purchase/verify a domain later. Never paste an API key in chat, commit it, or expose it via `NEXT_PUBLIC_*`.

**D. Production release controls**
- GitHub `main` currently has no protection rule, so Vercel immediately builds any push. Require passing `verify` checks / no force-push and PR review on `main` in GitHub Settings → Rules, if available on the repository's plan.
- A green local test is NOT a green deployed site. On staged changes, check GitHub CI, Vercel READY and live smoke checks before releasing from `staging` to `main`.
- Production promotion is a deliberate merge managed by the assistant after checks; no automatic promotion of every staging commit merely because it compiled.
- Never set up a GitHub Action that auto-promotes staging and bypasses security checks.

## Day-to-day (phone)
1. Send the requested change to ChatGPT. ChatGPT can edit connected GitHub source, review CI and deployments, and manage a controlled merge to `main` when appropriate.
2. Git-provider integrations perform the frontend/Worker builds without local commands.
3. Check GitHub Actions, Vercel Deployments, and Cloudflare Worker Build history from phone if a deployment or provider action needs your approval.
4. If Cloudflare native Git integration fails, the Worker can be redeployed through its Dashboard after fixing the integration, or via a scoped secret in a future recovery-only CI workflow—not as the default path.
5. External provider authentication and financial/account approvals always belong to the owner. ChatGPT cannot guarantee continuous background work outside an active task/session.

## Guardrails from Ocean Yacht Registration experience
- Never run migrations against the wrong database; always independently verify DB ID/name and backup before production changes.
- D1 previews require explicitly isolated bindings; no staging reads or writes against production.
- Keep payment and order routes disabled until tested.
- Respect free-tier build, CPU, request, storage and usage quotas; set thresholds and check provider dashboards.
- Release rollback: revert `main` in Git, verify Vercel deployment and Cloudflare Worker health before restoring the public route.
- Avoid branch proliferation; safely review/merge/close old PRs before branch cleanup.

## Diagnostic entry points
- GitHub CI: https://github.com/abdulrehman-dev-ai/abdulrehman/actions
- Vercel project: https://vercel.com/abdul-rehman-ai-devs-projects/abdulrehmansarwar
- Cloudflare: https://dash.cloudflare.com → Workers & Pages → abdul-portfolio-api → Deployments/Builds
- Resend: https://resend.com/emails

## 2026-10-30 — staging D1 database created

- Dashboard screenshot confirms `abdul-portfolio-staging`, ID `863b6d6f-3197-4f34-b24d-2c43d0e0c4e4`.
- Database is newly created; **zero user tables** before applying migrations.
- Source `infra/worker/wrangler.jsonc` now specifies this database **only under `previews.d1_databases`**. No D1 binding exists on the top-level production Worker.
- Migration-only configuration: `infra/worker/wrangler.preview-migrations.jsonc`; migration files: `infra/d1/migrations`.
- Next action, **after scoped Cloudflare deployment authorization is available**, is to apply the first migration to **staging only**, using the migration-only config and verifying the target UUID. Do not run a D1 migration with the production Wrangler config and do not paste migration SQL directly into the dashboard without review.
- Reference command (run in the Worker directory by automation, not the owner's phone):
  `npx wrangler d1 migrations apply abdul-portfolio-staging --config wrangler.preview-migrations.jsonc --remote`
- Verify `d1_migrations`, inquiries, email_outbox, and rate_limit_buckets exist, and check D1 usage after application.
- Until migration + Turnstile + Resend verified config and isolated end-to-end testing are finished, `INQUIRIES_ENABLED` and `EMAIL_PIPELINE_READY` must stay unset/false. Health and readiness endpoints remain fail-closed.
- Cloudflare Worker Previews have explicit resource configuration and may be public by default. Never add staging production email sending or production customer data to previews.
