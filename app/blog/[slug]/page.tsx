// file: app/blog/[slug]/page.tsx
// description: Individual blog post page rendered from MDX
// reference: lib/content/loader.ts, lib/content/mdx.ts, components/page-shell.tsx

import { notFound } from "next/navigation";
import { MdxContent, mdx_components } from "@/components/docs/mdx-components";
import { PageShell } from "@/components/page-shell";
import { load_all_blog_posts, load_blog_by_slug } from "@/lib/content/loader";
import { compile_mdx } from "@/lib/content/mdx";
import { createMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site-url";
import type { Metadata } from "next";
import type { ReactNode } from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return load_all_blog_posts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = load_blog_by_slug(slug);
  if (!post) return {};
  return createMetadata({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    path: post.href,
  });
}

export default async function BlogPostPage({ params }: PageProps): Promise<ReactNode> {
  const { slug } = await params;
  const post = load_blog_by_slug(slug);
  if (!post) notFound();

  const Content = await compile_mdx(post.content, mdx_components);

  const json_ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    datePublished: post.frontmatter.date,
    url: `${SITE_URL}${post.href}`,
    author: { "@type": "Organization", name: "TechTide AI" },
  };

  return (
    <PageShell title={post.frontmatter.title} showHeading={false}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json_ld) }} />
      <p className="text-muted-foreground mb-4 text-sm">{post.frontmatter.date}</p>
      <h1 className="mb-6 text-4xl font-medium tracking-tight">{post.frontmatter.title}</h1>
      <MdxContent>
        <Content />
      </MdxContent>
    </PageShell>
  );
}
