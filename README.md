# Future Stitch

Anime-inspired bespoke jacket storefront and embroidery preview studio. The application combines a collection-based product catalog, front/back garment customization, background-removed artwork previews, a single-admin catalog, and a customer-controlled WhatsApp order handoff.

> **Project status:** active student development. The repository now has an organization-review baseline, but it is not approved for production orders or storage of customer personal data. See the [security roadmap](docs/SECURITY_ROADMAP.md).

## What works today

- Collection discovery with active and upcoming anime worlds
- Existing-product shop with stock by size and sold-out states
- Preset studio with collection-filtered embroidery motifs
- Bespoke studio with one front and one back upload, drag, scale, and rotation controls
- Server-side PNG/JPEG validation and background-removal proxy
- Cart and checkout previews with a WhatsApp draft handoff
- Single-administrator management of collections, products, inventory, and motifs
- Local development storage and a Supabase production storage path

## Technology

- Next.js 16.4.3 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Supabase REST and Storage for the planned production catalog
- nobg external background-removal API

## Quick start

Use Node.js 24 or newer.

```sh
npm ci
copy .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. Real secrets belong only in `.env.local` or the deployment provider's secret manager.

## Quality gate

```sh
npm run check
```

This runs ESLint, TypeScript, the API tests, a production dependency audit, and the production build. The same checks run in GitHub Actions on pushes and pull requests to `main`.

## Repository map

```text
app/                 Next.js routes, pages, and UI
  admin/             Protected catalog interface
  api/admin/         Authenticated catalog mutations
  api/remove-bg/     Validated background-removal proxy
lib/                 Catalog, auth, cart, checkout, and studio logic
public/images/       Development and editorial media
supabase/            Production catalog schema
tests/               API boundary and failure-mode tests
docs/                Architecture, operations, and security trajectory
.github/             CI, Dependabot, ownership, and review templates
```

## Documentation

- [Architecture and trust boundaries](docs/ARCHITECTURE.md)
- [Development and operations](docs/OPERATIONS.md)
- [Cybersecurity trajectory and release gates](docs/SECURITY_ROADMAP.md)
- [Security vulnerability reporting](SECURITY.md)
- [Contribution and review rules](CONTRIBUTING.md)

## Security posture

The current baseline includes signed HttpOnly admin sessions, scrypt password verification, same-origin mutation checks, upload signature and size validation, bounded external API calls, response security headers, lockfile installs, least-privilege CI, immutable action pins, Dependabot, and production dependency auditing.

Important work remains before launch: shared rate limiting, MFA-capable admin authentication, CSP enforcement, durable order validation, monitoring, backup/restore drills, privacy and retention rules, an external security review, and documented rights for media assets.

Report vulnerabilities privately according to [SECURITY.md](SECURITY.md). Never put credentials, exploit details, customer artwork, phone numbers, or addresses in a public issue.

## External data processing

When a customer requests background removal, their selected artwork is sent through the same-origin Next.js route to the external nobg service. This dependency must be reviewed for quota, availability, and privacy before production use. The current WhatsApp action opens a draft for the customer; it does not prove delivery, acceptance, payment, or creation of a server-side order.

## Licensing and artwork

No open-source license has been selected for this repository. Anime names, logos, artwork, and other third-party assets remain the property of their respective owners. This student prototype is not an assertion of affiliation or commercial licensing. Document asset permissions before any public commercial launch.
