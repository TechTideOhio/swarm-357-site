// file: app/docs/raw/[[...slug]]/route.ts
// description: Raw markdown export for documentation and SOUL templates
// reference: lib/content/loader.ts

import fs from "node:fs";
import path from "node:path";
import { load_doc_by_slug } from "@/lib/content/loader";

const CORE_ROOT = path.resolve(process.cwd(), "../swarm357-sync");
const SOUL_ROOT = path.join(CORE_ROOT, "templates/soul");

// The role slug lands in a filesystem path, so anything outside a flat
// lowercase name is rejected before it reaches path.join.
const SAFE_ROLE_SLUG = /^[a-z0-9][a-z0-9-]{0,63}$/;

interface RouteContext {
  params: Promise<{ slug?: string[] }>;
}

function markdown(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function not_found(): Response {
  return new Response("Not found", { status: 404 });
}

function read_soul(role_slug: string): string | null {
  if (!SAFE_ROLE_SLUG.test(role_slug)) return null;

  let layers: fs.Dirent[];
  try {
    layers = fs.readdirSync(SOUL_ROOT, { withFileTypes: true });
  } catch {
    // The core repository is a sibling checkout used to generate content. It is
    // absent on a deployed site, which is a missing resource, not a fault.
    return null;
  }

  for (const layer of layers) {
    if (!layer.isDirectory()) continue;
    const soul_path = path.resolve(SOUL_ROOT, layer.name, `${role_slug}.md`);
    if (!soul_path.startsWith(SOUL_ROOT + path.sep)) continue;
    if (!fs.existsSync(soul_path)) continue;
    return fs.readFileSync(soul_path, "utf8");
  }
  return null;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug: slug_parts } = await context.params;
  const slug = slug_parts?.join("/") ?? "";

  if (slug.startsWith("roster/roles/")) {
    const body = read_soul(slug.slice("roster/roles/".length));
    return body === null ? not_found() : markdown(body);
  }

  const doc = load_doc_by_slug(slug);
  if (!doc) return not_found();

  return markdown(
    `# ${doc.frontmatter.title}\n\n${doc.frontmatter.description}\n\n${doc.content}`
  );
}
