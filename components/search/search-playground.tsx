"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  Flame,
  Clock,
  X,
  SearchX,
  Lightbulb,
} from "lucide-react";
import {
  RESTAURANTS,
  QUERIES,
  TRENDING,
  TYPOS,
  DEFAULT_WEIGHTS,
  scoreRestaurant,
  type Restaurant,
} from "@/lib/search";
import { RestaurantCard } from "./restaurant-card";
import { sleep } from "@/lib/utils";

type Status = "idle" | "loading" | "results" | "empty";

export function SearchPlayground() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [results, setResults] = useState<Restaurant[]>([]);
  const [submitted, setSubmitted] = useState("");
  const [typo, setTypo] = useState<{ correct: string; confidence: number } | null>(
    null
  );
  const [recent, setRecent] = useState<string[]>([]);

  const suggestions = useMemo(() => {
    if (!text.trim()) return [];
    const q = text.toLowerCase();
    const fromQueries = QUERIES.filter((x) =>
      x.term.toLowerCase().includes(q)
    ).map((x) => x.term);
    const fromNames = RESTAURANTS.filter((r) =>
      r.name.toLowerCase().includes(q)
    ).map((r) => r.name);
    return Array.from(new Set([...fromQueries, ...fromNames])).slice(0, 4);
  }, [text]);

  function rankFor(cuisineTerm: string): Restaurant[] {
    const match = QUERIES.find(
      (x) => x.term.toLowerCase() === cuisineTerm.toLowerCase()
    );
    const pool = match
      ? RESTAURANTS.filter((r) => r.cuisine === match.cuisine)
      : RESTAURANTS.filter((r) =>
          r.name.toLowerCase().includes(cuisineTerm.toLowerCase())
        );
    return [...pool].sort(
      (a, b) =>
        scoreRestaurant(b, DEFAULT_WEIGHTS) -
        scoreRestaurant(a, DEFAULT_WEIGHTS)
    );
  }

  async function runSearch(raw: string) {
    const term = raw.trim();
    if (!term) return;
    setText(term);
    setSubmitted(term);
    setStatus("loading");
    setTypo(null);

    const lower = term.toLowerCase();
    const correction = TYPOS[lower];
    await sleep(750);

    if (correction) {
      setTypo(correction);
    }

    const lookup = correction ? correction.correct : term;
    const ranked = rankFor(lookup);

    setRecent((r) => [term, ...r.filter((x) => x !== term)].slice(0, 4));

    if (ranked.length === 0) {
      setResults(
        [...RESTAURANTS].sort((a, b) => b.popularity - a.popularity).slice(0, 3)
      );
      setStatus("empty");
    } else {
      setResults(ranked);
      setStatus("results");
    }
  }

  return (
    <div className="space-y-5">
      {/* search bar */}
      <div className="relative">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5 shadow-soft focus-within:border-brand/50">
          <Search className="h-5 w-5 text-muted" />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch(text)}
            placeholder="Search QuickBite — try Pizza, Burger, Biryani, Sushi…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
          {text && (
            <button
              onClick={() => {
                setText("");
                setStatus("idle");
              }}
              className="text-muted hover:text-fg"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => runSearch(text)}
            className="rounded-xl bg-brand px-4 py-1.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
          >
            Search
          </button>
        </div>

        {/* live suggestions */}
        <AnimatePresence>
          {suggestions.length > 0 && status !== "loading" && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-border bg-elevated shadow-soft-lg"
            >
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => runSearch(s)}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-surface"
                >
                  <Search className="h-3.5 w-3.5 text-muted" />
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* trending + recent */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 font-semibold text-muted">
          <Flame className="h-3.5 w-3.5 text-amber-500" />
          Trending
        </span>
        {TRENDING.map((t) => (
          <button
            key={t}
            onClick={() => runSearch(t)}
            className="rounded-full border border-border bg-surface px-3 py-1 font-medium transition-colors hover:border-brand/40 hover:text-brand"
          >
            {t}
          </button>
        ))}
        {recent.length > 0 && (
          <>
            <span className="ml-2 inline-flex items-center gap-1 font-semibold text-muted">
              <Clock className="h-3.5 w-3.5" />
              Recent
            </span>
            {recent.map((t) => (
              <button
                key={t}
                onClick={() => runSearch(t)}
                className="rounded-full border border-dashed border-border px-3 py-1 text-muted transition-colors hover:text-fg"
              >
                {t}
              </button>
            ))}
          </>
        )}
      </div>

      {/* typo banner */}
      <AnimatePresence>
        {typo && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm"
          >
            <span>
              Showing results for <strong>{typo.correct}</strong>. Did you mean{" "}
              <button
                onClick={() => runSearch(typo.correct)}
                className="font-semibold text-brand underline-offset-2 hover:underline"
              >
                {typo.correct}
              </button>
              ?
            </span>
            <span className="shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
              {typo.confidence}% sure
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* results area */}
      <div className="min-h-[180px]">
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.p
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid h-44 place-items-center text-sm text-muted"
            >
              Search something to see how QuickBite finds and ranks results.
            </motion.p>
          )}

          {status === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4"
                >
                  <div className="h-12 w-12 animate-pulse rounded-xl bg-border" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/3 animate-pulse rounded bg-border" />
                    <div className="h-2.5 w-2/3 animate-pulse rounded bg-border" />
                  </div>
                </div>
              ))}
              <p className="flex items-center justify-center gap-2 pt-1 text-xs text-muted">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Searching the index for “{submitted}”…
              </p>
            </motion.div>
          )}

          {status === "empty" && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="rounded-2xl border border-dashed border-border bg-bg p-6 text-center">
                <SearchX className="mx-auto h-7 w-7 text-muted" />
                <p className="mt-3 text-sm font-medium">
                  No exact matches for “{submitted}”
                </p>
                <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted">
                  <Lightbulb className="h-3.5 w-3.5 text-brand" />
                  A good empty state still keeps users moving — here are
                  popular picks instead:
                </p>
              </div>
              <div className="mt-4 space-y-3">
                {results.map((r) => (
                  <RestaurantCard key={r.id} r={r} />
                ))}
              </div>
            </motion.div>
          )}

          {status === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <p className="text-xs text-muted">
                {results.length} results for “{submitted}” — ranked best-match
                first
              </p>
              {results.map((r, i) => (
                <RestaurantCard
                  key={r.id}
                  r={r}
                  rank={i + 1}
                  score={scoreRestaurant(r, DEFAULT_WEIGHTS)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
