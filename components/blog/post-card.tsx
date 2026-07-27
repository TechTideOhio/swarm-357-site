// file: components/blog/post-card.tsx
// description: Shared blog post card used by the blog index and the topic hub pages
// reference: components/blog/blog-cover.tsx, app/blog/page.tsx, app/blog/tag/[tag]/page.tsx

import Link from "next/link";
import { BlogCover } from "@/components/blog/blog-cover";
import { format_post_date } from "@/lib/format-date";
import { content_card } from "@/lib/ui-classes";
import type { BlogPost } from "@/lib/content/types";
import type { ReactNode } from "react";

export function PostCard({ post }: { post: BlogPost }): ReactNode {
  return (
    <Link href={post.href} className={`${content_card} block h-full no-underline`}>
      {post.frontmatter.cover ? (
        <BlogCover
          src={post.frontmatter.cover}
          alt={post.frontmatter.coverAlt ?? post.frontmatter.title}
          eyebrow={post.frontmatter.tags?.[0]}
          size="card"
        />
      ) : null}
      <p className="text-muted-foreground mt-4 text-sm">
        {format_post_date(post.frontmatter.date)}
      </p>
      <h3 className="mt-1 text-xl font-medium tracking-tight">{post.frontmatter.title}</h3>
      <p className="text-muted-foreground mt-2 text-sm">{post.frontmatter.description}</p>
    </Link>
  );
}
