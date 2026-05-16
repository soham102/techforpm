"use client";

import { motion } from "framer-motion";
import { Signal } from "lucide-react";
import { PLATFORMS } from "@/lib/recommendations";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * Section 2 — the same idea across familiar apps. Different signals,
 * identical pattern: behaviour in, personalised feed out.
 */
export function PlatformExamples() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {PLATFORMS.map((p, i) => {
        const Icon = getIcon(p.icon);
        return (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            whileHover={{ y: -5 }}
            className="rounded-2xl border border-border bg-surface p-5 shadow-soft transition-colors hover:border-brand/40 hover:shadow-soft-lg"
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-xl bg-bg",
                  p.accent
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <p className="text-sm font-semibold">{p.name}</p>
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
              <Signal className="h-3 w-3 text-brand" />
              Signals it watches
            </p>
            <ul className="mt-2 space-y-1.5">
              {p.signals.map((s) => (
                <li
                  key={s}
                  className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-muted"
                >
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
        );
      })}
    </div>
  );
}
