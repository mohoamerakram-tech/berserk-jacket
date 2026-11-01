# Security policy

Future Stitch is under active development and is not yet approved for production orders or storage of customer personal data. Security work is tracked in [`docs/SECURITY_ROADMAP.md`](docs/SECURITY_ROADMAP.md).

## Supported versions

Only the current `main` branch receives security fixes. There are no supported production releases yet.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability and do not include customer data, credentials, or exploit details in an issue.

Use GitHub's private vulnerability reporting form:

<https://github.com/mohoamerakram-tech/berserk-jacket/security/advisories/new>

Include the affected route or component, impact, reproduction steps, and a minimal proof of concept. Remove secrets and personal data from evidence. The maintainer will acknowledge a report when it is reviewed, coordinate remediation, and disclose it only after a fix is available.

## Scope priorities

High-priority areas include:

- Admin authentication and authorization bypasses
- Exposure of Supabase service-role credentials or session secrets
- Unrestricted file upload, content-type bypass, and stored malicious content
- Server-side request forgery or unsafe external API forwarding
- Cross-customer preview, order, or personal-data disclosure
- Injection, cross-site scripting, and cross-site request forgery
- Abuse that bypasses rate limits or causes material service exhaustion

Automated scanner output without a demonstrated impact is still useful, but include the tool version and exact finding so it can be reproduced.
