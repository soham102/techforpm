"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Network, Database, ArrowDown } from "lucide-react";
import {
  SERVICES,
  USER_ACTIONS,
  type ServiceId,
  type UserAction,
} from "@/lib/microservices";
import { getIcon } from "@/lib/icons";
import { cn, sleep } from "@/lib/utils";

type SvcState = "idle" | "processing" | "done";

/**
 * Section 4 — requests enter an API gateway and route only to the
 * services they need. Untouched services stay completely idle.
 */
export function MicroservicesPlayground() {
  const [states, setStates] = useState<Record<ServiceId, SvcState>>(
    () =>
      Object.fromEntries(SERVICES.map((s) => [s.id, "idle"])) as Record<
        ServiceId,
        SvcState
      >
  );
  const [active, setActive] = useState<UserAction | null>(null);
  const [routing, setRouting] = useState(false);

  async function trigger(action: UserAction) {
    if (routing) return;
    setActive(action);
    setRouting(true);
    setStates(
      Object.fromEntries(SERVICES.map((s) => [s.id, "idle"])) as Record<
        ServiceId,
        SvcState
      >
    );
    await sleep(500);
    setStates((prev) => {
      const next = { ...prev };
      action.services.forEach((id) => (next[id] = "processing"));
      return next;
    });
    await sleep(1000);
    setStates((prev) => {
      const next = { ...prev };
      action.services.forEach((id) => (next[id] = "done"));
      return next;
    });
    setRouting(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {USER_ACTIONS.map((a) => {
          const Icon = getIcon(a.icon);
          return (
            <button
              key={a.id}
              onClick={() => trigger(a)}
              disabled={routing}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0",
                active?.id === a.id
                  ? "border-brand/50 bg-brand-soft text-brand"
                  : "border-border bg-surface hover:border-brand/40"
              )}
            >
              <Icon className="h-4 w-4" />
              {a.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        {/* frontend */}
        <Tier icon={<Smartphone className="h-4 w-4" />} label="Frontend" />
        <Connector />

        {/* gateway */}
        <motion.div
          animate={
            routing
              ? {
                  boxShadow: [
                    "0 0 0 0 rgba(99,102,241,0)",
                    "0 0 0 6px rgba(99,102,241,0.18)",
                    "0 0 0 0 rgba(99,102,241,0)",
                  ],
                }
              : {}
          }
          transition={{ duration: 0.9, repeat: routing ? Infinity : 0 }}
          className="mx-auto flex w-full max-w-sm items-center justify-center gap-2 rounded-xl border-2 border-brand/40 bg-brand-soft py-3 text-sm font-semibold text-brand"
        >
          <Network className="h-4 w-4" />
          API Gateway
        </motion.div>
        <Connector />

        {/* services */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {SERVICES.map((svc) => {
            const Icon = getIcon(svc.icon);
            const st = states[svc.id];
            const involved = active?.services.includes(svc.id);
            return (
              <motion.div
                key={svc.id}
                animate={{
                  opacity: active ? (involved ? 1 : 0.4) : 1,
                  scale: st === "processing" ? 1.03 : 1,
                }}
                className={cn(
                  "rounded-xl border p-4 transition-colors",
                  st === "processing"
                    ? "border-brand/50 bg-brand-soft"
                    : st === "done"
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : "border-border bg-bg"
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "grid h-8 w-8 place-items-center rounded-lg",
                      st === "done"
                        ? "bg-emerald-500/20 text-emerald-500"
                        : "bg-surface text-brand"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <Health state={st} />
                </div>
                <p className="mt-3 text-xs font-semibold">{svc.name}</p>
                <p className="mt-0.5 text-[10px] text-muted">
                  {st === "processing"
                    ? "processing…"
                    : st === "done"
                    ? "responded"
                    : "idle"}
                </p>
              </motion.div>
            );
          })}
        </div>

        <Connector />
        <Tier
          icon={<Database className="h-4 w-4" />}
          label="Each service → its own database"
        />
      </div>

      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-border bg-bg p-4 text-sm"
          >
            <span className="font-semibold">{active.label}: </span>
            {active.note}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Tier({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="mx-auto flex w-full max-w-sm items-center justify-center gap-2 rounded-xl border border-border bg-bg py-3 text-sm font-medium">
      <span className="text-brand">{icon}</span>
      {label}
    </div>
  );
}

function Connector() {
  return (
    <div className="flex justify-center py-2 text-muted">
      <ArrowDown className="h-4 w-4" />
    </div>
  );
}

function Health({ state }: { state: SvcState }) {
  const color =
    state === "processing"
      ? "bg-brand"
      : state === "done"
      ? "bg-emerald-500"
      : "bg-muted/40";
  return (
    <span className="relative flex h-2 w-2">
      {state === "processing" && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
      )}
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", color)} />
    </span>
  );
}
