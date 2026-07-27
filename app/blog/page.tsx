// file: app/blog/page.tsx
// description: Blog index listing SEO pillar posts with covers, topic entry points, and list schema
// reference: lib/content/loader.ts, lib/content/tags.ts, components/blog/post-card.tsx

import Link from "next/link";
import { BlogCover } from "@/components/blog/blog-cover";
import { PostCard } from "@/components/blog/post-card";
import { PageShell } from "@/components/page-shell";
import { load_all_blog_posts } from "@/lib/content/loader";
import { get_indexable_blog_tags } from "@/lib/content/tags";
import { format_post_date } from "@/lib/format-date";
import { createMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site-url";
import { content_inline_link, content_tag_chip } from "@/lib/ui-classes";
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
  const tags = get_indexable_blog_tags();

  const blog_schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Swarm 357 blog",
    description:
      "Engineering notes on multi-agent orchestration, cost control, memory, security, and deployment.",
    url: `${SITE_URL}/blog`,
    inLanguage: "en-US",
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

  const list_schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Swarm 357 blog posts",
    numberOfItems: posts.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}${post.href}`,
      name: post.frontmatter.title,
    })),
  };

  const breadcrumb_schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
    ],
  };

  return (
    <PageShell
      parent={null}
      title="Blog"
      description="Engineering notes on agent orchestration, cost control, security, and shipping with Swarm 357."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blog_schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(list_schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb_schema) }}
      />

      <nav aria-label="Blog topics" className="border-border mb-12 border-b pb-8">
        <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest uppercase">
          Browse by topic
        </p>
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag.slug}>
              <Link href={`/blog/tag/${tag.slug}`} className={content_tag_chip}>
                {tag.label}
                <span className="text-muted-foreground/60"> {tag.posts.length}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/blog/tags" className={content_tag_chip}>
              All topics
            </Link>
          </li>
        </ul>
      </nav>

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
            <PostCard post={post} />
          </li>
        ))}
      </ul>

      <p className="text-muted-foreground mt-12 text-sm">
        Subscribe via{" "}
        <Link href="/feed.xml" className={content_inline_link}>
          RSS
        </Link>
        .
      </p>
    </PageShell>
  );
}
