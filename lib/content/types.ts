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

export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
  slug: string;
  tags?: string[];
  draft?: boolean;
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
