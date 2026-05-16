"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Boxes,
  Database,
  TriangleAlert,
  RotateCcw,
  Zap,
} from "lucide-react";
import { MONOLITH_FEATURES, USER_ACTIONS } from "@/lib/microservices";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * Section 2 — every request funnels into one backend block.
 * Spamming actions builds congestion; crashing one feature drags
 * the whole system down (cascading failure).
 */
export function MonolithSimulator() {
  const [load, setLoad] = useState(8);
  const [crashed, setCrashed] = useState(false);
  const [pulseId, setPulseId] = useState(0);
  const decay = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    decay.current = setInterval(() => {
      setLoad((l) => (crashed ? Math.min(100, l + 2) : Math.max(6, l - 6)));
    }, 700);
    return () => clearInterval(decay.current);
  }, [crashed]);

  function act() {
    setPulseId((n) => n + 1);
    setLoad((l) => Math.min(100, l + (crashed ? 16 : 12)));
  }

  function reset() {
    setCrashed(false);
    setLoad(8);
  }

  const level =
    crashed || load > 80 ? "critical" : load > 55 ? "busy" : "healthy";

  return (
    <div className="space-y-5">
      {/* action buttons */}
      <div className="flex flex-wrap gap-2">
        {USER_ACTIONS.map((a) => {
          const Icon = getIcon(a.icon);
          return (
            <button
              key={a.id}
              onClick={act}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-sm font-medium shadow-soft transition-transform hover:-translate-y-0.5 hover:border-brand/40"
            >
              <Icon className="h-4 w-4 text-brand" />
              {a.label}
            </button>
          );
        })}
      </div>

      <div className="grid items-stretch gap-4 lg:grid-cols-[120px_1fr_120px]">
        <Pillar icon={<Smartphone className="h-5 w-5" />} label="Frontend" />

        {/* single backend */}
        <motion.div
          animate={
            level === "critical"
              ? { boxShadow: ["0 0 0 0 rgba(244,63,94,0)", "0 0 0 8px rgba(244,63,94,0.18)", "0 0 0 0 rgba(244,63,94,0)"] }
              : {}
          }
          transition={{ duration: 1.1, repeat: level === "critical" ? Infinity : 0 }}
          className={cn(
            "relative rounded-2xl border-2 p-5 transition-colors",
            level === "critical"
              ? "border-rose-500/50 bg-rose-500/5"
              : level === "busy"
              ? "border-amber-500/50 bg-amber-500/5"
              : "border-brand/40 bg-brand-soft"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <Boxes className="h-4 w-4" />
              Single Backend
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1",
                level === "critical"
                  ? "bg-rose-500/10 text-rose-500 ring-rose-500/30"
                  : level === "busy"
                  ? "bg-amber-500/10 text-amber-500 ring-amber-500/30"
                  : "bg-emerald-500/10 text-emerald-500 ring-emerald-500/30"
              )}
            >
              {level === "critical"
                ? "Overloaded"
                : level === "busy"
                ? "Busy"
                : "Healthy"}
            </span>
          </div>

          {/* incoming request pulse */}
          <AnimatePresence>
            <motion.span
              key={pulseId}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0.7, 0], scale: 2.4 }}
              transition={{ duration: 0.7 }}
              className="pointer-events-none absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/40"
            />
          </AnimatePresence>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {MONOLITH_FEATURES.map((f) => {
              const Icon = getIcon(f.icon);
              const down = crashed && f.label === "Notifications";
              return (
                <div
                  key={f.label}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-colors",
                    down
                      ? "border-rose-500/50 bg-rose-500/10"
                      : crashed
                      ? "border-amber-500/40 bg-amber-500/10"
                      : "border-border bg-surface"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      down
                        ? "text-rose-500"
                        : crashed
                        ? "text-amber-500"
                        : "text-brand"
                    )}
                  />
                  <span className="text-[10px] font-medium">{f.label}</span>
                  {down && (
                    <span className="text-[9px] font-bold text-rose-500">
                      DOWN
                    </span>
                  )}
                  {crashed && !down && (
                    <span className="text-[9px] text-amber-500">delayed</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* load meter */}
          <div className="mt-4">
            <div className="flex justify-between text-[11px] text-muted">
              <span>Backend load</span>
              <span>{Math.round(load)}%</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-border">
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  level === "critical"
                    ? "bg-rose-500"
                    : level === "busy"
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                )}
                animate={{ width: `${load}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        </motion.div>

        <Pillar icon={<Database className="h-5 w-5" />} label="One Database" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setCrashed(true)}
          disabled={crashed}
          className="inline-flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-500 transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
        >
          <TriangleAlert className="h-4 w-4" />
          Crash Notification service
        </button>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:border-brand/40"
        >
          <RotateCcw className="h-4 w-4" />
          Recover
        </button>
      </div>

      <AnimatePresence>
        {crashed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4"
          >
            <Zap className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
            <p className="text-sm leading-relaxed">
              <span className="font-semibold">Cascading failure: </span>
              the notification code shares the same process as everything else,
              so its crash drags ordering, login and payments down with it.{" "}
              <span className="font-semibold">
                In monoliths, one issue can impact the entire product.
              </span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Pillar({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-row items-center justify-center gap-2 rounded-2xl border border-border bg-surface p-4 lg:flex-col">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
        {icon}
      </span>
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}
