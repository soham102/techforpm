"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MousePointerClick,
  Brain,
  Sparkles,
  TrendingUp,
  RotateCw,
  ArrowRight,
} from "lucide-react";
import { cn, sleep } from "@/lib/utils";

const STAGES = [
  { icon: MousePointerClick, label: "User clicks a recommendation" },
  { icon: Brain, label: "System learns the preference" },
  { icon: Sparkles, label: "Recommendations improve" },
  { icon: TrendingUp, label: "User engages more" },
];

const ACCURACY = [58, 67, 75, 82, 87, 91, 94];

export function FeedbackLoop() {
  const [stage, setStage] = useState(-1);
  const [cycle, setCycle] = useState(0);
  const [running, setRunning] = useState(false);

  async function runCycle() {
    if (running) return;
    setRunning(true);
    for (let i = 0; i < STAGES.length; i++) {
      setStage(i);
      await sleep(650);
    }
    setStage(-1);
    setCycle((c) => Math.min(ACCURACY.length - 1, c + 1));
    setRunning(false);
  }

  function reset() {
    setStage(-1);
    setCycle(0);
  }

  const accuracy = ACCURACY[cycle];

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-md text-sm leading-relaxed text-muted">
          Recommendations aren't set once — every interaction feeds back in.
          Run a few cycles and watch accuracy climb.
        </p>
        <div className="flex gap-2">
          <button
            onClick={runCycle}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
          >
            <RotateCw
              className={cn("h-4 w-4", running && "animate-spin")}
            />
            Run a cycle
          </button>
          <button
            onClick={reset}
            className="rounded-xl border border-border px-3 py-2.5 text-sm font-medium transition-colors hover:border-brand/40"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-7 flex flex-col items-stretch gap-3 md:flex-row md:items-center">
        {STAGES.map((s, i) => {
          const on = stage === i;
          const done = cycle > 0 && stage === -1;
          return (
            <div
              key={s.label}
              className="flex items-center gap-3 md:flex-1 md:flex-col"
            >
              <motion.div
                animate={{
                  scale: on ? 1.06 : 1,
                  borderColor: on
                    ? "rgb(var(--brand))"
                    : "rgb(var(--border))",
                }}
                className={cn(
                  "flex w-full flex-col items-center gap-2 rounded-2xl border-2 px-4 py-5 text-center transition-colors",
                  on
                    ? "bg-brand-soft"
                    : done
                    ? "bg-emerald-500/5"
                    : "bg-bg"
                )}
              >
                <span
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-xl",
                    on
                      ? "bg-brand text-white"
                      : done
                      ? "bg-emerald-500/15 text-emerald-500"
                      : "bg-surface text-muted"
                  )}
                >
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-medium">{s.label}</span>
              </motion.div>
              {i < STAGES.length - 1 && (
                <ArrowRight className="h-4 w-4 rotate-90 text-brand md:rotate-0" />
              )}
              {i === STAGES.length - 1 && (
                <ArrowRight className="h-4 w-4 rotate-90 text-brand opacity-40 md:rotate-0" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <div className="flex justify-between text-xs">
            <span className="font-medium">Recommendation accuracy</span>
            <span className="tabular-nums text-muted">
              after {cycle} cycle{cycle === 1 ? "" : "s"}
            </span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-border">
            <motion.div
              className="h-full rounded-full bg-emerald-500"
              animate={{ width: `${accuracy}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>
        <span className="text-2xl font-bold tabular-nums text-emerald-500">
          {accuracy}%
        </span>
      </div>

      <p className="mt-5 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">PM insight: </span>
        better recommendations increase session time and retention — the loop
        compounds, so early accuracy gains pay off for the life of the user.
      </p>
    </div>
  );
}
