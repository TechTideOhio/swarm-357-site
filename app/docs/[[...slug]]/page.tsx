// file: app/docs/[[...slug]]/page.tsx
// description: Dynamic documentation page renderer for MDX content and docs home
// reference: lib/content/loader.ts, lib/content/mdx.ts, components/docs/mdx-components.tsx

import { notFound } from "next/navigation";
import { DocsBreadcrumbs } from "@/components/docs/docs-breadcrumbs";
import { DocsHome } from "@/components/docs/docs-home";
import { DocsPager } from "@/components/docs/docs-pager";
import { DocsToc } from "@/components/docs/docs-toc";
import { MdxContent, mdx_components } from "@/components/docs/mdx-components";
import { load_doc_by_slug, get_all_doc_slugs } from "@/lib/content/loader";
import { compile_mdx } from "@/lib/content/mdx";
import { get_breadcrumbs, get_neighbors } from "@/lib/content/nav";
import { createMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site-url";
import type { Metadata } from "next";
import type { ReactNode } from "react";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateStaticParams() {
  return [
    { slug: [] },
    ...get_all_doc_slugs().map((slug) => ({
      slug: slug.split("/"),
    })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: slug_parts } = await params;
  const slug = slug_parts?.join("/") ?? "";

  if (!slug) {
    return createMetadata({
      title: "Documentation",
      description:
        "Complete documentation for Swarm 357: installation, guides, CLI, HTTP API, Python SDK, roster, security, evals, and deployment.",
      path: "/docs",
    });
  }

  const doc = load_doc_by_slug(slug);
  if (!doc) return {};

  return createMetadata({
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    path: doc.href,
  });
}

function DocJsonLd({
  title,
  description,
  path,
  breadcrumbs,
}: {
  title: string;
  description: string;
  path: string;
  breadcrumbs: { title: string; href: string }[];
}) {
  const article_json = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description,
    url: `${SITE_URL}${path}`,
    author: { "@type": "Organization", name: "TechTide AI" },
    publisher: { "@type": "Organization", name: "Swarm 357" },
  };

  const breadcrumb_json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.title,
      item: `${SITE_URL}${crumb.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article_json) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb_json) }}
      />
    </>
  );
}

export default async function DocPage({ params }: PageProps): Promise<ReactNode> {
  const { slug: slug_parts } = await params;
  const slug = slug_parts?.join("/") ?? "";

  if (!slug) {
    return <DocsHome />;
  }

  const doc = load_doc_by_slug(slug);
  if (!doc) notFound();

  const Content = await compile_mdx(doc.content, mdx_components);
  const crumbs = get_breadcrumbs(slug);
  const { prev, next } = get_neighbors(slug);

  return (
    <main id="main-content" className="flex gap-12">
      <DocJsonLd
        title={doc.frontmatter.title}
        description={doc.frontmatter.description}
        path={doc.href}
        breadcrumbs={crumbs}
      />
      <article className="min-w-0 flex-1 max-w-3xl">
        <DocsBreadcrumbs crumbs={crumbs} />
        <header className="mb-8">
          <h1 className="mb-3 text-3xl font-medium tracking-tight md:text-4xl">
            {doc.frontmatter.title}
          </h1>
          {doc.frontmatter.description ? (
            <p className="text-muted-foreground text-lg leading-relaxed">
              {doc.frontmatter.description}
            </p>
          ) : null}
        </header>
        <MdxContent>
          <Content />
        </MdxContent>
        <DocsPager prev={prev} next={next} />
      </article>
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-28">
          <DocsToc headings={doc.headings} />
        </div>
      </aside>
    </main>
  );
}
