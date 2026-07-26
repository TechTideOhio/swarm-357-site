// file: app/not-found.tsx
// description: Global 404 not found page
// reference: app/layout.tsx, components/page-shell.tsx

import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import type { ReactNode } from "react";

export default function NotFound(): ReactNode {
  return (
    <PageShell title="Page not found" centered>
      <p className="text-muted-foreground mb-8">
        The page you requested does not exist or was moved.
      </p>
      <div className="flex justify-center gap-4">
        <Link href="/" className="bg-foreground text-background rounded-md px-5 py-3 text-sm font-medium">
          Home
        </Link>
        <Link href="/docs" className="border-border rounded-md border px-5 py-3 text-sm font-medium">
          Documentation
        </Link>
      </div>
    </PageShell>
  );
}
