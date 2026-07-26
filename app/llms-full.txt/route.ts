// file: app/llms-full.txt/route.ts
// description: Full plain-text documentation bundle for AI crawlers
// reference: lib/content/loader.ts

import { load_all_docs, load_all_blog_posts } from "@/lib/content/loader";
import { SITE_URL } from "@/lib/site-url";

export function GET() {
  const docs = load_all_docs();
  const blog = load_all_blog_posts();

  const sections = [
    `# Swarm 357 Documentation Bundle\nURL: ${SITE_URL}\n`,
    ...docs.map(
      (doc) =>
        `\n---\n# ${doc.frontmatter.title}\nURL: ${SITE_URL}${doc.href}\n\n${doc.content}`
    ),
    ...blog.map(
      (post) =>
        `\n---\n# ${post.frontmatter.title}\nURL: ${SITE_URL}${post.href}\n\n${post.content}`
    ),
  ];

  return new Response(sections.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
