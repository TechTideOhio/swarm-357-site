// file: lib/navigation.ts
// description: Canonical internal navigation links and the single external GitHub social target
// reference: lib/site-url.ts, components/header.tsx, components/footer.tsx

import { GITHUB_URL } from "@/lib/site-url";

export interface NavLink {
  label: string;
  href: string;
  badge?: string | null;
}

export interface MenuCard {
  id: string;
  title: string;
  links: NavLink[];
}

/** Only external URL permitted in site navigation chrome. */
export const github_social = {
  label: "GitHub",
  href: GITHUB_URL,
  ariaLabel: "Swarm 357 on GitHub",
} as const;

export const header_menu_cards: MenuCard[] = [
  {
    id: "products",
    title: "PRODUCT",
    links: [
      { label: "Installation", href: "/docs/getting-started/installation", badge: null },
      { label: "Try it live", href: "#try-it-live", badge: "LIVE" },
      { label: "HTTP API docs", href: "/docs/api/overview", badge: null },
    ],
  },
  {
    id: "resources",
    title: "RESOURCES",
    links: [
      { label: "About", href: "/about", badge: null },
      { label: "Documentation", href: "/docs", badge: null },
      { label: "Status", href: "/docs/resources/status", badge: null },
      { label: "Verification", href: "/docs/resources/verification", badge: null },
      { label: "Security", href: "/docs/security/security-model", badge: null },
      { label: "Evals", href: "/evals", badge: null },
      { label: "Changelog", href: "/changelog", badge: null },
      { label: "Blog", href: "/blog", badge: null },
    ],
  },
  {
    id: "contact",
    title: "CONTACT",
    links: [],
  },
];

export const footer_links = {
  product: [
    { label: "Installation", href: "/docs/getting-started/installation" },
    { label: "Memvid bridge", href: "/docs/guides/memvid-bridge" },
    { label: "Status", href: "/docs/resources/status" },
    { label: "Verification", href: "/docs/resources/verification" },
    { label: "Enterprise controls", href: "/docs/security/enterprise-controls" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Changelog", href: "/changelog" },
    { label: "Evals", href: "/evals" },
    { label: "Blog", href: "/blog" },
    { label: "Contributing", href: "/docs/resources/contributing" },
  ],
} as const;

export const nav_cta = {
  text: "Documentation",
  href: "/docs",
} as const;
