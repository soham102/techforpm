"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Boxes,
  Rocket,
  GitMerge,
  TriangleAlert,
  CheckCircle2,
  Zap,
  IndianRupee,
} from "lucide-react";
import { TEAMS } from "@/lib/microservices";
import { getIcon } from "@/lib/icons";
import { cn, sleep } from "@/lib/utils";

/* ============ Section 5 — SCALING COMPARISON ============ */

export function ScalingComparison() {
  const [spiked, setSpiked] = useState(false);

  return (
    <div className="space-y-5">
      <button
        onClick={() => setSpiked((v) => !v)}
        className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
      >
        <Zap className="h-4 w-4" />
        {spiked ? "Reset traffic" : "Trigger dinner-time spike"}
      </button>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* monolith */}
        <Panel title="Monolith" tone="amber">
          <p className="text-xs text-muted">
            The whole system scales together — even parts under no load.
          </p>
          <div className="mt-5 flex items-end justify-center">
            <motion.div
              animate={{
                scale: spiked ? 1.35 : 1,
                backgroundColor: spiked
                  ? "rgba(245,158,11,0.18)"
                  : "rgba(99,102,241,0.10)",
              }}
              transition={{ type: "spring", damping: 14 }}
              className="grid h-28 w-28 place-items-center rounded-2xl border-2 border-amber-500/40"
            >
              <Boxes
                className={cn(
                  "h-10 w-10",
                  spiked ? "text-amber-500" : "text-brand"
                )}
              />
            </motion.div>
          </div>
          <div className="mt-6 flex justify-center gap-4 text-xs">
            <Stat
              icon={<IndianRupee className="h-3.5 w-3.5" />}
              label="Cost"
              up={spiked}
            />
            <Stat
              icon={<TriangleAlert className="h-3.5 w-3.5" />}
              label="Bottleneck"
              up={spiked}
            />
          </div>
          {spiked && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center text-xs text-amber-500"
            >
              One huge overloaded server — you pay to scale everything.
            </motion.p>
          )}
        </Panel>

        {/* microservices */}
        <Panel title="Microservices" tone="emerald">
          <p className="text-xs text-muted">
            Only the Order Service scales — others stay exactly as they were.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <div className="text-center">
              <div className="flex gap-2">
                <ServiceChip label="Order" highlight />
                <AnimatePresence>
                  {spiked &&
                    [1, 2, 3].map((n) => (
                      <motion.div
                        key={n}
                        initial={{ opacity: 0, scale: 0, x: -10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ delay: n * 0.12 }}
                      >
                        <ServiceChip label={`Order ${n + 1}`} highlight />
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
              <p className="mt-1 text-[10px] text-emerald-500">
                replicas spawned
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-2 opacity-70">
            {["Auth", "Payment", "Notification"].map((s) => (
              <ServiceChip key={s} label={s} />
            ))}
          </div>
          {spiked && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center text-xs text-emerald-500"
            >
              Other services untouched — you only pay for what's hot.
            </motion.p>
          )}
        </Panel>
      </div>

      <Insight text="Microservices improve scalability efficiency — scale the busy part, not the whole product." />
    </div>
  );
}

function Stat({
  icon,
  label,
  up,
}: {
  icon: React.ReactNode;
  label: string;
  up: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium ring-1 transition-colors",
        up
          ? "bg-amber-500/10 text-amber-500 ring-amber-500/30"
          : "bg-bg text-muted ring-border"
      )}
    >
      {icon}
      {label} {up ? "↑↑" : "—"}
    </span>
  );
}

function ServiceChip({
  label,
  highlight,
}: {
  label: string;
  highlight?: boolean;
}) {
  return (
    <span
      className={cn(
        "rounded-lg border px-2.5 py-2 text-[11px] font-medium",
        highlight
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
          : "border-border bg-bg text-muted"
      )}
    >
      {label}
    </span>
  );
}

/* ============ Section 6 — DEPLOYMENT COMPARISON ============ */

export function DeploymentComparison() {
  const [monoP, setMonoP] = useState(0);
  const [microP, setMicroP] = useState(0);
  const [running, setRunning] = useState(false);

  async function deploy() {
    if (running) return;
    setRunning(true);
    setMonoP(0);
    setMicroP(0);
    // Microservice deploy finishes fast; monolith grinds through everything.
    for (let i = 1; i <= 100; i += 5) {
      setMicroP(Math.min(100, i * 3));
      setMonoP(i);
      await sleep(70);
    }
    setMicroP(100);
    setMonoP(100);
    setRunning(false);
  }

  return (
    <div className="space-y-5">
      <button
        onClick={deploy}
        disabled={running}
        className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
      >
        <Rocket className="h-4 w-4" />
        Ship a notification-feature update
      </button>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Monolith" tone="amber">
          <p className="text-xs text-muted">
            Whole app rebuilt &amp; redeployed — every feature goes down with
            it.
          </p>
          <div className="mt-4 grid grid-cols-5 gap-1.5">
            {["Login", "Pay", "Rest.", "Track", "Notif"].map((f) => (
              <div
                key={f}
                className={cn(
                  "rounded-md border px-1 py-2 text-center text-[10px] transition-colors",
                  monoP > 0 && monoP < 100
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-500"
                    : monoP === 100
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                    : "border-border bg-bg text-muted"
                )}
              >
                {f}
              </div>
            ))}
          </div>
          <Progress value={monoP} tone="amber" />
          <p className="mt-2 text-[11px] text-amber-500">
            Risk: whole platform affected
          </p>
        </Panel>

        <Panel title="Microservices" tone="emerald">
          <p className="text-xs text-muted">
            Only the Notification Service is redeployed — the rest keep
            serving.
          </p>
          <div className="mt-4 grid grid-cols-5 gap-1.5">
            {["Login", "Pay", "Rest.", "Track", "Notif"].map((f) => {
              const target = f === "Notif";
              return (
                <div
                  key={f}
                  className={cn(
                    "rounded-md border px-1 py-2 text-center text-[10px] transition-colors",
                    target && microP > 0 && microP < 100
                      ? "border-brand/50 bg-brand-soft text-brand"
                      : target && microP === 100
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                      : "border-border bg-bg text-muted"
                  )}
                >
                  {f}
                </div>
              );
            })}
          </div>
          <Progress value={microP} tone="emerald" />
          <p className="mt-2 text-[11px] text-emerald-500">
            Risk: isolated to one service
          </p>
        </Panel>
      </div>

      <Insight text="Microservices improve release velocity — small, isolated deploys mean teams ship more often with less risk." />
    </div>
  );
}

function Progress({
  value,
  tone,
}: {
  value: number;
  tone: "amber" | "emerald";
}) {
  return (
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
      <motion.div
        className={cn(
          "h-full rounded-full",
          tone === "amber" ? "bg-amber-500" : "bg-emerald-500"
        )}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}

/* ============ Section 7 — TEAM OWNERSHIP ============ */

export function TeamOwnership() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Monolith — one shared codebase" tone="amber">
        <p className="text-xs text-muted">
          Every team commits to the same code. Changes collide.
        </p>
        <div className="relative mt-6 h-36">
          {["Payments", "Delivery", "Notifs", "Orders"].map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              animate={{ x: [0, i % 2 ? 6 : -6, 0] }}
              transition={{
                x: { duration: 2 + i * 0.3, repeat: Infinity },
              }}
              className="absolute rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-[11px] font-medium text-amber-600 dark:text-amber-400"
              style={{
                left: `${10 + i * 16}%`,
                top: `${i * 26}px`,
              }}
            >
              {t} team commit
            </motion.div>
          ))}
          <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-[11px] font-semibold text-rose-500">
            <GitMerge className="h-3.5 w-3.5" />
            Merge conflict
          </div>
        </div>
        <p className="mt-4 text-[11px] text-amber-500">
          Slow coordination, frequent collisions.
        </p>
      </Panel>

      <Panel title="Microservices — clear ownership" tone="emerald">
        <p className="text-xs text-muted">
          Each team owns one service end-to-end and ships on its own.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {TEAMS.map((t, i) => {
            const Icon = getIcon(t.icon);
            return (
              <motion.div
                key={t.team}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/15 text-emerald-500">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="mt-2 text-xs font-semibold">{t.team}</p>
                <p className="flex items-center gap-1 text-[10px] text-muted">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  owns {t.service}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

/* ============ shared ============ */

function Panel({
  title,
  tone,
  children,
}: {
  title: string;
  tone: "amber" | "emerald";
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "h-2.5 w-2.5 rounded-full",
            tone === "amber" ? "bg-amber-500" : "bg-emerald-500"
          )}
        />
        <h4 className="text-sm font-semibold">{title}</h4>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Insight({ text }: { text: string }) {
  return (
    <p className="rounded-xl bg-brand-soft px-4 py-3 text-sm">
      <span className="font-semibold text-brand">PM insight: </span>
      {text}
    </p>
  );
}
