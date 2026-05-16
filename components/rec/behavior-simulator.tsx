"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, RotateCcw, Sparkles, Activity } from "lucide-react";
import {
  BEHAVIOR_ACTIONS,
  TRAIT_LABEL,
  FEED,
  scoreFeedItem,
  type Trait,
} from "@/lib/recommendations";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

const ZERO: Record<Trait, number> = {
  spicy: 0,
  budget: 0,
  lateNight: 0,
  healthy: 0,
  comedy: 0,
  action: 0,
};

interface Signal {
  id: number;
  label: string;
}

export function BehaviorSimulator() {
  const [scores, setScores] = useState<Record<Trait, number>>({ ...ZERO });
  const [signals, setSignals] = useState<Signal[]>([]);
  const [n, setN] = useState(0);

  const active = useMemo(() => {
    const set = new Set<Trait>();
    (Object.keys(scores) as Trait[]).forEach((t) => {
      if (scores[t] > 0) set.add(t);
    });
    return set;
  }, [scores]);

  const topPick = useMemo(() => {
    if (active.size === 0) return null;
    return [...FEED]
      .map((it) => ({ it, s: scoreFeedItem(it, active) }))
      .sort((a, b) => b.s - a.s)[0];
  }, [active]);

  const maxScore = Math.max(1, ...Object.values(scores));

  function act(label: string, trait: Trait) {
    setScores((s) => ({ ...s, [trait]: s[trait] + 1 }));
    setN((x) => x + 1);
    setSignals((sg) => [{ id: n + 1, label }, ...sg].slice(0, 6));
  }

  function reset() {
    setScores({ ...ZERO });
    setSignals([]);
    setN(0);
  }

  return (
    <div className="space-y-5">
      {/* persona */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-brand text-sm font-semibold text-white">
            RS
          </span>
          <div>
            <p className="text-sm font-semibold">Rahul Sharma</p>
            <p className="flex items-center gap-1 text-xs text-muted">
              <MapPin className="h-3 w-3" />
              Bangalore · new account, no profile yet
            </p>
          </div>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-brand/40"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset profile
        </button>
      </div>

      {/* actions */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Do things as Rahul — each action is a signal
        </p>
        <div className="flex flex-wrap gap-2">
          {BEHAVIOR_ACTIONS.map((a) => {
            const Icon = getIcon(a.icon);
            return (
              <button
                key={a.id}
                onClick={() => act(a.label, a.trait)}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-sm font-medium shadow-soft transition-transform hover:-translate-y-0.5 hover:border-brand/40"
              >
                <Icon className="h-4 w-4 text-brand" />
                {a.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
        {/* learned profile */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <p className="flex items-center gap-1.5 text-sm font-semibold">
            <Activity className="h-4 w-4 text-brand" />
            Learned profile
          </p>
          <div className="mt-4 space-y-3">
            {(Object.keys(TRAIT_LABEL) as Trait[]).map((t) => (
              <div key={t}>
                <div className="flex justify-between text-xs">
                  <span
                    className={cn(
                      "font-medium",
                      scores[t] > 0 ? "text-fg" : "text-muted"
                    )}
                  >
                    {TRAIT_LABEL[t]}
                  </span>
                  <span className="tabular-nums text-muted">
                    {scores[t]}
                  </span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-border">
                  <motion.div
                    className="h-full rounded-full bg-brand"
                    animate={{
                      width: `${(scores[t] / maxScore) * 100}%`,
                    }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-border bg-bg p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              Top pick for Rahul right now
            </p>
            <AnimatePresence mode="wait">
              {topPick ? (
                <motion.div
                  key={topPick.it.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-2 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {topPick.it.title}
                    </p>
                    <p className="text-[11px] text-muted">
                      {topPick.it.platform} · {topPick.it.kind}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-500">
                    {topPick.s}% match
                  </span>
                </motion.div>
              ) : (
                <motion.p
                  key="none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-xs text-muted"
                >
                  No signals yet — recommendations are generic until Rahul
                  does something.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* signal stream */}
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Behaviour signals
          </p>
          <div className="mt-3 space-y-2">
            <AnimatePresence initial={false}>
              {signals.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-muted"
                >
                  Every tap Rahul makes is collected here.
                </motion.p>
              )}
              {signals.map((s) => (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-lg border border-border bg-bg px-3 py-2 text-xs"
                >
                  {s.label}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
