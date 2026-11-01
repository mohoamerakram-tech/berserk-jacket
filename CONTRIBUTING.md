# Contributing

This is a student project moving toward organization review. Keep changes small, reviewable, and tied to a customer, operator, reliability, or security outcome.

## Workflow

1. Create a branch from `main` using a descriptive name such as `feature/collection-filter` or `security/shared-rate-limit`.
2. Never commit `.env.local`, credentials, customer uploads, exported databases, or real order data.
3. Make the change and add focused tests for security boundaries or behavior that can regress.
4. Run `npm run check`.
5. Open a pull request using the repository template. Resolve CI and review findings before merge.

## Engineering rules

- Treat every browser value, upload, webhook, and external API response as untrusted.
- Enforce authentication and authorization in server code, even when the UI hides a control.
- Validate file size, declared MIME type, and file signature before storage or forwarding.
- Keep service-role keys, admin secrets, and provider tokens server-side. Never use a `NEXT_PUBLIC_` prefix for secrets.
- Use parameterized APIs and constrained schemas for persisted data.
- Log operational context without credentials, artwork bytes, addresses, phone numbers, or full request bodies.
- Document new environment variables, external services, migrations, failure modes, and rollback steps.
- Avoid adding dependencies when a small platform API is sufficient. Review maintenance status and advisories before adding one.

## Review ownership

Changes to admin auth, API routes, storage, Supabase, CI, or security policy require review from the repository owner. CODEOWNERS records this boundary for GitHub reviews.

## Licensing and assets

The repository does not currently grant an open-source license. Do not add third-party artwork, logos, fonts, or product photography unless the project has permission to store and use them. Record the source and license for any approved asset.
