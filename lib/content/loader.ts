// file: lib/content/loader.ts
// description: Load and index MDX docs and blog posts from the content directory
// reference: lib/content/types.ts, lib/content/toc.ts, lib/content/nav.ts

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { get_flat_nav_items } from "./nav";
import { extract_headings } from "./toc";
import type {
  BlogFaqEntry,
  BlogFrontmatter,
  BlogPost,
  DocFrontmatter,
  DocPage,
} from "./types";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const DOCS_DIR = path.join(CONTENT_ROOT, "docs");
const BLOG_DIR = path.join(CONTENT_ROOT, "blog");

function read_mdx_file(file_path: string): { content: string; data: Record<string, unknown> } {
  const raw = fs.readFileSync(file_path, "utf8");
  const { content, data } = matter(raw);
  return { content, data: data as Record<string, unknown> };
}

function list_mdx_files(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...list_mdx_files(full));
    } else if (entry.name.endsWith(".mdx")) {
      results.push(full);
    }
  }

  return results;
}

export function load_doc_by_slug(slug: string): DocPage | null {
  const file_path = path.join(DOCS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file_path)) return null;

  const { content, data } = read_mdx_file(file_path);
  const nav_item = get_flat_nav_items().find((item) => item.slug === slug);

  const frontmatter: DocFrontmatter = {
    title: String(data.title ?? nav_item?.title ?? slug),
    description: String(data.description ?? ""),
    section: String(data.section ?? ""),
    order: Number(data.order ?? 0),
    slug,
    draft: Boolean(data.draft),
  };

  return {
    frontmatter,
    slug,
    href: `/docs/${slug}`,
    content,
    headings: extract_headings(content),
  };
}

export function load_all_docs(): DocPage[] {
  const nav_slugs = get_flat_nav_items().map((item) => item.slug);
  const disk_files = list_mdx_files(DOCS_DIR).map((file) =>
    path.relative(DOCS_DIR, file).replace(/\\/g, "/").replace(/\.mdx$/, "")
  );

  const all_slugs = [...new Set([...nav_slugs, ...disk_files])];
  const pages: DocPage[] = [];

  for (const slug of all_slugs) {
    const page = load_doc_by_slug(slug);
    if (page && !page.frontmatter.draft) pages.push(page);
  }

  const order_map = new Map(nav_slugs.map((slug, index) => [slug, index]));
  pages.sort((a, b) => (order_map.get(a.slug) ?? 999) - (order_map.get(b.slug) ?? 999));
  return pages;
}

/**
 * Slugs become route hrefs, so they are restricted to the shape a filename is
 * allowed to have rather than trusted because they came off disk.
 */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Covers become `src` attributes, so only a bundled image path is accepted. */
const COVER_PATTERN = /^\/art\/blog\/[a-z0-9-]+\.(?:jpg|jpeg|png|webp)$/;

function safe_slug(value: string): string | null {
  return SLUG_PATTERN.test(value) ? value : null;
}

function safe_cover(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  return COVER_PATTERN.test(value) ? value : undefined;
}

function parse_faq(value: unknown): BlogFaqEntry[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const entries = value.flatMap((raw) => {
    if (typeof raw !== "object" || raw === null) return [];
    const record = raw as Record<string, unknown>;
    const question = String(record.question ?? "").trim();
    const answer = String(record.answer ?? "").trim();
    return question && answer ? [{ question, answer }] : [];
  });

  return entries.length > 0 ? entries : undefined;
}

export function load_blog_by_slug(raw_slug: string): BlogPost | null {
  const slug = safe_slug(raw_slug);
  if (!slug) return null;

  const file_path = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file_path)) return null;

  const { content, data } = read_mdx_file(file_path);
  const frontmatter: BlogFrontmatter = {
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    slug,
    updated: data.updated ? String(data.updated) : undefined,
    cover: safe_cover(data.cover),
    coverAlt: data.coverAlt ? String(data.coverAlt) : undefined,
    author: data.author ? String(data.author) : undefined,
    keyword: data.keyword ? String(data.keyword) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    faq: parse_faq(data.faq),
    draft: Boolean(data.draft),
  };

  return {
    frontmatter,
    slug,
    href: `/blog/${slug}`,
    content,
    headings: extract_headings(content),
  };
}

export function load_all_blog_posts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => load_blog_by_slug(name.replace(/\.mdx$/, "")))
    .filter((post): post is BlogPost => post !== null && !post.frontmatter.draft)
    .sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));
}

/**
 * Neighbours in reverse-chronological order. `newer` is the post published
 * after this one, `older` the post before it, so the pager reads as a timeline.
 */
export function get_adjacent_blog_posts(slug: string): {
  newer: BlogPost | null;
  older: BlogPost | null;
} {
  const posts = load_all_blog_posts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return { newer: null, older: null };

  return {
    newer: posts[index - 1] ?? null,
    older: posts[index + 1] ?? null,
  };
}

export function load_data_json<T>(name: string): T | null {
  const file_path = path.join(CONTENT_ROOT, "data", `${name}.json`);
  if (!fs.existsSync(file_path)) return null;
  return JSON.parse(fs.readFileSync(file_path, "utf8")) as T;
}

export function get_search_index() {
  const docs = load_all_docs().map((doc) => ({
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    href: doc.href,
    type: "doc" as const,
  }));

  const blog = load_all_blog_posts().map((post) => ({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    href: post.href,
    type: "blog" as const,
  }));

  return [...docs, ...blog];
}

export function get_all_doc_slugs(): string[] {
  return load_all_docs().map((doc) => doc.slug);
}

export function get_all_blog_slugs(): string[] {
  return load_all_blog_posts().map((post) => post.slug);
}
