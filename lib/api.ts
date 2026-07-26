/**
 * Typed API client for the TechTide Swarm 357 FastAPI backend.
 * Reads NEXT_PUBLIC_API_URL; falls back to http://localhost:8000 for local dev.
 */

import { apiConfig } from "@/lib/config";

const BASE_URL = apiConfig.url;

// -- Types ------------------------------------------------------------------

export interface Agent {
  name: string;
  layer: string;
  role: string;
  model: string;
  budget_usd: number;
  tools: string[];
}

export interface AgentsResponse {
  agents: Agent[];
  total: number;
}

export interface LayerStats {
  calls: number;
  cost: number;
  latency: number;
}

export interface SwarmStatus {
  layers: Record<string, LayerStats>;
  total_cost_usd: number;
  roster_size: number;
}

export interface SwarmCost {
  total_cost_usd: number;
  per_layer_usd: Record<string, number>;
}

export interface AgentResult {
  output: string;
  cost_usd: number;
  latency_ms: number;
  status: "success" | "error" | "skipped";
  agent_name: string;
  error: string | null;
}

export interface SwarmRunResult {
  pipeline_id: string;
  status: "ok" | "error" | "stub";
  total_cost_usd: number;
  final_output: string;
  agent_results: AgentResult[];
  error?: string;
}

export interface RunEvent {
  type: string;
  pipeline_id?: string;
  task?: string;
  total_cost_usd?: number;
  agents_used?: string[];
  latency_ms?: number;
  status?: string;
  agent_name?: string;
  layer?: string;
  cost_usd?: number;
}

export interface RunsResponse {
  runs: RunEvent[];
  total: number;
}

// -- Fetch helpers ----------------------------------------------------------

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  };
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
  });
  if (!res.ok) {
    let detail = `${res.status}`;
    try {
      const body = (await res.json()) as { detail?: string };
      if (body.detail) detail = `${res.status}: ${body.detail}`;
    } catch {
      /* ignore */
    }
    throw new Error(`API ${path} returned ${detail}`);
  }
  return res.json() as Promise<T>;
}

// -- Public API -------------------------------------------------------------

/** In-flight / resolved cache so multiple sections share one agents fetch. */
let agentsCache: Promise<AgentsResponse> | null = null;

export function getAgents(): Promise<AgentsResponse> {
  if (!agentsCache) {
    agentsCache = apiFetch<AgentsResponse>("/api/swarm/agents").catch(
      (err: unknown) => {
        agentsCache = null;
        throw err;
      }
    );
  }
  return agentsCache;
}

export function getStatus(): Promise<SwarmStatus> {
  return apiFetch<SwarmStatus>("/api/swarm/status");
}

export function getCost(): Promise<SwarmCost> {
  return apiFetch<SwarmCost>("/api/swarm/cost");
}

export function getRuns(limit = 10): Promise<RunsResponse> {
  return apiFetch<RunsResponse>(`/api/swarm/runs?limit=${limit}`);
}

/** Public health JSON. Safe to link from the landing page. */
export function getHealth(): Promise<{
  status: string;
  version: string;
  agents: number;
  api_key_set: boolean;
}> {
  return apiFetch("/api/health");
}

/**
 * Runs the swarm pipeline via same-origin BFF (`/api/swarm/run`).
 * The browser never sees SWARM_API_KEY. Only the Next.js route holds it.
 */
export async function postRun(
  task: string,
  budgetUsd = 5.0
): Promise<SwarmRunResult> {
  const res = await fetch("/api/swarm/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task, budget_usd: budgetUsd, simulate: true }),
  });
  let payload: SwarmRunResult & { detail?: string; status?: string } = {
    pipeline_id: "",
    status: "error",
    total_cost_usd: 0,
    final_output: "",
    agent_results: [],
  };
  try {
    payload = (await res.json()) as typeof payload;
  } catch {
    /* ignore */
  }
  if (res.status === 401 || res.status === 403 || res.status === 503) {
    const err = new Error(
      payload.detail ?? `Auth required (${res.status})`
    ) as Error & { code?: string };
    err.code = "auth_required";
    throw err;
  }
  if (!res.ok) {
    throw new Error(payload.detail ?? `API /api/swarm/run returned ${res.status}`);
  }
  return payload;
}
