// file: components/docs/docs-search.tsx
// description: Cmd+K static search dialog for docs and blog content
// reference: lib/modal-sheet.tsx, lib/content/loader.ts, lib/ui-classes.ts

"use client";

import { ModalSheet } from "@/lib/modal-sheet";
import { content_form_control } from "@/lib/ui-classes";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

interface SearchEntry {
  title: string;
  description: string;
  href: string;
  type: "doc" | "blog";
}

interface DocsSearchProps {
  entries: SearchEntry[];
  /** Compact icon-only trigger for mobile toolbar. */
  variant?: "default" | "icon";
}

export function DocsSearch({ entries, variant = "default" }: DocsSearchProps): ReactNode {
  const [open, set_open] = useState(false);
  const [query, set_query] = useState("");
  const trigger_ref = useRef<HTMLButtonElement>(null);

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
    }
    window.addEventListener("keydown", on_key);
    return () => window.removeEventListener("keydown", on_key);
  }, []);

  return (
    <>
      {variant === "icon" ? (
        <button
          ref={trigger_ref}
          type="button"
          onClick={() => set_open(true)}
          className={`${content_form_control} text-muted-foreground hover:text-foreground inline-flex min-h-11 min-w-11 items-center justify-center gap-2 px-3 active:opacity-80`}
          aria-label="Search documentation"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : (
        <button
          ref={trigger_ref}
          type="button"
          onClick={() => set_open(true)}
          className={`${content_form_control} text-muted-foreground hover:text-foreground flex min-h-11 w-full items-center gap-2 active:opacity-80`}
          aria-label="Search documentation"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="flex-1 text-left">Search docs...</span>
          <kbd className="border-border hidden rounded border px-1.5 py-0.5 text-xs sm:inline">
            Ctrl K
          </kbd>
        </button>
      )}

      <ModalSheet
        open={open}
        onClose={() => set_open(false)}
        ariaLabel="Search documentation"
        triggerRef={trigger_ref}
      >
        <div className="border-border shrink-0 border-b p-4">
          <input
            autoFocus
            value={query}
            onChange={(event) => set_query(event.target.value)}
            placeholder="Search documentation and blog..."
            className="focus-ring w-full bg-transparent text-base outline-none"
            aria-label="Search query"
            onFocus={(event) => {
              event.currentTarget.scrollIntoView({ block: "nearest", behavior: "smooth" });
            }}
          />
        </div>
        <ul className="scrollbar-fluid min-h-0 flex-1 overflow-y-auto p-2 sm:max-h-80">
          {results.length === 0 ? (
            <li className="text-muted-foreground px-3 py-4 text-sm">No results found.</li>
          ) : (
            results.map((entry) => (
              <li key={entry.href}>
                <Link
                  href={entry.href}
                  onClick={() => set_open(false)}
                  className="focus-ring hover:bg-muted block min-h-11 rounded-lg px-3 py-3 transition-colors active:opacity-80"
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
      </ModalSheet>
    </>
  );
}
