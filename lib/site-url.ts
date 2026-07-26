// file: lib/site-url.ts
// description: Canonical site URL constant for SEO, sitemap, and metadata
// reference: lib/config.ts, lib/metadata.ts

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://swarm357.techtideai.io";

export const GITHUB_URL = "https://github.com/TechTideOhio/swarm-357";

/** Landing repository. Referenced in body copy and docs, never in site chrome. */
export const GITHUB_SITE_URL = "https://github.com/TechTideOhio/swarm-357-site";

/** Published core package. */
export const PYPI_URL = "https://pypi.org/project/techtide-swarm/";
