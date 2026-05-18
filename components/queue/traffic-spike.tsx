"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Zap, ServerCrash, ShieldCheck, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Side {
  incoming: number;
  handled: number;
  dropped: number;
  buffer: number;
  workers: number;
  load: number; // 0-130 % server load
}

const fresh = (): { noQueue: Side; queue: Side } => ({
  noQueue: { incoming: 0, handled: 0, dropped: 0, buffer: 0, workers: 2, load: 0 },
  queue: { incoming: 0, handled: 0, dropped: 0, buffer: 0, workers: 2, load: 0 },
});

const SERVER_CAPACITY = 14; // requests a bare server can take per tick
const TICKS = 42;

/**
 * Section 7 — an IPL-final flash sale hits both systems at once.
 * Without a queue the server overloads and drops requests; with a
 * queue, traffic is buffered and workers scale to drain it.
 */
export function TrafficSpike() {
  const [state, setState] = useState(fresh());
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => () => clearInterval(timer.current), []);

  function launch() {
    clearInterval(timer.current);
    setState(fresh());
    setTick(0);
    setRunning(true);

    let t = 0;
    timer.current = setInterval(() => {
      t += 1;
      // Spike: rises fast, peaks mid-way, tapers off.
      const phase = t / TICKS;
      const arrivals = Math.round(
        6 + 34 * Math.sin(Math.min(phase, 1) * Math.PI)
      );

      setState((prev) => {
        // --- No queue: anything over capacity is dropped ---
        const nq = { ...prev.noQueue };
        nq.incoming += arrivals;
        const nqHandled = Math.min(arrivals, SERVER_CAPACITY);
        nq.handled += nqHandled;
        nq.dropped += Math.max(0, arrivals - SERVER_CAPACITY);
        nq.load = Math.round((arrivals / SERVER_CAPACITY) * 100);

        // --- With queue: buffer absorbs the burst, workers autoscale ---
        const q = { ...prev.queue };
        q.incoming += arrivals;
        q.buffer += arrivals;
        if (q.buffer > 60 && q.workers < 8) q.workers += 1;
        else if (q.buffer < 15 && q.workers > 2) q.workers -= 1;
        const qCapacity = q.workers * 9;
        const qHandled = Math.min(q.buffer, qCapacity);
        q.buffer -= qHandled;
        q.handled += qHandled;
        q.load = Math.round((qHandled / Math.max(1, qCapacity)) * 100);

        return { noQueue: nq, queue: q };
      });

      setTick(t);
      if (t >= TICKS) {
        clearInterval(timer.current);
        setRunning(false);
      }
    }, 130);
  }

  function reset() {
    clearInterval(timer.current);
    setRunning(false);
    setState(fresh());
    setTick(0);
  }

  const progress = Math.round((tick / TICKS) * 100);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">🏏 IPL final · flash sale</p>
          <p className="text-[11px] text-muted">
            Millions place orders in the same minute
          </p>
        </div>
        <button
          onClick={running ? reset : launch}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
        >
          {running ? (
            <>
              <RotateCcw className="h-3.5 w-3.5" /> Running…
            </>
          ) : tick > 0 ? (
            <>
              <RotateCcw className="h-3.5 w-3.5" /> Run again
            </>
          ) : (
            <>
              <Zap className="h-3.5 w-3.5" /> Launch flash sale
            </>
          )}
        </button>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-border">
        <motion.div
          className="h-full rounded-full bg-brand"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.12 }}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Without queues */}
        <div className="rounded-2xl border border-rose-500/30 bg-bg p-5">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-rose-500/15 text-rose-500">
              <ServerCrash className="h-4 w-4" />
            </span>
            <p className="text-sm font-semibold">Without queues</p>
          </div>

          <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-muted">
            Server load
          </p>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-border">
            <motion.div
              className={cn(
                "h-full rounded-full",
                state.noQueue.load > 100 ? "bg-rose-500" : "bg-amber-500"
              )}
              animate={{
                width: `${Math.min(100, state.noQueue.load)}%`,
              }}
              transition={{ duration: 0.12 }}
            />
          </div>
          {state.noQueue.load > 100 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="mt-2 text-[11px] font-semibold text-rose-500"
            >
              ⚠ Overloaded — {state.noQueue.load}% capacity
            </motion.p>
          )}

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat label="Incoming" value={state.noQueue.incoming} />
            <Stat label="Handled" value={state.noQueue.handled} tone="ok" />
            <Stat
              label="Dropped"
              value={state.noQueue.dropped}
              tone="bad"
            />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Past capacity, extra requests are simply rejected. Users see
            failed orders and spinning errors.
          </p>
        </div>

        {/* With queues */}
        <div className="rounded-2xl border border-emerald-500/30 bg-bg p-5">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/15 text-emerald-500">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <p className="text-sm font-semibold">With queues</p>
          </div>

          <p className="mt-4 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-muted">
            <span>Queue buffer</span>
            <span className="text-brand">
              {state.queue.workers} workers
            </span>
          </p>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-border">
            <motion.div
              className="h-full rounded-full bg-brand"
              animate={{
                width: `${Math.min(100, (state.queue.buffer / 120) * 100)}%`,
              }}
              transition={{ duration: 0.12 }}
            />
          </div>
          <p className="mt-2 text-[11px] font-semibold text-emerald-500">
            {state.queue.buffer} buffered · workers scaling to drain it
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat label="Incoming" value={state.queue.incoming} />
            <Stat label="Handled" value={state.queue.handled} tone="ok" />
            <Stat label="Dropped" value={state.queue.dropped} tone="ok" />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Nothing is dropped. The burst sits safely in the queue while
            workers scale up and drain it steadily.
          </p>
        </div>
      </div>

      <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="inline-flex items-center gap-1.5 font-semibold text-brand">
          <Zap className="h-4 w-4" /> PM insight:
        </span>{" "}
        Queues let an app survive massive traffic spikes. The buffer turns a
        crash into a short, recoverable delay — uptime is protected.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number;
  tone?: "neutral" | "ok" | "bad";
}) {
  const tones = {
    neutral: "text-fg",
    ok: "text-emerald-500",
    bad: "text-rose-500",
  };
  return (
    <div className="rounded-lg border border-border bg-surface px-2 py-2 text-center">
      <motion.p
        key={value}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        className={cn("text-sm font-bold tabular-nums", tones[tone])}
      >
        {value}
      </motion.p>
      <p className="text-[10px] text-muted">{label}</p>
    </div>
  );
}
