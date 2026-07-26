/**
 * Site Configuration
 *
 * Central configuration file for easy customization.
 * Update these values to personalize your template.
 */

/** Landing release train — keep in lockstep with package.json version. */
export const SITE_VERSION = "0.2.2" as const;

/** Core PyPI package this landing is built against. */
export const CORE_PACKAGE_VERSION = "0.2.2" as const;

export const siteConfig = {
  name: "Swarm 357",
  tagline: "Layered agents. Durable memory. Observable runs.",
  description:
    "357 Claude agents across six business layers—sales, support, marketing, SEO, research, and operations—backed by portable Memvid memory and a Claude Code–native workflow.",
  url: "https://swarm357fe.up.railway.app",
  siteVersion: SITE_VERSION,
  corePackageVersion: CORE_PACKAGE_VERSION,
  social: {
    twitter: "@techtide",
    github: "https://github.com/TechTideOhio/swarm-357",
  },
  nav: {
    cta: {
      text: "Get the repo",
      href: "https://github.com/TechTideOhio/swarm-357",
    },
    signIn: {
      text: "Status",
      href: "https://github.com/TechTideOhio/swarm-357/blob/main/STATUS.md",
    },
  },
} as const;

export const heroConfig = {
  headline: {
    prefix: "Run the",
    accent: "Swarm",
    /** Second line — keep short so the hero stays two lines, not a full-width sentence. */
    suffix: "agents that actually ship",
  },
  description:
    "Layered specialists, portable memory, and honest cost controls — without pretending three hundred agents replace governance.",
  cta: {
    primary: {
      text: "Install techtide-swarm 0.2.2",
      href: "https://pypi.org/project/techtide-swarm/0.2.2/",
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
    text: "Read STATUS.md",
    href: "https://github.com/TechTideOhio/swarm-357/blob/main/STATUS.md",
  },
} as const;

export const featuresConfig = {
  title: "Built for Claude Code",
  description:
    "Core runtime (Python + Memvid bridge) lives in swarm-357; this site is the separate Next.js product surface—so memory, hooks, and UI ship on independent release trains.",
} as const;

export const statsConfig = {
  title: "Designed for scale",
  description: "Six business layers plus management meta-agents—templates and tests matter more than raw headcount.",
} as const;

export const testimonialsConfig = {
  title: "Use-case scenarios",
} as const;

export const pricingConfig = {
  title: "Pricing",
  description: "Open-core agent harness and memory bridge—bring your own Anthropic keys and hosting.",
  cta: {
    primary: {
      text: "View on GitHub",
      href: "https://github.com/TechTideOhio/swarm-357",
    },
    secondary: {
      text: "Enterprise controls",
      href: "https://github.com/TechTideOhio/swarm-357/blob/main/docs/ENTERPRISE_CONTROLS.md",
    },
  },
} as const;

export const faqConfig = {
  title: "Common Questions",
  contact: {
    text: "Still have questions? Open an issue on GitHub.",
    cta: {
      text: "Get in Touch",
      href: "https://github.com/TechTideOhio/swarm-357/issues",
    },
  },
} as const;

export const finalCtaConfig = {
  headline: "Ready to wire durable memory into your agent mesh?",
  description:
    "Clone the repo, pip install the techtide-swarm package, optional-build the Memvid bridge, and point your Claude Code session at CLAUDE.md.",
  cta: {
    text: "Start with swarm init",
    href: "https://github.com/TechTideOhio/swarm-357",
  },
} as const;

export const footerConfig = {
  description:
    "Swarm 357 pairs layered business agents with Memvid single-file memory and honest cost surfaces—so your GitHub story matches what security and FinOps reviewers can verify.",
  cta: {
    text: "Documentation",
    href: "https://github.com/TechTideOhio/swarm-357/blob/main/STATUS.md",
  },
  links: {
    product: [
      { label: "Python package", href: "https://github.com/TechTideOhio/swarm-357/tree/main/packages/techtide-swarm" },
      { label: "Memvid bridge", href: "https://github.com/TechTideOhio/swarm-357/tree/main/packages/memvid-swarm-bridge" },
      { label: "STATUS", href: "https://github.com/TechTideOhio/swarm-357/blob/main/STATUS.md" },
      { label: "VERIFY", href: "https://github.com/TechTideOhio/swarm-357/blob/main/docs/VERIFY.md" },
      { label: "Enterprise controls", href: "https://github.com/TechTideOhio/swarm-357/blob/main/docs/ENTERPRISE_CONTROLS.md" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Changelog", href: "https://github.com/TechTideOhio/swarm-357/blob/main/CHANGELOG.md" },
      { label: "Evals", href: "https://github.com/TechTideOhio/swarm-357/blob/main/docs/EVALS.md" },
      { label: "Contributing", href: "https://github.com/TechTideOhio/swarm-357/blob/main/CONTRIBUTING.md" },
    ],
  },
  contact: {
    location: "Remote",
    address: "",
    hours: "",
    email: "https://github.com/TechTideOhio/swarm-357/issues",
  },
  copyright: `© ${new Date().getFullYear()} TechTide Swarm 357 · landing ${SITE_VERSION} · techtide-swarm ${CORE_PACKAGE_VERSION}`,
} as const;

/**
 * Feature Flags
 *
 * Toggle features on/off for easy customization.
 */
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
