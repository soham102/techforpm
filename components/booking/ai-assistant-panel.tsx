"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Lock, ShieldAlert } from "lucide-react";
import { AI_SUGGESTIONS } from "@/lib/booking-conflict";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function AIAssistantPanel() {
  const [activeId, setActiveId] = useState<string>(AI_SUGGESTIONS[0].id);
  const active = AI_SUGGESTIONS.find((s) => s.id === activeId)!;
  const ActiveIcon = getIcon(active.icon);

  return (
    <div className="grid gap-5 md:grid-cols-[1.1fr_1fr]">
      {/* Left: pickable suggestions */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft md:p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-500/10 text-sky-500">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold">AI Assistant — experience layer</p>
            <p className="text-xs text-muted">
              Three things the model is allowed to do
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {AI_SUGGESTIONS.map((s) => {
            const Icon = getIcon(s.icon);
            const isActive = s.id === activeId;
            return (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all",
                  isActive
                    ? "border-sky-500/40 bg-sky-500/10"
                    : "border-border bg-surface hover:border-brand/30"
                )}
              >
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-lg",
                    isActive
                      ? "bg-sky-500 text-white"
                      : "bg-brand-soft text-brand"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{s.title}</p>
                  <p className="truncate text-xs text-muted">{s.body}</p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                    isActive
                      ? "bg-sky-500 text-white"
                      : "bg-brand-soft text-brand"
                  )}
                >
                  {s.badge}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs leading-relaxed text-rose-700 dark:text-rose-300">
          <p className="flex items-center gap-2 font-semibold">
            <ShieldAlert className="h-3.5 w-3.5" />
            Hard product guardrail
          </p>
          <p className="mt-1">
            The AI cannot allocate or confirm a slot. It can only{" "}
            <span className="font-semibold">suggest</span>, never{" "}
            <span className="font-semibold">decide</span>.
          </p>
        </div>
      </div>

      {/* Right: live preview of the selected suggestion */}
      <div className="rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-500/5 to-transparent p-5 shadow-soft md:p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-500">
          Live preview
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-4"
          >
            <div className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-500 text-white">
                <ActiveIcon className="h-5 w-5" />
              </span>
              <p className="text-base font-semibold">{active.title}</p>
            </div>

            {active.id === "alt-slot" && (
              <div className="space-y-2">
                {[
                  { time: "17:00", state: "Taken", taken: true },
                  { time: "18:30", state: "Open · held 60s" },
                  { time: "19:15", state: "Open" },
                ].map((row) => (
                  <div
                    key={row.time}
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-3 py-2 text-sm",
                      row.taken
                        ? "border-border bg-surface text-muted line-through"
                        : "border-sky-500/30 bg-surface"
                    )}
                  >
                    <span className="font-mono font-semibold">{row.time}</span>
                    <span className="text-xs">{row.state}</span>
                  </div>
                ))}
              </div>
            )}

            {active.id === "nearby" && (
              <div className="space-y-2">
                {[
                  { name: "Dr. Iyer", km: "0.8 km", rating: "4.8★" },
                  { name: "Dr. Roy", km: "1.4 km", rating: "4.7★" },
                  { name: "Dr. Khan", km: "1.9 km", rating: "4.9★" },
                ].map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-2 text-sm"
                  >
                    <span className="font-medium">{p.name}</span>
                    <span className="font-mono text-xs text-muted">
                      {p.km} · {p.rating}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {active.id === "empathy" && (
              <div className="space-y-3">
                <div className="rounded-xl border border-sky-500/30 bg-surface px-4 py-3 text-sm italic leading-relaxed">
                  “Sorry Aanya — that slot was just booked. We&apos;ve held{" "}
                  <span className="not-italic font-semibold">two great</span>{" "}
                  alternatives for you for the next 90 seconds.”
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] font-medium uppercase tracking-wider text-muted">
                  {["Tone: warm", "PII-safe", "<160 chars"].map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border bg-surface px-2 py-0.5"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-start gap-2 rounded-xl border border-border bg-bg/40 px-3 py-2 text-[11px] leading-relaxed text-muted">
              <Lock className="mt-0.5 h-3 w-3 shrink-0 text-brand" />
              Selecting any of the above never grants the original slot —
              that decision already belongs to the Redis lock.
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
