"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  MessageSquare,
  Gauge,
  RotateCcw,
  Check,
  Users,
  Signal,
} from "lucide-react";
import { ANALYTICS_BASELINE, formatNum } from "@/lib/realtime";
import { cn } from "@/lib/utils";

const jitter = (base: number, spread: number) =>
  Math.round((base + (Math.random() - 0.5) * spread) * 100) / 100;

const EVENTS = [
  "msg · order #4821 status → Near you",
  "conn · 1,240 new connections opened",
  "msg · live score pushed to 512K viewers",
  "warn · 18 reconnect attempts (mobile)",
  "msg · typing indicator broadcast",
  "conn · region ap-south healthy",
];

/**
 * Section 11 — the live real-time dashboard a PM watches during a launch:
 * connections, throughput, latency, reconnections and delivery success,
 * all ticking in real time.
 */
export function RtAnalytics() {
  const b = ANALYTICS_BASELINE;
  const [live, setLive] = useState(true);
  const [m, setM] = useState({
    activeConnections: b.activeConnections,
    messagesPerSec: b.messagesPerSec,
    avgLatencyMs: b.avgLatencyMs,
    reconnectsPerMin: b.reconnectsPerMin,
    deliverySuccess: b.deliverySuccess,
    concurrentUsers: b.concurrentUsers,
  });
  const [spark, setSpark] = useState<number[]>(
    Array.from({ length: 24 }, () => 50 + Math.random() * 40)
  );
  const [feed, setFeed] = useState<string[]>([EVENTS[0]]);
  const timer = useRef<ReturnType<typeof setInterval>>();
  const ev = useRef(1);

  useEffect(() => {
    if (!live) {
      clearInterval(timer.current);
      return;
    }
    timer.current = setInterval(() => {
      setM({
        activeConnections: Math.round(jitter(b.activeConnections, 40_000)),
        messagesPerSec: Math.round(jitter(b.messagesPerSec, 9_000)),
        avgLatencyMs: Math.max(20, Math.round(jitter(b.avgLatencyMs, 36))),
        reconnectsPerMin: Math.max(0, Math.round(jitter(b.reconnectsPerMin, 120))),
        deliverySuccess: Math.min(100, jitter(b.deliverySuccess, 0.06)),
        concurrentUsers: Math.round(jitter(b.concurrentUsers, 50_000)),
      });
      setSpark((s) =>
        [...s.slice(1), 45 + Math.random() * 50].map(
          (v) => Math.round(v * 10) / 10
        )
      );
      if (Math.random() > 0.45) {
        setFeed((f) =>
          [EVENTS[ev.current++ % EVENTS.length], ...f].slice(0, 5)
        );
      }
    }, 1700);
    return () => clearInterval(timer.current);
  }, [live, b]);

  const maxSpark = Math.max(...spark);

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
          Real-time system health
          <span className="font-normal text-muted">
            {live ? "· streaming" : "· paused"}
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
        <Kpi
          icon={<Signal className="h-4 w-4" />}
          label="Active connections"
          value={formatNum(m.activeConnections)}
          tone="neutral"
        />
        <Kpi
          icon={<MessageSquare className="h-4 w-4" />}
          label="Messages / sec"
          value={formatNum(m.messagesPerSec)}
          tone="neutral"
        />
        <Kpi
          icon={<Gauge className="h-4 w-4" />}
          label="Avg latency"
          value={`${m.avgLatencyMs}ms`}
          tone={m.avgLatencyMs < 150 ? "ok" : "warn"}
        />
        <Kpi
          icon={<RotateCcw className="h-4 w-4" />}
          label="Reconnects / min"
          value={`${m.reconnectsPerMin}`}
          tone={m.reconnectsPerMin < 500 ? "ok" : "warn"}
        />
        <Kpi
          icon={<Check className="h-4 w-4" />}
          label="Delivery success"
          value={`${m.deliverySuccess.toFixed(2)}%`}
          tone="ok"
        />
        <Kpi
          icon={<Users className="h-4 w-4" />}
          label="Concurrent users"
          value={formatNum(m.concurrentUsers)}
          tone="neutral"
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* Throughput sparkline */}
        <div className="rounded-xl border border-border bg-bg p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
            <Activity className="h-3.5 w-3.5 text-brand" />
            Live update frequency
          </p>
          <div className="mt-4 flex h-24 items-end gap-1">
            {spark.map((v, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t bg-brand/70"
                animate={{ height: `${(v / maxSpark) * 84}px` }}
                transition={{ duration: 0.4 }}
              />
            ))}
          </div>
          <p className="mt-2 text-[11px] text-muted">
            Updates pushed per second across all live features.
          </p>
        </div>

        {/* Event stream */}
        <div className="rounded-xl border border-border bg-bg p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
            <Signal className="h-3.5 w-3.5 text-emerald-500" />
            Live event stream
          </p>
          <ul className="mt-3 space-y-2">
            {feed.map((e, i) => (
              <motion.li
                key={`${e}-${i}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-2 text-[12px] leading-snug text-muted"
              >
                <span
                  className={cn(
                    "mt-1 h-1.5 w-1.5 shrink-0 rounded-full",
                    e.startsWith("warn")
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  )}
                />
                {e}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-5 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">PM insight: </span>
        PMs monitor real-time reliability and latency. Delivery success and
        average latency are the numbers that tell you “live” actually feels
        live to users.
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
