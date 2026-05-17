"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Users,
  Plus,
  Minus,
  Scale,
  Server,
  ServerCrash,
  Power,
  Flame,
  Rocket,
  RotateCcw,
  Cpu,
  Clock,
  Activity,
} from "lucide-react";
import {
  TRAFFIC_STEPS,
  STRATEGIES,
  makeFleet,
  distribute,
  formatUsers,
  type Strategy,
  type ServerState,
} from "@/lib/load-balancing";
import { cn } from "@/lib/utils";

/**
 * Section 4 — the core playground. Change traffic, add/remove servers,
 * disable a server, fire a flash-sale or IPL spike, and switch strategy.
 * Watch CPU, active requests, response time and failures react live.
 */
export function TrafficPlayground() {
  const reduce = useReducedMotion();
  const [trafficIdx, setTrafficIdx] = useState(1);
  const [strategy, setStrategy] = useState<Strategy>("round-robin");
  const [count, setCount] = useState(3);
  const [downIds, setDownIds] = useState<Set<string>>(new Set());
  const [pulseKey, setPulseKey] = useState(0);

  const baseTraffic = TRAFFIC_STEPS[trafficIdx];

  // Build the live fleet from current controls.
  const fleet: ServerState[] = useMemo(() => {
    const f = makeFleet(count).map((s) =>
      downIds.has(s.id) ? { ...s, status: "down" as const } : s
    );
    return f;
  }, [count, downIds]);

  const { fleet: computed, failedPct, avgResponseMs } = useMemo(
    () => distribute(baseTraffic, fleet, strategy),
    [baseTraffic, fleet, strategy]
  );

  const liveCount = computed.filter((s) => s.status !== "down").length;

  function spike(kind: "flash" | "ipl") {
    setTrafficIdx(kind === "ipl" ? 3 : 2);
    setPulseKey((k) => k + 1);
  }

  function reset() {
    setTrafficIdx(1);
    setStrategy("round-robin");
    setCount(3);
    setDownIds(new Set());
    setPulseKey((k) => k + 1);
  }

  function toggleDown(id: string) {
    setDownIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      {/* Strategy selector */}
      <div className="flex flex-wrap gap-2">
        {STRATEGIES.map((s) => (
          <button
            key={s.id}
            onClick={() => setStrategy(s.id)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              strategy === s.id
                ? "bg-brand text-white shadow-soft"
                : "border border-border text-muted hover:text-fg"
            )}
          >
            {s.name}
          </button>
        ))}
        <button
          onClick={reset}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-fg"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {/* Traffic slider */}
      <div className="mt-5">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Users className="h-4 w-4 text-brand" />
          Concurrent traffic
          <span className="ml-auto rounded-full bg-brand-soft px-3 py-1 text-brand">
            {formatUsers(baseTraffic)}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={TRAFFIC_STEPS.length - 1}
          step={1}
          value={trafficIdx}
          onChange={(e) => {
            setTrafficIdx(Number(e.target.value));
            setPulseKey((k) => k + 1);
          }}
          className="mt-3 w-full accent-[rgb(var(--brand))]"
          aria-label="Concurrent traffic"
        />
        <div className="mt-1 flex justify-between text-[11px] text-muted">
          {TRAFFIC_STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => {
                setTrafficIdx(i);
                setPulseKey((k) => k + 1);
              }}
              className={cn(
                "tabular-nums transition-colors",
                i === trafficIdx ? "font-bold text-brand" : "hover:text-fg"
              )}
            >
              {formatUsers(s)}
            </button>
          ))}
        </div>
      </div>

      {/* Controls row */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-full border border-border p-1">
          <button
            onClick={() => setCount((c) => Math.max(1, c - 1))}
            disabled={count <= 1}
            className="grid h-7 w-7 place-items-center rounded-full text-muted transition-colors hover:bg-bg hover:text-fg disabled:opacity-30"
            aria-label="Remove a server"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-[5.5rem] text-center text-xs font-medium tabular-nums">
            {count} server{count > 1 ? "s" : ""}
          </span>
          <button
            onClick={() => setCount((c) => Math.min(6, c + 1))}
            disabled={count >= 6}
            className="grid h-7 w-7 place-items-center rounded-full text-muted transition-colors hover:bg-bg hover:text-fg disabled:opacity-30"
            aria-label="Add a server"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          onClick={() => spike("flash")}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-xs font-medium transition-colors hover:border-brand/40"
        >
          <Rocket className="h-3.5 w-3.5 text-brand" />
          Blinkit flash sale
        </button>
        <button
          onClick={() => spike("ipl")}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-xs font-medium transition-colors hover:border-brand/40"
        >
          <Flame className="h-3.5 w-3.5 text-rose-500" />
          IPL traffic spike
        </button>
      </div>

      {/* Balancer node */}
      <div className="mt-7 flex items-center justify-center gap-3">
        <motion.span
          key={pulseKey}
          initial={reduce ? false : { scale: 0.9 }}
          animate={reduce ? {} : { scale: [0.9, 1.06, 1] }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand-soft px-4 py-2 text-sm font-semibold text-brand shadow-glow"
        >
          <Scale className="h-4 w-4" />
          Load balancer
          <span className="text-xs font-normal text-muted">
            · {STRATEGIES.find((s) => s.id === strategy)?.name}
          </span>
        </motion.span>
      </div>

      {/* Server cards */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {computed.map((srv) => (
            <ServerCard
              key={srv.id}
              s={srv}
              pulseKey={pulseKey}
              onToggle={() => toggleDown(srv.id)}
              reduce={!!reduce}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Summary bar */}
      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        <Summary
          icon={<Server className="h-3.5 w-3.5" />}
          label="Servers online"
          value={`${liveCount}/${computed.length}`}
          tone={liveCount === 0 ? "bad" : liveCount < computed.length ? "warn" : "ok"}
        />
        <Summary
          icon={<Clock className="h-3.5 w-3.5" />}
          label="Avg response"
          value={
            liveCount === 0
              ? "—"
              : avgResponseMs < 1000
              ? `${avgResponseMs}ms`
              : `${(avgResponseMs / 1000).toFixed(1)}s`
          }
          tone={avgResponseMs > 1500 ? "bad" : avgResponseMs > 600 ? "warn" : "ok"}
        />
        <Summary
          icon={<Activity className="h-3.5 w-3.5" />}
          label="Failed requests"
          value={`${liveCount === 0 ? 100 : failedPct}%`}
          tone={
            (liveCount === 0 ? 100 : failedPct) > 5
              ? "bad"
              : failedPct > 0
              ? "warn"
              : "ok"
          }
        />
      </div>

      <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">Try this: </span>
        Fire the IPL spike with 1 server, then add servers one by one and watch
        the CPU bars drop. Disable a server mid-spike — traffic instantly
        reroutes to the rest.
      </p>
    </div>
  );
}

function ServerCard({
  s,
  pulseKey,
  onToggle,
  reduce,
}: {
  s: ServerState;
  pulseKey: number;
  onToggle: () => void;
  reduce: boolean;
}) {
  const down = s.status === "down";
  const stressed = s.status === "stressed";
  const tone = down
    ? "rose"
    : stressed
    ? "amber"
    : "emerald";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border p-4",
        down && "border-rose-500/40 bg-rose-500/5",
        stressed && "border-amber-500/40 bg-amber-500/5",
        !down && !stressed && "border-emerald-500/30 bg-emerald-500/5"
      )}
    >
      {/* incoming request pulses */}
      {!down && !reduce && (
        <motion.span
          key={pulseKey}
          className={cn(
            "absolute left-3 top-3 h-1.5 w-1.5 rounded-full",
            stressed ? "bg-amber-500" : "bg-emerald-500"
          )}
          animate={{ x: [-14, 6, -14], opacity: [0, 1, 0] }}
          transition={{ duration: 1.1, repeat: Infinity }}
        />
      )}

      <div className="flex items-center gap-2">
        <span
          className={cn(
            "grid h-8 w-8 place-items-center rounded-lg",
            down
              ? "bg-rose-500/15 text-rose-500"
              : stressed
              ? "bg-amber-500/15 text-amber-500"
              : "bg-emerald-500/15 text-emerald-500"
          )}
        >
          {down ? (
            <ServerCrash className="h-4 w-4" />
          ) : (
            <Server className="h-4 w-4" />
          )}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold">{s.name}</p>
          <p className="text-[11px] text-muted">{s.region}</p>
        </div>
        <button
          onClick={onToggle}
          aria-label={down ? "Bring server back" : "Disable server"}
          className={cn(
            "ml-auto grid h-7 w-7 place-items-center rounded-full border transition-colors",
            down
              ? "border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10"
              : "border-border text-muted hover:border-rose-500/40 hover:text-rose-500"
          )}
        >
          <Power className="h-3.5 w-3.5" />
        </button>
      </div>

      <p
        className={cn(
          "mt-3 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
          down && "bg-rose-500/15 text-rose-500",
          stressed && "bg-amber-500/15 text-amber-500",
          !down && !stressed && "bg-emerald-500/15 text-emerald-500"
        )}
      >
        {down ? "Down" : stressed ? "Stressed" : "Healthy"}
      </p>

      <div className="mt-3">
        <div className="flex justify-between text-[11px] text-muted">
          <span className="flex items-center gap-1">
            <Cpu className="h-3 w-3" /> CPU
          </span>
          <span className="font-semibold tabular-nums text-fg">
            {down ? 0 : s.cpu}%
          </span>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-border">
          <motion.div
            className={cn(
              "h-full rounded-full",
              tone === "rose" && "bg-rose-500",
              tone === "amber" && "bg-amber-500",
              tone === "emerald" && "bg-emerald-500"
            )}
            animate={{ width: `${down ? 0 : s.cpu}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-lg border border-border bg-bg px-2 py-1.5">
          <p className="text-xs font-bold tabular-nums">
            {down ? "—" : formatUsers(s.activeRequests)}
          </p>
          <p className="text-[10px] text-muted">Active req.</p>
        </div>
        <div className="rounded-lg border border-border bg-bg px-2 py-1.5">
          <p className="text-xs font-bold tabular-nums">
            {down
              ? "—"
              : s.responseMs < 1000
              ? `${s.responseMs}ms`
              : `${(s.responseMs / 1000).toFixed(1)}s`}
          </p>
          <p className="text-[10px] text-muted">Response</p>
        </div>
      </div>
    </motion.div>
  );
}

function Summary({
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
