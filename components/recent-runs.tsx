"use client";

import { getRuns, type RunEvent } from "@/lib/api";
import { fadeInUpView } from "@/lib/motion";
import { chrome_card_shell } from "@/lib/ui-classes";
import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

function RunCard({ run, index }: { run: RunEvent; index: number }): ReactNode {
  const statusColor =
    run.status === "ok" || run.status === "success"
      ? "text-foreground"
      : "text-muted-foreground";

  return (
    <motion.div
      className="border-border/40 space-y-2 border-b py-4 last:border-0 sm:hidden"
      {...fadeInUpView}
      transition={{ ...fadeInUpView.transition, delay: index * 0.05 }}
    >
      <p className="text-foreground text-sm font-medium">
        {run.task ?? run.pipeline_id ?? "-"}
      </p>
      <p className="text-muted-foreground text-xs">
        {Array.isArray(run.agents_used) && run.agents_used.length > 0
          ? `${run.agents_used.length} agents`
          : (run.agent_name ?? "-")}
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
        <span className={statusColor}>{run.status ?? "-"}</span>
        <span className="text-muted-foreground">
          {run.latency_ms != null ? `${run.latency_ms}ms` : "-"}
        </span>
        <span className="text-muted-foreground">
          {run.total_cost_usd != null || run.cost_usd != null
            ? `$${((run.total_cost_usd ?? run.cost_usd) as number).toFixed(4)}`
            : "-"}
        </span>
      </div>
    </motion.div>
  );
}

function RunRow({ run, index }: { run: RunEvent; index: number }): ReactNode {
  const statusColor =
    run.status === "ok" || run.status === "success"
      ? "text-foreground"
      : run.status === "error"
        ? "text-muted-foreground"
        : "text-muted-foreground/80";

  return (
    <motion.div
      className="border-border/40 hidden grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b py-4 last:border-0 sm:grid"
      {...fadeInUpView}
      transition={{ ...fadeInUpView.transition, delay: index * 0.05 }}
    >
      <div className="min-w-0">
        <p className="text-foreground truncate text-sm font-medium">
          {run.task ?? run.pipeline_id ?? "-"}
        </p>
        <p className="text-muted-foreground text-xs">
          {Array.isArray(run.agents_used) && run.agents_used.length > 0
            ? `${run.agents_used.length} agents`
            : (run.agent_name ?? "-")}
        </p>
      </div>
      <span className={`text-xs font-medium tracking-tight ${statusColor}`}>
        {run.status ?? "-"}
      </span>
      <span className="text-muted-foreground text-xs">
        {run.latency_ms != null ? `${run.latency_ms}ms` : "-"}
      </span>
      <span className="text-muted-foreground text-xs">
        {run.total_cost_usd != null || run.cost_usd != null
          ? `$${((run.total_cost_usd ?? run.cost_usd) as number).toFixed(4)}`
          : "-"}
      </span>
    </motion.div>
  );
}

export function RecentRuns(): ReactNode {
  const [runs, setRuns] = useState<RunEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    getRuns(10)
      .then((res) => setRuns(res.runs))
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-background px-6 py-16 md:py-32">
      <div className="mx-auto max-w-4xl">
        <motion.div className="mb-10 text-center" {...fadeInUpView}>
          <h2 className="text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
            Recent Runs
          </h2>
          <p className="text-muted-foreground mt-3 text-base">
            Last 10 swarm executions logged in real time.
          </p>
        </motion.div>

        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-14 rounded-2xl border border-neutral-200/10" />
            ))}
          </div>
        )}

        {!loading && fetchError && (
          <p className="text-muted-foreground py-12 text-center text-sm" role="alert">
            Could not load run history. Check that the backend is reachable.
          </p>
        )}

        {!loading && !fetchError && runs.length === 0 && (
          <p className="text-muted-foreground py-12 text-center text-sm">
            No runs yet. Use the demo above to create your first run.
          </p>
        )}

        {!loading && !fetchError && runs.length > 0 && (
          <div className={`${chrome_card_shell} overflow-x-auto px-4`}>
            <div className="text-muted-foreground border-border/40 hidden min-w-[32rem] grid-cols-[1fr_auto_auto_auto] gap-4 border-b py-3 text-xs font-medium tracking-wider uppercase sm:grid">
              <span>Task</span>
              <span>Status</span>
              <span>Latency</span>
              <span>Cost</span>
            </div>
            {runs.map((run, index) => (
              <div key={run.pipeline_id ?? index}>
                <RunCard run={run} index={index} />
                <RunRow run={run} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
