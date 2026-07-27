// file: app/llms.txt/route.ts
// description: AI-readable site index for LLM crawlers
// reference: lib/content/loader.ts, lib/site-url.ts

import { get_search_index } from "@/lib/content/loader";
import { get_indexable_blog_tags } from "@/lib/content/tags";
import { SITE_URL } from "@/lib/site-url";

export function GET() {
  const entries = get_search_index();
  const tags = get_indexable_blog_tags();
  const lines = [
    "# Swarm 357",
    "",
    `> ${SITE_URL}`,
    "",
    "Layered Claude agents, portable memory, honest cost controls.",
    "",
    "## Documentation",
    "",
    ...entries
      .filter((e) => e.type === "doc")
      .map((e) => `- [${e.title}](${SITE_URL}${e.href}): ${e.description}`),
    "",
    "## Blog",
    "",
    ...entries
      .filter((e) => e.type === "blog")
      .map((e) => `- [${e.title}](${SITE_URL}${e.href}): ${e.description}`),
    "",
    "## Blog topics",
    "",
    ...tags.map(
      (tag) =>
        `- [${tag.label}](${SITE_URL}/blog/tag/${tag.slug}): ${tag.posts.length} articles on ${tag.label.toLowerCase()}.`
    ),
    "",
    "## Pages",
    "",
    `- [About](${SITE_URL}/about): who builds Swarm 357 and why.`,
    `- [Status](${SITE_URL}/docs/resources/status): maturity matrix for every subsystem.`,
    `- [Security](${SITE_URL}/docs/security/security-model): auth, HITL, filesystem, and model honesty.`,
    `- [Evals](${SITE_URL}/evals): baseline driven metrics.`,
    `- [Changelog](${SITE_URL}/changelog): release history.`,
    "",
    "## Optional",
    "",
    `- Full text bundle: ${SITE_URL}/llms-full.txt`,
    `- Blog feed: ${SITE_URL}/feed.xml`,
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
