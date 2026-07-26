"use client";

import { pricingConfig } from "@/lib/config";
import { fadeInUpView } from "@/lib/motion";
import {
  chrome_arrow_cta,
  chrome_arrow_cta_badge,
  chrome_quiet_link,
  interactive_card,
} from "@/lib/ui-classes";
import { Check, ChevronRightIcon } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

interface Plan {
  name: string;
  tagline: string;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
}

const plans: Plan[] = [
  {
    name: "Open Source",
    tagline: "Full swarm package, bring your own keys",
    price: "$0",
    period: "forever",
    features: [
      "357 agent templates",
      "swarm CLI (init, demo, status, cost, run)",
      ".swarm/ flat-file memory",
      "Memvid .mv2 via optional bridge (crates.io)",
      "BashSecurityGate (13 rules)",
      "CostController and budget caps",
      "Local JSONL traces (Opik cloud not implemented)",
      "Apache-2.0 license",
    ],
  },
  {
    name: "Enterprise Controls",
    tagline: "Priority support + architecture review",
    price: "Custom",
    period: "year",
    highlighted: true,
    features: [
      "Everything in Open Source",
      "Priority issue triage",
      "Architecture review session",
      "Migration / hardening guidance",
      "Encrypted capsules (.mv2e) path advice",
      "Production auth and deploy review",
    ],
  },
];

function PlanCard({ plan }: { plan: Plan }): ReactNode {
  return (
    <motion.div
      className={`interactive-card rounded-2xl border p-6 shadow-2xl/20 md:p-8 ${
        plan.highlighted
          ? "glow-accent-subtle border-accent bg-background hover:bg-background/80"
          : "border-neutral-200/10 bg-background hover:border-accent/30 hover:bg-background/80"
      } ${interactive_card}`}
      {...fadeInUpView}
    >
      <div className="mb-6">
        <h3 className="text-lg font-medium tracking-tight">{plan.name}</h3>
        <p className="text-muted-foreground text-sm">{plan.tagline}</p>
      </div>

      <div className="mb-8 flex items-baseline gap-1">
        <span className="text-4xl font-medium tracking-tight md:text-5xl">
          {plan.price}
        </span>
        <span className="text-muted-foreground text-sm">/ {plan.period}</span>
      </div>

      <ul className="space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm">
            <Check className="text-foreground mt-0.5 h-4 w-4 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function Pricing(): ReactNode {
  const freePlan = plans[0];
  const proPlan = plans[1];

  if (!freePlan || !proPlan) {
    return null;
  }

  return (
    <section className="bg-muted px-6 py-16 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div className="mb-12 text-center md:mb-16" {...fadeInUpView}>
          <h2 className="mb-4 text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
            Open-Core Pricing
          </h2>
          <p className="text-muted-foreground text-lg">
            Open-source agent harness and memory bridge. Bring your own Anthropic
            keys and hosting.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
          <div className="md:mt-16">
            <PlanCard plan={freePlan} />
          </div>

          <div>
            <PlanCard plan={proPlan} />
          </div>
        </div>

        <motion.div
          className="mt-12 flex flex-col items-center gap-4 md:mt-16"
          {...fadeInUpView}
          transition={{ ...fadeInUpView.transition, delay: 0.2 }}
        >
          <a
            href={pricingConfig.cta.primary.href}
            className={`${chrome_arrow_cta} bg-accent relative w-full text-black sm:w-auto`}
          >
            <span>{pricingConfig.cta.primary.text}</span>
            <span className={`${chrome_arrow_cta_badge} bg-white text-black`}>
              <ChevronRightIcon className="relative left-px h-4 w-4" />
            </span>
          </a>
          <a href={pricingConfig.cta.secondary.href} className={chrome_quiet_link}>
            {pricingConfig.cta.secondary.text}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
