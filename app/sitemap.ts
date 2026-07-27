// file: app/sitemap.ts
// description: Dynamic sitemap of canonical 200 URLs. /status and /security are 301s in next.config, so their doc targets are listed instead.
// reference: lib/content/loader.ts, lib/content/tags.ts, lib/site-url.ts

import type { MetadataRoute } from "next";
import { load_all_blog_posts, load_all_docs } from "@/lib/content/loader";
import { get_indexable_blog_tags } from "@/lib/content/tags";
import { post_date_to_utc } from "@/lib/format-date";
import { SITE_URL } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const static_pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/docs`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/changelog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/evals`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/blog/tags`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const doc_pages = load_all_docs().map((doc) => ({
    url: `${SITE_URL}${doc.href}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Single-post hubs are noindex, so only the multi-post ones are advertised.
  const tag_pages = get_indexable_blog_tags().map((tag) => ({
    url: `${SITE_URL}/blog/tag/${tag.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const blog_pages = load_all_blog_posts().map((post) => ({
    url: `${SITE_URL}${post.href}`,
    lastModified: post_date_to_utc(post.frontmatter.updated ?? post.frontmatter.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
    ...(post.frontmatter.cover && { images: [`${SITE_URL}${post.frontmatter.cover}`] }),
  }));

  return [...static_pages, ...doc_pages, ...tag_pages, ...blog_pages];
}
