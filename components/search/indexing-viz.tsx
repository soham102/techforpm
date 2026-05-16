"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Zap, Library } from "lucide-react";
import { RESTAURANTS } from "@/lib/search";
import { cn, sleep } from "@/lib/utils";

const TARGET = "Pizza";

/** Section 4 — scanning every restaurant vs an instant indexed lookup. */
export function IndexingViz() {
  const [scanIdx, setScanIdx] = useState<number | null>(null);
  const [mode, setMode] = useState<null | "slow" | "fast">(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  async function runSlow() {
    if (running) return;
    setRunning(true);
    setMode("slow");
    setMatched([]);
    for (let i = 0; i < RESTAURANTS.length; i++) {
      setScanIdx(i);
      await sleep(360);
      if (RESTAURANTS[i].cuisine === TARGET) {
        setMatched((m) => [...m, RESTAURANTS[i].id]);
      }
    }
    setScanIdx(null);
    setRunning(false);
  }

  async function runFast() {
    if (running) return;
    setRunning(true);
    setMode("fast");
    setScanIdx(null);
    setMatched([]);
    await sleep(220);
    setMatched(
      RESTAURANTS.filter((r) => r.cuisine === TARGET).map((r) => r.id)
    );
    setRunning(false);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <p className="text-sm leading-relaxed text-muted">
        Find every <span className="font-semibold text-fg">Pizza</span> place.
        An index is like a library catalog — you don't walk every shelf, you
        jump straight to the right section.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={runSlow}
          disabled={running}
          className="rounded-xl border border-border bg-bg px-4 py-2.5 text-sm font-medium transition-colors hover:border-rose-500/40 disabled:opacity-60"
        >
          Search without index
        </button>
        <button
          onClick={runFast}
          disabled={running}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          <Zap className="h-4 w-4" />
          Search with index
        </button>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        {RESTAURANTS.map((r, i) => {
          const scanning = mode === "slow" && scanIdx === i;
          const found = matched.includes(r.id);
          return (
            <motion.div
              key={r.id}
              animate={{
                backgroundColor: found
                  ? "rgba(16,185,129,0.16)"
                  : scanning
                  ? "rgba(244,63,94,0.16)"
                  : "rgba(0,0,0,0)",
              }}
              className="rounded-lg border border-border px-3 py-2 text-xs"
            >
              <span className="font-medium">{r.name}</span>
              <span className="ml-1 text-muted">· {r.cuisine}</span>
              {scanning && (
                <span className="ml-1 text-[10px] text-rose-500">
                  checking…
                </span>
              )}
              {found && (
                <span className="ml-1 text-[10px] font-semibold text-emerald-500">
                  match
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Note
          active={mode === "slow"}
          icon={<BookOpen className="h-4 w-4" />}
          tone="rose"
          text="Without an index the system reads every restaurant one by one — fine for 9 rows, fatal for millions."
        />
        <Note
          active={mode === "fast"}
          icon={<Library className="h-4 w-4" />}
          tone="emerald"
          text="With an index it jumps straight to the “Pizza” bucket — speed barely changes as the catalog grows."
        />
      </div>

      <p className="mt-4 rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
        PM insight: indexes improve speed and scalability — they're the
        difference between search that stays fast and search that degrades as
        you grow.
      </p>
    </div>
  );
}

function Note({
  active,
  icon,
  tone,
  text,
}: {
  active: boolean;
  icon: React.ReactNode;
  tone: "rose" | "emerald";
  text: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-xl border p-3 text-xs leading-relaxed transition-colors",
        active
          ? tone === "rose"
            ? "border-rose-500/40 bg-rose-500/5 text-rose-600 dark:text-rose-400"
            : "border-emerald-500/40 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
          : "border-border bg-bg text-muted"
      )}
    >
      <span className="mt-0.5 shrink-0">{icon}</span>
      {text}
    </div>
  );
}
