"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  ServerCrash,
  Scale,
  Zap,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "no-lb" | "lb";

/**
 * Section 6 — crash a server during the IPL rush. Without a load balancer the
 * whole app goes dark. With one, traffic reroutes instantly and the product
 * stays up.
 */
export function FailureSim() {
  const [mode, setMode] = useState<Mode>("lb");
  const [crashed, setCrashed] = useState(false);

  const servers = [1, 2, 3];
  // Without a balancer there's effectively one path; crashing it kills the app.
  const appDown = mode === "no-lb" && crashed;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            setMode("no-lb");
            setCrashed(false);
          }}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            mode === "no-lb"
              ? "bg-rose-500/15 text-rose-500"
              : "border border-border text-muted hover:text-fg"
          )}
        >
          Without load balancer
        </button>
        <button
          onClick={() => {
            setMode("lb");
            setCrashed(false);
          }}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            mode === "lb"
              ? "bg-emerald-500/15 text-emerald-500"
              : "border border-border text-muted hover:text-fg"
          )}
        >
          With load balancer
        </button>
        <button
          onClick={() => setCrashed(false)}
          disabled={!crashed}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-fg disabled:opacity-30"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Restore
        </button>
      </div>

      <div className="mt-7 rounded-2xl border border-border bg-bg p-5">
        {/* Balancer (only in lb mode) */}
        <div className="flex flex-col items-center">
          {mode === "lb" && (
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand-soft px-4 py-2 text-sm font-semibold text-brand shadow-glow">
              <Scale className="h-4 w-4" />
              Load balancer
              <span className="text-xs font-normal text-muted">
                · health-checking
              </span>
            </div>
          )}

          <div className="grid w-full gap-3 sm:grid-cols-3">
            {servers.map((n) => {
              const isCrashed = crashed && n === 2;
              const reroute = mode === "lb" && crashed && n !== 2;
              return (
                <motion.div
                  key={n}
                  animate={
                    isCrashed
                      ? { x: [-2, 2, -2, 0] }
                      : reroute
                      ? { scale: [1, 1.04, 1] }
                      : {}
                  }
                  transition={{
                    duration: isCrashed ? 0.4 : 1,
                    repeat: isCrashed || reroute ? Infinity : 0,
                  }}
                  className={cn(
                    "relative overflow-hidden rounded-xl border p-4 text-center",
                    isCrashed
                      ? "border-rose-500/50 bg-rose-500/10"
                      : reroute
                      ? "border-emerald-500/40 bg-emerald-500/10"
                      : "border-border bg-surface"
                  )}
                >
                  {reroute && (
                    <motion.span
                      className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-500"
                      animate={{ x: [-10, 6], opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                  <span
                    className={cn(
                      "mx-auto grid h-10 w-10 place-items-center rounded-xl",
                      isCrashed
                        ? "bg-rose-500/15 text-rose-500"
                        : "bg-emerald-500/15 text-emerald-500"
                    )}
                  >
                    {isCrashed ? (
                      <ServerCrash className="h-5 w-5" />
                    ) : (
                      <Server className="h-5 w-5" />
                    )}
                  </span>
                  <p className="mt-2 text-sm font-medium">Server {n}</p>
                  <p
                    className={cn(
                      "text-[11px] font-semibold",
                      isCrashed
                        ? "text-rose-500"
                        : reroute
                        ? "text-emerald-500"
                        : "text-muted"
                    )}
                  >
                    {isCrashed
                      ? "Crashed"
                      : reroute
                      ? "Taking extra traffic"
                      : "Healthy"}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Crash button */}
        {!crashed && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setCrashed(true)}
              className="inline-flex items-center gap-2 rounded-full bg-rose-500/15 px-5 py-2.5 text-sm font-semibold text-rose-500 transition-transform hover:-translate-y-0.5"
            >
              <Zap className="h-4 w-4" />
              Crash Server 2 during the IPL rush
            </button>
          </div>
        )}

        {/* Outcome banner */}
        <AnimatePresence mode="wait">
          {crashed && (
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "mt-6 flex items-start gap-3 rounded-xl px-4 py-4 text-sm",
                appDown
                  ? "bg-rose-500/10 text-rose-500"
                  : "bg-emerald-500/10 text-emerald-500"
              )}
            >
              {appDown ? (
                <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
              ) : (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              )}
              <div>
                <p className="font-bold">
                  {appDown
                    ? "App is completely down"
                    : "App stays up — users don't notice"}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">
                  {appDown
                    ? "All traffic was pointed at that one server. With nothing to reroute to, every user gets an error until it's manually brought back."
                    : "The balancer detects Server 2 is unhealthy and instantly stops sending it traffic — the remaining servers absorb the load and bookings keep flowing."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">PM insight: </span>
        Load balancers improve reliability and uptime. A single server failing
        becomes a non-event instead of an outage — which is the difference
        between a quiet night and a status-page incident.
      </p>
    </div>
  );
}
