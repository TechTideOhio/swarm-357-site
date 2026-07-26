"use client";

import { easeOut } from "@/lib/motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface Testimonial {
  title: string;
  description: string;
  name: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    title: "Replaced Our Entire Outreach Stack",
    description:
      "We pointed the Sales layer at our CRM exports and got cold emails, follow-ups, and battlecards out of a single swarm run. Budget caps kept costs predictable from day one.",
    name: "Jordan Lee",
    role: "Revenue Ops, Series B SaaS",
  },
  {
    title: "Memory That Actually Persists",
    description:
      "The .mv2 memory store means agents recall last week's research without re-running prompts. We migrated from flat files with one CLI command and never looked back.",
    name: "Priya Venkatesh",
    role: "AI Engineering Lead",
  },
  {
    title: "Security Review Was Painless",
    description:
      "Our infosec team reviewed BashSecurityGate, the budget caps, and Memvid verify in a single afternoon. First open-source agent tool they cleared without a follow-up.",
    name: "Thomas Gruber",
    role: "CISO, Fintech Startup",
  },
  {
    title: "CLAUDE.md Is the Killer Feature",
    description:
      "Load one file and Claude Code understands the whole swarm — layers, CLI, memory, bridge. Onboarding new engineers takes an hour instead of a week.",
    name: "Maya Okonkwo",
    role: "Platform Engineer",
  },
  {
    title: "UltraPlan Saved Our Offsite",
    description:
      "We fed our quarterly goals into swarm plan and got a phased rollout with budget estimates in fifteen minutes. The exec team used it as the actual slide deck.",
    name: "Carlos Mendez",
    role: "VP Engineering",
  },
];

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [fadeOpacity, setFadeOpacity] = useState(1);

  const updateScrollState = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const remainingScroll = maxScroll - scrollLeft;
      
      setCanScrollLeft(scrollLeft > 1);
      setCanScrollRight(scrollLeft < maxScroll - 1);
      
      // Fade out the gradient when approaching the end (last 150px of scroll)
      const fadeThreshold = 150;
      setFadeOpacity(Math.min(1, remainingScroll / fadeThreshold));
    }
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }
    updateScrollState();
    container.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);
    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const cardWidth = container.children[0]
        ? (container.children[0] as HTMLElement).offsetWidth
        : 400;
      const gap = 24;
      const stride = cardWidth + gap;
      const currentScroll = container.scrollLeft;
      const currentIndex = Math.round(currentScroll / stride);

      const targetIndex =
        direction === "left"
          ? Math.max(0, currentIndex - 1)
          : Math.min(testimonials.length - 1, currentIndex + 1);

      const targetScroll = targetIndex * stride;

      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-background py-16 text-foreground overflow-hidden md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          className="mb-8 flex flex-col items-start justify-between gap-4 md:mb-16 md:flex-row md:items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: easeOut }}
        >
          <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
            What Teams Are Saying
          </h2>

          <div className="flex items-center gap-4">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-accent text-black transition-all duration-300 hover:scale-110 hover:bg-accent/80 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
              aria-label="Scroll left"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-accent text-black transition-all duration-300 hover:scale-110 hover:bg-accent/80 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
              aria-label="Scroll right"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>

        <div className="relative -mx-6 md:mx-0">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-6 md:px-0"
            style={{ scrollPaddingInline: "1.5rem" }}
          >
            {testimonials.map((item, index) => (
              <div
                key={index}
                className="bg-muted flex h-112.5 w-[calc(100vw-3rem)] flex-none snap-start flex-col justify-between rounded-2xl border border-neutral-200/10 p-8 shadow-2xl/20 md:w-100 md:p-10"
              >
                <h3 className="text-3xl md:text-4xl font-medium leading-[1.1] tracking-tight">
                  {item.title}
                </h3>
                <div>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    {item.description}
                  </p>
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            className="pointer-events-none absolute right-0 top-0 h-full w-32 transition-opacity duration-300 hidden md:block"
            style={{
              opacity: fadeOpacity,
              background: "linear-gradient(to right, transparent, var(--background))",
            }}
          />
        </div>
      </div>
    </section>
  );
}
