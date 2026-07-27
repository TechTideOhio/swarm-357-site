// file: app/blog/tags/page.tsx
// description: Directory of every blog topic, splitting indexed hubs from single-post tags
// reference: lib/content/tags.ts, app/blog/tag/[tag]/page.tsx, components/blog/tag-chips.tsx

import Link from "next/link";
import { TagChips } from "@/components/blog/tag-chips";
import { PageShell } from "@/components/page-shell";
import { get_all_blog_tags } from "@/lib/content/tags";
import { createMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site-url";
import { content_card, content_inline_link } from "@/lib/ui-classes";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Blog topics",
  description:
    "Every topic covered in the Swarm 357 engineering blog: agent architecture, cost control, security, orchestration, evals, memory, and deployment.",
  path: "/blog/tags",
});

export default function BlogTagsPage(): ReactNode {
  const tags = get_all_blog_tags();
  const hubs = tags.filter((tag) => tag.indexable);
  const singles = tags.filter((tag) => !tag.indexable);

  const collection_schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Blog topics",
    description: "Topic index for the Swarm 357 engineering blog.",
    url: `${SITE_URL}/blog/tags`,
    isPartOf: { "@type": "Blog", name: "Swarm 357 blog", url: `${SITE_URL}/blog` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: hubs.length,
      itemListElement: hubs.map((tag, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/blog/tag/${tag.slug}`,
        name: tag.label,
      })),
    },
  };

  return (
    <PageShell
      parent={{ label: "Blog", href: "/blog" }}
      title="Blog topics"
      description="Every subject the engineering blog covers, densest first."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collection_schema) }}
      />

      <ul className="grid gap-4 sm:grid-cols-2">
        {hubs.map((tag) => (
          <li key={tag.slug}>
            <Link href={`/blog/tag/${tag.slug}`} className={`${content_card} block no-underline`}>
              <span className="text-xl font-medium tracking-tight">{tag.label}</span>
              <span className="text-muted-foreground mt-1 block text-sm">
                {tag.posts.length} articles
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {singles.length > 0 ? (
        <section className="border-border mt-12 border-t pt-10">
          <h2 className="mb-4 text-lg font-medium tracking-tight">One-off topics</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Single articles that have not grown into a series yet.
          </p>
          <TagChips tags={singles.map((tag) => tag.label)} label="One-off topics" />
        </section>
      ) : null}

      <p className="text-muted-foreground mt-12 text-sm">
        <Link href="/blog" className={content_inline_link}>
          Back to all posts
        </Link>
      </p>
    </PageShell>
  );
}
