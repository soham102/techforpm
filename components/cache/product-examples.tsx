"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Store, Flame, Play, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Item {
  title: string;
  sub: string;
}

interface Example {
  id: string;
  name: string;
  icon: typeof Sparkles;
  scenario: string;
  withoutMs: number;
  withMs: number;
  insight: string;
  items: Item[];
}

const EXAMPLES: Example[] = [
  {
    id: "instagram",
    name: "Instagram feed",
    icon: Sparkles,
    scenario:
      "A user opens Instagram, closes it, and opens it again a minute later.",
    withoutMs: 2200,
    withMs: 120,
    insight:
      "Fast feeds increase engagement — people scroll more when it never makes them wait.",
    items: [
      { title: "@arjun_clicks", sub: "Posted a photo · 2m" },
      { title: "@meera.travels", sub: "New reel · 5m" },
      { title: "@blr.foodie", sub: "Posted a photo · 12m" },
      { title: "@thecityruns", sub: "New reel · 20m" },
    ],
  },
  {
    id: "swiggy",
    name: "Swiggy restaurant list",
    icon: Store,
    scenario:
      "The same popular restaurants are opened by thousands of users every evening.",
    withoutMs: 1800,
    withMs: 110,
    insight:
      "Frequently viewed restaurants are cached once and served fast to everyone after.",
    items: [
      { title: "Burger Barn", sub: "Burgers · ★4.5 · 25 min" },
      { title: "Pizza Town", sub: "Pizza · ★4.7 · 30 min" },
      { title: "Curry House", sub: "Indian · ★4.3 · 35 min" },
      { title: "Sushi Bay", sub: "Japanese · ★4.6 · 40 min" },
      { title: "Wrap It Up", sub: "Healthy · ★4.2 · 20 min" },
    ],
  },
  {
    id: "ipl",
    name: "IPL ticket booking",
    icon: Flame,
    scenario:
      "Millions of users hit the ticket page at the exact same second when the final goes live.",
    withoutMs: 2600,
    withMs: 150,
    insight:
      "Caching helps apps survive traffic spikes — the page stays up instead of melting down.",
    items: [
      { title: "Premium Pavilion", sub: "Block A · ₹8,000" },
      { title: "East Stand", sub: "Block D · ₹4,500" },
      { title: "General Admission", sub: "Open · ₹1,200" },
    ],
  },
];

/**
 * Section 5 — three real product scenarios. Replay loads the same content
 * in two panels that race independently: the cached panel fills almost
 * instantly while the uncached panel keeps shimmering, then catches up.
 */
export function ProductExamples() {
  const [sel, setSel] = useState<Example>(EXAMPLES[0]);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [withReady, setWithReady] = useState(true);
  const [withoutReady, setWithoutReady] = useState(true);

  function replay(ex: Example) {
    if (running) return;
    setRunning(true);
    setStarted(true);
    setWithReady(false);
    setWithoutReady(false);
    // the cached panel answers from a nearby copy — almost instant
    setTimeout(() => setWithReady(true), ex.withMs);
    // the uncached panel has to go all the way to the database every time
    setTimeout(() => setWithoutReady(true), ex.withoutMs);
    setTimeout(() => setRunning(false), ex.withoutMs + 700);
  }

  function pick(ex: Example) {
    if (running) return;
    setSel(ex);
    setStarted(false);
    setWithReady(true);
    setWithoutReady(true);
  }

  const done = started && !running;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => {
          const Icon = ex.icon;
          const active = ex.id === sel.id;
          return (
            <button
              key={ex.id}
              onClick={() => pick(ex)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-brand/50 bg-brand-soft text-brand"
                  : "border-border bg-surface hover:border-brand/30"
              )}
            >
              <Icon className="h-4 w-4" />
              {ex.name}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm text-muted">{sel.scenario}</p>
          <button
            onClick={() => replay(sel)}
            disabled={running}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <Play className="h-4 w-4" />
            {running ? "Loading…" : "Replay both"}
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Panel
            title="Without cache"
            tone="slow"
            icon={sel.icon}
            items={sel.items}
            ready={withoutReady}
            ms={sel.withoutMs}
          />
          <Panel
            title="With cache"
            tone="fast"
            icon={sel.icon}
            items={sel.items}
            ready={withReady}
            ms={sel.withMs}
          />
        </div>

        <AnimatePresence>
          {done && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm"
            >
              <span className="font-semibold text-brand">PM insight: </span>
              {sel.insight}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Panel({
  title,
  tone,
  icon: Icon,
  items,
  ready,
  ms,
}: {
  title: string;
  tone: "slow" | "fast";
  icon: typeof Sparkles;
  items: Item[];
  ready: boolean;
  ms: number;
}) {
  const isFast = tone === "fast";
  return (
    <div
      className={cn(
        "rounded-2xl border bg-bg p-4",
        isFast ? "border-emerald-500/30" : "border-border"
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-xs font-bold uppercase tracking-wide",
            isFast ? "text-emerald-500" : "text-amber-500"
          )}
        >
          {title}
        </span>
        <span className="flex items-center gap-1.5 text-[11px] tabular-nums text-muted">
          {!ready && (
            <span
              className={cn(
                "h-1.5 w-1.5 animate-pulse rounded-full",
                isFast ? "bg-emerald-500" : "bg-amber-500"
              )}
            />
          )}
          {ready
            ? ms < 1000
              ? `${ms}ms`
              : `${(ms / 1000).toFixed(1)}s`
            : "loading…"}
        </span>
      </div>

      <div className="mt-3 space-y-2">
        {items.map((it, i) =>
          ready ? (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isFast ? i * 0.04 : i * 0.1 }}
              className="flex items-center gap-2.5 rounded-lg border border-border bg-surface px-2.5 py-2"
            >
              <span
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-md",
                  isFast
                    ? "bg-emerald-500/15 text-emerald-500"
                    : "bg-brand-soft text-brand"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold leading-tight">
                  {it.title}
                </p>
                <p className="truncate text-[11px] text-muted">{it.sub}</p>
              </div>
              <Check
                className={cn(
                  "ml-auto h-3.5 w-3.5 shrink-0",
                  isFast ? "text-emerald-500" : "text-muted"
                )}
              />
            </motion.div>
          ) : (
            <div
              key={i}
              className="flex items-center gap-2.5 rounded-lg border border-border bg-surface px-2.5 py-2"
            >
              <div className="h-7 w-7 shrink-0 rounded-md bg-border" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <motion.div
                  className="h-2 w-2/3 rounded-full bg-border"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{
                    duration: 1.1,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
                <motion.div
                  className="h-2 w-2/5 rounded-full bg-border"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{
                    duration: 1.1,
                    repeat: Infinity,
                    delay: i * 0.1 + 0.2,
                  }}
                />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
