// file: components/page-shell.tsx
// description: Shared layout shell for standalone pages with breadcrumb navigation
// reference: app/blog/page.tsx, app/changelog/page.tsx, app/evals/page.tsx

import Link from "next/link";
import type { ReactNode } from "react";

type PageShellWidth = "narrow" | "wide";

interface PageShellProps {
  title?: string;
  description?: ReactNode;
  maxWidth?: PageShellWidth;
  centered?: boolean;
  showHeading?: boolean;
  children: ReactNode;
}

const width_classes: Record<PageShellWidth, string> = {
  narrow: "max-w-3xl",
  wide: "max-w-5xl",
};

export function PageShell({
  title,
  description,
  maxWidth = "narrow",
  centered = false,
  showHeading = true,
  children,
}: PageShellProps): ReactNode {
  const content = (
    <>
      <nav aria-label="Breadcrumb" className="text-muted-foreground mb-8 text-sm">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="transition-opacity hover:opacity-70">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/docs" className="transition-opacity hover:opacity-70">
              Docs
            </Link>
          </li>
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
