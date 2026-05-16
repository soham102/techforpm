"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { AUTH_METHODS } from "@/lib/auth";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/** Section 5 — compares login methods on convenience, security, friction. */
export function AuthMethods() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {AUTH_METHODS.map((m, i) => {
        const Icon = getIcon(m.icon);
        return (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            whileHover={{ y: -5 }}
            className="flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-soft transition-colors hover:border-brand/40 hover:shadow-soft-lg"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
              <Icon className="h-5 w-5" />
            </span>
            <h4 className="mt-4 text-sm font-semibold">{m.name}</h4>

            <div className="mt-4 space-y-2.5">
              <Meter label="Convenience" value={m.convenience} tone="emerald" />
              <Meter label="Security" value={m.security} tone="sky" />
              <Meter label="User friction" value={m.friction} tone="amber" />
            </div>

            <div className="mt-4 flex flex-1 items-start gap-2 rounded-xl border border-border bg-bg p-3">
              <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
              <p className="text-[11px] leading-relaxed text-muted">
                {m.insight}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function Meter({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "emerald" | "sky" | "amber";
}) {
  const tones = {
    emerald: "bg-emerald-500",
    sky: "bg-sky-500",
    amber: "bg-amber-500",
  };
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] text-muted">
        <span>{label}</span>
      </div>
      <div className="mt-1 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className={cn(
              "h-1.5 flex-1 origin-left rounded-full",
              i < value ? tones[tone] : "bg-border"
            )}
          />
        ))}
      </div>
    </div>
  );
}
