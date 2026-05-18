"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pause,
  Play,
  RotateCcw,
  UserPlus,
  Trash2,
  Zap,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  TASK_TYPES,
  PRIORITY_RANK,
  PRIORITY_LABEL,
  type TaskType,
  type Priority,
} from "@/lib/queues";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

const TICK_MS = 140;
const MAX_WORKERS = 6;

type TaskStatus = "queued" | "processing" | "done" | "failed";

interface LiveTask {
  uid: number;
  type: TaskType;
  status: TaskStatus;
  progress: number;
  workerId: number | null;
  retries: number;
}

interface Worker {
  id: number;
  taskUid: number | null;
}

interface State {
  tasks: LiveTask[];
  workers: Worker[];
  paused: boolean;
  flaky: boolean;
  done: number;
  failed: number;
  retries: number;
  completedAt: number[]; // timestamps for throughput
  nextUid: number;
}

type Action =
  | { type: "ADD"; taskType: TaskType }
  | { type: "SPIKE" }
  | { type: "TOGGLE_PAUSE" }
  | { type: "TOGGLE_FLAKY" }
  | { type: "ADD_WORKER" }
  | { type: "RETRY_FAILED" }
  | { type: "CLEAR" }
  | { type: "TICK" };

function makeTask(uid: number, type: TaskType): LiveTask {
  return { uid, type, status: "queued", progress: 0, workerId: null, retries: 0 };
}

const initialState: State = {
  tasks: [],
  workers: [
    { id: 1, taskUid: null },
    { id: 2, taskUid: null },
  ],
  paused: false,
  flaky: false,
  done: 0,
  failed: 0,
  retries: 0,
  completedAt: [],
  nextUid: 1,
};

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "ADD":
      return {
        ...s,
        tasks: [...s.tasks, makeTask(s.nextUid, a.taskType)],
        nextUid: s.nextUid + 1,
      };
    case "SPIKE": {
      const burst: LiveTask[] = Array.from({ length: 16 }, (_, i) =>
        makeTask(
          s.nextUid + i,
          TASK_TYPES[Math.floor(Math.random() * TASK_TYPES.length)]
        )
      );
      return { ...s, tasks: [...s.tasks, ...burst], nextUid: s.nextUid + 16 };
    }
    case "TOGGLE_PAUSE":
      return { ...s, paused: !s.paused };
    case "TOGGLE_FLAKY":
      return { ...s, flaky: !s.flaky };
    case "ADD_WORKER":
      return s.workers.length >= MAX_WORKERS
        ? s
        : {
            ...s,
            workers: [
              ...s.workers,
              { id: s.workers.length + 1, taskUid: null },
            ],
          };
    case "RETRY_FAILED":
      return {
        ...s,
        tasks: s.tasks.map((t) =>
          t.status === "failed"
            ? { ...t, status: "queued", progress: 0, retries: t.retries + 1 }
            : t
        ),
        retries:
          s.retries + s.tasks.filter((t) => t.status === "failed").length,
      };
    case "CLEAR":
      return {
        ...initialState,
        workers: s.workers.map((w) => ({ ...w, taskUid: null })),
        flaky: s.flaky,
      };
    case "TICK": {
      if (s.paused) return s;
      const tasks = s.tasks.map((t) => ({ ...t }));
      const workers = s.workers.map((w) => ({ ...w }));
      const byUid = new Map(tasks.map((t) => [t.uid, t]));
      let { done, failed } = s;
      let completedAt = s.completedAt;

      // 1. Advance in-flight work.
      for (const w of workers) {
        if (w.taskUid == null) continue;
        const t = byUid.get(w.taskUid);
        if (!t || t.status !== "processing") {
          w.taskUid = null;
          continue;
        }
        const perTick = (100 * TICK_MS) / (t.type.weight * 460);
        t.progress = Math.min(100, t.progress + perTick);
        if (t.progress >= 100) {
          const fails = s.flaky && Math.random() < t.type.flaky + 0.18;
          if (fails) {
            t.status = "failed";
            failed += 1;
          } else {
            t.status = "done";
            done += 1;
            completedAt = [...completedAt, Date.now()];
          }
          t.workerId = null;
          w.taskUid = null;
        }
      }

      // 2. Assign free workers the highest-priority waiting task (FIFO tie).
      const waiting = tasks
        .filter((t) => t.status === "queued")
        .sort(
          (x, y) =>
            PRIORITY_RANK[x.type.priority] - PRIORITY_RANK[y.type.priority] ||
            x.uid - y.uid
        );
      let wi = 0;
      for (const w of workers) {
        if (w.taskUid != null) continue;
        const next = waiting[wi];
        if (!next) break;
        wi += 1;
        next.status = "processing";
        next.workerId = w.id;
        next.progress = 0;
        w.taskUid = next.uid;
      }

      // Trim long-finished tasks; keep recent for the "done" trail.
      const finished = tasks.filter(
        (t) => t.status === "done" || t.status === "failed"
      );
      const overflow = finished.length - 14;
      const trimmed =
        overflow > 0
          ? tasks.filter(
              (t) =>
                !(
                  (t.status === "done" || t.status === "failed") &&
                  finished.indexOf(t) < overflow
                )
            )
          : tasks;

      const cutoff = Date.now() - 3000;
      return {
        ...s,
        tasks: trimmed,
        workers,
        done,
        failed,
        completedAt: completedAt.filter((ts) => ts > cutoff),
      };
    }
    default:
      return s;
  }
}

/**
 * Section 4 — the core playground. Add tasks, spike traffic, pause /
 * add workers and retry failures, and watch jobs flow through the
 * queue into workers in real time. Priority is respected automatically.
 */
export function QueuePlayground() {
  const [s, dispatch] = useReducer(reducer, initialState);
  const timer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    timer.current = setInterval(() => dispatch({ type: "TICK" }), TICK_MS);
    return () => clearInterval(timer.current);
  }, []);

  const queued = s.tasks.filter((t) => t.status === "queued");
  const processing = s.tasks.filter((t) => t.status === "processing");
  const failedTasks = s.tasks.filter((t) => t.status === "failed");
  const recentDone = s.tasks
    .filter((t) => t.status === "done")
    .slice(-8)
    .reverse();
  const throughput = (s.completedAt.length / 3).toFixed(1);
  const busy = s.workers.filter((w) => w.taskUid != null).length;
  const util = s.workers.length
    ? Math.round((busy / s.workers.length) * 100)
    : 0;

  const taskByUid = useCallback(
    (uid: number | null) =>
      uid == null ? undefined : s.tasks.find((t) => t.uid === uid),
    [s.tasks]
  );

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      {/* 1 · Trigger tasks */}
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
        1 · Add a task to the queue
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {TASK_TYPES.map((tt) => {
          const Icon = getIcon(tt.icon);
          return (
            <button
              key={tt.id}
              onClick={() => dispatch({ type: "ADD", taskType: tt })}
              className="group flex items-center gap-2 rounded-xl border border-border bg-bg px-3 py-2.5 text-left text-xs font-medium transition-colors hover:border-brand/50 hover:bg-brand-soft"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand transition-transform group-hover:scale-110">
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate">{tt.label}</span>
                <PriorityTag p={tt.priority} />
              </span>
            </button>
          );
        })}
      </div>

      {/* 2 · Controls */}
      <p className="mt-6 text-[11px] font-semibold uppercase tracking-wide text-muted">
        2 · Run the system
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Ctrl
          onClick={() => dispatch({ type: "SPIKE" })}
          icon={<Zap className="h-3.5 w-3.5" />}
          label="Simulate traffic spike"
        />
        <Ctrl
          onClick={() => dispatch({ type: "TOGGLE_PAUSE" })}
          icon={
            s.paused ? (
              <Play className="h-3.5 w-3.5" />
            ) : (
              <Pause className="h-3.5 w-3.5" />
            )
          }
          label={s.paused ? "Resume workers" : "Pause workers"}
          active={s.paused}
          tone="warn"
        />
        <Ctrl
          onClick={() => dispatch({ type: "ADD_WORKER" })}
          icon={<UserPlus className="h-3.5 w-3.5" />}
          label={`Add worker (${s.workers.length}/${MAX_WORKERS})`}
          disabled={s.workers.length >= MAX_WORKERS}
        />
        <Ctrl
          onClick={() => dispatch({ type: "RETRY_FAILED" })}
          icon={<RotateCcw className="h-3.5 w-3.5" />}
          label={`Retry failed (${failedTasks.length})`}
          disabled={failedTasks.length === 0}
        />
        <Ctrl
          onClick={() => dispatch({ type: "TOGGLE_FLAKY" })}
          icon={<XCircle className="h-3.5 w-3.5" />}
          label="Flaky providers"
          active={s.flaky}
          tone="bad"
        />
        <Ctrl
          onClick={() => dispatch({ type: "CLEAR" })}
          icon={<Trash2 className="h-3.5 w-3.5" />}
          label="Reset"
        />
      </div>

      {/* Stage: queue → workers → done */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        {/* Queue lane */}
        <div className="rounded-2xl border border-border bg-bg p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              Task queue
            </p>
            <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-bold text-brand tabular-nums">
              {queued.length} waiting
            </span>
          </div>
          <div className="mt-4 flex min-h-[120px] flex-wrap content-start gap-2">
            <AnimatePresence mode="popLayout">
              {queued.length === 0 && (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full py-8 text-center text-xs text-muted"
                >
                  Queue is empty — add a task above
                </motion.p>
              )}
              {queued.slice(0, 18).map((t) => {
                const Icon = getIcon(t.type.icon);
                return (
                  <motion.div
                    key={t.uid}
                    layout
                    initial={{ opacity: 0, scale: 0.6, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring", stiffness: 320, damping: 24 }}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium",
                      t.type.priority === "high"
                        ? "border-rose-500/40 bg-rose-500/10"
                        : t.type.priority === "low"
                        ? "border-border bg-surface"
                        : "border-brand/30 bg-brand-soft"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-brand" />
                    {t.type.label}
                    {t.retries > 0 && (
                      <span className="text-[9px] text-amber-500">
                        ↻{t.retries}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {queued.length > 18 && (
              <span className="self-center text-[11px] font-semibold text-muted">
                +{queued.length - 18} more
              </span>
            )}
          </div>

          {/* Failed tray */}
          <AnimatePresence>
            {failedTasks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-500">
                  <XCircle className="h-3.5 w-3.5" />
                  {failedTasks.length} failed — hit “Retry failed”
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Workers */}
        <div className="rounded-2xl border border-border bg-bg p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              Background workers
            </p>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[11px] font-bold tabular-nums",
                s.paused
                  ? "bg-amber-500/15 text-amber-500"
                  : "bg-emerald-500/15 text-emerald-500"
              )}
            >
              {s.paused ? "paused" : `${busy}/${s.workers.length} busy`}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {s.workers.map((w) => {
              const t = taskByUid(w.taskUid);
              const Icon = t ? getIcon(t.type.icon) : null;
              return (
                <div
                  key={w.id}
                  className={cn(
                    "rounded-xl border p-3 transition-colors",
                    t
                      ? "border-brand/50 bg-brand-soft"
                      : "border-border bg-surface"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                      Worker {w.id}
                    </span>
                    {t ? (
                      <Loader2
                        className={cn(
                          "h-3.5 w-3.5 text-brand",
                          !s.paused && "animate-spin"
                        )}
                      />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-muted/40" />
                    )}
                  </div>
                  {t && Icon ? (
                    <>
                      <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium">
                        <Icon className="h-3.5 w-3.5 text-brand" />
                        <span className="truncate">{t.type.label}</span>
                      </p>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                        <motion.div
                          className="h-full rounded-full bg-brand"
                          animate={{ width: `${t.progress}%` }}
                          transition={{ duration: TICK_MS / 1000 }}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="mt-2 text-[11px] text-muted">Idle — waiting</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Completed trail */}
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-muted">
            Recently completed
          </p>
          <div className="mt-2 flex min-h-[34px] flex-wrap gap-1.5">
            <AnimatePresence mode="popLayout">
              {recentDone.length === 0 && (
                <span className="text-[11px] text-muted">Nothing yet</span>
              )}
              {recentDone.map((t) => {
                const Icon = getIcon(t.type.icon);
                return (
                  <motion.span
                    key={t.uid}
                    layout
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
                  >
                    <Icon className="h-3 w-3" />
                    <CheckCircle2 className="h-3 w-3" />
                  </motion.span>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Live metrics */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Metric label="Queue length" value={`${queued.length}`} />
        <Metric label="Processing" value={`${processing.length}`} tone="brand" />
        <Metric label="Throughput" value={`${throughput}/s`} tone="ok" />
        <Metric label="Completed" value={`${s.done}`} tone="ok" />
        <Metric
          label="Failed"
          value={`${s.failed}`}
          tone={s.failed ? "bad" : "neutral"}
        />
        <Metric label="Worker use" value={`${util}%`} tone="brand" />
      </div>

      <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="inline-flex items-center gap-1.5 font-semibold text-brand">
          <Zap className="h-4 w-4" /> Try this:
        </span>{" "}
        Hit “Simulate traffic spike” — the queue balloons but nothing crashes.
        Now “Add worker” a couple of times and watch the backlog drain faster.
        Notice high-priority tasks (Order, Payment, OTP) always jump ahead.
      </p>
    </div>
  );
}

function PriorityTag({ p }: { p: Priority }) {
  return (
    <span
      className={cn(
        "block text-[9px] font-semibold uppercase tracking-wide",
        p === "high"
          ? "text-rose-500"
          : p === "low"
          ? "text-muted"
          : "text-brand"
      )}
    >
      {PRIORITY_LABEL[p]}
    </span>
  );
}

function Ctrl({
  onClick,
  icon,
  label,
  active,
  disabled,
  tone = "brand",
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  tone?: "brand" | "warn" | "bad";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        active
          ? tone === "warn"
            ? "border-amber-500/40 bg-amber-500/10 text-amber-500"
            : tone === "bad"
            ? "border-rose-500/40 bg-rose-500/10 text-rose-500"
            : "border-brand/40 bg-brand-soft text-brand"
          : "border-border text-muted hover:border-brand/40 hover:text-fg"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function Metric({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "ok" | "warn" | "bad" | "brand";
}) {
  const tones = {
    neutral: "text-fg",
    ok: "text-emerald-500",
    warn: "text-amber-500",
    bad: "text-rose-500",
    brand: "text-brand",
  };
  return (
    <div className="rounded-xl border border-border bg-bg px-3 py-3 text-center">
      <motion.p
        key={value}
        initial={{ opacity: 0.5, y: -2 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("text-base font-bold tabular-nums", tones[tone])}
      >
        {value}
      </motion.p>
      <p className="mt-0.5 text-[11px] text-muted">{label}</p>
    </div>
  );
}
