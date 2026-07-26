// file: components/docs/docs-toc.tsx
// description: Right-side table of contents for documentation pages
// reference: lib/content/types.ts

import type { TocHeading } from "@/lib/content/types";
import type { ReactNode } from "react";

export function DocsToc({ headings }: { headings: TocHeading[] }): ReactNode {
  if (headings.length === 0) return null;

  return (
    <nav aria-label="On this page" className="hidden xl:block">
      <p className="text-muted-foreground mb-4 text-xs font-semibold tracking-widest uppercase">
        On this page
      </p>
      <ul className="space-y-2 border-l border-border pl-4">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={`text-muted-foreground block text-sm transition-colors hover:text-foreground ${
                heading.level === 3 ? "pl-3" : ""
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
