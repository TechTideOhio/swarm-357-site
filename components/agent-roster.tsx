"use client";

import { getAgents, type Agent } from "@/lib/api";
import { easeOut } from "@/lib/motion";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

const LAYER_ORDER = [
  "management",
  "sales",
  "support",
  "marketing",
  "seo",
  "research",
  "operations",
] as const;

type LayerId = (typeof LAYER_ORDER)[number];

const LAYER_LABELS: Record<LayerId, string> = {
  management: "Management",
  sales: "Sales",
  support: "Support",
  marketing: "Marketing",
  seo: "SEO",
  research: "Research",
  operations: "Operations",
};

function AgentRow({ agent }: { agent: Agent }): ReactNode {
  return (
    <li className="border-border/40 grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] items-center gap-3 border-b px-4 py-3 last:border-0">
      <span className="text-foreground truncate text-sm font-medium tracking-tight">
        {agent.name}
      </span>
      <span className="text-muted-foreground truncate text-xs">{agent.role}</span>
      <span className="bg-accent shrink-0 rounded-[3.5px] px-2 py-0.5 text-[10px] font-medium tracking-tight text-black uppercase">
        {agent.model}
      </span>
    </li>
  );
}

export function AgentRoster(): ReactNode {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [layer, setLayer] = useState<LayerId>("sales");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getAgents()
      .then((res) => {
        if (cancelled) return;
        setAgents(res.agents);
        const firstWithAgents = LAYER_ORDER.find((id) =>
          res.agents.some((a) => a.layer === id)
        );
        if (firstWithAgents) setLayer(firstWithAgents);
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load agents");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const map = Object.fromEntries(
      LAYER_ORDER.map((id) => [id, 0])
    ) as Record<LayerId, number>;
    for (const agent of agents) {
      if (agent.layer in map) {
        map[agent.layer as LayerId] += 1;
      }
    }
    return map;
  }, [agents]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return agents.filter((a) => {
      if (a.layer !== layer) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) || a.role.toLowerCase().includes(q)
      );
    });
  }, [agents, layer, search]);

  return (
    <section className="bg-background px-6 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: easeOut }}
        >
          <h2 className="mb-3 text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
            {loading
              ? "Agent roster"
              : `${agents.length || 357} agents, by layer`}
          </h2>
          <p className="text-muted-foreground text-base">
            Pick a layer to browse roles. No endless card wall.
          </p>
        </motion.div>

        {error && (
          <p className="text-muted-foreground mb-6 text-center text-sm">
            {error}
          </p>
        )}

        <motion.div
          className="bg-muted rounded-2xl border border-neutral-200/10 shadow-2xl/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <div className="flex flex-col gap-3 border-b border-neutral-200/10 p-4 sm:flex-row sm:items-center">
            <label className="sr-only" htmlFor="agent-layer">
              Business layer
            </label>
            <div className="relative min-w-0 flex-1 sm:max-w-xs">
              <select
                id="agent-layer"
                value={layer}
                disabled={loading}
                onChange={(e) => {
                  setLayer(e.target.value as LayerId);
                  setOpen(true);
                }}
                className="bg-background text-foreground border-neutral-200/10 focus:ring-accent w-full appearance-none rounded-[3.5px] border py-2.5 pr-10 pl-3 text-sm font-medium tracking-tight shadow-2xl/20 focus:outline-none focus:ring-2 disabled:opacity-50"
              >
                {LAYER_ORDER.map((id) => (
                  <option key={id} value={id}>
                    {LAYER_LABELS[id]}
                    {!loading ? ` (${counts[id]})` : ""}
                  </option>
                ))}
              </select>
              <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
            </div>

            <label className="sr-only" htmlFor="agent-search">
              Search within layer
            </label>
            <input
              id="agent-search"
              type="search"
              placeholder="Search this layer…"
              aria-label="Search agents in the selected layer"
              value={search}
              disabled={loading}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-background text-foreground placeholder:text-muted-foreground border-neutral-200/10 focus:ring-accent min-w-0 flex-1 rounded-[3.5px] border px-3 py-2.5 text-sm shadow-2xl/20 focus:outline-none focus:ring-2 disabled:opacity-50"
            />

            <button
              type="button"
              aria-expanded={open}
              aria-controls="agent-layer-list"
              onClick={() => setOpen((v) => !v)}
              className="text-muted-foreground hover:text-foreground hover:bg-foreground/5 inline-flex items-center justify-center gap-1 rounded-[3.5px] px-3 py-2 text-xs font-medium tracking-tight transition-colors duration-300 ease-out"
            >
              {open ? "Collapse" : "Expand"}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-300 ease-out ${open ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id="agent-layer-list"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: easeOut }}
                className="overflow-hidden"
              >
                {loading ? (
                  <div className="space-y-2 p-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-background/60 h-10 animate-pulse rounded-[3.5px]"
                      />
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="text-muted-foreground border-border/40 flex items-center justify-between border-b px-4 py-2 text-xs tracking-wider uppercase">
                      <span>
                        {LAYER_LABELS[layer]} · {visible.length} shown
                      </span>
                      <span className="hidden sm:inline">
                        Model
                      </span>
                    </div>
                    <ul className="max-h-80 overflow-y-auto overscroll-contain">
                      {visible.map((agent) => (
                        <AgentRow key={agent.name} agent={agent} />
                      ))}
                      {visible.length === 0 && (
                        <li className="text-muted-foreground px-4 py-10 text-center text-sm">
                          No agents match in this layer.
                        </li>
                      )}
                    </ul>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
