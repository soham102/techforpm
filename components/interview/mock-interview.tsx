"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Lightbulb,
  Eye,
  EyeOff,
  ListOrdered,
  Timer,
} from "lucide-react";
import { MOCK_QUESTIONS } from "@/lib/interview-prep";
import { DifficultyBadge } from "@/components/ui/badge";
import type { Difficulty } from "@/lib/concepts";
import { cn } from "@/lib/utils";

function format(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function MockInterview() {
  const [idx, setIdx] = useState(0);
  const q = MOCK_QUESTIONS[idx];

  const [seconds, setSeconds] = useState(q.minutes * 60);
  const [running, setRunning] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = useCallback(
    (minutes: number) => {
      setRunning(false);
      setSeconds(minutes * 60);
      setRevealed(false);
      setHintCount(0);
    },
    []
  );

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  function selectQuestion(i: number) {
    setIdx(i);
    reset(MOCK_QUESTIONS[i].minutes);
  }

  const total = q.minutes * 60;
  const pct = (seconds / total) * 100;
  const low = seconds <= 30;

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      {/* Question list */}
      <div className="space-y-2.5">
        <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted">
          Pick a question
        </p>
        {MOCK_QUESTIONS.map((m, i) => {
          const active = i === idx;
          return (
            <button
              key={m.id}
              onClick={() => selectQuestion(i)}
              className={cn(
                "w-full rounded-xl border p-4 text-left transition-all",
                active
                  ? "border-brand/50 bg-brand-soft shadow-glow"
                  : "border-border bg-surface hover:border-brand/30"
              )}
            >
              <span className="text-xs font-medium text-brand">
                {m.type}
              </span>
              <p className="mt-1 text-sm font-semibold leading-snug">
                {m.prompt}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <DifficultyBadge level={m.difficulty as Difficulty} />
                <span className="inline-flex items-center gap-1 text-[11px] text-muted">
                  <Timer className="h-3 w-3" />
                  {m.minutes}m
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active question panel */}
      <motion.div
        key={q.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-brand/10 blur-3xl"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
            {q.type}
          </span>
          <DifficultyBadge level={q.difficulty as Difficulty} />
        </div>

        <h3 className="mt-4 text-2xl font-bold leading-tight tracking-tight">
          {q.prompt}
        </h3>

        {/* Timer */}
        <div className="mt-6 rounded-2xl border border-border/70 bg-elevated/50 p-5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-muted">
              <Timer className="h-4 w-4" />
              Answer timer
            </span>
            <span
              className={cn(
                "font-mono text-2xl font-bold tabular-nums transition-colors",
                low ? "text-rose-500" : "text-fg"
              )}
            >
              {format(seconds)}
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
            <motion.div
              className={cn(
                "h-full rounded-full",
                low ? "bg-rose-500" : "bg-brand"
              )}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setRunning((r) => !r)}
              disabled={seconds === 0}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {running ? (
                <>
                  <Pause className="h-4 w-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" /> Start
                </>
              )}
            </button>
            <button
              onClick={() => reset(q.minutes)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition-colors hover:border-brand/40"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </div>

        {/* Hints */}
        <div className="mt-6">
          <button
            onClick={() =>
              setHintCount((c) => Math.min(c + 1, q.hints.length))
            }
            disabled={hintCount >= q.hints.length}
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-500 transition-colors hover:bg-amber-500/15 disabled:opacity-50"
          >
            <Lightbulb className="h-4 w-4" />
            {hintCount >= q.hints.length
              ? "All hints shown"
              : `Reveal hint (${hintCount}/${q.hints.length})`}
          </button>
          <div className="mt-3 space-y-2">
            <AnimatePresence>
              {q.hints.slice(0, hintCount).map((h, i) => (
                <motion.p
                  key={h}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-sm text-amber-200/90"
                >
                  <span className="font-semibold text-amber-500">
                    {i + 1}.
                  </span>
                  {h}
                </motion.p>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Reveal structured answer */}
        <div className="mt-6 border-t border-border/70 pt-6">
          <button
            onClick={() => setRevealed((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full bg-fg px-4 py-2 text-sm font-semibold text-bg transition-transform hover:-translate-y-0.5"
          >
            {revealed ? (
              <>
                <EyeOff className="h-4 w-4" /> Hide structure
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" /> Reveal answer structure
              </>
            )}
          </button>

          <AnimatePresence initial={false}>
            {revealed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 rounded-2xl border border-border bg-elevated/50 p-5">
                  <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold">
                    <ListOrdered className="h-4 w-4 text-brand" />
                    Suggested structure
                  </p>
                  <ol className="space-y-2.5">
                    {q.structure.map((s, i) => (
                      <motion.li
                        key={s}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3 text-sm"
                      >
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand text-[11px] font-semibold text-white">
                          {i + 1}
                        </span>
                        <span className="text-muted">{s}</span>
                      </motion.li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
