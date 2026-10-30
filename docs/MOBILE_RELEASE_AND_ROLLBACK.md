# Portfolio mobile-only release and recovery procedure

This repository has two permanent branches: `staging` for review and `main` for production. Do not add permanent branches.

## Automated checks
- GitHub CI `verify` must pass on staging and on the PR to main.
- Cloudflare Worker previews deploy from staging; production Worker deploys from main.
- Vercel preview deploys from staging; production frontend deploys from main.
- Staging D1 ID: `863b6d6f-3197-4f34-b24d-2c43d0e0c4e4`.
- Production D1 ID: `d24afa50-9b82-4b50-86b3-dc538396026b`.
- Migration and database checks use staging environment secrets; never copy production API keys into source code.

## Day-to-day mobile flow
1. User sends requested changes to ChatGPT.
2. ChatGPT modifies `staging`, waits for `verify`, staging smoke, and relevant D1 checks.
3. User reviews staging and says *approve production*.
4. ChatGPT reviews the diff, opens a staging→main PR and checks required status checks.
5. After explicit approval, ChatGPT merges PR, verifies Vercel and Worker production deployment, and runs live health and functionality tests.
6. If anything fails, stop additional promotion and troubleshoot. Never force-push protected main.

## Safe rollback (code, not database)
- Identify last known-good main commit and relevant Vercel/Worker deployments.
- Prefer provider rollback to known-good deployment when available; otherwise create a revert PR against `main`, run CI and get explicit production approval.
- On merging revert, confirm both provider deployments are READY; compare production Worker /healthz and frontend route behavior.
- Keep D1 schema changes forward-compatible. Never automatically reverse or drop production D1 tables on code rollback.
- A completed non-mutating release readiness audit is *not* a full provider rollback rehearsal.

## Release readiness and scope
- `.github/workflows/release-readiness.yml` verifies production health without writes.
- Production Worker remains fail-closed (`ready_for_traffic:false`) until email, Turnstile, D1 runtime and security features are tested.
- D1 initial production migration is approved and verified, but live Worker binding must not be promoted before a reviewed staging→main release.
- Resend sender identity, Turnstile keys, administrative authentication and real transactional emails are separate application readiness tasks. Never enable public inquiries based only on passing CI.
- Do not auto-merge staging into main or activate payments.
