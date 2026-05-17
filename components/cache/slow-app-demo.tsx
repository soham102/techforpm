"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Server, Database, RotateCcw, Users } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Section 2 — why apps become slow. Tapping "dinner rush" sends more and
 * more identical requests straight to the database; the queue visibly
 * builds up and the response-time meter climbs into the red.
 */
export function SlowAppDemo() {
  const [load, setLoad] = useState(0);
  const decay = useRef<ReturnType<typeof setInterval>>();

  // Each tap is another user hammering the same DB query. Load drives the
  // latency; the queue is just its visual stack.
  const queue = Math.min(load * 2, 24);
  const responseMs = 300 + load * 340;
  const tone =
    responseMs < 800 ? "ok" : responseMs < 2000 ? "warn" : "bad";

  function rush() {
    setLoad((l) => Math.min(l + 1, 12));
  }

  function reset() {
    setLoad(0);
  }

  // The database slowly catches up — load eases off one step every few
  // seconds, so the spike you create stays visible before it recovers.
  useEffect(() => {
    decay.current = setInterval(() => {
      setLoad((l) => (l > 0 ? l - 1 : 0));
    }, 3000);
    return () => clearInterval(decay.current);
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">QuickBite · dinner rush</p>
          <p className="text-xs text-muted">
            Every tap is another hungry user opening the same page.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={rush}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
          >
            <Users className="h-4 w-4" />
            More users arrive
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-medium transition-colors hover:border-brand/40"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>

      <div className="mt-7 flex items-stretch justify-between gap-2 sm:gap-4">
        <Stage icon={<Smartphone className="h-5 w-5" />} label="Frontend app" />
        <Pipe />
        <Stage
          icon={<Server className="h-5 w-5" />}
          label="Backend"
          stressed={load >= 4}
        />
        <Pipe />
        <div className="flex flex-1 flex-col items-center gap-2">
          <div
            className={cn(
              "relative grid h-16 w-16 place-items-center rounded-2xl border transition-colors",
              load >= 6
                ? "border-rose-500/50 bg-rose-500/10 text-rose-500"
                : load >= 3
                ? "border-amber-500/50 bg-amber-500/10 text-amber-500"
                : "border-border bg-bg text-brand"
            )}
          >
            <Database className="h-5 w-5" />
            {load >= 3 && (
              <motion.span
                className="absolute inset-0 rounded-2xl"
                animate={{ opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 1.1, repeat: Infinity }}
                style={{
                  boxShadow: `0 0 0 3px rgb(${
                    load >= 6 ? "244 63 94" : "245 158 11"
                  } / 0.25)`,
                }}
              />
            )}
          </div>
          <span className="text-[11px] font-medium text-muted">Database</span>
          {/* request queue stacking on the database */}
          <div className="flex h-5 flex-wrap items-end justify-center gap-0.5">
            <AnimatePresence>
              {Array.from({ length: queue }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  exit={{ scaleY: 0, opacity: 0 }}
                  className={cn(
                    "h-3 w-1 origin-bottom rounded-full",
                    load >= 6 ? "bg-rose-500" : "bg-amber-500"
                  )}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* response time meter */}
      <div className="mt-7">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-muted">
            Loading time the user feels
          </span>
          <motion.span
            key={responseMs}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className={cn(
              "font-bold tabular-nums",
              tone === "ok" && "text-emerald-500",
              tone === "warn" && "text-amber-500",
              tone === "bad" && "text-rose-500"
            )}
          >
            {(responseMs / 1000).toFixed(1)}s
          </motion.span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-border">
          <motion.div
            className={cn(
              "h-full rounded-full",
              tone === "ok" && "bg-emerald-500",
              tone === "warn" && "bg-amber-500",
              tone === "bad" && "bg-rose-500"
            )}
            animate={{ width: `${Math.min(100, (responseMs / 4400) * 100)}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">PM insight: </span>
        Repeated database access slows apps down. The data barely changed —
        but every user paid the full price to fetch it again.
      </p>
    </div>
  );
}

function Stage({
  icon,
  label,
  stressed,
}: {
  icon: React.ReactNode;
  label: string;
  stressed?: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-2">
      <span
        className={cn(
          "grid h-16 w-16 place-items-center rounded-2xl border transition-colors",
          stressed
            ? "border-amber-500/50 bg-amber-500/10 text-amber-500"
            : "border-border bg-bg text-brand"
        )}
      >
        {icon}
      </span>
      <span className="text-[11px] font-medium text-muted">{label}</span>
    </div>
  );
}

function Pipe() {
  return (
    <div className="relative flex min-w-6 flex-1 items-center self-center">
      <div className="h-0.5 w-full bg-border" />
      <motion.span
        aria-hidden
        className="absolute h-1.5 w-1.5 rounded-full bg-brand"
        animate={{ left: ["0%", "100%"] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
