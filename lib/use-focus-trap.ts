// file: lib/use-focus-trap.ts
// description: Traps keyboard focus inside an open overlay and restores focus on close
// reference: lib/modal-sheet.tsx, components/header.tsx

import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function get_focusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true"
  );
}

export function useFocusTrap(
  active: boolean,
  container_ref: RefObject<HTMLElement | null>,
  return_focus_ref?: RefObject<HTMLElement | null>
): void {
  useEffect(() => {
    if (!active) return;

    const trap_root = container_ref.current;
    if (!trap_root) return;

    const container: HTMLElement = trap_root;
    const previously_focused = document.activeElement as HTMLElement | null;
    const return_target_on_close = return_focus_ref?.current ?? previously_focused;

    const focus_first = (): void => {
      const focusable = get_focusable(container);
      const target = focusable[0] ?? container;
      target.focus();
    };

    const frame = requestAnimationFrame(focus_first);

    function on_keydown(event: KeyboardEvent): void {
      if (event.key !== "Tab") return;

      const focusable = get_focusable(container);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const current = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (current === first || (current && !container.contains(current))) {
          event.preventDefault();
          last.focus();
        }
      } else if (current === last) {
        event.preventDefault();
        first.focus();
      }
    }

    container.addEventListener("keydown", on_keydown);

    return () => {
      cancelAnimationFrame(frame);
      container.removeEventListener("keydown", on_keydown);
      return_target_on_close?.focus();
    };
  }, [active, container_ref, return_focus_ref]);
}
