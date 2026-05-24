"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Shuffle,
  AlertTriangle,
  RotateCcw,
  Lock,
  Calendar,
  Terminal,
  Sparkles,
} from "lucide-react";
import {
  CUSTOMERS,
  type BookingStage,
  type Customer,
} from "@/lib/booking-conflict";
import { CustomerCard } from "./customer-card";
import { cn } from "@/lib/utils";

type CustomerId = Customer["id"];

interface SimState {
  stages: Record<CustomerId, BookingStage>;
  paymentProgress: Record<CustomerId, number>;
  aiMessage: Record<CustomerId, string | undefined>;
  lockHolder: CustomerId | null;
  slotOwner: CustomerId | null;
  log: { id: number; t: number; text: string; tone?: "ok" | "warn" | "err" | "ai" }[];
  metrics: {
    doubleBookingsPrevented: number;
    paymentTimeouts: number;
    altRecoveries: number;
    runs: number;
  };
  running: boolean;
  startedAt: number;
  forceFailureFor: CustomerId | null;
  forceWinner: CustomerId | null;
  nextLogId: number;
}

const initialMetrics = {
  doubleBookingsPrevented: 0,
  paymentTimeouts: 0,
  altRecoveries: 0,
  runs: 0,
};

const initialState: SimState = {
  stages: { A: "idle", B: "idle", C: "idle" },
  paymentProgress: { A: 0, B: 0, C: 0 },
  aiMessage: { A: undefined, B: undefined, C: undefined },
  lockHolder: null,
  slotOwner: null,
  log: [],
  metrics: initialMetrics,
  running: false,
  startedAt: 0,
  forceFailureFor: null,
  forceWinner: null,
  nextLogId: 0,
};

type Action =
  | { type: "RESET" }
  | { type: "START"; forceWinner: CustomerId | null; forceFailureFor: CustomerId | null }
  | {
      type: "PATCH";
      stages?: Partial<Record<CustomerId, BookingStage>>;
      paymentProgress?: Partial<Record<CustomerId, number>>;
      aiMessage?: Partial<Record<CustomerId, string | undefined>>;
      lockHolder?: CustomerId | null;
      slotOwner?: CustomerId | null;
      running?: boolean;
    }
  | { type: "LOG"; text: string; tone?: "ok" | "warn" | "err" | "ai" }
  | { type: "INC"; key: keyof SimState["metrics"]; by?: number };

function reducer(s: SimState, a: Action): SimState {
  switch (a.type) {
    case "RESET":
      return {
        ...initialState,
        metrics: s.metrics,
      };
    case "START":
      return {
        ...initialState,
        metrics: s.metrics,
        running: true,
        startedAt: Date.now(),
        forceWinner: a.forceWinner,
        forceFailureFor: a.forceFailureFor,
      };
    case "PATCH":
      return {
        ...s,
        stages: { ...s.stages, ...(a.stages ?? {}) },
        paymentProgress: {
          ...s.paymentProgress,
          ...(a.paymentProgress ?? {}),
        },
        aiMessage: { ...s.aiMessage, ...(a.aiMessage ?? {}) },
        lockHolder: a.lockHolder !== undefined ? a.lockHolder : s.lockHolder,
        slotOwner: a.slotOwner !== undefined ? a.slotOwner : s.slotOwner,
        running: a.running !== undefined ? a.running : s.running,
      };
    case "LOG":
      return {
        ...s,
        log: [
          {
            id: s.nextLogId,
            t: Date.now() - (s.startedAt || Date.now()),
            text: a.text,
            tone: a.tone,
          },
          ...s.log,
        ].slice(0, 12),
        nextLogId: s.nextLogId + 1,
      };
    case "INC":
      return {
        ...s,
        metrics: {
          ...s.metrics,
          [a.key]: s.metrics[a.key] + (a.by ?? 1),
        },
      };
    default:
      return s;
  }
}

function pickWinner(force: CustomerId | null): CustomerId {
  if (force) return force;
  // Deterministic: earliest arrivalMs wins (tie-broken by id).
  return [...CUSTOMERS].sort((a, b) => a.arrivalMs - b.arrivalMs)[0].id;
}

export function BookingSimulator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeouts.current.push(id);
  }, []);

  const clearAll = useCallback(() => {
    timeouts.current.forEach((t) => clearTimeout(t));
    timeouts.current = [];
  }, []);

  useEffect(() => clearAll, [clearAll]);

  const log = useCallback(
    (text: string, tone?: "ok" | "warn" | "err" | "ai") =>
      dispatch({ type: "LOG", text, tone }),
    []
  );

  const runSimulation = useCallback(
    (opts: { forceWinner: CustomerId | null; forceFailureFor: CustomerId | null }) => {
      clearAll();
      dispatch({ type: "START", ...opts });
      dispatch({ type: "INC", key: "runs" });

      const winner = pickWinner(opts.forceWinner);
      const losers = CUSTOMERS.filter((c) => c.id !== winner);
      const winCust = CUSTOMERS.find((c) => c.id === winner)!;
      const failed = opts.forceFailureFor === winner;

      log(
        `🚦 Simulation started — three concurrent requests inbound.`,
        "ok"
      );

      // Stage 1: All three enter payment flow
      CUSTOMERS.forEach((c) => {
        schedule(() => {
          dispatch({ type: "PATCH", stages: { [c.id]: "requested" } });
          log(`Customer ${c.id} → POST /book (slot=slot_2030)`);
        }, c.arrivalMs);
      });

      // Stage 2: Booking API serialises, Redis lock granted to winner
      const lockTime = 400;
      schedule(() => {
        dispatch({
          type: "PATCH",
          stages: { [winner]: "lock-acquired" },
          lockHolder: winner,
        });
        log(
          `🔒 Redis SETNX OK — slot locked by ${winner} (deterministic).`,
          "ok"
        );
      }, lockTime);

      // Losers move to queued (waiting on lock)
      losers.forEach((c, i) => {
        schedule(() => {
          dispatch({ type: "PATCH", stages: { [c.id]: "queued" } });
          log(`Customer ${c.id} → queued behind lock holder.`);
        }, lockTime + 100 + i * 60);
      });

      // Stage 3: Winner enters payment
      const payStart = lockTime + 700;
      schedule(() => {
        dispatch({
          type: "PATCH",
          stages: { [winner]: "payment-processing" },
        });
        log(`💳 ${winner} → payment gateway charge initiated.`);
      }, payStart);

      // Stage 4: Animate payment progress in steps
      const steps = 10;
      const cutoff = failed ? 0.65 : 1;
      for (let i = 1; i <= steps; i++) {
        const pct = (i / steps) * (failed ? 0.7 : 1);
        if (pct > cutoff + 0.05 && failed) break;
        schedule(() => {
          dispatch({
            type: "PATCH",
            paymentProgress: { [winner]: pct },
          });
        }, payStart + (winCust.paymentMs / steps) * i);
      }

      const payEnd = payStart + winCust.paymentMs;

      if (failed) {
        // Payment fails → release lock → second customer gets the slot
        schedule(() => {
          dispatch({
            type: "PATCH",
            stages: { [winner]: "payment-failed" },
          });
          log(`⏱ Payment timeout for ${winner} — gateway returned 504.`, "err");
          dispatch({ type: "INC", key: "paymentTimeouts" });
        }, payEnd);

        const next = losers.sort((a, b) => a.arrivalMs - b.arrivalMs)[0];
        const otherLoser = losers.find((c) => c.id !== next.id)!;

        schedule(() => {
          dispatch({
            type: "PATCH",
            stages: { [next.id]: "lock-acquired" },
            lockHolder: next.id,
          });
          log(`🔓 Lock released → ${next.id} promoted to slot holder.`, "ok");
        }, payEnd + 350);

        schedule(() => {
          dispatch({
            type: "PATCH",
            stages: { [next.id]: "payment-processing" },
          });
          log(`💳 ${next.id} → payment initiated.`);
        }, payEnd + 700);

        // Animate next customer payment success
        for (let i = 1; i <= steps; i++) {
          const pct = i / steps;
          schedule(() => {
            dispatch({
              type: "PATCH",
              paymentProgress: { [next.id]: pct },
            });
          }, payEnd + 700 + (next.paymentMs / steps) * i);
        }

        const nextDone = payEnd + 700 + next.paymentMs;
        schedule(() => {
          dispatch({
            type: "PATCH",
            stages: { [next.id]: "confirmed" },
            slotOwner: next.id,
          });
          log(
            `✅ Booking confirmed for ${next.id} — DB row persisted.`,
            "ok"
          );
          dispatch({ type: "INC", key: "doubleBookingsPrevented" });
          dispatch({ type: "INC", key: "altRecoveries" });
        }, nextDone);

        // Loser + originally failed get AI alternates
        schedule(() => {
          dispatch({
            type: "PATCH",
            stages: { [winner]: "ai-recommended" },
            aiMessage: {
              [winner]:
                "Same provider · slot at 18:30 (90 min later) — held for 60s.",
            },
          });
          log(`🤖 AI → alternate slot offered to ${winner}.`, "ai");
        }, nextDone + 400);

        schedule(() => {
          dispatch({
            type: "PATCH",
            stages: { [otherLoser.id]: "ai-recommended" },
            aiMessage: {
              [otherLoser.id]:
                "Nearby provider · 4.8★ · 1.2 km away · same price.",
            },
          });
          log(`🤖 AI → nearby provider offered to ${otherLoser.id}.`, "ai");
          dispatch({ type: "PATCH", running: false });
        }, nextDone + 800);
      } else {
        // Happy path
        schedule(() => {
          dispatch({
            type: "PATCH",
            stages: { [winner]: "confirmed" },
            slotOwner: winner,
          });
          log(
            `✅ Booking confirmed for ${winner} — DB row persisted.`,
            "ok"
          );
          dispatch({ type: "INC", key: "doubleBookingsPrevented" });
        }, payEnd + 200);

        // Losers get rejected → AI offers alternates
        losers.forEach((c, i) => {
          schedule(() => {
            dispatch({
              type: "PATCH",
              stages: { [c.id]: "rejected" },
              lockHolder: c.id === losers[losers.length - 1].id ? null : winner,
            });
            log(
              `❌ ${c.id} → slot unavailable (graceful 409).`,
              "warn"
            );
          }, payEnd + 500 + i * 200);
        });

        // AI follow-ups
        losers.forEach((c, i) => {
          schedule(() => {
            dispatch({
              type: "PATCH",
              stages: { [c.id]: "ai-recommended" },
              aiMessage: {
                [c.id]:
                  i === 0
                    ? "Same provider · slot at 18:30 (90 min later) — held for 60s."
                    : "Nearby provider · 4.7★ · 0.8 km away · same price.",
              },
            });
            log(
              `🤖 AI → ${i === 0 ? "alternate slot" : "nearby provider"} suggested to ${c.id}.`,
              "ai"
            );
            dispatch({ type: "INC", key: "altRecoveries" });
            if (i === losers.length - 1) {
              dispatch({ type: "PATCH", running: false });
            }
          }, payEnd + 1300 + i * 400);
        });
      }
    },
    [clearAll, log, schedule]
  );

  const reset = useCallback(() => {
    clearAll();
    dispatch({ type: "RESET" });
  }, [clearAll]);

  const startNormal = () =>
    runSimulation({ forceWinner: null, forceFailureFor: null });
  const startRandom = () => {
    const winner = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)].id;
    runSimulation({ forceWinner: winner, forceFailureFor: null });
  };
  const startWithFailure = () => {
    const winner = pickWinner(null);
    runSimulation({ forceWinner: winner, forceFailureFor: winner });
  };

  return (
    <div className="space-y-6">
      {/* Slot status + controls */}
      <div className="rounded-2xl border border-border bg-elevated p-5 shadow-soft md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand">
              <Calendar className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Contested slot
              </p>
              <p className="text-base font-semibold">
                Dr. Mehta · Today · 17:00 IST
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1.5 text-muted">
                  <Lock className="h-3.5 w-3.5" />
                  Lock holder:{" "}
                  <span className="font-mono font-semibold text-fg">
                    {state.lockHolder ?? "—"}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-muted">
                  ✓ Confirmed owner:{" "}
                  <span className="font-mono font-semibold text-emerald-500">
                    {state.slotOwner ?? "—"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <ControlButton
              onClick={startNormal}
              disabled={state.running}
              icon={<Play className="h-4 w-4" />}
              variant="primary"
            >
              Start Simulation
            </ControlButton>
            <ControlButton
              onClick={startRandom}
              disabled={state.running}
              icon={<Shuffle className="h-4 w-4" />}
            >
              Randomize Winner
            </ControlButton>
            <ControlButton
              onClick={startWithFailure}
              disabled={state.running}
              icon={<AlertTriangle className="h-4 w-4" />}
            >
              Simulate Payment Failure
            </ControlButton>
            <ControlButton
              onClick={reset}
              icon={<RotateCcw className="h-4 w-4" />}
            >
              Reset
            </ControlButton>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-amber-700 dark:text-amber-300">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            <span className="font-semibold">Product rule:</span> AI assists the
            experience, but{" "}
            <span className="font-semibold">deterministic systems</span>{" "}
            decide booking ownership. The lock service is the single source of
            truth — the model never picks a winner.
          </p>
        </div>
      </div>

      {/* Customer cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {CUSTOMERS.map((c) => (
          <CustomerCard
            key={c.id}
            customer={c}
            stage={state.stages[c.id]}
            paymentProgress={state.paymentProgress[c.id]}
            isWinner={state.slotOwner === c.id}
            aiMessage={state.aiMessage[c.id]}
          />
        ))}
      </div>

      {/* Event log */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Terminal className="h-4 w-4 text-brand" />
          System event log
        </div>
        <div className="max-h-56 space-y-1 overflow-y-auto font-mono text-[12px] leading-relaxed">
          <AnimatePresence initial={false}>
            {state.log.length === 0 && (
              <p className="text-muted">
                Press <span className="font-semibold">Start Simulation</span> to
                begin. Events stream here in real time.
              </p>
            )}
            {state.log.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "flex gap-3",
                  entry.tone === "err" && "text-rose-500",
                  entry.tone === "warn" && "text-amber-500",
                  entry.tone === "ok" && "text-emerald-500",
                  entry.tone === "ai" && "text-sky-500"
                )}
              >
                <span className="w-14 shrink-0 text-muted">
                  +{entry.t.toString().padStart(4, "0")}ms
                </span>
                <span className="flex-1">{entry.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Simulations run"
          value={state.metrics.runs}
          tone="brand"
        />
        <Metric
          label="Double bookings prevented"
          value={state.metrics.doubleBookingsPrevented}
          tone="emerald"
        />
        <Metric
          label="Payment timeouts handled"
          value={state.metrics.paymentTimeouts}
          tone="rose"
        />
        <Metric
          label="Alt-slot recoveries"
          value={state.metrics.altRecoveries}
          tone="sky"
        />
      </div>
    </div>
  );
}

function ControlButton({
  onClick,
  disabled,
  icon,
  children,
  variant = "ghost",
}: {
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all",
        variant === "primary"
          ? "bg-brand text-white shadow-glow hover:-translate-y-0.5 disabled:opacity-50"
          : "border border-border bg-surface hover:border-brand/40 hover:text-brand disabled:opacity-50"
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "brand" | "emerald" | "rose" | "sky";
}) {
  const toneMap = {
    brand: "text-brand",
    emerald: "text-emerald-500",
    rose: "text-rose-500",
    sky: "text-sky-500",
  };
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">
        {label}
      </p>
      <motion.p
        key={value}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn("mt-2 text-2xl font-semibold tabular-nums", toneMap[tone])}
      >
        {value}
      </motion.p>
    </div>
  );
}
