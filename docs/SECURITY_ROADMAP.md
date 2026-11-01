# Security roadmap

This document is the cybersecurity trajectory for Future Stitch. It is a release plan, not a claim that the unfinished application is production-secure.

## Current posture — development baseline

Completed in the repository:

- [x] Secrets and local uploads excluded from Git; sanitized `.env.example` committed
- [x] Git history scanned for common credential patterns; no real secret detected
- [x] Next.js updated from vulnerable 16.3.5 to patched 16.4.3
- [x] Production dependency audit passes with zero known vulnerabilities on 1 November 2026
- [x] CI runs lint, type-check, tests, production audit, and build with read-only permissions
- [x] GitHub Actions are pinned to immutable commit SHAs
- [x] Dependabot monitors npm and GitHub Actions weekly
- [x] Security policy, CODEOWNERS, contribution rules, and review templates added
- [x] Baseline response headers enabled and `X-Powered-By` disabled
- [x] Upload boundaries, signature checks, timeouts, and same-origin admin mutation checks implemented

Known development limitations:

- The full dependency audit still reports moderate advisories in development-only ESLint/minimatch tooling; the production dependency audit is clean. Do not apply npm's suggested forced downgrade to ESLint 4.
- The admin is a custom single-user system without MFA, central revocation, or durable audit logs.
- Rate limits are process-local and reset on restart; they are not sufficient for a scaled deployment.
- A strict Content Security Policy is not enabled yet.
- Customer artwork is processed by a free external service whose quota, privacy terms, and availability are outside this repository.
- The WhatsApp flow does not create a durable order, delivery receipt, or payment record.
- Product and anime media rights have not been documented for commercial use.
- Repository media makes the packed Git history about 133 MiB; three tracked MP4 files account for roughly 68 MiB. Production media needs an asset pipeline and ownership register. Moving existing history to Git LFS or object storage must be coordinated because it rewrites clone history.

## Milestone 1 — organization review

Goal: make collaboration predictable without exposing credentials or weakening review.

- [ ] Enable branch protection or a repository ruleset for `main`
- [ ] Require pull requests, the CI check, resolved conversations, and no force pushes
- [ ] Enable GitHub private vulnerability reporting
- [ ] Enable CodeQL default setup and secret scanning/push protection where the repository plan permits
- [ ] Add organization members through least-privilege teams; avoid shared GitHub accounts
- [ ] Decide and add a software license, or explicitly keep the repository proprietary
- [ ] Create an asset register containing source, owner, license, and allowed use
- [ ] Record architecture and security decisions in short ADRs under `docs/decisions/`

Exit criteria: a reviewer can clone, configure, validate, and assess the repository without receiving a secret or relying on private verbal instructions.

## Milestone 2 — controlled preview deployment

Goal: expose a non-production preview without accepting sensitive or paid orders.

- [ ] Use a maintained managed host with automatic HTTPS and isolated preview environments
- [ ] Store secrets only in the host secret manager; rotate all setup credentials after onboarding
- [ ] Replace process-local limits with an edge or shared store limit for login and image processing
- [ ] Add structured security logging with redaction and alerts for repeated auth failures and upstream abuse
- [ ] Deploy Content Security Policy in report-only mode, fix violations, then enforce it
- [ ] Restrict outbound network destinations to required services where the host supports egress controls
- [ ] Review Supabase grants, row-level security, bucket visibility, backups, and restore procedure
- [ ] Re-encode uploaded catalog images server-side before public storage; strip metadata
- [ ] Add automated authorization tests for every admin API route
- [ ] Publish a preview privacy notice explaining the third-party artwork processor

Exit criteria: the preview contains no real customer data, secrets are rotatable, abuse is bounded across instances, and alerts reach an owner.

## Milestone 3 — production order readiness

Goal: accept real customer details and orders with defined ownership and recovery.

- [ ] Replace or extend custom admin auth with a maintained provider supporting MFA and session revocation
- [ ] Model durable orders with server-generated IDs, explicit states, and idempotent mutations
- [ ] Enforce server-side price, stock, collection, size, and product validation at order creation
- [ ] Add an append-only admin audit trail for catalog, inventory, and order changes
- [ ] Define data minimization, retention, deletion, export, and access procedures
- [ ] Add signed webhook verification and replay protection before any WhatsApp Cloud or payment integration
- [ ] Keep payment data outside this application through a compliant hosted checkout
- [ ] Add backup restore drills, incident response runbook, and deployment rollback drill
- [ ] Perform an independent application security review and remediate high-risk findings
- [ ] Complete legal review for privacy, cookies, terms, returns, consumer obligations, and media rights

Exit criteria: a real order can be traced, recovered, corrected, and deleted according to policy without trusting browser-supplied totals or status.

## Milestone 4 — ongoing security operations

- [ ] Monthly dependency and access review
- [ ] Quarterly secret rotation and restore exercise
- [ ] Security review for every new external service or sensitive data field
- [ ] Annual threat-model refresh and independent test
- [ ] Documented patch targets: critical within 24 hours, high within 7 days, moderate within 30 days
- [ ] Generate an SBOM and retain release provenance for production deployments

## Risk acceptance

Any deferred security item needs an owner, reason, compensating control, and review date. “The site is unfinished” explains sequencing but does not reduce the risk of exposing an unfinished build to the public internet.
