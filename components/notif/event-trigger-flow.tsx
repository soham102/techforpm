"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Play, RotateCcw, Bike, Cog, BellRing, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChainStep {
  id: string;
  title: string;
  icon: React.ReactNode;
  line: string;
  detail: string;
}

const CHAIN: ChainStep[] = [
  {
    id: "event",
    title: "An event occurs",
    icon: <Bike className="h-5 w-5" />,
    line: "Order status → “Out for delivery”",
    detail:
      "Inside QuickBite, the rider picks up the order. A real thing changed in the product's data — nobody pressed a button to notify anyone.",
  },
  {
    id: "react",
    title: "The system reacts",
    icon: <Cog className="h-5 w-5" />,
    line: "Backend rule: “status changed → send notification”",
    detail:
      "The backend is watching for that change. The instant it happens, a rule fires automatically: this is worth telling the customer.",
  },
  {
    id: "create",
    title: "A notification is created",
    icon: <BellRing className="h-5 w-5" />,
    line: "“Your order is arriving!” enters the pipeline",
    detail:
      "A message is composed for this specific user and dropped into the delivery pipeline — queued, then sent to the push provider.",
  },
  {
    id: "receive",
    title: "The user receives the alert",
    icon: <Smartphone className="h-5 w-5" />,
    line: "Phone lights up: “Your order is arriving!”",
    detail:
      "Seconds later it's on the lock screen. The user never opened the app — the update came to them, triggered entirely by a system event.",
  },
];

/**
 * Section 4 — the event chain. Most PMs never see this: a system event
 * automatically becomes a notification with no human in the loop.
 */
export function EventTriggerFlow() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => {
      setStep((s) => {
        if (s >= CHAIN.length - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 1600);
    return () => clearInterval(timer.current);
  }, [playing]);

  function play() {
    setStep(0);
    setPlaying(true);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={play}
          disabled={playing}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          <Play className="h-4 w-4" />
          Run the event chain
        </button>
        <button
          onClick={() => {
            setPlaying(false);
            setStep(-1);
          }}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-fg"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      <div className="mt-7 space-y-3">
        {CHAIN.map((c, i) => {
          const reached = step >= i;
          const current = step === i;
          return (
            <div key={c.id} className="relative">
              <motion.div
                animate={{
                  opacity: reached ? 1 : 0.45,
                  scale: current && !reduce ? 1.01 : 1,
                }}
                transition={{ duration: 0.4 }}
                className={cn(
                  "flex items-start gap-4 rounded-2xl border p-5 transition-colors",
                  reached
                    ? "border-brand/50 bg-brand-soft"
                    : "border-border bg-bg"
                )}
              >
                <motion.span
                  animate={
                    current && !reduce
                      ? { scale: [1, 1.15, 1] }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.9, repeat: current ? Infinity : 0 }}
                  className={cn(
                    "grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-colors",
                    reached
                      ? "bg-brand text-white shadow-glow"
                      : "bg-brand-soft text-brand"
                  )}
                >
                  {c.icon}
                </motion.span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-semibold">{c.title}</h4>
                    <span className="rounded-full bg-bg px-2 py-0.5 font-mono text-[10px] text-muted">
                      {c.line}
                    </span>
                  </div>
                  <AnimatePresence>
                    {reached && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-2 overflow-hidden text-[13px] leading-relaxed text-muted"
                      >
                        {c.detail}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border text-[10px] font-semibold text-muted">
                  {i + 1}
                </span>
              </motion.div>

              {i < CHAIN.length - 1 && (
                <div className="flex justify-center py-1">
                  <motion.div
                    animate={
                      step > i && !reduce
                        ? { opacity: [0.3, 1, 0.3] }
                        : { opacity: 0.3 }
                    }
                    transition={{ duration: 1, repeat: Infinity }}
                    className="h-4 w-0.5 rounded-full bg-brand"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-7 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">PM insight: </span>
        Notifications are triggered automatically by system events — not sent
        by hand. If you want a new notification, you're really asking for a new
        event to be tracked and a rule to fire on it.
      </p>
    </div>
  );
}
