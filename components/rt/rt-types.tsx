"use client";

import { motion } from "framer-motion";
import { getIcon } from "@/lib/icons";
import { RT_TYPES } from "@/lib/realtime";

/**
 * Section 9 — the four shapes real-time takes, each with a familiar product
 * and a one-line plain explanation. A small live pulse on each card.
 */
export function RtTypes() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {RT_TYPES.map((t, i) => {
        const Icon = getIcon(t.icon);
        return (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-soft transition-shadow hover:shadow-soft-lg"
          >
            <div className="flex items-start justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand">
                <Icon className="h-5 w-5" />
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-500">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                live
              </span>
            </div>
            <h3 className="mt-4 text-base font-semibold">{t.name}</h3>
            <p className="mt-0.5 text-xs font-medium text-brand">
              {t.example}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {t.plain}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
