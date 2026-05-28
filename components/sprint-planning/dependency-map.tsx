"use client";

import { motion } from "framer-motion";
import { GitBranch, AlertTriangle } from "lucide-react";
import type { BacklogItem } from "./types";

const CAT_COLOR: Record<string, string> = {
  Backend:  "#60a5fa",
  Frontend: "#22d3ee",
  Design:   "#a78bfa",
  QA:       "#4ade80",
};

const COL_BADGE: Record<string, { bg: string; text: string }> = {
  backlog:    { bg: "bg-surface",         text: "text-muted"      },
  sprint:     { bg: "bg-brand/20",        text: "text-brand"      },
  "high-risk":{ bg: "bg-amber-500/20",    text: "text-amber-400"  },
  blocked:    { bg: "bg-red-500/20",      text: "text-red-400"    },
};

const COL_LABEL: Record<string, string> = {
  backlog:    "Backlog",
  sprint:     "In Sprint",
  "high-risk":"High Risk",
  blocked:    "Blocked",
};

interface Props {
  items: BacklogItem[];
  sprintItems: BacklogItem[];
  violations: BacklogItem[];
}

export function DependencyMap({ items, sprintItems, violations }: Props) {
  const violationIds = new Set(violations.map(i => i.id));
  const sprintIds = new Set(sprintItems.map(i => i.id));

  const depPairs = items.flatMap(item =>
    item.dependencies.map(dep => {
      const from = items.find(i => i.id === dep);
      const to = item;
      if (!from) return null;
      return { from, to, violated: sprintIds.has(to.id) && !sprintIds.has(from.id) };
    }).filter(Boolean)
  ) as { from: BacklogItem; to: BacklogItem; violated: boolean }[];

  return (
    <section className="rounded-2xl border border-border/70 bg-surface p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-brand">Section 6</p>
          <h2 className="text-xl font-bold text-fg">Dependency Visualization</h2>
          <p className="mt-1 text-sm text-muted">
            Stories with arrows depend on other stories. Adding a dependent story without its prerequisite creates risk.
          </p>
        </div>
        {violations.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2"
          >
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-semibold text-amber-400">
              {violations.length} dependency risk{violations.length > 1 ? "s" : ""} detected
            </span>
          </motion.div>
        )}
      </div>

      {/* Dependency list */}
      <div className="mb-6 space-y-3">
        {depPairs.map(({ from, to, violated }, i) => (
          <motion.div
            key={`${from.id}-${to.id}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`flex items-center gap-3 rounded-xl border p-3 ${
              violated ? "border-amber-500/40 bg-amber-500/8" : "border-border/50 bg-elevated"
            }`}
          >
            {/* From node */}
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: CAT_COLOR[from.category] ?? "#6366f1" }}
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-fg truncate">{from.title}</p>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${COL_BADGE[from.column].bg} ${COL_BADGE[from.column].text}`}>
                  {COL_LABEL[from.column]}
                </span>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center gap-1 shrink-0">
              <div className={`h-px w-12 ${violated ? "bg-amber-400" : "bg-border/60"}`} />
              <svg width="8" height="10" viewBox="0 0 8 10">
                <path
                  d="M0 0 L8 5 L0 10 Z"
                  fill={violated ? "#f59e0b" : "rgba(148,152,170,0.4)"}
                />
              </svg>
            </div>

            {/* To node */}
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: CAT_COLOR[to.category] ?? "#6366f1" }}
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-fg truncate">{to.title}</p>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${COL_BADGE[to.column].bg} ${COL_BADGE[to.column].text}`}>
                  {COL_LABEL[to.column]}
                </span>
              </div>
            </div>

            {violated && (
              <div className="ml-auto flex items-center gap-1 shrink-0">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-[11px] font-semibold text-amber-400">Missing dep</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Visual node map */}
      <div className="rounded-xl border border-border/50 bg-elevated p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Dependency Network</p>
        <div className="flex flex-wrap gap-3">
          {items.map((item) => {
            const hasViolation = violationIds.has(item.id);
            const isInSprint = sprintIds.has(item.id);
            const col = CAT_COLOR[item.category] ?? "#6366f1";

            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -2 }}
                className={`relative rounded-lg border px-3 py-2 ${
                  hasViolation
                    ? "border-amber-500/50 bg-amber-500/10"
                    : isInSprint
                    ? "border-brand/30 bg-brand/8"
                    : "border-border/50 bg-surface"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: col }} />
                  <span className="text-xs font-medium text-fg">{item.title}</span>
                  <span className="text-[10px] text-muted">({item.points})</span>
                </div>
                {item.dependencies.length > 0 && (
                  <div className="mt-1 flex items-center gap-0.5">
                    <GitBranch className="h-2.5 w-2.5 text-muted/60" />
                    <span className="text-[10px] text-muted">
                      {item.dependencies.length} dep{item.dependencies.length > 1 ? "s" : ""}
                    </span>
                  </div>
                )}
                {hasViolation && (
                  <div className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500">
                    <span className="text-[9px] text-white font-bold">!</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {depPairs.length === 0 && (
        <p className="text-sm text-muted text-center py-4">
          No dependency relationships found in the backlog.
        </p>
      )}
    </section>
  );
}
