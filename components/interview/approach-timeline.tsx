"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { APPROACH_TRACKS } from "@/lib/interview-prep";
import { cn } from "@/lib/utils";

export function ApproachTimeline() {
  const [trackId, setTrackId] = useState(APPROACH_TRACKS[0].id);
  const [open, setOpen] = useState<number | null>(0);

  const track =
    APPROACH_TRACKS.find((t) => t.id === trackId) ?? APPROACH_TRACKS[0];

  return (
    <div>
      {/* Track switcher */}
      <div className="mb-8 inline-flex flex-wrap gap-1.5 rounded-full border border-border bg-surface p-1.5 shadow-soft">
        {APPROACH_TRACKS.map((t) => {
          const active = t.id === track.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setTrackId(t.id);
                setOpen(0);
              }}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-brand text-white shadow-glow"
                  : "text-muted hover:text-fg"
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="relative pl-2">
        {track.steps.map((step, i) => {
          const isOpen = open === i;
          const isLast = i === track.steps.length - 1;
          return (
            <div key={`${track.id}-${i}`} className="relative pb-4 pl-12">
              {/* Connector */}
              {!isLast && (
                <span
                  aria-hidden
                  className="absolute left-[15px] top-9 h-[calc(100%-1rem)] w-px bg-border"
                >
                  <motion.span
                    className="block w-px bg-gradient-to-b from-brand to-transparent"
                    initial={{ height: 0 }}
                    whileInView={{ height: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  />
                </span>
              )}

              {/* Node */}
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className={cn(
                  "absolute left-0 top-1.5 grid h-8 w-8 place-items-center rounded-full border text-xs font-semibold transition-colors",
                  isOpen
                    ? "border-brand bg-brand text-white"
                    : "border-border bg-surface text-muted"
                )}
              >
                {i + 1}
              </motion.span>

              <motion.div
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={cn(
                  "rounded-2xl border bg-surface shadow-soft transition-colors",
                  isOpen ? "border-brand/40" : "border-border"
                )}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left"
                >
                  <span className="text-[15px] font-semibold">
                    {step.title}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="flex gap-2.5 px-4 pb-4 text-sm leading-relaxed text-muted">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                        {step.detail}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
