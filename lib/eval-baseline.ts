// file: lib/eval-baseline.ts
// description: Load the generated eval baseline and derive the headline metrics shown across the site
// reference: content/data/eval-baseline.json, lib/content/loader.ts

import { load_data_json } from "@/lib/content/loader";

interface BaselineResult {
  status?: string;
  combined_score?: number | null;
  keyword_score?: number | null;
}

interface BaselineFile {
  meta?: {
    task_count?: number;
    passed?: number;
    budget_spent_usd?: number;
    budget_limit_usd?: number;
    provider?: string;
    model_sonnet?: string;
  };
  summary?: {
    single_agent_pass?: string;
    swarm_pass?: string;
  };
  results?: BaselineResult[];
}

export interface EvalBaselineSummary {
  executions: number;
  passed: number;
  avg_combined_score: number;
  spent_usd: number;
  budget_usd: number;
  provider: string;
  agent_model: string;
  single_agent_pass: string;
  swarm_pass: string;
}

/** Mirrors `_score` in the core repo's scripts/render_eval_assets.py so the site and README agree. */
function score_of(result: BaselineResult): number {
  if (result.combined_score !== null && result.combined_score !== undefined) {
    return result.combined_score;
  }
  return result.keyword_score ?? 0;
}

export function get_eval_baseline(): EvalBaselineSummary | null {
  const baseline = load_data_json<BaselineFile>("eval-baseline");
  if (!baseline) return null;

  const scored = (baseline.results ?? [])
    .filter((result) => result.status === "success")
    .map(score_of);

  return {
    executions: baseline.meta?.task_count ?? 0,
    passed: baseline.meta?.passed ?? 0,
    avg_combined_score: scored.length
      ? scored.reduce((total, value) => total + value, 0) / scored.length
      : 0,
    spent_usd: baseline.meta?.budget_spent_usd ?? 0,
    budget_usd: baseline.meta?.budget_limit_usd ?? 0,
    provider: baseline.meta?.provider ?? "unknown",
    agent_model: baseline.meta?.model_sonnet ?? "unknown",
    single_agent_pass: baseline.summary?.single_agent_pass ?? "n/a",
    swarm_pass: baseline.summary?.swarm_pass ?? "n/a",
  };
}
