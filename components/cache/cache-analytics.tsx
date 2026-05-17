"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Gauge,
  Zap,
  Database,
  Users,
  TrendingDown,
  ShieldCheck,
} from "lucide-react";
import { ANALYTICS_BASELINE, formatUsers } from "@/lib/caching";
import { cn } from "@/lib/utils";

const jitter = (base: number, spread: number) =>
  Math.round((base + (Math.random() - 0.5) * spread) * 10) / 10;

/**
 * Section 10 — a mock live performance dashboard. The numbers a PM
 * actually watches to know caching is working: response time, hit rate,
 * database load avoided, and failures prevented.
 */
export function CacheAnalytics() {
  const b = ANALYTICS_BASELINE;
  const [m, setM] = useState({
    avgResponseMs: b.avgResponseMs,
    cacheHitRate: b.cacheHitRate,
    dbLoadReduction: b.dbLoadReduction,
    latencyImprovement: b.latencyImprovement,
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
        avgResponseMs: Math.round(jitter(b.avgResponseMs, 50)),
        cacheHitRate: jitter(b.cacheHitRate, 3),
        dbLoadReduction: jitter(b.dbLoadReduction, 4),
        latencyImprovement: jitter(b.latencyImprovement, 1.5),
      });
    }, 1700);
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
          Performance analytics
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

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi
          icon={<Gauge className="h-4 w-4" />}
          label="Avg response"
          value={`${m.avgResponseMs}ms`}
          tone={m.avgResponseMs < 250 ? "ok" : "warn"}
        />
        <Kpi
          icon={<Zap className="h-4 w-4" />}
          label="Cache hit rate"
          value={`${m.cacheHitRate}%`}
          tone={m.cacheHitRate >= 85 ? "ok" : "warn"}
        />
        <Kpi
          icon={<Database className="h-4 w-4" />}
          label="DB load avoided"
          value={`${m.dbLoadReduction}%`}
          tone="ok"
        />
        <Kpi
          icon={<TrendingDown className="h-4 w-4" />}
          label="Faster than uncached"
          value={`${m.latencyImprovement}×`}
          tone="ok"
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-bg p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
            <Users className="h-3.5 w-3.5 text-brand" />
            Traffic handled this spike
          </p>
          <p className="mt-3 text-3xl font-bold tabular-nums text-brand">
            {formatUsers(b.trafficHandled)}
            <span className="ml-1 text-sm font-normal text-muted">
              requests
            </span>
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
            <motion.div
              className="h-full rounded-full bg-brand"
              initial={{ width: 0 }}
              whileInView={{ width: `${m.cacheHitRate}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <p className="mt-2 text-[11px] text-muted">
            {m.cacheHitRate}% served from cache · only{" "}
            {(100 - m.cacheHitRate).toFixed(1)}% reached the database
          </p>
        </div>

        <div className="rounded-xl border border-border bg-bg p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            Failed requests avoided
          </p>
          <p className="mt-3 text-3xl font-bold tabular-nums text-emerald-500">
            {formatUsers(b.failedRequestsAvoided)}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Requests that would have timed out against an overloaded database
            were served instantly from cache instead — users never saw an
            error.
          </p>
        </div>
      </div>

      <p className="mt-5 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">PM insight: </span>
        PMs monitor performance metrics to improve user experience. Hit rate
        and response time are leading indicators of retention — watch them the
        way you watch conversion.
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
