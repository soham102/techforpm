"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getIcon } from "@/lib/icons";
import { NOTIF_TYPES } from "@/lib/notifications";
import { cn } from "@/lib/utils";

const TONES: Record<
  string,
  { ring: string; chip: string; icon: string }
> = {
  transactional: {
    ring: "hover:border-emerald-500/40",
    chip: "bg-emerald-500/15 text-emerald-500",
    icon: "bg-emerald-500/15 text-emerald-500",
  },
  engagement: {
    ring: "hover:border-amber-500/40",
    chip: "bg-amber-500/15 text-amber-500",
    icon: "bg-amber-500/15 text-amber-500",
  },
  realtime: {
    ring: "hover:border-brand/50",
    chip: "bg-brand-soft text-brand",
    icon: "bg-brand-soft text-brand",
  },
};

/** Section 8 — the three shapes notifications take, with examples. */
export function NotifTypes() {
  const [open, setOpen] = useState<string | null>(NOTIF_TYPES[0].id);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {NOTIF_TYPES.map((t, i) => {
        const Icon = getIcon(t.icon);
        const tone = TONES[t.tone];
        const active = open === t.id;
        return (
          <motion.button
            key={t.id}
            type="button"
            onClick={() => setOpen(active ? null : t.id)}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className={cn(
              "flex flex-col rounded-2xl border bg-surface p-6 text-left shadow-soft transition-all",
              active ? "border-brand/50 shadow-soft-lg" : "border-border",
              tone.ring
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-xl",
                  tone.icon
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                  tone.chip
                )}
              >
                {t.name}
              </span>
            </div>

            <h3 className="mt-4 text-base font-semibold">{t.name}</h3>
            <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted">
              {t.plain}
            </p>

            <div className="mt-4 space-y-1.5 border-t border-border/70 pt-4">
              {t.examples.map((ex) => (
                <p
                  key={ex}
                  className="flex items-center gap-2 text-[12px] text-muted"
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      tone.chip.split(" ")[0]
                    )}
                  />
                  {ex}
                </p>
              ))}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
