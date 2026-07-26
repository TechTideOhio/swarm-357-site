#!/usr/bin/env bun
// file: scripts/verify-links.ts
// description: Verify internal doc links resolve to existing MDX pages or known routes
// reference: lib/content/nav.ts, scripts/check-content.ts

import fs from "node:fs";
import path from "node:path";
import { get_flat_nav_items } from "../lib/content/nav";

const ROOT = process.cwd();
const DOCS_DIR = path.join(ROOT, "content/docs");
const errors: string[] = [];

const known_routes = new Set([
  "/",
  "/about",
  "/docs",
  "/changelog",
  "/evals",
  "/status",
  "/security",
  "/blog",
  ...get_flat_nav_items().map((item) => item.href),
]);

function walk_mdx(dir: string, files: string[] = []): string[] {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk_mdx(full, files);
    else if (entry.name.endsWith(".mdx")) files.push(full);
  }
  return files;
}

function check_internal_links(file: string, content: string) {
  const link_pattern = /\]\((\/docs\/[^)#?]+)\)/g;
  let match: RegExpExecArray | null;
  while ((match = link_pattern.exec(content)) !== null) {
    const href = match[1];
    if (href.startsWith("/docs/raw/")) continue;
    if (!known_routes.has(href)) {
      const slug = href.replace(/^\/docs\/?/, "");
      const mdx_path = path.join(DOCS_DIR, `${slug}.mdx`);
      if (!fs.existsSync(mdx_path)) {
        errors.push(`${file}: unresolved internal link ${href}`);
      }
    }
  }
}

for (const file of walk_mdx(DOCS_DIR)) {
  check_internal_links(file, fs.readFileSync(file, "utf8"));
}

for (const file of walk_mdx(path.join(ROOT, "content/blog"))) {
  check_internal_links(file, fs.readFileSync(file, "utf8"));
}

if (errors.length > 0) {
  console.error("Link verification failed:\n");
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`Link verification passed (${known_routes.size} known routes).`);
