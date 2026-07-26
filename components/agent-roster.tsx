"use client";

import { getAgents, type Agent } from "@/lib/api";
import { easeOut } from "@/lib/motion";
import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

const LAYER_ORDER = [
  "management",
  "sales",
  "support",
  "marketing",
  "seo",
  "research",
  "operations",
];

function AgentCard({ agent }: { agent: Agent }): ReactNode {
  return (
    <div className="bg-muted hover:bg-muted/80 flex flex-col gap-2 rounded-2xl border border-neutral-200/10 p-4 shadow-2xl/20 transition-colors duration-300">
      <div className="flex items-start justify-between gap-2">
        <span className="text-foreground truncate text-sm font-medium">
          {agent.name}
        </span>
        <span className="bg-accent shrink-0 rounded px-2 py-0.5 text-xs font-medium text-black uppercase">
          {agent.model}
        </span>
      </div>
      <p className="text-muted-foreground text-xs">{agent.role}</p>
      <p className="text-muted-foreground text-xs">
        Budget: ${agent.budget_usd.toFixed(2)}/run
      </p>
    </div>
  );
}

export function AgentRoster(): ReactNode {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [search, setSearch] = useState("");
  const [activeLayer, setActiveLayer] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAgents()
      .then((res) => setAgents(res.agents))
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Failed to load agents")
      )
      .finally(() => setLoading(false));
  }, []);

  const layers = [
    "all",
    ...LAYER_ORDER.filter((l) => agents.some((a) => a.layer === l)),
  ];

  const filtered = agents.filter((a) => {
    const matchLayer = activeLayer === "all" || a.layer === activeLayer;
    const matchSearch =
      !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase());
    return matchLayer && matchSearch;
  });

  return (
    <section className="bg-background px-6 py-16 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: easeOut }}
        >
          <h2 className="mb-3 text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
            {loading ? "Loading agents\u2026" : `${agents.length} Live Agents`}
          </h2>
          <p className="text-muted-foreground text-base">
            Six business layers — searchable, filterable, real.
          </p>
        </motion.div>

        {error && (
          <p className="text-muted-foreground mb-6 text-center text-sm">
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <label htmlFor="agent-search" className="sr-only">
                Search agents or roles
              </label>
              <input
                id="agent-search"
                type="text"
                placeholder="Search agents or roles…"
                aria-label="Search agents or roles"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent sm:w-72"
              />
              <div className="flex flex-wrap gap-2">
                {layers.map((l) => (
                  <button
                    key={l}
                    aria-pressed={activeLayer === l}
                    onClick={() => setActiveLayer(l)}
                    className={`rounded-[3.5px] px-3 py-1 text-xs font-medium transition-colors duration-300 ${
                      activeLayer === l
                        ? "bg-accent text-black"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {l === "all" ? `All (${agents.length})` : l}
                  </button>
                ))}
              </div>
            </div>

            <motion.div
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: easeOut }}
            >
              {filtered.map((agent) => (
                <AgentCard key={agent.name} agent={agent} />
              ))}
              {filtered.length === 0 && (
                <p className="text-muted-foreground col-span-full py-8 text-center text-sm">
                  No agents match your search.
                </p>
              )}
            </motion.div>
          </>
        )}

        {loading && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-muted h-24 animate-pulse rounded-2xl border border-neutral-200/10"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
