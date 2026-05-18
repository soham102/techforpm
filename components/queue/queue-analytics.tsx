"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Layers,
  Activity,
  XCircle,
  RotateCcw,
  Clock,
  Cpu,
  Boxes,
} from "lucide-react";
import { QUEUE_ANALYTICS_BASELINE as B } from "@/lib/queues";
import { cn } from "@/lib/utils";

const jitter = (base: number, spread: number, dp = 0) => {
  const v = base + (Math.random() - 0.5) * spread;
  const f = 10 ** dp;
  return Math.round(Math.max(0, v) * f) / f;
};

/**
 * Section 11 — the operational dashboard a PM actually watches to keep
 * a queue-backed system healthy. Self-updating with a throughput trend.
 */
export function QueueAnalytics() {
  const [m, setM] = useState({
    queueLength: B.queueLength,
    throughput: B.throughput,
    failed: B.failed,
    retries: B.retries,
    avgProcessing: B.avgProcessing,
    workerUtil: B.workerUtil,
    backlog: B.backlog,
  });
  const [trend, setTrend] = useState<number[]>(
    Array.from({ length: 24 }, () => B.throughput)
  );
  const [live, setLive] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!live) {
      clearInterval(timer.current);
      return;
    }
    timer.current = setInterval(() => {
      const throughput = jitter(B.throughput, 16);
      setM({
        queueLength: jitter(B.queueLength, 30),
        throughput,
        failed: jitter(B.failed, 5),
        retries: jitter(B.retries, 8),
        avgProcessing: jitter(B.avgProcessing, 0.8, 1),
        workerUtil: jitter(B.workerUtil, 22),
        backlog: jitter(B.backlog, 70),
      });
      setTrend((prev) => [...prev.slice(1), throughput]);
    }, 1500);
    return () => clearInterval(timer.current);
  }, [live]);

  const tiles = [
    { icon: <Layers className="h-4 w-4" />, label: "Queue length", value: `${m.queueLength}` },
    { icon: <Activity className="h-4 w-4" />, label: "Throughput", value: `${m.throughput}/s` },
    { icon: <XCircle className="h-4 w-4" />, label: "Failed jobs", value: `${m.failed}` },
    { icon: <RotateCcw className="h-4 w-4" />, label: "Retry attempts", value: `${m.retries}` },
    { icon: <Clock className="h-4 w-4" />, label: "Avg processing", value: `${m.avgProcessing}s` },
    { icon: <Cpu className="h-4 w-4" />, label: "Worker utilization", value: `${m.workerUtil}%` },
  ];

  const maxTrend = Math.max(...trend, 1);

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
          Queue health
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
          <div key={t.label} className="rounded-xl border border-border bg-bg p-4">
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

      {/* Throughput trend */}
      <div className="mt-4 rounded-xl border border-border bg-bg p-4">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-[11px] text-muted">
            <Boxes className="h-4 w-4 text-brand" />
            Throughput trend (jobs / sec)
          </p>
          <span className="text-[11px] font-semibold text-muted">
            backlog ~{m.backlog}
          </span>
        </div>
        <div className="mt-3 flex h-24 items-end gap-1">
          {trend.map((v, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-sm bg-brand/70"
              animate={{ height: `${(v / maxTrend) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          ))}
        </div>
      </div>

      <p className="mt-5 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">PM insight: </span>
        PMs watch queues to maintain performance. A rising backlog or falling
        throughput is an early warning — long before users start complaining.
      </p>
    </div>
  );
}
