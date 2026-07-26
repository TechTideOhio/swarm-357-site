"use client";

import { easeOut } from "@/lib/motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface Testimonial {
  title: string;
  description: string;
  scenario: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    title: "Sales outreach",
    description:
      "Point the Sales layer at CRM exports and draft cold emails, follow-ups, and battlecards in a single swarm run. Budget caps keep costs predictable.",
    scenario: "Use-case scenario",
    image: "/art/testimonials/outreach.png",
  },
  {
    title: "Durable memory",
    description:
      "Optional Memvid .mv2 (Beta bridge) lets agents recall prior research without re-running prompts. Flat-file topics remain the Stable default.",
    scenario: "Use-case scenario",
    image: "/art/testimonials/memory.png",
  },
  {
    title: "Security review",
    description:
      "BashSecurityGate, HITL for Bash, budget caps, and Memvid verify give reviewers concrete controls, not a blank-slate agent sandbox.",
    scenario: "Use-case scenario",
    image: "/art/testimonials/security.png",
  },
  {
    title: "CLAUDE.md onboarding",
    description:
      "Load one file and Claude Code understands the swarm: layers, CLI, memory, bridge, and STATUS maturity. Faster engineer onboarding.",
    scenario: "Use-case scenario",
    image: "/art/testimonials/claude-md.png",
  },
  {
    title: "UltraPlan planning",
    description:
      "Feed quarterly goals into swarm plan for a phased rollout with budget estimates. Useful as a planning artifact, not a substitute for human sign-off.",
    scenario: "Use-case scenario",
    image: "/art/testimonials/ultraplan.png",
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
    <section className="bg-background overflow-hidden py-16 text-foreground md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          className="mb-8 flex flex-col items-start justify-between gap-4 md:mb-16 md:flex-row md:items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: easeOut }}
        >
          <div>
            <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
              Use-case scenarios
            </h2>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              Illustrative composites of how teams use Swarm 357. Not customer
              endorsements.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="bg-accent flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-black transition-all duration-500 ease-out hover:scale-110 hover:bg-accent/80 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
              aria-label="Scroll left"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="bg-accent flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-black transition-all duration-500 ease-out hover:scale-110 hover:bg-accent/80 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
              aria-label="Scroll right"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>

        <div className="relative -mx-6 md:mx-0">
          <div
            ref={scrollRef}
            className="scrollbar-fluid flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 md:px-0"
            style={{ scrollPaddingInline: "1.5rem" }}
          >
            {testimonials.map((item) => (
              <article
                key={item.title}
                className="bg-muted flex h-auto w-[calc(100vw-3rem)] flex-none snap-start flex-col overflow-hidden rounded-2xl border border-neutral-200/10 shadow-2xl/20 md:w-100"
              >
                <div
                  className="relative h-40 w-full shrink-0 bg-cover bg-center md:h-48"
                  style={{ backgroundImage: `url(${item.image})` }}
                  role="img"
                  aria-label={`${item.title} scenario illustration`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-muted via-transparent to-transparent" />
                </div>
                <div className="flex flex-1 flex-col justify-between p-8 md:p-10">
                  <h3 className="mb-4 text-2xl font-medium leading-[1.1] tracking-tight md:text-3xl">
                    {item.title}
                  </h3>
                  <div>
                    <p className="text-muted-foreground mb-6 text-base leading-relaxed md:text-lg">
                      {item.description}
                    </p>
                    <p className="text-muted-foreground text-sm tracking-tight">
                      {item.scenario}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div
            className="pointer-events-none absolute top-0 right-0 hidden h-full w-32 transition-opacity duration-300 md:block"
            style={{
              opacity: fadeOpacity,
              background:
                "linear-gradient(to right, transparent, var(--background))",
            }}
          />
        </div>
      </div>
    </section>
  );
}
