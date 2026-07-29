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

/** Publisher profile. Feeds Organization.sameAs so the entity resolves to one owner. */
export const LINKEDIN_URL = "https://www.linkedin.com/company/techtide-ai/";

/** Studio site linked from footer and about copy. */
export const TECHTIDE_URL = "https://techtideai.io";

/** Author site linked from footer and README backlinks. */
export const AUTHOR_URL = "https://alexcinovoj.com";

/** Public GitHub profiles for repo contributors shown in the menu. */
export const CONTRIBUTOR_PROFILE_URLS = [
  "https://github.com/Alexi5000",
  "https://github.com/sakshar2303",
] as const;
