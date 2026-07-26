# TechTide Swarm 357 — Landing Site

[![techtide-swarm](https://img.shields.io/pypi/v/techtide-swarm.svg)](https://pypi.org/project/techtide-swarm/)
[![CI](https://github.com/TechTideOhio/swarm-357-site/actions/workflows/ci.yml/badge.svg)](https://github.com/TechTideOhio/swarm-357-site/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Landing](https://img.shields.io/badge/landing-0.2.2-blue.svg)](https://github.com/TechTideOhio/swarm-357-site)
[![Core](https://img.shields.io/badge/techtide--swarm-0.2.2-green.svg)](https://github.com/TechTideOhio/swarm-357/releases/tag/v0.2.2)

**Landing 0.2.2** — compatible with / powered by [`techtide-swarm` **0.2.2**](https://pypi.org/project/techtide-swarm/0.2.2/).

Public Next.js 16 product surface for [TechTide Swarm 357](https://github.com/TechTideOhio/swarm-357).

| Repo | Role |
|------|------|
| [TechTideOhio/swarm-357](https://github.com/TechTideOhio/swarm-357) | Core runtime, Python package, Memvid bridge, STATUS / VERIFY |
| **This repo** | Marketing site + same-origin BFF for Try-it-live |

## Product install (core)

```bash
pip install techtide-swarm==0.2.2
swarm demo
```

Docs of record live in the core repo: [STATUS.md](https://github.com/TechTideOhio/swarm-357/blob/main/STATUS.md) · [VERIFY.md](https://github.com/TechTideOhio/swarm-357/blob/main/docs/VERIFY.md) · [CHANGELOG](https://github.com/TechTideOhio/swarm-357/blob/main/CHANGELOG.md) · [CLAUDE.md](https://github.com/TechTideOhio/swarm-357/blob/main/CLAUDE.md) · [Release v0.2.2](https://github.com/TechTideOhio/swarm-357/releases/tag/v0.2.2).

## Stack

- Next.js 16 App Router + TypeScript strict + Tailwind CSS v4
- Content/config: `lib/config.ts` (`SITE_VERSION` / `CORE_PACKAGE_VERSION`)
- Optional WebGL dither cursor (disabled on mobile)
- Deploy target: Railway (`nixpacks.toml` uses npm + `package-lock.json`; `bun.lock` ignored for deploy)

## Commands

```bash
bun install   # or npm ci
bun run dev
bun run typecheck
bun run build
bun run lint
```

## Environment

```bash
# Public API base for read-only client fetches (health, agents, status)
# Production: https://swarm357be.up.railway.app
NEXT_PUBLIC_API_URL=https://swarm357be.up.railway.app

# Server-only BFF (/api/swarm/run) — never NEXT_PUBLIC_*
SWARM_API_KEY=
# Optional override for the BFF upstream
# SWARM_API_URL=https://swarm357be.up.railway.app
```

## Production URLs

| Surface | URL |
|--------|-----|
| Frontend | https://swarm357fe.up.railway.app |
| Backend API | https://swarm357be.up.railway.app |

## Honesty

- Try-it-live demo writes go through same-origin BFF; the write key stays server-side.
- Use-case scenarios on the landing page are illustrative composites — not named customer endorsements.
- Opik cloud observability is **Not implemented** in core; local JSONL traces are the source of truth.
- Feature maturity mirrors core [STATUS.md](https://github.com/TechTideOhio/swarm-357/blob/main/STATUS.md) (Dream = Experimental; HITL/SSE = Beta).

## Related

- Core runtime: https://github.com/TechTideOhio/swarm-357
- PyPI: https://pypi.org/project/techtide-swarm/
- Core release: https://github.com/TechTideOhio/swarm-357/releases/tag/v0.2.2

## License

Apache-2.0 — see [LICENSE](LICENSE).
