"use client";

import { motion } from "framer-motion";
import { Target, Clock3, ChevronRight, Lightbulb } from "lucide-react";
import { FRAMEWORKS } from "@/lib/interview-prep";

export function FrameworkCards() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {FRAMEWORKS.map((f, i) => (
        <motion.article
          key={f.id}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
          whileHover={{ y: -5 }}
          className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-soft transition-shadow hover:border-brand/40 hover:shadow-soft-lg"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold tracking-tight">{f.name}</h3>
              <p className="mt-1 text-xs font-medium text-brand">
                {f.expansion}
              </p>
            </div>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand transition-transform group-hover:scale-110">
              <Target className="h-4 w-4" />
            </span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted">
            {f.purpose}
          </p>

          <div className="mt-4 space-y-2 text-[13px]">
            <p className="flex gap-2 text-muted">
              <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
              <span>
                <span className="font-semibold text-fg">When:</span>{" "}
                {f.whenToUse}
              </span>
            </p>
            <p className="flex gap-2 text-muted">
              <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
              <span>
                <span className="font-semibold text-fg">Example:</span>{" "}
                {f.example}
              </span>
            </p>
          </div>

          {/* Mini visual diagram */}
          <div className="mt-5 flex flex-1 flex-wrap items-center gap-1.5 rounded-xl border border-border/70 bg-elevated/40 p-3">
            {f.steps.map((s, idx) => (
              <span key={s} className="flex items-center">
                <span className="rounded-md bg-surface px-2 py-1 text-[11px] font-medium shadow-soft ring-1 ring-border">
                  {s}
                </span>
                {idx < f.steps.length - 1 && (
                  <ChevronRight className="mx-0.5 h-3 w-3 text-muted" />
                )}
              </span>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {f.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-semibold text-brand"
              >
                #{t}
              </span>
            ))}
          </div>
        </motion.article>
      ))}
    </div>
  );
}
