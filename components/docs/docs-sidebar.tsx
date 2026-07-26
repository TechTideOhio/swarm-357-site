// file: components/docs/docs-sidebar.tsx
// description: Left navigation sidebar for documentation pages
// reference: lib/content/nav.ts

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docs_nav } from "@/lib/content/nav";
import type { ReactNode } from "react";

export function DocsSidebar(): ReactNode {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation" className="space-y-8">
      {docs_nav.map((section) => (
        <div key={section.title}>
          <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest uppercase">
            {section.title}
          </p>
          <ul className="space-y-1">
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.slug}>
                  <Link
                    href={item.href}
                    className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-accent font-medium text-black"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
