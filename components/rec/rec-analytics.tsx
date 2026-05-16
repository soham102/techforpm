"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  MousePointerClick,
  Clock,
  CheckCircle2,
  Activity,
  Target,
  Repeat,
} from "lucide-react";
import { REC_ANALYTICS } from "@/lib/recommendations";
import { cn } from "@/lib/utils";

const jitter = (base: number, spread: number) =>
  Math.round((base + (Math.random() - 0.5) * spread) * 10) / 10;

export function RecAnalytics() {
  const b = REC_ANALYTICS.baseline;
  const [m, setM] = useState(b);
  const [live, setLive] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!live) {
      clearInterval(timer.current);
      return;
    }
    timer.current = setInterval(() => {
      setM({
        ctr: jitter(b.ctr, 6),
        watchMin: jitter(b.watchMin, 8),
        acceptance: jitter(b.acceptance, 6),
        engagement: jitter(b.engagement, 5),
        accuracy: jitter(b.accuracy, 4),
        repeat: jitter(b.repeat, 5),
      });
    }, 1600);
    return () => clearInterval(timer.current);
  }, [live, b]);

  const tiles = [
    { icon: <MousePointerClick className="h-4 w-4" />, label: "Click-through rate", value: `${m.ctr}%` },
    { icon: <Clock className="h-4 w-4" />, label: "Avg session", value: `${m.watchMin} min` },
    { icon: <CheckCircle2 className="h-4 w-4" />, label: "Rec acceptance", value: `${m.acceptance}%` },
    { icon: <Activity className="h-4 w-4" />, label: "Engagement score", value: `${m.engagement}` },
    { icon: <Target className="h-4 w-4" />, label: "Personalization accuracy", value: `${m.accuracy}%` },
    { icon: <Repeat className="h-4 w-4" />, label: "Repeat usage", value: `${m.repeat}%` },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="relative flex h-2.5 w-2.5">
            {live && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
            )}
            <span
              className={cn(
                "relative inline-flex h-2.5 w-2.5 rounded-full",
                live ? "bg-emerald-500" : "bg-muted"
              )}
            />
          </span>
          Recommendation analytics
          <span className="font-normal text-muted">
            {live ? "· live" : "· paused"}
          </span>
        </div>
        <button
          onClick={() => setLive((v) => !v)}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-brand/40"
        >
          {live ? "Pause" : "Resume"}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
        {tiles.map((t) => (
          <div
            key={t.label}
            className="rounded-xl border border-border bg-bg p-4"
          >
            <p className="flex items-center gap-1.5 text-[11px] text-muted">
              <span className="text-brand">{t.icon}</span>
              {t.label}
            </p>
            <motion.p
              key={t.value}
              initial={{ opacity: 0.5, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-xl font-bold tabular-nums"
            >
              {t.value}
            </motion.p>
          </div>
        ))}
      </div>

      <p className="mt-5 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">PM insight: </span>
        PMs optimize recommendation systems using behavioral metrics —
        acceptance rate and repeat usage tell you far more than model accuracy
        alone.
      </p>
    </div>
  );
}
