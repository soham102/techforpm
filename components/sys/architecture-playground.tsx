"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Play,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  Info,
} from "lucide-react";
import { PALETTE, FLOW_ORDER, type PaletteItem } from "@/lib/system-design";
import { getIcon } from "@/lib/icons";
import { cn, sleep } from "@/lib/utils";

const ESSENTIALS = ["frontend", "backend", "database"];

/**
 * Section 7 — tap a component to drop it onto the canvas, then run a
 * request and watch data flow through whatever you built.
 */
export function ArchitecturePlayground() {
  const [added, setAdded] = useState<PaletteItem[]>([]);
  const [flowIdx, setFlowIdx] = useState(-1);
  const [running, setRunning] = useState(false);

  const ordered = [...added].sort(
    (a, b) => FLOW_ORDER.indexOf(a.id) - FLOW_ORDER.indexOf(b.id)
  );
  const addedIds = added.map((a) => a.id);
  const missing = ESSENTIALS.filter((e) => !addedIds.includes(e));
  const valid = missing.length === 0;

  function add(item: PaletteItem) {
    if (addedIds.includes(item.id)) return;
    setAdded((a) => [...a, item]);
    setFlowIdx(-1);
  }
  function remove(id: string) {
    setAdded((a) => a.filter((x) => x.id !== id));
    setFlowIdx(-1);
  }
  function clear() {
    setAdded([]);
    setFlowIdx(-1);
  }

  async function run() {
    if (running || ordered.length === 0) return;
    setRunning(true);
    for (let i = 0; i < ordered.length; i++) {
      setFlowIdx(i);
      await sleep(650);
    }
    await sleep(500);
    setFlowIdx(-1);
    setRunning(false);
  }

  return (
    <div className="space-y-5">
      {/* palette */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Components — tap to add
        </p>
        <div className="flex flex-wrap gap-2">
          {PALETTE.map((p) => {
            const Icon = getIcon(p.icon);
            const used = addedIds.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => add(p)}
                disabled={used}
                title={p.hint}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
                  used
                    ? "border-border bg-bg text-muted opacity-50"
                    : "border-border bg-surface hover:-translate-y-0.5 hover:border-brand/40"
                )}
              >
                <Icon className="h-4 w-4 text-brand" />
                {p.label}
                {!used && <Plus className="h-3 w-3 text-muted" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* canvas */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Your QuickBite architecture</p>
          <div className="flex gap-2">
            <button
              onClick={run}
              disabled={running || ordered.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              <Play className="h-3.5 w-3.5" />
              Run a request
            </button>
            <button
              onClick={clear}
              disabled={added.length === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-brand/40 disabled:opacity-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>
        </div>

        <div className="mt-5 min-h-[120px] rounded-xl border border-dashed border-border bg-bg p-5">
          {ordered.length === 0 ? (
            <p className="grid h-[88px] place-items-center text-center text-sm text-muted">
              Empty canvas — add a Frontend, Backend and Database to build a
              working system.
            </p>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <AnimatePresence>
                {ordered.map((node, i) => {
                  const Icon = getIcon(node.icon);
                  const lit = flowIdx >= i;
                  const current = running && flowIdx === i;
                  return (
                    <motion.div
                      key={node.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <div
                        className={cn(
                          "group relative flex flex-col items-center gap-1.5 rounded-xl border px-4 py-3 transition-colors",
                          current
                            ? "border-brand/60 bg-brand-soft shadow-glow"
                            : lit
                            ? "border-emerald-500/40 bg-emerald-500/10"
                            : "border-border bg-surface"
                        )}
                      >
                        <button
                          onClick={() => remove(node.id)}
                          aria-label={`Remove ${node.label}`}
                          className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full border border-border bg-elevated text-muted opacity-0 transition-opacity hover:text-rose-500 group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <Icon
                          className={cn(
                            "h-5 w-5",
                            current
                              ? "text-brand"
                              : lit
                              ? "text-emerald-500"
                              : "text-muted"
                          )}
                        />
                        <span className="text-[11px] font-medium">
                          {node.label}
                        </span>
                      </div>
                      {i < ordered.length - 1 && (
                        <motion.span
                          animate={{
                            color: lit
                              ? "rgb(16 185 129)"
                              : "rgb(var(--muted))",
                          }}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </motion.span>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* validity status */}
        <div
          className={cn(
            "mt-4 flex items-start gap-2 rounded-xl border p-3 text-sm",
            valid
              ? "border-emerald-500/30 bg-emerald-500/5"
              : "border-border bg-bg"
          )}
        >
          {valid ? (
            <>
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <p>
                That's a working setup — users reach a backend that can store
                and return data. Add a load balancer or cache to make it
                faster and more resilient.
              </p>
            </>
          ) : (
            <>
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <p>
                Still missing:{" "}
                <span className="font-semibold capitalize">
                  {missing.join(", ")}
                </span>
                . A request can't complete a useful round trip without these.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
