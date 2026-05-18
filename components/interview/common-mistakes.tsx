"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { COMMON_MISTAKES } from "@/lib/interview-prep";

export function CommonMistakes() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {COMMON_MISTAKES.map((m, i) => (
        <motion.div
          key={m.mistake}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: (i % 2) * 0.08 }}
          whileHover={{ y: -4 }}
          className="group overflow-hidden rounded-2xl border border-rose-500/25 bg-rose-500/[0.04] shadow-soft transition-shadow hover:shadow-soft-lg"
        >
          <div className="flex items-start gap-3 border-b border-rose-500/15 p-5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-rose-500/15 text-rose-500">
              <AlertTriangle className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[15px] font-semibold text-rose-500">
                {m.mistake}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">
                {m.why}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-500/15 text-emerald-500">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-500">
                Better approach
                <ArrowRight className="h-3 w-3" />
              </p>
              <p className="mt-1 text-sm leading-relaxed text-fg">
                {m.better}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
