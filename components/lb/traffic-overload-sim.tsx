"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Server, ServerCrash, Clock, XCircle } from "lucide-react";
import { TRAFFIC_STEPS, formatUsers, pct } from "@/lib/load-balancing";
import { cn } from "@/lib/utils";

/** One overloaded server: stress, latency and failures vs traffic. */
function model(users: number) {
  const tier = TRAFFIC_STEPS.indexOf(users as (typeof TRAFFIC_STEPS)[number]);
  const stress = pct(18 + tier * 30);
  const crashed = stress >= 90;
  return {
    stress,
    crashed,
    queued: Math.round(users * (tier >= 2 ? 0.55 : 0.15)),
    latencyMs: 220 + tier * 1700,
    failedPct: crashed ? (tier === 3 ? 71 : 44) : tier >= 2 ? 12 : 0,
  };
}

/**
 * Section 2 — IPL finals booking opens. Push the traffic up and watch a
 * single server's stress meter climb, requests pile up, response time
 * balloon and finally the server crash.
 */
export function TrafficOverloadSim() {
  const [idx, setIdx] = useState(0);
  const users = TRAFFIC_STEPS[idx];
  const m = model(users);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Users className="h-4 w-4 text-brand" />
        IPL finals booking — users clicking at once
        <span className="ml-auto rounded-full bg-brand-soft px-3 py-1 text-brand">
          {formatUsers(users)}
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={TRAFFIC_STEPS.length - 1}
        step={1}
        value={idx}
        onChange={(e) => setIdx(Number(e.target.value))}
        className="mt-4 w-full accent-[rgb(var(--brand))]"
        aria-label="Number of concurrent users"
      />
      <div className="mt-1 flex justify-between text-[11px] text-muted">
        {TRAFFIC_STEPS.map((s, i) => (
          <button
            key={s}
            onClick={() => setIdx(i)}
            className={cn(
              "tabular-nums transition-colors",
              i === idx ? "font-bold text-brand" : "hover:text-fg"
            )}
          >
            {formatUsers(s)}
          </button>
        ))}
      </div>

      {/* Flow: users -> single server -> outcome */}
      <div className="mt-7 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-2xl border border-border bg-bg p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            Users
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.span
                key={i}
                className="h-2 w-2 rounded-full bg-brand"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.05,
                }}
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">
            All requests aimed at <span className="font-semibold text-fg">one</span>{" "}
            server
          </p>
        </div>

        <div className="grid place-items-center">
          <motion.div
            animate={
              m.crashed
                ? { x: [-2, 2, -2, 0], rotate: [-1, 1, -1, 0] }
                : { scale: [1, 1.02, 1] }
            }
            transition={{
              duration: m.crashed ? 0.4 : 1.5,
              repeat: Infinity,
            }}
            className={cn(
              "grid h-20 w-20 place-items-center rounded-2xl border-2 transition-colors",
              m.crashed
                ? "border-rose-500/60 bg-rose-500/15 text-rose-500"
                : m.stress > 60
                ? "border-amber-500/50 bg-amber-500/15 text-amber-500"
                : "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
            )}
          >
            {m.crashed ? (
              <ServerCrash className="h-8 w-8" />
            ) : (
              <Server className="h-8 w-8" />
            )}
          </motion.div>
        </div>

        <div
          className={cn(
            "rounded-2xl border p-5",
            m.crashed
              ? "border-rose-500/40 bg-rose-500/5"
              : m.stress > 60
              ? "border-amber-500/30 bg-amber-500/5"
              : "border-emerald-500/30 bg-emerald-500/5"
          )}
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            Outcome
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={m.crashed ? "down" : "up"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "mt-2 text-lg font-bold",
                m.crashed
                  ? "text-rose-500"
                  : m.stress > 60
                  ? "text-amber-500"
                  : "text-emerald-500"
              )}
            >
              {m.crashed
                ? "Server crashed"
                : m.stress > 60
                ? "Under heavy stress"
                : "Coping for now"}
            </motion.p>
          </AnimatePresence>
          <p className="mt-1 text-xs text-muted">
            {m.crashed
              ? "Booking page returns timeouts for everyone"
              : m.stress > 60
              ? "Slowing down — close to its limit"
              : "Single server still handling the load"}
          </p>
        </div>
      </div>

      {/* Stress meter */}
      <div className="mt-6">
        <div className="flex justify-between text-xs">
          <span className="text-muted">Server stress</span>
          <span className="font-semibold tabular-nums">
            {Math.round(m.stress)}%
          </span>
        </div>
        <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-border">
          <motion.div
            className={cn(
              "h-full rounded-full",
              m.crashed
                ? "bg-rose-500"
                : m.stress > 60
                ? "bg-amber-500"
                : "bg-emerald-500"
            )}
            animate={{ width: `${m.stress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <Stat
          icon={<Users className="h-3.5 w-3.5" />}
          label="Requests queued"
          value={formatUsers(m.queued)}
          tone={m.queued > 0 ? "warn" : "ok"}
        />
        <Stat
          icon={<Clock className="h-3.5 w-3.5" />}
          label="Response time"
          value={
            m.latencyMs < 1000
              ? `${m.latencyMs}ms`
              : `${(m.latencyMs / 1000).toFixed(1)}s`
          }
          tone={m.latencyMs > 1500 ? "bad" : m.latencyMs > 600 ? "warn" : "ok"}
        />
        <Stat
          icon={<XCircle className="h-3.5 w-3.5" />}
          label="Failed requests"
          value={`${m.failedPct}%`}
          tone={m.failedPct > 0 ? "bad" : "ok"}
        />
      </div>

      <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">PM insight: </span>
        One overloaded server can take down the entire product. The app didn't
        fail because of a bug — it failed because all traffic had nowhere else
        to go.
      </p>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "ok" | "warn" | "bad";
}) {
  return (
    <div className="rounded-xl border border-border bg-bg px-2 py-3">
      <p
        className={cn(
          "flex items-center justify-center gap-1 text-base font-bold tabular-nums",
          tone === "ok" && "text-emerald-500",
          tone === "warn" && "text-amber-500",
          tone === "bad" && "text-rose-500"
        )}
      >
        {icon}
        {value}
      </p>
      <p className="mt-0.5 text-[11px] text-muted">{label}</p>
    </div>
  );
}
