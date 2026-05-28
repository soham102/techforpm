"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, BarChart3 } from "lucide-react";
import { BacklogCard } from "./backlog-card";
import type { BacklogItem, Column } from "./types";

const COLUMNS: {
  id: Column;
  label: string;
  emoji: string;
  desc: string;
  activeColor: string;
  headerColor: string;
}[] = [
  {
    id: "backlog",
    label: "Product Backlog",
    emoji: "📋",
    desc: "All prioritized work",
    activeColor: "border-brand/50 bg-brand/5 shadow-glow",
    headerColor: "text-muted",
  },
  {
    id: "sprint",
    label: "Selected for Sprint",
    emoji: "🚀",
    desc: "Committed this sprint",
    activeColor: "border-brand/50 bg-brand/5 shadow-[0_0_24px_rgba(99,102,241,0.2)]",
    headerColor: "text-brand",
  },
  {
    id: "high-risk",
    label: "High Risk",
    emoji: "⚠️",
    desc: "Flagged for monitoring",
    activeColor: "border-amber-500/50 bg-amber-500/5",
    headerColor: "text-amber-400",
  },
  {
    id: "blocked",
    label: "Dependency Blocked",
    emoji: "🔒",
    desc: "Cannot start yet",
    activeColor: "border-red-500/50 bg-red-500/5",
    headerColor: "text-red-400",
  },
];

interface Props {
  items: BacklogItem[];
  onMove: (id: string, col: Column) => void;
  dependencyViolations: BacklogItem[];
  sprintPoints: number;
  totalCapacity: number;
  healthScore: number;
}

function CapacityBar({ sprintPoints, totalCapacity }: { sprintPoints: number; totalCapacity: number }) {
  const pct = totalCapacity > 0 ? (sprintPoints / totalCapacity) * 100 : 0;
  const over = sprintPoints > totalCapacity;
  const warn = pct > 90;

  const barColor = over
    ? "bg-red-500"
    : warn
    ? "bg-amber-500"
    : pct > 70
    ? "bg-yellow-400"
    : "bg-green-500";

  const label = over
    ? { text: "🔴 Overcommitted", color: "text-red-400" }
    : warn
    ? { text: "🟡 Moderate Risk", color: "text-amber-400" }
    : { text: "🟢 Healthy", color: "text-green-400" };

  return (
    <div className="rounded-xl border border-border/60 bg-elevated p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-brand" />
          <span className="text-sm font-semibold text-fg">Sprint Capacity</span>
        </div>
        <div className="flex items-center gap-3">
          <AnimatePresence mode="wait">
            <motion.span
              key={label.text}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className={`text-xs font-semibold ${label.color}`}
            >
              {label.text}
            </motion.span>
          </AnimatePresence>
          <motion.span
            key={sprintPoints}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className={`text-sm font-bold ${over ? "text-red-400" : "text-fg"}`}
          >
            {sprintPoints}
            <span className="font-normal text-muted">/{totalCapacity} pts</span>
          </motion.span>
        </div>
      </div>

      <div className="relative h-3 rounded-full bg-border/40 overflow-hidden">
        <motion.div
          key={sprintPoints}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(pct, 100)}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`absolute inset-y-0 left-0 rounded-full ${barColor} transition-colors`}
        />
        {over && (
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 rounded-full bg-red-500/20"
          />
        )}
      </div>

      {over && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-2 flex items-center gap-1.5 text-xs text-red-400"
        >
          <AlertTriangle className="h-3 w-3 shrink-0" />
          Sprint overloaded by {sprintPoints - totalCapacity} story points. High probability of spillover.
        </motion.p>
      )}

      <p className="mt-2 text-[11px] text-muted">
        Story points measure complexity, not time. Leave 10% buffer for reviews, QA, and unexpected work.
      </p>
    </div>
  );
}

export function SprintBoard({ items, onMove, dependencyViolations, sprintPoints, totalCapacity, healthScore }: Props) {
  const [draggingOver, setDraggingOver] = useState<Column | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const violationIds = new Set(dependencyViolations.map(i => i.id));

  return (
    <section id="sprint-board">
      {/* Header */}
      <div className="mb-5">
        <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-brand">
          Sections 2 & 3
        </p>
        <h2 className="text-2xl font-bold text-fg">Sprint Planning Board</h2>
        <p className="mt-1 text-sm text-muted">
          Hover over cards to see actions. Drag cards between columns or use the quick buttons.
        </p>
      </div>

      {/* Capacity bar */}
      <div className="mb-5">
        <CapacityBar sprintPoints={sprintPoints} totalCapacity={totalCapacity} />
      </div>

      {/* Board */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const colItems = items.filter(i => i.column === col.id);
          const colPoints = colItems.reduce((s, i) => s + i.points, 0);
          const isOver = draggingOver === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => { e.preventDefault(); setDraggingOver(col.id); }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setDraggingOver(null);
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("itemId");
                if (id && id !== "") onMove(id, col.id);
                setDraggingOver(null);
                setDraggingId(null);
              }}
              className={[
                "flex flex-col rounded-2xl border-2 p-3 min-h-[440px] transition-all duration-200",
                isOver
                  ? col.activeColor
                  : "border-border/50 bg-surface/50",
              ].join(" ")}
            >
              {/* Column header */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{col.emoji}</span>
                  <div>
                    <p className={`text-xs font-bold ${col.headerColor}`}>{col.label}</p>
                    <p className="text-[10px] text-muted">{col.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {colItems.length > 0 && (
                    <span className="rounded-full bg-elevated border border-border/50 px-1.5 py-0.5 text-[10px] font-medium text-muted">
                      {colItems.length}
                    </span>
                  )}
                  {colPoints > 0 && (
                    <span className="rounded-full bg-brand/10 border border-brand/20 px-1.5 py-0.5 text-[10px] font-semibold text-brand">
                      {colPoints}pt
                    </span>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="flex-1 space-y-2">
                <AnimatePresence mode="popLayout">
                  {colItems.map((item) => (
                    <BacklogCard
                      key={item.id}
                      item={item}
                      allItems={items}
                      onMove={onMove}
                      hasDependencyViolation={violationIds.has(item.id)}
                      compact
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Drop zone indicator */}
              <AnimatePresence>
                {isOver && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mt-2 flex items-center justify-center rounded-xl border-2 border-dashed border-brand/50 py-4"
                  >
                    <p className="text-xs font-semibold text-brand">Drop here</p>
                  </motion.div>
                )}
                {!isOver && colItems.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/30 py-6"
                  >
                    <p className="text-[11px] text-muted/50">Drag items here</p>
                    <p className="text-[10px] text-muted/30">or use card buttons</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Education callout */}
      <AnimatePresence>
        {dependencyViolations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-4 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/8 p-4"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <p className="text-sm font-bold text-amber-400">Dependency risk detected.</p>
              <p className="mt-0.5 text-xs text-muted">
                {dependencyViolations.map(i => i.title).join(", ")} require{dependencyViolations.length === 1 ? "s" : ""} prerequisite stories that aren't in the sprint.
                This is how sprints get blocked on day 7.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
