// file: components/interactive-art-panel.tsx
// description: Hero-style art panel with dither cursor trail and hover parallax
// reference: components/dither-cursor.tsx, components/hero.tsx

"use client";

import DitherCursor from "@/components/dither-cursor";
import { easeOut } from "@/lib/motion";
import { motion } from "motion/react";
import { useEffect, useState, type MouseEvent, type ReactNode } from "react";

interface InteractiveArtPanelProps {
  image: string;
  label: string;
  className?: string;
}

export function InteractiveArtPanel({
  image,
  label,
  className = "",
}: InteractiveArtPanelProps): ReactNode {
  const [is_hovered, set_is_hovered] = useState(false);
  const [is_mobile, set_is_mobile] = useState(true);
  const [offset, set_offset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const check_mobile = () => set_is_mobile(window.innerWidth < 768);
    check_mobile();
    window.addEventListener("resize", check_mobile);
    return () => window.removeEventListener("resize", check_mobile);
  }, []);

  function handle_mouse_move(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    set_offset({ x: x * 16, y: y * 16 });
  }

  function handle_mouse_leave() {
    set_is_hovered(false);
    set_offset({ x: 0, y: 0 });
  }

  return (
    <div
      className={`relative min-h-56 overflow-hidden rounded-xl md:min-h-full ${className}`}
      onMouseEnter={() => set_is_hovered(true)}
      onMouseMove={handle_mouse_move}
      onMouseLeave={handle_mouse_leave}
    >
      {!is_mobile && is_hovered ? (
        <DitherCursor position="absolute" opacity={0.45} intensity={0.65} radius={0.09} />
      ) : null}

      <motion.div
        className="absolute inset-[-8%] bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url(${image})` }}
        animate={{
          scale: is_hovered ? 1.06 : 1,
          x: offset.x,
          y: offset.y,
        }}
        transition={{ duration: 0.45, ease: easeOut }}
        role="img"
        aria-label={label}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-muted via-muted/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/25 via-transparent to-transparent opacity-80" />

      <div className="relative z-10 flex h-full min-h-56 items-end p-5 md:min-h-0 md:p-6">
        <span className="inline-block rounded-[3.5px] bg-black/55 px-3 py-1.5 text-sm font-medium tracking-tight text-white backdrop-blur-sm">
          {label}
        </span>
      </div>
    </div>
  );
}
