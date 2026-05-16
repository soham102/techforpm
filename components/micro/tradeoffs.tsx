"use client";

import { motion } from "framer-motion";
import { Check, AlertTriangle, Boxes, Layers } from "lucide-react";
import { TRADEOFFS } from "@/lib/microservices";
import { cn } from "@/lib/utils";

/**
 * Section 8 — balanced trade-offs. Microservices are NOT always better;
 * the monolith column is given equal visual weight.
 */
export function Tradeoffs() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Card
        icon={<Boxes className="h-5 w-5" />}
        title="Monolith — benefits"
        accent="brand"
        items={TRADEOFFS.monolithBenefits}
        kind="pro"
      />
      <Card
        icon={<Layers className="h-5 w-5" />}
        title="Microservices — benefits"
        accent="emerald"
        items={TRADEOFFS.microBenefits}
        kind="pro"
      />
      <Card
        icon={<AlertTriangle className="h-5 w-5" />}
        title="Microservices — challenges"
        accent="amber"
        items={TRADEOFFS.microChallenges}
        kind="con"
      />
    </div>
  );
}

function Card({
  icon,
  title,
  accent,
  items,
  kind,
}: {
  icon: React.ReactNode;
  title: string;
  accent: "brand" | "emerald" | "amber";
  items: string[];
  kind: "pro" | "con";
}) {
  const ring = {
    brand: "border-brand/30",
    emerald: "border-emerald-500/30",
    amber: "border-amber-500/30",
  }[accent];
  const chip = {
    brand: "bg-brand-soft text-brand",
    emerald: "bg-emerald-500/10 text-emerald-500",
    amber: "bg-amber-500/10 text-amber-500",
  }[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn(
        "rounded-2xl border bg-surface p-6 shadow-soft",
        ring
      )}
    >
      <span
        className={cn("grid h-11 w-11 place-items-center rounded-xl", chip)}
      >
        {icon}
      </span>
      <h4 className="mt-4 text-sm font-semibold">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {items.map((it, i) => (
          <motion.li
            key={it}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="flex items-start gap-2 text-sm leading-relaxed"
          >
            {kind === "pro" ? (
              <Check
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0",
                  accent === "brand" ? "text-brand" : "text-emerald-500"
                )}
              />
            ) : (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            )}
            <span className="text-muted">{it}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
