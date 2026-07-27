// file: app/evals/page.tsx
// description: Standalone eval results summary page
// reference: lib/eval-baseline.ts, docs/evals/latest-baseline, components/page-shell.tsx

import Link from "next/link";
import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { createMetadata } from "@/lib/metadata";
import { get_eval_baseline } from "@/lib/eval-baseline";
import { content_inline_link } from "@/lib/ui-classes";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Evals",
  description: "Latest evaluation baseline metrics for Swarm 357 single-agent and swarm tasks.",
  path: "/evals",
});

export default function EvalsPage(): ReactNode {
  const baseline = get_eval_baseline();

  return (
    <PageShell
      parent={null}
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
        <div className="border-border mb-8 overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[20rem] text-sm">
            <tbody>
              <tr className="border-border border-b">
                <td className="px-4 py-3 font-medium">Executions</td>
                <td className="px-4 py-3">{baseline.executions}</td>
              </tr>
              <tr className="border-border border-b">
                <td className="px-4 py-3 font-medium">Passed gates</td>
                <td className="px-4 py-3">{baseline.passed}</td>
              </tr>
              <tr className="border-border border-b">
                <td className="px-4 py-3 font-medium">Avg combined score</td>
                <td className="px-4 py-3">{baseline.avg_combined_score.toFixed(3)}</td>
              </tr>
              <tr className="border-border border-b">
                <td className="px-4 py-3 font-medium">Spend</td>
                <td className="px-4 py-3">
                  ${baseline.spent_usd.toFixed(2)} / ${baseline.budget_usd.toFixed(2)}
                </td>
              </tr>
              <tr className="border-border border-b">
                <td className="px-4 py-3 font-medium">Provider</td>
                <td className="px-4 py-3">
                  {baseline.provider} · {baseline.agent_model}
                </td>
              </tr>
              <tr className="border-border border-b">
                <td className="px-4 py-3 font-medium">Single-agent</td>
                <td className="px-4 py-3">{baseline.single_agent_pass}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Swarm</td>
                <td className="px-4 py-3">{baseline.swarm_pass}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}

      <Link href="/docs/evals/methodology" className={`${content_inline_link} font-medium`}>
        Read full eval methodology
      </Link>
    </PageShell>
  );
}
