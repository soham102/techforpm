"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, CheckCircle2 } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { PRODUCT_EXAMPLES } from "@/lib/load-balancing";
import { cn } from "@/lib/utils";

/**
 * Section 8 — the same pattern in apps PMs already know. Pick a product,
 * flip between "without balancing" and "with balancing".
 */
export function ProductExamples() {
  const [activeId, setActiveId] = useState(PRODUCT_EXAMPLES[0].id);
  const [balanced, setBalanced] = useState(true);
  const ex = PRODUCT_EXAMPLES.find((e) => e.id === activeId)!;
  const Icon = getIcon(ex.icon);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      <div className="flex flex-wrap gap-2">
        {PRODUCT_EXAMPLES.map((e) => {
          const EIcon = getIcon(e.icon);
          const on = e.id === activeId;
          return (
            <button
              key={e.id}
              onClick={() => setActiveId(e.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium transition-colors",
                on
                  ? "bg-brand text-white shadow-soft"
                  : "border border-border text-muted hover:text-fg"
              )}
            >
              <EIcon className="h-3.5 w-3.5" />
              {e.name}
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-bg p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-base font-semibold">{ex.name}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {ex.trigger}
            </p>
          </div>
          <span className="ml-auto hidden shrink-0 rounded-full bg-brand-soft px-3 py-1 text-[11px] font-medium text-brand sm:block">
            {ex.peakTraffic}
          </span>
        </div>

        {/* Toggle */}
        <div className="mt-5 flex gap-2">
          <button
            onClick={() => setBalanced(false)}
            className={cn(
              "flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              !balanced
                ? "bg-rose-500/15 text-rose-500"
                : "border border-border text-muted hover:text-fg"
            )}
          >
            Without balancing
          </button>
          <button
            onClick={() => setBalanced(true)}
            className={cn(
              "flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              balanced
                ? "bg-emerald-500/15 text-emerald-500"
                : "border border-border text-muted hover:text-fg"
            )}
          >
            With balancing
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeId}-${balanced}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "mt-4 flex items-start gap-3 rounded-xl px-4 py-4 text-sm",
              balanced
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-rose-500/10 text-rose-500"
            )}
          >
            {balanced ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
            )}
            <p className="leading-relaxed text-fg">
              {balanced ? ex.withLb : ex.without}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
