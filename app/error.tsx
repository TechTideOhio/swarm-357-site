// file: app/error.tsx
// description: Global error boundary page
// reference: app/layout.tsx, components/page-shell.tsx, lib/ui-classes.ts

"use client";

import { PageShell } from "@/components/page-shell";
import { chrome_primary_cta } from "@/lib/ui-classes";
import type { ReactNode } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): ReactNode {
  return (
    <PageShell title="Something went wrong" centered>
      <p className="text-muted-foreground mb-8 text-sm">{error.message}</p>
      <button type="button" onClick={reset} className={`${chrome_primary_cta} glow-accent`}>
        Try again
      </button>
    </PageShell>
  );
}
