"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Store, Coffee, ArrowRight } from "lucide-react";
import { ANALOGY_PAIRS } from "@/lib/caching";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

type Mode = "without" | "with";

/**
 * Section 1 — the coffee/supermarket story. A mode toggle animates the
 * morning routine without a cache (long trip every time) vs with a cache
 * (copy kept nearby), then maps each part back to the technical term.
 */
export function CacheAnalogyMap() {
  const [mode, setMode] = useState<Mode>("without");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Same person, same coffee, every morning. Watch what changes when a
          copy lives nearby.
        </p>
        <div className="inline-flex rounded-xl border border-border bg-bg p-1">
          {(["without", "with"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors",
                mode === m
                  ? "bg-brand text-white shadow-soft"
                  : "text-muted hover:text-fg"
              )}
            >
              {m === "without" ? "Without cache" : "With cache"}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
        <AnimatePresence mode="wait">
          {mode === "without" ? (
            <motion.div
              key="without"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <Trip
                from={{ icon: Home, label: "Home" }}
                to={{ icon: Store, label: "Supermarket across town" }}
                distance="long"
                caption="Every single morning: walk all the way to the supermarket, buy coffee, walk back. Correct — but slow and repetitive."
                tone="slow"
              />
            </motion.div>
          ) : (
            <motion.div
              key="with"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <Trip
                from={{ icon: Home, label: "Home" }}
                to={{ icon: Coffee, label: "Coffee jar on the shelf" }}
                distance="short"
                caption="The first trip filled a jar at home. Now every morning the coffee is already within reach — same coffee, almost no wait."
                tone="fast"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {ANALOGY_PAIRS.map((p, i) => {
          const Icon = getIcon(p.icon);
          return (
            <motion.div
              key={p.cache}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-surface p-5 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{p.cache}</p>
                  <p className="flex items-center gap-1.5 text-xs text-muted">
                    <ArrowRight className="h-3 w-3 shrink-0" />
                    {p.real}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {p.plain}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Trip({
  from,
  to,
  distance,
  caption,
  tone,
}: {
  from: { icon: typeof Home; label: string };
  to: { icon: typeof Home; label: string };
  distance: "long" | "short";
  caption: string;
  tone: "slow" | "fast";
}) {
  const FromIcon = from.icon;
  const ToIcon = to.icon;
  const isFast = tone === "fast";

  return (
    <div>
      <div
        className={cn(
          "relative flex items-center justify-between gap-4",
          distance === "short" && "mx-auto max-w-xs"
        )}
      >
        <Node icon={<FromIcon className="h-6 w-6" />} label={from.label} />

        <div className="relative flex-1">
          <div className="h-1 rounded-full bg-border" />
          <motion.span
            aria-hidden
            className={cn(
              "absolute top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-white shadow-soft",
              isFast ? "bg-emerald-500" : "bg-brand"
            )}
            initial={{ left: "0%" }}
            animate={{ left: ["0%", "100%", "0%"] }}
            transition={{
              duration: isFast ? 1 : 3.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Coffee className="h-3.5 w-3.5" />
          </motion.span>
        </div>

        <Node
          icon={<ToIcon className="h-6 w-6" />}
          label={to.label}
          accent={isFast}
        />
      </div>

      <div
        className={cn(
          "mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold",
          isFast ? "text-emerald-500" : "text-amber-500"
        )}
      >
        <span
          className={cn(
            "rounded-full px-2.5 py-1",
            isFast ? "bg-emerald-500/10" : "bg-amber-500/10"
          )}
        >
          {isFast ? "≈ instant" : "slow round trip"}
        </span>
        <span
          className={cn(
            "rounded-full px-2.5 py-1",
            isFast ? "bg-emerald-500/10" : "bg-amber-500/10"
          )}
        >
          {isFast ? "repeated for free" : "repeated every morning"}
        </span>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-muted">{caption}</p>
    </div>
  );
}

function Node({
  icon,
  label,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="flex w-24 flex-col items-center gap-2 text-center">
      <span
        className={cn(
          "grid h-14 w-14 place-items-center rounded-2xl border",
          accent
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
            : "border-border bg-bg text-brand"
        )}
      >
        {icon}
      </span>
      <span className="text-[11px] font-medium leading-tight text-muted">
        {label}
      </span>
    </div>
  );
}
