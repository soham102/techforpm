"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, RotateCcw, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuizOption {
  id: string;
  label: string;
  correct: boolean;
  /** Why this option is right or wrong — shown after selection. */
  rationale: string;
}

export interface QuizProps {
  scenario: string;
  question: string;
  options: QuizOption[];
}

/** Reusable single-question scenario quiz with per-answer reasoning. */
export function Quiz({ scenario, question, options }: QuizProps) {
  const [selected, setSelected] = useState<QuizOption | null>(null);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      <div className="rounded-xl bg-brand-soft p-4 text-sm leading-relaxed text-fg">
        <span className="font-semibold">Scenario — </span>
        {scenario}
      </div>

      <p className="mt-5 text-[15px] font-medium">{question}</p>

      <div className="mt-4 space-y-3">
        {options.map((opt) => {
          const isPicked = selected?.id === opt.id;
          const reveal = selected !== null;
          return (
            <motion.button
              key={opt.id}
              type="button"
              disabled={reveal}
              onClick={() => setSelected(opt)}
              whileHover={!reveal ? { x: 4 } : undefined}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-colors",
                !reveal &&
                  "border-border bg-bg hover:border-brand/50 hover:bg-brand-soft",
                reveal && opt.correct && "border-emerald-500/40 bg-emerald-500/10",
                reveal &&
                  isPicked &&
                  !opt.correct &&
                  "border-rose-500/40 bg-rose-500/10",
                reveal &&
                  !isPicked &&
                  !opt.correct &&
                  "border-border opacity-50"
              )}
            >
              <span className="font-medium">{opt.label}</span>
              {reveal && opt.correct && (
                <Check className="h-4 w-4 shrink-0 text-emerald-500" />
              )}
              {reveal && isPicked && !opt.correct && (
                <X className="h-4 w-4 shrink-0 text-rose-500" />
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden"
          >
            <div className="mt-5 rounded-xl border border-border bg-bg p-4">
              <p
                className={cn(
                  "flex items-center gap-2 text-sm font-semibold",
                  selected.correct ? "text-emerald-500" : "text-rose-500"
                )}
              >
                {selected.correct ? (
                  <>
                    <Check className="h-4 w-4" /> Correct
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4" /> Not quite
                  </>
                )}
              </p>
              <p className="mt-2 flex gap-2 text-sm leading-relaxed text-muted">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                {selected.rationale}
              </p>
              {!selected.correct && (
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  <span className="font-medium text-fg">Best answer: </span>
                  {options.find((o) => o.correct)?.label} —{" "}
                  {options.find((o) => o.correct)?.rationale}
                </p>
              )}
              <button
                onClick={() => setSelected(null)}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand transition-opacity hover:opacity-80"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Try again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
