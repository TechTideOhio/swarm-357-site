#!/usr/bin/env bun
// file: scripts/check-content.ts
// description: CI guard for em dashes, GitHub link policy, malformed URLs, and MDX frontmatter
// reference: lib/site-url.ts, lib/content/nav.ts

import fs from "node:fs";
import path from "node:path";
import { get_flat_nav_items } from "../lib/content/nav";
import {
  AUTHOR_URL,
  CONTRIBUTOR_PROFILE_URLS,
  GITHUB_SITE_URL,
  GITHUB_URL,
  LINKEDIN_URL,
  TECHTIDE_URL,
} from "../lib/site-url";

const ROOT = path.join(process.cwd());
const ALLOWED_GITHUB = GITHUB_URL;
const ALLOWED_GITHUB_URLS = new Set([GITHUB_URL, GITHUB_SITE_URL]);
const ALLOWED_NAV_EXTERNAL_URLS = new Set<string>([
  GITHUB_URL,
  LINKEDIN_URL,
  TECHTIDE_URL,
  AUTHOR_URL,
  ...CONTRIBUTOR_PROFILE_URLS,
]);

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
    if (!ALLOWED_GITHUB_URLS.has(match)) {
      errors.push(
        `${file}: disallowed GitHub URL "${match}" (only ${[...ALLOWED_GITHUB_URLS].join(" or ")} allowed)`
      );
    }
  }
}

function check_malformed_urls(file: string, content: string) {
  const lines = content.split("\n");
  lines.forEach((line, index) => {
    if (/https?:\/\/\//.test(line)) {
      errors.push(`${file}:${index + 1} contains a malformed URL with an empty host`);
    }
  });
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
    check_malformed_urls(file, content);
  }
}

// site-url.ts is allowed to define the canonical URLs, exactly once each
const site_url_file = path.join(ROOT, "lib/site-url.ts");
if (fs.existsSync(site_url_file)) {
  const content = fs.readFileSync(site_url_file, "utf8");
  const matches = content.match(/https:\/\/github\.com\/TechTideOhio\/swarm-357[^\s)"']*/g) ?? [];
  for (const allowed of ALLOWED_GITHUB_URLS) {
    if (matches.filter((match) => match === allowed).length !== 1) {
      errors.push(`lib/site-url.ts must define ${allowed} exactly once`);
    }
  }
  if (matches.length !== ALLOWED_GITHUB_URLS.size) {
    errors.push("lib/site-url.ts must not define GitHub URL variants");
  }
}

// Rendered markdown snapshots synced from the core repo
const data_dir = path.join(ROOT, "content/data");
if (fs.existsSync(data_dir)) {
  for (const entry of fs.readdirSync(data_dir)) {
    if (!entry.endsWith(".md")) continue;
    const file = path.join(data_dir, entry);
    const content = fs.readFileSync(file, "utf8");
    check_dashes(file, content);
    check_github_links(file, content);
    check_malformed_urls(file, content);
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
      if (ALLOWED_NAV_EXTERNAL_URLS.has(url)) {
        if (
          url === ALLOWED_GITHUB &&
          rel !== "lib/navigation.ts" &&
          rel !== "lib/site-url.ts"
        ) {
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
    if (!nav_content.includes("export const linkedin_social")) {
      errors.push("lib/navigation.ts must export linkedin_social");
    }
    if (!nav_content.includes("href: GITHUB_URL")) {
      errors.push("lib/navigation.ts github_social must use href: GITHUB_URL");
    }
    if (!nav_content.includes("href: LINKEDIN_URL")) {
      errors.push("lib/navigation.ts linkedin_social must use href: LINKEDIN_URL");
    }
    const literal_github = nav_content.match(/https:\/\/github\.com\/TechTideOhio\/swarm-357/g) ?? [];
    if (literal_github.length > 0) {
      errors.push("lib/navigation.ts must import GITHUB_URL instead of hardcoding the repo URL");
    }
  }
}

const UI_SCAN_DIRS = ["app", "components"];
const UI_EXEMPT_FILES = new Set([
  "components/skip-to-content.tsx",
  "components/dither-cursor.tsx",
  "components/rotating-cards.tsx",
  "components/interactive-art-panel.tsx",
  "components/smooth-scroll.tsx",
  "components/providers.tsx",
  "components/toast-provider.tsx",
]);

function check_ui_consistency() {
  for (const dir of UI_SCAN_DIRS) {
    const full_dir = path.join(ROOT, dir);
    for (const file of walk(full_dir)) {
      if (!file.endsWith(".tsx")) continue;
      const rel = path.relative(ROOT, file).replace(/\\/g, "/");
      if (UI_EXEMPT_FILES.has(rel)) continue;

      const content = fs.readFileSync(file, "utf8");
      const uses_ui_classes =
        content.includes("@/lib/ui-classes") || content.includes("lib/ui-classes");

      const lines = content.split("\n");
      lines.forEach((line, index) => {
        const line_no = index + 1;

        if (
          line.includes("focus:outline-none") &&
          !line.includes("focus-ring") &&
          !line.includes("focus-visible:")
        ) {
          errors.push(`${rel}:${line_no} uses focus:outline-none without focus-ring`);
        }

        if (
          (line.includes("rounded-md") && line.includes("px-5") && line.includes("py-3")) ||
          (line.includes("rounded-md") && line.includes("bg-accent") && line.includes("py-3"))
        ) {
          errors.push(`${rel}:${line_no} uses legacy rounded-md CTA base (use rounded-[3.5px])`);
        }

        if (
          (line.includes("<input") || line.includes("<select")) &&
          line.includes("shadow-2xl/20")
        ) {
          errors.push(`${rel}:${line_no} uses shadow-2xl/20 on a form control`);
        }

        if (
          line.includes("<button") &&
          line.includes("h-10 w-10") &&
          !line.includes("min-h-11")
        ) {
          errors.push(`${rel}:${line_no} button uses h-10 w-10 without min-h-11 touch target`);
        }

        if (
          line.includes("<button") &&
          line.includes("className=") &&
          !line.includes("focus-ring") &&
          !line.includes("chrome_") &&
          !line.includes("content_") &&
          !line.includes("touch_target") &&
          !line.includes("interactive_") &&
          !line.includes("skip-to-content")
        ) {
          const string_match = line.match(/className="([^"]+)"/);
          if (string_match && !string_match[1].includes("focus-ring")) {
            errors.push(`${rel}:${line_no} button missing focus-ring or ui-classes interaction`);
          }
        }

        if (
          (line.includes("<input") || line.includes("<textarea")) &&
          line.includes("text-sm") &&
          !line.includes("text-base") &&
          !line.includes("chrome_form_control") &&
          !line.includes("content_form_control")
        ) {
          errors.push(`${rel}:${line_no} input uses text-sm without mobile text-base override`);
        }

        const is_interactive =
          line.includes("<button") ||
          /<Link[\s>]/.test(line) ||
          (line.includes("<a ") && line.includes("href"));

        if (!is_interactive || !line.includes("className=")) return;

        const is_ui_class_ref =
          uses_ui_classes &&
          (line.includes("className={chrome_") ||
            line.includes("className={content_") ||
            line.includes("className={`${chrome_") ||
            line.includes("className={`${content_") ||
            line.includes("className={`${touch_") ||
            line.includes("className={`${interactive_") ||
            line.includes("className={content_breadcrumb_link"));

        if (is_ui_class_ref) return;
        if (line.includes("skip-to-content")) return;

        const string_match = line.match(/className="([^"]+)"/);
        if (string_match && !string_match[1].includes("focus-ring")) {
          errors.push(`${rel}:${line_no} interactive element missing focus-ring in class string`);
        }
      });
    }
  }
}

const BLOG_REQUIRED_FIELDS = [
  "title",
  "description",
  "date",
  "slug",
  "cover",
  "coverAlt",
  "author",
  "keyword",
] as const;

/** Google truncates the snippet around here, so anything longer is written for nobody. */
const MAX_DESCRIPTION_LENGTH = 160;

function check_blog_frontmatter() {
  const blog_dir = path.join(ROOT, "content/blog");
  if (!fs.existsSync(blog_dir)) return;

  const owners_path = path.join(ROOT, "content/data/blog-keyword-owners.json");
  if (!fs.existsSync(owners_path)) {
    errors.push("Missing content/data/blog-keyword-owners.json");
    return;
  }

  const owners = (
    JSON.parse(fs.readFileSync(owners_path, "utf8")) as { owners: Record<string, string> }
  ).owners;
  const claimed = new Map<string, string>();

  for (const entry of fs.readdirSync(blog_dir)) {
    if (!entry.endsWith(".mdx")) continue;

    const slug = entry.replace(/\.mdx$/, "");
    const rel = `content/blog/${entry}`;
    // Normalised so a Windows checkout does not report a missing frontmatter block.
    const raw = fs.readFileSync(path.join(blog_dir, entry), "utf8").replace(/\r\n/g, "\n");
    const front_matter = /^---\n([\s\S]*?)\n---/.exec(raw)?.[1];

    if (!front_matter) {
      errors.push(`${rel}: missing frontmatter block`);
      continue;
    }

    for (const field of BLOG_REQUIRED_FIELDS) {
      if (!new RegExp(`^${field}:`, "m").test(front_matter)) {
        errors.push(`${rel}: missing required frontmatter field "${field}"`);
      }
    }

    const read_field = (field: string): string | null => {
      const value = new RegExp(`^${field}:\\s*"?([^"\\n]*)"?\\s*$`, "m").exec(front_matter)?.[1];
      return value ? value.trim() : null;
    };

    const declared_slug = read_field("slug");
    if (declared_slug && declared_slug !== slug) {
      errors.push(`${rel}: slug "${declared_slug}" does not match the filename`);
    }

    const description = read_field("description");
    if (description && description.length > MAX_DESCRIPTION_LENGTH) {
      errors.push(
        `${rel}: description is ${description.length} characters, over the ${MAX_DESCRIPTION_LENGTH} a search result shows`
      );
    }

    const date = read_field("date");
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      errors.push(`${rel}: date "${date}" must be YYYY-MM-DD`);
    }

    const updated = read_field("updated");
    if (updated && !/^\d{4}-\d{2}-\d{2}$/.test(updated)) {
      errors.push(`${rel}: updated "${updated}" must be YYYY-MM-DD`);
    }

    const cover = read_field("cover");
    if (cover) {
      // Mirrors COVER_PATTERN in lib/content/loader.ts, which drops anything
      // outside this shape rather than rendering an unvalidated src attribute.
      if (!/^\/art\/blog\/[a-z0-9-]+\.(?:jpg|jpeg|png|webp)$/.test(cover)) {
        errors.push(
          `${rel}: cover "${cover}" must match /art/blog/<lowercase-slug>.<jpg|jpeg|png|webp>`
        );
      } else if (!fs.existsSync(path.join(ROOT, "public", cover.replace(/^\//, "")))) {
        errors.push(`${rel}: cover "${cover}" does not exist in public/`);
      }
    }

    const keyword = read_field("keyword");
    if (keyword) {
      const owner = owners[keyword];
      if (!owner) {
        errors.push(`${rel}: keyword "${keyword}" is not registered in blog-keyword-owners.json`);
      } else if (owner !== slug) {
        errors.push(`${rel}: keyword "${keyword}" belongs to ${owner}`);
      }

      const previous = claimed.get(keyword);
      if (previous) {
        errors.push(`${rel}: keyword "${keyword}" already claimed by ${previous}`);
      }
      claimed.set(keyword, slug);
    }
  }
}

check_frontmatter();
check_blog_frontmatter();
check_internal_links();
check_nav_external_links();
check_ui_consistency();

if (errors.length > 0) {
  console.error("Content check failed:\n");
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log("Content check passed.");
