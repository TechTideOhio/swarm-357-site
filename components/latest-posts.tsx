// file: components/latest-posts.tsx
// description: Landing section surfacing the three most recent blog posts with covers
// reference: lib/content/loader.ts, components/blog/blog-cover.tsx, components/how-it-works.tsx

import Link from "next/link";
import { BlogCover } from "@/components/blog/blog-cover";
import { load_all_blog_posts } from "@/lib/content/loader";
import { format_post_date } from "@/lib/format-date";
import { chrome_card_shell, chrome_quiet_link, interactive_card } from "@/lib/ui-classes";
import type { ReactNode } from "react";

const POST_COUNT = 3;

export function LatestPosts(): ReactNode {
  const posts = load_all_blog_posts().slice(0, POST_COUNT);
  if (posts.length === 0) return null;

  return (
    <section id="latest-writing" className="bg-background px-6 py-16 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center md:mb-16">
          <h2 className="text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
            Notes from production
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-base md:text-lg">
            What broke, what we changed, and what we would not build again.
          </p>
          <Link href="/blog" className={`${chrome_quiet_link} mt-6 inline-block`}>
            Read the blog
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={post.href}
              className={`${chrome_card_shell} ${interactive_card} hover:border-accent/30 focus-ring flex flex-col overflow-hidden no-underline`}
            >
              {post.frontmatter.cover ? (
                <BlogCover
                  src={post.frontmatter.cover}
                  alt={post.frontmatter.coverAlt ?? post.frontmatter.title}
                  eyebrow={post.frontmatter.tags?.[0]}
                  size="card"
                />
              ) : null}
              <div className="flex flex-1 flex-col p-6">
                <p className="text-muted-foreground text-sm">
                  {format_post_date(post.frontmatter.date)}
                </p>
                <h3 className="mt-1 text-xl font-medium tracking-tight">
                  {post.frontmatter.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-base leading-relaxed">
                  {post.frontmatter.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
