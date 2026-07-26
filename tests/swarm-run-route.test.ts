// file: tests/swarm-run-route.test.ts
// description: Guards the anonymous demo BFF against live-run and budget escalation
// reference: app/api/swarm/run/route.ts, lib/rate-limit.ts

import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { POST } from "../app/api/swarm/run/route";
import { resetRateLimits } from "../lib/rate-limit";

interface UpstreamCall {
  url: string;
  body: { task: string; budget_usd: number; simulate: boolean };
  headers: Record<string, string>;
}

const originalFetch = globalThis.fetch;
let calls: UpstreamCall[] = [];

function firstCall(): UpstreamCall {
  const call = calls[0];
  if (!call) throw new Error("expected an upstream call");
  return call;
}

function stubUpstream(): void {
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({
      url: String(input),
      body: JSON.parse(String(init?.body)) as UpstreamCall["body"],
      headers: (init?.headers ?? {}) as Record<string, string>,
    });
    return new Response(JSON.stringify({ pipeline_id: "test", status: "complete" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;
}

function makeRequest(body: unknown, ip = "203.0.113.10"): Request {
  return new Request("https://swarm357.techtideai.io/api/swarm/run", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  calls = [];
  resetRateLimits();
  process.env.SWARM_API_KEY = "test-write-key";
  process.env.SWARM_API_URL = "https://api.example.test";
  stubUpstream();
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("POST /api/swarm/run", () => {
  test("forces simulate mode even when the client asks for a live run", async () => {
    const res = await POST(makeRequest({ task: "audit pricing", simulate: false }));

    expect(res.status).toBe(200);
    expect(calls).toHaveLength(1);
    expect(firstCall().body.simulate).toBe(true);
  });

  test("clamps an oversized budget to the demo ceiling", async () => {
    await POST(makeRequest({ task: "audit pricing", budget_usd: 500 }));

    expect(firstCall().body.budget_usd).toBe(0.05);
  });

  test("keeps a smaller client budget", async () => {
    await POST(makeRequest({ task: "audit pricing", budget_usd: 0.01 }));

    expect(firstCall().body.budget_usd).toBe(0.01);
  });

  test("never forwards a client-supplied api key header", async () => {
    const req = new Request("https://swarm357.techtideai.io/api/swarm/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "203.0.113.11",
        "X-SWARM-API-KEY": "attacker-key",
      },
      body: JSON.stringify({ task: "audit pricing" }),
    });

    await POST(req);

    expect(firstCall().headers["X-SWARM-API-KEY"]).toBe("test-write-key");
  });

  test("rejects an over-long task", async () => {
    const res = await POST(makeRequest({ task: "x".repeat(501) }));

    expect(res.status).toBe(400);
    expect(calls).toHaveLength(0);
  });

  test("rejects an empty task", async () => {
    const res = await POST(makeRequest({ task: "   " }));

    expect(res.status).toBe(400);
    expect(calls).toHaveLength(0);
  });

  test("rate limits a single caller after five runs", async () => {
    for (let i = 0; i < 5; i += 1) {
      const ok = await POST(makeRequest({ task: `run ${i}` }, "198.51.100.7"));
      expect(ok.status).toBe(200);
    }

    const blocked = await POST(makeRequest({ task: "run 6" }, "198.51.100.7"));

    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("Retry-After")).toBeTruthy();
    expect(calls).toHaveLength(5);
  });

  test("fails closed when the server write key is missing", async () => {
    delete process.env.SWARM_API_KEY;

    const res = await POST(makeRequest({ task: "audit pricing" }));

    expect(res.status).toBe(503);
    expect(calls).toHaveLength(0);
  });
});
