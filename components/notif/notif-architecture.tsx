"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Play, RotateCcw, ChevronRight, Lightbulb } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { ARCH_NODES, type ArchNode } from "@/lib/notifications";
import { cn } from "@/lib/utils";

/**
 * Section 2 — the full architecture. A notification packet animates
 * through every stage; each stage is clickable for a plain-language
 * explanation and a PM insight.
 */
export function NotifArchitecture() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<ArchNode | null>(null);
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => {
      setStep((s) => {
        if (s >= ARCH_NODES.length - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 1100);
    return () => clearInterval(timer.current);
  }, [playing]);

  function play() {
    setStep(-1);
    setPlaying(true);
    setTimeout(() => setStep(0), 250);
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
          Send “Your order is arriving”
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
        <span className="text-xs text-muted">
          Tap any stage to learn what it does
        </span>
      </div>

      <div className="mt-7 flex flex-col gap-3 lg:flex-row lg:items-stretch">
        {ARCH_NODES.map((node, i) => {
          const Icon = getIcon(node.icon);
          const reached = step >= i;
          const isCurrent = step === i;
          return (
            <div
              key={node.id}
              className="flex flex-col items-stretch gap-3 lg:flex-1 lg:flex-row"
            >
              <motion.button
                type="button"
                onClick={() => setActive(node)}
                whileHover={{ y: -4 }}
                animate={
                  isCurrent && !reduce
                    ? { scale: [1, 1.05, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.6 }}
                className={cn(
                  "flex min-h-[150px] w-full flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-5 text-center shadow-soft transition-colors hover:shadow-soft-lg",
                  reached
                    ? "border-brand/50 bg-brand-soft"
                    : "border-border bg-bg"
                )}
              >
                <span
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-xl transition-colors",
                    reached
                      ? "bg-brand text-white shadow-glow"
                      : "bg-brand-soft text-brand"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="flex min-h-[2.5rem] items-center text-sm font-medium leading-tight">
                  {node.label}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-brand">
                  Click to learn
                </span>
              </motion.button>

              {i < ARCH_NODES.length - 1 && (
                <div className="relative flex h-8 items-center justify-center lg:h-auto lg:w-8">
                  <motion.span
                    aria-hidden
                    animate={
                      step >= i && !reduce
                        ? { opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }
                        : { opacity: 0.3 }
                    }
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-brand"
                  >
                    <ChevronRight className="h-5 w-5 rotate-90 lg:rotate-0" />
                  </motion.span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-7 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">The big idea: </span>
        a product event becomes a message, the message gets routed to the
        right people, a delivery service carries it the last mile, and it
        lands on a phone — even with the app fully closed.
      </p>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setActive(null)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ scale: 0.92, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 8, opacity: 0 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className="relative w-full max-w-md rounded-2xl border border-border bg-elevated p-6 shadow-soft-lg"
            >
              <button
                onClick={() => setActive(null)}
                aria-label="Close"
                className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-fg"
              >
                <X className="h-4 w-4" />
              </button>
              {(() => {
                const Icon = getIcon(active.icon);
                return (
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand">
                    <Icon className="h-5 w-5" />
                  </span>
                );
              })()}
              <h4 className="mt-4 text-lg font-semibold">
                {active.detail.title}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {active.detail.body}
              </p>
              <div className="mt-4 flex gap-2 rounded-xl bg-brand-soft px-4 py-3 text-sm">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span>
                  <span className="font-semibold text-brand">PM insight: </span>
                  {active.detail.pm}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
