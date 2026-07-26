import { CORE_PACKAGE_VERSION, SITE_VERSION } from "@/lib/config";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "About",
  description:
    "What Swarm 357 is, how the 357-agent roster works, eval evidence, and feature maturity — without the hype.",
  path: "/about",
});

/** Thin mirror of core STATUS.md — do not invent a second maturity matrix. */
const maturity = [
  { feature: "Agent + Swarm orchestration", status: "Beta" },
  { feature: "CLI", status: "Stable / Beta" },
  { feature: "Memory (flat-file)", status: "Stable" },
  { feature: "Memvid .mv2 via bridge", status: "Beta" },
  { feature: "BashSecurityGate + argv policy", status: "Stable" },
  { feature: "Bash HITL approvals", status: "Beta" },
  { feature: "SSE event stream (auth + close)", status: "Beta" },
  { feature: "Cost controls", status: "Beta" },
  { feature: "Eval harness", status: "Beta" },
  { feature: "HTTP API", status: "Beta" },
  { feature: "Dream cycle", status: "Experimental" },
];

export default function AboutPage(): ReactNode {
  return (
    <main id="main-content" className="flex-1 bg-background text-foreground">
      <section className="px-6 pb-16 pt-32 md:px-12 md:pb-24 md:pt-40">
        <div className="mx-auto max-w-3xl">
          <p className="text-muted-foreground mb-4 text-sm font-medium tracking-widest uppercase">
            About · landing {SITE_VERSION} · techtide-swarm {CORE_PACKAGE_VERSION}
          </p>
          <h1 className="text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl">
            An organizational ontology for agents — not a headcount fantasy.
          </h1>
          <p className="text-muted-foreground mt-8 text-lg leading-relaxed md:text-xl">
            Swarm 357 is 357 distinct agent identities across six business layers plus
            management meta-agents. The Conductor routes work; budgets, bash policy, and
            portable memory are first-class. We do not claim 357 simultaneous Opus sessions.
          </p>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
            Maturity claims below mirror core{" "}
            <Link
              href="https://github.com/TechTideOhio/swarm-357/blob/main/STATUS.md"
              className="underline underline-offset-4 transition-opacity hover:opacity-70"
            >
              STATUS.md
            </Link>{" "}
            against{" "}
            <Link
              href={`https://pypi.org/project/techtide-swarm/${CORE_PACKAGE_VERSION}/`}
              className="underline underline-offset-4 transition-opacity hover:opacity-70"
            >
              techtide-swarm {CORE_PACKAGE_VERSION}
            </Link>
            . Acceptance checks:{" "}
            <Link
              href="https://github.com/TechTideOhio/swarm-357/blob/main/docs/VERIFY.md"
              className="underline underline-offset-4 transition-opacity hover:opacity-70"
            >
              docs/VERIFY.md
            </Link>
            .
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="https://github.com/TechTideOhio/swarm-357"
              className="bg-foreground text-background rounded-[3.5px] px-5 py-3 text-sm font-medium tracking-tight shadow-lg shadow-black/10 transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-xl hover:shadow-black/20"
            >
              Get the repo
            </Link>
            <Link
              href={`https://pypi.org/project/techtide-swarm/${CORE_PACKAGE_VERSION}/`}
              className="bg-muted text-foreground rounded-[3.5px] px-5 py-3 text-sm font-medium tracking-tight transition-all duration-500 ease-out hover:rounded-[50px]"
            >
              pip install techtide-swarm=={CORE_PACKAGE_VERSION}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-border border-t px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-2xl font-medium tracking-tight md:text-3xl">
            Architecture
          </h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Management conducts six domain layers. Memory (flat topics + optional Memvid
            .mv2) and cost controls cut across every run.
          </p>
          <div className="bg-muted overflow-hidden rounded-2xl border border-neutral-200/10 p-4 shadow-2xl/20 md:p-8">
            <Image
              src="/assets/architecture.png"
              alt="Swarm 357 architecture diagram"
              width={960}
              height={540}
              className="h-auto w-full"
              unoptimized
            />
          </div>
        </div>
      </section>

      <section className="border-border border-t px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-2xl font-medium tracking-tight md:text-3xl">
            Eval evidence
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            Latest baseline: 154 executions, 145 passed gates, avg combined score 0.923,
            $4.99 of a $5 hard cap on OpenRouter (Sonnet-4 agents, Haiku judge).
            Single-agent 142/142. Swarm 4/12 — eight wall-clock timeouts are reported, not
            hidden.
          </p>
          <div className="bg-muted overflow-hidden rounded-2xl border border-neutral-200/10 p-4 shadow-2xl/20 md:p-8">
            <Image
              src="/assets/eval-results.svg"
              alt="Eval results by layer — singles 142/142, swarm 4/12"
              width={960}
              height={420}
              className="h-auto w-full"
              unoptimized
            />
          </div>
          <p className="text-muted-foreground mt-6 text-sm">
            Methodology and reproduce steps:{" "}
            <Link
              href="https://github.com/TechTideOhio/swarm-357/blob/main/docs/EVALS.md"
              className="underline underline-offset-4 transition-opacity hover:opacity-70"
            >
              docs/EVALS.md
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="border-border border-t px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-medium tracking-tight md:text-3xl">
            Feature maturity
          </h2>
          <div className="divide-border border-neutral-200/10 divide-y rounded-2xl border shadow-2xl/20">
            {maturity.map((row) => (
              <div
                key={row.feature}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <span className="text-sm md:text-base">{row.feature}</span>
                <span className="bg-accent rounded px-2 py-0.5 text-xs font-medium tracking-wide text-black uppercase">
                  {row.status}
                </span>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground mt-6 text-sm">
            Source of truth:{" "}
            <Link
              href="https://github.com/TechTideOhio/swarm-357/blob/main/STATUS.md"
              className="underline underline-offset-4 transition-opacity hover:opacity-70"
            >
              STATUS.md
            </Link>
            . Opik cloud observability is Not implemented — local JSONL is the trace store.
          </p>
        </div>
      </section>

      <section className="border-border border-t px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-2xl font-medium tracking-tight md:text-3xl">
            Provenance
          </h2>
          <ul className="text-muted-foreground space-y-3 text-base leading-relaxed">
            <li>
              Package tests + CI coverage floor on{" "}
              <code className="text-foreground/90">techtide-swarm {CORE_PACKAGE_VERSION}</code>
            </li>
            <li>BashSecurityGate — 13 pattern rules, 33 scenario cases</li>
            <li>
              Apache-2.0 · PyPI{" "}
              <Link
                href={`https://pypi.org/project/techtide-swarm/${CORE_PACKAGE_VERSION}/`}
                className="underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                techtide-swarm {CORE_PACKAGE_VERSION}
              </Link>
            </li>
            <li>
              Built by{" "}
              <Link
                href="https://techtide.ai"
                className="underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                TechTide AI
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
