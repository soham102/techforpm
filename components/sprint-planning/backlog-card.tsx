"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Lock, ArrowRight, ChevronLeft } from "lucide-react";
import type { BacklogItem, Column } from "./types";

const CAT: Record<string, { bg: string; text: string; border: string }> = {
  Backend:  { bg: "bg-blue-500/10",   text: "text-blue-400",   border: "border-blue-500/30"   },
  Frontend: { bg: "bg-cyan-500/10",   text: "text-cyan-400",   border: "border-cyan-500/30"   },
  Design:   { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  QA:       { bg: "bg-green-500/10",  text: "text-green-400",  border: "border-green-500/30"  },
};

const PRI: Record<string, { bg: string; text: string }> = {
  P0: { bg: "bg-red-500/15",    text: "text-red-400"    },
  P1: { bg: "bg-orange-500/15", text: "text-orange-400" },
  P2: { bg: "bg-yellow-500/15", text: "text-yellow-400" },
  P3: { bg: "bg-gray-500/15",   text: "text-muted"      },
};

const IMPACT_TEXT: Record<string, string> = {
  Critical: "text-red-400",
  High:     "text-orange-400",
  Medium:   "text-yellow-400",
  Low:      "text-muted",
};

const POINT_CLASS: Record<number, string> = {
  1:  "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  3:  "bg-green-500/20   text-green-400   border-green-500/30",
  5:  "bg-blue-500/20    text-blue-400    border-blue-500/30",
  8:  "bg-amber-500/20   text-amber-400   border-amber-500/30",
  13: "bg-red-500/20     text-red-400     border-red-500/30",
};

interface Props {
  item: BacklogItem;
  allItems: BacklogItem[];
  onMove: (id: string, col: Column) => void;
  hasDependencyViolation?: boolean;
  compact?: boolean;
}

export function BacklogCard({ item, allItems, onMove, hasDependencyViolation, compact }: Props) {
  const cat = CAT[item.category] ?? CAT.Backend;
  const pri = PRI[item.priority] ?? PRI.P3;
  const pts = POINT_CLASS[item.points] ?? POINT_CLASS[5];

  const depNames = item.dependencies
    .map(d => allItems.find(i => i.id === d)?.title)
    .filter((t): t is string => Boolean(t));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <div
        draggable
        onDragStart={(e: React.DragEvent<HTMLDivElement>) =>
          e.dataTransfer.setData("itemId", item.id)
        }
        className={[
          "group relative rounded-xl border bg-surface transition-all cursor-grab active:cursor-grabbing",
          "hover:shadow-[0_4px_20px_rgba(99,102,241,0.18)] hover:-translate-y-px",
          compact ? "p-3" : "p-3.5",
          hasDependencyViolation
            ? "border-amber-500/50 bg-amber-500/5"
            : "border-border/70",
        ].join(" ")}
      >
        {/* Top row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1 mb-1.5">
              <span className={`rounded px-1.5 py-0.5 text-[11px] font-bold ${pri.bg} ${pri.text}`}>
                {item.priority}
              </span>
              <span className={`rounded border px-1.5 py-0.5 text-[11px] font-medium ${cat.bg} ${cat.text} ${cat.border}`}>
                {item.category}
              </span>
              {hasDependencyViolation && (
                <span className="flex items-center gap-0.5 rounded border border-amber-500/30 bg-amber-500/15 px-1.5 py-0.5 text-[11px] font-medium text-amber-400">
                  <AlertTriangle className="h-2.5 w-2.5" /> Dep Risk
                </span>
              )}
            </div>
            <p className={`font-semibold text-fg leading-tight ${compact ? "text-xs" : "text-sm"} truncate`}>
              {item.title}
            </p>
          </div>
          <div className={`shrink-0 flex h-6 w-6 items-center justify-center rounded-lg border text-[11px] font-bold ${pts}`}>
            {item.points}
          </div>
        </div>

        {!compact && (
          <p className="mb-2 text-xs text-muted line-clamp-1">{item.description}</p>
        )}

        {/* Meta */}
        <div className="mb-2 flex gap-3 text-[11px] text-muted">
          <span>
            Impact:{" "}
            <span className={`font-semibold ${IMPACT_TEXT[item.businessImpact]}`}>
              {item.businessImpact}
            </span>
          </span>
          <span>
            Complexity: <span className="font-medium text-fg/70">{item.complexity}</span>
          </span>
        </div>

        {depNames.length > 0 && (
          <div className="mb-2 flex items-center gap-1 text-[11px] text-muted">
            <Lock className="h-3 w-3 shrink-0 text-amber-400" />
            <span className="truncate">Needs: {depNames.join(", ")}</span>
          </div>
        )}

        {/* Action buttons — visible on hover */}
        <div className="flex flex-wrap gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          {item.column !== "sprint" && (
            <button
              onClick={() => onMove(item.id, "sprint")}
              className="flex items-center gap-0.5 rounded-lg px-2 py-0.5 text-[11px] font-medium bg-brand/15 text-brand hover:bg-brand/30 transition-colors"
            >
              <ArrowRight className="h-2.5 w-2.5" /> Sprint
            </button>
          )}
          {item.column !== "high-risk" && (
            <button
              onClick={() => onMove(item.id, "high-risk")}
              className="flex items-center gap-0.5 rounded-lg px-2 py-0.5 text-[11px] font-medium bg-amber-500/15 text-amber-400 hover:bg-amber-500/30 transition-colors"
            >
              <AlertTriangle className="h-2.5 w-2.5" /> Risk
            </button>
          )}
          {item.column !== "blocked" && (
            <button
              onClick={() => onMove(item.id, "blocked")}
              className="flex items-center gap-0.5 rounded-lg px-2 py-0.5 text-[11px] font-medium bg-red-500/15 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              <Lock className="h-2.5 w-2.5" /> Block
            </button>
          )}
          {item.column !== "backlog" && (
            <button
              onClick={() => onMove(item.id, "backlog")}
              className="flex items-center gap-0.5 rounded-lg border border-border/50 px-2 py-0.5 text-[11px] font-medium text-muted hover:text-fg hover:bg-elevated transition-colors"
            >
              <ChevronLeft className="h-2.5 w-2.5" /> Backlog
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
