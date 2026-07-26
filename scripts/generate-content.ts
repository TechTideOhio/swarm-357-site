#!/usr/bin/env bun
// file: scripts/generate-content.ts
// description: Generate MDX docs, blog posts, and data snapshots from the core swarm357-sync repo
// reference: lib/content/nav.ts, lib/content/loader.ts

import fs from "node:fs";
import path from "node:path";

const SITE_ROOT = process.cwd();
const CORE_ROOT = path.resolve(SITE_ROOT, "../swarm357-sync");
const CONTENT = path.join(SITE_ROOT, "content");
const DOCS = path.join(CONTENT, "docs");
const BLOG = path.join(CONTENT, "blog");
const DATA = path.join(CONTENT, "data");

function ensure_dir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function write_mdx(relative_slug: string, frontmatter: Record<string, string | number>, body: string) {
  const file_path = path.join(DOCS, `${relative_slug}.mdx`);
  ensure_dir(path.dirname(file_path));
  const yaml = Object.entries(frontmatter)
    .map(([key, value]) => `${key}: "${String(value).replace(/"/g, '\\"')}"`)
    .join("\n");
  fs.writeFileSync(file_path, `---\n${yaml}\n---\n\n${body.trim()}\n`, "utf8");
}

function write_blog(slug: string, frontmatter: Record<string, string>, body: string) {
  ensure_dir(BLOG);
  const yaml = Object.entries(frontmatter)
    .map(([key, value]) => `${key}: "${String(value).replace(/"/g, '\\"')}"`)
    .join("\n");
  fs.writeFileSync(path.join(BLOG, `${slug}.mdx`), `---\n${yaml}\n---\n\n${body.trim()}\n`, "utf8");
}

function read_core(relative: string): string {
  return fs.readFileSync(path.join(CORE_ROOT, relative), "utf8");
}

const CORE_REPO_URL = "https://github.com/TechTideOhio/swarm-357";
const SITE_REPO_URL = "https://github.com/TechTideOhio/swarm-357-site";

/** Core repo file paths that have a published equivalent on this site. */
const CORE_DOC_ROUTES: ReadonlyArray<readonly [RegExp, string]> = [
  [/STATUS\.md/i, "/docs/resources/status"],
  [/VERIFY\.md/i, "/docs/resources/verification"],
  [/EVALS\.md/i, "/docs/evals/methodology"],
  [/ENTERPRISE_CONTROLS\.md/i, "/docs/security/enterprise-controls"],
  [/SECURITY\.md/i, "/docs/security/security-model"],
  [/MEMVID_BRIDGE\.md/i, "/docs/guides/memvid-bridge"],
  [/COMPARISON\.md/i, "/docs/resources/comparison"],
  [/ROADMAP\.md/i, "/docs/resources/roadmap"],
  [/CONTRIBUTING\.md/i, "/docs/resources/contributing"],
  [/RELEASE\.md/i, "/docs/resources/release"],
  [/DEPLOY_RAILWAY\.md/i, "/docs/deployment/railway"],
  [/DATA_PLANE\.md/i, "/docs/deployment/supabase"],
  [/DESIGN\.md/i, "/docs/resources/design"],
  [/CHANGELOG\.md/i, "/changelog"],
];

function strip_em_dashes(text: string): string {
  return text
    .replace(/\u2014/g, " - ")
    .replace(/\u2013/g, "-")
    .replace(/  +/g, " ");
}

/**
 * Resolve a link target written for the core repo into a link that works on this site.
 * Repo-relative paths and repo URLs both map to the published doc route when one exists,
 * otherwise to the canonical repo URL.
 */
function resolve_core_href(href: string): string {
  if (href.startsWith("#") || href.startsWith("/") || href.startsWith("mailto:")) return href;

  if (href.includes("github.com/TechTideOhio/swarm-357-site")) return SITE_REPO_URL;

  const is_core_repo_url = href.includes("github.com/TechTideOhio/swarm-357");
  const is_absolute = /^https?:\/\//.test(href);
  if (is_absolute && !is_core_repo_url) return href;

  for (const [pattern, route] of CORE_DOC_ROUTES) {
    if (pattern.test(href)) return route;
  }

  return is_core_repo_url || !is_absolute ? CORE_REPO_URL : href;
}

/** Rewrite bare core repo URLs left in prose or code-free text. */
function rewrite_bare_repo_urls(text: string): string {
  return text.replace(
    /(?:https?:\/\/)?github\.com\/TechTideOhio\/swarm-357[^\s)"'`]*/g,
    (match) => (match.includes("swarm-357-site") ? SITE_REPO_URL : CORE_REPO_URL)
  );
}

/** Prepare a core markdown file for rendering as a plain markdown snapshot. */
function md_for_data(md: string): string {
  const converted = strip_em_dashes(md).replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_, label: string, href: string) => `[${label}](${resolve_core_href(href)})`
  );
  return rewrite_bare_repo_urls(converted);
}


function sanitize_for_mdx(text: string): string {
  const lines = text.split("\n");
  let in_fence = false;
  return lines
    .map((line) => {
      if (line.trim().startsWith("```")) in_fence = !in_fence;
      if (in_fence) return line;

      const parts = line.split("`");
      return parts
        .map((part, index) => {
          if (index % 2 === 1) return part;
          return part
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\{([^}]*)\}/g, "`{$1}`");
        })
        .join("`");
    })
    .join("\n");
}

function md_to_mdx(md: string): string {
  const converted = strip_em_dashes(md)
    .replace(/^# .+\n+/m, "")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (_, label: string, href: string) => `[${label}](${resolve_core_href(href)})`
    );
  return sanitize_for_mdx(rewrite_bare_repo_urls(converted));
}

function sync_data() {
  ensure_dir(DATA);

  const eval_src = path.join(CORE_ROOT, "evals/baselines/latest.json");
  if (fs.existsSync(eval_src)) {
    const eval_data = JSON.parse(fs.readFileSync(eval_src, "utf8"));
    fs.writeFileSync(path.join(DATA, "eval-baseline.json"), JSON.stringify(eval_data, null, 2));
  }

  const roster = {
    total_agents: 357,
    layers: {
      management: 10,
      sales: 62,
      support: 55,
      marketing: 68,
      seo: 47,
      research: 58,
      operations: 57,
    },
    version: "0.2.2",
  };
  fs.writeFileSync(path.join(DATA, "roster.json"), JSON.stringify(roster, null, 2));

  fs.writeFileSync(path.join(DATA, "status.md"), md_for_data(read_core("STATUS.md")));
  fs.writeFileSync(path.join(DATA, "changelog.md"), md_for_data(read_core("CHANGELOG.md")));
}

function generate_getting_started() {
  write_mdx("getting-started/introduction", {
    title: "Introduction",
    description: "What Swarm 357 is, who it is for, and how the 357-role catalog works.",
    section: "Getting started",
    order: 1,
    slug: "getting-started/introduction",
  }, `
Swarm 357 is a **357-role catalog plus orchestration runtime** for Claude agents across six business layers: Sales, Support, Marketing, SEO, Research, and Operations, plus Management meta-agents.

It is an organizational ontology for agents. It is **not** 357 simultaneous Opus sessions.

## What you get

- **Layered specialists** with YAML roster and SOUL templates for each role
- **Portable memory** via flat-file topics and optional Memvid \`.mv2\` bridge
- **Honest cost controls** with layer budgets and logged model downgrade at 80% spend
- **Production security defaults**: Bash policy gate, filesystem confinement, HITL approvals
- **Observable runs** with checkpoints, SSE events, and local JSONL traces

## Who it is for

- Teams running Claude Code or API agents who need structure, not chaos
- Operators who want FinOps and security reviewers to verify claims
- Builders who prefer open-core (Apache-2.0) over black-box platforms

## Next steps

- [Quickstart](/docs/getting-started/quickstart) to run your first task in five minutes
- [Architecture](/docs/getting-started/architecture) for the system diagram
- [Status and maturity](/docs/resources/status) for honest feature labels
`);

  write_mdx("getting-started/quickstart", {
    title: "Quickstart",
    description: "Install techtide-swarm and run your first swarm task in five minutes.",
    section: "Getting started",
    order: 2,
    slug: "getting-started/quickstart",
  }, `
## Prerequisites

- Python 3.10+
- An Anthropic API key or OpenRouter key with tool-capable models

## Install

\`\`\`bash
pip install techtide-swarm==0.2.2
\`\`\`

## Initialize a project

\`\`\`bash
swarm init
\`\`\`

This creates \`.swarm/\` with memory index, topics directory, and installs the bundled compact roster.

## Run a demo

\`\`\`bash
swarm demo
\`\`\`

Runs a 60-second simulation without API keys.

## Run a real task

\`\`\`bash
export ANTHROPIC_API_KEY=sk-ant-...
swarm run "Summarize our Q2 pipeline risks" --layer research --budget 5
\`\`\`

## Start the HTTP API

\`\`\`bash
export SWARM_API_KEY=your-secret
swarm serve --port 8000
\`\`\`

Visit \`http://localhost:8000/docs\` for the interactive OpenAPI UI.

## Try it live

Use the [live demo](https://swarm357.techtideai.io/#try-it-live) on the landing page (simulated runs via same-origin BFF).
`);

  write_mdx("getting-started/installation", {
    title: "Installation",
    description: "Install from PyPI, editable dev install, Docker, and optional Memvid bridge build.",
    section: "Getting started",
    order: 3,
    slug: "getting-started/installation",
  }, `
## PyPI install

\`\`\`bash
pip install "techtide-swarm[dev]==0.2.2"
\`\`\`

## Editable install from source

\`\`\`bash
git clone https://github.com/TechTideOhio/swarm-357
cd swarm-357
pip install -e "packages/techtide-swarm[dev]"
\`\`\`

## Optional: Memvid bridge

\`\`\`bash
cd packages/memvid-swarm-bridge
cargo build --release
export MEMVID_SWARM_BRIDGE=$(pwd)/target/release/memvid-swarm-bridge
\`\`\`

See [Memvid bridge guide](/docs/guides/memvid-bridge).

## Docker

\`\`\`bash
docker build -t swarm357-api .
docker run --rm -p 8000:8000 -e SWARM_API_KEY=dev swarm357-api
\`\`\`

See [Docker deployment](/docs/deployment/docker).

## Verify install

\`\`\`bash
swarm status
swarm boot
\`\`\`

Expect 357 agents loaded from the compact roster.
`);

  write_mdx("getting-started/first-run", {
    title: "Your first run",
    description: "Boot the roster, execute a layer task, and inspect the checkpoint.",
    section: "Getting started",
    order: 4,
    slug: "getting-started/first-run",
  }, `
## Boot the swarm

\`\`\`bash
swarm boot
\`\`\`

Loads all 357 agent identities from \`config/swarm-compact.yaml\`.

## Run a single-layer task

\`\`\`bash
swarm run "Draft a tier-1 support macro for password reset" --layer support --budget 2
\`\`\`

Default fan-out selects **one agent per role** with a hard cap (\`SWARM_LAYER_MAX_AGENTS\`, default 16).

## Inspect the run

\`\`\`bash
swarm inspect <run_id>
\`\`\`

Shows \`RunState\`: steps, costs, approvals, and cancel flag.

## Resume or cancel

\`\`\`bash
swarm resume <run_id>
swarm cancel <run_id>
\`\`\`

Cancel persists \`cancel_requested\` on the checkpoint so a new process can honor it.

## Simulate without keys

\`\`\`bash
swarm run "test" --simulate
\`\`\`

Explicit simulation. The runtime does not silently succeed without credentials.
`);

  write_mdx("getting-started/core-concepts", {
    title: "Core concepts",
    description: "Layers, roles, souls, checkpoints, memory, and cost control fundamentals.",
    section: "Getting started",
    order: 5,
    slug: "getting-started/core-concepts",
  }, `
## 357 roles, not 357 sessions

The roster defines **357 distinct agent identities**. The Conductor routes work to the right layer and role. Default execution does not spawn 357 parallel LLM calls.

## Layers

| Layer | Agents | Purpose |
|-------|-------:|---------|
| Management | 10 | Conductor, memory curator, cost controller, QA |
| Sales | 62 | CRM, outreach, SDR, deal closing |
| Support | 55 | Tier 1/2, KB, escalation |
| Marketing | 68 | Content, social, campaigns |
| SEO | 47 | Keywords, technical SEO, links |
| Research | 58 | Market, competitor, product research |
| Operations | 57 | Projects, finance, infra, automation |

## SOUL templates

Each role has a markdown SOUL file with mission, workflows, and output schemas. See [Roster overview](/docs/roster/overview).

## Memory

1. \`.swarm/MEMORY.md\` pointer index
2. \`.swarm/topics/\` flat JSON entries
3. Optional Memvid \`.mv2\` per layer via the Rust bridge

## Cost control

\`CostController\` tracks layer spend. At 80% of a layer budget, the runtime may downgrade to Haiku and logs \`model_downgrade\` telemetry.

## Checkpoints

\`RunState\` is persisted to SQLite (\`.swarm/checkpoints.db\`) for inspect, resume, replay, and fork.
`);

  write_mdx("getting-started/architecture", {
    title: "Architecture",
    description: "How the Conductor, layers, memory, and observability fit together.",
    section: "Getting started",
    order: 6,
    slug: "getting-started/architecture",
  }, `
## High-level flow

1. **Task** enters via CLI or HTTP API
2. **Conductor** (management layer) parses routing intent
3. **Layer executor** dispatches agents with role-aware SOUL prompts
4. **Tools** run through the registry (Read, Write, Bash, WebSearch, MCP)
5. **Memory** writes to topics or Memvid
6. **Checkpoint** saves \`RunState\`; **SSE** streams events to clients

![Architecture diagram](/assets/architecture.png)

## Components

| Component | Location | Role |
|-----------|----------|------|
| Python package | \`techtide-swarm\` | Agent, Swarm, CLI, FastAPI server |
| Memvid bridge | \`memvid-swarm-bridge\` | Rust CLI for \`.mv2\` memory |
| Landing site | Separate Next.js repo | Marketing, docs, live demo BFF |
| Config | \`swarm-compact.yaml\` | 357-role roster |

## Request lifecycle

Write operations require \`X-SWARM-API-KEY\` when \`SWARM_API_KEY\` is set. SSE streams end with \`stream.end\` on terminal run status.

See [HTTP API overview](/docs/api/overview) and [Streaming events](/docs/guides/streaming-events).
`);
}

function generate_from_core_doc(slug: string, title: string, description: string, section: string, order: number, core_path: string) {
  const md = read_core(core_path);
  write_mdx(slug, { title, description, section, order, slug }, md_to_mdx(md));
}

function generate_guides() {
  const guides = [
    ["guides/running-a-task", "Running a task", "Execute tasks via CLI and HTTP API with budgets and layer selection.", "Guides", 1, `
Use \`swarm run\` or \`POST /api/swarm/run\` to execute work.

\`\`\`bash
swarm run "Research competitor pricing" --layer research --budget 10
\`\`\`

## Options

| Flag | Default | Description |
|------|---------|-------------|
| \`--layer\` | auto | Target business layer |
| \`--budget\` | 25.0 | Max USD for the run |
| \`--simulate\` | off | Stub execution without API |
| \`--full-fanout\` | off | All role clones (dangerous) |

## HTTP

\`\`\`bash
curl -X POST http://localhost:8000/api/swarm/run \\
  -H "X-SWARM-API-KEY: $SWARM_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"task":"Hello","budget_usd":5,"simulate":true}'
\`\`\`
`],
    ["guides/layer-routing", "Layer routing", "How the Conductor routes tasks to business layers.", "Guides", 2, `
The Conductor agent parses natural-language tasks into structured routing JSON. Layers receive work based on intent keywords and configured defaults.

## Default fan-out

One agent per role, capped by \`SWARM_LAYER_MAX_AGENTS\` (default 16). Full fan-out requires \`--full-fanout\` or \`SWARM_UNSAFE_FULL_FANOUT=1\`.

## Layer budgets

Each layer has a daily limit in \`swarm-compact.yaml\`. See [Cost control](/docs/guides/cost-control).
`],
    ["guides/cost-control", "Cost control and budgets", "Layer budgets, run caps, and model downgrade behavior.", "Guides", 3, `
## CostController

Tracks spend per layer. At 80% of layer budget, may force Haiku and emit \`model_downgrade\` telemetry.

## Run budget cap

\`SWARM_MAX_RUN_BUDGET_USD\` (default 500) caps HTTP request budgets.

## Per-agent budgets

Each role in the roster has \`budget_usd\`. Enforcement is Beta; layer totals are authoritative for downgrade.

## Reports

\`\`\`bash
swarm cost
curl http://localhost:8000/api/swarm/cost
\`\`\`
`],
    ["guides/flat-file-memory", "Flat-file memory", "Share and recall knowledge via .swarm/topics/.", "Guides", 4, `
\`\`\`python
from techtide_swarm import MemoryManager

mem = MemoryManager()
mem.share(from_agent="a", to_agent="b", key="lead/acme", content="Notes...")
hits = mem.recall(agent_name="b", query="acme")
\`\`\`

Topics are JSON files under \`.swarm/topics/\`. \`.swarm/MEMORY.md\` is the pointer index.
`],
    ["guides/memvid-bridge", "Memvid bridge", "Portable .mv2 memory via the Rust bridge binary.", "Guides", 5, md_to_mdx(read_core("docs/MEMVID_BRIDGE.md"))],
    ["guides/bash-security-gate", "Bash security gate", "13-pattern Bash validator and server-mode defaults.", "Guides", 6, `
\`BashSecurityGate\` blocks destructive and exfiltration-shaped commands before execution.

## Server defaults

- Bash denied unless \`SWARM_ALLOW_BASH=1\`
- \`SWARM_HITL_BASH\` requires approval in server/production

## Validate

\`\`\`python
from techtide_swarm import BashSecurityGate
ok, reason = BashSecurityGate().validate("rm -rf /")
\`\`\`

See [Bash policy](/docs/security/bash-policy).
`],
    ["guides/hitl-approvals", "Human-in-the-loop approvals", "Approve or reject Bash commands before execution.", "Guides", 7, `
When \`SWARM_HITL_BASH=1\`, Bash tool calls create an \`ApprovalRecord\` and block until resolved.

\`\`\`bash
swarm approve <approval_id>
swarm reject <approval_id> --reason "Not allowed"
\`\`\`

HTTP: \`POST /api/swarm/approvals/{id}/approve\` and \`/reject\`.

Timeout defaults to 300s (\`SWARM_HITL_TIMEOUT_SEC\`).
`],
    ["guides/checkpoints-resume", "Checkpoints and resume", "Durable RunState in SQLite for inspect and resume.", "Guides", 8, `
Checkpoints store full \`RunState\` JSON in \`.swarm/checkpoints.db\`.

\`\`\`bash
swarm inspect <run_id>
swarm resume <run_id>
\`\`\`

\`cancel_requested\` persists across processes.
`],
    ["guides/replay-fork", "Replay and fork", "Re-run or branch from prior checkpoints.", "Guides", 9, `
\`\`\`bash
swarm replay <run_id>
swarm fork <run_id> --edit-task "Revised objective"
\`\`\`

Fork creates a new run with optional task edit and \`parent_run_id\` linkage.
`],
    ["guides/streaming-events", "Streaming events", "SSE event types, auth, and stream.end semantics.", "Guides", 10, `
\`\`\`bash
curl -N -H "X-SWARM-API-KEY: $SWARM_API_KEY" \\
  http://localhost:8000/api/swarm/runs/<run_id>/events
\`\`\`

Event types: \`run.started\`, \`step.completed\`, \`approval.required\`, \`cost.update\`, \`stream.end\`.

Auth required when \`SWARM_API_KEY\` is set.
`],
    ["guides/telemetry-traces", "Telemetry and traces", "JSONL telemetry, traces, and optional OpenTelemetry export.", "Guides", 11, `
- \`.swarm/telemetry.jsonl\` for agent runs and cost events
- \`.swarm/traces.jsonl\` for span records
- \`SWARM_OTEL_EXPORT=1\` for optional OTel export

Opik cloud is **not implemented**. Local JSONL is the source of truth.
`],
    ["guides/ultraplan", "UltraPlan", "Deep Opus-class planning sessions.", "Guides", 12, `
\`\`\`bash
swarm plan "Launch Q3 campaign" --model opus
\`\`\`

\`\`\`python
from techtide_swarm import UltraPlan, UltraPlanConfig
plan = UltraPlan(UltraPlanConfig(max_budget_usd=10))
result = await plan.plan("Your objective")
\`\`\`
`],
    ["guides/dream-cycle", "Dream cycle", "Experimental memory consolidation heuristics.", "Guides", 13, `
\`\`\`bash
swarm dream
swarm dream --migrate
\`\`\`

Status: **Experimental**. Not guaranteed to consolidate or prune memory quality.
`],
  ];

  for (const entry of guides) {
    const [slug, title, description, section, order, body] = entry as [string, string, string, string, number, string];
    write_mdx(slug, { title, description, section, order, slug }, body);
  }
}

function generate_cli_api_sdk() {
  write_mdx("cli/overview", { title: "CLI overview", description: "The swarm command-line interface entry point and global conventions.", section: "CLI reference", order: 1, slug: "cli/overview" }, `
All commands are invoked as \`swarm <command>\`. Entry point: \`techtide_swarm.cli:main\`.

\`\`\`bash
swarm --help
\`\`\`

Config resolution: \`SWARM_CONFIG_PATH\` or bundled \`swarm-compact.yaml\` from the wheel.
`);

  write_mdx("cli/init-demo-status", { title: "init, demo, status", description: "Project setup, simulation demo, and health dashboard.", section: "CLI reference", order: 2, slug: "cli/init-demo-status" }, `
| Command | Description |
|---------|-------------|
| \`swarm init\` | Create \`.swarm/\`, install config and souls |
| \`swarm demo\` | 60-second simulation without API keys |
| \`swarm status\` | Health dashboard; \`--json\` for machine output |
| \`swarm status --config path\` | Use alternate roster YAML |
`);

  write_mdx("cli/run-boot-agent", { title: "run, boot, agent", description: "Execute tasks, boot the roster, and inspect individual agents.", section: "CLI reference", order: 3, slug: "cli/run-boot-agent" }, `
\`\`\`bash
swarm boot
swarm run "task" --layer sales --budget 25 --max-parallel 10
swarm agent --list
swarm agent sales-outreach-specialist-001 --info
swarm agent sales-outreach-specialist-001 --run "Draft email"
\`\`\`
`);

  write_mdx("cli/inspect-resume-cancel", { title: "inspect, resume, cancel", description: "Checkpoint inspection and run lifecycle control.", section: "CLI reference", order: 4, slug: "cli/inspect-resume-cancel" }, `
\`\`\`bash
swarm inspect <run_id>
swarm resume <run_id>
swarm cancel <run_id>
\`\`\`
`);

  write_mdx("cli/approve-reject", { title: "approve, reject", description: "Resolve Bash HITL approval requests.", section: "CLI reference", order: 5, slug: "cli/approve-reject" }, `
\`\`\`bash
swarm approve <approval_id> --reason "Reviewed"
swarm reject <approval_id> --reason "Policy violation"
\`\`\`
`);

  write_mdx("cli/replay-fork", { title: "replay, fork", description: "Replay prior runs or fork with an edited task.", section: "CLI reference", order: 6, slug: "cli/replay-fork" }, `
\`\`\`bash
swarm replay <run_id>
swarm fork <run_id> --edit-task "New objective"
\`\`\`
`);

  write_mdx("cli/dream-migrate-plan", { title: "dream, migrate, plan", description: "Memory dream cycle, Memvid migration, and UltraPlan.", section: "CLI reference", order: 7, slug: "cli/dream-migrate-plan" }, `
\`\`\`bash
swarm dream [--migrate]
swarm migrate --layer research --dest .swarm/layer-research.mv2
swarm plan "Objective" --model opus
\`\`\`
`);

  write_mdx("cli/eval-serve", { title: "eval, serve", description: "Run the eval harness and start the HTTP API server.", section: "CLI reference", order: 8, slug: "cli/eval-serve" }, `
\`\`\`bash
swarm eval --save-baseline --compare
swarm serve --host 0.0.0.0 --port 8000 [--reload]
\`\`\`

OpenAPI docs at \`/docs\` when the server is running.
`);

  write_mdx("cli/cost", { title: "cost", description: "Show swarm cost report from CostController.", section: "CLI reference", order: 9, slug: "cli/cost" }, `\`\`\`bash\nswarm cost\n\`\`\``);

  write_mdx("cli/mcp", { title: "mcp", description: "List and connect MCP servers from config/mcp/.", section: "CLI reference", order: 10, slug: "cli/mcp" }, `
\`\`\`bash
swarm mcp list [--config-dir config/mcp]
swarm mcp connect <server> [--config-dir config/mcp]
\`\`\`
`);

  // API reference pages
  const api_pages = [
    ["api/overview", "API overview", "FastAPI HTTP surface for swarm orchestration.", "API reference", 1, `
Base URL: \`http://localhost:8000\` (or your deployment). Interactive docs: \`/docs\`, schema: \`/openapi.json\`.

## Route groups

- Health and status (no auth)
- Agents and runs (read mostly open; writes require key)
- Approvals and execution (write key)
`],
    ["api/authentication", "Authentication", "X-SWARM-API-KEY header and production fail-closed behavior.", "API reference", 2, `
Set \`SWARM_API_KEY\` on the server. Clients send \`X-SWARM-API-KEY\` on write routes.

Production (\`SWARM_ENV=production\`, \`SWARM_REQUIRE_AUTH=1\`, or \`RAILWAY_ENVIRONMENT\`) fails closed without a key (503).
`],
    ["api/errors", "Errors and status codes", "HTTP status code mapping for API errors.", "API reference", 3, `
| Code | When |
|------|------|
| 400 | Validation, routing, budget errors |
| 401 | Invalid or missing API key |
| 404 | Unknown agent, run, or approval |
| 429 | Rate limit exceeded |
| 500 | Unhandled execution error |
| 503 | Missing config or auth not configured |
`],
    ["api/rate-limits", "Rate limits", "Per-IP sliding window rate limiting.", "API reference", 4, `
\`SWARM_RATE_LIMIT_PER_MINUTE\` (default 120). Set \`0\` to disable. Returns 429 with \`{"detail":"Rate limit exceeded"}\`.
`],
    ["api/health-status", "Health and status", "Health probe and swarm status endpoints.", "API reference", 5, `
\`GET /api/health\` returns version, agent count, auth flags.

\`GET /api/swarm/status\` returns layer health and total cost.
`],
    ["api/agents", "Agents", "List and inspect agent definitions.", "API reference", 6, `
\`GET /api/swarm/agents\` lists roster entries.

\`GET /api/swarm/agents/{name}\` returns detail including \`soul_preview\` (first 500 chars).
`],
    ["api/runs", "Runs", "List, inspect, resume, cancel, replay, and fork runs.", "API reference", 7, `
| Method | Path | Auth |
|--------|------|------|
| GET | /api/swarm/runs | No |
| GET | /api/swarm/runs/{id} | No |
| POST | /api/swarm/runs/{id}/resume | Write |
| POST | /api/swarm/runs/{id}/cancel | Write |
| POST | /api/swarm/runs/{id}/replay | Write |
| POST | /api/swarm/runs/{id}/fork | Write |
`],
    ["api/sse-events", "SSE event stream", "Server-sent events for run progress.", "API reference", 8, `
\`GET /api/swarm/runs/{id}/events\` returns \`text/event-stream\`.

Requires write key when \`SWARM_API_KEY\` is set. Ends with \`event: stream.end\`.
`],
    ["api/approvals-execution", "Approvals and execution", "HITL approvals and run execution endpoints.", "API reference", 9, `
\`POST /api/swarm/approvals/{id}/approve\` and \`/reject\`

\`POST /api/swarm/run\` body: \`{ task, budget_usd, layer?, simulate, full_fanout }\`

\`POST /api/agent/run\` body: \`{ agent_name, task }\`
`],
  ];

  for (const entry of api_pages) {
    const [slug, title, description, section, order, body] = entry as [string, string, string, string, number, string];
    write_mdx(slug, { title, description, section, order, slug }, body);
  }

  // SDK pages
  const sdk_pages = [
    ["sdk/overview", "SDK overview", "Python package exports and installation.", "Python SDK", 1, `
\`\`\`python
from techtide_swarm import (
    Agent, AgentConfig, Swarm, CostController,
    MemoryManager, MemvidBridge, BashSecurityGate,
    UltraPlan, UltraPlanConfig,
)
\`\`\`
`],
    ["sdk/agent", "Agent and AgentConfig", "Single-agent runner configuration and results.", "Python SDK", 2, `
\`\`\`python
from techtide_swarm import Agent, AgentConfig
from techtide_swarm.core.types import LayerType

config = AgentConfig(
    name="research-market-001",
    layer=LayerType.RESEARCH,
    role="market_researcher",
    soul="templates/soul/research/market-analyst.md",
    tools=["WebSearch", "Read", "Write"],
    model="sonnet",
    budget_limit_usd=1.0,
)
agent = Agent(config)
result = await agent.run("Analyze the CRM market")
\`\`\`
`],
    ["sdk/swarm", "Swarm", "Full swarm orchestration from YAML config.", "Python SDK", 3, `
\`\`\`python
from techtide_swarm import Swarm

swarm = Swarm.from_config("config/swarm-compact.yaml")
await swarm.boot()
result = await swarm.execute("Research Q2 trends", budget_usd=25)
\`\`\`
`],
    ["sdk/cost-controller", "CostController", "Layer spend tracking and model downgrade.", "Python SDK", 4, `See [Cost control guide](/docs/guides/cost-control).`],
    ["sdk/memory-manager", "MemoryManager", "Flat-file and Memvid memory operations.", "Python SDK", 5, `See [Flat-file memory](/docs/guides/flat-file-memory).`],
    ["sdk/memvid-bridge", "MemvidBridge", "Rust bridge subprocess wrapper.", "Python SDK", 6, `See [Memvid bridge](/docs/guides/memvid-bridge).`],
    ["sdk/bash-security-gate", "BashSecurityGate", "Bash command pattern validator.", "Python SDK", 7, `See [Bash security gate](/docs/guides/bash-security-gate).`],
    ["sdk/approval-gate", "ApprovalGate", "HITL approval workflow for Bash.", "Python SDK", 8, `Use \`swarm approve\` / \`swarm reject\` or HTTP APIs. Internal: \`techtide_swarm.runtime.hitl.get_approval_gate()\`.`],
    ["sdk/tool-registry", "ToolRegistry", "Tool registration and Anthropic schema export.", "Python SDK", 9, `Built-in tools: Read, Write, Bash, WebSearch, Scrape, Memory, plus dynamic MCP tools.`],
    ["sdk/ultraplan", "UltraPlan", "Deep planning with Opus-class models.", "Python SDK", 10, `See [UltraPlan guide](/docs/guides/ultraplan).`],
  ];

  for (const entry of sdk_pages) {
    const [slug, title, description, section, order, body] = entry as [string, string, string, string, number, string];
    write_mdx(slug, { title, description, section, order, slug }, body);
  }
}

function generate_config_deploy_security_evals_resources() {
  write_mdx("configuration/roster-yaml", { title: "Roster YAML", description: "Compact roster format and layer role definitions.", section: "Configuration", order: 1, slug: "configuration/roster-yaml" }, `
\`config/swarm-compact.yaml\` defines roles with \`count\`, expanded at runtime.

\`\`\`yaml
layers:
  sales:
    roles:
      outreach_specialist: { count: 15, model: sonnet, budget_usd: 1.0, tools: [WebSearch, Read, Write] }
    soul: templates/soul/sales/outreach-specialist.md
\`\`\`

Validate: \`python scripts/generate_roster.py --compact --fix-counts\`
`);

  write_mdx("configuration/environment-variables", { title: "Environment variables", description: "Complete environment variable reference for Swarm 357.", section: "Configuration", order: 2, slug: "configuration/environment-variables" }, `
| Variable | Default | Description |
|----------|---------|-------------|
| ANTHROPIC_API_KEY | - | Anthropic API key |
| OPENROUTER_API_KEY | - | OpenRouter key (preferred when set) |
| ANTHROPIC_BASE_URL | - | Provider base URL |
| SWARM_API_KEY | - | HTTP write auth secret |
| SWARM_REQUIRE_AUTH | off | Force auth in all environments |
| SWARM_ENV | - | Set to production for fail-closed |
| SWARM_ALLOW_BASH | off | Enable Bash tool |
| SWARM_HITL_BASH | on in server | Bash approval gate |
| SWARM_UNSAFE_FS | off | Disable Read/Write confinement |
| SWARM_WORKSPACE_ROOT | CWD | Filesystem safe root |
| SWARM_CONFIG_PATH | search order | Roster YAML path |
| SWARM_CHECKPOINT_DIR | .swarm | Checkpoint SQLite dir |
| SWARM_LAYER_MAX_AGENTS | 16 | Layer fan-out cap |
| SWARM_MAX_RUN_BUDGET_USD | 500 | HTTP budget cap |
| SWARM_RATE_LIMIT_PER_MINUTE | 120 | Per-IP rate limit |
| SWARM_MODEL_OPUS | claude-opus-4-6 | Opus model ID |
| SWARM_MODEL_SONNET | claude-sonnet-4-6 | Sonnet model ID |
| SWARM_MODEL_HAIKU | claude-haiku-4-5 | Haiku model ID |
| SWARM_OPENROUTER_CHEAP | off | Explicit Haiku remap on OpenRouter |
| MEMVID_SWARM_BRIDGE | PATH | Memvid binary path |
| SWARM_OTEL_EXPORT | off | OpenTelemetry export |
| SWARM_EVAL_BUDGET_USD | 5.0 | Eval spend cap |
| SUPABASE_URL | - | Optional persistence |
| SUPABASE_SERVICE_KEY | - | Supabase service role |
`);

  write_mdx("configuration/models", { title: "Model IDs and providers", description: "Anthropic direct and OpenRouter provider configuration.", section: "Configuration", order: 3, slug: "configuration/models" }, `
Short names: \`opus\`, \`sonnet\`, \`haiku\`. Override via \`SWARM_MODEL_*\` env vars.

OpenRouter: set \`OPENROUTER_API_KEY\` and \`ANTHROPIC_BASE_URL=https://openrouter.ai/api\`.

\`SWARM_OPENROUTER_CHEAP=1\` opts into Haiku remap. Otherwise mapping is honest.
`);

  write_mdx("configuration/mcp-servers", { title: "MCP servers", description: "Model Context Protocol server configuration.", section: "Configuration", order: 4, slug: "configuration/mcp-servers" }, `
YAML files in \`config/mcp/\`: firecrawl, github, supabase examples.

\`swarm mcp list\` and \`swarm mcp connect <name>\`
`);

  write_mdx("configuration/runtime-files", { title: "Runtime files", description: "Files and directories under .swarm/ at runtime.", section: "Configuration", order: 5, slug: "configuration/runtime-files" }, `
| Path | Purpose |
|------|---------|
| .swarm/MEMORY.md | Memory pointer index |
| .swarm/topics/ | Flat JSON memory entries |
| .swarm/checkpoints.db | SQLite run state |
| .swarm/telemetry.jsonl | Cost and run events |
| .swarm/traces.jsonl | Span traces |
| .swarm/layer-*.mv2 | Memvid stores |
`);

  generate_from_core_doc("deployment/railway", "Railway", "Deploy Swarm 357 API and landing on Railway.", "Deployment", 2, "docs/DEPLOY_RAILWAY.md");
  generate_from_core_doc("deployment/supabase", "Supabase data plane", "Optional Supabase persistence layer.", "Deployment", 3, "docs/DATA_PLANE.md");
  write_mdx("deployment/docker", { title: "Docker", description: "Container build and run for the API server.", section: "Deployment", order: 1, slug: "deployment/docker" }, `
## Build

\`\`\`bash
docker build -t swarm357-api .
\`\`\`

The multi-stage Dockerfile installs \`techtide-swarm[supabase]\`, copies \`config/\` and \`templates/\`, and runs as a non-root \`swarm\` user.

## Run locally

\`\`\`bash
docker run --rm -p 8000:8000 \\
  -e SWARM_API_KEY=dev \\
  -e SWARM_REQUIRE_AUTH=1 \\
  swarm357-api
\`\`\`

## Health check

The image defines a \`HEALTHCHECK\` against \`/api/health\`. Railway and other platforms should use the same probe.

## Environment

| Variable | Purpose |
|----------|---------|
| PORT | HTTP port (default 8000) |
| SWARM_CONFIG_PATH | Roster YAML path |
| SWARM_SERVER_MODE | Disables destructive local tools |
| SWARM_CHECKPOINT_DIR | Writable checkpoint directory |
`);
  write_mdx("deployment/production-checklist", { title: "Production checklist", description: "Pre-launch verification for production deployments.", section: "Deployment", order: 4, slug: "deployment/production-checklist" }, `
- [ ] Set \`SWARM_API_KEY\` and \`SWARM_REQUIRE_AUTH=1\`
- [ ] Restrict CORS via \`ALLOWED_ORIGINS\`
- [ ] Keep Bash disabled or HITL-enabled
- [ ] Set rate limits
- [ ] Verify \`/api/health\` returns agents=357
- [ ] Run [verification scorecard](/docs/resources/verification)
`);

  generate_from_core_doc("security/security-model", "Security model", "Supported versions, reporting, and posture summary.", "Security", 1, "SECURITY.md");
  write_mdx("security/bash-policy", { title: "Bash policy", description: "BashSecurityGate patterns and server defaults.", section: "Security", order: 2, slug: "security/bash-policy" }, `Pattern-based gate with 13 block rules. Not a sandbox. See [Bash security gate](/docs/guides/bash-security-gate).`);
  write_mdx("security/filesystem", { title: "Filesystem confinement", description: "Read/Write workspace root restrictions.", section: "Security", order: 3, slug: "security/filesystem" }, `\`SWARM_WORKSPACE_ROOT\` or CWD. Opt out with \`SWARM_UNSAFE_FS=1\` (not recommended in production).`);
  write_mdx("security/authentication", { title: "Authentication", description: "Shared-secret API key authentication model.", section: "Security", order: 4, slug: "security/authentication" }, `See [API authentication](/docs/api/authentication). Shared secret, not multi-tenant IAM.`);
  generate_from_core_doc("security/enterprise-controls", "Enterprise controls", "Enterprise security and governance mapping.", "Security", 5, "docs/ENTERPRISE_CONTROLS.md");

  generate_from_core_doc("evals/methodology", "Eval methodology", "Keyword, length, LLM judge, and budget gates.", "Evals", 1, "docs/EVALS.md");
  write_mdx("evals/task-catalog", { title: "Task catalog", description: "25 eval tasks across layers and modes.", section: "Evals", order: 2, slug: "evals/task-catalog" }, `20 single-agent and 5 swarm tasks in \`evals/tasks.yaml\`. Layers: research, sales, support, marketing, seo, operations, management.`);
  write_mdx("evals/latest-baseline", { title: "Latest baseline", description: "Current eval baseline metrics from latest.json.", section: "Evals", order: 3, slug: "evals/latest-baseline" }, `
![Eval results](/assets/eval-results.svg)

| Metric | Value |
|--------|------:|
| Executions | 154 |
| Passed gates | 145 |
| Avg combined score | 0.923 |
| Spend | $4.99 / $5.00 |
| Single-agent pass | 142/142 |
| Swarm pass | 4/12 |

Swarm timeouts: 8 of 12 swarm runs hit wall-clock limits. Single-agent + tools is the production demo path.
`);
  write_mdx("evals/reproducing", { title: "Reproducing evals", description: "Commands to run and compare eval baselines.", section: "Evals", order: 4, slug: "evals/reproducing" }, `
\`\`\`bash
pip install -e "packages/techtide-swarm[dev]"
export OPENROUTER_API_KEY=...
export SWARM_EVAL_BUDGET_USD=5.0
swarm eval --save-baseline --compare
\`\`\`
`);

  generate_from_core_doc("resources/status", "Status and maturity", "Feature maturity matrix for Swarm 357.", "Resources", 1, "STATUS.md");
  generate_from_core_doc("resources/verification", "Verification scorecard", "Executable acceptance criteria for releases.", "Resources", 2, "docs/VERIFY.md");
  generate_from_core_doc("resources/comparison", "Comparison", "How Swarm 357 compares to other frameworks.", "Resources", 3, "docs/COMPARISON.md");
  generate_from_core_doc("resources/roadmap", "Roadmap", "Planned features and backlog.", "Resources", 4, "ROADMAP.md");
  generate_from_core_doc("resources/contributing", "Contributing", "Development setup and contribution guidelines.", "Resources", 5, "CONTRIBUTING.md");
  generate_from_core_doc("resources/release", "Release process", "Versioning, tagging, and PyPI publish workflow.", "Resources", 6, "RELEASE.md");
  write_mdx("resources/design", { title: "Design system", description: "Tokens, class tiers, interaction rules, and content standards for the Swarm 357 product surface.", section: "Resources", order: 7, slug: "resources/design" }, `
The product surface follows a documented design system. The full reference is \`DESIGN.md\` at the root of the landing repository, [TechTideOhio/swarm-357-site](${SITE_REPO_URL}).

## Principles

1. **Honest before impressive.** Copy and maturity labels mirror [status and maturity](/docs/resources/status) rather than marketing ambition.
2. **One accent, used sparingly.** A single yellow accent carries calls to action and active states.
3. **Tokens over literals.** Components consume CSS variables and exported class strings.
4. **Interaction is a system.** Hover, press, focus, and motion behave the same way on marketing and documentation surfaces.
5. **Motion is optional.** Every animation has a reduced-motion path.

## Color tokens

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| Background | \`#ffffff\` | \`#0a0a0a\` | Page and panel base |
| Foreground | \`#0a0a0a\` | \`#fafafa\` | Body text |
| Muted | \`#f5f5f5\` | \`#171717\` | Secondary surfaces |
| Border | \`#e5e5e5\` | \`#262626\` | Hairlines |
| Accent | \`#ffd900\` | \`#ffd900\` | Calls to action, active nav |
| Ring | \`#0066ff\` | \`#3b82f6\` | Focus outlines |

The accent is constant across themes and always pairs with black text. The focus ring differs per theme so it stays visible on both backgrounds.

## Typography

Geist Sans for interface and body, Geist Mono for code and metrics, both self-hosted through \`next/font\`. Headings use medium weight with tight tracking; emphasis comes from size and spacing rather than bold weights.

## Class tiers

Canonical class strings live in \`lib/ui-classes.ts\`. Tier A covers marketing chrome (header, landing sections, footer). Tier B covers documentation and long-form reading. A shared group provides press feedback, card hover, and 44px touch targets.

## Interaction states

| State | Behavior |
|-------|----------|
| Hover | Color or brightness shift; cards lift; buttons morph toward a pill |
| Press | \`active:scale-[0.96]\` on buttons, reduced opacity on links |
| Focus | 2px ring outline at 2px offset, on \`:focus-visible\` only |
| Disabled | Half opacity, pointer events off, press and morph suppressed |

Exactly one primary call to action per page carries the accent glow.

## Accessibility

Visible focus on every interactive element, 44px minimum hit areas, a skip link to main content, focus trapping and scroll locking in dialogs, and \`text-base\` inputs on small screens to prevent iOS zoom.

## Content standards

Public copy contains no em dashes or en dashes. Numbers shown on the site come from generated data rather than hand-written prose. Both rules are enforced in CI by \`bun run check:content\`.

## Related

- [Contributing](/docs/resources/contributing)
- [Status and maturity](/docs/resources/status)
- [Verification scorecard](/docs/resources/verification)
`);

  write_mdx("resources/glossary", { title: "Glossary", description: "Key terms used across Swarm 357 documentation.", section: "Resources", order: 8, slug: "resources/glossary" }, `
| Term | Definition |
|------|------------|
| SOUL | Role template markdown with persona and workflows |
| Conductor | Management agent that routes tasks to layers |
| HITL | Human-in-the-loop approval for Bash commands |
| Memvid | Single-file .mv2 portable memory format |
| Compact roster | YAML format with role counts instead of 357 flat entries |
`);
  write_mdx("resources/faq", { title: "FAQ", description: "Frequently asked questions about Swarm 357.", section: "Resources", order: 9, slug: "resources/faq" }, `
## Is this 357 parallel Opus sessions?

No. 357 is the role catalog size. Default execution uses one agent per role with a cap.

## Do I need Memvid?

No. Flat-file memory works without the bridge. Memvid adds portable .mv2 recall.

## Is Opik supported?

Opik cloud is not implemented. Use local JSONL traces.

## What models work on OpenRouter?

Use tool-capable models. Free Llama models fail tool calling. Haiku works for judges; Sonnet-4 for agents in baselines.
`);
}

function generate_roster_pages() {
  write_mdx("roster/overview", { title: "Roster overview", description: "The 357-agent catalog across seven business layers.", section: "Roster", order: 1, slug: "roster/overview" }, `
Total: **357 agents** across 41 unique role types.

| Layer | Count |
|-------|------:|
| Management | 10 |
| Sales | 62 |
| Support | 55 |
| Marketing | 68 |
| SEO | 47 |
| Research | 58 |
| Operations | 57 |

Each role has a SOUL template with mission, workflows, and output schemas.
`);

  const layers = [
    ["management", "Management layer", 10, "Conductor, strategists, memory curator, QA, cost control"],
    ["sales", "Sales layer", 62, "CRM, outreach, SDR, funnel analysis, deal closing"],
    ["support", "Support layer", 55, "Tier 1/2 resolution, KB, escalation, CSAT"],
    ["marketing", "Marketing layer", 68, "Content, social, ads, email, brand, campaigns"],
    ["seo", "SEO layer", 47, "Keywords, technical SEO, link building, AEO"],
    ["research", "Research layer", 58, "Market, competitor, product research, synthesis"],
    ["operations", "Operations layer", 57, "Projects, finance, infra, automation, data quality"],
  ];

  for (const entry of layers) {
    const [slug, title, count, desc] = entry as [string, string, number, string];
    write_mdx(`roster/${slug}`, { title, description: `${count} agents. ${desc}`, section: "Roster", order: 2, slug: `roster/${slug}` }, `
The **${title}** contains ${count} agent identities.

${desc}

Browse role pages in this section for SOUL template details.
`);
  }

  // Generate role pages from SOUL templates
  const soul_dir = path.join(CORE_ROOT, "templates/soul");
  if (!fs.existsSync(soul_dir)) return;

  function walk_souls(dir: string, layer = "") {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk_souls(full, entry.name);
      } else if (entry.name.endsWith(".md")) {
        const role_slug = entry.name.replace(/\.md$/, "");
        const content = fs.readFileSync(full, "utf8");
        const name_match = content.match(/^name:\s*(.+)$/m);
        const role_key_match = content.match(/^role:\s*(.+)$/m);
        const model_match = content.match(/^model:\s*(.+)$/m);
        const role_title = name_match?.[1]?.trim().replace(/-/g, " ") ?? role_slug.replace(/-/g, " ");
        const role_key = role_key_match?.[1]?.trim() ?? role_slug.replace(/-/g, "_");
        const model = model_match?.[1]?.trim() ?? "sonnet";
        const mission_match = content.match(/## Primary mission\n([\s\S]*?)(?=\n## )/);
        const mission = mission_match?.[1]?.trim().split("\n")[0] ?? "Layer specialist agent.";

        write_mdx(
          `roster/roles/${role_slug}`,
          {
            title: role_title,
            description: `${layer} role: ${role_title}`,
            section: "Roster",
            order: 99,
            slug: `roster/roles/${role_slug}`,
          },
          `
## Overview

**Layer:** ${layer}  
**Role key:** \`${role_key}\`  
**Default model:** \`${model}\`

${mission}

## SOUL template

The full persona, workflows, tool usage, and output schemas for this role live in the bundled SOUL template shipped with \`techtide-swarm\`.

- [Read raw markdown export](/docs/raw/roster/roles/${role_slug})
- [${layer} layer overview](/docs/roster/${layer})

## Related

- [Roster YAML](/docs/configuration/roster-yaml)
- [Running a task](/docs/guides/running-a-task)
`
        );
      }
    }
  }

  walk_souls(soul_dir);
}

/**
 * Blog posts are hand authored. This generator only scaffolds a slug that does
 * not exist yet, so re-running the sync never destroys editorial work.
 * See content/data/blog-keyword-owners.json for the keyword map.
 */
function generate_blog() {
  const seeds: Array<[slug: string, date: string, title: string, description: string]> = [];

  for (const [slug, date, title, description] of seeds) {
    const file_path = path.join(BLOG, `${slug}.mdx`);
    if (fs.existsSync(file_path)) {
      console.log(`  skip ${slug}.mdx (hand authored, already present)`);
      continue;
    }

    write_blog(
      slug,
      { title, description, date, slug },
      `${description}\n\nDraft scaffold. Replace this body before publishing.\n`
    );
  }
}

// Main
console.log("Syncing data from core repo...");
sync_data();
console.log("Generating getting started...");
generate_getting_started();
console.log("Generating guides...");
generate_guides();
console.log("Generating CLI, API, SDK...");
generate_cli_api_sdk();
console.log("Generating config, deploy, security, evals, resources...");
generate_config_deploy_security_evals_resources();
console.log("Generating roster pages...");
generate_roster_pages();
console.log("Checking blog scaffolds (hand authored MDX is source of truth)...");
generate_blog();
console.log("Done.");
