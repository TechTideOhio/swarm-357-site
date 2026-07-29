"use client";

import { footerConfig } from "@/lib/config";
import { footer_links, github_social, linkedin_social, publisher_links } from "@/lib/navigation";
import { fadeInUpView } from "@/lib/motion";
import {
  chrome_arrow_cta,
  chrome_arrow_cta_badge,
  chrome_icon_circle,
  content_inline_link,
} from "@/lib/ui-classes";
import { ChevronRightIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

function GitHubIcon({ className }: { className?: string }): ReactNode {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }): ReactNode {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function Footer(): ReactNode {
  return (
    <footer className="bg-accent rounded-tr-4xl rounded-tl-4xl px-6 py-8 text-black md:px-12 md:py-16 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-20">
          <motion.div className="max-w-md" {...fadeInUpView}>
            <p className="text-lg leading-relaxed text-black/80">{footerConfig.description}</p>
            <Link
              href={footerConfig.cta.href}
              className={`${chrome_arrow_cta} mt-8 bg-white shadow-lg shadow-black/10 hover:bg-white/90 hover:shadow-xl hover:shadow-black/20`}
            >
              <span>{footerConfig.cta.text}</span>
              <span className={`${chrome_arrow_cta_badge} bg-accent relative left-px text-black`}>
                <ChevronRightIcon className="relative left-px h-4 w-4" />
              </span>
            </Link>
          </motion.div>

          <div className="grid max-[400px]:grid-cols-1 grid-cols-2 gap-6 gap-y-6 lg:justify-items-end">
            <motion.div {...fadeInUpView} transition={{ ...fadeInUpView.transition, delay: 0.1 }}>
              <h4 className="mb-4 text-sm font-semibold tracking-wider text-black/50 uppercase">
                Product
              </h4>
              <ul className="space-y-3">
                {footer_links.product.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="nav-link-underline focus-ring inline-flex min-h-11 items-center text-black/80 transition-opacity duration-200 hover:text-black active:opacity-80"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div {...fadeInUpView} transition={{ ...fadeInUpView.transition, delay: 0.2 }}>
              <h4 className="mb-4 text-sm font-semibold tracking-wider text-black/50 uppercase">
                Company
              </h4>
              <ul className="space-y-3">
                {footer_links.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="nav-link-underline focus-ring inline-flex min-h-11 items-center text-black/80 transition-opacity duration-200 hover:text-black active:opacity-80"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        <div className="my-8 h-px bg-black/10 md:my-16" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-20">
          <motion.div {...fadeInUpView}>
            <h2 className="text-5xl leading-none font-medium tracking-tight md:text-6xl lg:text-7xl">
              Build with
              <br />
              Swarm 357
            </h2>
            <p className="mt-8 text-sm text-black/50">{footerConfig.copyright}</p>
          </motion.div>

          <div className="flex flex-col justify-between gap-8 lg:items-end lg:text-right">
            <motion.div
              className="space-y-6"
              {...fadeInUpView}
              transition={{ ...fadeInUpView.transition, delay: 0.1 }}
            >
              <div>
                <h4 className="mb-1 font-semibold">{footerConfig.contact.location}</h4>
                <p className="text-black/70">
                  <a
                    href={publisher_links.studio.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${content_inline_link} hover:text-black`}
                  >
                    {publisher_links.studio.label}
                  </a>{" "}
                  · open source Apache-2.0
                  <br />
                  Created by{" "}
                  <a
                    href={publisher_links.author.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${content_inline_link} hover:text-black`}
                  >
                    {publisher_links.author.label}
                  </a>
                </p>
              </div>
              <Link
                href="/docs/resources/contributing"
                className={`${content_inline_link} inline-block text-lg font-medium`}
              >
                Contributing guide
              </Link>
            </motion.div>

            <motion.div
              className="flex items-center gap-4 lg:justify-end"
              {...fadeInUpView}
              transition={{ ...fadeInUpView.transition, delay: 0.2 }}
            >
              <a
                href={github_social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${chrome_icon_circle} bg-black/10 text-black hover:bg-black hover:text-accent`}
                aria-label={github_social.ariaLabel}
              >
                <GitHubIcon className="h-4 w-4" />
              </a>
              <a
                href={linkedin_social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${chrome_icon_circle} bg-black/10 text-black hover:bg-black hover:text-accent`}
                aria-label={linkedin_social.ariaLabel}
              >
                <LinkedInIcon className="h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
