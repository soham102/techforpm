"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, X, Repeat, Flame } from "lucide-react";
import { REC_FAILURES, type RecFailure } from "@/lib/recommendations";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function RecFailures() {
  const [active, setActive] = useState<RecFailure>(REC_FAILURES[0]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {REC_FAILURES.map((f) => {
          const Icon = getIcon(f.icon);
          const on = f.id === active.id;
          return (
            <button
              key={f.id}
              onClick={() => setActive(f)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors",
                on
                  ? "border-brand/50 bg-brand-soft text-brand"
                  : "border-border bg-surface text-muted hover:text-fg"
              )}
            >
              <Icon className="h-4 w-4" />
              {f.name}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {active.id === "irrelevant" && (
              <>
                <p className="text-sm text-muted">
                  Priya marked herself <strong>vegetarian</strong> — yet her
                  feed:
                </p>
                <div className="mt-3 space-y-2">
                  {[
                    "Mutton Seekh Specials",
                    "Butter Chicken Combo",
                    "Fish Fry House",
                  ].map((r) => (
                    <div
                      key={r}
                      className="flex items-center justify-between rounded-lg border border-rose-500/30 bg-rose-500/5 px-3 py-2 text-sm"
                    >
                      {r}
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500">
                        <X className="h-3 w-3" /> not for this user
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {active.id === "bubble" && (
              <>
                <p className="text-sm text-muted">
                  The user once watched two comedies. Now the entire feed is:
                </p>
                <div className="mt-3 space-y-2">
                  {["Comedy Special #1", "Comedy Clips", "More Comedy", "Comedy Podcast", "Comedy Again"].map(
                    (r) => (
                      <div
                        key={r}
                        className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-sm"
                      >
                        <Repeat className="h-3.5 w-3.5 text-amber-500" />
                        {r}
                      </div>
                    )
                  )}
                </div>
                <p className="mt-3 text-xs text-muted">
                  Nothing new ever surfaces — the user stops discovering and,
                  eventually, stops opening the app.
                </p>
              </>
            )}

            {active.id === "viral" && (
              <>
                <p className="text-sm text-muted">
                  One viral item soaks up all the exposure:
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 rounded-lg border border-brand/40 bg-brand-soft px-3 py-5 text-base font-bold text-brand">
                    <Flame className="h-5 w-5" />
                    “The Viral Cheese Burst” — everywhere
                  </div>
                  {["Tiny Family Kitchen", "Local Tiffin Service", "New Artisan Bakery"].map(
                    (r) => (
                      <div
                        key={r}
                        className="rounded-lg border border-border bg-bg px-3 py-1.5 text-xs text-muted opacity-60"
                      >
                        {r} — barely shown
                      </div>
                    )
                  )}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-5 flex gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <p className="text-sm leading-relaxed">{active.insight}</p>
        </div>
      </div>
    </div>
  );
}
