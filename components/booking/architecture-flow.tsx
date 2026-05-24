"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ARCH_FLOW } from "@/lib/booking-conflict";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * Vertical-on-mobile, horizontal-on-desktop architecture flow.
 * A pulse cycles through the nodes to visualise a request travelling
 * down the stack and the response returning.
 */
export function ArchitectureFlow() {
  const reduce = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const i = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % ARCH_FLOW.length);
    }, 1100);
    return () => clearInterval(i);
  }, [reduce]);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft md:p-7">
      {/* Desktop: horizontal */}
      <div className="hidden gap-2 md:flex md:items-stretch">
        {ARCH_FLOW.map((node, i) => {
          const Icon = getIcon(node.icon);
          const isActive = i === activeIdx;
          const isBrand = node.accent === "brand";
          return (
            <div key={node.id} className="flex flex-1 items-stretch">
              <motion.div
                animate={{
                  scale: isActive ? 1.04 : 1,
                  borderColor: isActive
                    ? "rgb(var(--brand) / 0.5)"
                    : "rgb(var(--border))",
                }}
                transition={{ duration: 0.4 }}
                className={cn(
                  "flex flex-1 flex-col items-center justify-start gap-3 rounded-2xl border bg-surface px-3 py-5 text-center shadow-soft",
                  isBrand && "bg-brand-soft"
                )}
              >
                <motion.span
                  animate={
                    isActive
                      ? {
                          boxShadow:
                            "0 0 0 6px rgb(var(--brand) / 0.18)",
                        }
                      : { boxShadow: "0 0 0 0 transparent" }
                  }
                  transition={{ duration: 0.4 }}
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-xl",
                    isBrand
                      ? "bg-brand text-white"
                      : "bg-brand-soft text-brand"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </motion.span>
                <p className="text-sm font-semibold leading-tight">
                  {node.label}
                </p>
                <p className="px-1 text-[11px] leading-snug text-muted">
                  {node.detail?.body.split(".")[0]}.
                </p>
              </motion.div>

              {i < ARCH_FLOW.length - 1 && (
                <div className="relative flex w-8 items-center justify-center">
                  <motion.span
                    aria-hidden
                    animate={
                      reduce
                        ? { opacity: 0.5 }
                        : { opacity: [0.2, 1, 0.2], x: [-2, 6, -2] }
                    }
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      delay: i * 0.18,
                    }}
                    className="text-brand"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </motion.span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical */}
      <div className="flex flex-col gap-3 md:hidden">
        {ARCH_FLOW.map((node, i) => {
          const Icon = getIcon(node.icon);
          const isActive = i === activeIdx;
          const isBrand = node.accent === "brand";
          return (
            <div key={node.id}>
              <motion.div
                animate={{ scale: isActive ? 1.02 : 1 }}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3",
                  isActive
                    ? "border-brand/40 shadow-soft"
                    : "border-border bg-surface",
                  isBrand && "bg-brand-soft"
                )}
              >
                <span
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                    isBrand
                      ? "bg-brand text-white"
                      : "bg-brand-soft text-brand"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{node.label}</p>
                  <p className="text-[11px] leading-snug text-muted">
                    {node.detail?.body.split(".")[0]}.
                  </p>
                </div>
              </motion.div>
              {i < ARCH_FLOW.length - 1 && (
                <div className="flex justify-center py-1">
                  <motion.span
                    animate={
                      reduce ? { opacity: 0.5 } : { opacity: [0.3, 1, 0.3] }
                    }
                    transition={{ duration: 1.4, repeat: Infinity }}
                    className="text-brand"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs leading-relaxed text-muted">
        The Redis lock layer is the{" "}
        <span className="font-semibold text-brand">deterministic decider</span>
        . Frontend, AI, and payment never override it — they just react to its
        result.
      </p>
    </div>
  );
}
