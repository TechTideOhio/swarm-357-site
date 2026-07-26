// file: app/blog/[slug]/page.tsx
// description: Individual blog post page rendered from MDX with article schema
// reference: lib/content/loader.ts, lib/content/mdx.ts, components/blog/blog-cover.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCover } from "@/components/blog/blog-cover";
import { MdxContent, mdx_components } from "@/components/docs/mdx-components";
import { PageShell } from "@/components/page-shell";
import {
  get_adjacent_blog_posts,
  load_all_blog_posts,
  load_blog_by_slug,
} from "@/lib/content/loader";
import { format_post_date } from "@/lib/format-date";
import { compile_mdx } from "@/lib/content/mdx";
import { createMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site-url";
import { content_card, content_inline_link } from "@/lib/ui-classes";
import type { BlogPost } from "@/lib/content/types";
import type { Metadata } from "next";
import type { ReactNode } from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const DEFAULT_AUTHOR = "Alex Cinovoj";

export async function generateStaticParams() {
  return load_all_blog_posts().map((post) => ({ slug: post.slug }));
}

function og_card_url(post: BlogPost): string {
  const params = new URLSearchParams({
    title: post.frontmatter.title,
    subtitle: post.frontmatter.description,
  });
  return `/api/og?${params.toString()}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = load_blog_by_slug(slug);
  if (!post) return {};

  const author = post.frontmatter.author ?? DEFAULT_AUTHOR;

  return createMetadata({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    path: post.href,
    image: og_card_url(post),
    article: {
      publishedTime: post.frontmatter.date,
      modifiedTime: post.frontmatter.updated ?? post.frontmatter.date,
      authors: [author],
      tags: post.frontmatter.tags,
    },
  });
}

export default async function BlogPostPage({ params }: PageProps): Promise<ReactNode> {
  const { slug } = await params;
  const post = load_blog_by_slug(slug);
  if (!post) notFound();

  const Content = await compile_mdx(post.content, mdx_components);
  const { newer, older } = get_adjacent_blog_posts(slug);
  const author = post.frontmatter.author ?? DEFAULT_AUTHOR;
  const url = `${SITE_URL}${post.href}`;
  const image = `${SITE_URL}${post.frontmatter.cover ?? og_card_url(post)}`;

  const article_schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    datePublished: post.frontmatter.date,
    dateModified: post.frontmatter.updated ?? post.frontmatter.date,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: [image],
    keywords: post.frontmatter.tags?.join(", "),
    author: {
      "@type": "Person",
      name: author,
      url: `${SITE_URL}/about`,
      worksFor: { "@type": "Organization", name: "TechTide AI" },
    },
    publisher: {
      "@type": "Organization",
      name: "TechTide AI",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` },
    },
  };

  const breadcrumb_schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.frontmatter.title, item: url },
    ],
  };

  const faq = post.frontmatter.faq;
  const faq_schema = faq
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((entry) => ({
          "@type": "Question",
          name: entry.question,
          acceptedAnswer: { "@type": "Answer", text: entry.answer },
        })),
      }
    : null;

  return (
    <PageShell title={post.frontmatter.title} showHeading={false}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article_schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb_schema) }}
      />
      {faq_schema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faq_schema) }}
        />
      ) : null}

      <p className="mb-4">
        <Link href="/blog" className={`${content_inline_link} text-muted-foreground text-sm`}>
          All posts
        </Link>
      </p>

      <h1 className="mb-4 text-4xl font-medium tracking-tight">{post.frontmatter.title}</h1>

      <p className="text-muted-foreground mb-6 text-sm">
        <span>{author}</span>
        <span aria-hidden="true"> · </span>
        <time dateTime={post.frontmatter.date}>{format_post_date(post.frontmatter.date)}</time>
        {post.frontmatter.updated && post.frontmatter.updated !== post.frontmatter.date ? (
          <>
            <span aria-hidden="true"> · </span>
            <span>updated {format_post_date(post.frontmatter.updated)}</span>
          </>
        ) : null}
      </p>

      {post.frontmatter.cover ? (
        <div className="mb-10">
          <BlogCover
            src={post.frontmatter.cover}
            alt={post.frontmatter.coverAlt ?? post.frontmatter.title}
            eyebrow={post.frontmatter.tags?.[0]}
            priority
          />
        </div>
      ) : null}

      <MdxContent>
        <Content />
      </MdxContent>

      {faq ? (
        <section className="border-border mt-16 border-t pt-10">
          <h2 className="mb-6 text-2xl font-medium tracking-tight">Frequently asked questions</h2>
          <dl className="space-y-6">
            {faq.map((entry) => (
              <div key={entry.question}>
                <dt className="font-medium">{entry.question}</dt>
                <dd className="text-muted-foreground mt-1">{entry.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {post.frontmatter.tags && post.frontmatter.tags.length > 0 ? (
        <ul className="mt-12 flex flex-wrap gap-2" aria-label="Topics">
          {post.frontmatter.tags.map((tag) => (
            <li
              key={tag}
              className="border-border text-muted-foreground rounded-[3.5px] border px-3 py-1 text-sm"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}

      {newer || older ? (
        <nav aria-label="More posts" className="mt-12 grid gap-4 sm:grid-cols-2">
          {older ? (
            <Link href={older.href} className={`${content_card} no-underline`}>
              <span className="text-muted-foreground text-sm">Previous</span>
              <span className="mt-1 block font-medium">{older.frontmatter.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {newer ? (
            <Link href={newer.href} className={`${content_card} text-right no-underline`}>
              <span className="text-muted-foreground text-sm">Next</span>
              <span className="mt-1 block font-medium">{newer.frontmatter.title}</span>
            </Link>
          ) : null}
        </nav>
      ) : null}
    </PageShell>
  );
}
