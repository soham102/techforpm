"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Store, Snowflake, Sparkles, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "user" | "restaurant";

const GENERIC = ["Trending near you", "Most popular this week", "City favourites"];
const PERSONALIZED = [
  "Fiery Chicken Biryani — because you love spicy",
  "24×7 Midnight Diner — you order late",
  "₹99 Combos — matches your budget",
];

export function ColdStart() {
  const [tab, setTab] = useState<Tab>("user");
  const [interactions, setInteractions] = useState(0);
  const [boosted, setBoosted] = useState(false);

  const personalization = Math.min(100, interactions * 22);
  const personalized = interactions >= 3;

  return (
    <div className="space-y-5">
      <div className="inline-flex rounded-xl border border-border p-1">
        {[
          { id: "user" as Tab, label: "New user" },
          { id: "restaurant" as Tab, label: "New restaurant" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-lg px-4 py-1.5 text-xs font-medium transition-colors",
              tab === t.id
                ? "bg-brand text-white"
                : "text-muted hover:text-fg"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div>
        {tab === "user" ? (
          <motion.div
            key="user"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-surface p-6 shadow-soft"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
                  <UserPlus className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">
                    Priya just signed up
                  </p>
                  <p className="text-xs text-muted">
                    The system knows nothing about her yet.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInteractions((i) => Math.min(4, i + 1))}
                className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
              >
                Simulate an interaction
              </button>
            </div>

            <div className="mt-5">
              <div className="flex justify-between text-xs">
                <span className="font-medium">Personalization</span>
                <span className="tabular-nums text-muted">
                  {personalization}%
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-border">
                <motion.div
                  className="h-full rounded-full bg-brand"
                  animate={{ width: `${personalization}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-border bg-bg p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                {personalized ? (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-brand" /> Personalized
                    feed
                  </>
                ) : (
                  <>
                    <Snowflake className="h-3.5 w-3.5 text-sky-400" /> Cold
                    start — generic feed
                  </>
                )}
              </p>
              <div className="mt-3 space-y-2">
                {(personalized ? PERSONALIZED : GENERIC).map((r) => (
                  <motion.div
                    key={r}
                    layout
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                  >
                    {r}
                  </motion.div>
                ))}
              </div>
            </div>
            <p className="mt-3 text-xs text-muted">
              With no history the app must guess with safe, generic picks — and
              gets sharper with every interaction.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="rest"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-surface p-6 shadow-soft"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
                  <Store className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">
                    “Spice Hub” just joined QuickBite
                  </p>
                  <p className="text-xs text-muted">
                    0 orders, 0 ratings — nothing to rank it on.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setBoosted((b) => !b)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
                  boosted
                    ? "bg-emerald-500 text-white"
                    : "border border-border bg-bg"
                )}
              >
                <Rocket className="h-4 w-4" />
                {boosted ? "Discovery boost on" : "Give it a discovery boost"}
              </button>
            </div>

            <div className="mt-5 space-y-2">
              {(() => {
                const established = [
                  "Biryani House (4.6 ★, 12k orders)",
                  "Pizza Town (4.7 ★, 9k orders)",
                  "Burger Barn (4.5 ★, 8k orders)",
                ];
                const spiceHub = (
                  <motion.div
                    key="spicehub"
                    layout
                    transition={{ type: "spring", damping: 24, stiffness: 260 }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors",
                      boosted
                        ? "border-emerald-500/50 bg-emerald-500/10"
                        : "border-border bg-bg opacity-60"
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-6 w-6 place-items-center rounded-full text-xs font-bold",
                        boosted
                          ? "bg-emerald-500 text-white"
                          : "bg-border text-muted"
                      )}
                    >
                      {boosted ? "1" : "9"}
                    </span>
                    Spice Hub (new · no data)
                    {boosted && (
                      <span className="ml-auto rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
                        boosted
                      </span>
                    )}
                  </motion.div>
                );
                const rows = established.map((r, idx) => (
                  <motion.div
                    key={r}
                    layout
                    transition={{ type: "spring", damping: 24, stiffness: 260 }}
                    className="flex items-center gap-3 rounded-lg border border-border bg-bg px-3 py-2 text-sm"
                  >
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand">
                      {boosted ? idx + 2 : idx + 1}
                    </span>
                    {r}
                  </motion.div>
                ));
                return boosted ? [spiceHub, ...rows] : [...rows, spiceHub];
              })()}
            </div>
            <p className="mt-3 text-xs text-muted">
              Without orders to learn from, a great new restaurant stays
              invisible — unless the product deliberately gives it exposure.
            </p>
          </motion.div>
        )}
      </div>

      <p className="rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
        PM insight: cold start affects discovery and growth — new users and new
        supply both need a deliberate strategy, not just the algorithm.
      </p>
    </div>
  );
}
