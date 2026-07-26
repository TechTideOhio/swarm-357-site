"use client";

import { howItWorksConfig } from "@/lib/config";
import { fadeInUpView } from "@/lib/motion";
import { chrome_card_shell, chrome_quiet_link, interactive_card } from "@/lib/ui-classes";
import { Download, Layers, Terminal } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

const steps = [
  {
    icon: Download,
    title: "Install the package",
    description:
      "pip install techtide-swarm==0.2.2. The wheel ships the compact 357-agent roster and soul templates so swarm boot works out of the box.",
  },
  {
    icon: Layers,
    title: "Boot the roster",
    description:
      "swarm boot expands six business layers plus management meta-agents, with per-layer budgets and model preferences.",
  },
  {
    icon: Terminal,
    title: "Run a real task",
    description:
      "swarm run routes through the Conductor, executes role agents with tools, and reports cost and latency you can show FinOps.",
  },
];

function StepCard({
  step,
  index,
}: {
  step: (typeof steps)[0];
  index: number;
}): ReactNode {
  const Icon = step.icon;

  return (
    <motion.div
      className={`${chrome_card_shell} ${interactive_card} flex min-h-70 flex-col p-6 hover:border-accent/30 md:p-8`}
      {...fadeInUpView}
      transition={{ ...fadeInUpView.transition, delay: index * 0.1 }}
    >
      <div className="text-foreground mb-6">
        <Icon className="h-12 w-12" strokeWidth={1} />
      </div>
      <h3 className="mb-3 text-xl font-medium tracking-tight md:text-2xl mt-auto">
        {step.title}
      </h3>
      <p className="text-muted-foreground text-base leading-relaxed">
        {step.description}
      </p>
    </motion.div>
  );
}

export function HowItWorks(): ReactNode {
  return (
    <section id="how-it-works" className="bg-background px-6 py-16 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div className="mb-8 text-center md:mb-16" {...fadeInUpView}>
          <h2 className="text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
            {howItWorksConfig.title}
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-base md:text-lg">
            {howItWorksConfig.description}
          </p>
          <Link href={howItWorksConfig.cta.href} className={`${chrome_quiet_link} mt-6 inline-block`}>
            {howItWorksConfig.cta.text}
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {steps.map((step, index) => (
            <StepCard key={step.title} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
