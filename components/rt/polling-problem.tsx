"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, AlertTriangle, Play, RotateCcw } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { ORDER_STAGES } from "@/lib/realtime";
import { cn } from "@/lib/utils";

/**
 * Section 2 — why normal APIs aren't enough. The real order quietly advances
 * on a timer (the truth). The app's screen only changes when the user taps
 * Refresh — so it shows stale status and burns wasted calls.
 */
export function PollingProblem() {
  const [running, setRunning] = useState(false);
  const [realStage, setRealStage] = useState(0);
  const [shownStage, setShownStage] = useState(0);
  const [calls, setCalls] = useState(0);
  const [wasted, setWasted] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!running) return;
    timer.current = setInterval(() => {
      setRealStage((s) => {
        if (s >= ORDER_STAGES.length - 1) {
          setRunning(false);
          return s;
        }
        return s + 1;
      });
    }, 2600);
    return () => clearInterval(timer.current);
  }, [running]);

  const stale = shownStage < realStage;

  function start() {
    setRunning(true);
    setRealStage(0);
    setShownStage(0);
    setCalls(0);
    setWasted(0);
  }
  function reset() {
    setRunning(false);
    setRealStage(0);
    setShownStage(0);
    setCalls(0);
    setWasted(0);
  }
  function refresh() {
    setCalls((c) => c + 1);
    if (shownStage === realStage) setWasted((w) => w + 1);
    setShownStage(realStage);
  }

  const shown = ORDER_STAGES[shownStage];
  const ShownIcon = getIcon(shown.icon);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={start}
          disabled={running}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          <Play className="h-4 w-4" />
          Place an order
        </button>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:text-fg"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_auto_1fr]">
        {/* Phone — what the user sees */}
        <div className="rounded-2xl border border-border bg-bg p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            What the user sees
          </p>
          <div className="mt-4 flex flex-col items-center">
            <motion.span
              key={shown.id}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn(
                "grid h-16 w-16 place-items-center rounded-2xl",
                stale
                  ? "bg-amber-500/15 text-amber-500"
                  : "bg-emerald-500/15 text-emerald-500"
              )}
            >
              <ShownIcon className="h-7 w-7" />
            </motion.span>
            <p className="mt-3 text-sm font-semibold">{shown.label}</p>
            <p className="mt-0.5 text-center text-[12px] text-muted">
              {shown.sub}
            </p>
          </div>
          <button
            onClick={refresh}
            disabled={!running && realStage === 0}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-border py-2.5 text-sm font-medium transition-colors hover:border-brand/40 disabled:opacity-40"
          >
            <RefreshCw className="h-4 w-4" />
            Pull to refresh
          </button>
        </div>

        {/* Arrow */}
        <div className="hidden place-items-center lg:grid">
          <div className="text-center text-[11px] text-muted">
            <RefreshCw className="mx-auto h-5 w-5 text-amber-500" />
            <p className="mt-1">one API call<br />per refresh</p>
          </div>
        </div>

        {/* Reality — the actual order */}
        <div className="rounded-2xl border border-border bg-bg p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            What's actually happening
          </p>
          <div className="mt-4 space-y-2">
            {ORDER_STAGES.map((st, i) => {
              const done = i <= realStage;
              const Icon = getIcon(st.icon);
              return (
                <div
                  key={st.id}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                    i === realStage
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                      : done
                      ? "border-border bg-surface text-muted"
                      : "border-border bg-surface text-muted opacity-45"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {st.label}
                  {i === realStage && running && (
                    <motion.span
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stale warning */}
      <AnimatePresence>
        {stale && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-500">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              The order has moved on — but the user is still staring at old
              information until they refresh again.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <Stat label="Refreshes (API calls)" value={`${calls}`} tone="warn" />
        <Stat
          label="Wasted calls (no change)"
          value={`${wasted}`}
          tone={wasted > 0 ? "bad" : "ok"}
        />
        <Stat
          label="Status accuracy"
          value={stale ? "Stale" : "Current"}
          tone={stale ? "bad" : "ok"}
        />
      </div>

      <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">PM insight: </span>
        Polling creates delays and unnecessary server load. The user either
        sees stale status or spams refresh — and most of those calls return
        “nothing changed”.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "ok" | "warn" | "bad";
}) {
  return (
    <div className="rounded-xl border border-border bg-bg px-2 py-3">
      <p
        className={cn(
          "text-base font-bold tabular-nums",
          tone === "ok" && "text-emerald-500",
          tone === "warn" && "text-amber-500",
          tone === "bad" && "text-rose-500"
        )}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[11px] text-muted">{label}</p>
    </div>
  );
}
