// file: lib/content/types.ts
// description: Shared TypeScript types for docs and blog content collections
// reference: lib/content/loader.ts, lib/content/nav.ts

export interface DocFrontmatter {
  title: string;
  description: string;
  section: string;
  order: number;
  slug: string;
  draft?: boolean;
}

export interface BlogFaqEntry {
  question: string;
  answer: string;
}

export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
  slug: string;
  /** Date of the last substantive edit. Feeds schema.org dateModified. */
  updated?: string | undefined;
  /** Path under /public to the cover image, for example /art/blog/foo.png. */
  cover?: string | undefined;
  coverAlt?: string | undefined;
  author?: string | undefined;
  /** Search phrase this post owns. Enforced unique by scripts/check-content.ts. */
  keyword?: string | undefined;
  tags?: string[] | undefined;
  faq?: BlogFaqEntry[] | undefined;
  draft?: boolean | undefined;
}

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export interface DocPage {
  frontmatter: DocFrontmatter;
  slug: string;
  href: string;
  content: string;
  headings: TocHeading[];
}

export interface BlogPost {
  frontmatter: BlogFrontmatter;
  slug: string;
  href: string;
  content: string;
  headings: TocHeading[];
}

export interface NavItem {
  title: string;
  href: string;
  slug: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface DocNeighbor {
  title: string;
  href: string;
}
