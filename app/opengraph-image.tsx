// file: app/opengraph-image.tsx
// description: Default Open Graph image for the marketing site
// reference: lib/og-image.tsx

import { build_og_image } from "@/lib/og-image";
import { siteConfig } from "@/lib/config";

export const alt = "Swarm 357";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return build_og_image(siteConfig.name, siteConfig.tagline);
}
