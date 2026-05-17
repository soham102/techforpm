"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Database, AlertTriangle, ShieldCheck } from "lucide-react";
import { formatUsers, pct } from "@/lib/caching";
import { cn } from "@/lib/utils";

const STEPS = [100, 1_000, 100_000, 1_000_000];

interface Metrics {
  dbLoad: number;
  latencyMs: number;
  dbRequests: number;
  failures: number;
}

/** Model how a tier of traffic behaves with and without a cache. */
function model(users: number, cached: boolean): Metrics {
  const tier = STEPS.indexOf(users); // 0..3
  if (cached) {
    // ~95% of identical requests served from cache → DB barely moves
    return {
      dbLoad: pct(8 + tier * 6),
      latencyMs: 90 + tier * 35,
      dbRequests: Math.round(users * 0.05),
      failures: 0,
    };
  }
  // every request hits the database → load and failures explode
  return {
    dbLoad: pct(25 + tier * 28),
    latencyMs: 400 + tier * 1600,
    dbRequests: users,
    failures: tier >= 2 ? Math.round(users * (tier === 3 ? 0.42 : 0.12)) : 0,
  };
}

/**
 * Section 6 — drag the traffic slider from 100 to 1,000,000 users and watch
 * an uncached app overload and start failing while the cached app stays
 * stable. This is the scalability + cost argument, made visual.
 */
export function TrafficSpikeSim() {
  const [idx, setIdx] = useState(1);
  const users = STEPS[idx];
  const without = model(users, false);
  const withC = model(users, true);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Users className="h-4 w-4 text-brand" />
        Concurrent users hitting the same page
        <span className="ml-auto rounded-full bg-brand-soft px-3 py-1 text-brand">
          {formatUsers(users)}
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={STEPS.length - 1}
        step={1}
        value={idx}
        onChange={(e) => setIdx(Number(e.target.value))}
        className="mt-4 w-full accent-[rgb(var(--brand))]"
        aria-label="Number of concurrent users"
      />
      <div className="mt-1 flex justify-between text-[11px] text-muted">
        {STEPS.map((s, i) => (
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

      <div className="mt-7 grid gap-4 lg:grid-cols-2">
        <Panel
          title="Without cache"
          tone="bad"
          icon={<AlertTriangle className="h-4 w-4" />}
          m={without}
          users={users}
          verdict={
            without.failures > 0
              ? "Database overloaded — requests timing out"
              : without.dbLoad > 60
              ? "Under heavy stress, slowing down"
              : "Coping, but every request hits the DB"
          }
        />
        <Panel
          title="With cache"
          tone="ok"
          icon={<ShieldCheck className="h-4 w-4" />}
          m={withC}
          users={users}
          verdict="Stable — most traffic served from cache"
        />
      </div>

      <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">PM insight: </span>
        Caching reduces infrastructure cost and improves scalability. The same
        servers survive a million users because the database only sees a tiny
        fraction of the traffic.
      </p>
    </div>
  );
}

function Panel({
  title,
  tone,
  icon,
  m,
  users,
  verdict,
}: {
  title: string;
  tone: "ok" | "bad";
  icon: React.ReactNode;
  m: Metrics;
  users: number;
  verdict: string;
}) {
  const isOk = tone === "ok";
  return (
    <div
      className={cn(
        "rounded-2xl border p-5",
        isOk
          ? "border-emerald-500/30 bg-emerald-500/5"
          : m.failures > 0
          ? "border-rose-500/40 bg-rose-500/5"
          : "border-amber-500/30 bg-amber-500/5"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 text-sm font-bold uppercase tracking-wide",
          isOk ? "text-emerald-500" : m.failures > 0 ? "text-rose-500" : "text-amber-500"
        )}
      >
        {icon}
        {title}
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs">
          <span className="text-muted">Database load</span>
          <span className="font-semibold tabular-nums">{Math.round(m.dbLoad)}%</span>
        </div>
        <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-border">
          <motion.div
            className={cn(
              "h-full rounded-full",
              isOk
                ? "bg-emerald-500"
                : m.dbLoad > 70
                ? "bg-rose-500"
                : "bg-amber-500"
            )}
            animate={{ width: `${m.dbLoad}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Mini
          label="Latency"
          value={
            m.latencyMs < 1000
              ? `${m.latencyMs}ms`
              : `${(m.latencyMs / 1000).toFixed(1)}s`
          }
          tone={m.latencyMs > 1500 ? "bad" : isOk ? "ok" : "warn"}
        />
        <Mini
          label="DB requests"
          value={formatUsers(m.dbRequests)}
          tone={isOk ? "ok" : "warn"}
          icon={<Database className="h-3 w-3" />}
        />
        <Mini
          label="Failed"
          value={m.failures === 0 ? "0" : formatUsers(m.failures)}
          tone={m.failures > 0 ? "bad" : "ok"}
        />
      </div>

      <p
        className={cn(
          "mt-4 rounded-lg px-3 py-2 text-xs font-medium",
          isOk
            ? "bg-emerald-500/10 text-emerald-500"
            : m.failures > 0
            ? "bg-rose-500/10 text-rose-500"
            : "bg-amber-500/10 text-amber-500"
        )}
      >
        {verdict}
        <span className="ml-1 font-normal text-muted">
          · {formatUsers(users)} users
        </span>
      </p>
    </div>
  );
}

function Mini({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: string;
  tone: "ok" | "warn" | "bad";
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-bg px-2 py-2">
      <p
        className={cn(
          "flex items-center justify-center gap-1 text-sm font-bold tabular-nums",
          tone === "ok" && "text-emerald-500",
          tone === "warn" && "text-amber-500",
          tone === "bad" && "text-rose-500"
        )}
      >
        {icon}
        {value}
      </p>
      <p className="text-[10px] text-muted">{label}</p>
    </div>
  );
}
