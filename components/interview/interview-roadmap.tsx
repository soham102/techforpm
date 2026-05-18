"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Flag } from "lucide-react";
import { ROADMAP } from "@/lib/interview-prep";
import { cn } from "@/lib/utils";

export function InterviewRoadmap() {
  // key = `${week}-${itemIndex}`
  const [done, setDone] = useState<Record<string, boolean>>({});

  const totalItems = useMemo(
    () => ROADMAP.reduce((n, w) => n + w.checklist.length, 0),
    []
  );
  const doneCount = Object.values(done).filter(Boolean).length;
  const progress = Math.round((doneCount / totalItems) * 100);

  function toggle(key: string) {
    setDone((d) => ({ ...d, [key]: !d[key] }));
  }

  return (
    <div>
      {/* Overall progress */}
      <div className="mb-8 rounded-2xl border border-border bg-surface p-5 shadow-soft">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">Your 6-week progress</span>
          <span className="font-mono font-bold text-brand">
            {progress}%
          </span>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-border">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand to-fuchsia-400"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <div className="relative">
        {/* Vertical spine */}
        <span
          aria-hidden
          className="absolute left-[19px] top-2 hidden h-[calc(100%-2rem)] w-px bg-border md:block"
        />

        <div className="space-y-5">
          {ROADMAP.map((w, i) => {
            const weekItems = w.checklist.length;
            const weekDone = w.checklist.filter(
              (_, idx) => done[`${w.week}-${idx}`]
            ).length;
            const complete = weekDone === weekItems;

            return (
              <motion.div
                key={w.week}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="relative md:pl-14"
              >
                {/* Milestone node */}
                <span
                  className={cn(
                    "absolute left-0 top-1 hidden h-10 w-10 place-items-center rounded-full border-2 text-sm font-bold transition-colors md:grid",
                    complete
                      ? "border-brand bg-brand text-white"
                      : "border-border bg-surface text-muted"
                  )}
                >
                  {complete ? <Check className="h-5 w-5" /> : w.week}
                </span>

                <div
                  className={cn(
                    "rounded-2xl border bg-surface p-6 shadow-soft transition-colors",
                    complete ? "border-brand/40" : "border-border"
                  )}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-0.5 text-xs font-semibold text-brand">
                      <Flag className="h-3 w-3" />
                      Week {w.week}
                    </span>
                    <h3 className="text-lg font-semibold tracking-tight">
                      {w.focus}
                    </h3>
                    <span className="ml-auto text-xs font-medium text-muted">
                      {weekDone}/{weekItems} done
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {w.summary}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {w.checklist.map((item, idx) => {
                      const key = `${w.week}-${idx}`;
                      const checked = !!done[key];
                      return (
                        <li key={item}>
                          <button
                            onClick={() => toggle(key)}
                            className="group flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-elevated/50"
                          >
                            <span
                              className={cn(
                                "grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors",
                                checked
                                  ? "border-brand bg-brand text-white"
                                  : "border-border group-hover:border-brand/50"
                              )}
                            >
                              {checked && <Check className="h-3.5 w-3.5" />}
                            </span>
                            <span
                              className={cn(
                                "text-sm transition-colors",
                                checked
                                  ? "text-muted line-through"
                                  : "text-fg"
                              )}
                            >
                              {item}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
