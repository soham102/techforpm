"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { TrafficCone, ShieldCheck } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { ANALOGY_PAIRS } from "@/lib/load-balancing";
import { cn } from "@/lib/utils";

/**
 * Section 1 — the traffic-police analogy. Toggle between an uncontrolled
 * junction (everything funnels onto one road and jams) and a managed one
 * (an officer spreads cars across roads and traffic flows).
 */
export function LbAnalogyMap() {
  const [controlled, setControlled] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setControlled(false)}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            !controlled
              ? "bg-rose-500/15 text-rose-500"
              : "border border-border text-muted hover:text-fg"
          )}
        >
          <TrafficCone className="h-4 w-4" />
          Without traffic control
        </button>
        <button
          onClick={() => setControlled(true)}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            controlled
              ? "bg-emerald-500/15 text-emerald-500"
              : "border border-border text-muted hover:text-fg"
          )}
        >
          <ShieldCheck className="h-4 w-4" />
          With traffic police
        </button>
      </div>

      {/* Junction visualisation */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-bg p-5">
        <div className="flex items-center gap-4">
          {/* Incoming traffic */}
          <div className="shrink-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              Incoming
            </p>
            <div className="mt-2 grid grid-cols-3 gap-1">
              {Array.from({ length: 9 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="h-2.5 w-2.5 rounded-sm bg-brand"
                  animate={
                    reduce ? {} : { opacity: [0.4, 1, 0.4] }
                  }
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    delay: i * 0.12,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Officer / no officer */}
          <div className="relative flex h-28 flex-1 items-center justify-center">
            <AnimatePresence mode="wait">
              {controlled ? (
                <motion.div
                  key="officer"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  className="z-10 grid h-14 w-14 place-items-center rounded-full border border-emerald-500/40 bg-emerald-500/15 text-emerald-500 shadow-glow"
                >
                  <ShieldCheck className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="cone"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  className="z-10 grid h-14 w-14 place-items-center rounded-full border border-rose-500/40 bg-rose-500/15 text-rose-500"
                >
                  <TrafficCone className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Moving cars */}
            {!reduce &&
              Array.from({ length: 7 }).map((_, i) => (
                <motion.span
                  key={`${controlled}-${i}`}
                  className={cn(
                    "absolute left-0 h-2 w-4 rounded-[3px]",
                    controlled ? "bg-emerald-500" : "bg-rose-500"
                  )}
                  initial={{ x: 0, y: 0, opacity: 0 }}
                  animate={{
                    x: ["0%", "100%", "190%"],
                    y: controlled
                      ? [0, (i % 3) * 26 - 26, (i % 3) * 26 - 26]
                      : [0, 0, 0],
                    opacity: [0, 1, controlled ? 1 : 0.2],
                  }}
                  transition={{
                    duration: controlled ? 1.6 : 2.6,
                    repeat: Infinity,
                    delay: i * (controlled ? 0.22 : 0.5),
                    ease: "easeInOut",
                  }}
                  style={{ top: "50%" }}
                />
              ))}
          </div>

          {/* Roads / servers */}
          <div className="shrink-0 space-y-2">
            <p className="text-right text-[11px] font-semibold uppercase tracking-wide text-muted">
              Roads (servers)
            </p>
            {[0, 1, 2].map((r) => {
              const jammed = !controlled && r === 1;
              return (
                <div
                  key={r}
                  className={cn(
                    "flex h-7 w-28 items-center justify-end gap-1 rounded-md border px-2 text-[10px] font-semibold transition-colors",
                    controlled
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                      : jammed
                      ? "border-rose-500/40 bg-rose-500/15 text-rose-500"
                      : "border-border bg-surface text-muted opacity-50"
                  )}
                >
                  {controlled
                    ? "flowing"
                    : jammed
                    ? "JAMMED"
                    : "idle"}
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={cn(
            "mt-5 rounded-xl px-4 py-3 text-sm font-medium",
            controlled
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-rose-500/10 text-rose-500"
          )}
        >
          {controlled
            ? "Smoother flow · faster movement · congestion spread across every road"
            : "Everything funnels onto one road → traffic jam, delays, crashes"}
        </div>
      </div>

      {/* Mapping grid */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {ANALOGY_PAIRS.map((p, i) => {
          const Icon = getIcon(p.icon);
          return (
            <motion.div
              key={p.tech}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-border bg-bg p-4"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 text-sm">
                  <p className="font-semibold">{p.tech}</p>
                  <p className="text-muted">{p.real}</p>
                </div>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-muted">
                {p.plain}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
