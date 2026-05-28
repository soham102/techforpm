"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap, TrendingDown, Activity } from "lucide-react";
import type { ChaosEvent } from "./types";

interface Props {
  events: ChaosEvent[];
  onToggle: (id: string) => void;
  healthScore: number;
}

export function AgileChaosPanel({ events, onToggle, healthScore }: Props) {
  const activeCount = events.filter(e => e.active).length;
  const totalImpact = events.filter(e => e.active).reduce((s, e) => s + e.capacityImpact, 0);

  return (
    <section className="rounded-2xl border border-border/70 bg-surface p-6">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/15 ring-1 ring-red-500/30">
          <Zap className="h-5 w-5 text-red-400" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-red-400">Section 9</p>
          <h2 className="text-lg font-bold text-fg">Agile Chaos Simulator</h2>
        </div>
        {activeCount > 0 && (
          <motion.span
            key={activeCount}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="ml-auto rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-bold text-red-400 border border-red-500/30"
          >
            {activeCount} active
          </motion.span>
        )}
      </div>

      <p className="mb-4 text-sm text-muted">
        Trigger real-world disruptions and watch how they cascade through your sprint. This is what PMs actually deal with.
      </p>

      {/* Events */}
      <div className="space-y-2.5 mb-4">
        {events.map((event) => (
          <motion.button
            key={event.id}
            layout
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onToggle(event.id)}
            className={[
              "w-full rounded-xl border p-3.5 text-left transition-all",
              event.active
                ? "border-red-500/40 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.12)]"
                : "border-border/50 bg-elevated hover:border-red-500/30 hover:bg-red-500/5",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className="text-xl leading-none">{event.emoji}</span>
                <div>
                  <p className={`text-sm font-semibold ${event.active ? "text-red-300" : "text-fg"}`}>
                    {event.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted line-clamp-1">{event.description}</p>
                </div>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-1">
                <AnimatePresence mode="wait">
                  {event.active ? (
                    <motion.span
                      key="on"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="rounded-full bg-red-500/20 px-2 py-0.5 text-[11px] font-bold text-red-400 border border-red-500/30"
                    >
                      ACTIVE
                    </motion.span>
                  ) : (
                    <motion.span
                      key="off"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-medium text-muted border border-border/50"
                    >
                      Trigger
                    </motion.span>
                  )}
                </AnimatePresence>
                <span className="text-[11px] font-semibold text-red-400">
                  {event.capacityImpact} pts
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Live impact summary */}
      <AnimatePresence>
        {activeCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-red-500/30 bg-red-500/8 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-red-400 animate-pulse" />
                <p className="text-sm font-bold text-red-400">Sprint Under Pressure</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-muted">Disruptions</p>
                  <p className="text-lg font-bold text-red-400">{activeCount}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Capacity Lost</p>
                  <p className="text-lg font-bold text-red-400">{Math.abs(totalImpact)} pts</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Health Score</p>
                  <motion.p
                    key={healthScore}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className={`text-lg font-bold ${healthScore < 40 ? "text-red-400" : healthScore < 70 ? "text-amber-400" : "text-green-400"}`}
                  >
                    {healthScore}
                  </motion.p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-500/15 px-3 py-2">
                <TrendingDown className="h-3.5 w-3.5 shrink-0 text-red-400" />
                <p className="text-xs text-red-300">
                  <span className="font-semibold">High probability of sprint spillover.</span>{" "}
                  Consider renegotiating scope with stakeholders.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
