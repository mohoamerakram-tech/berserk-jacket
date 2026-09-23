# Stitch bespoke jacket studio

Next.js 16 App Router + React 19. The Node.js route handler at `POST /api/remove-bg` proxies customer PNG/JPG uploads to the public nobg API. Panel 05 (`/custom-studio?tab=import`) provides background removal, jacket color selection, drag/keyboard positioning, scale, rotation, reset, and WhatsApp ordering. Front and back each have one replaceable artwork slot with independent positioning, size and rotation. Original artwork colors are retained. Switching between Panel 04 and Panel 05 keeps uploaded artwork in memory; refreshing/leaving the page clears Panel 05 artwork. The preset studio has separate session persistence.

## Local setup

Use Node.js 24 or newer (tests use native TypeScript support).

```sh
npm install
```

No API key or background-removal URL is required. Optional `.env.local` settings:

```dotenv
# No REMBG_URL or API key is used.
# Optional: a SINGLE IP header overwritten by a trusted reverse proxy.
# REMBG_CLIENT_IP_HEADER=x-real-ip
# Business WhatsApp number in international digits (no +, spaces, or dashes).
# NEXT_PUBLIC_WHATSAPP_NUMBER=2126XXXXXXXX
```

```sh
npm run dev
```

## Single-administrator catalogue

Customer accounts remain disabled. The private routes are:

- `/admin/login` — single administrator login
- `/admin` — inventory overview
- `/admin/collections` and `/admin/collections/new` — anime collection routing and artwork
- `/admin/products` and `/admin/products/new` — constructed-product catalogue
- `/admin/logos` and `/admin/logos/new` — custom-studio motif catalogue

Collections are the parent record for products and studio motifs. Assign every product
and logo to one collection. The built-in anime-bar worlds are seeded automatically:
Berserk is active, while Bleach, Death Note, Dragon Ball, Hunter × Hunter, Naruto,
One Piece, and Chi start as upcoming. Active and upcoming collections appear on
`/collection`; upcoming cards lead to their sealed anime preview page. Change a collection
to active in the admin when its products and motifs are ready, and its anime-bar page will
then lead customers to the collection’s products and filtered custom studio.
`salesCount` on products controls the one bestseller shown for each active collection
on the home page. Built-in anime-bar collections can be hidden as drafts but cannot be
deleted. Other collections cannot be deleted until their products and logos are moved or
removed, preventing broken customer routes.

Create local-only credentials in `.env.local` (the file is already ignored by Git):

```dotenv
ADMIN_EMAIL=you@example.com
# Next expands unescaped `$` in .env files, so the separators must be `\$` locally.
# Decoded format: scrypt$<random-salt-hex>$<64-byte-scrypt-hash-hex>
ADMIN_PASSWORD_HASH=scrypt\$RANDOM_SALT_HEX\$SCRYPT_HASH_HEX
# At least 32 random characters. Use a different value in production.
ADMIN_SESSION_SECRET=...
# Optional: only set this when your host overwrites the named header.
# ADMIN_CLIENT_IP_HEADER=x-real-ip
```

The session is signed server-side, lasts eight hours, and is stored in an HttpOnly,
SameSite=Strict cookie (Secure in production). Every catalogue mutation verifies both
the session and same-origin request. The login is rate-limited as an additional guard;
configure platform-level rate limiting in production because memory limits are per instance.

During local development, catalogue changes are written to `data/admin-catalog.json`
and images to `public/uploads/catalog/`. These paths are ignored and must not be used as
production storage on serverless hosting.

For production, create a free Supabase project, run [`supabase/catalog.sql`](supabase/catalog.sql)
in its SQL editor, and add these server-only environment variables to the host:

```dotenv
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVER_ONLY_SERVICE_ROLE_KEY
ADMIN_EMAIL=you@example.com
# In a hosting dashboard, enter the raw value with `$` separators (no backslashes).
ADMIN_PASSWORD_HASH=scrypt$RANDOM_SALT_HEX$SCRYPT_HASH_HEX
ADMIN_SESSION_SECRET=...
```

Never prefix the service-role key or admin secrets with `NEXT_PUBLIC_`. The database table
uses row-level security with no browser policies; only the authenticated Next.js server routes
can mutate catalogue data. Product images and logo assets are validated as PNG/JPG/WebP and
limited to 10 MiB before upload.
Run the SQL file again after upgrading an older installation; its `add column if not exists`
migration adds collection storage without deleting existing products or logos.

Open `/custom-studio?tab=import` on the port printed by Next.js. Upload a PNG or JPG under 10 MiB. Wait for processing, drag the artwork, adjust sliders, then order via WhatsApp. Set the real NEXT_PUBLIC_WHATSAPP_NUMBER and restart development / rebuild production to enable ordering. The link pre-fills both sides’ filenames and placement details; customers attach artwork manually in WhatsApp. On failure the previous successful artwork stays available. SVG/AI files receive a specific friendly message; export them as PNG first. The browser file chooser filters to PNG/JPG; server validation still rejects unsupported uploads.

```sh
node --test tests/remove-bg.test.mjs
npx tsc --noEmit
npm run lint
npm run build
```

Manual API check (use `curl.exe` on Windows):

```sh
curl -f -F "file=@artwork.png;type=image/png" http://localhost:3000/api/remove-bg -o transparent.png
```

Tests cover forwarding, binary streaming, size/signature/MIME validation, vector rejection, chunked-body limits, upstream errors, timeout, and rate limits. Tests mock nobg and consume no external API quota.

## External API routing and hosting

Browser → your website's same-origin `POST /api/remove-bg` (field `file`) → `https://api.nobg.akshit.io/api/v1/remove-background` (field `image`) → transparent PNG streamed back. No API key headers are sent. Uploaded artwork is sent to nobg for processing; Tailscale and the self-hosted rembg server are no longer used by this route.

Run the Next.js Node server with outbound HTTPS access. Production: `npm run build` then `npm start`, behind your HTTPS reverse proxy. Remove obsolete `REMBG_URL` settings if desired; the route ignores them. The existing `REMBG_CLIENT_IP_HEADER` name remains for rate-limit configuration compatibility.

The provider's stated free allowance is 20 requests/day per IP. Requests from all customers typically share your backend's public egress IP, so this is a shared site quota, not a per-customer allowance. A provider 429 becomes `UPSTREAM_RATE_LIMITED` with a friendly message and any upstream Retry-After header preserved.

## Limits and reverse proxy

- Only PNG/JPEG MIME types with matching file signatures are accepted. Invalid raster content is rejected by the provider. Files over 10 MiB are never forwarded. Multipart bodies are bounded to 10 MiB + 64 KiB while reading, even without Content-Length.
- Processing is aborted after 30 seconds, including the upstream response stream. Before streaming begins a timeout returns JSON HTTP 504. Once HTTP headers have been sent, an interrupted stream cannot become JSON; the frontend catches failed downloads and shows an error. The frontend remains unchanged, including its 60-second fallback deadline and loading copy; the backend now aborts at 30 seconds.
- Rate limit: 10 requests/minute per trusted IP, in memory per Node process. Only set `REMBG_CLIENT_IP_HEADER` when a trusted reverse proxy **overwrites** that header and clients cannot bypass the proxy. For nginx, set `proxy_set_header X-Real-IP $remote_addr;` and use `REMBG_CLIENT_IP_HEADER=x-real-ip`. Do not pass through a client-supplied header. Without a trusted header, all clients safely share one 10/min bucket.
- For multiple workers/replicas, enforce the same limit in a shared reverse proxy or replace the memory store with Redis. Counters reset on restart.
- Configure the ingress body limit to at least 11 MiB and its response timeout above 35 seconds; retain the stricter application file limit. Provider upload limits/timeouts can otherwise reject requests before this handler runs.
- Error responses: `INVALID_UPLOAD` (400), `FILE_TOO_LARGE` (413), `VECTOR_NOT_SUPPORTED` / `UNSUPPORTED_FORMAT` (415), `RATE_LIMITED` (429 with Retry-After), `UPSTREAM_RATE_LIMITED` (429), `PROCESSING_FAILED` (502), `SERVICE_UNAVAILABLE` (503), `PROCESSING_TIMEOUT` (504). Upstream failures are logged server-side without image contents.

## Preview assets

Blank mockups come from `public/images/studio/` and `lib/studio/options.ts`. Panel 05 selects frontImage/backImage from the catalog. The catalog currently reuses the front mockup for the back because no separate blank back mockup was supplied. Both sides still retain independent artwork and transforms. The old simulated consultation submission has been replaced by the actual preview workflow; no order or consultation is silently submitted.

## WhatsApp ordering and automatic confirmations

The business destination is configured locally as `NEXT_PUBLIC_WHATSAPP_NUMBER=212639898193`. Set this variable in the production build environment too. Current app-only ordering opens a WhatsApp draft; the customer must send it and attach the prepared front/back previews. Opening WhatsApp does not prove delivery or confirm payment, so checkout keeps the cart and does not claim the order was transmitted. Bespoke artwork is copied into IndexedDB before navigation, keyed per tab with a 24-hour expiry, so temporary object URLs cannot disappear on checkout.

Automatic outbound confirmations **are not enabled**. A phone number alone is insufficient: connect the number to Meta WhatsApp Business Cloud API (or an official provider), provision the phone-number ID and server-side access token, and obtain approved templates for business-initiated confirmations outside an open customer-service window. Keep credentials server-side, never in NEXT_PUBLIC variables or chat messages. The production implementation also needs durable orders, media upload/storage, signed delivery webhooks, and idempotent sending/retry handling. Do not present an API acceptance response as customer delivery or paid-order confirmation.
