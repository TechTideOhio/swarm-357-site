// file: components/blog/blog-cover.tsx
// description: Full-bleed blog cover image with the hero gradient treatment and optional eyebrow
// reference: components/hero.tsx, lib/motion.tsx, DESIGN.md

"use client";

import { easeOut, useReducedMotion } from "@/lib/motion";
import { motion } from "motion/react";
import type { ReactNode } from "react";

interface BlogCoverProps {
  src: string;
  alt: string;
  eyebrow?: string | undefined;
  /** Listing cards sit in a grid and use a shorter frame than the post hero. */
  size?: "card" | "hero";
  priority?: boolean;
}

const FRAME = {
  card: "aspect-[1200/630] rounded-xl",
  hero: "aspect-[1200/630] rounded-2xl",
} as const;

export function BlogCover({
  src,
  alt,
  eyebrow,
  size = "hero",
  priority = false,
}: BlogCoverProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={prefersReducedMotion ? { duration: 0.01 } : { duration: 0.7, ease: easeOut }}
      className={`border-border relative w-full overflow-hidden border bg-black ${FRAME[size]}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={1200}
        height={630}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      <div className="bg-accent absolute inset-x-0 bottom-0 h-1" />
      {eyebrow ? (
        <span className="absolute bottom-4 left-4 z-10 inline-block rounded-[3.5px] bg-black/55 px-3 py-1.5 text-sm font-medium tracking-tight text-white backdrop-blur-sm">
          {eyebrow}
        </span>
      ) : null}
    </motion.div>
  );
}
