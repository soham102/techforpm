"use client";

import { motion } from "framer-motion";
import { CACHE_TYPES } from "@/lib/caching";
import { getIcon } from "@/lib/icons";

/**
 * Section 8 — the three places caching happens, explained with one
 * analogy and one familiar example each. No infrastructure jargon.
 */
export function CacheTypes() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {CACHE_TYPES.map((t, i) => {
        const Icon = getIcon(t.icon);
        return (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            className="group flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-soft transition-shadow hover:shadow-soft-lg"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand transition-transform duration-300 group-hover:scale-110">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-base font-semibold">{t.name}</h3>
            <p className="mt-2 flex-1 text-sm italic leading-relaxed text-brand">
              {t.analogy}
            </p>
            <p className="mt-4 border-t border-border/70 pt-4 text-sm leading-relaxed text-muted">
              {t.example}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
