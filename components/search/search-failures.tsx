"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, SearchX, Lightbulb, Play } from "lucide-react";
import {
  SEARCH_FAILURES,
  RESTAURANTS,
  type SearchFailure,
} from "@/lib/search";
import { getIcon } from "@/lib/icons";
import { RestaurantCard } from "./restaurant-card";
import { cn, sleep } from "@/lib/utils";

const PIZZA = RESTAURANTS.filter((r) => r.cuisine === "Pizza");
const WRONG = RESTAURANTS.filter((r) => r.cuisine !== "Pizza").slice(0, 3);
const FALLBACK = [...RESTAURANTS]
  .sort((a, b) => b.popularity - a.popularity)
  .slice(0, 3);

type Stage = "idle" | "running" | "done";

export function SearchFailures() {
  const [active, setActive] = useState<SearchFailure>(SEARCH_FAILURES[0]);
  const [stage, setStage] = useState<Stage>("idle");

  async function run() {
    setStage("running");
    await sleep(active.id === "slow" ? 4000 : 700);
    setStage("done");
  }

  function select(f: SearchFailure) {
    setActive(f);
    setStage("idle");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {SEARCH_FAILURES.map((f) => {
          const Icon = getIcon(f.icon);
          const on = f.id === active.id;
          return (
            <button
              key={f.id}
              onClick={() => select(f)}
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            Search <span className="font-semibold text-fg">“Pizza”</span> with
            this problem active:
          </p>
          <button
            onClick={run}
            disabled={stage === "running"}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {stage === "running" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Run scenario
          </button>
        </div>

        <div className="mt-5 min-h-[180px]">
          <AnimatePresence mode="wait">
            {stage === "idle" && (
              <motion.p
                key="i"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid h-44 place-items-center text-sm text-muted"
              >
                Press “Run scenario” to feel what the user feels.
              </motion.p>
            )}

            {stage === "running" && (
              <motion.div
                key="r"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid h-44 place-items-center"
              >
                <div className="flex flex-col items-center gap-2 text-muted">
                  <Loader2 className="h-6 w-6 animate-spin text-brand" />
                  <p className="text-xs">
                    {active.id === "slow"
                      ? "Still loading results… (4s and counting)"
                      : "Searching…"}
                  </p>
                </div>
              </motion.div>
            )}

            {stage === "done" && (
              <motion.div
                key="d"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {active.id === "slow" &&
                  PIZZA.map((r, i) => (
                    <RestaurantCard key={r.id} r={r} rank={i + 1} />
                  ))}

                {active.id === "irrelevant" && (
                  <>
                    <p className="text-xs text-rose-500">
                      Results for “Pizza” — but none of these are pizza:
                    </p>
                    {WRONG.map((r) => (
                      <div
                        key={r.id}
                        className="rounded-2xl ring-1 ring-rose-500/40"
                      >
                        <RestaurantCard r={r} />
                      </div>
                    ))}
                  </>
                )}

                {active.id === "empty" && (
                  <>
                    <div className="rounded-2xl border border-dashed border-border bg-bg p-6 text-center">
                      <SearchX className="mx-auto h-7 w-7 text-muted" />
                      <p className="mt-3 text-sm font-medium">
                        No results for “Pizza”
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        A dead end loses the user. A good empty state offers a
                        way forward:
                      </p>
                    </div>
                    {FALLBACK.map((r) => (
                      <RestaurantCard key={r.id} r={r} />
                    ))}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 flex gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <p className="text-sm leading-relaxed">{active.insight}</p>
        </div>
      </div>
    </div>
  );
}
