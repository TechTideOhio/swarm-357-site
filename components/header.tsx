// file: components/header.tsx
// description: Fixed site header with responsive mega-menu and mobile full-screen sheet
// reference: lib/ui-classes.ts, lib/use-body-scroll-lock.ts, lib/use-focus-trap.ts

"use client";

import { siteConfig } from "@/lib/config";
import { contributor_links, github_social, header_menu_cards } from "@/lib/navigation";
import { easeInOut, easeOut, overlayFade, overlayFadeTransition, spring, useReducedMotion } from "@/lib/motion";
import {
  chrome_icon_circle,
  chrome_overlay,
  chrome_primary_cta,
  chrome_secondary_cta,
  touch_target,
} from "@/lib/ui-classes";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import React, {
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const DESKTOP_BREAKPOINT = 700;
const MOBILE_SHEET_BREAKPOINT = 640;

function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => true
  );
}

function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
}

function useIsMobileSheet(): boolean {
  return !useMediaQuery(`(min-width: ${MOBILE_SHEET_BREAKPOINT}px)`);
}

function HamburgerIcon({ isOpen }: { isOpen: boolean }): ReactNode {
  return (
    <div className="relative flex h-2.5 w-7 cursor-pointer flex-col justify-between">
      <motion.span
        className="block h-0.5 w-full origin-center rounded-full bg-current"
        animate={isOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.4, ease: easeOut }}
      />
      <motion.span
        className="block h-0.5 w-full origin-center rounded-full bg-current"
        animate={isOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.4, ease: easeOut }}
      />
    </div>
  );
}

function GitHubIcon({ className }: { className?: string }): ReactNode {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function MenuCard({ card }: { card: (typeof header_menu_cards)[number] }): ReactNode {
  return (
    <motion.div
      className="bg-menu-card min-h-50 rounded-2xl p-6 min-[1080px]:min-h-80"
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: easeOut },
        },
      }}
    >
      <span className="text-background/50 text-xs font-medium tracking-widest uppercase">
        {card.title}
      </span>

      {card.id === "contact" && (
        <div className="mt-6 flex h-[calc(100%-2rem)] flex-col justify-between pb-4">
          <Link
            href="/docs/resources/contributing"
            className="text-background hover:text-background/70 focus-ring text-xl font-semibold transition-colors active:opacity-80 md:text-2xl"
          >
            Contributing
          </Link>
          <div className="mt-auto flex flex-col gap-4 pt-8">
            <div className="flex items-center gap-4">
              <a
                href={github_social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${chrome_icon_circle} bg-background/10 text-background hover:bg-background/20`}
                aria-label={github_social.ariaLabel}
              >
                <GitHubIcon className="h-5 w-5" />
              </a>
            </div>
            <div className="flex flex-col gap-2 text-sm text-background/70">
              <span className="font-semibold text-background/50 uppercase tracking-widest text-xs">Contributors</span>
              {contributor_links.map((contributor) => (
                <a
                  key={contributor.href}
                  href={contributor.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring hover:text-background hover:underline transition-colors"
                >
                  {contributor.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {card.links.length > 0 && (
        <ul className="mt-6">
          {card.links.map((link, index) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="group text-background hover:text-background/70 focus-ring flex min-h-11 items-center justify-between py-4 text-xl font-semibold transition-all duration-300 active:opacity-80 md:text-2xl"
              >
                <span className="flex items-center gap-3 transition-transform duration-300 group-hover:translate-x-1 group-active:translate-x-0.5">
                  {link.label}
                  {link.badge && (
                    <span className="bg-accent rounded px-2 py-0.5 text-xs font-medium text-black uppercase">
                      {link.badge}
                    </span>
                  )}
                </span>
                <ArrowUpRight className="h-5 w-5 opacity-50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-active:opacity-100" />
              </Link>
              {index < card.links.length - 1 && <div className="bg-background/10 h-px" />}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

function MobileSignUpButton(): ReactNode {
  return (
    <motion.div
      className="col-span-full flex flex-col items-stretch justify-center gap-3 pt-2 sm:flex-row sm:items-center"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: easeOut },
        },
      }}
    >
      <Link
        href="/docs/getting-started/quickstart"
        className={`${chrome_secondary_cta} text-background bg-background/10 min-h-12 w-full px-6 py-3 text-center text-lg sm:w-auto sm:text-xl`}
      >
        Quickstart
      </Link>
      <Link
        href={siteConfig.nav.cta.href}
        className={`${chrome_primary_cta} group relative min-h-12 w-full px-6 py-3 text-center text-lg sm:w-auto sm:text-xl`}
      >
        <span
          className="relative block h-[1.25em] overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)",
          }}
        >
          <span className="flex flex-col duration-0 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2/3 group-hover:transition-transform group-hover:duration-300">
            <span className="block leading-[1.25em]">{siteConfig.nav.cta.text}</span>
            <span className="block leading-[1.25em]">{siteConfig.nav.cta.text}</span>
            <span className="block leading-[1.25em]">{siteConfig.nav.cta.text}</span>
          </span>
        </span>
      </Link>
    </motion.div>
  );
}

function MegaMenuContent({
  cardsDelay,
}: {
  cardsDelay: number;
}): ReactNode {
  return (
    <motion.div
      className="grid grid-cols-1 gap-6 p-6 min-[1080px]:grid-cols-3"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        hidden: {
          transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
          },
        },
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: cardsDelay,
          },
        },
      }}
    >
      {header_menu_cards.map((card) => (
        <MenuCard key={card.id} card={card} />
      ))}
      <MobileSignUpButton />
    </motion.div>
  );
}

export function Header(): ReactNode {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const isDesktop = useIsDesktop();
  const isMobileSheet = useIsMobileSheet();
  const prefers_reduced_motion = useReducedMotion();
  const menu_button_ref = useRef<HTMLButtonElement>(null);
  const menu_panel_ref = useRef<HTMLDivElement>(null);
  const heightDelay = isDesktop ? 0.2 : 0;
  const cardsDelay = isDesktop ? 0.7 : 0.2;

  useBodyScrollLock(isMenuOpen);
  useFocusTrap(isMenuOpen, menu_panel_ref, menu_button_ref);

  React.useEffect(() => {
    const wrapper = document.querySelector(".h-screen.overflow-y-auto") as HTMLElement;
    if (wrapper) {
      setScrollbarWidth(wrapper.offsetWidth - wrapper.clientWidth);
    }

    const handleScroll = () => {
      const scrollY = wrapper ? wrapper.scrollTop : window.scrollY;
      setHasScrolled(scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    wrapper?.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      wrapper?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  React.useEffect(() => {
    if (!isMenuOpen) return;

    function on_key(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMenuOpen(false);
    }

    window.addEventListener("keydown", on_key);
    return () => window.removeEventListener("keydown", on_key);
  }, [isMenuOpen]);

  const nav_width =
    isMenuOpen || isMobileSheet
      ? "100%"
      : hasScrolled
        ? "56rem"
        : "42rem";

  return (
    <>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className={`${chrome_overlay} z-40`}
            initial={overlayFade.initial}
            animate={overlayFade.animate}
            exit={overlayFade.exit}
            transition={
              prefers_reduced_motion ? { duration: 0.01 } : overlayFadeTransition
            }
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <motion.header
        className="fixed top-0 left-0 z-50 flex w-full justify-center px-4 pt-4"
        style={{
          paddingRight: `calc(1rem + ${scrollbarWidth}px)`,
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.3,
          ease: easeOut,
        }}
      >
        <motion.nav
          className={`bg-foreground shadow-2xl/20 border border-neutral-200/10 flex max-w-full flex-col overflow-hidden rounded-md ${
            isMenuOpen && isMobileSheet ? "w-full" : ""
          }`}
          initial={false}
          animate={{ width: nav_width }}
          transition={{ ...spring, delay: isMenuOpen ? 0 : 0.15 }}
        >
          <div className="flex w-full items-center justify-between py-2 pr-2 pl-4">
            <Link href="/" className="focus-ring flex items-center gap-2">
              <span className="text-background text-2xl font-extrabold tracking-tight md:text-3xl">
                {siteConfig.name}
              </span>
            </Link>

            <button
              ref={menu_button_ref}
              type="button"
              className={`${touch_target} text-background/80 hover:text-background focus-ring cursor-pointer gap-2 rounded-[3.5px] px-3 hover:bg-white/10 active:bg-white/15`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="site-mega-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <HamburgerIcon isOpen={isMenuOpen} />
              <span className="text-xl font-medium tracking-tight">Menu</span>
            </button>
          </div>

          <AnimatePresence>
            {isMenuOpen && !isMobileSheet && (
              <motion.div
                id="site-mega-menu"
                ref={menu_panel_ref}
                className="overflow-hidden"
                style={{ maxHeight: "calc(100dvh - 6rem)" }}
                initial={{ height: 0 }}
                animate={{
                  height: "auto",
                  transition: {
                    duration: 0.5,
                    ease: easeInOut,
                    delay: heightDelay,
                  },
                }}
                exit={{
                  height: 0,
                  transition: { duration: 0.4, ease: easeInOut },
                }}
              >
                <div
                  className="scrollbar-fluid max-h-[calc(100dvh-6rem)] overflow-y-auto"
                  data-lenis-prevent
                >
                  <MegaMenuContent cardsDelay={cardsDelay} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && isMobileSheet && (
          <motion.div
            id="site-mega-menu"
            ref={menu_panel_ref}
            className="bg-foreground fixed inset-0 z-[45] flex h-[100dvh] w-full flex-col pt-[4.5rem]"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: easeOut }}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <div
              className="scrollbar-fluid flex-1 overflow-y-auto overscroll-contain"
              data-lenis-prevent
            >
              <MegaMenuContent cardsDelay={cardsDelay} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
