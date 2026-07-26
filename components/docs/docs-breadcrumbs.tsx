// file: components/docs/docs-breadcrumbs.tsx
// description: Breadcrumb navigation for documentation pages
// reference: lib/content/nav.ts

import Link from "next/link";
import type { ReactNode } from "react";

export function DocsBreadcrumbs({
  crumbs,
}: {
  crumbs: { title: string; href: string }[];
}): ReactNode {
  return (
    <nav aria-label="Breadcrumb" className="text-muted-foreground mb-8 text-sm">
      <ol className="flex flex-wrap items-center gap-2">
        {crumbs.map((crumb, index) => {
          const is_last = index === crumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {is_last ? (
                <span className="text-foreground">{crumb.title}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-foreground transition-colors">
                  {crumb.title}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
