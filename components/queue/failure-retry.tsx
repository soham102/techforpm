"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  CreditCard,
  ServerCrash,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Attempt {
  label: string;
  outcome: "fail" | "retry" | "success" | "reroute";
}

interface Scenario {
  id: string;
  name: string;
  icon: React.ReactNode;
  blurb: string;
  steps: Attempt[];
  insight: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "email",
    name: "Failed email delivery",
    icon: <Mail className="h-4 w-4" />,
    blurb: "The email provider is temporarily unavailable.",
    steps: [
      { label: "Attempt 1 — provider timeout", outcome: "fail" },
      { label: "Wait & retry (backoff 2s)", outcome: "retry" },
      { label: "Attempt 2 — still down", outcome: "fail" },
      { label: "Wait & retry (backoff 8s)", outcome: "retry" },
      { label: "Attempt 3 — email delivered", outcome: "success" },
    ],
    insight:
      "The job is never lost. It waits and retries with growing gaps until the provider recovers — the user still gets their email.",
  },
  {
    id: "payment",
    name: "Payment confirmation delayed",
    icon: <CreditCard className="h-4 w-4" />,
    blurb: "The bank's confirmation is slow to arrive.",
    steps: [
      { label: "Attempt 1 — awaiting bank", outcome: "fail" },
      { label: "Retry — poll gateway", outcome: "retry" },
      { label: "Attempt 2 — still pending", outcome: "fail" },
      { label: "Retry — poll gateway", outcome: "retry" },
      { label: "Attempt 3 — payment confirmed", outcome: "success" },
    ],
    insight:
      "Instead of failing the order, the confirmation job retries quietly. The user already saw success; the system reconciles in the background.",
  },
  {
    id: "worker",
    name: "A worker crashes",
    icon: <ServerCrash className="h-4 w-4" />,
    blurb: "One background worker dies mid-job.",
    steps: [
      { label: "Worker 2 picks up the job", outcome: "retry" },
      { label: "Worker 2 crashes 💥", outcome: "fail" },
      { label: "Job returns to the queue", outcome: "retry" },
      { label: "Worker 3 picks it up", outcome: "reroute" },
      { label: "Job completes successfully", outcome: "success" },
    ],
    insight:
      "A dead worker doesn't lose work. The unfinished job goes back to the queue and another worker finishes it — the system self-heals.",
  },
];

/**
 * Section 8 — failures are normal. Run each scenario and watch the
 * retry / reroute machinery keep the job alive.
 */
export function FailureRetry() {
  const [activeId, setActiveId] = useState(SCENARIOS[0].id);
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const active = SCENARIOS.find((sc) => sc.id === activeId)!;

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clear, []);
  useEffect(() => {
    clear();
    setStep(-1);
    setRunning(false);
  }, [activeId]);

  function run() {
    clear();
    setStep(-1);
    setRunning(true);
    active.steps.forEach((_, i) => {
      timers.current.push(setTimeout(() => setStep(i), (i + 1) * 950));
    });
    timers.current.push(
      setTimeout(() => setRunning(false), active.steps.length * 950 + 200)
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map((sc) => (
          <button
            key={sc.id}
            onClick={() => setActiveId(sc.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
              sc.id === activeId
                ? "border-brand/50 bg-brand-soft text-brand"
                : "border-border text-muted hover:text-fg"
            )}
          >
            {sc.icon}
            {sc.name}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">{active.blurb}</p>
        <button
          onClick={run}
          disabled={running}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {running ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Running…
            </>
          ) : step >= 0 ? (
            <>
              <RotateCcw className="h-3.5 w-3.5" /> Replay
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" /> Run scenario
            </>
          )}
        </button>
      </div>

      <div className="mt-5 space-y-2.5">
        {active.steps.map((st, i) => {
          const reached = step >= i;
          const isCurrent = step === i;
          return (
            <motion.div
              key={active.id + i}
              initial={{ opacity: 0.35 }}
              animate={{ opacity: reached ? 1 : 0.35 }}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
                !reached
                  ? "border-border bg-bg"
                  : st.outcome === "success"
                  ? "border-emerald-500/40 bg-emerald-500/10"
                  : st.outcome === "fail"
                  ? "border-rose-500/40 bg-rose-500/10"
                  : "border-amber-500/40 bg-amber-500/10"
              )}
            >
              <span
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-lg text-white",
                  !reached
                    ? "bg-muted/30"
                    : st.outcome === "success"
                    ? "bg-emerald-500"
                    : st.outcome === "fail"
                    ? "bg-rose-500"
                    : "bg-amber-500"
                )}
              >
                {!reached ? (
                  <span className="text-[11px] font-bold text-fg">
                    {i + 1}
                  </span>
                ) : st.outcome === "success" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : st.outcome === "fail" ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  <RotateCcw
                    className={cn("h-4 w-4", isCurrent && "animate-spin")}
                  />
                )}
              </span>
              <p className="text-sm font-medium">{st.label}</p>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {step >= active.steps.length - 1 && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-xl bg-brand-soft px-4 py-3 text-sm leading-relaxed"
          >
            <span className="font-semibold text-brand">PM insight: </span>
            {active.insight}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
