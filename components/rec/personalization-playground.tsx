"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Users } from "lucide-react";
import {
  FEED,
  PERSONA_TOGGLES,
  scoreFeedItem,
  type Trait,
} from "@/lib/recommendations";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

const PRESETS: { name: string; traits: Trait[] }[] = [
  { name: "Spicy night owl", traits: ["spicy", "lateNight"] },
  { name: "Budget comedy fan", traits: ["budget", "comedy"] },
  { name: "Healthy action lover", traits: ["healthy", "action"] },
];

const PLATFORM_COLOR: Record<string, string> = {
  QuickBite: "text-brand",
  Netflix: "text-rose-500",
  YouTube: "text-red-500",
  Spotify: "text-emerald-500",
};

export function PersonalizationPlayground() {
  const [active, setActive] = useState<Set<Trait>>(new Set());

  function toggle(t: Trait) {
    setActive((prev) => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
  }

  function applyPreset(traits: Trait[]) {
    setActive(new Set(traits));
  }

  const ranked = [...FEED]
    .map((it) => ({ it, score: scoreFeedItem(it, active) }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
      {/* controls */}
      <div className="space-y-4 rounded-2xl border border-border bg-surface p-5 shadow-soft">
        <div>
          <p className="text-sm font-semibold">This user…</p>
          <p className="mt-1 text-xs text-muted">
            Flip a trait and watch the feed re-rank instantly.
          </p>
        </div>

        <div className="space-y-2">
          {PERSONA_TOGGLES.map((p) => {
            const Icon = getIcon(p.icon);
            const on = active.has(p.trait);
            return (
              <button
                key={p.trait}
                onClick={() => toggle(p.trait)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-xs font-medium transition-colors",
                  on
                    ? "border-brand/50 bg-brand-soft text-brand"
                    : "border-border bg-bg text-muted hover:text-fg"
                )}
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {p.label}
                </span>
                <span
                  className={cn(
                    "relative h-4 w-7 rounded-full transition-colors",
                    on ? "bg-brand" : "bg-border"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all",
                      on ? "left-3.5" : "left-0.5"
                    )}
                  />
                </span>
              </button>
            );
          })}
        </div>

        <div>
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
            <Users className="h-3 w-3" />
            Try a preset user
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => applyPreset(p.traits)}
                className="rounded-full border border-border bg-bg px-3 py-1 text-[11px] font-medium transition-colors hover:border-brand/40 hover:text-brand"
              >
                {p.name}
              </button>
            ))}
            <button
              onClick={() => setActive(new Set())}
              className="rounded-full border border-dashed border-border px-3 py-1 text-[11px] text-muted transition-colors hover:text-fg"
            >
              Clear (generic feed)
            </button>
          </div>
        </div>
      </div>

      {/* live feed */}
      <div>
        <p className="mb-3 flex items-center gap-1.5 text-xs text-muted">
          <Sparkles className="h-3.5 w-3.5 text-brand" />
          {active.size === 0
            ? "No personalization — everyone sees the same generic order"
            : `Personalized feed (${active.size} signal${
                active.size === 1 ? "" : "s"
              }) — reshuffling live`}
        </p>
        <div className="space-y-2.5">
          <AnimatePresence>
            {ranked.map(({ it, score }, i) => (
              <motion.div
                key={it.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 26, stiffness: 280 }}
                className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3.5 shadow-soft"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{it.title}</p>
                  <p
                    className={cn(
                      "text-[11px]",
                      PLATFORM_COLOR[it.platform]
                    )}
                  >
                    {it.platform} · {it.kind}
                  </p>
                </div>
                <div className="w-24 shrink-0">
                  <div className="flex justify-between text-[10px] text-muted">
                    <span>match</span>
                    <span className="font-semibold">{score}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-border">
                    <motion.div
                      className={cn(
                        "h-full rounded-full",
                        score >= 70
                          ? "bg-emerald-500"
                          : score >= 45
                          ? "bg-amber-500"
                          : "bg-muted"
                      )}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
