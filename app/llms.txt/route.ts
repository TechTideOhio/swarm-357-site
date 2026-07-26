// file: app/llms.txt/route.ts
// description: AI-readable site index for LLM crawlers
// reference: lib/content/loader.ts, lib/site-url.ts

import { get_search_index } from "@/lib/content/loader";
import { SITE_URL } from "@/lib/site-url";

export function GET() {
  const entries = get_search_index();
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
    "## Optional",
    "",
    `- Full text bundle: ${SITE_URL}/llms-full.txt`,
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
