"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  CheckCircle2,
  MousePointerClick,
  Eye,
  XCircle,
  BellOff,
  RotateCcw,
  TrendingUp,
  Activity,
} from "lucide-react";
import { ANALYTICS_BASELINE, formatNum } from "@/lib/notifications";
import { cn } from "@/lib/utils";

const jitter = (base: number, spread: number) =>
  Math.round((base + (Math.random() - 0.5) * spread) * 100) / 100;

const EVENTS = [
  "send · 4,210 order updates dispatched",
  "open · “Your order is arriving” opened ×1,884",
  "fail · 96 devices unreachable (offline)",
  "send · flash-sale campaign → 220K users",
  "warn · opt-out spike in promo segment",
  "open · OTP delivered & opened in 2.1s",
];

/**
 * Section 10 — the dashboard a PM actually watches. Volume, delivery,
 * open, click-through, failures, opt-out and engagement lift, live.
 */
export function NotifAnalytics() {
  const b = ANALYTICS_BASELINE;
  const [live, setLive] = useState(true);
  const [m, setM] = useState({ ...b });
  const [bars, setBars] = useState<number[]>(
    Array.from({ length: 24 }, () => 40 + Math.random() * 50)
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
        sent: Math.round(jitter(b.sent, 90_000)),
        deliveryRate: Math.min(99.9, jitter(b.deliveryRate, 1.4)),
        openRate: Math.max(2, jitter(b.openRate, 2.6)),
        ctr: Math.max(0.5, jitter(b.ctr, 1.1)),
        failed: Math.max(0, Math.round(jitter(b.failed, 9_000))),
        optOut: Math.max(0, jitter(b.optOut, 0.3)),
        retries: Math.max(0, Math.round(jitter(b.retries, 4_000))),
        engagementLift: Math.max(0, Math.round(jitter(b.engagementLift, 5))),
      });
      setBars((s) =>
        [...s.slice(1), 35 + Math.random() * 55].map(
          (v) => Math.round(v * 10) / 10
        )
      );
      if (Math.random() > 0.4) {
        setFeed((f) =>
          [EVENTS[ev.current++ % EVENTS.length], ...f].slice(0, 5)
        );
      }
    }, 1700);
    return () => clearInterval(timer.current);
  }, [live, b]);

  const maxBar = Math.max(...bars);

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
          Notification analytics
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

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi
          icon={<Send className="h-4 w-4" />}
          label="Sent (24h)"
          value={formatNum(m.sent)}
          tone="neutral"
        />
        <Kpi
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Delivery rate"
          value={`${m.deliveryRate.toFixed(1)}%`}
          tone={m.deliveryRate > 95 ? "ok" : "warn"}
        />
        <Kpi
          icon={<Eye className="h-4 w-4" />}
          label="Open rate"
          value={`${m.openRate.toFixed(1)}%`}
          tone={m.openRate > 8 ? "ok" : "warn"}
        />
        <Kpi
          icon={<MousePointerClick className="h-4 w-4" />}
          label="Click-through"
          value={`${m.ctr.toFixed(1)}%`}
          tone={m.ctr > 3 ? "ok" : "warn"}
        />
        <Kpi
          icon={<XCircle className="h-4 w-4" />}
          label="Failed deliveries"
          value={formatNum(m.failed)}
          tone="bad"
        />
        <Kpi
          icon={<BellOff className="h-4 w-4" />}
          label="Opt-out rate"
          value={`${m.optOut.toFixed(2)}%`}
          tone={m.optOut < 1.5 ? "ok" : "bad"}
        />
        <Kpi
          icon={<RotateCcw className="h-4 w-4" />}
          label="Retry attempts"
          value={formatNum(m.retries)}
          tone="warn"
        />
        <Kpi
          icon={<TrendingUp className="h-4 w-4" />}
          label="Engagement lift"
          value={`+${m.engagementLift}%`}
          tone="ok"
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-bg p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
            <Activity className="h-3.5 w-3.5 text-brand" />
            Notifications sent / min
          </p>
          <div className="mt-4 flex h-24 items-end gap-1">
            {bars.map((v, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t bg-brand/70"
                animate={{ height: `${(v / maxBar) * 84}px` }}
                transition={{ duration: 0.4 }}
              />
            ))}
          </div>
          <p className="mt-2 text-[11px] text-muted">
            Throughput across transactional + engagement notifications.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-bg p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
            <Send className="h-3.5 w-3.5 text-emerald-500" />
            Live delivery stream
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
                    e.startsWith("fail")
                      ? "bg-rose-500"
                      : e.startsWith("warn")
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
        PMs optimise notification systems using engagement metrics. Open rate
        and opt-out rate together tell you whether you're helping users or
        wearing them out — watch them move when you change strategy.
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
