"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  MapPin,
  XCircle,
  RefreshCw,
  Loader2,
  Check,
  Activity,
} from "lucide-react";
import { JOURNEYS } from "@/lib/system-design";
import { getIcon } from "@/lib/icons";
import { cn, sleep } from "@/lib/utils";

type JourneyKey = keyof typeof JOURNEYS;

const CONTROLS: { key: JourneyKey; label: string; icon: typeof MapPin }[] = [
  { key: "order", label: "Place Order", icon: ShoppingBag },
  { key: "track", label: "Track Delivery", icon: MapPin },
  { key: "cancel", label: "Cancel Order", icon: XCircle },
  { key: "retry", label: "Retry Failed Request", icon: RefreshCw },
];

interface LogItem {
  t: string;
  msg: string;
}

export function RequestJourney() {
  const [journeyKey, setJourneyKey] = useState<JourneyKey>("order");
  const [stepIdx, setStepIdx] = useState(-1);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [log, setLog] = useState<LogItem[]>([]);
  const elapsedTimer = useRef<ReturnType<typeof setInterval>>();

  const journey = JOURNEYS[journeyKey];

  async function run(key: JourneyKey) {
    if (running) return;
    setJourneyKey(key);
    setRunning(true);
    setStepIdx(-1);
    setElapsed(0);
    setLog([]);
    const start = Date.now();
    elapsedTimer.current = setInterval(
      () => setElapsed(Date.now() - start),
      50
    );

    const steps = JOURNEYS[key].steps;
    for (let i = 0; i < steps.length; i++) {
      setStepIdx(i);
      setLog((l) =>
        [
          {
            t: `${(((i + 1) * 0.18) % 10).toFixed(2)}s`,
            msg: steps[i].label,
          },
          ...l,
        ].slice(0, 6)
      );
      await sleep(720);
    }

    clearInterval(elapsedTimer.current);
    setRunning(false);
  }

  return (
    <div className="space-y-5">
      {/* controls */}
      <div className="flex flex-wrap gap-2">
        {CONTROLS.map((c) => {
          const on = journeyKey === c.key;
          return (
            <button
              key={c.key}
              onClick={() => run(c.key)}
              disabled={running}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0",
                on
                  ? "border-brand/50 bg-brand-soft text-brand"
                  : "border-border bg-surface hover:border-brand/40"
              )}
            >
              <c.icon className="h-4 w-4" />
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
        {/* timeline */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">{journey.title} — journey</p>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1",
                running
                  ? "bg-brand-soft text-brand ring-brand/30"
                  : stepIdx >= 0
                  ? "bg-emerald-500/10 text-emerald-500 ring-emerald-500/30"
                  : "bg-bg text-muted ring-border"
              )}
            >
              <Activity className="h-3 w-3" />
              {(elapsed / 1000).toFixed(2)}s
            </span>
          </div>

          <ol className="mt-5 space-y-2">
            {journey.steps.map((s, i) => {
              const Icon = getIcon(s.icon);
              const done = stepIdx > i || (!running && stepIdx === i);
              const active = running && stepIdx === i;
              const reached = stepIdx >= i;
              return (
                <motion.li
                  key={s.key}
                  animate={{ opacity: reached ? 1 : 0.45 }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
                    active
                      ? "border-brand/50 bg-brand-soft"
                      : done
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-border bg-bg"
                  )}
                >
                  <span
                    className={cn(
                      "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
                      done
                        ? "bg-emerald-500/20 text-emerald-500"
                        : active
                        ? "bg-brand text-white"
                        : "bg-surface text-muted"
                    )}
                  >
                    {active ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : done ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{s.label}</p>
                    <AnimatePresence>
                      {reached && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-[11px] leading-relaxed text-muted"
                        >
                          {s.detail}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>

        {/* live event log */}
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Live event log
          </p>
          <div className="mt-3 space-y-2">
            <AnimatePresence initial={false}>
              {log.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-muted"
                >
                  Pick an action to trace the request end to end.
                </motion.p>
              )}
              {log.map((l) => (
                <motion.div
                  key={l.t + l.msg}
                  layout
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-lg border border-border bg-bg px-3 py-2"
                >
                  <p className="font-mono text-[10px] text-muted">{l.t}</p>
                  <p className="mt-0.5 text-xs">{l.msg}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
