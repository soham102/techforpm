"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Phone, RefreshCw, PhoneCall, RadioTower } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { ANALOGY_PAIRS } from "@/lib/realtime";
import { cn } from "@/lib/utils";

/**
 * Section 1 — the live-phone-call analogy. Toggle between redialing every
 * few seconds (polling) and staying on one open line (WebSocket).
 */
export function RtAnalogyMap() {
  const [live, setLive] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setLive(false)}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            !live
              ? "bg-amber-500/15 text-amber-500"
              : "border border-border text-muted hover:text-fg"
          )}
        >
          <RefreshCw className="h-4 w-4" />
          Polling — keep redialing
        </button>
        <button
          onClick={() => setLive(true)}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            live
              ? "bg-emerald-500/15 text-emerald-500"
              : "border border-border text-muted hover:text-fg"
          )}
        >
          <PhoneCall className="h-4 w-4" />
          WebSocket — one live call
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-bg p-6">
        <div className="flex items-center justify-between gap-4">
          {/* Client */}
          <div className="text-center">
            <span
              className={cn(
                "grid h-14 w-14 place-items-center rounded-2xl border transition-colors",
                live
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                  : "border-border bg-surface text-brand"
              )}
            >
              <Phone className="h-6 w-6" />
            </span>
            <p className="mt-2 text-xs font-medium text-muted">Your app</p>
          </div>

          {/* The line */}
          <div className="relative flex h-16 flex-1 items-center">
            {live ? (
              <>
                <motion.div
                  className="h-1 w-full rounded-full bg-emerald-500/30"
                  animate={reduce ? {} : { opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                />
                {!reduce &&
                  [0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="absolute h-2.5 w-2.5 rounded-full bg-emerald-500"
                      animate={{ left: ["8%", "88%"], opacity: [0, 1, 0] }}
                      transition={{
                        duration: 1.4,
                        repeat: Infinity,
                        delay: i * 0.45,
                      }}
                    />
                  ))}
              </>
            ) : (
              <div className="flex w-full items-center justify-evenly">
                {!reduce &&
                  [0, 1, 2, 3].map((i) => (
                    <motion.span
                      key={i}
                      className="text-[10px] font-semibold text-amber-500"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        delay: i * 0.4,
                      }}
                    >
                      “any update?”
                    </motion.span>
                  ))}
              </div>
            )}
          </div>

          {/* Server */}
          <div className="text-center">
            <motion.span
              animate={
                live && !reduce ? { scale: [1, 1.08, 1] } : {}
              }
              transition={{ duration: 1.8, repeat: Infinity }}
              className={cn(
                "grid h-14 w-14 place-items-center rounded-2xl border transition-colors",
                live
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500 shadow-glow"
                  : "border-border bg-surface text-brand"
              )}
            >
              <RadioTower className="h-6 w-6" />
            </motion.span>
            <p className="mt-2 text-xs font-medium text-muted">Server</p>
          </div>
        </div>

        <div
          className={cn(
            "mt-5 rounded-xl px-4 py-3 text-sm font-medium",
            live
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-amber-500/10 text-amber-500"
          )}
        >
          {live
            ? "Dial once, stay connected — the moment there's news, you hear it instantly"
            : "Hang up, redial, ask again, repeat — mostly to hear “nothing yet”"}
        </div>
      </div>

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
