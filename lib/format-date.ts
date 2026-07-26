// file: lib/format-date.ts
// description: Stable date formatting for blog listings, post headers, and feeds
// reference: app/blog/page.tsx, app/blog/[slug]/page.tsx, app/feed.xml/route.ts

/**
 * Blog dates are authored as plain `YYYY-MM-DD`. Parsing them with the Date
 * constructor would apply the server timezone and can shift the day, so the
 * parts are read directly and rendered in a fixed locale.
 */
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function parts(date: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  if (!match) return null;
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
}

/** "13 January 2026". Returns the raw string when the date is not ISO shaped. */
export function format_post_date(date: string): string {
  const value = parts(date);
  if (!value) return date;
  return `${value.day} ${MONTHS[value.month - 1]} ${value.year}`;
}

/** Midnight UTC for the given calendar day, for sitemaps and RSS. */
export function post_date_to_utc(date: string): Date {
  const value = parts(date);
  if (!value) return new Date(date);
  return new Date(Date.UTC(value.year, value.month - 1, value.day));
}

/** RFC 822 timestamp required by RSS 2.0 `pubDate`. */
export function to_rfc_822(date: Date): string {
  return date.toUTCString();
}
