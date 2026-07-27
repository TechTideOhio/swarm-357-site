// file: app/blog/tag/[tag]/page.tsx
// description: Topic hub listing every post that carries one tag, with CollectionPage schema
// reference: lib/content/tags.ts, components/blog/post-card.tsx, app/blog/tags/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/blog/post-card";
import { PageShell } from "@/components/page-shell";
import { get_all_blog_tags, get_blog_tag } from "@/lib/content/tags";
import { createMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site-url";
import { content_inline_link } from "@/lib/ui-classes";
import type { Metadata } from "next";
import type { ReactNode } from "react";

interface PageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  return get_all_blog_tags().map((tag) => ({ tag: tag.slug }));
}

function hub_description(label: string, count: number): string {
  const noun = count === 1 ? "article" : "articles";
  return `${count} engineering ${noun} on ${label.toLowerCase()} from building and running Swarm 357 in production.`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag: slug } = await params;
  const tag = get_blog_tag(slug);
  if (!tag) return {};

  return createMetadata({
    title: `${tag.label} articles`,
    description: hub_description(tag.label, tag.posts.length),
    path: `/blog/tag/${tag.slug}`,
    noIndex: !tag.indexable,
  });
}

export default async function BlogTagPage({ params }: PageProps): Promise<ReactNode> {
  const { tag: slug } = await params;
  const tag = get_blog_tag(slug);
  if (!tag) notFound();

  const url = `${SITE_URL}/blog/tag/${tag.slug}`;

  const collection_schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${tag.label} articles`,
    description: hub_description(tag.label, tag.posts.length),
    url,
    isPartOf: { "@type": "Blog", name: "Swarm 357 blog", url: `${SITE_URL}/blog` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: tag.posts.length,
      itemListElement: tag.posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}${post.href}`,
        name: post.frontmatter.title,
      })),
    },
  };

  const breadcrumb_schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: "Topics", item: `${SITE_URL}/blog/tags` },
      { "@type": "ListItem", position: 4, name: tag.label, item: url },
    ],
  };

  return (
    <PageShell
      parent={{ label: "Blog", href: "/blog" }}
      title={tag.label}
      description={hub_description(tag.label, tag.posts.length)}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collection_schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb_schema) }}
      />

      <ul className="grid gap-8 sm:grid-cols-2">
        {tag.posts.map((post) => (
          <li key={post.slug}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>

      <p className="text-muted-foreground mt-12 text-sm">
        <Link href="/blog/tags" className={content_inline_link}>
          Browse all topics
        </Link>
        <span aria-hidden="true"> · </span>
        <Link href="/blog" className={content_inline_link}>
          All posts
        </Link>
      </p>
    </PageShell>
  );
}
