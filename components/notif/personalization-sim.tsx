"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sliders, Activity, MapPin, User } from "lucide-react";
import { PERSONAS } from "@/lib/notifications";
import { cn } from "@/lib/utils";

/**
 * Section 7 — personalization. Toggle the signals an app can use and
 * watch the same three users receive very different messages.
 */
export function PersonalizationSim() {
  const [prefs, setPrefs] = useState(false);
  const [behavior, setBehavior] = useState(false);
  const [location, setLocation] = useState(false);

  const personalised = prefs || behavior || location;
  const signalCount = [prefs, behavior, location].filter(Boolean).length;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
        Signals the app is allowed to use
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <SignalToggle
          on={prefs}
          onClick={() => setPrefs((v) => !v)}
          icon={<Sliders className="h-3.5 w-3.5" />}
          label="User preferences"
        />
        <SignalToggle
          on={behavior}
          onClick={() => setBehavior((v) => !v)}
          icon={<Activity className="h-3.5 w-3.5" />}
          label="Behaviour history"
        />
        <SignalToggle
          on={location}
          onClick={() => setLocation((v) => !v)}
          icon={<MapPin className="h-3.5 w-3.5" />}
          label="Location"
        />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {PERSONAS.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex flex-col rounded-2xl border border-border bg-bg p-5"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
                <User className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">{p.name}</p>
                <p className="text-[11px] leading-tight text-muted">
                  {p.context}
                </p>
              </div>
            </div>

            <div className="mt-4 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                Notification received
              </p>
              <div className="relative mt-2 min-h-[78px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={personalised ? "p" : "g"}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "rounded-xl border px-3 py-2.5 text-[12px] leading-snug",
                      personalised
                        ? "border-emerald-500/40 bg-emerald-500/10 text-fg shadow-glow"
                        : "border-border bg-surface text-muted"
                    )}
                  >
                    {personalised ? p.personalised : p.generic}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <span
              className={cn(
                "mt-3 inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                personalised
                  ? "bg-emerald-500/15 text-emerald-500"
                  : "bg-border/60 text-muted"
              )}
            >
              {personalised
                ? `Personalised · ${signalCount} signal${
                    signalCount > 1 ? "s" : ""
                  }`
                : "Generic blast"}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-bg p-4 text-center">
          <p className="text-2xl font-bold tabular-nums text-fg">
            {personalised ? `${4 + signalCount * 4}%` : "4%"}
          </p>
          <p className="mt-1 text-[11px] text-muted">
            Estimated open rate
          </p>
        </div>
        <div className="rounded-xl border border-border bg-bg p-4 text-center">
          <p
            className={cn(
              "text-2xl font-bold tabular-nums",
              personalised ? "text-emerald-500" : "text-amber-500"
            )}
          >
            {personalised ? "Relevant" : "Ignored"}
          </p>
          <p className="mt-1 text-[11px] text-muted">
            How users perceive it
          </p>
        </div>
      </div>

      <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">PM insight: </span>
        Relevant notifications improve engagement. The same event, sent with
        context about who the user is and what they want, is opened far more
        often than a one-size-fits-all blast.
      </p>
    </div>
  );
}

function SignalToggle({
  on,
  onClick,
  icon,
  label,
}: {
  on: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors",
        on
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
          : "border-border text-muted hover:text-fg"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
