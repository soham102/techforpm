"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ANALOGY_PAIRS } from "@/lib/databases";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * Section 1 — maps each database term to a warehouse equivalent.
 * Hovering a card reveals the beginner explanation and glows.
 */
export function ConceptMap() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {ANALOGY_PAIRS.map((pair, i) => {
        const Icon = getIcon(pair.icon);
        const active = hovered === pair.db;
        return (
          <motion.div
            key={pair.db}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            onHoverStart={() => setHovered(pair.db)}
            onHoverEnd={() => setHovered(null)}
            className={cn(
              "rounded-2xl border bg-surface p-5 shadow-soft transition-all duration-300",
              active
                ? "border-brand/50 shadow-glow"
                : "border-border hover:border-brand/30"
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-xl transition-colors",
                  active
                    ? "bg-brand text-white"
                    : "bg-brand-soft text-brand"
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="flex flex-1 items-center gap-2 text-sm font-semibold">
                <span>{pair.db}</span>
                <ArrowRight className="h-4 w-4 text-muted" />
                <span className="text-brand">{pair.warehouse}</span>
              </div>
            </div>

            <motion.p
              animate={{
                opacity: active ? 1 : 0.62,
              }}
              className="mt-3 text-sm leading-relaxed text-muted"
            >
              {pair.plain}
            </motion.p>
          </motion.div>
        );
      })}
    </div>
  );
}
