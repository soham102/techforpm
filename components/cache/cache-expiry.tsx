"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, RotateCcw } from "lucide-react";
import { EXPIRY_STAGES } from "@/lib/caching";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

const MENU_OLD = ["Classic Burger", "Veg Wrap", "Truffle Fries", "Cola"];
const MENU_NEW = ["Classic Burger", "Veg Wrap", "Cola"]; // fries sold out

/**
 * Section 7 — cache expiry & stale data. Step through the lifecycle: the
 * menu is cached, the restaurant changes it, users briefly see the old
 * copy, then the cache expires and everyone is back in sync.
 */
export function CacheExpiry() {
  const [step, setStep] = useState(0);
  const stage = EXPIRY_STAGES[step];
  const Icon = getIcon(stage.icon);

  // What the database holds vs what the cached app shows, per step.
  const dbMenu = step >= 1 ? MENU_NEW : MENU_OLD;
  const cacheMenu = step >= 3 ? MENU_NEW : MENU_OLD;
  const isStale = step === 1 || step === 2;

  const next = () => setStep((s) => Math.min(s + 1, EXPIRY_STAGES.length - 1));
  const reset = () => setStep(0);
  const atEnd = step === EXPIRY_STAGES.length - 1;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      {/* timeline */}
      <div className="flex items-center gap-1.5">
        {EXPIRY_STAGES.map((s, i) => (
          <div key={s.id} className="flex flex-1 items-center">
            <div
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i <= step
                  ? s.tone === "stale" && i <= step
                    ? "bg-amber-500"
                    : "bg-brand"
                  : "bg-border"
              )}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* stage description */}
        <div>
          <span
            className={cn(
              "grid h-11 w-11 place-items-center rounded-xl",
              stage.tone === "fresh" && "bg-brand-soft text-brand",
              stage.tone === "stale" && "bg-amber-500/15 text-amber-500",
              stage.tone === "refresh" && "bg-emerald-500/15 text-emerald-500"
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-muted">
            Step {step + 1} of {EXPIRY_STAGES.length}
          </p>
          <h4 className="mt-1 text-base font-semibold">{stage.title}</h4>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {stage.body}
          </p>

          <div className="mt-5 flex gap-2">
            {!atEnd ? (
              <button
                onClick={next}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
              >
                Next step
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-brand/40"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Replay
              </button>
            )}
          </div>
        </div>

        {/* database vs cache view */}
        <div className="grid gap-4 sm:grid-cols-2">
          <MenuCard
            title="Database (source of truth)"
            items={dbMenu}
            tone="truth"
          />
          <MenuCard
            title="What users see (from cache)"
            items={cacheMenu}
            tone={isStale ? "stale" : "synced"}
            badge={
              isStale
                ? "Stale"
                : step >= 3
                ? "Refreshed"
                : "In sync"
            }
          />
        </div>
      </div>

      <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">PM insight: </span>
        Caching improves speed but may temporarily show outdated information.
        The “how stale is too stale?” trade-off is a product decision, not
        just an engineering one.
      </p>
    </div>
  );
}

function MenuCard({
  title,
  items,
  tone,
  badge,
}: {
  title: string;
  items: string[];
  tone: "truth" | "stale" | "synced";
  badge?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-bg p-4",
        tone === "stale" ? "border-amber-500/40" : "border-border"
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {title}
        </p>
        {badge && (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-bold",
              tone === "stale"
                ? "bg-amber-500/15 text-amber-500"
                : "bg-emerald-500/15 text-emerald-500"
            )}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1.5">
        <AnimatePresence mode="popLayout">
          {items.map((it) => (
            <motion.div
              key={it}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            >
              {it}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
