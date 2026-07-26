// file: app/feed.xml/route.ts
// description: RSS 2.0 feed for the Swarm 357 blog
// reference: lib/content/loader.ts, lib/format-date.ts, lib/site-url.ts

import { load_all_blog_posts } from "@/lib/content/loader";
import { post_date_to_utc, to_rfc_822 } from "@/lib/format-date";
import { SITE_URL } from "@/lib/site-url";

const FEED_TITLE = "Swarm 357 blog";
const FEED_DESCRIPTION =
  "Engineering notes on multi-agent orchestration, agent cost control, portable memory, and shipping Swarm 357 to production.";

function escape_xml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function mime_for(url: string): string {
  if (url.endsWith(".png")) return "image/png";
  if (url.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

export function GET(): Response {
  const posts = load_all_blog_posts();
  const latest = posts[0] ? post_date_to_utc(posts[0].frontmatter.date) : new Date();

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}${post.href}`;
      const cover = post.frontmatter.cover ? `${SITE_URL}${post.frontmatter.cover}` : null;
      const categories = (post.frontmatter.tags ?? [])
        .map((tag) => `      <category>${escape_xml(tag)}</category>`)
        .join("\n");

      return [
        "    <item>",
        `      <title>${escape_xml(post.frontmatter.title)}</title>`,
        `      <link>${escape_xml(url)}</link>`,
        `      <guid isPermaLink="true">${escape_xml(url)}</guid>`,
        `      <pubDate>${to_rfc_822(post_date_to_utc(post.frontmatter.date))}</pubDate>`,
        `      <description>${escape_xml(post.frontmatter.description)}</description>`,
        cover ? `      <enclosure url="${escape_xml(cover)}" type="${mime_for(cover)}" />` : "",
        categories,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escape_xml(FEED_TITLE)}</title>`,
    `    <link>${SITE_URL}/blog</link>`,
    `    <description>${escape_xml(FEED_DESCRIPTION)}</description>`,
    "    <language>en-us</language>",
    `    <lastBuildDate>${to_rfc_822(latest)}</lastBuildDate>`,
    `    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />`,
    items,
    "  </channel>",
    "</rss>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
