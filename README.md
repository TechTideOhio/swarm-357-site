# TechTide Swarm 357, Landing Site

[![techtide-swarm](https://img.shields.io/pypi/v/techtide-swarm.svg)](https://pypi.org/project/techtide-swarm/)
[![CI](https://github.com/TechTideOhio/swarm-357-site/actions/workflows/ci.yml/badge.svg)](https://github.com/TechTideOhio/swarm-357-site/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

Public product surface and documentation library for [TechTide Swarm 357](https://github.com/TechTideOhio/swarm-357). Built with Next.js 16, React 19, and Tailwind CSS v4, deployed on Railway.

**Landing 0.2.2**, compatible with [`techtide-swarm` 0.2.2](https://pypi.org/project/techtide-swarm/0.2.2/).

| Surface | URL |
|---------|-----|
| Marketing and docs | https://swarm357fe.up.railway.app |
| Documentation home | https://swarm357fe.up.railway.app/docs |
| About | https://swarm357fe.up.railway.app/about |
| Changelog | https://swarm357fe.up.railway.app/changelog |
| Evals | https://swarm357fe.up.railway.app/evals |
| Backend API | https://swarm357be.up.railway.app |

## Contents

- [Quick start](#quick-start)
- [Tech stack](#tech-stack)
- [Repository map](#repository-map)
- [Commands](#commands)
- [Environment](#environment)
- [Content pipeline](#content-pipeline)
- [Design system](#design-system)
- [Deployment](#deployment)
- [Editorial standards](#editorial-standards)
- [Related repositories](#related-repositories)
- [License](#license)

## Quick start

```bash
bun install
bun run dev
```

The site runs at http://localhost:3000. Documentation pages read from `content/`, which is committed, so the site builds without the core repository present.

To install the product this site documents:

```bash
pip install techtide-swarm==0.2.2
swarm demo
```

## Tech stack

| Layer | Technology | Role |
|-------|-----------|------|
| Framework | [Next.js 16](https://nextjs.org/docs) | App Router, server components, static documentation |
| UI runtime | [React 19](https://react.dev/) | Component model |
| Language | [TypeScript](https://www.typescriptlang.org/docs/) | Strict mode across the codebase |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/docs) | CSS-first tokens declared with `@theme inline` in `app/globals.css` |
| Content | [MDX](https://mdxjs.com/) with [remark-gfm](https://github.com/remarkjs/remark-gfm), [rehype-slug](https://github.com/rehypejs/rehype-slug), [rehype-pretty-code](https://rehype-pretty.pages.dev/) | Documentation library and blog |
| Syntax highlighting | [Shiki](https://shiki.style/) | Build-time code themes |
| Animation | [Motion](https://motion.dev/docs) | Presets in `lib/motion.tsx` with reduced-motion fallbacks |
| 3D | [React Three Fiber](https://r3f.docs.pmnd.rs/) and [drei](https://drei.docs.pmnd.rs/) | Optional WebGL dither cursor, disabled on mobile |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) | Class-based dark mode |
| Frontmatter | [gray-matter](https://github.com/jonschlinkert/gray-matter) | MDX metadata parsing |
| Toolchain | [Bun](https://bun.sh/docs) | Install, scripts, and content generation |
| Hosting | [Railway](https://docs.railway.com/) | Nixpacks build defined in `nixpacks.toml` |

There is no component library dependency. Components are hand written against the class tiers in `lib/ui-classes.ts`.

## Repository map

| Path | Contents |
|------|----------|
| `app/` | Routes. Marketing at `page.tsx`, plus `about/`, `docs/`, `blog/`, `changelog/`, `evals/`, `status/`, `security/`, and the server-only BFF under `api/` |
| `components/` | Landing sections, site chrome, and documentation shell components |
| `lib/` | Shared modules: `ui-classes.ts` (class tiers), `motion.tsx` (animation presets), `navigation.ts` (nav model), `site-url.ts` (canonical URLs), `eval-baseline.ts` (baseline metrics), `content/` (MDX loader, nav tree, table of contents) |
| `content/docs/` | Generated MDX documentation library |
| `content/blog/` | Generated blog posts |
| `content/data/` | Generated snapshots: `eval-baseline.json`, `status.md`, `changelog.md` |
| `public/` | Static assets, diagrams, and the Open Graph image |
| `scripts/` | `generate-content.ts` (sync), `check-content.ts` (CI guard), `verify-links.ts` (link resolution) |
| `DESIGN.md` | Canonical design system reference |

## Commands

| Command | Purpose |
|---------|---------|
| `bun run dev` | Local development server |
| `bun run build` | Production build |
| `bun run start` | Serve the production build |
| `bun run lint` | ESLint across the repository |
| `bun run typecheck` | TypeScript with `--noEmit` |
| `bun run check:content` | Dash policy, URL policy, frontmatter, and UI interaction guards |
| `bun run verify:links` | Resolve every internal documentation link |
| `bun run generate:content` | Sync documentation from the core repository |
| `bun run format` | Prettier with the Tailwind class sorter |

Run this sequence before opening a pull request:

```bash
bun run check:content
bun run verify:links
bun run typecheck
bun run lint
bun run build
```

## Environment

```bash
# Public site URL for the sitemap, JSON-LD, and llms.txt
NEXT_PUBLIC_SITE_URL=https://swarm357fe.up.railway.app

# Public API base for read-only client fetches (health, agents, status)
NEXT_PUBLIC_API_URL=https://swarm357be.up.railway.app

# Server-only key for the demo BFF at /api/swarm/run. Never prefix with NEXT_PUBLIC_.
SWARM_API_KEY=
```

`NEXT_PUBLIC_*` values are inlined at build time, so they must be present when the image is built rather than only at runtime.

## Content pipeline

Documentation is authored in the core repository and generated into this one. `content/` is committed so the site builds independently.

1. Clone the core repository as a sibling directory:

```bash
git clone https://github.com/TechTideOhio/swarm-357 ../swarm357-sync
```

2. Edit the canonical Markdown there, or edit a hand-written page under `content/docs/`.
3. Regenerate:

```bash
bun run generate:content
```

4. Validate, then commit the regenerated `content/` alongside your change:

```bash
bun run check:content && bun run verify:links
```

`scripts/generate-content.ts` converts Markdown to MDX, strips em dashes, and rewrites repository-relative links. A path such as `STATUS.md` resolves to its published route; anything else falls back to the canonical repository URL. Sidebar order comes from `lib/content/nav.ts`, and a documentation page listed there must exist on disk or `check:content` fails.

## Design system

[DESIGN.md](DESIGN.md) is the canonical reference for color tokens, typography, class tiers, interaction states, motion, accessibility, and the link policy. A reader-friendly summary is published at [/docs/resources/design](https://swarm357fe.up.railway.app/docs/resources/design).

Before writing UI:

1. Import a class string from `lib/ui-classes.ts` rather than assembling Tailwind stacks inline.
2. Animate through a preset in `lib/motion.tsx` and read `useReducedMotion()`.
3. Add new colors as CSS variables in both themes in `app/globals.css`, never as raw hex in a component.
4. Run `bun run check:content`, which enforces focus rings, touch targets, call-to-action radii, form control styling, and the dash policy.

## Deployment

Railway builds this repository from its root with Nixpacks and Bun, per `nixpacks.toml` and `railway.toml`. Deploys run `bun run build` and then `bun run start`.

Set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_API_URL` in the Railway service before the first build, because those public values are inlined into the client bundle at build time.

Set `SWARM_API_KEY` as a **runtime-only** variable. The server route reads it on each request, so it must never be present during the build, where it could leak into build logs or bundled output. If your platform injects every service variable into the build environment by default, mark this one as excluded from builds.

## Editorial standards

- Demo writes go through the same-origin BFF. The write key stays server-side and is never exposed as a `NEXT_PUBLIC_*` value.
- Use-case scenarios on the landing page are illustrative composites, not named customer endorsements.
- Opik cloud observability is Not implemented in core. Local JSONL traces are the source of truth.
- Feature maturity mirrors the [status page](https://swarm357fe.up.railway.app/docs/resources/status). Dream cycle is Experimental; HITL and SSE are Beta.
- Eval numbers are read from the committed baseline in `content/data/eval-baseline.json` through `lib/eval-baseline.ts`, never typed into prose.
- Public copy contains no em dashes or en dashes. This is enforced in continuous integration.

## Related repositories

| Repository | Role |
|------------|------|
| [TechTideOhio/swarm-357](https://github.com/TechTideOhio/swarm-357) | Core runtime, roster, Memvid bridge, documentation source |
| [techtide-swarm on PyPI](https://pypi.org/project/techtide-swarm/) | Published package |

## License

Apache-2.0. See [LICENSE](LICENSE).
