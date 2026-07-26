// file: lib/use-body-scroll-lock.ts
// description: Locks document body scroll while overlays or sheets are open
// reference: lib/modal-sheet.tsx, components/header.tsx

import { useEffect } from "react";

export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const previous_overflow = document.body.style.overflow;
    const previous_padding_right = document.body.style.paddingRight;
    const scrollbar_width = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbar_width > 0) {
      document.body.style.paddingRight = `${scrollbar_width}px`;
    }

    return () => {
      document.body.style.overflow = previous_overflow;
      document.body.style.paddingRight = previous_padding_right;
    };
  }, [locked]);
}
