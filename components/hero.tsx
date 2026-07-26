// file: components/hero.tsx
// description: Full-bleed hero with two-line brand headline, art carousel, and CTAs
// reference: lib/config.ts, components/rotating-cards.tsx, components/dither-cursor.tsx

"use client";

import { CORE_PACKAGE_VERSION, heroConfig, siteConfig } from "@/lib/config";
import { easeOut } from "@/lib/motion";
import { chrome_primary_cta, chrome_secondary_cta } from "@/lib/ui-classes";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import DitherCursor from "./dither-cursor";
import RotatingCards, { type Card } from "./rotating-cards";

const CAROUSEL_ART: Record<string, string> = {
  "Sales plays": "/art/hero/sales-plays.png",
  "Support macros": "/art/hero/support-macros.png",
  "Campaign briefs": "/art/hero/campaign-briefs.png",
  "SEO clusters": "/art/hero/seo-clusters.png",
  "Research packs": "/art/hero/research-packs.png",
  "Ops runbooks": "/art/hero/ops-runbooks.png",
  "Memvid recall": "/art/hero/memvid-recall.png",
  "Local traces": "/art/hero/opik-traces.png",
  "Budget caps": "/art/hero/budget-caps.png",
  "Bash policy gate": "/art/hero/bash-policy-gate.png",
  "Layer health": "/art/hero/layer-health.png",
  UltraPlan: "/art/hero/ultraplan.png",
};

const carouselCards: Card[] = heroConfig.carousel.map((label, index) => ({
  id: index + 1,
  image: CAROUSEL_ART[label] ?? "/art/hero/sales-plays.png",
  content: (
    <div className="relative flex h-full flex-col justify-end">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      <div className="relative z-10 px-4 pb-5 pt-3">
        <span className="inline-block rounded-[3.5px] bg-black/55 px-3 py-1.5 text-sm font-medium tracking-tight text-white backdrop-blur-sm">
          {label}
        </span>
      </div>
    </div>
  ),
}));

function AnimatedLine({
  text,
  delayBase,
  className,
}: {
  text: string;
  delayBase: number;
  className?: string;
}): ReactNode {
  return (
    <span className={`block ${className ?? ""}`}>
      {text.split("").map((char, index) => (
        <motion.span
          key={`${text}-${index}`}
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{
            duration: 0.35,
            delay: delayBase + index * 0.02,
            ease: easeOut,
          }}
          className="inline-block"
          style={{ whiteSpace: char === " " ? "pre" : "normal" }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero(): ReactNode {
  const headlineRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [isMobile, setIsMobile] = useState(true);
  const opacityRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  const lineOne = `${heroConfig.headline.prefix} ${heroConfig.headline.accent}`;
  const lineTwo = heroConfig.headline.suffix;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const headline = headlineRef.current;
    if (!headline) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) setShouldRender(true);
      },
      { threshold: 0, rootMargin: "-10% 0px -10% 0px" }
    );

    observer.observe(headline);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const targetOpacity = isVisible ? 1 : 0;

    const animate = () => {
      const diff = targetOpacity - opacityRef.current;
      const step = diff * 0.02;

      if (Math.abs(diff) > 0.001) {
        opacityRef.current += step;
        setOpacity(opacityRef.current);
        animationRef.current = requestAnimationFrame(animate);
      } else {
        opacityRef.current = targetOpacity;
        setOpacity(targetOpacity);
        if (targetOpacity === 0) setShouldRender(false);
      }
    };

    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isVisible]);

  return (
    <section className="relative flex flex-col items-center justify-start overflow-hidden px-6 pt-28 sm:pt-32 md:pt-36">
      {!isMobile && shouldRender && <DitherCursor opacity={opacity} />}

      <div
        ref={headlineRef}
        className="relative z-10 mx-auto w-full max-w-3xl text-center"
      >
        <p className="text-muted-foreground mb-5 text-xs font-medium tracking-[0.2em] uppercase md:text-sm">
          {siteConfig.name}
        </p>
        <h1 className="mb-6 text-4xl font-medium leading-[1.05] tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          <AnimatedLine text={lineOne} delayBase={0} />
          <AnimatedLine text={lineTwo} delayBase={0.35} className="mt-1" />
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: easeOut }}
          className="text-muted-foreground mx-auto max-w-xl text-base leading-relaxed tracking-tight md:text-lg"
        >
          {heroConfig.description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.95, ease: easeOut }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link href={heroConfig.cta.primary.href} className={`${chrome_primary_cta} glow-accent`}>
            {heroConfig.cta.primary.text}
          </Link>
          <Link href={heroConfig.cta.secondary.href} className={chrome_secondary_cta}>
            {heroConfig.cta.secondary.text}
          </Link>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1, ease: easeOut }}
          className="text-muted-foreground mt-4 text-xs tracking-tight"
        >
          Landing {siteConfig.siteVersion} · techtide-swarm {CORE_PACKAGE_VERSION}
        </motion.p>
      </div>

      <div
        className="relative -mx-6 mt-4 h-56 w-full max-w-[100vw] overflow-hidden sm:mt-6 sm:h-72 md:h-80 lg:h-96 xl:h-[26rem]"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 62%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 62%, transparent 100%)",
        }}
      >
        <div className="absolute left-1/2 top-0 -translate-x-1/2">
          <div className="origin-top scale-[0.55] sm:scale-[0.65] lg:scale-[0.8] xl:scale-100">
            <RotatingCards
              cards={carouselCards}
              radius={1000}
              cardClassName="rounded-md border-neutral-200/10"
              cardWidth={350}
              cardHeight={275}
              duration={100}
              pauseOnHover={true}
              autoPlay={true}
              initialRotation={-90}
              showTrackLine={true}
              trackLineOffset={25}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
