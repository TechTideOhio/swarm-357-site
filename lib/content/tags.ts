// file: lib/content/tags.ts
// description: Group blog posts by topic tag and expose hub metadata for the tag routes
// reference: lib/content/loader.ts, app/blog/tag/[tag]/page.tsx, app/blog/tags/page.tsx

import { load_all_blog_posts } from "./loader";
import type { BlogPost } from "./types";

/**
 * A hub holding a single post is a near-duplicate of that post, so it stays
 * crawlable for link flow but is kept out of the index and the sitemap.
 */
export const MIN_POSTS_FOR_INDEXED_HUB = 2;

export interface BlogTag {
  /** Display form exactly as authored in frontmatter, for example "Cost control". */
  label: string;
  slug: string;
  posts: BlogPost[];
  indexable: boolean;
}

export function tag_to_slug(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** All tags used across the corpus, densest first, then alphabetical. */
export function get_all_blog_tags(): BlogTag[] {
  const groups = new Map<string, { label: string; posts: BlogPost[] }>();

  for (const post of load_all_blog_posts()) {
    for (const label of post.frontmatter.tags ?? []) {
      const slug = tag_to_slug(label);
      if (!slug) continue;

      const group = groups.get(slug) ?? { label, posts: [] };
      group.posts.push(post);
      groups.set(slug, group);
    }
  }

  return [...groups.entries()]
    .map(([slug, group]) => ({
      label: group.label,
      slug,
      posts: group.posts,
      indexable: group.posts.length >= MIN_POSTS_FOR_INDEXED_HUB,
    }))
    .sort((a, b) => b.posts.length - a.posts.length || a.label.localeCompare(b.label));
}

/**
 * Resolves a route param against the known tag set. Returning the stored label
 * rather than the param keeps URL input out of the rendered page.
 */
export function get_blog_tag(slug: string): BlogTag | null {
  return get_all_blog_tags().find((tag) => tag.slug === slug) ?? null;
}

export function get_indexable_blog_tags(): BlogTag[] {
  return get_all_blog_tags().filter((tag) => tag.indexable);
}
