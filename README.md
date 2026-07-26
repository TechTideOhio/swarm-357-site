# TechTide Swarm 357 - Landing Site

[![techtide-swarm](https://img.shields.io/pypi/v/techtide-swarm.svg)](https://pypi.org/project/techtide-swarm/)
[![CI](https://github.com/TechTideOhio/swarm-357-site/actions/workflows/ci.yml/badge.svg)](https://github.com/TechTideOhio/swarm-357-site/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

**Landing 0.2.2** - compatible with [`techtide-swarm` **0.2.2**](https://pypi.org/project/techtide-swarm/0.2.2/).

Public Next.js 16 product surface and documentation library for [TechTide Swarm 357](https://github.com/TechTideOhio/swarm-357).

| Surface | URL |
|---------|-----|
| Marketing + docs | https://swarm357fe.up.railway.app |
| Documentation home | https://swarm357fe.up.railway.app/docs |
| Changelog | https://swarm357fe.up.railway.app/changelog |
| Evals | https://swarm357fe.up.railway.app/evals |
| Backend API | https://swarm357be.up.railway.app |

## Product install (core)

```bash
pip install techtide-swarm==0.2.2
swarm demo
```

User-facing docs live on-site: [docs](https://swarm357fe.up.railway.app/docs) (guides, API, CLI, roster, security, evals). Core source: [TechTideOhio/swarm-357](https://github.com/TechTideOhio/swarm-357).

## Stack

- Next.js 16 App Router + TypeScript strict + Tailwind CSS v4
- MDX docs under `content/docs/` (synced from core via `bun run generate:content`)
- Content/config: `lib/config.ts` (`SITE_VERSION` / `CORE_PACKAGE_VERSION`)
- Optional WebGL dither cursor (disabled on mobile)
- Deploy target: Railway (`nixpacks.toml` uses Bun)

## Commands

```bash
bun install
bun run dev
bun run typecheck
bun run build
bun run lint
bun run check:content
bun run generate:content   # requires ../swarm357-sync
```

## Environment

```bash
# Public site URL for sitemap, JSON-LD, llms.txt
NEXT_PUBLIC_SITE_URL=https://swarm357fe.up.railway.app

# Public API base for read-only client fetches (health, agents, status)
NEXT_PUBLIC_API_URL=https://swarm357be.up.railway.app

# Server-only BFF (/api/swarm/run) - never NEXT_PUBLIC_*
SWARM_API_KEY=
```

## Content pipeline

1. Edit canonical docs in `Apps/swarm357-sync` (or hand-written pages in `content/docs/`).
2. Run `bun run generate:content` to sync MDX, blog data, and eval snapshots.
3. Run `bun run check:content` before CI (dash purge, single GitHub URL policy, frontmatter).

## Honesty

- Try-it-live demo writes go through same-origin BFF; the write key stays server-side.
- Use-case scenarios on the landing page are illustrative composites, not named customer endorsements.
- Opik cloud observability is **Not implemented** in core; local JSONL traces are the source of truth.
- Feature maturity mirrors [status page](https://swarm357fe.up.railway.app/docs/resources/status) (Dream = Experimental; HITL/SSE = Beta).

## Related

- Core runtime: https://github.com/TechTideOhio/swarm-357
- PyPI: https://pypi.org/project/techtide-swarm/

## License

Apache-2.0 - see [LICENSE](LICENSE).
