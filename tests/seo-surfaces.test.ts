// file: tests/seo-surfaces.test.ts
// description: Guards the machine-readable SEO surfaces: feed, sitemap, llms index, and blog frontmatter contract
// reference: app/feed.xml/route.ts, app/sitemap.ts, app/llms.txt/route.ts, lib/content/loader.ts

import { describe, expect, test } from "bun:test";

import sitemap from "../app/sitemap";
import { GET as feed_get } from "../app/feed.xml/route";
import { GET as llms_get } from "../app/llms.txt/route";
import { load_all_blog_posts, load_blog_by_slug } from "../lib/content/loader";
import {
  MIN_POSTS_FOR_INDEXED_HUB,
  get_all_blog_tags,
  get_blog_tag,
  get_indexable_blog_tags,
  tag_to_slug,
} from "../lib/content/tags";
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

  test("advertises indexable tag hubs and withholds the noindex ones", () => {
    expect(urls).toContain(`${SITE_URL}/blog/tags`);
    for (const tag of get_all_blog_tags()) {
      const url = `${SITE_URL}/blog/tag/${tag.slug}`;
      if (tag.indexable) expect(urls).toContain(url);
      else expect(urls).not.toContain(url);
    }
    expect(get_indexable_blog_tags().length).toBeGreaterThan(0);
  });

  test("blog entries carry their cover image for image search", () => {
    for (const post of posts) {
      const entry = entries.find((candidate) => candidate.url === `${SITE_URL}${post.href}`);
      expect(entry?.images).toEqual([`${SITE_URL}${post.frontmatter.cover}`]);
    }
  });
});

describe("blog tag hubs", () => {
  const tags = get_all_blog_tags();

  test("every tag on a post resolves to a hub", () => {
    for (const post of posts) {
      for (const label of post.frontmatter.tags ?? []) {
        const tag = get_blog_tag(tag_to_slug(label));
        expect(tag).not.toBeNull();
        expect(tag?.posts.some((entry) => entry.slug === post.slug)).toBe(true);
      }
    }
  });

  test("slugs are url safe and unique", () => {
    const slugs = tags.map((tag) => tag.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  test("an unknown slug resolves to nothing rather than an empty hub", () => {
    for (const slug of ["../secrets", "not-a-tag", "", "javascript:alert(1)"]) {
      expect(get_blog_tag(slug)).toBeNull();
    }
  });

  test("only multi-post hubs are marked indexable", () => {
    for (const tag of tags) {
      expect(tag.indexable).toBe(tag.posts.length >= MIN_POSTS_FOR_INDEXED_HUB);
    }
  });

  test("hubs are ordered densest first", () => {
    const counts = tags.map((tag) => tag.posts.length);
    expect([...counts].sort((a, b) => b - a)).toEqual(counts);
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
