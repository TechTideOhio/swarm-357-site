// file: components/docs/docs-pager.tsx
// description: Previous and next navigation footer for documentation pages
// reference: lib/content/nav.ts

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DocNeighbor } from "@/lib/content/types";
import { content_card } from "@/lib/ui-classes";
import type { ReactNode } from "react";

export function DocsPager({
  prev,
  next,
}: {
  prev: DocNeighbor | null;
  next: DocNeighbor | null;
}): ReactNode {
  if (!prev && !next) return null;

  return (
    <div className="border-border mt-16 grid gap-4 border-t pt-8 sm:grid-cols-2">
      {prev ? (
        <Link
          href={prev.href}
          className={`${content_card} group active:opacity-90`}
        >
          <span className="text-muted-foreground flex items-center gap-1 text-xs uppercase tracking-wider">
            <ChevronLeft className="h-3 w-3" /> Previous
          </span>
          <span className="mt-2 block font-medium">{prev.title}</span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          className={`${content_card} group text-right active:opacity-90`}
        >
          <span className="text-muted-foreground flex items-center justify-end gap-1 text-xs uppercase tracking-wider">
            Next <ChevronRight className="h-3 w-3" />
          </span>
          <span className="mt-2 block font-medium">{next.title}</span>
        </Link>
      ) : null}
    </div>
  );
}
