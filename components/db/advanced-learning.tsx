"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Store,
  ReceiptText,
  Zap,
  BookOpen,
  Loader2,
  Bike,
  Gauge,
} from "lucide-react";
import { cn, sleep } from "@/lib/utils";

/* ============ 1. RELATIONAL VIEW ============ */

const REL_USERS = [
  { id: "u1", name: "Rahul", orders: ["o1", "o2"] },
  { id: "u2", name: "Aisha", orders: ["o3"] },
];
const REL_ORDERS = [
  { id: "o1", label: "ORD-4815 · Burger", rest: "r1" },
  { id: "o2", label: "ORD-4820 · Fries", rest: "r1" },
  { id: "o3", label: "ORD-4816 · Pizza", rest: "r2" },
];
const REL_RESTAURANTS = [
  { id: "r1", name: "Burger Barn" },
  { id: "r2", name: "Pizza Town" },
];

export function RelationalView() {
  const [activeUser, setActiveUser] = useState<string | null>("u1");

  const linked = (orderId: string) =>
    activeUser
      ? REL_USERS.find((u) => u.id === activeUser)?.orders.includes(orderId)
      : true;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <p className="text-sm leading-relaxed text-muted">
        Tap a customer. Notice one customer connects to{" "}
        <span className="font-semibold text-fg">many orders</span> — but each
        order belongs to exactly one customer and one restaurant. That link is
        what “relational” means.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-8">
        {/* Users */}
        <div className="space-y-3">
          <ColTitle icon={<User className="h-3.5 w-3.5" />} label="Users" />
          {REL_USERS.map((u) => (
            <button
              key={u.id}
              onClick={() => setActiveUser(u.id)}
              className={cn(
                "w-full rounded-xl border px-3 py-3 text-sm font-medium transition-colors",
                activeUser === u.id
                  ? "border-brand/50 bg-brand-soft text-brand"
                  : "border-border bg-bg hover:border-brand/30"
              )}
            >
              {u.name}
            </button>
          ))}
        </div>

        {/* Orders */}
        <div className="space-y-3">
          <ColTitle
            icon={<ReceiptText className="h-3.5 w-3.5" />}
            label="Orders"
          />
          {REL_ORDERS.map((o) => {
            const on = linked(o.id);
            return (
              <motion.div
                key={o.id}
                animate={{ opacity: on ? 1 : 0.25, scale: on ? 1 : 0.97 }}
                className={cn(
                  "rounded-xl border px-3 py-3 text-xs",
                  on
                    ? "border-brand/40 bg-brand-soft"
                    : "border-border bg-bg"
                )}
              >
                {o.label}
              </motion.div>
            );
          })}
        </div>

        {/* Restaurants */}
        <div className="space-y-3">
          <ColTitle icon={<Store className="h-3.5 w-3.5" />} label="Restaurants" />
          {REL_RESTAURANTS.map((r) => {
            const on =
              !activeUser ||
              REL_ORDERS.some(
                (o) =>
                  o.rest === r.id &&
                  REL_USERS.find((u) => u.id === activeUser)?.orders.includes(
                    o.id
                  )
              );
            return (
              <motion.div
                key={r.id}
                animate={{ opacity: on ? 1 : 0.25 }}
                className={cn(
                  "rounded-xl border px-3 py-3 text-sm font-medium",
                  on
                    ? "border-brand/40 bg-brand-soft"
                    : "border-border bg-bg"
                )}
              >
                {r.name}
              </motion.div>
            );
          })}
        </div>
      </div>

      <p className="mt-6 rounded-xl border border-border bg-bg px-4 py-3 text-sm">
        <span className="font-semibold">In plain terms: </span>
        “One customer can have many orders.” Storing customers once and
        linking orders to them avoids duplicating the same person everywhere.
      </p>
    </div>
  );
}

function ColTitle({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
      <span className="text-brand">{icon}</span>
      {label}
    </p>
  );
}

/* ============ 2. INDEXING DEMO ============ */

const INDEX_ROWS = [
  "Burger Barn",
  "Curry House",
  "Sushi Spot",
  "Taco Stand",
  "Pizza Town",
  "Wok & Roll",
];
const TARGET = "Pizza Town";

export function IndexDemo() {
  const [scanIdx, setScanIdx] = useState<number | null>(null);
  const [mode, setMode] = useState<null | "slow" | "fast">(null);
  const [running, setRunning] = useState(false);

  async function runSlow() {
    if (running) return;
    setRunning(true);
    setMode("slow");
    for (let i = 0; i < INDEX_ROWS.length; i++) {
      setScanIdx(i);
      await sleep(420);
      if (INDEX_ROWS[i] === TARGET) break;
    }
    setRunning(false);
  }
  async function runFast() {
    if (running) return;
    setRunning(true);
    setMode("fast");
    setScanIdx(null);
    await sleep(180);
    setScanIdx(INDEX_ROWS.indexOf(TARGET));
    setRunning(false);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <p className="text-sm leading-relaxed text-muted">
        An index is like the index at the back of a book — instead of reading
        every page, you jump straight to the right one. Find{" "}
        <span className="font-semibold text-fg">“{TARGET}”</span> during the
        dinner rush:
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={runSlow}
          disabled={running}
          className="rounded-xl border border-border bg-bg px-4 py-2.5 text-sm font-medium transition-colors hover:border-rose-500/40 disabled:opacity-60"
        >
          Search without index
        </button>
        <button
          onClick={runFast}
          disabled={running}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          <Zap className="h-4 w-4" />
          Search with index
        </button>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <div className="space-y-1.5">
          {INDEX_ROWS.map((r, i) => {
            const scanning = mode === "slow" && scanIdx === i;
            const found =
              scanIdx !== null && INDEX_ROWS[scanIdx] === TARGET && r === TARGET;
            return (
              <motion.div
                key={r}
                animate={{
                  backgroundColor: found
                    ? "rgba(16,185,129,0.18)"
                    : scanning
                    ? "rgba(244,63,94,0.16)"
                    : "rgba(0,0,0,0)",
                }}
                className="rounded-lg border border-border px-3 py-2 text-xs"
              >
                {r}
                {scanning && (
                  <span className="ml-2 text-[10px] text-rose-500">
                    checking…
                  </span>
                )}
                {found && (
                  <span className="ml-2 text-[10px] font-semibold text-emerald-500">
                    found
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
        <div className="flex flex-col justify-center gap-3 rounded-xl border border-border bg-bg p-4 text-sm">
          {mode === "slow" && (
            <p className="flex items-center gap-2 text-rose-500">
              <BookOpen className="h-4 w-4" />
              Reading every row, one by one — slow at scale.
            </p>
          )}
          {mode === "fast" && (
            <p className="flex items-center gap-2 text-emerald-500">
              <Zap className="h-4 w-4" />
              Jumped straight to the answer — near-instant.
            </p>
          )}
          {mode === null && (
            <p className="text-muted">Run both to feel the difference.</p>
          )}
          <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
            PM insight: better database performance directly improves app
            speed — indexes are a common, low-cost win.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============ 3. LATENCY DEMO ============ */

export function LatencyDemo() {
  const [speed, setSpeed] = useState<"fast" | "slow">("fast");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  async function load() {
    setState("loading");
    await sleep(speed === "fast" ? 500 : 4200);
    setState("done");
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <p className="text-sm leading-relaxed text-muted">
        Same screen, same code — only the database response speed changes.
        Watch how it feels to the user.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-xl border border-border p-1">
          {(["fast", "slow"] as const).map((s) => (
            <button
              key={s}
              onClick={() => {
                setSpeed(s);
                setState("idle");
              }}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                speed === s
                  ? "bg-brand text-white"
                  : "text-muted hover:text-fg"
              )}
            >
              {s} database
            </button>
          ))}
        </div>
        <button
          onClick={load}
          disabled={state === "loading"}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          <Gauge className="h-4 w-4" />
          Load order tracking
        </button>
      </div>

      <div className="mt-5 grid min-h-[150px] place-items-center rounded-xl border border-border bg-bg p-5">
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.p
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-muted"
            >
              Press “Load order tracking”.
            </motion.p>
          )}
          {state === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2 text-muted"
            >
              <Loader2 className="h-6 w-6 animate-spin text-brand" />
              <p className="text-xs">
                {speed === "slow"
                  ? "Still waiting on the database…"
                  : "Fetching…"}
              </p>
            </motion.div>
          )}
          {state === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-xs rounded-xl border border-border bg-surface p-4"
            >
              <div className="flex items-center gap-2">
                <Bike className="h-4 w-4 text-brand" />
                <div>
                  <p className="text-[11px] text-muted">Arriving in</p>
                  <p className="text-sm font-bold">16 min · Imran K.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p
        className={cn(
          "mt-4 rounded-xl px-4 py-3 text-sm",
          speed === "slow"
            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        )}
      >
        {speed === "slow"
          ? "A 4-second wait every time feels broken — users refresh, rage-tap, and churn."
          : "Sub-second responses feel instant — users trust the app and keep ordering."}
      </p>
    </div>
  );
}
