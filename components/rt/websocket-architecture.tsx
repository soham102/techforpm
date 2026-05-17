"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Smartphone, Server, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "idle" | "handshake" | "open";

/**
 * Section 3 — introducing WebSockets. Press connect: a one-time handshake
 * opens a persistent line, then messages flow both ways instantly and
 * continuously, with no new requests.
 */
export function WebsocketArchitecture() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    if (phase !== "handshake") return;
    const t = setTimeout(() => setPhase("open"), 1500);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">
          Persistent WebSocket connection
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPhase("handshake")}
            disabled={phase !== "idle"}
            className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            Connect
          </button>
          <button
            onClick={() => setPhase("idle")}
            className="rounded-full border border-border px-4 py-2 text-xs font-medium text-muted transition-colors hover:text-fg"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-bg p-6">
        <div className="flex items-center justify-between gap-4">
          {/* Client */}
          <div className="text-center">
            <motion.span
              animate={
                phase === "open" && !reduce ? { scale: [1, 1.06, 1] } : {}
              }
              transition={{ duration: 2, repeat: Infinity }}
              className={cn(
                "grid h-16 w-16 place-items-center rounded-2xl border transition-colors",
                phase === "open"
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500 shadow-glow"
                  : "border-border bg-surface text-brand"
              )}
            >
              <Smartphone className="h-7 w-7" />
            </motion.span>
            <p className="mt-2 text-xs font-medium text-muted">User app</p>
          </div>

          {/* The pipe */}
          <div className="relative flex h-20 flex-1 flex-col items-center justify-center gap-2">
            <AnimatePresence mode="wait">
              {phase === "idle" && (
                <motion.p
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-muted"
                >
                  Not connected
                </motion.p>
              )}

              {phase === "handshake" && (
                <motion.div
                  key="hs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full text-center"
                >
                  <p className="text-[11px] font-medium text-brand">
                    Opening connection…
                  </p>
                  <div className="relative mt-2 h-1 w-full overflow-hidden rounded-full bg-border">
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full bg-brand"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.4 }}
                    />
                  </div>
                </motion.div>
              )}

              {phase === "open" && (
                <motion.div
                  key="open"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <div className="relative h-1.5 w-full rounded-full bg-emerald-500/30">
                    {!reduce && (
                      <>
                        <motion.span
                          className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-emerald-500"
                          animate={{ left: ["6%", "90%"], opacity: [0, 1, 0] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                        />
                        <motion.span
                          className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-brand"
                          animate={{ left: ["90%", "6%"], opacity: [0, 1, 0] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: 0.6,
                          }}
                        />
                      </>
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-3 text-[11px] font-medium text-emerald-500">
                    <span className="flex items-center gap-1">
                      <ArrowRight className="h-3 w-3" /> send
                    </span>
                    <span className="flex items-center gap-1">
                      <ArrowLeft className="h-3 w-3" /> receive
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Server */}
          <div className="text-center">
            <motion.span
              animate={
                phase === "open" && !reduce ? { scale: [1, 1.06, 1] } : {}
              }
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              className={cn(
                "grid h-16 w-16 place-items-center rounded-2xl border transition-colors",
                phase === "open"
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500 shadow-glow"
                  : "border-border bg-surface text-brand"
              )}
            >
              <Server className="h-7 w-7" />
            </motion.span>
            <p className="mt-2 text-xs font-medium text-muted">
              Real-time server
            </p>
          </div>
        </div>

        <AnimatePresence>
          {phase === "open" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-500"
            >
              <Check className="h-4 w-4 shrink-0" />
              Connected once — now either side can send the instant something
              happens. No more redialing.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          {
            t: "Connect once",
            b: "A single short handshake opens the line — not a request per update.",
          },
          {
            t: "Both directions",
            b: "The app can send and the server can push, over the same open connection.",
          },
          {
            t: "Instant & continuous",
            b: "Updates arrive the moment they happen, with nothing polling in a loop.",
          },
        ].map((c) => (
          <div key={c.t} className="rounded-xl border border-border bg-bg p-4">
            <p className="text-sm font-semibold">{c.t}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">
              {c.b}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">In plain terms: </span>
        WebSockets keep both sides continuously connected, so the screen can
        update by itself the moment anything changes.
      </p>
    </div>
  );
}
