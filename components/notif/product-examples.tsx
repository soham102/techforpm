"use client";

import { motion } from "framer-motion";
import { getIcon, type IconName } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface Example {
  app: string;
  icon: IconName;
  title: string;
  body: string;
  urgency: "Critical" | "High" | "Medium" | "Low";
  why: string;
}

const EXAMPLES: Example[] = [
  {
    app: "QuickBite",
    icon: "bag",
    title: "Your order is arriving! 🛵",
    body: "Rahul is 2 minutes away. Please be available.",
    urgency: "Critical",
    why: "Time-sensitive and expected — the user is actively waiting for exactly this.",
  },
  {
    app: "WhatsApp",
    icon: "message",
    title: "Aanya: Are we still on for 8? 🍕",
    body: "Tap to reply",
    urgency: "High",
    why: "Personal and conversational — delay makes it feel broken.",
  },
  {
    app: "Blinkit",
    icon: "bike",
    title: "Out for delivery — arriving in 9 min",
    body: "Your groceries are on the way.",
    urgency: "High",
    why: "Logistics update the user planned their time around.",
  },
  {
    app: "Instagram",
    icon: "heart",
    title: "rohan_k and 12 others liked your photo",
    body: "See what people are saying",
    urgency: "Low",
    why: "Engagement bait — pleasant but safe to batch or delay.",
  },
  {
    app: "YouTube",
    icon: "film",
    title: "MrCreator just posted: “I tried this for 30 days”",
    body: "New video · 14:02",
    urgency: "Medium",
    why: "Opt-in interest signal — valued, but not urgent.",
  },
];

const URGENCY: Record<Example["urgency"], string> = {
  Critical: "bg-rose-500/15 text-rose-500",
  High: "bg-amber-500/15 text-amber-500",
  Medium: "bg-brand-soft text-brand",
  Low: "bg-emerald-500/15 text-emerald-500",
};

/**
 * Section 11 — the same mechanism across apps you use daily, sorted
 * by how urgent the message actually is.
 */
export function ProductExamples() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EXAMPLES.map((e, i) => {
          const Icon = getIcon(e.icon);
          return (
            <motion.div
              key={e.app}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className="flex flex-col rounded-2xl border border-border bg-bg p-5 shadow-soft transition-shadow hover:shadow-soft-lg"
            >
              {/* mini lock-screen card */}
              <div className="rounded-xl border border-brand/30 bg-surface px-3 py-2.5 shadow-glow">
                <div className="flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded bg-brand text-white">
                    <Icon className="h-3 w-3" />
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                    {e.app}
                  </span>
                  <span className="ml-auto text-[9px] text-muted">now</span>
                </div>
                <p className="mt-1.5 text-[12px] font-semibold leading-tight">
                  {e.title}
                </p>
                <p className="text-[11px] leading-tight text-muted">
                  {e.body}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                  Urgency
                </span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                    URGENCY[e.urgency]
                  )}
                >
                  {e.urgency}
                </span>
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">
                {e.why}
              </p>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">Notice the pattern: </span>
        the closer a notification is to something the user is actively waiting
        for, the higher its priority — and the more damage it does if it's
        late, wrong, or buried under low-value alerts.
      </p>
    </div>
  );
}
