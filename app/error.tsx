// file: app/error.tsx
// description: Global error boundary page
// reference: app/layout.tsx, components/page-shell.tsx

"use client";

import { PageShell } from "@/components/page-shell";
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
      <button
        type="button"
        onClick={reset}
        className="bg-accent rounded-md px-5 py-3 text-sm font-medium text-black"
      >
        Try again
      </button>
    </PageShell>
  );
}
