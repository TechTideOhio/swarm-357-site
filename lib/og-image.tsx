// file: lib/og-image.tsx
// description: Shared Open Graph image generator for site, docs, and blog routes
// reference: lib/site-url.ts, app/opengraph-image.tsx

import { ImageResponse } from "next/og";

export const og_size = { width: 1200, height: 630 };

export function build_og_image(title: string, subtitle?: string): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0a0a0a 0%, #171717 55%, #262626 100%)",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#f5f5f5",
              color: "#0a0a0a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            357
          </div>
          <span style={{ fontSize: 28, fontWeight: 600, opacity: 0.9 }}>Swarm 357</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 960 }}>
          <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            {title}
          </div>
          {subtitle ? (
            <div style={{ fontSize: 28, lineHeight: 1.4, color: "#d4d4d4" }}>{subtitle}</div>
          ) : null}
        </div>
        <div style={{ fontSize: 22, color: "#a3a3a3" }}>swarm357fe.up.railway.app</div>
      </div>
    ),
    { ...og_size }
  );
}
