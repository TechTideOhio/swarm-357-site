"use client";

import { finalCtaConfig } from "@/lib/config";
import { easeOut, fadeInUpView } from "@/lib/motion";
import {
  chrome_arrow_cta,
  chrome_arrow_cta_badge,
} from "@/lib/ui-classes";
import { ChevronRightIcon } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import DitherCursor from "./dither-cursor";

export function FinalCTA(): ReactNode {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="px-6 py-24 md:py-36">
      <motion.div
        className="bg-accent relative mx-auto max-w-6xl overflow-hidden rounded-3xl px-6 py-12 text-center text-black md:rounded-4xl md:px-12 md:py-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: easeOut }}
      >
        {!isMobile && (
          <DitherCursor
            color="#000000"
            radius={0.1}
            opacity={0.1}
            position="absolute"
          />
        )}

        <div className="relative z-10">
          <motion.h2
            className="mx-auto mb-6 max-w-2xl text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl"
            {...fadeInUpView}
            transition={{ ...fadeInUpView.transition, delay: 0.1 }}
          >
            {finalCtaConfig.headline}
          </motion.h2>

          <motion.p
            className="mx-auto mb-10 max-w-md text-lg text-black/70"
            {...fadeInUpView}
            transition={{ ...fadeInUpView.transition, delay: 0.2 }}
          >
            {finalCtaConfig.description}
          </motion.p>

          <motion.a
            href={finalCtaConfig.cta.href}
            className={`${chrome_arrow_cta} w-full bg-white text-black shadow-lg shadow-black/10 hover:bg-white/90 hover:shadow-xl hover:shadow-black/20 sm:w-auto`}
            {...fadeInUpView}
            transition={{ ...fadeInUpView.transition, delay: 0.3 }}
          >
            <span>{finalCtaConfig.cta.text}</span>
            <span className={`${chrome_arrow_cta_badge} bg-accent text-black`}>
              <ChevronRightIcon className="relative left-px h-4 w-4" />
            </span>
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
