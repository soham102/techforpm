"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SpellCheck, ArrowRight, Check, Loader2 } from "lucide-react";
import { TYPOS, RESTAURANTS, QUERIES } from "@/lib/search";
import { cn, sleep } from "@/lib/utils";

const SAMPLES = ["piza", "burgr", "biryanii", "suchi"];
type Phase = "idle" | "analyzing" | "done";

export function TypoCorrection() {
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<{
    typed: string;
    correct: string;
    confidence: number;
    count: number;
  } | null>(null);

  async function check(raw: string) {
    const term = raw.trim().toLowerCase();
    if (!term || phase === "analyzing") return;
    setInput(raw);
    setPhase("analyzing");
    setResult(null);
    await sleep(900);

    const hit = TYPOS[term];
    const correct = hit ? hit.correct : raw;
    const confidence = hit ? hit.confidence : 100;
    const cuisine = QUERIES.find(
      (q) => q.term.toLowerCase() === correct.toLowerCase()
    )?.cuisine;
    const count = cuisine
      ? RESTAURANTS.filter((r) => r.cuisine === cuisine).length
      : 0;

    setResult({ typed: raw, correct, confidence, count });
    setPhase("done");
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <p className="text-sm leading-relaxed text-muted">
        Users mistype constantly. A good search system quietly understands
        what they <span className="font-semibold text-fg">meant</span>.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {SAMPLES.map((s) => (
          <button
            key={s}
            onClick={() => check(s)}
            className="rounded-full border border-border bg-bg px-3 py-1.5 font-mono text-xs transition-colors hover:border-brand/40 hover:text-brand"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-bg px-4 py-3">
        <SpellCheck className="h-4 w-4 text-muted" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && check(input)}
          placeholder="Type a misspelled food, e.g. piza"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
        />
        <button
          onClick={() => check(input)}
          className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          Correct
        </button>
      </div>

      <div className="mt-5 min-h-[120px]">
        <AnimatePresence mode="wait">
          {phase === "analyzing" && (
            <motion.div
              key="a"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-xl border border-border bg-bg px-4 py-5 text-sm text-muted"
            >
              <Loader2 className="h-4 w-4 animate-spin text-brand" />
              Correction engine comparing against known food terms…
            </motion.div>
          )}

          {phase === "done" && result && (
            <motion.div
              key="d"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-bg px-4 py-3">
                <span className="rounded-lg bg-rose-500/10 px-2.5 py-1 font-mono text-sm text-rose-500 line-through">
                  {result.typed}
                </span>
                <ArrowRight className="h-4 w-4 text-muted" />
                <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-sm font-semibold text-emerald-500">
                  {result.correct}
                </span>
                {result.typed.toLowerCase() !== result.correct.toLowerCase() && (
                  <span className="text-xs text-muted">
                    “Did you mean <strong>{result.correct}</strong>?”
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Confidence</span>
                  <span className="font-semibold tabular-nums">
                    {result.confidence}%
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-border">
                  <motion.div
                    className="h-full rounded-full bg-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>

              <p className="flex items-center gap-2 text-sm text-emerald-500">
                <Check className="h-4 w-4" />
                Retrieved {result.count} result
                {result.count === 1 ? "" : "s"} for “{result.correct}”
              </p>
            </motion.div>
          )}

          {phase === "idle" && (
            <motion.p
              key="i"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid h-28 place-items-center text-sm text-muted"
            >
              Pick a misspelling above to watch it get corrected.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-2 rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
        PM insight: good typo correction improves search success rates — most
        users won't retry a failed search, they just leave.
      </p>
    </div>
  );
}
