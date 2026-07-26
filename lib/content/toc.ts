// file: lib/content/toc.ts
// description: Extract table-of-contents headings from markdown and MDX source
// reference: lib/content/types.ts, lib/content/loader.ts

import type { TocHeading } from "./types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function extract_headings(source: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const lines = source.split("\n");

  for (const line of lines) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match?.[1] || !match[2]) continue;

    const level = match[1].length;
    const text = match[2].replace(/\{#.+\}$/, "").trim();
    headings.push({ id: slugify(text), text, level });
  }

  return headings;
}
