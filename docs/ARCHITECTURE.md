# Architecture

## System context

Future Stitch is a Next.js App Router application with a public storefront, a browser-based jacket studio, and a single-administrator catalog.

```text
Customer browser
  ├─ Public pages, cart, preview editor
  ├─ POST /api/remove-bg ──> nobg background-removal service
  └─ WhatsApp deep link ──> customer sends the prepared order

Administrator browser
  └─ /admin + /api/admin/*
       └─ signed HttpOnly session cookie

Next.js server
  ├─ local JSON + local uploads (development only)
  └─ Supabase REST + Storage (planned production persistence)
```

## Main modules

| Area | Location | Responsibility |
| --- | --- | --- |
| Public storefront | `app/`, `app/shop/`, `app/collection/` | Collection discovery, product browsing, stock presentation |
| Jacket studio | `app/custom-studio/`, `app/components/studio/`, `lib/studio/` | Front/back artwork composition and temporary browser persistence |
| Checkout | `app/checkout/`, `lib/checkout/` | Order summary and WhatsApp handoff |
| Admin | `app/admin/`, `app/api/admin/`, `lib/admin/` | Single-admin catalog and media management |
| Catalog data | `lib/catalog/`, `lib/collections.ts`, `lib/products.ts` | Storage abstraction and public catalog filtering |
| Background removal | `app/api/remove-bg/route.ts` | Validated, bounded proxy to the external image processor |
| Production schema | `supabase/catalog.sql` | Catalog row and public catalog-media bucket |

## Data ownership and lifecycle

- Products, collection metadata, and studio motifs are catalog data managed by the administrator.
- Development catalog changes live in ignored local files and are not portable production storage.
- Production catalog data uses a server-only Supabase service-role key. Browsers never receive that key.
- Bespoke artwork is temporary browser state and is sent to the external background-removal provider when the customer requests processing.
- The current WhatsApp flow does not create a durable server-side order. The customer chooses whether to send the prepared message and attachments.

## Trust boundaries

1. **Browser to Next.js:** all form values, query parameters, cookies, and uploads are untrusted.
2. **Next.js to Supabase:** the service-role credential has broad privileges and must remain server-only.
3. **Next.js to nobg:** uploaded customer artwork crosses to a third-party processor. Responses are untrusted and must be type-checked and bounded.
4. **Browser to WhatsApp:** this is a user-controlled external navigation, not proof that an order was delivered, accepted, or paid.
5. **GitHub Actions:** workflows run repository code and dependency lifecycle scripts. Workflow permissions stay read-only unless a narrowly documented write is required.

## Security controls already present

- Scrypt password verification and constant-time comparisons
- Signed, expiring, HttpOnly, SameSite=Strict admin session cookie
- Same-origin validation on admin mutations
- Login and image-processing rate limits for a single process
- Upload size, MIME type, and magic-number validation
- Bounded background-removal request bodies and upstream timeout
- Supabase service-role variables kept outside the browser bundle
- Baseline browser security headers and disabled framework signature header
- Lockfile-based installs, CI checks, production dependency audit, and Dependabot configuration

These controls are a development baseline. The remaining production gates are tracked in [`SECURITY_ROADMAP.md`](SECURITY_ROADMAP.md).
