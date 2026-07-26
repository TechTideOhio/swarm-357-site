/**
 * Site Configuration
 *
 * Central configuration file for easy customization.
 * Update these values to personalize your template.
 */

import { GITHUB_URL } from "@/lib/site-url";
import { footer_links, nav_cta } from "@/lib/navigation";

/** Landing release train - keep in lockstep with package.json version. */
export const SITE_VERSION = "0.2.2" as const;

/** Core PyPI package this landing is built against. */
export const CORE_PACKAGE_VERSION = "0.2.2" as const;

export const siteConfig = {
  name: "Swarm 357",
  tagline: "Layered agents. Durable memory. Observable runs.",
  description:
    "357 Claude agents across six business layers: sales, support, marketing, SEO, research, and operations, backed by portable Memvid memory and a Claude Code native workflow.",
  siteVersion: SITE_VERSION,
  corePackageVersion: CORE_PACKAGE_VERSION,
  social: {
    github: GITHUB_URL,
  },
  nav: {
    cta: nav_cta,
  },
} as const;

export const heroConfig = {
  headline: {
    prefix: "Run the",
    accent: "Swarm",
    suffix: "agents that actually ship",
  },
  description:
    "Layered specialists, portable memory, and honest cost controls, without pretending three hundred agents replace governance.",
  cta: {
    primary: {
      text: `Install techtide-swarm ${CORE_PACKAGE_VERSION}`,
      href: "/docs/getting-started/installation",
    },
    secondary: {
      text: "See how it works",
      href: "#how-it-works",
    },
  },
  carousel: [
    "Sales plays",
    "Support macros",
    "Campaign briefs",
    "SEO clusters",
    "Research packs",
    "Ops runbooks",
    "Memvid recall",
    "Local traces",
    "Budget caps",
    "Bash policy gate",
    "Layer health",
    "UltraPlan",
  ],
} as const;

export const howItWorksConfig = {
  title: "Acquire, orchestrate, remember, observe",
  description:
    "Marketing site and docs bring people in; the swarm CLI and YAML layers coordinate work; Memvid (optional Beta bridge) stores portable memory; local JSONL traces and cost reports keep production honest. Opik cloud is not implemented.",
  cta: {
    text: "Read status docs",
    href: "/docs/resources/status",
  },
} as const;

export const featuresConfig = {
  title: "Built for Claude Code",
  description:
    "Core runtime (Python + Memvid bridge) lives in swarm-357; this site is the separate Next.js product surface, so memory, hooks, and UI ship on independent release trains.",
} as const;

export const statsConfig = {
  title: "Designed for scale",
  description:
    "Six business layers plus management meta-agents. Templates and tests matter more than raw headcount.",
} as const;

export const testimonialsConfig = {
  title: "Use-case scenarios",
} as const;

export const pricingConfig = {
  title: "Pricing",
  description:
    "Open-core agent harness and memory bridge. Bring your own Anthropic keys and hosting.",
  cta: {
    primary: {
      text: "View documentation",
      href: "/docs",
    },
    secondary: {
      text: "Enterprise controls",
      href: "/docs/security/enterprise-controls",
    },
  },
} as const;

export const faqConfig = {
  title: "Common Questions",
  contact: {
    text: "Still have questions? Read the FAQ or contributing guide.",
    cta: {
      text: "Read FAQ",
      href: "/docs/resources/faq",
    },
  },
} as const;

export const finalCtaConfig = {
  headline: "Ready to wire durable memory into your agent mesh?",
  description:
    "Install techtide-swarm, optional-build the Memvid bridge, and follow the quickstart to run your first layer task.",
  cta: {
    text: "Start with swarm init",
    href: "/docs/getting-started/quickstart",
  },
} as const;

export const footerConfig = {
  description:
    "Swarm 357 pairs layered business agents with Memvid single-file memory and honest cost surfaces, so your security and FinOps reviewers can verify claims.",
  cta: {
    text: "Documentation",
    href: "/docs",
  },
  links: footer_links,
  contact: {
    location: "Remote",
    address: "",
    hours: "",
  },
  copyright: `© ${new Date().getFullYear()} TechTide Swarm 357 · landing ${SITE_VERSION} · techtide-swarm ${CORE_PACKAGE_VERSION}`,
} as const;

export const features = {
  smoothScroll: true,
  darkMode: true,
  ditherCursor: true,
  statsSection: true,
  testimonialsSection: true,
} as const;

export const apiConfig = {
  url: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
} as const;
