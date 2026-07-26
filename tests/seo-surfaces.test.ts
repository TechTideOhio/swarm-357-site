// file: tests/seo-surfaces.test.ts
// description: Guards the machine-readable SEO surfaces: feed, sitemap, llms index, and blog frontmatter contract
// reference: app/feed.xml/route.ts, app/sitemap.ts, app/llms.txt/route.ts, lib/content/loader.ts

import { describe, expect, test } from "bun:test";

import sitemap from "../app/sitemap";
import { GET as feed_get } from "../app/feed.xml/route";
import { GET as llms_get } from "../app/llms.txt/route";
import { load_all_blog_posts, load_blog_by_slug } from "../lib/content/loader";
import { SITE_URL } from "../lib/site-url";

const posts = load_all_blog_posts();

describe("blog corpus", () => {
  test("publishes posts", () => {
    expect(posts.length).toBeGreaterThan(0);
  });

  test("every post carries the fields schema and social cards need", () => {
    for (const post of posts) {
      const { title, description, date, cover, coverAlt, author, keyword } = post.frontmatter;
      expect(title.length).toBeGreaterThan(0);
      expect(description.length).toBeGreaterThan(0);
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(cover).toMatch(/^\/art\/blog\/.+/);
      expect(coverAlt?.length ?? 0).toBeGreaterThan(0);
      expect(author?.length ?? 0).toBeGreaterThan(0);
      expect(keyword?.length ?? 0).toBeGreaterThan(0);
    }
  });

  test("one post owns one primary keyword", () => {
    const seen = new Map<string, string>();
    for (const post of posts) {
      const keyword = post.frontmatter.keyword ?? "";
      const owner = seen.get(keyword);
      expect(owner).toBeUndefined();
      seen.set(keyword, post.slug);
    }
  });

  test("posts are ordered newest first", () => {
    const dates = posts.map((post) => post.frontmatter.date);
    expect([...dates].sort().reverse()).toEqual(dates);
  });
});

describe("loader input validation", () => {
  test("rejects a slug that is not a plain lowercase filename", () => {
    for (const slug of ["../secrets", "Upper", "has space", "javascript:alert(1)", ""]) {
      expect(load_blog_by_slug(slug)).toBeNull();
    }
  });

  test("every href is a relative blog route", () => {
    for (const post of posts) {
      expect(post.href).toBe(`/blog/${post.slug}`);
    }
  });
});

describe("feed.xml", () => {
  test("is well-formed RSS listing every post", async () => {
    const body = await feed_get().text();
    expect(body.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(body).toContain('<rss version="2.0"');
    expect(body).toContain(`<atom:link href="${SITE_URL}/feed.xml"`);
    for (const post of posts) {
      expect(body).toContain(`<link>${SITE_URL}${post.href}</link>`);
    }
  });

  test("escapes markup in titles rather than emitting raw angle brackets", async () => {
    const body = await feed_get().text();
    const items = body.split("<item>").slice(1);
    expect(items.length).toBe(posts.length);
    for (const item of items) {
      const title = /<title>([\s\S]*?)<\/title>/.exec(item)?.[1] ?? "";
      expect(title).not.toContain("<");
    }
  });
});

describe("sitemap", () => {
  const entries = sitemap();
  const urls = entries.map((entry) => entry.url);

  test("lists every blog post and the blog index", () => {
    expect(urls).toContain(`${SITE_URL}/blog`);
    for (const post of posts) {
      expect(urls).toContain(`${SITE_URL}${post.href}`);
    }
  });

  test("has no duplicate URLs", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });

  test("excludes routes that redirect", () => {
    // /status and /security are 301s in next.config, so their doc targets are canonical.
    expect(urls).not.toContain(`${SITE_URL}/status`);
    expect(urls).not.toContain(`${SITE_URL}/security`);
    expect(urls).toContain(`${SITE_URL}/docs/resources/status`);
    expect(urls).toContain(`${SITE_URL}/docs/security/security-model`);
  });

  test("every URL is absolute on the canonical origin", () => {
    for (const url of urls) expect(url.startsWith(SITE_URL)).toBe(true);
  });
});

describe("llms.txt", () => {
  test("indexes every post for AI crawlers", async () => {
    const body = await llms_get().text();
    for (const post of posts) {
      expect(body).toContain(`${SITE_URL}${post.href}`);
    }
    expect(body).toContain(`${SITE_URL}/feed.xml`);
    expect(body).toContain(`${SITE_URL}/llms-full.txt`);
  });
});
