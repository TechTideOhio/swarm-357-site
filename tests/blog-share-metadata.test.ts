// file: tests/blog-share-metadata.test.ts
// description: Blog post share cards use the hand-authored cover image when frontmatter sets one
// reference: app/blog/[slug]/page.tsx, lib/metadata.ts

import { describe, expect, test } from "bun:test";
import { generateMetadata } from "../app/blog/[slug]/page";
import { load_all_blog_posts } from "../lib/content/loader";

describe("blog share metadata", () => {
  test("Open Graph and Twitter images use the frontmatter cover", async () => {
    const posts = load_all_blog_posts().filter(
      (post) => post.frontmatter.cover
    );
    expect(posts.length).toBeGreaterThan(0);
    for (const post of posts) {
      const slug = post.href.split("/").pop() ?? "";
      const metadata = await generateMetadata({
        params: Promise.resolve({ slug }),
      });
      const og_images = metadata.openGraph?.images as Array<{ url: string }>;
      expect(og_images[0]?.url).toBe(post.frontmatter.cover as string);
      expect(metadata.twitter?.images).toEqual([
        post.frontmatter.cover as string,
      ]);
    }
  });
});
