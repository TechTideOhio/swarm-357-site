// file: lib/modal-sheet.tsx
// description: Responsive modal that becomes a full-screen sheet below the sm breakpoint
// reference: lib/ui-classes.ts, lib/use-body-scroll-lock.ts, lib/use-focus-trap.ts, lib/motion.tsx

"use client";

import {
  dialogSpring,
  dialogSpringReduced,
  dialogSpringTransition,
  overlayFade,
  overlayFadeReduced,
  overlayFadeTransition,
  useReducedMotion,
} from "@/lib/motion";
import {
  chrome_overlay,
  content_dialog_panel,
  touch_target,
} from "@/lib/ui-classes";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

interface ModalSheetProps {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  children: ReactNode;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

function useVisualViewportHeight(active: boolean): void {
  useEffect(() => {
    if (!active || typeof window === "undefined" || !window.visualViewport) return;

    const set_height = (): void => {
      document.documentElement.style.setProperty(
        "--vvh",
        `${window.visualViewport?.height ?? window.innerHeight}px`
      );
    };

    set_height();
    window.visualViewport.addEventListener("resize", set_height);
    window.visualViewport.addEventListener("scroll", set_height);

    return () => {
      window.visualViewport?.removeEventListener("resize", set_height);
      window.visualViewport?.removeEventListener("scroll", set_height);
      document.documentElement.style.removeProperty("--vvh");
    };
  }, [active]);
}

export function ModalSheet({
  open,
  onClose,
  ariaLabel,
  children,
  triggerRef,
}: ModalSheetProps): ReactNode {
  const panel_ref = useRef<HTMLDivElement>(null);
  const prefers_reduced_motion = useReducedMotion();

  useBodyScrollLock(open);
  useFocusTrap(open, panel_ref, triggerRef);
  useVisualViewportHeight(open);

  useEffect(() => {
    if (!open) return;

    function on_key(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", on_key);
    return () => window.removeEventListener("keydown", on_key);
  }, [open, onClose]);

  const overlay_motion = prefers_reduced_motion ? overlayFadeReduced : overlayFade;
  const panel_motion = prefers_reduced_motion ? dialogSpringReduced : dialogSpring;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className={`${chrome_overlay} z-[100] flex items-end justify-center p-0 sm:items-start sm:p-4 sm:pt-24`}
          role="presentation"
          initial={overlay_motion.initial}
          animate={overlay_motion.animate}
          exit={overlay_motion.exit}
          transition={overlayFadeTransition}
          onClick={onClose}
        >
          <motion.div
            ref={panel_ref}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            className={`${content_dialog_panel} bg-background fixed inset-0 flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden rounded-none border-0 sm:static sm:inset-auto sm:h-auto sm:max-h-[90dvh] sm:overflow-y-auto`}
            style={{ maxHeight: "var(--vvh, 100dvh)" }}
            initial={panel_motion.initial}
            animate={panel_motion.animate}
            exit={panel_motion.exit}
            transition={
              prefers_reduced_motion ? { duration: 0.01 } : dialogSpringTransition
            }
            onClick={(event) => event.stopPropagation()}
            data-lenis-prevent
          >
            <div className="border-border relative flex shrink-0 items-center justify-center border-b px-4 py-3 sm:justify-end sm:border-0 sm:py-0 sm:pr-3 sm:pt-3">
              <div
                className="bg-muted absolute top-3 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full sm:hidden"
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={onClose}
                className={`${touch_target} text-muted-foreground hover:text-foreground rounded-full transition-colors active:opacity-80`}
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
