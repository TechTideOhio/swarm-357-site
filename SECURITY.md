# Security Policy

This repository holds the marketing site and documentation for TechTide Swarm 357. The agent runtime and HTTP API live in [TechTideOhio/swarm-357](https://github.com/TechTideOhio/swarm-357).

## Reporting a vulnerability

Report security issues privately through GitHub Security Advisories on
[TechTideOhio/swarm-357](https://github.com/TechTideOhio/swarm-357/security/advisories/new),
or email `ai@techtide.ai` with the subject `[SECURITY] Swarm 357 site`.

Do not open a public issue for an exploitable vulnerability.

We aim to acknowledge a report within 72 hours and to share a remediation timeline after triage.

## Trust boundaries

| Surface | Posture |
|---------|---------|
| `POST /api/swarm/run` | Anonymous same-origin proxy. The server pins `simulate: true`, clamps `budget_usd` to a demo ceiling, caps task length and body size, and rate limits per IP. Client-supplied flags are ignored. |
| Write key | `SWARM_API_KEY` is read server side on each request. It is never prefixed with `NEXT_PUBLIC_`, so it cannot be inlined into the client bundle. |
| Read fetches | The browser calls the core API directly for health, roster, status, and cost. Those responses are redacted for unauthenticated callers by the API. |
| Response headers | Content Security Policy, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and HSTS in production. |
| Raw docs export | `/docs/raw/...` serves committed content only. Role slugs are allowlisted and resolved paths are confined to the SOUL template directory. |

## Automated checks

Every pull request runs typecheck, lint, unit tests, a production build, a gitleaks scan of the full git history, and CodeQL for TypeScript and GitHub Actions.

## Limitations

- The demo endpoint is anonymous by design, so its protection is a spend ceiling plus rate limiting rather than identity.
- Rate limiting is per process. It is a cost brake on a single replica, not a distributed quota.
- The Content Security Policy allows inline scripts and styles because the framework and animation layer require them without a nonce-issuing middleware. It restricts sources, not inline execution.

## Environment variables

Only `NEXT_PUBLIC_*` values are safe to expose. They are inlined into the client bundle at build time. Every other variable, including `SWARM_API_KEY`, must be configured as runtime-only on the host.
