"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Loader2, CheckCircle2, Ban, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

const CHAIN = ["Save order", "Send email", "Update analytics", "Generate invoice"];

/**
 * Section 5 — a calm, looping side-by-side that contrasts the *feel*
 * of synchronous vs asynchronous. No controls: it just keeps showing
 * the difference.
 */
export function SyncVsAsync() {
  const reduce = useReducedMotion();

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Synchronous */}
      <div className="rounded-2xl border border-rose-500/30 bg-surface p-6 shadow-soft">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-rose-500/15 text-rose-500">
            <Ban className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold">Synchronous</p>
            <p className="text-[11px] text-muted">User waits for everything</p>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          {CHAIN.map((c, i) => (
            <div key={c} className="flex items-center gap-2">
              <motion.span
                aria-hidden
                initial={false}
                animate={
                  reduce ? { opacity: 0.6 } : { opacity: [0.25, 1, 0.25] }
                }
                transition={{
                  duration: CHAIN.length * 1.1,
                  repeat: Infinity,
                  times: [
                    i / CHAIN.length,
                    (i + 0.5) / CHAIN.length,
                    (i + 1) / CHAIN.length,
                  ],
                }}
                className="h-2 w-2 rounded-full bg-rose-500"
              />
              <div className="h-7 flex-1 rounded-lg border border-border bg-bg px-3 text-xs leading-7 text-muted">
                {c}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3">
          <Loader2
            className={cn("h-5 w-5 text-rose-500", !reduce && "animate-spin")}
          />
          <p className="text-sm font-medium text-rose-500">
            Still loading… UI is blocked
          </p>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Each step runs only after the last one finishes. The user stares at
          a spinner until the <em>slowest</em> task is done.
        </p>
      </div>

      {/* Asynchronous */}
      <div className="rounded-2xl border border-emerald-500/30 bg-surface p-6 shadow-soft">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/15 text-emerald-500">
            <Rocket className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold">Asynchronous</p>
            <p className="text-[11px] text-muted">Instant response + queue</p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <p className="text-sm font-semibold text-emerald-500">
            Order placed! — shown immediately
          </p>
        </div>

        <p className="mt-5 text-[11px] font-semibold uppercase tracking-wide text-muted">
          Meanwhile, in the background
        </p>
        <div className="mt-2 space-y-2">
          {CHAIN.map((c, i) => (
            <div key={c} className="flex items-center gap-2">
              <div className="relative h-7 flex-1 overflow-hidden rounded-lg border border-border bg-bg px-3 text-xs leading-7 text-muted">
                <span className="relative z-10">{c}</span>
                <motion.span
                  aria-hidden
                  initial={false}
                  animate={
                    reduce
                      ? { width: "100%" }
                      : { width: ["0%", "100%", "100%", "0%"] }
                  }
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    delay: i * 0.35,
                    times: [0, 0.4, 0.8, 1],
                  }}
                  className="absolute inset-y-0 left-0 bg-emerald-500/15"
                />
              </div>
              <motion.span
                aria-hidden
                animate={reduce ? { opacity: 1 } : { opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  delay: i * 0.35,
                  times: [0, 0.45, 0.8, 1],
                }}
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </motion.span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          The user is already on the next screen. These jobs finish on their
          own — responsiveness and scalability, for free.
        </p>
      </div>
    </div>
  );
}
