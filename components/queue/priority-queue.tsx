"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  PRIORITY_EXAMPLES,
  PRIORITY_RANK,
  PRIORITY_LABEL,
  type Priority,
} from "@/lib/queues";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface Job {
  id: string;
  label: string;
  icon: Parameters<typeof getIcon>[0];
  priority: Priority;
  arrived: number; // order it entered
}

// Jobs arrive in a "bad" order: low-priority analytics first, OTP last.
const ARRIVALS: Job[] = [
  { id: "j1", label: "Analytics update", icon: "chart", priority: "low", arrived: 1 },
  { id: "j2", label: "Confirmation email", icon: "mail", priority: "normal", arrived: 2 },
  { id: "j3", label: "Recommendation rebuild", icon: "sparkles", priority: "low", arrived: 3 },
  { id: "j4", label: "Payment confirmation", icon: "card", priority: "high", arrived: 4 },
  { id: "j5", label: "Restaurant notification", icon: "store", priority: "normal", arrived: 5 },
  { id: "j6", label: "OTP delivery", icon: "key", priority: "high", arrived: 6 },
];

const toneFor = (p: Priority) =>
  p === "high"
    ? "border-rose-500/40 bg-rose-500/10 text-rose-500"
    : p === "low"
    ? "border-border bg-bg text-muted"
    : "border-brand/30 bg-brand-soft text-brand";

/**
 * Section 9 — same jobs, two orderings. FIFO processes them in arrival
 * order; a priority queue pulls critical jobs first.
 */
export function PriorityQueue() {
  const [mode, setMode] = useState<"fifo" | "priority">("fifo");

  const ordered =
    mode === "fifo"
      ? [...ARRIVALS].sort((a, b) => a.arrived - b.arrived)
      : [...ARRIVALS].sort(
          (a, b) =>
            PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] ||
            a.arrived - b.arrived
        );

  return (
    <div>
      {/* Priority tiers */}
      <div className="grid gap-4 md:grid-cols-3">
        {PRIORITY_EXAMPLES.map((tier, i) => (
          <motion.div
            key={tier.priority}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={cn(
              "rounded-2xl border p-5 shadow-soft",
              tier.priority === "high"
                ? "border-rose-500/30 bg-surface"
                : tier.priority === "low"
                ? "border-border bg-surface"
                : "border-brand/30 bg-surface"
            )}
          >
            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide",
                tier.priority === "high"
                  ? "bg-rose-500/15 text-rose-500"
                  : tier.priority === "low"
                  ? "bg-muted/15 text-muted"
                  : "bg-brand-soft text-brand"
              )}
            >
              {PRIORITY_LABEL[tier.priority]}
            </span>
            <ul className="mt-4 space-y-2">
              {tier.jobs.map((j) => {
                const Icon = getIcon(j.icon);
                return (
                  <li
                    key={j.label}
                    className="flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-sm"
                  >
                    <Icon className="h-4 w-4 text-brand" />
                    {j.label}
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              {tier.why}
            </p>
          </motion.div>
        ))}
      </div>

      {/* FIFO vs priority ordering */}
      <div className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold">
            Same 6 jobs — who gets processed first?
          </p>
          <div className="flex rounded-full border border-border bg-bg p-1">
            {(["fifo", "priority"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
                  mode === m
                    ? "bg-brand text-white"
                    : "text-muted hover:text-fg"
                )}
              >
                {m === "fifo" ? "First-in-first-out" : "Priority queue"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {ordered.map((j, idx) => {
            const Icon = getIcon(j.icon);
            return (
              <div key={j.id} className="flex items-center gap-2">
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium",
                    toneFor(j.priority)
                  )}
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-bg/60 text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <Icon className="h-4 w-4" />
                  {j.label}
                </motion.div>
                {idx < ordered.length - 1 && (
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted" />
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-5 rounded-xl bg-brand-soft px-4 py-3 text-sm leading-relaxed">
          <span className="font-semibold text-brand">PM insight: </span>
          {mode === "fifo"
            ? "In strict arrival order, the OTP a user is waiting on sits behind analytics and recommendation rebuilds. That's a slow, frustrating login."
            : "With priorities, OTP and payment jump the line — critical user-facing tasks get processed fast while background work waits its turn."}
        </p>
      </div>
    </div>
  );
}
