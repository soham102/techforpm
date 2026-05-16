"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Server, TriangleAlert } from "lucide-react";
import { GROWTH_TIMELINE } from "@/lib/microservices";
import { cn } from "@/lib/utils";

/** Section 3 — step through QuickBite's growth and watch stress climb. */
export function ScalingTimeline() {
  const [stage, setStage] = useState(0);
  const s = GROWTH_TIMELINE[stage];

  const traffic = [22, 55, 80, 100][stage];
  const downtime = [5, 22, 55, 90][stage];

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      {/* timeline rail */}
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 right-0 top-4 h-0.5 bg-border" />
        <motion.div
          className="absolute left-0 top-4 h-0.5 bg-brand"
          animate={{
            width: `${(stage / (GROWTH_TIMELINE.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.4 }}
        />
        {GROWTH_TIMELINE.map((g, i) => (
          <button
            key={g.users}
            onClick={() => setStage(i)}
            className="relative z-10 flex flex-col items-center gap-2"
          >
            <span
              className={cn(
                "grid h-8 w-8 place-items-center rounded-full border-2 text-xs font-bold transition-colors",
                i <= stage
                  ? "border-brand bg-brand text-white"
                  : "border-border bg-surface text-muted"
              )}
            >
              {i + 1}
            </span>
            <span
              className={cn(
                "text-[11px] font-medium",
                i === stage ? "text-fg" : "text-muted"
              )}
            >
              {g.users}
            </span>
          </button>
        ))}
      </div>

      <motion.div
        key={stage}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mt-8"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">
          {s.headline}
        </p>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          {s.body}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Bar
            icon={<TrendingUp className="h-4 w-4" />}
            label="Traffic"
            value={traffic}
            tone="sky"
          />
          <Bar
            icon={<Server className="h-4 w-4" />}
            label="Backend stress"
            value={s.stress}
            tone="amber"
          />
          <Bar
            icon={<TriangleAlert className="h-4 w-4" />}
            label="Downtime risk"
            value={downtime}
            tone="rose"
          />
        </div>
      </motion.div>

      <p className="mt-6 rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
        PM insight: architecture decisions evolve with business scale — the
        monolith that launched fast becomes the bottleneck that stalls growth.
      </p>
    </div>
  );
}

function Bar({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: "sky" | "amber" | "rose";
}) {
  const tones = {
    sky: "bg-sky-500 text-sky-500",
    amber: "bg-amber-500 text-amber-500",
    rose: "bg-rose-500 text-rose-500",
  };
  return (
    <div className="rounded-xl border border-border bg-bg p-4">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-medium">
          <span className={tones[tone].split(" ")[1]}>{icon}</span>
          {label}
        </span>
        <span className="font-semibold tabular-nums">{value}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
        <motion.div
          className={cn("h-full rounded-full", tones[tone].split(" ")[0])}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
