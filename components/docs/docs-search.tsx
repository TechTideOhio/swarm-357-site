// file: components/docs/docs-search.tsx
// description: Cmd+K static search dialog for docs and blog content
// reference: lib/content/loader.ts

"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

interface SearchEntry {
  title: string;
  description: string;
  href: string;
  type: "doc" | "blog";
}

export function DocsSearch({ entries }: { entries: SearchEntry[] }): ReactNode {
  const [open, set_open] = useState(false);
  const [query, set_query] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries.slice(0, 12);
    return entries
      .filter(
        (entry) =>
          entry.title.toLowerCase().includes(q) ||
          entry.description.toLowerCase().includes(q)
      )
      .slice(0, 12);
  }, [entries, query]);

  useEffect(() => {
    function on_key(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        set_open((value) => !value);
      }
      if (event.key === "Escape") set_open(false);
    }
    window.addEventListener("keydown", on_key);
    return () => window.removeEventListener("keydown", on_key);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => set_open(true)}
        className="border-border text-muted-foreground hover:text-foreground focus-ring flex w-full items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-sm transition-colors"
        aria-label="Search documentation"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search docs...</span>
        <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-xs sm:inline">Ctrl K</kbd>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 p-4 pt-24 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          onClick={() => set_open(false)}
        >
          <div
            className="bg-background w-full max-w-xl rounded-xl border border-border shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-border border-b p-4">
              <input
                autoFocus
                value={query}
                onChange={(event) => set_query(event.target.value)}
                placeholder="Search documentation and blog..."
                className="focus-ring w-full bg-transparent text-base outline-none"
                aria-label="Search query"
              />
            </div>
            <ul className="scrollbar-fluid max-h-80 overflow-y-auto p-2">
              {results.length === 0 ? (
                <li className="text-muted-foreground px-3 py-4 text-sm">No results found.</li>
              ) : (
                results.map((entry) => (
                  <li key={entry.href}>
                    <Link
                      href={entry.href}
                      onClick={() => set_open(false)}
                      className="hover:bg-muted block rounded-lg px-3 py-3 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-medium">{entry.title}</span>
                        <span className="text-muted-foreground text-xs uppercase">{entry.type}</span>
                      </span>
                      {entry.description ? (
                        <span className="text-muted-foreground mt-1 block text-sm line-clamp-2">
                          {entry.description}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
