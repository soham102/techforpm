"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { PRODUCT_EXAMPLES } from "@/lib/queues";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * Section 6 — pick a familiar product. See what the user gets instantly
 * vs. the background jobs that quietly drain behind the success screen.
 */
export function ProductExamples() {
  const [activeId, setActiveId] = useState(PRODUCT_EXAMPLES[2].id);
  const [doneJobs, setDoneJobs] = useState<number>(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const active = PRODUCT_EXAMPLES.find((p) => p.id === activeId)!;

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setDoneJobs(0);
    active.background.forEach((_, i) => {
      timers.current.push(
        setTimeout(() => setDoneJobs(i + 1), 700 + i * 750)
      );
    });
    return () => timers.current.forEach(clearTimeout);
  }, [activeId, active.background]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {PRODUCT_EXAMPLES.map((p) => {
          const Icon = getIcon(p.icon);
          return (
            <button
              key={p.id}
              onClick={() => setActiveId(p.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
                p.id === activeId
                  ? "border-brand/50 bg-brand-soft text-brand"
                  : "border-border text-muted hover:text-fg"
              )}
            >
              <Icon className={cn("h-4 w-4", p.accent)} />
              {p.name}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mt-5 grid gap-4 lg:grid-cols-[260px_1fr]"
        >
          {/* Instant response */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-bg p-6 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              What the user gets — instantly
            </p>
            <motion.div
              key={activeId + "-ok"}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 16 }}
              className="mt-4"
            >
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            </motion.div>
            <p className="mt-3 text-sm font-semibold">{active.instant}</p>
          </div>

          {/* Background jobs */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
              <ArrowRight className="h-3.5 w-3.5 text-brand" />
              Queued — running in the background
            </p>
            <div className="mt-3 space-y-2">
              {active.background.map((job, i) => {
                const state =
                  doneJobs > i
                    ? "done"
                    : doneJobs === i
                    ? "running"
                    : "queued";
                return (
                  <motion.div
                    key={job}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-sm transition-colors",
                      state === "done"
                        ? "border-emerald-500/40 bg-emerald-500/10"
                        : state === "running"
                        ? "border-brand/50 bg-brand-soft"
                        : "border-border bg-bg"
                    )}
                  >
                    <span className="font-medium">{job}</span>
                    {state === "done" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : state === "running" ? (
                      <Loader2 className="h-4 w-4 animate-spin text-brand" />
                    ) : (
                      <span className="text-[10px] font-semibold uppercase text-muted">
                        queued
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
            <p className="mt-4 rounded-xl bg-brand-soft px-4 py-3 text-sm leading-relaxed">
              <span className="font-semibold text-brand">PM insight: </span>
              {active.insight}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
