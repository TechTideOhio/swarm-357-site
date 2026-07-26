// file: components/docs/docs-home.tsx
// description: Documentation index page with section cards
// reference: lib/content/nav.ts

import Link from "next/link";
import { docs_nav } from "@/lib/content/nav";
import type { ReactNode } from "react";

export function DocsHome(): ReactNode {
  return (
    <main id="main-content" className="max-w-3xl">
      <h1 className="mb-4 text-4xl font-medium tracking-tight md:text-5xl">Documentation</h1>
      <p className="text-muted-foreground mb-12 text-lg leading-relaxed">
        Everything you need to install, configure, run, and operate Swarm 357. Layered agents,
        portable memory, honest cost controls, and production security defaults.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        {docs_nav.map((section) => (
          <section key={section.title} className="border-border rounded-2xl border p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">{section.title}</h2>
            <ul className="space-y-2">
              {section.items.slice(0, 4).map((item) => (
                <li key={item.slug}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
              {section.items.length > 4 ? (
                <li>
                  <Link
                    href={section.items[0]?.href ?? "/docs"}
                    className="text-sm font-medium underline underline-offset-4"
                  >
                    View all {section.items.length} pages
                  </Link>
                </li>
              ) : null}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
