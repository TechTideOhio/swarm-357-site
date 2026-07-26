// file: app/changelog/page.tsx
// description: Product changelog rendered from synced core repo data
// reference: content/data/changelog.md, components/page-shell.tsx

import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { createMetadata } from "@/lib/metadata";
import { content_inline_link } from "@/lib/ui-classes";
import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Changelog",
  description: "Version history and release notes for techtide-swarm and Swarm 357.",
  path: "/changelog",
});

function render_changelog(md: string): ReactNode {
  const lines = md.split("\n");
  const elements: ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="mt-12 mb-4 text-2xl font-medium tracking-tight">
          {line.replace(/^## /, "").replace(/\u2014/g, "-")}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="mt-8 mb-3 text-xl font-medium">
          {line.replace(/^### /, "")}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      elements.push(
        <li key={key++} className="text-muted-foreground ml-6 list-disc leading-relaxed">
          {line.replace(/^- /, "").replace(/\u2014/g, "-")}
        </li>
      );
    } else if (line.trim()) {
      elements.push(
        <p key={key++} className="text-muted-foreground mb-4 leading-relaxed">
          {line.replace(/\u2014/g, "-")}
        </p>
      );
    }
  }

  return elements;
}

export default function ChangelogPage(): ReactNode {
  const file_path = path.join(process.cwd(), "content/data/changelog.md");
  const md = fs.existsSync(file_path) ? fs.readFileSync(file_path, "utf8") : "# Changelog\n\nNo data synced yet.";

  return (
    <PageShell
      title="Changelog"
      description={
        <>
          Release history for techtide-swarm. See also{" "}
          <Link href="/docs/resources/release" className={content_inline_link}>
            release process
          </Link>
          .
        </>
      }
    >
      <article>{render_changelog(md.replace(/^# Changelog\n+/, ""))}</article>
    </PageShell>
  );
}
