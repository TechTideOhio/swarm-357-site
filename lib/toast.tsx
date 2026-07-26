// file: lib/toast.tsx
// description: Minimal toast context and hook for mobile-friendly notifications
// reference: components/toast-provider.tsx, lib/ui-classes.ts

"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type ToastVariant = "default" | "error";

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (message: string, variant?: ToastVariant) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }): ReactNode {
  const [toasts, set_toasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    set_toasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "default") => {
      const id = crypto.randomUUID();
      set_toasts((current) => [...current, { id, message, variant }]);
      window.setTimeout(() => dismissToast(id), 5000);
    },
    [dismissToast]
  );

  const value = useMemo(
    () => ({ toasts, showToast, dismissToast }),
    [toasts, showToast, dismissToast]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
