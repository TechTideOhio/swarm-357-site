// file: app/not-found.tsx
// description: Global 404 not found page
// reference: app/layout.tsx, components/page-shell.tsx, lib/ui-classes.ts

import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { chrome_primary_cta, chrome_secondary_cta } from "@/lib/ui-classes";
import type { ReactNode } from "react";

export default function NotFound(): ReactNode {
  return (
    <PageShell title="Page not found" centered>
      <p className="text-muted-foreground mb-8">
        The page you requested does not exist or was moved.
      </p>
      <div className="flex justify-center gap-4">
        <Link href="/" className={`${chrome_primary_cta} glow-accent`}>
          Home
        </Link>
        <Link href="/docs" className={`${chrome_secondary_cta} border-border border`}>
          Documentation
        </Link>
      </div>
    </PageShell>
  );
}
