"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Server,
  Zap,
  Database,
  Check,
  X,
  Play,
} from "lucide-react";
import { cn, sleep } from "@/lib/utils";

type NodeId = "fe" | "be" | "cache" | "db";
type Phase = "idle" | "running";

const NODES: { id: NodeId; label: string; icon: typeof Smartphone }[] = [
  { id: "fe", label: "Frontend", icon: Smartphone },
  { id: "be", label: "Backend", icon: Server },
  { id: "cache", label: "Cache layer", icon: Zap },
  { id: "db", label: "Database", icon: Database },
];

/**
 * Section 3 — the big "aha". Run request #1 and the cache is empty, so the
 * request falls through to the database (CACHE MISS, slow). Run request #2
 * and the same data is already in the cache (CACHE HIT, instant).
 */
export function CacheFlowExplainer() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [active, setActive] = useState<NodeId | null>(null);
  const [cacheFilled, setCacheFilled] = useState(false);
  const [result, setResult] = useState<null | "miss" | "hit">(null);
  const [ranFirst, setRanFirst] = useState(false);

  async function runFirst() {
    setPhase("running");
    setResult(null);
    setActive("fe");
    await sleep(650);
    setActive("be");
    await sleep(650);
    setActive("cache");
    await sleep(700);
    setResult("miss"); // cache empty
    await sleep(800);
    setActive("db");
    await sleep(900);
    setCacheFilled(true); // response written back into cache
    setActive("cache");
    await sleep(700);
    setActive("be");
    await sleep(500);
    setActive("fe");
    await sleep(500);
    setActive(null);
    setRanFirst(true);
    setPhase("idle");
  }

  async function runSecond() {
    setPhase("running");
    setResult(null);
    setActive("fe");
    await sleep(280);
    setActive("be");
    await sleep(280);
    setActive("cache");
    await sleep(320);
    setResult("hit"); // found instantly
    await sleep(450);
    setActive("be");
    await sleep(220);
    setActive("fe");
    await sleep(220);
    setActive(null);
    setPhase("idle");
  }

  function reset() {
    setCacheFilled(false);
    setRanFirst(false);
    setResult(null);
    setActive(null);
  }

  const busy = phase === "running";

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      {/* architecture row */}
      <div className="flex items-center justify-between gap-1 sm:gap-3">
        {NODES.map((n, i) => {
          const Icon = n.icon;
          const isActive = active === n.id;
          const isCacheHit = n.id === "cache" && result === "hit";
          return (
            <div key={n.id} className="flex flex-1 items-center">
              <div className="flex flex-1 flex-col items-center gap-2">
                <motion.div
                  animate={
                    isActive
                      ? { scale: 1.08 }
                      : { scale: 1 }
                  }
                  className={cn(
                    "relative grid h-16 w-16 place-items-center rounded-2xl border transition-colors",
                    isCacheHit
                      ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-500"
                      : isActive
                      ? "border-brand/50 bg-brand-soft text-brand"
                      : "border-border bg-bg text-muted",
                    n.id === "cache" &&
                      cacheFilled &&
                      !isActive &&
                      "border-emerald-500/30 text-emerald-500"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {isActive && (
                    <motion.span
                      className="absolute inset-0 rounded-2xl"
                      animate={{ opacity: [0.7, 0, 0.7] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      style={{
                        boxShadow: isCacheHit
                          ? "0 0 0 4px rgb(16 185 129 / 0.3)"
                          : "0 0 0 4px rgb(var(--brand) / 0.25)",
                      }}
                    />
                  )}
                  {n.id === "cache" && (
                    <span
                      className={cn(
                        "absolute -bottom-2 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase",
                        cacheFilled
                          ? "bg-emerald-500/15 text-emerald-500"
                          : "bg-border text-muted"
                      )}
                    >
                      {cacheFilled ? "filled" : "empty"}
                    </span>
                  )}
                </motion.div>
                <span className="text-[11px] font-medium text-muted">
                  {n.label}
                </span>
              </div>
              {i < NODES.length - 1 && (
                <div className="relative mx-0.5 h-0.5 w-6 self-start sm:w-10 mt-8 bg-border">
                  {busy && (
                    <motion.span
                      className="absolute -top-[3px] h-2 w-2 rounded-full bg-brand"
                      animate={{ left: ["0%", "100%"] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* verdict banner */}
      <div className="mt-8 min-h-[64px]">
        <AnimatePresence mode="wait">
          {result === "miss" && (
            <motion.div
              key="miss"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-500/20 text-amber-500">
                <X className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-amber-500">
                  Cache miss
                </p>
                <p className="text-xs text-muted">
                  Not in the cache yet — fall through to the database, then
                  store the result on the way back. Slow, but only this once.
                </p>
              </div>
            </motion.div>
          )}
          {result === "hit" && (
            <motion.div
              key="hit"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative flex items-center gap-3 overflow-hidden rounded-xl border border-emerald-500/50 bg-emerald-500/10 px-4 py-3"
            >
              <motion.span
                className="absolute inset-0"
                animate={{ opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                style={{ boxShadow: "inset 0 0 32px rgb(16 185 129 / 0.35)" }}
              />
              <span className="relative grid h-8 w-8 place-items-center rounded-full bg-emerald-500/20 text-emerald-500">
                <Check className="h-4 w-4" />
              </span>
              <div className="relative">
                <p className="text-sm font-bold uppercase tracking-wide text-emerald-500">
                  Cache hit · fast response
                </p>
                <p className="text-xs text-muted">
                  Found instantly in the cache. The database was never even
                  touched.
                </p>
              </div>
            </motion.div>
          )}
          {result === null && (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-1 text-sm text-muted"
            >
              {ranFirst
                ? "The cache is now warm. Send the same request again and watch what changes."
                : "Send the very first request. The cache starts empty."}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={runFirst}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          <Play className="h-4 w-4" />
          Send 1st request
        </button>
        <button
          onClick={runSecond}
          disabled={busy || !ranFirst}
          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-500 transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
        >
          <Zap className="h-4 w-4" />
          Send 2nd request
        </button>
        <button
          onClick={reset}
          disabled={busy}
          className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:border-brand/40 disabled:opacity-50"
        >
          Empty the cache
        </button>
      </div>
    </div>
  );
}
