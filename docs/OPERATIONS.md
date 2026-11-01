# Development and operations

## Local development

Requirements:

- Node.js 24 or newer
- npm with the committed `package-lock.json`

```sh
npm ci
copy .env.example .env.local
npm run dev
```

Use placeholders locally and replace only the values you need. `.env.local` is ignored by Git.

## Environment variables

| Variable | Exposure | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Public browser value | Business WhatsApp destination in international digits |
| `ADMIN_EMAIL` | Server only | The one allowed administrator email |
| `ADMIN_PASSWORD_HASH` | Server only | `scrypt$<salt-hex>$<hash-hex>` credential verifier |
| `ADMIN_SESSION_SECRET` | Server only | At least 32 random characters for session signatures |
| `SUPABASE_URL` | Server configuration | Production Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret, server only | Catalog database and media access |
| `ADMIN_CLIENT_IP_HEADER` | Server only, optional | Trusted proxy-overwritten client IP header for login limits |
| `REMBG_CLIENT_IP_HEADER` | Server only, optional | Trusted proxy-overwritten client IP header for image limits |

Never prefix a secret with `NEXT_PUBLIC_`. In local Next.js env files, escape the dollar separators in the scrypt hash as shown in `.env.example`; hosting dashboards receive the raw value.

## Validation

```sh
npm run lint
npm run typecheck
npm test
npm run audit:prod
npm run build
```

`npm run check` runs the complete sequence. The background-removal tests mock nobg and do not consume its external quota.

## Storage modes

### Development

- Catalog state: `data/admin-catalog.json`
- Catalog uploads: `public/uploads/catalog/`

Both locations are ignored. Do not deploy them as persistent storage.

### Production target

1. Create a Supabase project.
2. Run `supabase/catalog.sql` in the SQL editor.
3. Configure server-only Supabase and admin variables in the host secret manager.
4. Confirm the `catalog-media` bucket contains only intended public product and motif assets.
5. Run the release gates in [`SECURITY_ROADMAP.md`](SECURITY_ROADMAP.md).

## Background-removal flow

```text
Browser POST /api/remove-bg (field: file)
  -> Next.js validates and bounds the upload
  -> https://api.nobg.akshit.io/api/v1/remove-background (field: image)
  -> transparent PNG streams back to the browser
```

Accepted input is one PNG or JPEG under 10 MiB. The proxy aborts after 30 seconds and maps provider failures to stable JSON error codes. The provider is an external data processor and its availability and privacy terms must be reviewed before production launch.

## Deployment release gate

Do not accept real orders merely because the build succeeds. Before a public release, record:

- Hosting provider and HTTPS configuration
- Secret storage and rotation owner
- Database backup and restore test
- Shared production rate-limit implementation
- Monitoring, alerting, and incident contact
- Privacy notice and retention rules for customer data and artwork
- Asset and trademark permissions
- Rollback procedure and last known-good deployment
