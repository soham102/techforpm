"use client";

import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { getIcon, type IconName } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface FlowNode {
  id: string;
  label: string;
  icon: IconName;
  /** Optional detail revealed in a modal when the node is clicked. */
  detail?: {
    title: string;
    body: string;
  };
  accent?: "brand" | "neutral";
}

interface AnimatedFlowProps {
  nodes: FlowNode[];
  /** Loop the directional pulse along arrows. */
  loop?: boolean;
}

/**
 * Reusable horizontal flow diagram with animated directional arrows.
 * Nodes carrying a `detail` are clickable and open an explanation modal.
 */
export function AnimatedFlow({ nodes, loop = true }: AnimatedFlowProps) {
  const [active, setActive] = useState<FlowNode | null>(null);
  const reduce = useReducedMotion();

  return (
    <>
      <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-between">
        {nodes.map((node, i) => {
          const Icon = getIcon(node.icon);
          const clickable = Boolean(node.detail);
          return (
            <div
              key={node.id}
              className="flex flex-col items-center gap-3 md:flex-1 md:flex-row"
            >
              <motion.button
                type="button"
                disabled={!clickable}
                onClick={() => node.detail && setActive(node)}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.4 }}
                whileHover={clickable ? { y: -4 } : undefined}
                className={cn(
                  "flex w-full flex-col items-center gap-2 rounded-2xl border px-4 py-5 text-center transition-colors md:w-auto md:flex-1",
                  node.accent === "brand"
                    ? "border-brand/40 bg-brand-soft"
                    : "border-border bg-surface",
                  clickable
                    ? "cursor-pointer shadow-soft hover:border-brand/50 hover:shadow-soft-lg"
                    : "cursor-default"
                )}
              >
                <span
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-xl",
                    node.accent === "brand"
                      ? "bg-brand text-white"
                      : "bg-brand-soft text-brand"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium">{node.label}</span>
                {clickable && (
                  <span className="text-[11px] font-medium uppercase tracking-wide text-brand">
                    Click to learn
                  </span>
                )}
              </motion.button>

              {i < nodes.length - 1 && (
                <div className="relative flex h-8 items-center justify-center md:h-auto md:w-12">
                  <motion.span
                    aria-hidden
                    initial={{ opacity: 0.25 }}
                    animate={
                      reduce
                        ? { opacity: 0.6 }
                        : { opacity: [0.2, 1, 0.2], x: [0, 6, 0] }
                    }
                    transition={
                      loop && !reduce
                        ? {
                            duration: 1.6,
                            repeat: Infinity,
                            delay: i * 0.25,
                          }
                        : { duration: 0.3 }
                    }
                    className="text-brand rotate-90 md:rotate-0"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {active && active.detail && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setActive(null)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ scale: 0.92, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 8, opacity: 0 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className="relative w-full max-w-md rounded-2xl border border-border bg-elevated p-6 shadow-soft-lg"
            >
              <button
                onClick={() => setActive(null)}
                aria-label="Close"
                className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-fg"
              >
                <X className="h-4 w-4" />
              </button>
              {(() => {
                const ModalIcon = getIcon(active.icon);
                return (
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand">
                    <ModalIcon className="h-5 w-5" />
                  </span>
                );
              })()}
              <h4 className="mt-4 text-lg font-semibold">
                {active.detail.title}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {active.detail.body}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
