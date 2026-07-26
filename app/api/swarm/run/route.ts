// file: app/api/swarm/run/route.ts
// description: Same-origin BFF for swarm demo runs; holds server-only SWARM_API_KEY
// reference: lib/api.ts, lib/rate-limit.ts, components/try-it-live.tsx

import { NextResponse } from "next/server";
import { checkRateLimit, clientKeyFromHeaders } from "@/lib/rate-limit";

export const runtime = "nodejs";

// This endpoint is anonymous by design: the browser never holds a write key.
// That makes it a cost amplifier unless the server pins every parameter that
// can spend money. Nothing below is taken from the request body.
const FORCED_SIMULATE = true;
const DEMO_MAX_BUDGET_USD = 0.05;
const MAX_TASK_LENGTH = 500;
const MAX_BODY_BYTES = 4096;
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

interface RunBody {
  task?: string;
  budget_usd?: number;
}

function clampBudget(requested: unknown): number {
  if (typeof requested !== "number" || !Number.isFinite(requested)) {
    return DEMO_MAX_BUDGET_USD;
  }
  return Math.min(Math.max(requested, 0), DEMO_MAX_BUDGET_USD);
}

export async function POST(request: Request): Promise<Response> {
  const rate = checkRateLimit(
    clientKeyFromHeaders(request.headers),
    RATE_LIMIT_MAX_REQUESTS,
    RATE_LIMIT_WINDOW_MS
  );
  if (!rate.allowed) {
    return NextResponse.json(
      { detail: "Too many demo runs. Try again shortly.", status: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
    );
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ detail: "Request body too large" }, { status: 413 });
  }

  let body: RunBody;
  try {
    body = JSON.parse(raw) as RunBody;
  } catch {
    return NextResponse.json({ detail: "Invalid JSON body" }, { status: 400 });
  }

  const task = typeof body.task === "string" ? body.task.trim() : "";
  if (!task) {
    return NextResponse.json({ detail: "task is required" }, { status: 400 });
  }
  if (task.length > MAX_TASK_LENGTH) {
    return NextResponse.json(
      { detail: `task must be ${MAX_TASK_LENGTH} characters or fewer` },
      { status: 400 }
    );
  }

  const apiBase = (
    process.env.SWARM_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000"
  ).replace(/\/$/, "");
  const apiKey = process.env.SWARM_API_KEY ?? "";

  if (!apiKey) {
    return NextResponse.json(
      {
        detail:
          "Auth required: set server-only SWARM_API_KEY on the site (not NEXT_PUBLIC_*).",
        status: "auth_required",
      },
      { status: 503 }
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-SWARM-API-KEY": apiKey,
    "X-Requested-With": "XMLHttpRequest",
  };

  try {
    const upstream = await fetch(`${apiBase}/api/swarm/run`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        task,
        budget_usd: clampBudget(body.budget_usd),
        simulate: FORCED_SIMULATE,
      }),
      cache: "no-store",
    });

    const text = await upstream.text();
    let payload: unknown;
    try {
      payload = JSON.parse(text) as unknown;
    } catch {
      payload = { detail: text || `Upstream ${upstream.status}` };
    }

    if (upstream.status === 401 || upstream.status === 403) {
      return NextResponse.json(
        {
          detail: "Auth required: API rejected the write key.",
          status: "auth_required",
        },
        { status: upstream.status }
      );
    }

    return NextResponse.json(payload, { status: upstream.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upstream request failed";
    return NextResponse.json({ detail: message, status: "error" }, { status: 502 });
  }
}
