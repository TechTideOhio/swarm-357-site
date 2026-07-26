"use client";

import { motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { postRun, type AgentResult, type SwarmRunResult } from "@/lib/api";
import { easeOut } from "@/lib/motion";
import { useToast } from "@/lib/toast";
import {
  chrome_card_shell,
  chrome_form_control,
  chrome_primary_cta,
} from "@/lib/ui-classes";

const result_panel = `${chrome_card_shell} transition-colors duration-300 hover:border-accent/30`;

type DemoState = "idle" | "running" | "done" | "error" | "auth_required";

interface RunStep {
  agentName: string;
  status: AgentResult["status"];
  output: string;
  costUsd: number;
  latencyMs: number;
}

function StatusDot({ status }: { status: AgentResult["status"] }): ReactNode {
  const colors: Record<AgentResult["status"], string> = {
    success: "bg-accent",
    error: "bg-foreground/40",
    skipped: "bg-muted-foreground",
  };
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${colors[status]}`}
    />
  );
}

function AgentStepRow({ step }: { step: RunStep }): ReactNode {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      className="border-border/40 border-b py-3 last:border-0"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: easeOut }}
    >
      <button
        type="button"
        className="focus-ring hover:bg-foreground/5 active:bg-foreground/10 flex w-full items-center justify-between gap-3 rounded-[3.5px] py-1 text-left transition-colors duration-200"
        onClick={() => setExpanded((p) => !p)}
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3">
          <StatusDot status={step.status} />
          <span className="text-sm font-medium">{step.agentName}</span>
          <span className="text-muted-foreground text-xs tracking-tight">
            {`${step.latencyMs}ms · $${step.costUsd.toFixed(4)}`}
          </span>
        </div>
        <span className="text-muted-foreground text-xs">
          {expanded ? "\u25b2" : "\u25bc"}
        </span>
      </button>
      {expanded && step.output && (
        <p className="text-muted-foreground mt-2 pl-5 text-xs leading-relaxed">
          {step.output.slice(0, 400)}
          {step.output.length > 400 ? "\u2026" : ""}
        </p>
      )}
    </motion.div>
  );
}

export function TryItLive(): ReactNode {
  const [task, setTask] = useState("");
  const [state, setState] = useState<DemoState>("idle");
  const [steps, setSteps] = useState<RunStep[]>([]);
  const [finalOutput, setFinalOutput] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const { showToast } = useToast();

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!task.trim() || state === "running") return;

    setState("running");
    setSteps([]);
    setFinalOutput("");
    setTotalCost(0);
    setErrorMsg("");

    try {
      const result: SwarmRunResult = await postRun(task.trim());

      if (result.status === "error") {
        const message = result.error ?? "Unknown error";
        setErrorMsg(message);
        setState("error");
        showToast(message, "error");
        return;
      }

      for (const r of result.agent_results) {
        setSteps((prev) => [
          ...prev,
          {
            agentName: r.agent_name,
            status: r.status,
            output: r.output,
            costUsd: r.cost_usd,
            latencyMs: r.latency_ms,
          },
        ]);
        await new Promise<void>((res) => setTimeout(res, 120));
      }

      setFinalOutput(result.final_output);
      setTotalCost(result.total_cost_usd);
      setState("done");
    } catch (err: unknown) {
      const code =
        err instanceof Error && "code" in err
          ? String((err as Error & { code?: string }).code ?? "")
          : "";
      const msg = err instanceof Error ? err.message : "Request failed";
      if (code === "auth_required" || /auth required|401|403|503/i.test(msg)) {
        setErrorMsg(msg);
        setState("auth_required");
        showToast(msg, "error");
        return;
      }
      setErrorMsg(msg);
      setState("error");
      showToast(msg, "error");
    }
  }

  return (
    <motion.div
      className="relative z-10 mx-auto w-full max-w-2xl px-6 py-16 md:py-24"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: easeOut }}
    >
      <h2 className="mb-4 text-center text-3xl font-medium tracking-tight md:text-4xl">
        Try it live
      </h2>
      <p className="text-muted-foreground mb-6 text-center text-base">
        Type a business task and watch a simulated route through the swarm. Demo
        writes go through a same-origin BFF. The write key stays server-side, never
        in the browser bundle.
      </p>

      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="try-it-live-task" className="sr-only">
          Business task
        </label>
        <input
          id="try-it-live-task"
          type="text"
          value={task}
          maxLength={500}
          onChange={(e) => setTask(e.target.value)}
          placeholder="e.g. Research the AI market"
          disabled={state === "running"}
          className={`${chrome_form_control} placeholder:text-muted-foreground min-w-0 flex-1`}
          onFocus={(event) => {
            event.currentTarget.scrollIntoView({ block: "nearest", behavior: "smooth" });
          }}
        />
        <button
          type="submit"
          disabled={!task.trim() || state === "running"}
          className={`${chrome_primary_cta} min-h-12 w-full sm:w-auto`}
        >
          {state === "running" ? "Running\u2026" : "Submit"}
        </button>
      </form>

      {steps.length > 0 && (
        <motion.div
          className={`${result_panel} p-4`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="text-muted-foreground mb-3 text-xs font-medium tracking-wider uppercase">
            Agent pipeline
          </p>
          {steps.map((s, i) => (
            <AgentStepRow key={`${s.agentName}-${i}`} step={s} />
          ))}
          {state === "running" && (
            <p className="text-muted-foreground mt-3 animate-pulse text-xs">
              Running{"\u2026"}
            </p>
          )}
        </motion.div>
      )}

      {state === "done" && finalOutput && (
        <motion.div
          className={`${result_panel} mt-4 p-4`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
        >
          <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
            {`Final output · $${totalCost.toFixed(4)} total`}
          </p>
          <p className="text-foreground text-sm leading-relaxed">
            {finalOutput.slice(0, 1000)}
            {finalOutput.length > 1000 ? "\u2026" : ""}
          </p>
        </motion.div>
      )}

      {state === "auth_required" && (
        <motion.div
          className={`${result_panel} mt-4 p-4`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
        >
          <p className="text-foreground mb-1 text-sm font-medium">Auth required</p>
          <p className="text-muted-foreground text-sm">
            {errorMsg ||
              "Set server-only SWARM_API_KEY on the site deploy (Railway). This is not a successful run."}
          </p>
        </motion.div>
      )}

      {state === "error" && (
        <motion.div
          className={`${result_panel} mt-4 p-4`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
        >
          <p className="text-foreground mb-1 text-sm font-medium">Error</p>
          <p className="text-muted-foreground text-sm">{errorMsg}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
