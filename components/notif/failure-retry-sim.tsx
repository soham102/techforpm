"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  WifiOff,
  ServerCrash,
  BellOff,
  Siren,
  Play,
  RotateCcw,
} from "lucide-react";
import { cn, sleep } from "@/lib/utils";

type Scenario = "offline" | "provider" | "disabled" | "spam";

const TABS: { id: Scenario; label: string; icon: React.ReactNode }[] = [
  { id: "offline", label: "Device offline", icon: <WifiOff className="h-4 w-4" /> },
  { id: "provider", label: "Provider down", icon: <ServerCrash className="h-4 w-4" /> },
  { id: "disabled", label: "User turned off", icon: <BellOff className="h-4 w-4" /> },
  { id: "spam", label: "Too many alerts", icon: <Siren className="h-4 w-4" /> },
];

interface LogLine {
  t: string;
  tone: "info" | "warn" | "bad" | "ok";
}

/**
 * Section 6 — the things that go wrong. Each tab simulates one
 * real failure mode and how a well-built system responds.
 */
export function FailureRetrySim() {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<Scenario>("offline");
  const [log, setLog] = useState<LogLine[]>([]);
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState(0);
  const runId = useRef(0);

  const push = (t: string, tone: LogLine["tone"] = "info") =>
    setLog((l) => [...l, { t, tone }].slice(-7));

  async function run() {
    const my = ++runId.current;
    setBusy(true);
    setLog([]);
    setPhase(0);

    const guard = () => runId.current === my;

    if (tab === "offline") {
      push("Event: “Your order is arriving” created", "info");
      await sleep(700);
      if (!guard()) return;
      push("Sent to push provider ✓", "ok");
      setPhase(1);
      await sleep(700);
      if (!guard()) return;
      push("Phone is offline — message can't be delivered", "warn");
      setPhase(2);
      await sleep(900);
      if (!guard()) return;
      push("Provider holds the message and waits…", "warn");
      await sleep(1100);
      if (!guard()) return;
      push("Phone back online — message delivered", "ok");
      setPhase(3);
    }

    if (tab === "provider") {
      push("Event created · notification queued", "info");
      await sleep(700);
      if (!guard()) return;
      push("Attempt 1 → push provider unavailable", "bad");
      setPhase(1);
      await sleep(800);
      if (!guard()) return;
      push("Backing off… retry in 2s", "warn");
      await sleep(900);
      if (!guard()) return;
      push("Attempt 2 → still failing", "bad");
      setPhase(2);
      await sleep(900);
      if (!guard()) return;
      push("Attempt 3 → provider recovered ✓", "ok");
      push("Notification finally delivered", "ok");
      setPhase(3);
    }

    if (tab === "disabled") {
      push("Event created · notification queued", "info");
      await sleep(700);
      if (!guard()) return;
      push("Check: user disabled notifications for this app", "warn");
      setPhase(1);
      await sleep(900);
      if (!guard()) return;
      push("Delivery blocked — nothing can reach the screen", "bad");
      setPhase(2);
      await sleep(900);
      if (!guard()) return;
      push("Fallback: surface it in-app + email instead", "ok");
      setPhase(3);
    }

    if (tab === "spam") {
      for (let i = 1; i <= 6; i++) {
        if (!guard()) return;
        push(`Promo notification #${i} sent`, i > 3 ? "bad" : "warn");
        setPhase(i);
        await sleep(550);
      }
      if (!guard()) return;
      push("User overwhelmed → mutes notifications", "bad");
      await sleep(700);
      if (!guard()) return;
      push("Lost channel: future order updates won't be seen", "bad");
    }

    setBusy(false);
  }

  function reset() {
    runId.current++;
    setBusy(false);
    setLog([]);
    setPhase(0);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id);
              reset();
            }}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors",
              tab === t.id
                ? "border-brand/50 bg-brand-soft text-brand"
                : "border-border text-muted hover:text-fg"
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Visualization */}
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-border bg-bg p-6">
          <ScenarioViz tab={tab} phase={phase} reduce={reduce} />
        </div>

        {/* Log */}
        <div className="rounded-2xl border border-border bg-bg p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              System log
            </p>
            <div className="flex gap-2">
              <button
                onClick={run}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5" />
                Run
              </button>
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted hover:text-fg"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <ul className="mt-4 space-y-2">
            <AnimatePresence initial={false}>
              {log.length === 0 && (
                <p className="py-8 text-center text-xs text-muted">
                  Press Run to simulate this failure
                </p>
              )}
              {log.map((l, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-2 text-[12px] leading-snug"
                >
                  <span
                    className={cn(
                      "mt-1 h-1.5 w-1.5 shrink-0 rounded-full",
                      l.tone === "bad"
                        ? "bg-rose-500"
                        : l.tone === "warn"
                        ? "bg-amber-500"
                        : l.tone === "ok"
                        ? "bg-emerald-500"
                        : "bg-brand"
                    )}
                  />
                  <span
                    className={cn(
                      l.tone === "bad"
                        ? "text-rose-500"
                        : l.tone === "ok"
                        ? "text-emerald-500"
                        : "text-muted"
                    )}
                  >
                    {l.t}
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>

      <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">PM insight: </span>
        {tab === "spam"
          ? "A poor notification strategy doesn't just annoy users — it permanently costs you the channel. Once muted, even critical order updates stop landing."
          : "Notification systems need retry and fallback logic. Delivery is best-effort: assume some will fail and design the recovery path on purpose."}
      </p>
    </div>
  );
}

function ScenarioViz({
  tab,
  phase,
  reduce,
}: {
  tab: Scenario;
  phase: number;
  reduce: boolean | null;
}) {
  if (tab === "spam") {
    return (
      <div className="w-full">
        <div className="mx-auto h-52 w-32 rounded-[1.5rem] border-2 border-border bg-surface p-2">
          <div className="space-y-1.5">
            <AnimatePresence>
              {Array.from({ length: Math.min(phase, 6) }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "rounded-md px-2 py-1 text-[8px] font-medium",
                    i > 2
                      ? "bg-rose-500/15 text-rose-500"
                      : "bg-brand-soft text-brand"
                  )}
                >
                  🔔 Flash sale #{i + 1}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <p
          className={cn(
            "mt-4 text-center text-xs font-medium",
            phase >= 6 ? "text-rose-500" : "text-amber-500"
          )}
        >
          {phase >= 6
            ? "Notification overload → muted"
            : "Stacking up fast…"}
        </p>
      </div>
    );
  }

  const phoneDelivered =
    (tab === "offline" && phase >= 3) ||
    (tab === "provider" && phase >= 3) ||
    (tab === "disabled" && phase >= 3);
  const blocked = tab === "disabled" && phase >= 2 && phase < 3;

  return (
    <div className="flex w-full items-center justify-around">
      {/* Provider */}
      <div className="text-center">
        <motion.span
          animate={
            (tab === "provider" && phase >= 1 && phase < 3) ||
            (tab === "offline" && phase === 2)
              ? reduce
                ? {}
                : { x: [0, -3, 3, 0] }
              : {}
          }
          transition={{ duration: 0.3, repeat: Infinity }}
          className={cn(
            "grid h-14 w-14 place-items-center rounded-2xl border",
            tab === "provider" && phase >= 1 && phase < 3
              ? "border-rose-500/40 bg-rose-500/10 text-rose-500"
              : "border-border bg-surface text-brand"
          )}
        >
          {tab === "provider" && phase >= 1 && phase < 3 ? (
            <ServerCrash className="h-6 w-6" />
          ) : (
            <Siren className="h-6 w-6" />
          )}
        </motion.span>
        <p className="mt-2 text-[11px] text-muted">Push provider</p>
      </div>

      {/* Link */}
      <div className="relative h-1 w-20 rounded-full bg-border">
        {!reduce && !blocked && (
          <motion.span
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-brand shadow-glow"
            animate={{ left: ["0%", "100%"], opacity: [0, 1, 0] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
            }}
          />
        )}
        {blocked && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs">
            🚫
          </span>
        )}
      </div>

      {/* Phone */}
      <div className="text-center">
        <motion.span
          animate={
            phoneDelivered && !reduce ? { scale: [1, 1.12, 1] } : {}
          }
          transition={{ duration: 0.6 }}
          className={cn(
            "grid h-14 w-14 place-items-center rounded-2xl border text-2xl",
            phoneDelivered
              ? "border-emerald-500/40 bg-emerald-500/10"
              : tab === "offline" && phase >= 1
              ? "border-amber-500/40 bg-amber-500/10"
              : "border-border bg-surface"
          )}
        >
          {tab === "offline" && phase >= 1 && phase < 3 ? (
            <WifiOff className="h-6 w-6 text-amber-500" />
          ) : tab === "disabled" ? (
            <BellOff className="h-6 w-6 text-muted" />
          ) : phoneDelivered ? (
            "✅"
          ) : (
            "📱"
          )}
        </motion.span>
        <p className="mt-2 text-[11px] text-muted">User device</p>
      </div>
    </div>
  );
}
