// file: next.config.ts
// description: Next.js build config plus baseline security response headers
// reference: app/api/swarm/run/route.ts, lib/api.ts

import type { NextConfig } from "next";

const is_production = process.env.NODE_ENV === "production";

// Read-only client fetches go straight to the core API, so its origin has to be
// in connect-src. Everything else is same-origin.
const api_origin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL ?? "").origin;
  } catch {
    return "";
  }
})();

const connect_src = ["'self'", api_origin].filter(Boolean).join(" ");

// Next.js injects inline bootstrap scripts and both Motion and react-three-fiber
// write inline styles. Without a nonce-issuing middleware those need
// 'unsafe-inline'; the value here is source restriction, not inline blocking.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  `connect-src ${connect_src}`,
  ...(is_production ? ["upgrade-insecure-requests"] : []),
].join("; ");

const security_headers = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(is_production
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  compiler: {
    removeConsole: is_production,
  },
  async headers() {
    return [{ source: "/:path*", headers: security_headers }];
  },
};

export default nextConfig;
