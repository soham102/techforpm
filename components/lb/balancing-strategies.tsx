"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { getIcon } from "@/lib/icons";
import {
  STRATEGIES,
  STRATEGY_WALKTHROUGH,
  type Strategy,
} from "@/lib/load-balancing";
import { cn } from "@/lib/utils";

/**
 * Section 5 — pick a strategy and watch a step-by-step walkthrough of which
 * request goes to which server, and why. Three intuitive strategies, no
 * networking jargon.
 */
export function BalancingStrategies() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<Strategy>("round-robin");
  const [step, setStep] = useState(0);

  const meta = STRATEGIES.find((s) => s.id === active)!;
  const rows = STRATEGY_WALKTHROUGH[active];

  // Auto-advance the walkthrough.
  useEffect(() => {
    if (reduce) {
      setStep(rows.length - 1);
      return;
    }
    setStep(0);
    const t = setInterval(
      () => setStep((s) => (s + 1) % (rows.length + 1)),
      1300
    );
    return () => clearInterval(t);
  }, [active, rows.length, reduce]);

  return (
    <div className="space-y-5">
      {/* Strategy tabs */}
      <div className="grid gap-3 sm:grid-cols-3">
        {STRATEGIES.map((s) => {
          const Icon = getIcon(s.icon);
          const on = s.id === active;
          return (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={cn(
                "rounded-2xl border p-4 text-left transition-colors",
                on
                  ? "border-brand/50 bg-brand-soft"
                  : "border-border bg-surface hover:border-brand/30"
              )}
            >
              <span
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-lg",
                  on ? "bg-brand text-white" : "bg-brand-soft text-brand"
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <p className="mt-3 text-sm font-semibold">{s.name}</p>
              <p className="mt-1 text-[12px] leading-snug text-muted">
                {s.tagline}
              </p>
            </button>
          );
        })}
      </div>

      {/* Walkthrough */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
        <p className="text-sm leading-relaxed text-muted">{meta.how}</p>

        <div className="mt-5 space-y-2">
          {rows.map((r, i) => {
            const revealed = i < step;
            return (
              <motion.div
                key={`${active}-${i}`}
                initial={false}
                animate={{
                  opacity: revealed ? 1 : 0.35,
                }}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors",
                  revealed
                    ? "border-brand/30 bg-brand-soft"
                    : "border-border bg-bg"
                )}
              >
                <span className="flex items-center gap-2 font-medium">
                  {active === "geographic" && (
                    <MapPin className="h-3.5 w-3.5 text-brand" />
                  )}
                  {r.request}
                </span>
                <motion.span
                  animate={
                    revealed && !reduce
                      ? { x: [0, 5, 0] }
                      : {}
                  }
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-brand"
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    revealed
                      ? "bg-emerald-500/15 text-emerald-500"
                      : "bg-border text-muted"
                  )}
                >
                  {r.routedTo}
                </span>
                <AnimatePresence>
                  {revealed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="ml-auto hidden text-[12px] text-muted sm:block"
                    >
                      {r.reason}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm">
          <span className="font-semibold text-brand">PM insight: </span>
          {meta.pmInsight}
        </p>
      </div>
    </div>
  );
}
