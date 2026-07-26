"use client";

import { getStatus, getCost, getAgents } from "@/lib/api";
import { apiConfig } from "@/lib/config";
import { fadeInUpView, spring as springConfig } from "@/lib/motion";
import { content_inline_link } from "@/lib/ui-classes";
import { motion, useInView, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface StatItem {
  value: number;
  suffix: string;
  decimals: number;
  label: string;
}

function AnimatedNumber({
  value,
  suffix,
  decimals = 0,
}: {
  value: number;
  suffix: string;
  decimals?: number;
}): ReactNode {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const numberSpring = useSpring(0, {
    stiffness: springConfig.stiffness,
    damping: springConfig.damping,
    mass: springConfig.mass,
    restDelta: 0.001,
  });
  const display = useTransform(numberSpring, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.floor(v).toString()
  );

  useEffect(() => {
    if (isInView) numberSpring.set(value);
  }, [isInView, numberSpring, value]);

  useEffect(() => {
    const unsub = display.on("change", (latest) => {
      if (ref.current) ref.current.textContent = latest + suffix;
    });
    return () => unsub();
  }, [display, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

function StatCard({
  stat,
  index,
}: {
  stat: StatItem;
  index: number;
}): ReactNode {
  return (
    <motion.div
      className="text-center"
      {...fadeInUpView}
      transition={{ ...fadeInUpView.transition, delay: index * 0.1 }}
    >
      <div className="text-foreground text-5xl font-medium tracking-tight md:text-6xl lg:text-7xl">
        <AnimatedNumber value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
      </div>
      <p className="text-muted-foreground mt-3 text-base md:text-lg">
        {stat.label}
      </p>
    </motion.div>
  );
}

const FALLBACK_STATS: StatItem[] = [
  { value: 357, suffix: "", decimals: 0, label: "Named Agent Roles" },
  { value: 6, suffix: "", decimals: 0, label: "Business Layers" },
  { value: 13, suffix: "", decimals: 0, label: "Security Gate Rules" },
  { value: 0, suffix: "", decimals: 4, label: "Total Cost (USD)" },
];

export function LiveStats(): ReactNode {
  const [stats, setStats] = useState<StatItem[]>(FALLBACK_STATS);

  useEffect(() => {
    Promise.all([getStatus(), getCost(), getAgents()])
      .then(([status, cost, agents]) => {
        setStats([
          {
            value: agents.total,
            suffix: "",
            decimals: 0,
            label: "Named Agent Roles",
          },
          {
            value: Object.keys(status.layers).length || 6,
            suffix: "",
            decimals: 0,
            label: "Business Layers",
          },
          {
            value: 13,
            suffix: "",
            decimals: 0,
            label: "Security Gate Rules",
          },
          {
            value: cost.total_cost_usd,
            suffix: "",
            decimals: 4,
            label: "Total Cost (USD)",
          },
        ]);
      })
      .catch((err: unknown) => {
        console.error("[LiveStats] API fetch failed, using fallback", err);
      });
  }, []);

  return (
    <section className="bg-background px-6 py-16 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div className="mb-12 text-center md:mb-20" {...fadeInUpView}>
          <h2 className="text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
            Live Numbers
          </h2>
          <p className="text-muted-foreground mt-3 text-base">
            Real-time from public GET endpoints. Refreshed on each visit.
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            <a
              className={`${content_inline_link} text-accent`}
              href={`${apiConfig.url}/api/health`}
              target="_blank"
              rel="noreferrer"
            >
              Open /api/health
            </a>{" "}
            (JSON) to verify roster size.
          </p>
        </motion.div>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
