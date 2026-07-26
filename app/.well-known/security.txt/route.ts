// file: app/.well-known/security.txt/route.ts
// description: RFC 9116 security contact so researchers find the private reporting path
// reference: SECURITY.md, lib/site-url.ts

import { GITHUB_URL, SITE_URL } from "@/lib/site-url";

const EXPIRY_MONTHS = 6;

// RFC 9116 requires a future Expires. Deriving it per request keeps the file
// from silently expiring between deploys.
function expires_at(now: Date): string {
  const expiry = new Date(now);
  expiry.setUTCMonth(expiry.getUTCMonth() + EXPIRY_MONTHS);
  return expiry.toISOString().replace(/\.\d{3}Z$/, "Z");
}

export const dynamic = "force-dynamic";

export function GET(): Response {
  const body = [
    `Contact: mailto:ai@techtide.ai`,
    `Contact: ${GITHUB_URL}/security/advisories/new`,
    `Expires: ${expires_at(new Date())}`,
    `Preferred-Languages: en`,
    `Canonical: ${SITE_URL}/.well-known/security.txt`,
    `Policy: ${SITE_URL}/docs/security/security-model`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
