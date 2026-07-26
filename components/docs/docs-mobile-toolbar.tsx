// file: components/docs/docs-mobile-toolbar.tsx
// description: Sticky mobile docs toolbar with section drawer and search trigger
// reference: components/docs/docs-sidebar.tsx, components/docs/docs-search.tsx, lib/modal-sheet.tsx

"use client";

import { DocsSearch } from "@/components/docs/docs-search";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import {
  overlayFade,
  overlayFadeTransition,
  useReducedMotion,
} from "@/lib/motion";
import { chrome_overlay, touch_target } from "@/lib/ui-classes";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface SearchEntry {
  title: string;
  description: string;
  href: string;
  type: "doc" | "blog";
}

export function DocsMobileToolbar({
  search_entries,
}: {
  search_entries: SearchEntry[];
}): ReactNode {
  const [drawer_open, set_drawer_open] = useState(false);
  const menu_button_ref = useRef<HTMLButtonElement>(null);
  const drawer_ref = useRef<HTMLDivElement>(null);
  const prefers_reduced_motion = useReducedMotion();

  useBodyScrollLock(drawer_open);
  useFocusTrap(drawer_open, drawer_ref, menu_button_ref);

  useEffect(() => {
    if (!drawer_open) return;

    function on_key(event: KeyboardEvent) {
      if (event.key === "Escape") set_drawer_open(false);
    }

    window.addEventListener("keydown", on_key);
    return () => window.removeEventListener("keydown", on_key);
  }, [drawer_open]);

  return (
    <>
      <div className="border-border bg-background/95 sticky top-[4.5rem] z-30 -mx-6 mb-6 flex items-center gap-2 border-b px-4 py-3 backdrop-blur-sm lg:hidden">
        <button
          ref={menu_button_ref}
          type="button"
          onClick={() => set_drawer_open(true)}
          className={`${touch_target} text-foreground hover:bg-muted focus-ring gap-2 rounded-lg px-3 transition-colors active:opacity-80`}
          aria-expanded={drawer_open}
          aria-controls="docs-mobile-drawer"
          aria-label="Open documentation sections"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
          <span className="text-sm font-medium">Sections</span>
        </button>
        <div className="ml-auto">
          <DocsSearch entries={search_entries} variant="icon" />
        </div>
      </div>

      <AnimatePresence>
        {drawer_open ? (
          <>
            <motion.div
              className={`${chrome_overlay} z-[90]`}
              initial={overlayFade.initial}
              animate={overlayFade.animate}
              exit={overlayFade.exit}
              transition={
                prefers_reduced_motion ? { duration: 0.01 } : overlayFadeTransition
              }
              onClick={() => set_drawer_open(false)}
              aria-hidden="true"
            />
            <motion.aside
              id="docs-mobile-drawer"
              ref={drawer_ref}
              className="bg-background border-border fixed inset-y-0 left-0 z-[95] flex w-[min(100%,20rem)] flex-col border-r shadow-2xl/20"
              role="dialog"
              aria-modal="true"
              aria-label="Documentation sections"
              initial={{ x: prefers_reduced_motion ? 0 : "-100%", opacity: prefers_reduced_motion ? 0 : 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: prefers_reduced_motion ? 0 : "-100%", opacity: prefers_reduced_motion ? 0 : 1 }}
              transition={
                prefers_reduced_motion
                  ? { duration: 0.01 }
                  : { type: "spring", stiffness: 400, damping: 25 }
              }
            >
              <div className="border-border flex items-center justify-between border-b px-4 py-3">
                <span className="text-sm font-semibold tracking-tight">Documentation</span>
                <button
                  type="button"
                  onClick={() => set_drawer_open(false)}
                  className={`${touch_target} text-muted-foreground hover:text-foreground focus-ring rounded-full transition-colors active:opacity-80`}
                  aria-label="Close documentation sections"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <div
                className="scrollbar-fluid flex-1 overflow-y-auto p-4"
                data-lenis-prevent
                onClick={() => set_drawer_open(false)}
              >
                <DocsSidebar />
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
