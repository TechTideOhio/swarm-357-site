// file: app/docs/layout.tsx
// description: Documentation section layout with sidebar and search
// reference: components/docs/docs-sidebar.tsx, components/docs/docs-search.tsx

import { DocsMobileToolbar } from "@/components/docs/docs-mobile-toolbar";
import { DocsSearch } from "@/components/docs/docs-search";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { get_search_index } from "@/lib/content/loader";
import type { ReactNode } from "react";

export default function DocsLayout({ children }: { children: ReactNode }) {
  const search_entries = get_search_index();

  return (
    <div className="bg-background min-h-screen pt-24">
      <div className="mx-auto flex max-w-7xl gap-8 px-6 pb-20 md:px-8 lg:gap-12">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-28 space-y-6">
            <DocsSearch entries={search_entries} />
            <div className="scrollbar-fluid max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
              <DocsSidebar />
            </div>
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <DocsMobileToolbar search_entries={search_entries} />
          {children}
        </div>
      </div>
    </div>
  );
}
