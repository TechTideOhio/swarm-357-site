import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

const AI_CRAWLERS = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "anthropic-ai"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        // /api/og renders the social card, so it stays crawlable while the rest of the API does not.
        allow: ["/", "/api/og"],
        disallow: ["/api/", "/private/"],
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: ["/", "/docs/", "/blog/", "/llms.txt", "/llms-full.txt", "/feed.xml"],
        disallow: ["/api/"],
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
