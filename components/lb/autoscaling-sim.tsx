"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Server, TrendingUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Frame {
  servers: number;
  load: number; // 0-100 per-server stress
  responseMs: number;
  note: string;
  phase: "calm" | "spike" | "scaling" | "stable";
}

/** Scripted timeline of the dinner rush + auto-scaling response. */
const TIMELINE: Frame[] = [
  { servers: 2, load: 32, responseMs: 180, note: "Quiet afternoon — 2 servers, plenty of headroom", phase: "calm" },
  { servers: 2, load: 71, responseMs: 540, note: "7 PM — dinner orders start climbing", phase: "spike" },
  { servers: 2, load: 96, responseMs: 1800, note: "Servers maxed out — app slowing down", phase: "spike" },
  { servers: 3, load: 78, responseMs: 1100, note: "Auto-scaling triggered — new server spinning up", phase: "scaling" },
  { servers: 4, load: 58, responseMs: 540, note: "More capacity added — load spreading out", phase: "scaling" },
  { servers: 5, load: 41, responseMs: 240, note: "Fleet sized for the rush — response time recovering", phase: "stable" },
  { servers: 5, load: 38, responseMs: 190, note: "Stable through peak — users never noticed", phase: "stable" },
];

const FLOW = [
  "High traffic",
  "New servers added",
  "Load distributed",
  "Stable performance",
];

/**
 * Section 7 — press play to run the QuickBite dinner rush. Traffic spikes,
 * auto-scaling spawns servers, load spreads and response time recovers.
 */
export function AutoscalingSim() {
  const [i, setI] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!running) return;
    timer.current = setInterval(() => {
      setI((prev) => {
        if (prev >= TIMELINE.length - 1) {
          setRunning(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1400);
    return () => clearInterval(timer.current);
  }, [running]);

  const f = TIMELINE[i];
  const flowIdx =
    f.phase === "calm"
      ? -1
      : f.phase === "spike"
      ? 0
      : f.phase === "scaling"
      ? 2
      : 3;

  function start() {
    setI(0);
    setRunning(true);
  }
  function reset() {
    setRunning(false);
    setI(0);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={start}
          disabled={running}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          <Play className="h-4 w-4" />
          Start the dinner rush
        </button>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:text-fg"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
        <span className="ml-auto rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
          QuickBite · 7–10 PM
        </span>
      </div>

      {/* Flow strip */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {FLOW.map((label, idx) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                idx <= flowIdx
                  ? "bg-brand text-white"
                  : "border border-border text-muted"
              )}
            >
              {label}
            </span>
            {idx < FLOW.length - 1 && (
              <span className="text-muted">→</span>
            )}
          </div>
        ))}
      </div>

      {/* Server fleet */}
      <div className="mt-6 rounded-2xl border border-border bg-bg p-5">
        <div className="flex min-h-[88px] flex-wrap items-center gap-3">
          <AnimatePresence mode="popLayout">
            {Array.from({ length: f.servers }).map((_, n) => {
              const fresh = n >= TIMELINE[Math.max(0, i - 1)].servers;
              return (
                <motion.div
                  key={n}
                  layout
                  initial={{ opacity: 0, scale: 0.5, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className={cn(
                    "relative grid h-16 w-16 place-items-center rounded-2xl border",
                    f.load > 90
                      ? "border-rose-500/50 bg-rose-500/10 text-rose-500"
                      : f.load > 70
                      ? "border-amber-500/40 bg-amber-500/10 text-amber-500"
                      : "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                  )}
                >
                  <Server className="h-6 w-6" />
                  {fresh && i > 0 && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute -right-1 -top-1 rounded-full bg-brand px-1.5 py-0.5 text-[9px] font-bold text-white"
                    >
                      NEW
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={f.note}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-sm font-medium"
          >
            {f.note}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Meters */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-bg p-4">
          <p className="flex items-center justify-between text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-brand" /> Per-server load
            </span>
            <span className="font-semibold tabular-nums text-fg">
              {f.load}%
            </span>
          </p>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-border">
            <motion.div
              className={cn(
                "h-full rounded-full",
                f.load > 90
                  ? "bg-rose-500"
                  : f.load > 70
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              )}
              animate={{ width: `${f.load}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-bg p-4">
          <p className="flex items-center justify-between text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-brand" /> Response time
            </span>
            <motion.span
              key={f.responseMs}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              className={cn(
                "font-semibold tabular-nums",
                f.responseMs > 1500
                  ? "text-rose-500"
                  : f.responseMs > 600
                  ? "text-amber-500"
                  : "text-emerald-500"
              )}
            >
              {f.responseMs < 1000
                ? `${f.responseMs}ms`
                : `${(f.responseMs / 1000).toFixed(1)}s`}
            </motion.span>
          </p>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-border">
            <motion.div
              className={cn(
                "h-full rounded-full",
                f.responseMs > 1500
                  ? "bg-rose-500"
                  : f.responseMs > 600
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              )}
              animate={{
                width: `${Math.min(100, (f.responseMs / 2000) * 100)}%`,
              }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>
      </div>

      <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">PM insight: </span>
        Scaling infrastructure dynamically reduces outages. Capacity grows with
        demand and shrinks after — so the product survives the peak without
        paying for idle servers the rest of the day.
      </p>
    </div>
  );
}
