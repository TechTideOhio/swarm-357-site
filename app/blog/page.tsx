// file: app/blog/page.tsx
// description: Blog index listing SEO pillar posts with covers and tags
// reference: lib/content/loader.ts, lib/metadata.ts, components/blog/blog-cover.tsx

import Link from "next/link";
import { BlogCover } from "@/components/blog/blog-cover";
import { PageShell } from "@/components/page-shell";
import { load_all_blog_posts } from "@/lib/content/loader";
import { format_post_date } from "@/lib/format-date";
import { createMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site-url";
import { content_card, content_inline_link } from "@/lib/ui-classes";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Blog",
  description:
    "Engineering notes on multi-agent orchestration, agent cost control, portable memory, bash policy gates, and shipping Swarm 357 to production.",
  path: "/blog",
});

export default function BlogIndexPage(): ReactNode {
  const posts = load_all_blog_posts();
  const [lead, ...rest] = posts;

  const json_ld = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Swarm 357 blog",
    description:
      "Engineering notes on multi-agent orchestration, cost control, memory, security, and deployment.",
    url: `${SITE_URL}/blog`,
    publisher: {
      "@type": "Organization",
      name: "TechTide AI",
      url: SITE_URL,
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.frontmatter.title,
      description: post.frontmatter.description,
      datePublished: post.frontmatter.date,
      url: `${SITE_URL}${post.href}`,
    })),
  };

  return (
    <PageShell
      title="Blog"
      description="Engineering notes on agent orchestration, cost control, security, and shipping with Swarm 357."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(json_ld) }}
      />

      {lead ? (
        <article className="border-border mb-12 border-b pb-12">
          {lead.frontmatter.cover ? (
            <Link href={lead.href} className="focus-ring mb-6 block rounded-2xl">
              <BlogCover
                src={lead.frontmatter.cover}
                alt={lead.frontmatter.coverAlt ?? lead.frontmatter.title}
                eyebrow={lead.frontmatter.tags?.[0]}
                priority
              />
            </Link>
          ) : null}
          <p className="text-muted-foreground mb-2 text-sm">
            {format_post_date(lead.frontmatter.date)}
            {lead.frontmatter.author ? ` by ${lead.frontmatter.author}` : ""}
          </p>
          <h2 className="mb-3 text-3xl font-medium tracking-tight">
            <Link href={lead.href} className={`${content_inline_link} no-underline`}>
              {lead.frontmatter.title}
            </Link>
          </h2>
          <p className="text-muted-foreground text-lg">{lead.frontmatter.description}</p>
        </article>
      ) : null}

      <ul className="grid gap-8 sm:grid-cols-2">
        {rest.map((post) => (
          <li key={post.slug}>
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
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
