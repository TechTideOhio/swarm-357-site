// file: app/blog/page.tsx
// description: Blog index listing SEO pillar posts
// reference: lib/content/loader.ts, lib/metadata.ts, components/page-shell.tsx

import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { load_all_blog_posts } from "@/lib/content/loader";
import { createMetadata } from "@/lib/metadata";
import { content_inline_link } from "@/lib/ui-classes";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Blog",
  description: "Articles on multi-agent orchestration, cost control, memory, security, and deployment.",
  path: "/blog",
});

export default function BlogIndexPage(): ReactNode {
  const posts = load_all_blog_posts();

  return (
    <PageShell
      title="Blog"
      description="Engineering notes on agent orchestration, FinOps, security, and shipping with Swarm 357."
    >
      <ul className="space-y-8">
        {posts.map((post) => (
          <li key={post.slug} className="border-border border-b pb-8">
            <p className="text-muted-foreground mb-2 text-sm">{post.frontmatter.date}</p>
            <Link href={post.href} className={`${content_inline_link} text-2xl font-medium no-underline`}>
              {post.frontmatter.title}
            </Link>
            <p className="text-muted-foreground mt-2">{post.frontmatter.description}</p>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
