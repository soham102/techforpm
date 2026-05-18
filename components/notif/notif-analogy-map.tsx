"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Store, Bike, Smartphone, RefreshCw, BellRing } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { ANALOGY_PAIRS } from "@/lib/notifications";
import { cn } from "@/lib/utils";

/**
 * Section 1 — the courier-delivery analogy. A message travels
 * restaurant → courier → customer, plus a toggle contrasting life
 * without notifications (refreshing manually) vs with them.
 */
export function NotifAnalogyMap() {
  const [withNotif, setWithNotif] = useState(true);
  const reduce = useReducedMotion();

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      {/* The courier journey */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-bg p-6 md:p-8">
        <div className="flex items-center justify-between gap-3">
          <Stop icon={<Store className="h-6 w-6" />} label="Restaurant" sub="has an update" />

          <div className="relative h-16 flex-1">
            <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-border" />
            {!reduce &&
              [0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="absolute top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-brand text-white shadow-glow"
                  initial={{ left: "0%" }}
                  animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    delay: i * 0.9,
                    ease: "easeInOut",
                  }}
                >
                  <BellRing className="h-4 w-4" />
                </motion.span>
              ))}
          </div>

          <Stop
            icon={<Bike className="h-6 w-6" />}
            label="Courier"
            sub="carries it"
            accent
          />

          <div className="relative h-16 flex-1">
            <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-border" />
            {!reduce &&
              [0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="absolute top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-brand text-white shadow-glow"
                  initial={{ left: "0%" }}
                  animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    delay: i * 0.9 + 0.45,
                    ease: "easeInOut",
                  }}
                >
                  <BellRing className="h-4 w-4" />
                </motion.span>
              ))}
          </div>

          <Stop
            icon={<Smartphone className="h-6 w-6" />}
            label="Customer"
            sub="gets the message"
          />
        </div>

        <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-center text-sm font-medium text-brand">
          The restaurant never walks the food over itself. It hands the update
          to a courier, who delivers it to your door — even when you're not
          watching.
        </p>
      </div>

      {/* Without vs with notifications */}
      <div className="mt-7 flex flex-wrap gap-2">
        <button
          onClick={() => setWithNotif(false)}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            !withNotif
              ? "bg-amber-500/15 text-amber-500"
              : "border border-border text-muted hover:text-fg"
          )}
        >
          <RefreshCw className="h-4 w-4" />
          Without notifications
        </button>
        <button
          onClick={() => setWithNotif(true)}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            withNotif
              ? "bg-emerald-500/15 text-emerald-500"
              : "border border-border text-muted hover:text-fg"
          )}
        >
          <BellRing className="h-4 w-4" />
          With notifications
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <PhoneScene reduce={reduce} mode="without" active={!withNotif} />
        <PhoneScene reduce={reduce} mode="with" active={withNotif} />
      </div>

      {/* Mapping grid */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {ANALOGY_PAIRS.map((p, i) => {
          const Icon = getIcon(p.icon);
          return (
            <motion.div
              key={p.tech}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-border bg-bg p-4"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 text-sm">
                  <p className="font-semibold">{p.tech}</p>
                  <p className="text-muted">{p.real}</p>
                </div>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-muted">
                {p.plain}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Stop({
  icon,
  label,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div className="text-center">
      <span
        className={cn(
          "grid h-14 w-14 place-items-center rounded-2xl border",
          accent
            ? "border-brand/40 bg-brand-soft text-brand shadow-glow"
            : "border-border bg-surface text-brand"
        )}
      >
        {icon}
      </span>
      <p className="mt-2 text-xs font-semibold">{label}</p>
      <p className="text-[11px] text-muted">{sub}</p>
    </div>
  );
}

function PhoneScene({
  mode,
  active,
  reduce,
}: {
  mode: "with" | "without";
  active: boolean;
  reduce: boolean | null;
}) {
  const without = mode === "without";
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 transition-colors",
        active
          ? without
            ? "border-amber-500/40 bg-amber-500/5"
            : "border-emerald-500/40 bg-emerald-500/5"
          : "border-border bg-bg opacity-60"
      )}
    >
      <p
        className={cn(
          "text-sm font-semibold",
          without ? "text-amber-500" : "text-emerald-500"
        )}
      >
        {without ? "Without notifications" : "With notifications"}
      </p>

      <div className="mx-auto mt-4 h-44 w-28 rounded-[1.4rem] border-2 border-border bg-surface p-2">
        {without ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <motion.span
              animate={
                active && !reduce
                  ? { rotate: [0, -18, 18, 0] }
                  : {}
              }
              transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 0.6 }}
              className="text-2xl"
            >
              🔄
            </motion.span>
            <p className="text-[10px] leading-tight text-muted">
              User keeps reopening the app to check “any update yet?”
            </p>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <AnimatePresence>
              {active && (
                <motion.div
                  initial={{ opacity: 0, y: -14, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="w-full rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2 py-1.5 text-left shadow-glow"
                >
                  <p className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
                    QuickBite
                  </p>
                  <p className="text-[9px] leading-tight text-fg">
                    Your order is arriving! 🛵
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <p className="text-[10px] leading-tight text-muted">
              The app tells the user the instant something changes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
