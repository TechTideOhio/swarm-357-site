"use client";

import { featuresConfig, siteConfig } from "@/lib/config";
import { easeOut } from "@/lib/motion";
import { ChevronRightIcon } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

interface Feature {
  number: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    number: "01",
    title: "Layered orchestration",
    description:
      "Six business layers -- Sales, Support, Marketing, SEO, Research, Operations -- plus Management meta-agents. Pre-defined roles, not blank-slate prompts.",
  },
  {
    number: "02",
    title: "Durable .mv2 memory",
    description:
      "Replace flat-file context with portable Memvid capsules. WAL-based crash safety, full-text and vector search, integrity verification -- no database server required.",
  },
  {
    number: "03",
    title: "Honest cost surfaces",
    description:
      "Per-agent budget caps enforced at runtime, per-layer cost controllers, and a swarm cost CLI. Know what you spend before production reviewers ask.",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}): ReactNode {
  return (
    <motion.div
      className="bg-muted grid grid-cols-1 gap-2 overflow-hidden rounded-2xl border border-neutral-200/10 p-2 shadow-2xl/20 transition-colors duration-300 ease-out hover:bg-muted/80 md:grid-cols-2"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: easeOut,
      }}
    >
      <div className="px-4 py-28">
        <span className="text-muted-foreground bg-foreground/5 mb-4 block w-fit rounded-[3.5px] px-2 py-1 text-sm font-medium tracking-tight transition-colors duration-300 ease-out">
          {feature.number}
        </span>
        <h3 className="mb-4 text-2xl font-medium tracking-tight md:text-3xl">
          {feature.title}
        </h3>
        <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

export function Features(): ReactNode {
  return (
    <section className="bg-background px-6 py-16 md:py-32">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
        <motion.div
          className="lg:sticky lg:top-60 lg:w-96 lg:shrink-0"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: easeOut }}
        >
          <h2 className="mb-4 text-2xl font-medium tracking-tight md:mb-6 md:text-3xl lg:text-4xl">
            {featuresConfig.title}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-sm text-base md:mb-8 md:text-lg">
            {featuresConfig.description}
          </p>
          <a
            href={siteConfig.social.github}
            className="group bg-accent inline-flex w-full items-center justify-center gap-3 rounded-[3.5px] py-3 pr-3 pl-4 font-medium tracking-tight text-black transition-all duration-500 ease-out hover:rounded-[50px] sm:w-auto"
          >
            <span>View on GitHub</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-all duration-300 ease-out group-hover:scale-110">
              <ChevronRightIcon className="relative left-px h-4 w-4" />
            </span>
          </a>
        </motion.div>

        <div className="flex min-w-0 flex-1 flex-col gap-6 md:gap-32">
          {features.map((feature, index) => (
            <FeatureCard key={feature.number} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
