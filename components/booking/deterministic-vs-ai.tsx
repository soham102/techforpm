"use client";

import { motion } from "framer-motion";
import { Cpu, Sparkles, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const DET_OWNS = [
  "Allocate the slot",
  "Confirm payment",
  "Persist the booking",
  "Release lock on timeout",
];

const AI_OWNS = [
  "Suggest alternate slots",
  "Suggest nearby providers",
  "Draft empathetic message",
  "Predict no-show risk for ops",
];

const DET_NEVER = ["Empathetic phrasing", "Personalised alternatives"];
const AI_NEVER = ["Pick the slot winner", "Override the database"];

export function DeterministicVsAI() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Column
        title="Deterministic system"
        subtitle="Predictable, auditable, source of truth"
        icon={<Cpu className="h-5 w-5" />}
        owns={DET_OWNS}
        never={DET_NEVER}
        accent="brand"
      />
      <Column
        title="AI layer"
        subtitle="Adaptive, empathetic, never the decider"
        icon={<Sparkles className="h-5 w-5" />}
        owns={AI_OWNS}
        never={AI_NEVER}
        accent="sky"
      />
    </div>
  );
}

function Column({
  title,
  subtitle,
  icon,
  owns,
  never,
  accent,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  owns: string[];
  never: string[];
  accent: "brand" | "sky";
}) {
  const colors =
    accent === "brand"
      ? {
          border: "border-brand/30",
          bg: "bg-brand-soft",
          text: "text-brand",
          iconBg: "bg-brand text-white",
        }
      : {
          border: "border-sky-500/30",
          bg: "bg-sky-500/10",
          text: "text-sky-500",
          iconBg: "bg-sky-500 text-white",
        };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className={cn(
        "rounded-2xl border bg-surface p-5 shadow-soft md:p-6",
        colors.border
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "grid h-11 w-11 place-items-center rounded-xl",
            colors.iconBg
          )}
        >
          {icon}
        </span>
        <div>
          <p className="text-base font-semibold">{title}</p>
          <p className="text-xs text-muted">{subtitle}</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <p
            className={cn(
              "mb-2 text-[11px] font-semibold uppercase tracking-wider",
              colors.text
            )}
          >
            Owns
          </p>
          <ul className="space-y-1.5">
            {owns.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <Check
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0",
                    colors.text
                  )}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-rose-500">
            Never
          </p>
          <ul className="space-y-1.5">
            {never.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-muted"
              >
                <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
