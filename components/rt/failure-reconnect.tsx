"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  WifiOff,
  Wifi,
  Flame,
  Clock,
  Play,
  RotateCcw,
  Check,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Scenario = "network" | "traffic" | "delivery";

const TABS: { id: Scenario; label: string }[] = [
  { id: "network", label: "Network loss" },
  { id: "traffic", label: "High traffic" },
  { id: "delivery", label: "Delivery failure" },
];

const INSIGHT: Record<Scenario, string> = {
  network:
    "Real-time systems require reconnection handling — the connection will drop, and the product has to recover gracefully and catch up on what was missed.",
  traffic:
    "Real-time systems become harder at scale — millions of open connections mean message delays and serious scaling work behind the scenes.",
  delivery:
    "Reliability matters in real-time communication — a message must be retried and confirmed, not silently lost.",
};

export function FailureReconnect() {
  const [tab, setTab] = useState<Scenario>("network");
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full px-3.5 py-2 text-xs font-medium transition-colors",
              tab === t.id
                ? "bg-brand text-white shadow-soft"
                : "border border-border text-muted hover:text-fg"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-bg p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {tab === "network" && <NetworkLoss />}
            {tab === "traffic" && <HighTraffic />}
            {tab === "delivery" && <DeliveryFailure />}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">PM insight: </span>
        {INSIGHT[tab]}
      </p>
    </div>
  );
}

/* ---------- Network loss ---------- */

type NetState = "connected" | "lost" | "reconnecting" | "restored";

function NetworkLoss() {
  const [state, setState] = useState<NetState>("connected");
  const [attempts, setAttempts] = useState(0);
  const [missed, setMissed] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearAll() {
    // setTimeout / setInterval share an id space — clearing both is safe.
    timers.current.forEach((t) => {
      clearTimeout(t);
      clearInterval(t);
    });
    timers.current = [];
  }

  function drop() {
    clearAll();
    setState("lost");
    setAttempts(0);
    setMissed(0);
    // updates pile up while offline
    const missInt = setInterval(() => setMissed((m) => m + 1), 600);
    timers.current.push(missInt);
    timers.current.push(
      setTimeout(() => {
        clearInterval(missInt);
        setState("reconnecting");
        let a = 0;
        const reInt = setInterval(() => {
          a += 1;
          setAttempts(a);
          if (a >= 3) {
            clearInterval(reInt);
            setState("restored");
          }
        }, 700);
        timers.current.push(reInt);
      }, 1800)
    );
  }

  function reset() {
    clearAll();
    setState("connected");
    setAttempts(0);
    setMissed(0);
  }

  useEffect(() => clearAll, []);

  const dotColor =
    state === "connected" || state === "restored"
      ? "bg-emerald-500"
      : state === "reconnecting"
      ? "bg-amber-500"
      : "bg-rose-500";

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="relative flex h-2.5 w-2.5">
            {(state === "connected" ||
              state === "restored" ||
              state === "reconnecting") && (
              <span
                className={cn(
                  "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
                  dotColor
                )}
              />
            )}
            <span
              className={cn(
                "relative inline-flex h-2.5 w-2.5 rounded-full",
                dotColor
              )}
            />
          </span>
          {state === "connected" && "Connected"}
          {state === "lost" && "Connection lost"}
          {state === "reconnecting" && `Reconnecting… (attempt ${attempts})`}
          {state === "restored" && "Reconnected — caught up"}
        </div>
        <div className="flex gap-2">
          <button
            onClick={drop}
            disabled={state !== "connected" && state !== "restored"}
            className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 px-4 py-2 text-xs font-semibold text-rose-500 transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            <WifiOff className="h-3.5 w-3.5" />
            Lose connection
          </button>
          <button
            onClick={reset}
            className="rounded-full border border-border px-3 py-2 text-xs font-medium text-muted hover:text-fg"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-2">
        {(
          [
            { k: "connected", label: "Live", icon: <Wifi className="h-4 w-4" /> },
            { k: "lost", label: "Dropped", icon: <WifiOff className="h-4 w-4" /> },
            {
              k: "reconnecting",
              label: "Retrying",
              icon: <RotateCcw className="h-4 w-4" />,
            },
            {
              k: "restored",
              label: "Recovered",
              icon: <Check className="h-4 w-4" />,
            },
          ] as const
        ).map((s, i) => {
          const order = ["connected", "lost", "reconnecting", "restored"];
          const active = order.indexOf(state) >= i;
          return (
            <div
              key={s.k}
              className={cn(
                "rounded-xl border p-3 text-center transition-colors",
                active
                  ? "border-brand/40 bg-brand-soft text-brand"
                  : "border-border bg-surface text-muted"
              )}
            >
              <span className="mx-auto grid h-8 w-8 place-items-center">
                {s.icon}
              </span>
              <p className="mt-1 text-[11px] font-medium">{s.label}</p>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {missed > 0 && state !== "restored" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-center gap-2 rounded-lg bg-rose-500/10 px-3 py-2 text-[12px] font-medium text-rose-500"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            {missed} update{missed > 1 ? "s" : ""} missed while offline —
            queued for when the line is back.
          </motion.p>
        )}
        {state === "restored" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-[12px] font-medium text-emerald-500"
          >
            <Check className="h-3.5 w-3.5" />
            Reconnected after {attempts} attempts — missed updates delivered,
            user is back in sync.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- High traffic ---------- */

function HighTraffic() {
  const [viewers, setViewers] = useState(50_000);
  const load = Math.min(100, Math.round((viewers / 5_000_000) * 100));
  const delayMs = Math.round(60 + (load / 100) * 1900);
  const stressed = load > 75;

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 font-semibold">
          <Flame className="h-4 w-4 text-rose-500" />
          Live cricket final — concurrent viewers
        </span>
        <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand tabular-nums">
          {viewers >= 1_000_000
            ? `${(viewers / 1_000_000).toFixed(1)}M`
            : `${(viewers / 1000).toFixed(0)}K`}
        </span>
      </div>

      <input
        type="range"
        min={50_000}
        max={5_000_000}
        step={50_000}
        value={viewers}
        onChange={(e) => setViewers(Number(e.target.value))}
        className="mt-4 w-full accent-[rgb(var(--brand))]"
        aria-label="Concurrent viewers"
      />

      <div className="mt-5">
        <div className="flex justify-between text-xs">
          <span className="text-muted">Real-time server load</span>
          <span className="font-semibold tabular-nums">{load}%</span>
        </div>
        <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-border">
          <motion.div
            className={cn(
              "h-full rounded-full",
              load > 75
                ? "bg-rose-500"
                : load > 50
                ? "bg-amber-500"
                : "bg-emerald-500"
            )}
            animate={{ width: `${load}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-center">
        <div className="rounded-xl border border-border bg-surface px-3 py-3">
          <p
            className={cn(
              "flex items-center justify-center gap-1 text-base font-bold tabular-nums",
              delayMs > 1200
                ? "text-rose-500"
                : delayMs > 500
                ? "text-amber-500"
                : "text-emerald-500"
            )}
          >
            <Clock className="h-3.5 w-3.5" />
            {delayMs < 1000 ? `${delayMs}ms` : `${(delayMs / 1000).toFixed(1)}s`}
          </p>
          <p className="mt-0.5 text-[11px] text-muted">Update delay</p>
        </div>
        <div className="rounded-xl border border-border bg-surface px-3 py-3">
          <p
            className={cn(
              "text-base font-bold",
              stressed ? "text-rose-500" : "text-emerald-500"
            )}
          >
            {stressed ? "Scaling needed" : "Healthy"}
          </p>
          <p className="mt-0.5 text-[11px] text-muted">System state</p>
        </div>
      </div>

      <p className="mt-4 text-[12px] text-muted">
        Every viewer holds an open connection. Push it toward 5M and updates
        start lagging — keeping millions in sync is the hard part of real-time.
      </p>
    </div>
  );
}

/* ---------- Delivery failure ---------- */

type MsgState = "idle" | "pending" | "retry" | "delivered";

function DeliveryFailure() {
  const [state, setState] = useState<MsgState>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function send() {
    timers.current.forEach(clearTimeout);
    setState("pending");
    timers.current = [
      setTimeout(() => setState("retry"), 1300),
      setTimeout(() => setState("delivered"), 2600),
    ];
  }
  function reset() {
    timers.current.forEach(clearTimeout);
    setState("idle");
  }
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const steps: { k: MsgState; label: string }[] = [
    { k: "pending", label: "Sending…" },
    { k: "retry", label: "No ack — retrying" },
    { k: "delivered", label: "Delivered & confirmed" },
  ];
  const order = ["idle", "pending", "retry", "delivered"];

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Chat message reliability</p>
        <div className="flex gap-2">
          <button
            onClick={send}
            disabled={state !== "idle" && state !== "delivered"}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5" />
            Send message
          </button>
          <button
            onClick={reset}
            className="rounded-full border border-border px-3 py-2 text-xs font-medium text-muted hover:text-fg"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <motion.div
          animate={
            state === "retry" ? { x: [-2, 2, -2, 0] } : {}
          }
          transition={{ duration: 0.3, repeat: state === "retry" ? Infinity : 0 }}
          className={cn(
            "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
            state === "delivered"
              ? "bg-brand text-white"
              : state === "idle"
              ? "border border-border bg-surface text-muted"
              : "bg-brand/60 text-white"
          )}
        >
          “See you at the game!”
        </motion.div>
      </div>

      <div className="mt-6 space-y-2">
        {steps.map((s) => {
          const active = order.indexOf(state) >= order.indexOf(s.k);
          const isNow = state === s.k;
          return (
            <div
              key={s.k}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                active
                  ? s.k === "delivered"
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                    : s.k === "retry"
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-500"
                    : "border-brand/40 bg-brand-soft text-brand"
                  : "border-border bg-surface text-muted opacity-50"
              )}
            >
              <span className="grid h-6 w-6 place-items-center">
                {s.k === "delivered" ? (
                  <Check className="h-4 w-4" />
                ) : s.k === "retry" ? (
                  <RotateCcw className="h-4 w-4" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}
              </span>
              {s.label}
              {isNow && s.k !== "delivered" && (
                <motion.span
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-current"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
