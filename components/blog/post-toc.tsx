// file: components/blog/post-toc.tsx
// description: Inline contents list for blog posts, giving search engines jump-to-section targets
// reference: lib/content/toc.ts, lib/content/mdx.ts, app/blog/[slug]/page.tsx

import { content_inline_link } from "@/lib/ui-classes";
import type { TocHeading } from "@/lib/content/types";
import type { ReactNode } from "react";

/** Below this a contents list is just noise, so the section is dropped. */
const MIN_HEADINGS = 3;

export function PostToc({ headings }: { headings: TocHeading[] }): ReactNode {
  // Only top-level sections. The anchors come from rehype-slug in lib/content/mdx.ts.
  const sections = headings.filter((heading) => heading.level === 2);
  if (sections.length < MIN_HEADINGS) return null;

  return (
    <nav
      aria-label="On this page"
      className="border-border bg-muted/40 mb-10 rounded-xl border p-6"
    >
      <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest uppercase">
        On this page
      </p>
      <ol className="space-y-2">
        {sections.map((heading) => (
          <li key={heading.id}>
            <a href={`#${heading.id}`} className={`${content_inline_link} text-sm`}>
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
