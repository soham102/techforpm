"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Zap, Users, Timer, TriangleAlert, Split } from "lucide-react";
import { cn, sleep } from "@/lib/utils";

/* ============ Section 4 — SCALING SIMULATION ============ */

export function ScalingSimulation() {
  const [scaling, setScaling] = useState(true);
  const [users, setUsers] = useState(20);
  const [running, setRunning] = useState(false);
  const ramp = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => () => clearInterval(ramp.current), []);

  function spike() {
    if (running) return;
    setRunning(true);
    setUsers(20);
    let u = 20;
    ramp.current = setInterval(() => {
      u += 70;
      setUsers(u);
      if (u >= 900) {
        clearInterval(ramp.current);
        setRunning(false);
      }
    }, 220);
  }

  function reset() {
    clearInterval(ramp.current);
    setRunning(false);
    setUsers(20);
  }

  // Derived metrics differ sharply by mode.
  const servers = scaling ? Math.max(1, Math.ceil(users / 180)) : 1;
  const loadPerServer = Math.min(100, Math.round((users / servers) * 0.11));
  const overloaded = loadPerServer > 85;
  const responseMs = scaling
    ? 120 + loadPerServer * 2
    : 120 + Math.max(0, users - 120) * 4;
  const failed = scaling
    ? overloaded
      ? Math.round(users * 0.02)
      : 0
    : Math.max(0, Math.round((users - 160) * 0.4));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-xl border border-border p-1">
          {[
            { v: false, label: "Without scaling" },
            { v: true, label: "With scaling" },
          ].map((o) => (
            <button
              key={o.label}
              onClick={() => setScaling(o.v)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                scaling === o.v
                  ? "bg-brand text-white"
                  : "text-muted hover:text-fg"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
        <button
          onClick={spike}
          disabled={running}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
        >
          <Zap className="h-4 w-4" />
          Trigger IPL-final spike
        </button>
        <button
          onClick={reset}
          className="rounded-xl border border-border px-3 py-2 text-sm font-medium transition-colors hover:border-brand/40"
        >
          Reset
        </button>
      </div>

      {/* metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric icon={<Users className="h-4 w-4" />} label="Live users" value={users.toLocaleString()} />
        <Metric
          icon={<Server className="h-4 w-4" />}
          label="Servers"
          value={String(servers)}
          tone={scaling ? "ok" : "warn"}
        />
        <Metric
          icon={<Timer className="h-4 w-4" />}
          label="Avg response"
          value={`${Math.round(responseMs)}ms`}
          tone={responseMs > 600 ? "bad" : responseMs > 350 ? "warn" : "ok"}
        />
        <Metric
          icon={<TriangleAlert className="h-4 w-4" />}
          label="Failed requests"
          value={String(failed)}
          tone={failed > 0 ? "bad" : "ok"}
        />
      </div>

      {/* server farm */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <div className="flex flex-wrap items-end justify-center gap-3">
          <AnimatePresence>
            {Array.from({ length: servers }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className={cn(
                  "flex w-20 flex-col items-center gap-2 rounded-xl border p-3",
                  overloaded
                    ? "border-rose-500/40 bg-rose-500/10"
                    : "border-emerald-500/30 bg-emerald-500/5"
                )}
              >
                <Server
                  className={cn(
                    "h-5 w-5",
                    overloaded ? "text-rose-500" : "text-emerald-500"
                  )}
                />
                <div className="h-14 w-2 overflow-hidden rounded-full bg-border">
                  <motion.div
                    className={cn(
                      "w-full rounded-full",
                      overloaded ? "bg-rose-500" : "bg-emerald-500"
                    )}
                    animate={{ height: `${loadPerServer}%` }}
                    style={{ marginTop: "auto" }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <span className="text-[10px] text-muted">
                  {loadPerServer}%
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <p
          className={cn(
            "mt-5 rounded-xl px-4 py-3 text-sm",
            scaling
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
          )}
        >
          {scaling
            ? "Extra servers spawn as traffic grows, load is shared, and response times stay stable."
            : "One server takes everything — it overloads, requests fail, and the app slows to a crawl."}
        </p>
      </div>

      <p className="rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">PM insight: </span>
        scaling systems properly prevents outages during growth — a marketing
        win shouldn't become an outage.
      </p>
    </div>
  );
}

function Metric({
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
    <div className="rounded-xl border border-border bg-surface p-4 shadow-soft">
      <p className="flex items-center gap-1.5 text-[11px] text-muted">
        <span className="text-brand">{icon}</span>
        {label}
      </p>
      <p className={cn("mt-1 text-lg font-bold tabular-nums", tones[tone])}>
        {value}
      </p>
    </div>
  );
}

/* ============ Section 5 — LOAD BALANCER ============ */

const LB_SERVERS = ["Server A", "Server B", "Server C"];

export function LoadBalancer() {
  const [tick, setTick] = useState(0);
  const [on, setOn] = useState(false);
  const loop = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => () => clearInterval(loop.current), []);

  function toggle() {
    if (on) {
      clearInterval(loop.current);
      setOn(false);
      return;
    }
    setOn(true);
    loop.current = setInterval(() => setTick((t) => t + 1), 700);
  }

  const targetServer = tick % LB_SERVERS.length;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-md text-sm leading-relaxed text-muted">
          A load balancer is like a traffic officer waving cars onto whichever
          road is clearest — incoming requests get spread evenly across
          servers.
        </p>
        <button
          onClick={toggle}
          className="shrink-0 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
        >
          {on ? "Stop traffic" : "Start traffic"}
        </button>
      </div>

      <div className="mt-8 grid items-center gap-4 sm:grid-cols-[auto_1fr_auto]">
        <Box icon={<Users className="h-5 w-5" />} label="Requests" />

        <div className="relative flex flex-col items-center">
          <span className="rounded-xl border-2 border-brand/40 bg-brand-soft px-4 py-2 text-sm font-semibold text-brand">
            <Split className="mr-1.5 inline h-4 w-4" />
            Load Balancer
          </span>
          <AnimatePresence>
            {on && (
              <motion.span
                key={tick}
                initial={{ x: -90, opacity: 0 }}
                animate={{ x: 90, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-brand shadow-glow"
              />
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-2">
          {LB_SERVERS.map((s, i) => {
            const hot = on && targetServer === i;
            return (
              <motion.div
                key={s}
                animate={{
                  borderColor: hot
                    ? "rgb(16 185 129 / 0.5)"
                    : "rgb(var(--border))",
                  backgroundColor: hot
                    ? "rgba(16,185,129,0.10)"
                    : "rgba(0,0,0,0)",
                }}
                className="flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium"
              >
                <Server
                  className={cn(
                    "h-4 w-4",
                    hot ? "text-emerald-500" : "text-muted"
                  )}
                />
                {s}
              </motion.div>
            );
          })}
        </div>
      </div>

      <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">PM insight: </span>
        load balancing improves reliability and uptime — if one server dies,
        traffic simply flows to the others and users never notice.
      </p>
    </div>
  );
}

function Box({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-bg px-4 py-3">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
        {icon}
      </span>
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}
