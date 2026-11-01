"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { chrome_icon_circle } from "@/lib/ui-classes";
import { useSyncExternalStore, type ReactNode } from "react";

function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function ThemeSwitch(): ReactNode {
  const mounted = useIsMounted();
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = (): void => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <div className="fixed right-6 bottom-6 z-50">
        <button
          className={`${chrome_icon_circle} bg-foreground/10 cursor-not-allowed opacity-30`}
          aria-label="Toggle theme"
          disabled
        />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <button
        onClick={toggleTheme}
        className={`${chrome_icon_circle} bg-muted text-foreground opacity-30 shadow-lg shadow-black/10 hover:opacity-100 hover:shadow-xl hover:shadow-black/20`}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        aria-pressed={isDark}
        type="button"
      >
        {isDark ? (
          <Sun className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Moon className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
