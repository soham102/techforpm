"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, Play, RotateCcw, Zap } from "lucide-react";
import { ORDER_STEPS } from "@/lib/queues";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

type Mode = "sync" | "queue";
type StepState = "idle" | "running" | "done" | "queued" | "bg";

/**
 * Section 2 — one QuickBite order, two ways. In "sync" everything must
 * finish before the user sees success; in "queue" only critical steps
 * block and the rest move to the background. The elapsed timer is the
 * whole point.
 */
export function WhyDelay() {
  const [mode, setMode] = useState<Mode>("sync");
  const [running, setRunning] = useState(false);
  const [states, setStates] = useState<Record<string, StepState>>({});
  const [elapsed, setElapsed] = useState(0);
  const [userDone, setUserDone] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clock = useRef<ReturnType<typeof setInterval>>();

  const clearAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    clearInterval(clock.current);
  };

  useEffect(() => () => clearAll(), []);

  function reset() {
    clearAll();
    setRunning(false);
    setStates({});
    setElapsed(0);
    setUserDone(null);
  }

  function run() {
    clearAll();
    setRunning(true);
    setStates({});
    setElapsed(0);
    setUserDone(null);

    const start = performance.now();
    clock.current = setInterval(() => {
      setElapsed(Math.round(performance.now() - start));
    }, 40);

    if (mode === "sync") {
      // Strictly sequential — the user waits for the very last step.
      let t = 0;
      ORDER_STEPS.forEach((s) => {
        timers.current.push(
          setTimeout(() => setStates((p) => ({ ...p, [s.id]: "running" })), t)
        );
        t += s.cost;
        timers.current.push(
          setTimeout(() => setStates((p) => ({ ...p, [s.id]: "done" })), t)
        );
      });
      timers.current.push(
        setTimeout(() => {
          setUserDone(Math.round(performance.now() - start));
          setRunning(false);
          clearInterval(clock.current);
        }, t + 30)
      );
    } else {
      // Critical steps block; everything else is queued in parallel.
      const critical = ORDER_STEPS.filter((s) => s.critical);
      const background = ORDER_STEPS.filter((s) => !s.critical);
      let t = 0;
      critical.forEach((s) => {
        timers.current.push(
          setTimeout(() => setStates((p) => ({ ...p, [s.id]: "running" })), t)
        );
        t += s.cost;
        timers.current.push(
          setTimeout(() => setStates((p) => ({ ...p, [s.id]: "done" })), t)
        );
      });
      // User sees success the moment critical work is done.
      timers.current.push(
        setTimeout(() => {
          setUserDone(Math.round(performance.now() - start));
          background.forEach((s) =>
            setStates((p) => ({ ...p, [s.id]: "queued" }))
          );
        }, t + 30)
      );
      // Background jobs drain in parallel afterwards.
      background.forEach((s, i) => {
        timers.current.push(
          setTimeout(
            () => setStates((p) => ({ ...p, [s.id]: "bg" })),
            t + 250 + i * 120
          )
        );
        timers.current.push(
          setTimeout(
            () => setStates((p) => ({ ...p, [s.id]: "done" })),
            t + 250 + i * 120 + 700
          )
        );
      });
      timers.current.push(
        setTimeout(() => {
          setRunning(false);
          clearInterval(clock.current);
        }, t + 250 + background.length * 120 + 750)
      );
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-full border border-border bg-bg p-1">
          {(["sync", "queue"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                reset();
              }}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
                mode === m
                  ? "bg-brand text-white"
                  : "text-muted hover:text-fg"
              )}
            >
              {m === "sync" ? "Everything synchronous" : "Critical + queue"}
            </button>
          ))}
        </div>
        <button
          onClick={running ? reset : run}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
        >
          {running ? (
            <>
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" /> Place an order
            </>
          )}
        </button>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_240px]">
        {/* Step timeline */}
        <div className="space-y-2.5">
          {ORDER_STEPS.map((s) => {
            const st = states[s.id] ?? "idle";
            const Icon = getIcon(s.icon);
            return (
              <div
                key={s.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
                  st === "running" || st === "bg"
                    ? "border-brand/50 bg-brand-soft"
                    : st === "done"
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : st === "queued"
                    ? "border-amber-500/40 bg-amber-500/10"
                    : "border-border bg-bg"
                )}
              >
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
                    st === "done"
                      ? "bg-emerald-500 text-white"
                      : st === "running" || st === "bg"
                      ? "bg-brand text-white"
                      : "bg-brand-soft text-brand"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{s.label}</p>
                  <p className="text-[11px] text-muted">
                    {s.critical ? "Critical · user must wait" : "Non-critical"}
                  </p>
                </div>
                <span className="text-[11px] font-semibold tabular-nums">
                  {st === "running" && (
                    <Loader2 className="h-4 w-4 animate-spin text-brand" />
                  )}
                  {st === "bg" && (
                    <span className="text-brand">in background</span>
                  )}
                  {st === "queued" && (
                    <span className="text-amber-500">queued</span>
                  )}
                  {st === "done" && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* The user's experience */}
        <div className="flex flex-col rounded-2xl border border-border bg-gradient-to-b from-brand-soft to-bg p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            What the user sees
          </p>
          <div className="mt-4 flex flex-1 flex-col items-center justify-center text-center">
            <AnimatePresence mode="wait">
              {userDone === null ? (
                <motion.div
                  key="wait"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3"
                >
                  <Loader2
                    className={cn(
                      "h-10 w-10 text-brand",
                      running && "animate-spin"
                    )}
                  />
                  <p className="text-sm font-medium text-muted">
                    {running ? "Placing your order…" : "Tap “Place an order”"}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 240, damping: 18 }}
                  className="flex flex-col items-center gap-2"
                >
                  <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                  <p className="text-sm font-semibold">Order placed! 🎉</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="mt-4 rounded-xl border border-border bg-bg px-3 py-3 text-center">
            <p className="text-[11px] text-muted">User waited</p>
            <p
              className={cn(
                "text-2xl font-bold tabular-nums",
                userDone !== null && userDone < 1300
                  ? "text-emerald-500"
                  : userDone !== null
                  ? "text-rose-500"
                  : "text-fg"
              )}
            >
              {((userDone ?? elapsed) / 1000).toFixed(2)}s
            </p>
          </div>
        </div>
      </div>

      <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="inline-flex items-center gap-1.5 font-semibold text-brand">
          <Zap className="h-4 w-4" /> PM insight:
        </span>{" "}
        The work is identical in both modes — the difference is what the user
        is forced to wait for. Apps move non-critical work into the background
        to keep the app responsive.
      </p>
    </div>
  );
}
