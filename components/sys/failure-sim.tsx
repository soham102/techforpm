"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Network,
  Server,
  TriangleAlert,
  RotateCcw,
  Loader2,
  Lightbulb,
} from "lucide-react";
import { FAILURES, type FailureScenario } from "@/lib/system-design";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * Section 6 — pick a failure, trigger it, and watch the user-facing
 * damage ripple out from one internal component.
 */
export function FailureSim() {
  const [active, setActive] = useState<FailureScenario>(FAILURES[0]);
  const [down, setDown] = useState(false);

  function select(f: FailureScenario) {
    setActive(f);
    setDown(false);
  }

  const FailIcon = getIcon(active.icon);

  return (
    <div className="space-y-5">
      {/* scenario tabs */}
      <div className="flex flex-wrap gap-2">
        {FAILURES.map((f) => {
          const Icon = getIcon(f.icon);
          const on = f.id === active.id;
          return (
            <button
              key={f.id}
              onClick={() => select(f)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors",
                on
                  ? "border-brand/50 bg-brand-soft text-brand"
                  : "border-border bg-surface text-muted hover:text-fg"
              )}
            >
              <Icon className="h-4 w-4" />
              {f.name}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* system diagram */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            System
          </p>
          <div className="mt-4 flex items-center justify-between gap-2">
            <Node icon={<Smartphone className="h-4 w-4" />} label="App" degraded={down} />
            <Wire degraded={down} />
            <Node icon={<Network className="h-4 w-4" />} label="API" degraded={down} />
            <Wire degraded={down} />
            <Node icon={<Server className="h-4 w-4" />} label="Backend" degraded={down} />
            <Wire degraded={down} broken={down} />
            <motion.div
              animate={
                down
                  ? {
                      boxShadow: [
                        "0 0 0 0 rgba(244,63,94,0)",
                        "0 0 0 6px rgba(244,63,94,0.25)",
                        "0 0 0 0 rgba(244,63,94,0)",
                      ],
                    }
                  : {}
              }
              transition={{ duration: 1, repeat: down ? Infinity : 0 }}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3 text-center",
                down
                  ? "border-rose-500/50 bg-rose-500/10"
                  : "border-brand/40 bg-brand-soft"
              )}
            >
              <FailIcon
                className={cn(
                  "h-4 w-4",
                  down ? "text-rose-500" : "text-brand"
                )}
              />
              <span className="text-[10px] font-medium">{active.name}</span>
              {down && (
                <span className="text-[9px] font-bold text-rose-500">
                  DOWN
                </span>
              )}
            </motion.div>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              onClick={() => setDown(true)}
              disabled={down}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-500 transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
            >
              <TriangleAlert className="h-4 w-4" />
              Trigger failure
            </button>
            <button
              onClick={() => setDown(false)}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:border-brand/40"
            >
              <RotateCcw className="h-4 w-4" />
              Recover
            </button>
          </div>
        </div>

        {/* user impact */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            What the user experiences
          </p>
          <p className="mt-2 text-sm text-muted">{active.trigger}</p>

          <div className="mt-4 min-h-[120px] rounded-xl border border-border bg-bg p-4">
            <AnimatePresence mode="wait">
              {!down ? (
                <motion.p
                  key="ok"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-emerald-500"
                >
                  All systems healthy — the app works normally.
                </motion.p>
              ) : (
                <motion.ul
                  key="bad"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  {active.symptoms.map((s, i) => (
                    <motion.li
                      key={s}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="flex items-center gap-2 text-sm text-rose-500"
                    >
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      {s}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-4 flex gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <p className="text-sm leading-relaxed">{active.insight}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Node({
  icon,
  label,
  degraded,
}: {
  icon: React.ReactNode;
  label: string;
  degraded: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-center transition-colors",
        degraded
          ? "border-amber-500/40 bg-amber-500/5 text-amber-500"
          : "border-border bg-bg text-brand"
      )}
    >
      {icon}
      <span className="text-[10px] font-medium text-fg">{label}</span>
    </div>
  );
}

function Wire({
  degraded,
  broken,
}: {
  degraded: boolean;
  broken?: boolean;
}) {
  return (
    <div
      className={cn(
        "h-0.5 flex-1 rounded-full transition-colors",
        broken
          ? "bg-rose-500/60"
          : degraded
          ? "bg-amber-500/40"
          : "bg-border"
      )}
    />
  );
}
