// file: app/api/swarm/run/route.ts
// description: Same-origin BFF for swarm demo runs; holds server-only SWARM_API_KEY
// reference: lib/api.ts, components/try-it-live.tsx

import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface RunBody {
  task?: string;
  budget_usd?: number;
  simulate?: boolean;
}

export async function POST(request: Request): Promise<Response> {
  let body: RunBody;
  try {
    body = (await request.json()) as RunBody;
  } catch {
    return NextResponse.json({ detail: "Invalid JSON body" }, { status: 400 });
  }

  const task = typeof body.task === "string" ? body.task.trim() : "";
  if (!task) {
    return NextResponse.json({ detail: "task is required" }, { status: 400 });
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
        budget_usd: body.budget_usd ?? 5.0,
        simulate: body.simulate ?? false,
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
    return NextResponse.json(
      { detail: message, status: "error" },
      { status: 502 }
    );
  }
}
