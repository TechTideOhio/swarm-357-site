import type { Metadata } from "next";
import type { AlternateLinkDescriptor } from "next/dist/lib/metadata/types/alternative-urls-types";
import { siteConfig as appSiteConfig } from "@/lib/config";
import { SITE_URL } from "@/lib/site-url";

export const siteConfig = {
  name: appSiteConfig.name,
  tagline: appSiteConfig.tagline,
  description: appSiteConfig.description,
  url: SITE_URL,
  creator: "TechTide AI",
  authors: [
    {
      name: "TechTide AI",
      url: SITE_URL,
    },
  ],
  keywords: [
    "AI agents",
    "multi-agent",
    "Claude",
    "Swarm 357",
    "Memvid",
    "agent orchestration",
    "TechTide",
    "techtide-swarm",
    "agent documentation",
  ],
} as const;

/** Feed autodiscovery. Repeated on every page so readers can subscribe anywhere. */
function rss_alternate(): Record<string, AlternateLinkDescriptor[]> {
  return { "application/rss+xml": [{ url: "/feed.xml", title: "Swarm 357 blog" }] };
}

function og_image_url(title: string, subtitle?: string): string {
  const params = new URLSearchParams({ title });
  if (subtitle) params.set("subtitle", subtitle);
  return `/api/og?${params.toString()}`;
}

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [...siteConfig.authors],
  creator: siteConfig.creator,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
    types: rss_alternate(),
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: siteConfig.creator,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
  },
  manifest: "/site.webmanifest",
};

export function createMetadata({
  title,
  description,
  path = "/",
  noIndex = false,
  image,
  article,
}: {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
  /** Absolute path under /public. Falls back to the generated OG card. */
  image?: string;
  article?: {
    publishedTime?: string | undefined;
    modifiedTime?: string | undefined;
    authors?: string[] | undefined;
    tags?: string[] | undefined;
  };
}): Metadata {
  const url = `${siteConfig.url}${path}`;
  const page_title = title ?? siteConfig.name;
  const page_description = description ?? siteConfig.description;
  const og_image = image ?? og_image_url(page_title, page_description);

  return {
    title,
    description,
    alternates: {
      canonical: path,
      types: rss_alternate(),
    },
    openGraph: {
      title: page_title,
      description: page_description,
      url,
      images: [{ url: og_image, width: 1200, height: 630, alt: page_title }],
      ...(article && {
        type: "article" as const,
        publishedTime: article.publishedTime,
        modifiedTime: article.modifiedTime,
        authors: article.authors,
        tags: article.tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: page_title,
      description: page_description,
      images: [og_image],
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
