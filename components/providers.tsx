"use client";

import { ReducedMotionProvider } from "@/lib/motion";
import { AppToastProvider } from "@/components/toast-provider";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }): ReactNode {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ReducedMotionProvider>
        <AppToastProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </AppToastProvider>
      </ReducedMotionProvider>
    </ThemeProvider>
  );
}
