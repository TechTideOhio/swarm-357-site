#!/usr/bin/env bun
// file: scripts/check-content.ts
// description: CI guard for em dashes, GitHub link policy, and MDX frontmatter
// reference: lib/site-url.ts, lib/content/nav.ts

import fs from "node:fs";
import path from "node:path";
import { get_flat_nav_items } from "../lib/content/nav";
import { GITHUB_URL } from "../lib/site-url";

const ROOT = path.join(process.cwd());
const ALLOWED_GITHUB = GITHUB_URL;

const SCAN_DIRS = ["app", "components", "lib", "content/docs", "content/blog"];
const SCAN_EXTENSIONS = [".ts", ".tsx", ".mdx"];

const errors: string[] = [];

function walk(dir: string, files: string[] = []): string[] {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules") {
      walk(full, files);
    } else if (SCAN_EXTENSIONS.some((ext) => entry.name.endsWith(ext))) {
      files.push(full);
    }
  }
  return files;
}

function check_dashes(file: string, content: string) {
  const lines = content.split("\n");
  lines.forEach((line, index) => {
    if (line.includes("\u2014") || line.includes("\u2013")) {
      errors.push(`${file}:${index + 1} contains em or en dash`);
    }
  });
}

function check_github_links(file: string, content: string) {
  const matches = content.match(/https:\/\/github\.com\/TechTideOhio\/swarm-357[^\s)"']*/g);
  if (!matches) return;

  for (const match of matches) {
    if (match !== ALLOWED_GITHUB) {
      errors.push(`${file}: disallowed GitHub URL "${match}" (only ${ALLOWED_GITHUB} allowed)`);
    }
  }
}

function check_frontmatter() {
  const required_slugs = get_flat_nav_items().map((item) => item.slug);
  for (const slug of required_slugs) {
    const file_path = path.join(ROOT, "content/docs", `${slug}.mdx`);
    if (!fs.existsSync(file_path)) {
      errors.push(`Missing required doc: content/docs/${slug}.mdx`);
      continue;
    }
    const raw = fs.readFileSync(file_path, "utf8");
    if (!raw.startsWith("---")) {
      errors.push(`Missing frontmatter: ${file_path}`);
      continue;
    }
    for (const field of ["title", "description"]) {
      if (!raw.includes(`${field}:`)) {
        errors.push(`Missing ${field} in ${file_path}`);
      }
    }
  }
}

function check_internal_links() {
  const known = new Set(get_flat_nav_items().map((item) => item.href));
  const docs_dir = path.join(ROOT, "content/docs");

  function walk(dir: string): string[] {
    const files: string[] = [];
    if (!fs.existsSync(dir)) return files;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) files.push(...walk(full));
      else if (entry.name.endsWith(".mdx")) files.push(full);
    }
    return files;
  }

  for (const file of walk(docs_dir)) {
    const content = fs.readFileSync(file, "utf8");
    const matches = content.matchAll(/\]\((\/docs\/[^)#?]+)\)/g);
    for (const match of matches) {
      const href = match[1];
      if (href.startsWith("/docs/raw/")) continue;
      if (!known.has(href)) {
        const slug = href.replace(/^\/docs\//, "");
        const target = path.join(docs_dir, `${slug}.mdx`);
        if (!fs.existsSync(target)) {
          errors.push(`${file}: unresolved link ${href}`);
        }
      }
    }
  }
}

for (const dir of SCAN_DIRS) {
  const full_dir = path.join(ROOT, dir);
  for (const file of walk(full_dir)) {
    const content = fs.readFileSync(file, "utf8");
    check_dashes(file, content);
    check_github_links(file, content);
  }
}

// site-url.ts is allowed to define the canonical URL
const site_url_file = path.join(ROOT, "lib/site-url.ts");
if (fs.existsSync(site_url_file)) {
  const content = fs.readFileSync(site_url_file, "utf8");
  const matches = content.match(/https:\/\/github\.com\/TechTideOhio\/swarm-357[^\s)"']*/g) ?? [];
  if (matches.length !== 1 || matches[0] !== ALLOWED_GITHUB) {
    errors.push("lib/site-url.ts must define exactly one canonical GITHUB_URL");
  }
}

const NAV_CONFIG_FILES = [
  "components/header.tsx",
  "components/footer.tsx",
  "lib/navigation.ts",
  "lib/config.ts",
];

function check_nav_external_links() {
  for (const rel of NAV_CONFIG_FILES) {
    const file_path = path.join(ROOT, rel);
    if (!fs.existsSync(file_path)) continue;

    const content = fs.readFileSync(file_path, "utf8");
    const https_matches = content.match(/https:\/\/[^\s"'`)]+/g) ?? [];

    for (const url of https_matches) {
      if (url === ALLOWED_GITHUB) {
        if (rel !== "lib/navigation.ts" && rel !== "lib/site-url.ts") {
          errors.push(
            `${rel}: GITHUB_URL must only appear in lib/navigation.ts github_social, not in ${rel}`
          );
        }
        continue;
      }

      errors.push(`${rel}: disallowed external URL in nav config "${url}"`);
    }
  }

  const nav_file = path.join(ROOT, "lib/navigation.ts");
  if (fs.existsSync(nav_file)) {
    const nav_content = fs.readFileSync(nav_file, "utf8");
    if (!nav_content.includes("export const github_social")) {
      errors.push("lib/navigation.ts must export github_social");
    }
    if (!nav_content.includes("href: GITHUB_URL")) {
      errors.push("lib/navigation.ts github_social must use href: GITHUB_URL");
    }
    const literal_github = nav_content.match(/https:\/\/github\.com\/TechTideOhio\/swarm-357/g) ?? [];
    if (literal_github.length > 0) {
      errors.push("lib/navigation.ts must import GITHUB_URL instead of hardcoding the repo URL");
    }
  }
}

check_frontmatter();
check_internal_links();
check_nav_external_links();

if (errors.length > 0) {
  console.error("Content check failed:\n");
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log("Content check passed.");
