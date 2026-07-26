# TechTide Swarm 357 — Landing Site

Public Next.js 16 landing page for [TechTide Swarm 357](https://github.com/TechTideOhio/swarm-357).

This repository is the **split product surface**. The orchestration runtime, Python package, and Memvid bridge live in the core repo — not here.

## Stack

- Next.js 16 App Router + TypeScript strict + Tailwind CSS v4
- Content/config: `lib/config.ts`
- Optional WebGL dither cursor (disabled on mobile)
- Deploy target: Railway (see `railway.toml` / `nixpacks.toml`)

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
# Production API: https://swarm357be.up.railway.app
NEXT_PUBLIC_API_URL=https://swarm357be.up.railway.app
# Server-only (BFF /api/swarm/run) — never NEXT_PUBLIC_*
SWARM_API_KEY=
```

## Production URLs

| Surface | URL |
|--------|-----|
| Frontend | https://swarm357fe.up.railway.app |
| Backend API | https://swarm357be.up.railway.app |

## Related

- Core runtime: https://github.com/TechTideOhio/swarm-357
- PyPI: https://pypi.org/project/techtide-swarm/

## License

Apache-2.0 — see [LICENSE](LICENSE).
