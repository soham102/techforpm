"use client";

import { motion } from "framer-motion";
import {
  Lightbulb,
  PenTool,
  LineChart,
  Calculator,
  Gauge,
  Users,
  Map,
  Cpu,
  ListChecks,
  Search,
  Quote,
  type LucideIcon,
} from "lucide-react";
import { QUESTION_CATEGORIES } from "@/lib/interview-prep";
import { DifficultyBadge } from "@/components/ui/badge";
import type { Difficulty } from "@/lib/concepts";

const ICONS: Record<string, LucideIcon> = {
  Lightbulb,
  PenTool,
  LineChart,
  Calculator,
  Gauge,
  Users,
  Map,
  Cpu,
  ListChecks,
  Search,
};

const FREQ_STYLES: Record<string, string> = {
  "Very High": "bg-fuchsia-500/10 text-fuchsia-500 ring-fuchsia-500/20",
  High: "bg-brand/10 text-brand ring-brand/20",
  Medium: "bg-muted/10 text-muted ring-muted/20",
};

export function QuestionCategories() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {QUESTION_CATEGORIES.map((c, i) => {
        const Icon = ICONS[c.icon] ?? Lightbulb;
        return (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: (i % 3) * 0.07 }}
            whileHover={{ y: -6 }}
            className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-soft transition-shadow hover:border-brand/40 hover:shadow-soft-lg"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
            />

            <div className="flex items-start justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </span>
              <DifficultyBadge level={c.difficulty as Difficulty} />
            </div>

            <h3 className="mt-5 text-lg font-semibold tracking-tight">
              {c.title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              {c.blurb}
            </p>

            <div className="mt-5 rounded-xl border border-border/70 bg-elevated/50 p-3.5">
              <span className="flex items-start gap-2 text-[13px] leading-relaxed text-fg">
                <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                <span className="italic">{c.sample}</span>
              </span>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-4 text-xs">
              <span className="font-medium text-muted">
                Interview frequency
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-semibold ring-1 ring-inset ${
                  FREQ_STYLES[c.frequency]
                }`}
              >
                {c.frequency}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
