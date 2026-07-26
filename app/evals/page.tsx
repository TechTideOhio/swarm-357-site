// file: app/evals/page.tsx
// description: Standalone eval results summary page
// reference: content/data/eval-baseline.json, docs/evals/latest-baseline, components/page-shell.tsx

import Link from "next/link";
import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { createMetadata } from "@/lib/metadata";
import { load_data_json } from "@/lib/content/loader";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Evals",
  description: "Latest evaluation baseline metrics for Swarm 357 single-agent and swarm tasks.",
  path: "/evals",
});

export default function EvalsPage(): ReactNode {
  const baseline = load_data_json<{
    meta?: { task_count?: number; passed?: number; budget_spent_usd?: number; budget_limit_usd?: number };
    summary?: { single_agent_pass?: string; swarm_pass?: string };
  }>("eval-baseline");

  return (
    <PageShell
      title="Evals"
      description="Budgeted evaluation suite with keyword, length, and LLM judge gates. Numbers from the latest committed baseline."
    >
      <div className="bg-muted mb-8 overflow-hidden rounded-2xl border border-border p-4">
        <Image
          src="/assets/eval-results.svg"
          alt="Eval results chart"
          width={960}
          height={420}
          className="h-auto w-full"
          unoptimized
        />
      </div>

      {baseline ? (
        <div className="border-border mb-8 overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-border border-b">
                <td className="px-4 py-3 font-medium">Executions</td>
                <td className="px-4 py-3">{baseline.meta?.task_count ?? "n/a"}</td>
              </tr>
              <tr className="border-border border-b">
                <td className="px-4 py-3 font-medium">Passed gates</td>
                <td className="px-4 py-3">{baseline.meta?.passed ?? "n/a"}</td>
              </tr>
              <tr className="border-border border-b">
                <td className="px-4 py-3 font-medium">Spend</td>
                <td className="px-4 py-3">
                  ${baseline.meta?.budget_spent_usd?.toFixed(2) ?? "n/a"} / $
                  {baseline.meta?.budget_limit_usd ?? "n/a"}
                </td>
              </tr>
              <tr className="border-border border-b">
                <td className="px-4 py-3 font-medium">Single-agent</td>
                <td className="px-4 py-3">{baseline.summary?.single_agent_pass ?? "n/a"}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Swarm</td>
                <td className="px-4 py-3">{baseline.summary?.swarm_pass ?? "n/a"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}

      <Link href="/docs/evals/methodology" className="font-medium underline underline-offset-4">
        Read full eval methodology
      </Link>
    </PageShell>
  );
}
