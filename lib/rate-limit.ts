// file: lib/rate-limit.ts
// description: Fixed-window in-process rate limiter for the demo BFF write proxy
// reference: app/api/swarm/run/route.ts

export interface RateLimitDecision {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

interface WindowState {
  count: number;
  resetAt: number;
}

// Railway runs a single long-lived Node process per replica, so an in-process
// map is sufficient. It is a cost and abuse brake on an anonymous endpoint, not
// a distributed quota.
const windows = new Map<string, WindowState>();

const MAX_TRACKED_CLIENTS = 10_000;

function sweep(now: number): void {
  for (const [key, state] of windows) {
    if (state.resetAt <= now) windows.delete(key);
  }
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now()
): RateLimitDecision {
  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    if (windows.size >= MAX_TRACKED_CLIENTS) sweep(now);
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: limit - existing.count,
    retryAfterSeconds: 0,
  };
}

/** Test seam. Not used at runtime. */
export function resetRateLimits(): void {
  windows.clear();
}

/**
 * Resolves the caller address from proxy headers. Railway terminates TLS
 * upstream, so the socket address is always the proxy.
 */
export function clientKeyFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "unknown";
}
