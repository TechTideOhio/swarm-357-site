# Contributing

This repository is the marketing site, documentation library, and engineering blog for [TechTide Swarm 357](https://github.com/TechTideOhio/swarm-357). Runtime behaviour, the CLI, and the HTTP API live in the core repository, so bugs in those belong there rather than here.

## Setup

```bash
bun install
bun run dev
```

The site runs on Bun. Use `bun`, not `npm` or `yarn`.

## Gates

Run all five before opening a pull request. CI runs the same set.

```bash
bun run check:content
bun run verify:links
bun run typecheck
bun run lint
bun test
bun run build
```

## Where content comes from

Most of `content/docs/` is generated from the core repository by `scripts/generate-content.ts`. Editing those MDX files directly does not survive the next generation run. Change the generator instead, then regenerate:

```bash
bun run generate:content
```

Blog posts under `content/blog/` are hand authored and are the source of truth. The generator only creates a scaffold when a post does not exist yet, so it will never overwrite your writing.

## Editorial standards

- No em dashes or en dashes in public copy. `bun run check:content` fails the build on them.
- Numbers shown on the site come from generated data, not hand-written prose. If a figure changes, change its source.
- Every blog post owns exactly one primary keyword, tracked in `content/data/blog-keyword-owners.json`. Two posts competing for one phrase is a bug.
- New blog posts need `title`, `description`, `date`, `cover`, `coverAlt`, `author`, and `keyword` in frontmatter. Covers live at `/art/blog/<slug>.jpg` at 1200 by 630.

## Design system

Read `DESIGN.md` before changing UI. Tailwind class strings are centralised in `lib/ui-classes.ts`, and `check:content` enforces focus rings and CTA shapes so components cannot quietly drift apart.

## Pull requests

Commits follow [Conventional Commits](https://www.conventionalcommits.org/). Describe the behaviour difference and how you verified it, not the file list.

## Security

Do not open a public issue for a vulnerability. See [SECURITY.md](SECURITY.md).

## Code of conduct

Participation is covered by the [Code of Conduct](CODE_OF_CONDUCT.md).
