// file: app/about/page.tsx
// description: About page covering positioning, open source split, tech stack, evidence, and maturity
// reference: lib/eval-baseline.ts, lib/site-url.ts, lib/ui-classes.ts

import { CORE_PACKAGE_VERSION, SITE_VERSION } from "@/lib/config";
import { get_eval_baseline } from "@/lib/eval-baseline";
import { createMetadata } from "@/lib/metadata";
import { GITHUB_SITE_URL, GITHUB_URL, PYPI_URL } from "@/lib/site-url";
import {
  chrome_primary_cta,
  chrome_secondary_cta,
  content_inline_link,
} from "@/lib/ui-classes";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "About",
  description:
    "What Swarm 357 is, how the 357-agent roster works, the open source split, the stack it runs on, eval evidence, and feature maturity without the hype.",
  path: "/about",
});

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
  { feature: "Opik cloud observability", status: "Not implemented" },
];

const repositories = [
  {
    name: "TechTideOhio/swarm-357",
    href: GITHUB_URL,
    role: "Core runtime",
    detail: "Python package, Rust Memvid bridge, 357-role roster, soul templates, eval harness.",
  },
  {
    name: "TechTideOhio/swarm-357-site",
    href: GITHUB_SITE_URL,
    role: "Product surface",
    detail: "This Next.js landing page, the documentation library, and the live demo proxy.",
  },
  {
    name: "techtide-swarm on PyPI",
    href: PYPI_URL,
    role: "Distribution",
    detail: `Published wheel and source distribution for version ${CORE_PACKAGE_VERSION}.`,
  },
];

const core_stack = [
  { name: "Python 3.10+", href: "https://www.python.org/", role: "Runtime for the agent package and CLI" },
  { name: "FastAPI", href: "https://fastapi.tiangolo.com/", role: "HTTP API surface behind swarm serve" },
  { name: "Pydantic v2", href: "https://docs.pydantic.dev/", role: "Config and payload validation" },
  { name: "SQLite", href: "https://www.sqlite.org/", role: "Durable run checkpoints for inspect and resume" },
  { name: "Rust", href: "https://www.rust-lang.org/", role: "Memvid bridge binary" },
  { name: "memvid-core", href: "https://crates.io/crates/memvid-core", role: "Single-file .mv2 memory format" },
  { name: "Anthropic Claude", href: "https://docs.anthropic.com/", role: "Default model provider" },
  { name: "OpenRouter", href: "https://openrouter.ai/", role: "Alternate provider used for eval baselines" },
];

const site_stack = [
  { name: "Next.js 16", href: "https://nextjs.org/", role: "App Router, server components, static docs" },
  { name: "React 19", href: "https://react.dev/", role: "Component runtime" },
  { name: "TypeScript", href: "https://www.typescriptlang.org/", role: "Strict mode across the codebase" },
  { name: "Tailwind CSS v4", href: "https://tailwindcss.com/", role: "CSS-first tokens through @theme inline" },
  { name: "MDX", href: "https://mdxjs.com/", role: "Documentation library generated from the core repo" },
  { name: "Motion", href: "https://motion.dev/", role: "Animation presets with reduced-motion fallbacks" },
  { name: "Bun", href: "https://bun.sh/", role: "Package manager, scripts, and build" },
  { name: "Railway", href: "https://railway.app/", role: "Hosting for the frontend and the API" },
];

function StackTable({
  caption,
  rows,
}: {
  caption: string;
  rows: ReadonlyArray<{ name: string; href: string; role: string }>;
}): ReactNode {
  return (
    <div>
      <h3 className="mb-4 text-lg font-medium tracking-tight">{caption}</h3>
      <div className="divide-border border-border divide-y rounded-2xl border">
        {rows.map((row) => (
          <div
            key={row.name}
            className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
          >
            <a
              href={row.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${content_inline_link} shrink-0 text-sm font-medium`}
            >
              {row.name}
            </a>
            <span className="text-muted-foreground text-sm sm:text-right">{row.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AboutPage(): ReactNode {
  const baseline = get_eval_baseline();

  return (
    <main id="main-content" className="bg-background text-foreground flex-1">
      <section className="px-6 pt-32 pb-16 md:px-12 md:pt-40 md:pb-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-muted-foreground mb-4 text-sm font-medium tracking-widest uppercase">
            About · landing {SITE_VERSION} · techtide-swarm {CORE_PACKAGE_VERSION}
          </p>
          <h1 className="text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl">
            An organizational ontology for agents, not a headcount fantasy.
          </h1>
          <p className="text-muted-foreground mt-8 text-lg leading-relaxed md:text-xl">
            Swarm 357 is 357 distinct agent identities across six business layers plus
            management meta-agents. The Conductor routes work; budgets, bash policy, and
            portable memory are first-class. We do not claim 357 simultaneous Opus sessions.
          </p>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
            Maturity claims below mirror core{" "}
            <Link href="/docs/resources/status" className={content_inline_link}>
              status documentation
            </Link>{" "}
            against{" "}
            <Link
              href="/docs/getting-started/installation"
              className={content_inline_link}
            >
              techtide-swarm {CORE_PACKAGE_VERSION}
            </Link>
            . Acceptance checks:{" "}
            <Link href="/docs/resources/verification" className={content_inline_link}>
              verification scorecard
            </Link>
            .
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/docs/getting-started/quickstart"
              className={`${chrome_primary_cta} glow-accent`}
            >
              Get started
            </Link>
            <Link
              href="/docs/getting-started/installation"
              className={chrome_secondary_cta}
            >
              pip install techtide-swarm=={CORE_PACKAGE_VERSION}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-border border-t px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-2xl font-medium tracking-tight md:text-3xl">Open source</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Swarm 357 ships as open core under Apache-2.0. The runtime and the product surface
            live in separate public repositories on independent release trains, so memory and
            orchestration changes never wait on a marketing deploy.
          </p>
          <div className="divide-border border-border divide-y rounded-2xl border">
            {repositories.map((repo) => (
              <div key={repo.name} className="px-5 py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <a
                    href={repo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${content_inline_link} text-sm font-medium`}
                  >
                    {repo.name}
                  </a>
                  <span className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                    {repo.role}
                  </span>
                </div>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{repo.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-border border-t px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-2xl font-medium tracking-tight md:text-3xl">Tech stack</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            No hidden platform layer. Everything the runtime depends on is public, documented,
            and swappable by the operator.
          </p>
          <div className="grid gap-10 lg:grid-cols-2">
            <StackTable caption="Core runtime" rows={core_stack} />
            <StackTable caption="Product surface" rows={site_stack} />
          </div>
        </div>
      </section>

      <section className="border-border border-t px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-2xl font-medium tracking-tight md:text-3xl">Architecture</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Management conducts six domain layers. Memory (flat topics plus optional Memvid .mv2)
            and cost controls cut across every run.
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
          <h2 className="mb-4 text-2xl font-medium tracking-tight md:text-3xl">Eval evidence</h2>
          {baseline ? (
            <p className="text-muted-foreground mb-6 max-w-2xl">
              Latest baseline: {baseline.executions} executions, {baseline.passed} passed gates,
              average combined score {baseline.avg_combined_score.toFixed(3)}, $
              {baseline.spent_usd.toFixed(2)} of a ${baseline.budget_usd.toFixed(2)} hard cap on{" "}
              {baseline.provider} using {baseline.agent_model} agents with a Haiku judge.
              Single-agent {baseline.single_agent_pass}. Swarm {baseline.swarm_pass}. The
              wall-clock timeouts behind the swarm number are reported, not hidden.
            </p>
          ) : (
            <p className="text-muted-foreground mb-6 max-w-2xl">
              Baseline metrics are generated from the core repository and published on the{" "}
              <Link href="/evals" className={content_inline_link}>
                evals page
              </Link>
              .
            </p>
          )}
          <div className="bg-muted overflow-hidden rounded-2xl border border-neutral-200/10 p-4 shadow-2xl/20 md:p-8">
            <Image
              src="/assets/eval-results.svg"
              alt="Eval results by layer: singles 142/142, swarm 4/12"
              width={960}
              height={420}
              className="h-auto w-full"
              unoptimized
            />
          </div>
          <p className="text-muted-foreground mt-6 text-sm">
            These figures are read from the committed baseline rather than written by hand.
            Methodology and reproduce steps:{" "}
            <Link href="/docs/evals/methodology" className={content_inline_link}>
              eval methodology
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="border-border border-t px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-medium tracking-tight md:text-3xl">Feature maturity</h2>
          <div className="divide-border border-neutral-200/10 divide-y rounded-2xl border shadow-2xl/20">
            {maturity.map((row) => (
              <div key={row.feature} className="flex items-center justify-between gap-4 px-5 py-4">
                <span className="text-sm md:text-base">{row.feature}</span>
                <span className="bg-accent rounded px-2 py-0.5 text-xs font-medium tracking-wide text-black uppercase">
                  {row.status}
                </span>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground mt-6 text-sm">
            Source of truth:{" "}
            <Link href="/docs/resources/status" className={content_inline_link}>
              status documentation
            </Link>
            . Opik cloud observability is not implemented. Local JSONL is the trace store.
          </p>
        </div>
      </section>

      <section className="border-border border-t px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-2xl font-medium tracking-tight md:text-3xl">
            Who builds this
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Swarm 357 is built by{" "}
            <a
              href="https://techtide.ai"
              target="_blank"
              rel="noopener noreferrer"
              className={content_inline_link}
            >
              TechTide AI
            </a>
            , an automation studio that runs agent workloads in production for its own clients.
            The features that exist are the ones that survived that use: budget caps, a bash
            policy gate, durable checkpoints, and memory that outlives a process.
          </p>
          <ul className="text-muted-foreground space-y-3 text-base leading-relaxed">
            <li>
              Licensed Apache-2.0. Contributions are welcome through the{" "}
              <Link href="/docs/resources/contributing" className={content_inline_link}>
                contributing guide
              </Link>
              .
            </li>
            <li>
              The interface follows a documented{" "}
              <Link href="/docs/resources/design" className={content_inline_link}>
                design system
              </Link>
              , enforced in continuous integration.
            </li>
            <li>
              Package tests and a coverage floor run on every change to{" "}
              <code className="text-foreground/90">techtide-swarm {CORE_PACKAGE_VERSION}</code>.
            </li>
            <li>BashSecurityGate ships 13 pattern rules covered by 33 scenario cases.</li>
            <li>
              Release history is published in the{" "}
              <Link href="/changelog" className={content_inline_link}>
                changelog
              </Link>
              .
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
