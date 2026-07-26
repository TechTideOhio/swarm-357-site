// file: app/docs/raw/[[...slug]]/route.ts
// description: Raw markdown export for documentation and SOUL templates
// reference: lib/content/loader.ts

import fs from "node:fs";
import path from "node:path";
import { load_doc_by_slug } from "@/lib/content/loader";

const CORE_ROOT = path.resolve(process.cwd(), "../swarm357-sync");

interface RouteContext {
  params: Promise<{ slug?: string[] }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug: slug_parts } = await context.params;
  const slug = slug_parts?.join("/") ?? "";

  if (slug.startsWith("roster/roles/")) {
    const role_slug = slug.replace("roster/roles/", "");
    const layers = fs.readdirSync(path.join(CORE_ROOT, "templates/soul"), { withFileTypes: true });
    for (const layer of layers) {
      if (!layer.isDirectory()) continue;
      const soul_path = path.join(CORE_ROOT, "templates/soul", layer.name, `${role_slug}.md`);
      if (fs.existsSync(soul_path)) {
        const body = fs.readFileSync(soul_path, "utf8");
        return new Response(body, {
          headers: { "Content-Type": "text/markdown; charset=utf-8" },
        });
      }
    }
    return new Response("Not found", { status: 404 });
  }

  const doc = load_doc_by_slug(slug);
  if (!doc) {
    return new Response("Not found", { status: 404 });
  }

  const body = `# ${doc.frontmatter.title}\n\n${doc.frontmatter.description}\n\n${doc.content}`;
  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
