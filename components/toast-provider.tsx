// file: components/toast-provider.tsx
// description: Renders toast stack with slide-up animation for mobile and desktop
// reference: lib/toast.tsx, lib/ui-classes.ts, lib/motion.tsx

"use client";

import {
  toastSpring,
  toastSpringReduced,
  toastSpringTransition,
  useReducedMotion,
} from "@/lib/motion";
import { ToastProvider as ToastContextProvider, useToast } from "@/lib/toast";
import { touch_target } from "@/lib/ui-classes";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import type { ReactNode } from "react";

function ToastViewport(): ReactNode {
  const { toasts, dismissToast } = useToast();
  const prefers_reduced_motion = useReducedMotion();
  const toast_motion = prefers_reduced_motion ? toastSpringReduced : toastSpring;

  return (
    <div
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[120] flex flex-col gap-2 sm:inset-x-auto sm:top-20 sm:right-6 sm:bottom-auto sm:items-end"
      aria-live="polite"
      aria-relevant="additions"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            role="status"
            initial={toast_motion.initial}
            animate={toast_motion.animate}
            exit={toast_motion.exit}
            transition={
              prefers_reduced_motion ? { duration: 0.01 } : toastSpringTransition
            }
            className={`bg-background border-border text-foreground pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border p-4 shadow-2xl/20 ${
              toast.variant === "error" ? "border-foreground/20" : ""
            }`}
          >
            <p className="flex-1 text-sm leading-relaxed">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className={`${touch_target} text-muted-foreground hover:text-foreground shrink-0 rounded-full active:opacity-80`}
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function AppToastProvider({ children }: { children: ReactNode }): ReactNode {
  return (
    <ToastContextProvider>
      {children}
      <ToastViewport />
    </ToastContextProvider>
  );
}
