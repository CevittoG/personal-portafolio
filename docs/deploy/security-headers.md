# Security headers

Production is a Render static site behind Cloudflare. Render serves the
static export; these response headers are **set in the Render dashboard**
(Static Site → Settings → Headers, path `/*`). `docker/security-headers.conf`
applies the same list to the local nginx preview so it behaves like
production. Keep the two in sync.

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), browsing-topics=()` |
| `Content-Security-Policy-Report-Only` | see below |

## Content Security Policy (report-only)

```
default-src 'self';
script-src 'self' 'unsafe-inline' https://cloud.umami.is;
connect-src 'self' https://cloud.umami.is https://api-gateway.umami.dev;
img-src 'self' data:;
style-src 'self' 'unsafe-inline';
font-src 'self';
object-src 'none';
base-uri 'self';
frame-ancestors 'none'
```

(Paste as one line in the dashboard.)

It ships as **Report-Only**: browsers log violations in the console but block
nothing, so a wrong entry can't break analytics or the page. After a week of
clean consoles in production, rename the header to
`Content-Security-Policy` to enforce it.

Why the loose parts:

- `script-src 'unsafe-inline'`: a Next.js static export inlines its
  hydration payload and the pre-paint theme and language scripts. Nonces
  need a server; hashes change every build.
- `style-src 'unsafe-inline'`: React `style` attributes (swimlane bars,
  tag colors).
- Umami hosts: the analytics script and its beacon endpoint.

`X-Frame-Options: DENY` duplicates `frame-ancestors 'none'` for browsers
that ignore report-only CSP.
