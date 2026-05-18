"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Store,
  Inbox,
  Send,
  Smartphone,
  Clock,
  XCircle,
  RotateCcw,
  BellOff,
  Zap,
} from "lucide-react";
import { getIcon } from "@/lib/icons";
import { NOTIF_EVENTS, type NotifEvent } from "@/lib/notifications";
import { cn, sleep } from "@/lib/utils";

type Status = "created" | "queued" | "sending" | "delivered" | "opened" | "failed";

interface LiveNotif extends NotifEvent {
  uid: number;
  status: Status;
  sentAt: string;
  retries: number;
}

const PIPE: { id: Status; label: string; icon: React.ReactNode }[] = [
  { id: "created", label: "Event", icon: <Store className="h-4 w-4" /> },
  { id: "queued", label: "Queued", icon: <Inbox className="h-4 w-4" /> },
  { id: "sending", label: "Sending", icon: <Send className="h-4 w-4" /> },
  { id: "delivered", label: "Delivered", icon: <Smartphone className="h-4 w-4" /> },
];

/**
 * Section 3 — the core playground. Trigger real product events and
 * watch a notification flow through the pipeline onto a lock screen,
 * with delay / fail / retry / disable controls and live metrics.
 */
export function NotifPlayground() {
  const reduce = useReducedMotion();
  const [delayMode, setDelayMode] = useState(false);
  const [failMode, setFailMode] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [feed, setFeed] = useState<LiveNotif[]>([]);
  const [activeStage, setActiveStage] = useState<Status | null>(null);
  const [stats, setStats] = useState({
    sent: 0,
    delivered: 0,
    opened: 0,
    failed: 0,
    retries: 0,
  });
  const uidRef = useRef(0);

  const update = useCallback((uid: number, patch: Partial<LiveNotif>) => {
    setFeed((f) =>
      f.map((n) => (n.uid === uid ? { ...n, ...patch } : n))
    );
  }, []);

  const runDelivery = useCallback(
    async (uid: number, isRetry: boolean) => {
      const wait = delayMode ? 1400 : 650;

      setActiveStage("queued");
      update(uid, { status: "queued" });
      await sleep(wait);

      setActiveStage("sending");
      update(uid, { status: "sending" });
      await sleep(wait);

      if (disabled) {
        setActiveStage(null);
        update(uid, { status: "failed" });
        setStats((s) => ({ ...s, failed: s.failed + 1 }));
        return;
      }

      if (failMode && !isRetry) {
        setActiveStage(null);
        update(uid, { status: "failed" });
        setStats((s) => ({ ...s, failed: s.failed + 1 }));
        return;
      }

      setActiveStage("delivered");
      update(uid, { status: "delivered" });
      setStats((s) => ({ ...s, delivered: s.delivered + 1 }));
      await sleep(900);
      setActiveStage(null);

      // Simulated open behaviour (engagement opens less than transactional).
      const openChance = disabled ? 0 : delayMode ? 0.25 : 0.55;
      if (Math.random() < openChance) {
        update(uid, { status: "opened" });
        setStats((s) => ({ ...s, opened: s.opened + 1 }));
      }
    },
    [delayMode, failMode, disabled, update]
  );

  async function trigger(ev: NotifEvent) {
    const uid = ++uidRef.current;
    const sentAt = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const n: LiveNotif = {
      ...ev,
      uid,
      status: "created",
      sentAt,
      retries: 0,
    };
    setFeed((f) => [n, ...f].slice(0, 6));
    setStats((s) => ({ ...s, sent: s.sent + 1 }));
    setActiveStage("created");
    await sleep(500);
    await runDelivery(uid, false);
  }

  async function retry(n: LiveNotif) {
    update(n.uid, { status: "created", retries: n.retries + 1 });
    setStats((s) => ({ ...s, retries: s.retries + 1 }));
    await sleep(400);
    await runDelivery(n.uid, true);
  }

  const openRate =
    stats.delivered === 0
      ? 0
      : Math.round((stats.opened / stats.delivered) * 100);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      {/* Trigger an event */}
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
        1 · Trigger a product event
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {NOTIF_EVENTS.map((ev) => {
          const Icon = getIcon(ev.icon);
          return (
            <button
              key={ev.id}
              onClick={() => trigger(ev)}
              className="group flex items-center gap-2 rounded-xl border border-border bg-bg px-3 py-2.5 text-left text-xs font-medium transition-colors hover:border-brand/50 hover:bg-brand-soft"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand transition-transform group-hover:scale-110">
                <Icon className="h-3.5 w-3.5" />
              </span>
              {ev.trigger}
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <p className="mt-6 text-[11px] font-semibold uppercase tracking-wide text-muted">
        2 · Change the conditions
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Toggle
          on={delayMode}
          onClick={() => setDelayMode((v) => !v)}
          icon={<Clock className="h-3.5 w-3.5" />}
          label="Delay delivery"
          tone="warn"
        />
        <Toggle
          on={failMode}
          onClick={() => setFailMode((v) => !v)}
          icon={<XCircle className="h-3.5 w-3.5" />}
          label="Fail first attempt"
          tone="bad"
        />
        <Toggle
          on={disabled}
          onClick={() => setDisabled((v) => !v)}
          icon={<BellOff className="h-3.5 w-3.5" />}
          label="User disabled notifications"
          tone="bad"
        />
      </div>

      {/* Pipeline + phone */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_280px]">
        {/* Pipeline */}
        <div className="rounded-2xl border border-border bg-bg p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            Delivery pipeline
          </p>
          <div className="mt-5 flex items-center justify-between">
            {PIPE.map((p, i) => {
              const on = activeStage === p.id;
              return (
                <div key={p.id} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <motion.span
                      animate={
                        on && !reduce
                          ? { scale: [1, 1.18, 1] }
                          : { scale: 1 }
                      }
                      transition={{ duration: 0.8, repeat: on ? Infinity : 0 }}
                      className={cn(
                        "grid h-10 w-10 place-items-center rounded-xl border transition-colors",
                        on
                          ? "border-brand bg-brand text-white shadow-glow"
                          : "border-border bg-surface text-muted"
                      )}
                    >
                      {p.icon}
                    </motion.span>
                    <span
                      className={cn(
                        "text-[10px] font-medium",
                        on ? "text-brand" : "text-muted"
                      )}
                    >
                      {p.label}
                    </span>
                  </div>
                  {i < PIPE.length - 1 && (
                    <div className="relative mx-1 h-1 flex-1 rounded-full bg-border">
                      <motion.div
                        className="absolute inset-y-0 left-0 rounded-full bg-brand"
                        animate={{
                          width:
                            activeStage &&
                            PIPE.findIndex((s) => s.id === activeStage) > i
                              ? "100%"
                              : "0%",
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Event feed */}
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-wide text-muted">
            Recent notifications
          </p>
          <div className="mt-3 space-y-2">
            <AnimatePresence initial={false}>
              {feed.length === 0 && (
                <p className="py-6 text-center text-xs text-muted">
                  Trigger an event above to start
                </p>
              )}
              {feed.map((n) => (
                <motion.div
                  key={n.uid}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium">{n.title}</p>
                    <p className="text-[10px] text-muted">
                      {n.app} · {n.sentAt}
                      {n.retries > 0 && ` · retry ×${n.retries}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill status={n.status} />
                    {n.status === "failed" && (
                      <button
                        onClick={() => retry(n)}
                        className="inline-flex items-center gap-1 rounded-full border border-brand/40 px-2 py-1 text-[10px] font-semibold text-brand transition-colors hover:bg-brand-soft"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Retry
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Phone lock screen */}
        <div className="rounded-2xl border border-border bg-gradient-to-b from-brand-soft to-bg p-4">
          <div className="mx-auto h-[330px] w-full max-w-[230px] rounded-[1.8rem] border-2 border-border bg-bg p-3">
            <p className="text-center text-[10px] font-medium text-muted">
              {new Date().toLocaleDateString([], {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="text-center text-3xl font-semibold tabular-nums">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <div className="mt-4 space-y-2">
              <AnimatePresence initial={false}>
                {feed
                  .filter(
                    (n) =>
                      n.status === "delivered" || n.status === "opened"
                  )
                  .slice(0, 3)
                  .map((n) => {
                    const Icon = getIcon(n.icon);
                    return (
                      <motion.div
                        key={n.uid}
                        initial={{ opacity: 0, y: -16, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{
                          type: "spring",
                          stiffness: 280,
                          damping: 20,
                        }}
                        className={cn(
                          "rounded-xl border bg-surface/90 px-2.5 py-2 backdrop-blur",
                          n.status === "opened"
                            ? "border-border opacity-70"
                            : "border-brand/40 shadow-glow"
                        )}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="grid h-4 w-4 place-items-center rounded bg-brand text-white">
                            <Icon className="h-2.5 w-2.5" />
                          </span>
                          <span className="text-[9px] font-semibold uppercase tracking-wide text-muted">
                            {n.app}
                          </span>
                          <span className="ml-auto text-[8px] text-muted">
                            now
                          </span>
                        </div>
                        <p className="mt-1 text-[10px] font-semibold leading-tight">
                          {n.title}
                        </p>
                        <p className="text-[9px] leading-tight text-muted">
                          {n.body}
                        </p>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
              {feed.filter(
                (n) => n.status === "delivered" || n.status === "opened"
              ).length === 0 && (
                <p className="pt-6 text-center text-[10px] text-muted">
                  {disabled
                    ? "Notifications are off — nothing reaches the screen"
                    : "Lock screen — delivered notifications appear here"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Metric label="Sent" value={`${stats.sent}`} tone="neutral" />
        <Metric label="Delivered" value={`${stats.delivered}`} tone="ok" />
        <Metric label="Opened" value={`${stats.opened}`} tone="ok" />
        <Metric label="Failed" value={`${stats.failed}`} tone={stats.failed ? "bad" : "neutral"} />
        <Metric label="Retries" value={`${stats.retries}`} tone="warn" />
        <Metric label="Open rate" value={`${openRate}%`} tone={openRate >= 30 ? "ok" : "warn"} />
      </div>

      <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="inline-flex items-center gap-1.5 font-semibold text-brand">
          <Zap className="h-4 w-4" /> Try this:
        </span>{" "}
        Turn on “Fail first attempt”, trigger an order, then hit Retry — watch
        the same notification get a second chance. Now flip “User disabled
        notifications” and notice nothing ever reaches the lock screen.
      </p>
    </div>
  );
}

function Toggle({
  on,
  onClick,
  icon,
  label,
  tone,
}: {
  on: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  tone: "warn" | "bad";
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors",
        on
          ? tone === "warn"
            ? "border-amber-500/40 bg-amber-500/10 text-amber-500"
            : "border-rose-500/40 bg-rose-500/10 text-rose-500"
          : "border-border text-muted hover:text-fg"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function StatusPill({ status }: { status: Status }) {
  const map: Record<Status, { label: string; cls: string }> = {
    created: { label: "Created", cls: "bg-brand-soft text-brand" },
    queued: { label: "Queued", cls: "bg-brand-soft text-brand" },
    sending: { label: "Sending", cls: "bg-amber-500/15 text-amber-500" },
    delivered: { label: "Delivered", cls: "bg-emerald-500/15 text-emerald-500" },
    opened: { label: "Opened", cls: "bg-emerald-500/15 text-emerald-500" },
    failed: { label: "Failed", cls: "bg-rose-500/15 text-rose-500" },
  };
  const s = map[status];
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
        s.cls
      )}
    >
      {s.label}
    </span>
  );
}

function Metric({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "ok" | "warn" | "bad";
}) {
  const tones = {
    neutral: "text-fg",
    ok: "text-emerald-500",
    warn: "text-amber-500",
    bad: "text-rose-500",
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
