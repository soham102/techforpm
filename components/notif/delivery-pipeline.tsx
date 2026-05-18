"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { PIPELINE_STAGES } from "@/lib/notifications";
import { cn, sleep } from "@/lib/utils";

type State = "queued" | "sent" | "delivered" | "opened" | "failed";

interface Packet {
  id: number;
  pos: number; // index into PIPELINE_STAGES
  state: State;
  label: string;
}

const SAMPLES = [
  "Order #4821 → Out for delivery",
  "Order #4822 → Out for delivery",
  "Order #4823 → Out for delivery",
  "Order #4824 → Out for delivery",
];

const STATE_LEGEND: { id: State; label: string; cls: string }[] = [
  { id: "queued", label: "Queued", cls: "bg-brand/70" },
  { id: "sent", label: "Sent", cls: "bg-amber-500" },
  { id: "delivered", label: "Delivered", cls: "bg-emerald-500" },
  { id: "opened", label: "Opened", cls: "bg-emerald-600" },
  { id: "failed", label: "Failed", cls: "bg-rose-500" },
];

/**
 * Section 5 — the notification lifecycle. Watch packets travel the
 * pipeline; most reach the device, some fail, a few get opened.
 */
export function DeliveryPipeline() {
  const reduce = useReducedMotion();
  const [packets, setPackets] = useState<Packet[]>([]);
  const [running, setRunning] = useState(false);
  const idRef = useRef(0);

  async function runOne(label: string) {
    const id = ++idRef.current;
    const fresh: Packet = { id, pos: 0, state: "queued", label };
    setPackets((p) => [...p, fresh].slice(-5));

    await sleep(700);
    setPackets((p) =>
      p.map((x) => (x.id === id ? { ...x, pos: 1, state: "sent" } : x))
    );
    await sleep(700);

    // ~20% fail at the delivery hop.
    const failed = Math.random() < 0.2;
    if (failed) {
      setPackets((p) =>
        p.map((x) => (x.id === id ? { ...x, pos: 2, state: "failed" } : x))
      );
      return;
    }

    setPackets((p) =>
      p.map((x) => (x.id === id ? { ...x, pos: 3, state: "delivered" } : x))
    );
    await sleep(800);

    if (Math.random() < 0.5) {
      setPackets((p) =>
        p.map((x) => (x.id === id ? { ...x, pos: 4, state: "opened" } : x))
      );
    }
  }

  async function runBatch() {
    setRunning(true);
    setPackets([]);
    for (let i = 0; i < SAMPLES.length; i++) {
      runOne(SAMPLES[i]);
      await sleep(650);
    }
    await sleep(2600);
    setRunning(false);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={runBatch}
          disabled={running}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          <Play className="h-4 w-4" />
          Send a batch of notifications
        </button>
        <button
          onClick={() => setPackets([])}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-fg"
        >
          <RotateCcw className="h-4 w-4" />
          Clear
        </button>
      </div>

      {/* Pipeline track */}
      <div className="mt-8 grid grid-cols-5 gap-2">
        {PIPELINE_STAGES.map((stage, i) => {
          const Icon = getIcon(stage.icon);
          const here = packets.filter(
            (p) =>
              p.pos === i ||
              (i === 3 && (p.state === "delivered" || p.state === "opened")) // delivered + opened both sit at device
          );
          const hereCount = packets.filter((p) =>
            i === 4
              ? p.state === "opened"
              : i === 3
              ? p.state === "delivered"
              : i === 2
              ? p.state === "failed"
              : p.pos === i
          ).length;
          return (
            <div key={stage.id} className="flex flex-col items-center text-center">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-bg text-brand">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-2 text-[11px] font-semibold leading-tight">
                {stage.label}
              </p>
              <div className="relative mt-3 flex h-24 w-full items-start justify-center">
                <div className="absolute inset-x-0 top-0 h-px bg-border" />
                <div className="flex flex-col items-center gap-1.5 pt-2">
                  <AnimatePresence>
                    {packets
                      .filter((p) => {
                        if (i === 4) return p.state === "opened";
                        if (i === 3) return p.state === "delivered";
                        if (i === 2) return p.state === "failed";
                        if (i === 1) return p.pos === 1 || p.pos === 2;
                        return p.pos === 0;
                      })
                      .map((p) => (
                        <motion.span
                          key={p.id}
                          layout
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                          className={cn(
                            "h-2.5 w-2.5 rounded-full",
                            STATE_LEGEND.find((s) => s.id === p.state)?.cls
                          )}
                        />
                      ))}
                  </AnimatePresence>
                </div>
                {hereCount > 0 && (
                  <span className="absolute bottom-0 text-[10px] font-semibold text-muted">
                    {hereCount}
                  </span>
                )}
              </div>
              <p className="text-[10px] leading-tight text-muted">
                {stage.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-3">
        {STATE_LEGEND.map((s) => (
          <span
            key={s.id}
            className="inline-flex items-center gap-1.5 text-[11px] text-muted"
          >
            <span className={cn("h-2.5 w-2.5 rounded-full", s.cls)} />
            {s.label}
          </span>
        ))}
      </div>

      {/* Live log */}
      <div className="mt-5 rounded-xl border border-border bg-bg p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          Lifecycle log
        </p>
        <ul className="mt-3 space-y-1.5">
          <AnimatePresence initial={false}>
            {packets.length === 0 && (
              <p className="text-xs text-muted">
                Send a batch — most will be delivered, ~1 in 5 fails, about
                half get opened.
              </p>
            )}
            {[...packets].reverse().map((p) => (
              <motion.li
                key={p.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-[12px]"
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    STATE_LEGEND.find((s) => s.id === p.state)?.cls
                  )}
                />
                <span className="text-muted">{p.label}</span>
                <span className="ml-auto font-semibold capitalize">
                  {p.state}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">Read it like a PM: </span>
        “Sent” is not “delivered”, and “delivered” is not “opened”. The drop at
        each step is exactly where you look when a campaign underperforms.
      </p>
    </div>
  );
}
