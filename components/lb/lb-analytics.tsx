"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Activity,
  Cpu,
  Clock,
  XCircle,
  ShieldCheck,
  Server,
} from "lucide-react";
import { ANALYTICS_BASELINE, formatUsers } from "@/lib/load-balancing";
import { cn } from "@/lib/utils";

const jitter = (base: number, spread: number) =>
  Math.round((base + (Math.random() - 0.5) * spread) * 100) / 100;

const SCALE_EVENTS = [
  "Scaled up: +1 server (Mumbai) · dinner rush",
  "Health check: Server 3 back online",
  "Traffic rebalanced across 6 servers",
  "Scaled down: -1 server · off-peak",
  "Spike absorbed: +2 servers (auto)",
];

/**
 * Section 10 — the live traffic dashboard a PM watches during a high-traffic
 * launch. Numbers tick in real time; the distribution bar shows traffic
 * spread evenly across the fleet.
 */
export function LbAnalytics() {
  const b = ANALYTICS_BASELINE;
  const [live, setLive] = useState(true);
  const [m, setM] = useState({
    activeUsers: b.activeUsers,
    throughputRps: b.throughputRps,
    avgServerUtil: b.avgServerUtil,
    avgResponseMs: b.avgResponseMs,
    failedRequests: b.failedRequests,
    uptimePct: b.uptimePct,
  });
  const [dist, setDist] = useState([18, 16, 17, 16, 17, 16]);
  const [events, setEvents] = useState<string[]>([SCALE_EVENTS[0]]);
  const timer = useRef<ReturnType<typeof setInterval>>();
  const evIdx = useRef(1);

  useEffect(() => {
    if (!live) {
      clearInterval(timer.current);
      return;
    }
    timer.current = setInterval(() => {
      setM({
        activeUsers: Math.round(jitter(b.activeUsers, 60_000)),
        throughputRps: Math.round(jitter(b.throughputRps, 4_000)),
        avgServerUtil: Math.round(jitter(b.avgServerUtil, 9)),
        avgResponseMs: Math.round(jitter(b.avgResponseMs, 60)),
        failedRequests: Math.max(0, jitter(b.failedRequests, 0.04)),
        uptimePct: Math.min(100, jitter(b.uptimePct, 0.02)),
      });
      setDist((d) =>
        d.map((v) => Math.max(10, Math.min(24, Math.round(jitter(v, 5)))))
      );
      if (Math.random() > 0.55) {
        setEvents((e) =>
          [SCALE_EVENTS[evIdx.current++ % SCALE_EVENTS.length], ...e].slice(0, 4)
        );
      }
    }, 1800);
    return () => clearInterval(timer.current);
  }, [live, b]);

  const totalDist = dist.reduce((a, v) => a + v, 0);

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
          Live traffic dashboard
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

      {/* KPI grid */}
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Kpi
          icon={<Users className="h-4 w-4" />}
          label="Active users"
          value={formatUsers(m.activeUsers)}
          tone="neutral"
        />
        <Kpi
          icon={<Activity className="h-4 w-4" />}
          label="Requests / sec"
          value={formatUsers(m.throughputRps)}
          tone="neutral"
        />
        <Kpi
          icon={<Cpu className="h-4 w-4" />}
          label="Avg server load"
          value={`${m.avgServerUtil}%`}
          tone={m.avgServerUtil < 75 ? "ok" : "warn"}
        />
        <Kpi
          icon={<Clock className="h-4 w-4" />}
          label="Avg response"
          value={`${m.avgResponseMs}ms`}
          tone={m.avgResponseMs < 300 ? "ok" : "warn"}
        />
        <Kpi
          icon={<XCircle className="h-4 w-4" />}
          label="Failed requests"
          value={`${m.failedRequests.toFixed(2)}%`}
          tone={m.failedRequests < 0.1 ? "ok" : "bad"}
        />
        <Kpi
          icon={<ShieldCheck className="h-4 w-4" />}
          label="Uptime"
          value={`${m.uptimePct.toFixed(2)}%`}
          tone="ok"
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* Traffic distribution */}
        <div className="rounded-xl border border-border bg-bg p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
            <Server className="h-3.5 w-3.5 text-brand" />
            Traffic distribution · {b.serversOnline} servers
          </p>
          <div className="mt-4 flex h-28 items-end gap-2">
            {dist.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <motion.div
                  className="w-full rounded-t-md bg-brand"
                  animate={{
                    height: `${(v / Math.max(...dist)) * 88}px`,
                  }}
                  transition={{ duration: 0.6 }}
                />
                <span className="text-[10px] tabular-nums text-muted">
                  {Math.round((v / totalDist) * 100)}%
                </span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-muted">
            Roughly even share per server — the sign of a healthy balancer.
          </p>
        </div>

        {/* Scaling events */}
        <div className="rounded-xl border border-border bg-bg p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
            <Activity className="h-3.5 w-3.5 text-emerald-500" />
            Scaling & health events
          </p>
          <ul className="mt-3 space-y-2">
            {events.map((e, i) => (
              <motion.li
                key={`${e}-${i}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-2 text-[12px] leading-snug text-muted"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                {e}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-5 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">PM insight: </span>
        PMs monitor system health during high-traffic launches. Watching
        response time, failure rate and traffic spread tells you the product is
        holding — before users tweet that it isn't.
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
