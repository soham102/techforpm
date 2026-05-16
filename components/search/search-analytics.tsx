"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Clock,
  MousePointerClick,
  ShoppingBag,
  SearchX,
  Activity,
} from "lucide-react";
import { ANALYTICS } from "@/lib/search";
import { cn } from "@/lib/utils";

const jitter = (base: number, spread: number) =>
  Math.round((base + (Math.random() - 0.5) * spread) * 10) / 10;

/** Section 10 — a mock live search-analytics dashboard for PMs. */
export function SearchAnalytics() {
  const b = ANALYTICS.baseline;
  const [m, setM] = useState({
    successRate: b.successRate,
    latencyMs: b.latencyMs,
    ctr: b.ctr,
    conversion: b.conversion,
  });
  const [live, setLive] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!live) {
      clearInterval(timer.current);
      return;
    }
    timer.current = setInterval(() => {
      setM({
        successRate: jitter(b.successRate, 4),
        latencyMs: Math.round(jitter(b.latencyMs, 60)),
        ctr: jitter(b.ctr, 6),
        conversion: jitter(b.conversion, 4),
      });
    }, 1600);
    return () => clearInterval(timer.current);
  }, [live, b]);

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
          Search analytics
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

      {/* KPI tiles */}
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi
          icon={<Activity className="h-4 w-4" />}
          label="Success rate"
          value={`${m.successRate}%`}
          tone={m.successRate >= 90 ? "ok" : "warn"}
        />
        <Kpi
          icon={<Clock className="h-4 w-4" />}
          label="Avg latency"
          value={`${m.latencyMs}ms`}
          tone={m.latencyMs > 300 ? "bad" : "ok"}
        />
        <Kpi
          icon={<MousePointerClick className="h-4 w-4" />}
          label="Click-through"
          value={`${m.ctr}%`}
        />
        <Kpi
          icon={<ShoppingBag className="h-4 w-4" />}
          label="Conv. after search"
          value={`${m.conversion}%`}
          tone={m.conversion >= 22 ? "ok" : "warn"}
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* top searches */}
        <div className="rounded-xl border border-border bg-bg p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
            <TrendingUp className="h-3.5 w-3.5 text-brand" />
            Top searched items
          </p>
          <div className="mt-3 space-y-2.5">
            {ANALYTICS.topSearches.map((t) => (
              <div key={t.term}>
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{t.term}</span>
                  <span className="text-muted">{t.share}%</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-border">
                  <motion.div
                    className="h-full rounded-full bg-brand"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${t.share * 2.5}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* no-result queries */}
        <div className="rounded-xl border border-border bg-bg p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
            <SearchX className="h-3.5 w-3.5 text-rose-500" />
            No-result queries (fix these)
          </p>
          <div className="mt-3 space-y-2">
            {ANALYTICS.noResultQueries.map((q) => (
              <div
                key={q}
                className="flex items-center justify-between rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-xs"
              >
                <span className="font-mono">“{q}”</span>
                <span className="text-rose-500">0 results</span>
              </div>
            ))}
            <p className="pt-1 text-[11px] leading-relaxed text-muted">
              Each of these is a user who wanted something you couldn't
              surface — a direct roadmap signal.
            </p>
          </div>
        </div>
      </div>

      <p className="mt-5 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">PM insight: </span>
        PMs optimize search using analytics — no-result queries and low
        post-search conversion are some of the highest-signal data you have.
      </p>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  tone = "neutral",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "neutral" | "ok" | "warn" | "bad";
}) {
  const tones = {
    neutral: "text-fg",
    ok: "text-emerald-500",
    warn: "text-amber-500",
    bad: "text-rose-500",
  };
  return (
    <div className="rounded-xl border border-border bg-bg p-4">
      <p className="flex items-center gap-1.5 text-[11px] text-muted">
        <span className="text-brand">{icon}</span>
        {label}
      </p>
      <motion.p
        key={value}
        initial={{ opacity: 0.5, y: -3 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("mt-1 text-xl font-bold tabular-nums", tones[tone])}
      >
        {value}
      </motion.p>
    </div>
  );
}
