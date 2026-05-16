"use client";

import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import {
  Smartphone,
  Database,
  Code2,
  Loader2,
  Check,
  Bike,
  MapPin,
  ReceiptText,
  RotateCcw,
  Play,
  Lightbulb,
  Wallet,
  ShoppingCart,
} from "lucide-react";
import {
  CRUD_STEPS,
  INITIAL_ORDER,
  INITIAL_DB_COUNT,
  UPDATED_ADDRESS,
  PERSONA,
  APP_NAME,
  type CrudOp,
  type CrudStep,
  type OrderSnapshot,
} from "@/lib/quickbite";
import { cn, sleep } from "@/lib/utils";

type Phase = "idle" | "running" | "done";

const OP_TONE: Record<CrudOp, string> = {
  GET: "text-sky-500 ring-sky-500/30 bg-sky-500/10",
  POST: "text-emerald-500 ring-emerald-500/30 bg-emerald-500/10",
  PUT: "text-amber-500 ring-amber-500/30 bg-amber-500/10",
  DELETE: "text-rose-500 ring-rose-500/30 bg-rose-500/10",
};

export function QuickBitePlayground() {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<CrudOp>("GET");
  const [order, setOrder] = useState<OrderSnapshot | null>(INITIAL_ORDER);
  const [dbCount, setDbCount] = useState(INITIAL_DB_COUNT);
  const [phase, setPhase] = useState<Phase>("idle");
  const [lastRun, setLastRun] = useState<CrudOp | null>(null);
  const [postStage, setPostStage] = useState(0); // 0 cart →1 pay →2 created
  const [addressJustChanged, setAddressJustChanged] = useState(false);
  const [countDelta, setCountDelta] = useState<null | "+1" | "-1">(null);

  const step = CRUD_STEPS.find((s) => s.op === selected) as CrudStep;
  const wait = (ms: number) => sleep(reduce ? 80 : ms);

  async function run() {
    if (phase === "running") return;
    setPhase("running");
    setLastRun(null);
    setAddressJustChanged(false);
    setCountDelta(null);
    setPostStage(0);

    await wait(700);

    if (selected === "GET") {
      // Read-only: no state change, just resolve.
      await wait(500);
    }

    if (selected === "POST") {
      setPostStage(1); // payment
      await wait(900);
      setPostStage(2); // created
      const fresh: OrderSnapshot = { ...INITIAL_ORDER };
      setOrder(fresh);
      setDbCount((c) => c + 1);
      setCountDelta("+1");
      await wait(400);
    }

    if (selected === "PUT") {
      if (order) {
        setOrder({ ...order, address: UPDATED_ADDRESS });
        setAddressJustChanged(true);
      }
      await wait(500);
    }

    if (selected === "DELETE") {
      if (order) {
        setOrder({ ...order, status: "Cancelled" });
        await wait(700);
        setOrder(null);
        setDbCount((c) => Math.max(0, c - 1));
        setCountDelta("-1");
      }
      await wait(400);
    }

    setLastRun(selected);
    setPhase("done");
  }

  function reset() {
    setPhase("idle");
    setLastRun(null);
    setOrder(INITIAL_ORDER);
    setDbCount(INITIAL_DB_COUNT);
    setPostStage(0);
    setAddressJustChanged(false);
    setCountDelta(null);
    setSelected("GET");
  }

  const responseJson = buildResponse(selected, order, lastRun);

  return (
    <div className="space-y-6">
      {/* Persona */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-brand text-sm font-semibold text-white">
            {PERSONA.initials}
          </span>
          <div>
            <p className="text-sm font-semibold">{PERSONA.name}</p>
            <p className="flex items-center gap-1 text-xs text-muted">
              <MapPin className="h-3 w-3" />
              {PERSONA.location}
            </p>
          </div>
        </div>
        <p className="text-xs text-muted">
          Following one real customer through{" "}
          <span className="font-semibold text-fg">{APP_NAME}</span> — Create,
          Read, Update, Delete.
        </p>
      </div>

      {/* Operation selector */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {CRUD_STEPS.map((s) => {
          const active = s.op === selected;
          return (
            <button
              key={s.op}
              onClick={() => {
                setSelected(s.op);
                setPhase("idle");
                setLastRun(null);
              }}
              className={cn(
                "rounded-xl border p-3 text-left transition-colors",
                active
                  ? "border-brand/50 bg-brand-soft"
                  : "border-border bg-surface hover:border-brand/30"
              )}
            >
              <span
                className={cn(
                  "inline-flex rounded-md px-2 py-0.5 text-[11px] font-bold ring-1",
                  OP_TONE[s.op]
                )}
              >
                {s.op}
              </span>
              <p className="mt-2 text-sm font-semibold">{s.tab}</p>
              <p className="text-[11px] text-muted">{s.crud} operation</p>
            </button>
          );
        })}
      </div>

      {/* Scenario + run */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-brand-soft p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed">
          <span className="font-semibold">Scenario — </span>
          {step.scenario}
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={run}
            disabled={phase === "running"}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {phase === "running" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {phase === "running" ? "Running…" : "Run this step"}
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-medium transition-colors hover:border-brand/40"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Three-lens layout */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel icon={Smartphone} title="What the User Sees">
          <PhonePreview
            order={order}
            phase={phase}
            selected={selected}
            postStage={postStage}
            addressJustChanged={addressJustChanged}
          />
        </Panel>

        <Panel icon={Database} title="What Happens Behind the Scenes">
          <BackendPanel
            order={order}
            dbCount={dbCount}
            countDelta={countDelta}
            step={step}
          />
        </Panel>

        <Panel icon={Code2} title="How the API Helps">
          <ApiPanel
            step={step}
            phase={phase}
            lastRun={lastRun}
            responseJson={responseJson}
          />
        </Panel>
      </div>

      {/* PM insight */}
      <div className="flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
            PM learning insight
          </p>
          <p className="mt-1 text-sm leading-relaxed">{step.insight}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- layout helper ---------- */

function Panel({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Smartphone;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-surface shadow-soft">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-soft text-brand">
          <Icon className="h-4 w-4" />
        </span>
        <h4 className="text-sm font-semibold">{title}</h4>
      </div>
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}

/* ---------- 1. phone preview ---------- */

function PhonePreview({
  order,
  phase,
  selected,
  postStage,
  addressJustChanged,
}: {
  order: OrderSnapshot | null;
  phase: Phase;
  selected: CrudOp;
  postStage: number;
  addressJustChanged: boolean;
}) {
  const loading = phase === "running" && selected === "GET";

  return (
    <div className="mx-auto w-full max-w-[260px] rounded-[1.75rem] border-4 border-border bg-bg p-3 shadow-soft">
      {/* app header */}
      <div className="flex items-center justify-between rounded-xl bg-brand px-3 py-2 text-white">
        <span className="text-xs font-bold">{APP_NAME}</span>
        <span className="text-[10px] opacity-80">{PERSONA.initials}</span>
      </div>

      <div className="mt-3 min-h-[230px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-[230px] flex-col items-center justify-center gap-2 text-muted"
            >
              <Loader2 className="h-5 w-5 animate-spin text-brand" />
              <p className="text-xs">Fetching your order…</p>
            </motion.div>
          ) : phase === "running" && selected === "POST" ? (
            <motion.div
              key="post"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-[230px] flex-col justify-center gap-3"
            >
              <PostStep
                done={postStage >= 0}
                active={postStage === 0}
                icon={ShoppingCart}
                label="Cart confirmed"
              />
              <PostStep
                done={postStage >= 1}
                active={postStage === 1}
                icon={Wallet}
                label="Processing payment…"
              />
              <PostStep
                done={postStage >= 2}
                active={postStage === 2}
                icon={Check}
                label="Order created"
              />
            </motion.div>
          ) : !order ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-[230px] flex-col items-center justify-center gap-2 px-3 text-center text-muted"
            >
              <ReceiptText className="h-6 w-6" />
              <p className="text-xs leading-relaxed">
                No active order. Pick{" "}
                <span className="font-semibold text-fg">Place order</span> to
                start a new one.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={order.status + order.address}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="rounded-xl border border-border bg-surface p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold">{order.restaurant}</p>
                  <StatusPill status={order.status} />
                </div>
                <p className="mt-1 text-[11px] text-muted">{order.item}</p>
                <p className="mt-1 text-xs font-semibold">₹{order.total}</p>
              </div>

              <div className="rounded-xl border border-border bg-surface p-3">
                <div className="flex items-center gap-2">
                  <Bike className="h-4 w-4 text-brand" />
                  <div>
                    <p className="text-[11px] text-muted">Arriving in</p>
                    <p className="text-sm font-bold">{order.eta}</p>
                  </div>
                  <span className="ml-auto text-[11px] text-muted">
                    {order.driver}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-surface p-3">
                <p className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted">
                  <MapPin className="h-3 w-3" /> Delivery address
                </p>
                <motion.p
                  key={order.address}
                  initial={
                    addressJustChanged
                      ? { backgroundColor: "rgba(245,158,11,0.18)" }
                      : false
                  }
                  animate={{ backgroundColor: "rgba(0,0,0,0)" }}
                  transition={{ duration: 1.2 }}
                  className="mt-1 rounded text-[11px] leading-snug"
                >
                  {order.address}
                </motion.p>
                {addressJustChanged && (
                  <p className="mt-1 flex items-center gap-1 text-[10px] font-medium text-emerald-500">
                    <Check className="h-3 w-3" /> Driver re-routed
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PostStep({
  done,
  active,
  icon: Icon,
  label,
}: {
  done: boolean;
  active: boolean;
  icon: typeof Check;
  label: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs transition-colors",
        done
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "border-border bg-surface text-muted"
      )}
    >
      {active && !done ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Icon className="h-4 w-4" />
      )}
      {label}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const cancelled = status === "Cancelled";
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1",
        cancelled
          ? "bg-rose-500/10 text-rose-500 ring-rose-500/30"
          : "bg-emerald-500/10 text-emerald-600 ring-emerald-500/30 dark:text-emerald-400"
      )}
    >
      {status}
    </span>
  );
}

/* ---------- 2. backend / database ---------- */

function BackendPanel({
  order,
  dbCount,
  countDelta,
  step,
}: {
  order: OrderSnapshot | null;
  dbCount: number;
  countDelta: null | "+1" | "-1";
  step: CrudStep;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-bg p-3">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
            orders table
          </p>
          <div className="relative">
            <motion.span
              key={dbCount}
              initial={{ scale: 1.3, color: "rgb(99 102 241)" }}
              animate={{ scale: 1, color: "rgb(var(--fg))" }}
              className="text-sm font-bold tabular-nums"
            >
              {dbCount.toLocaleString()}
            </motion.span>
            <AnimatePresence>
              {countDelta && (
                <motion.span
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: -16 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "absolute -right-1 top-0 text-[10px] font-bold",
                    countDelta === "+1"
                      ? "text-emerald-500"
                      : "text-rose-500"
                  )}
                >
                  {countDelta}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <AnimatePresence mode="popLayout">
            {order ? (
              <motion.div
                key={order.orderId}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className={cn(
                  "overflow-hidden rounded-lg border px-3 py-2 font-mono text-[11px]",
                  order.status === "Cancelled"
                    ? "border-rose-500/30 bg-rose-500/5 text-rose-500"
                    : "border-brand/30 bg-brand-soft"
                )}
              >
                <p>
                  <span className="text-muted">id:</span> {order.orderId}
                </p>
                <p>
                  <span className="text-muted">status:</span> {order.status}
                </p>
                <p className="truncate">
                  <span className="text-muted">addr:</span> {order.address}
                </p>
              </motion.div>
            ) : (
              <motion.p
                key="removed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-lg border border-dashed border-border px-3 py-3 text-center text-[11px] text-muted"
              >
                row removed from active orders
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {!order && step.op === "DELETE" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
        >
          <Wallet className="h-4 w-4" />
          Refund of ₹349 initiated to original payment method
        </motion.div>
      )}

      <p className="text-xs leading-relaxed text-muted">
        {step.behindScenes}
      </p>
    </div>
  );
}

/* ---------- 3. api panel ---------- */

function ApiPanel({
  step,
  phase,
  lastRun,
  responseJson,
}: {
  step: CrudStep;
  phase: Phase;
  lastRun: CrudOp | null;
  responseJson: object;
}) {
  const showResponse = phase === "done" && lastRun === step.op;
  return (
    <div className="space-y-3">
      <div className="rounded-lg bg-[#0b0c12] p-3 font-mono text-[11.5px] text-slate-300">
        <p>
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-[10px] font-bold ring-1",
              OP_TONE[step.op]
            )}
          >
            {step.method}
          </span>{" "}
          <span className="text-slate-400">{step.endpoint}</span>
        </p>
        {step.requestBody && (
          <pre className="mt-2 whitespace-pre-wrap break-words text-slate-500">
            {JSON.stringify(step.requestBody, null, 2)}
          </pre>
        )}
        <div className="mt-3 border-t border-white/10 pt-2">
          <AnimatePresence mode="wait">
            {phase === "running" ? (
              <motion.p
                key="run"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-slate-500"
              >
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                awaiting response…
              </motion.p>
            ) : showResponse ? (
              <motion.pre
                key="res"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="whitespace-pre-wrap break-words"
              >
                {JSON.stringify(responseJson, null, 2)}
              </motion.pre>
            ) : (
              <motion.p
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-slate-600"
              >
                {"// press “Run this step” to send"}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-muted">{step.apiHelps}</p>
      <div className="rounded-lg border border-border bg-bg px-3 py-2 text-xs">
        <span className="font-semibold">{step.op}</span> maps to{" "}
        <span className="font-semibold text-brand">{step.crud}</span> in CRUD —{" "}
        {step.userSees}
      </div>
    </div>
  );
}

/* ---------- response builder ---------- */

function buildResponse(
  op: CrudOp,
  order: OrderSnapshot | null,
  lastRun: CrudOp | null
): object {
  if (lastRun !== op) return {};
  switch (op) {
    case "GET":
      return order
        ? { status: 200, data: order }
        : { status: 404, error: "No active order found" };
    case "POST":
      return {
        status: 201,
        message: "Order created",
        data: { orderId: order?.orderId, status: order?.status },
      };
    case "PUT":
      return {
        status: 200,
        message: "Order updated",
        data: { orderId: order?.orderId, address: order?.address },
      };
    case "DELETE":
      return {
        status: 200,
        message: "Order cancelled",
        data: { refund: "initiated", amount: 349 },
      };
  }
}
