// file: components/page-shell.tsx
// description: Shared layout shell for standalone pages with breadcrumb navigation
// reference: app/blog/page.tsx, app/changelog/page.tsx, app/evals/page.tsx

import Link from "next/link";
import { content_breadcrumb_link } from "@/lib/ui-classes";
import type { ReactNode } from "react";

type PageShellWidth = "narrow" | "wide";

interface BreadcrumbParent {
  label: string;
  href: string;
}

interface PageShellProps {
  title?: string;
  description?: ReactNode;
  maxWidth?: PageShellWidth;
  centered?: boolean;
  showHeading?: boolean;
  /**
   * Section this page sits under. Must match the BreadcrumbList JSON-LD on the
   * page, because a visible trail that disagrees with the schema is a rich
   * result violation. Pass null for pages that hang directly off the root.
   */
  parent?: BreadcrumbParent | null;
  children: ReactNode;
}

const width_classes: Record<PageShellWidth, string> = {
  narrow: "max-w-3xl",
  wide: "max-w-5xl",
};

const DOCS_PARENT: BreadcrumbParent = { label: "Docs", href: "/docs" };

export function PageShell({
  title,
  description,
  maxWidth = "narrow",
  centered = false,
  showHeading = true,
  parent = DOCS_PARENT,
  children,
}: PageShellProps): ReactNode {
  const content = (
    <>
      <nav aria-label="Breadcrumb" className="text-muted-foreground mb-8 text-sm">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className={content_breadcrumb_link}>
              Home
            </Link>
          </li>
          {parent ? (
            <>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={parent.href} className={content_breadcrumb_link}>
                  {parent.label}
                </Link>
              </li>
            </>
          ) : null}
          {title ? (
            <>
              <li aria-hidden="true">/</li>
              <li className="text-foreground font-medium">{title}</li>
            </>
          ) : null}
        </ol>
      </nav>

      {title && showHeading ? (
        <h1 className="mb-4 text-4xl font-medium tracking-tight">{title}</h1>
      ) : null}

      {description ? (
        <p className={`text-muted-foreground text-lg ${showHeading || !title ? "mb-12" : "mb-8"}`}>
          {description}
        </p>
      ) : null}

      {children}
    </>
  );

  if (centered) {
    return (
      <main
        id="main-content"
        className={`mx-auto flex min-h-[60vh] flex-col items-center justify-center px-6 pt-32 pb-20 text-center md:px-8 ${width_classes[maxWidth]}`}
      >
        {content}
      </main>
    );
  }

  return (
    <main
      id="main-content"
      className={`mx-auto px-6 pt-32 pb-20 md:px-8 ${width_classes[maxWidth]}`}
    >
      {content}
    </main>
  );
}
