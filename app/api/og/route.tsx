// file: app/api/og/route.tsx
// description: Dynamic Open Graph image endpoint for docs and blog pages
// reference: lib/og-image.tsx

import { build_og_image } from "@/lib/og-image";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title")?.slice(0, 120) ?? "Swarm 357";
  const subtitle = searchParams.get("subtitle")?.slice(0, 200) ?? undefined;

  return build_og_image(title, subtitle);
}
