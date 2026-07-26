// file: lib/content/nav.ts
// description: Documentation sidebar navigation tree and page ordering
// reference: lib/content/types.ts, lib/content/loader.ts

import type { DocNeighbor, NavSection } from "./types";

/** Ordered docs navigation. Slugs map to content/docs/{slug}.mdx */
export const docs_nav: NavSection[] = [
  {
    title: "Getting started",
    items: [
      { title: "Introduction", slug: "getting-started/introduction", href: "/docs/getting-started/introduction" },
      { title: "Quickstart", slug: "getting-started/quickstart", href: "/docs/getting-started/quickstart" },
      { title: "Installation", slug: "getting-started/installation", href: "/docs/getting-started/installation" },
      { title: "Your first run", slug: "getting-started/first-run", href: "/docs/getting-started/first-run" },
      { title: "Core concepts", slug: "getting-started/core-concepts", href: "/docs/getting-started/core-concepts" },
      { title: "Architecture", slug: "getting-started/architecture", href: "/docs/getting-started/architecture" },
    ],
  },
  {
    title: "Guides",
    items: [
      { title: "Running a task", slug: "guides/running-a-task", href: "/docs/guides/running-a-task" },
      { title: "Layer routing", slug: "guides/layer-routing", href: "/docs/guides/layer-routing" },
      { title: "Cost control and budgets", slug: "guides/cost-control", href: "/docs/guides/cost-control" },
      { title: "Flat-file memory", slug: "guides/flat-file-memory", href: "/docs/guides/flat-file-memory" },
      { title: "Memvid bridge", slug: "guides/memvid-bridge", href: "/docs/guides/memvid-bridge" },
      { title: "Bash security gate", slug: "guides/bash-security-gate", href: "/docs/guides/bash-security-gate" },
      { title: "Human-in-the-loop approvals", slug: "guides/hitl-approvals", href: "/docs/guides/hitl-approvals" },
      { title: "Checkpoints and resume", slug: "guides/checkpoints-resume", href: "/docs/guides/checkpoints-resume" },
      { title: "Replay and fork", slug: "guides/replay-fork", href: "/docs/guides/replay-fork" },
      { title: "Streaming events", slug: "guides/streaming-events", href: "/docs/guides/streaming-events" },
      { title: "Telemetry and traces", slug: "guides/telemetry-traces", href: "/docs/guides/telemetry-traces" },
      { title: "UltraPlan", slug: "guides/ultraplan", href: "/docs/guides/ultraplan" },
      { title: "Dream cycle", slug: "guides/dream-cycle", href: "/docs/guides/dream-cycle" },
    ],
  },
  {
    title: "CLI reference",
    items: [
      { title: "Overview", slug: "cli/overview", href: "/docs/cli/overview" },
      { title: "init, demo, status", slug: "cli/init-demo-status", href: "/docs/cli/init-demo-status" },
      { title: "run, boot, agent", slug: "cli/run-boot-agent", href: "/docs/cli/run-boot-agent" },
      { title: "inspect, resume, cancel", slug: "cli/inspect-resume-cancel", href: "/docs/cli/inspect-resume-cancel" },
      { title: "approve, reject", slug: "cli/approve-reject", href: "/docs/cli/approve-reject" },
      { title: "replay, fork", slug: "cli/replay-fork", href: "/docs/cli/replay-fork" },
      { title: "dream, migrate, plan", slug: "cli/dream-migrate-plan", href: "/docs/cli/dream-migrate-plan" },
      { title: "eval, serve", slug: "cli/eval-serve", href: "/docs/cli/eval-serve" },
      { title: "cost", slug: "cli/cost", href: "/docs/cli/cost" },
      { title: "mcp", slug: "cli/mcp", href: "/docs/cli/mcp" },
    ],
  },
  {
    title: "API reference",
    items: [
      { title: "Overview", slug: "api/overview", href: "/docs/api/overview" },
      { title: "Authentication", slug: "api/authentication", href: "/docs/api/authentication" },
      { title: "Errors and status codes", slug: "api/errors", href: "/docs/api/errors" },
      { title: "Rate limits", slug: "api/rate-limits", href: "/docs/api/rate-limits" },
      { title: "Health and status", slug: "api/health-status", href: "/docs/api/health-status" },
      { title: "Agents", slug: "api/agents", href: "/docs/api/agents" },
      { title: "Runs", slug: "api/runs", href: "/docs/api/runs" },
      { title: "SSE event stream", slug: "api/sse-events", href: "/docs/api/sse-events" },
      { title: "Approvals and execution", slug: "api/approvals-execution", href: "/docs/api/approvals-execution" },
    ],
  },
  {
    title: "Python SDK",
    items: [
      { title: "Overview", slug: "sdk/overview", href: "/docs/sdk/overview" },
      { title: "Agent and AgentConfig", slug: "sdk/agent", href: "/docs/sdk/agent" },
      { title: "Swarm", slug: "sdk/swarm", href: "/docs/sdk/swarm" },
      { title: "CostController", slug: "sdk/cost-controller", href: "/docs/sdk/cost-controller" },
      { title: "MemoryManager", slug: "sdk/memory-manager", href: "/docs/sdk/memory-manager" },
      { title: "MemvidBridge", slug: "sdk/memvid-bridge", href: "/docs/sdk/memvid-bridge" },
      { title: "BashSecurityGate", slug: "sdk/bash-security-gate", href: "/docs/sdk/bash-security-gate" },
      { title: "ApprovalGate", slug: "sdk/approval-gate", href: "/docs/sdk/approval-gate" },
      { title: "ToolRegistry", slug: "sdk/tool-registry", href: "/docs/sdk/tool-registry" },
      { title: "UltraPlan", slug: "sdk/ultraplan", href: "/docs/sdk/ultraplan" },
    ],
  },
  {
    title: "Configuration",
    items: [
      { title: "Roster YAML", slug: "configuration/roster-yaml", href: "/docs/configuration/roster-yaml" },
      { title: "Environment variables", slug: "configuration/environment-variables", href: "/docs/configuration/environment-variables" },
      { title: "Model IDs and providers", slug: "configuration/models", href: "/docs/configuration/models" },
      { title: "MCP servers", slug: "configuration/mcp-servers", href: "/docs/configuration/mcp-servers" },
      { title: "Runtime files", slug: "configuration/runtime-files", href: "/docs/configuration/runtime-files" },
    ],
  },
  {
    title: "Roster",
    items: [
      { title: "Overview", slug: "roster/overview", href: "/docs/roster/overview" },
      { title: "Management layer", slug: "roster/management", href: "/docs/roster/management" },
      { title: "Sales layer", slug: "roster/sales", href: "/docs/roster/sales" },
      { title: "Support layer", slug: "roster/support", href: "/docs/roster/support" },
      { title: "Marketing layer", slug: "roster/marketing", href: "/docs/roster/marketing" },
      { title: "SEO layer", slug: "roster/seo", href: "/docs/roster/seo" },
      { title: "Research layer", slug: "roster/research", href: "/docs/roster/research" },
      { title: "Operations layer", slug: "roster/operations", href: "/docs/roster/operations" },
    ],
  },
  {
    title: "Deployment",
    items: [
      { title: "Docker", slug: "deployment/docker", href: "/docs/deployment/docker" },
      { title: "Railway", slug: "deployment/railway", href: "/docs/deployment/railway" },
      { title: "Supabase data plane", slug: "deployment/supabase", href: "/docs/deployment/supabase" },
      { title: "Production checklist", slug: "deployment/production-checklist", href: "/docs/deployment/production-checklist" },
    ],
  },
  {
    title: "Security",
    items: [
      { title: "Security model", slug: "security/security-model", href: "/docs/security/security-model" },
      { title: "Bash policy", slug: "security/bash-policy", href: "/docs/security/bash-policy" },
      { title: "Filesystem confinement", slug: "security/filesystem", href: "/docs/security/filesystem" },
      { title: "Authentication", slug: "security/authentication", href: "/docs/security/authentication" },
      { title: "Enterprise controls", slug: "security/enterprise-controls", href: "/docs/security/enterprise-controls" },
    ],
  },
  {
    title: "Evals",
    items: [
      { title: "Methodology", slug: "evals/methodology", href: "/docs/evals/methodology" },
      { title: "Task catalog", slug: "evals/task-catalog", href: "/docs/evals/task-catalog" },
      { title: "Latest baseline", slug: "evals/latest-baseline", href: "/docs/evals/latest-baseline" },
      { title: "Reproducing", slug: "evals/reproducing", href: "/docs/evals/reproducing" },
    ],
  },
  {
    title: "Resources",
    items: [
      { title: "Status and maturity", slug: "resources/status", href: "/docs/resources/status" },
      { title: "Verification scorecard", slug: "resources/verification", href: "/docs/resources/verification" },
      { title: "Comparison", slug: "resources/comparison", href: "/docs/resources/comparison" },
      { title: "Roadmap", slug: "resources/roadmap", href: "/docs/resources/roadmap" },
      { title: "Contributing", slug: "resources/contributing", href: "/docs/resources/contributing" },
      { title: "Release process", slug: "resources/release", href: "/docs/resources/release" },
      { title: "Glossary", slug: "resources/glossary", href: "/docs/resources/glossary" },
      { title: "FAQ", slug: "resources/faq", href: "/docs/resources/faq" },
    ],
  },
];

export function get_flat_nav_items() {
  return docs_nav.flatMap((section) => section.items);
}

export function get_neighbors(slug: string): { prev: DocNeighbor | null; next: DocNeighbor | null } {
  const items = get_flat_nav_items();
  const index = items.findIndex((item) => item.slug === slug);
  if (index < 0) return { prev: null, next: null };

  const prev_item = index > 0 ? items[index - 1] : undefined;
  const next_item = index < items.length - 1 ? items[index + 1] : undefined;

  const prev = prev_item ? { title: prev_item.title, href: prev_item.href } : null;
  const next = next_item ? { title: next_item.title, href: next_item.href } : null;
  return { prev, next };
}

export function get_breadcrumbs(slug: string) {
  for (const section of docs_nav) {
    const item = section.items.find((entry) => entry.slug === slug);
    if (item) {
      return [
        { title: "Docs", href: "/docs" },
        { title: section.title, href: section.items[0]?.href ?? "/docs" },
        { title: item.title, href: item.href },
      ];
    }
  }
  return [{ title: "Docs", href: "/docs" }];
}
