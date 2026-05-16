"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChefHat,
  Receipt,
  UserCog,
  CreditCard,
  Pizza,
  IceCream,
  Bike,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "monolith" | "micro";

const MONO_PARTS = [
  { icon: ChefHat, label: "One kitchen" },
  { icon: Receipt, label: "One cashier" },
  { icon: UserCog, label: "One manager" },
  { icon: CreditCard, label: "One billing system" },
];

const COURT_STALLS = [
  { icon: Pizza, label: "Pizza counter" },
  { icon: IceCream, label: "Dessert counter" },
  { icon: CreditCard, label: "Own billing" },
  { icon: Bike, label: "Delivery counter" },
];

/** Section 1 — animated toggle between the small restaurant and food court. */
export function RestaurantAnalogy() {
  const [mode, setMode] = useState<Mode>("monolith");

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      <div className="mx-auto inline-flex w-full max-w-md rounded-xl border border-border p-1 sm:w-auto">
        <Toggle
          on={mode === "monolith"}
          onClick={() => setMode("monolith")}
          label="Small restaurant"
          sub="Monolith"
        />
        <Toggle
          on={mode === "micro"}
          onClick={() => setMode("micro")}
          label="Food court"
          sub="Microservices"
        />
      </div>

      <div className="mt-8 min-h-[260px]">
        <AnimatePresence mode="wait">
          {mode === "monolith" ? (
            <motion.div
              key="mono"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
            >
              <div className="rounded-2xl border-2 border-brand/40 bg-brand-soft p-6">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-brand">
                  <Building2 className="h-4 w-4" />
                  One tightly-connected building
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {MONO_PARTS.map((p, i) => (
                    <motion.div
                      key={p.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="flex flex-col items-center gap-2 rounded-xl border border-brand/30 bg-surface p-4 text-center"
                    >
                      <p.icon className="h-5 w-5 text-brand" />
                      <span className="text-xs font-medium">{p.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <p className="mt-5 rounded-xl border border-border bg-bg px-4 py-3 text-sm leading-relaxed">
                Everything is wired together. It's simple to run —{" "}
                <span className="font-semibold">
                  but if one part breaks, the whole restaurant slows down.
                </span>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="micro"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {COURT_STALLS.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-bg p-5 text-center shadow-soft transition-colors hover:border-brand/40"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
                      <s.icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-medium">{s.label}</span>
                    <span className="text-[10px] text-emerald-500">
                      independent
                    </span>
                  </motion.div>
                ))}
              </div>
              <p className="mt-5 rounded-xl border border-border bg-bg px-4 py-3 text-sm leading-relaxed">
                Each counter runs on its own.{" "}
                <span className="font-semibold">
                  Each team/service can scale independently
                </span>{" "}
                — and one closing doesn't shut the food court.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Toggle({
  on,
  onClick,
  label,
  sub,
}: {
  on: boolean;
  onClick: () => void;
  label: string;
  sub: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 rounded-lg px-4 py-2 text-center transition-colors sm:flex-initial",
        on ? "bg-brand text-white" : "text-muted hover:text-fg"
      )}
    >
      <span className="block text-sm font-semibold">{label}</span>
      <span
        className={cn("block text-[11px]", on ? "text-white/80" : "text-muted")}
      >
        {sub}
      </span>
    </button>
  );
}
