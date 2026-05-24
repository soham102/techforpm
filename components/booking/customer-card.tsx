"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ACCENT_CLASSES,
  STAGE_META,
  TONE_CLASSES,
  type BookingStage,
  type Customer,
} from "@/lib/booking-conflict";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface Props {
  customer: Customer;
  stage: BookingStage;
  paymentProgress: number; // 0-1
  isWinner: boolean;
  aiMessage?: string;
}

export function CustomerCard({
  customer,
  stage,
  paymentProgress,
  isWinner,
  aiMessage,
}: Props) {
  const accent = ACCENT_CLASSES[customer.accent];
  const meta = STAGE_META[stage];
  const tone = TONE_CLASSES[meta.tone];
  const Icon = getIcon(meta.icon);
  const showPayment =
    stage === "payment-processing" || stage === "payment-failed";

  return (
    <motion.div
      layout
      whileHover={{ y: -3 }}
      className={cn(
        "relative flex flex-col gap-4 overflow-hidden rounded-2xl border bg-surface p-5 shadow-soft transition-shadow",
        isWinner
          ? "border-emerald-500/50 shadow-soft-lg"
          : stage === "rejected"
          ? "border-rose-500/30"
          : accent.border
      )}
    >
      {isWinner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"
        />
      )}

      <div className="relative flex items-center gap-3">
        <span
          className={cn(
            "grid h-12 w-12 place-items-center rounded-2xl text-2xl ring-2",
            accent.bgSoft,
            accent.ring
          )}
        >
          {customer.avatar}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <p className={cn("font-semibold tracking-tight", accent.text)}>
              Customer {customer.id}
            </p>
            <p className="truncate text-sm font-medium">{customer.name}</p>
          </div>
          <p className="mt-0.5 truncate text-xs text-muted">
            {customer.city} · {customer.device}
          </p>
        </div>
      </div>

      <div
        className={cn(
          "relative flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium ring-1",
          tone.bg,
          tone.ring,
          tone.text
        )}
      >
        <motion.span
          key={stage}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex h-5 w-5 items-center justify-center"
        >
          <Icon className="h-3.5 w-3.5" />
        </motion.span>
        <span className="flex-1 truncate">{meta.label}</span>
        {(stage === "payment-processing" || stage === "queued") && (
          <span className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.18,
                }}
                className={cn("h-1 w-1 rounded-full", tone.dot)}
              />
            ))}
          </span>
        )}
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-muted">
          <span>Arrival</span>
          <span className="font-mono text-fg/80">
            +{customer.arrivalMs}ms
          </span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Payment latency</span>
          <span className="font-mono text-fg/80">{customer.paymentMs}ms</span>
        </div>
      </div>

      {showPayment && (
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted">
            <span>Payment</span>
            <span>{Math.round(paymentProgress * 100)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-border">
            <motion.div
              className={cn(
                "h-full rounded-full",
                stage === "payment-failed" ? "bg-rose-500" : "bg-amber-500"
              )}
              animate={{ width: `${paymentProgress * 100}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>
      )}

      <AnimatePresence>
        {stage === "ai-recommended" && aiMessage && (
          <motion.div
            initial={{ opacity: 0, y: 8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-xs text-sky-700 dark:text-sky-300"
          >
            <p className="font-semibold">AI alternative</p>
            <p className="mt-0.5 leading-relaxed">{aiMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {isWinner && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400"
        >
          ✅ Slot owner — booking persisted
        </motion.div>
      )}
    </motion.div>
  );
}
