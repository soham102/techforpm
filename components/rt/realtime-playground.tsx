"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Plug,
  Power,
  Send,
  MessageSquare,
  MapPin,
  Flame,
  WifiOff,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNum } from "@/lib/realtime";

interface ChatMsg {
  id: number;
  from: "you" | "server";
  text: string;
  ms: number;
}

const SERVER_REPLIES = [
  "Got it — broadcasting to everyone now.",
  "Delivered to 3 other people in the room.",
  "Order status pushed to your screen.",
  "New live update just arrived.",
];

/**
 * Section 4 — the core real-time playground. Connect, send messages, fire
 * typing, run live tracking, spike traffic and drop the network. Everything
 * updates live over one connection.
 */
export function RealtimePlayground() {
  const reduce = useReducedMotion();
  const [connected, setConnected] = useState(false);
  const [poorNet, setPoorNet] = useState(false);
  const [spike, setSpike] = useState(false);
  const [typing, setTyping] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [eta, setEta] = useState(8);
  const [carPos, setCarPos] = useState(0);
  const idRef = useRef(0);
  const trackTimer = useRef<ReturnType<typeof setInterval>>();

  const baseLatency = poorNet ? 620 : spike ? 180 : 70;
  const latency = baseLatency + (spike ? 90 : 0);
  const activeUsers = spike ? 4_800_000 : 38_400;
  const updatesPerSec = !connected ? 0 : spike ? 920 : tracking ? 12 : 3;

  // Live tracking loop.
  useEffect(() => {
    if (!tracking || !connected) {
      clearInterval(trackTimer.current);
      return;
    }
    trackTimer.current = setInterval(() => {
      setCarPos((p) => {
        if (p >= 100) {
          setTracking(false);
          return 100;
        }
        return Math.min(100, p + 7);
      });
      setEta((e) => Math.max(0, Math.round((e - 0.6) * 10) / 10));
    }, 900);
    return () => clearInterval(trackTimer.current);
  }, [tracking, connected]);

  // Drop everything on disconnect.
  useEffect(() => {
    if (!connected) {
      setTyping(false);
      setTracking(false);
    }
  }, [connected]);

  const pushServer = useCallback(
    (text: string) => {
      const delay = poorNet ? 900 : spike ? 320 : 120;
      setTimeout(() => {
        setMsgs((m) =>
          [
            ...m,
            {
              id: ++idRef.current,
              from: "server" as const,
              text,
              ms: Math.round(delay + Math.random() * 60),
            },
          ].slice(-6)
        );
      }, delay);
    },
    [poorNet, spike]
  );

  function sendMessage() {
    if (!connected) return;
    setMsgs((m) =>
      [
        ...m,
        {
          id: ++idRef.current,
          from: "you" as const,
          text: "Where is my order?",
          ms: Math.round(latency * 0.4),
        },
      ].slice(-6)
    );
    pushServer(
      SERVER_REPLIES[idRef.current % SERVER_REPLIES.length]
    );
  }

  function simulateTyping() {
    if (!connected) return;
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      pushServer("Hey! Your order is on the way 🍔");
    }, 1800);
  }

  function startTracking() {
    if (!connected) return;
    setCarPos(0);
    setEta(8);
    setTracking(true);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      {/* Connection header */}
      <div className="flex flex-wrap items-center gap-3">
        <div
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold",
            connected
              ? "bg-emerald-500/15 text-emerald-500"
              : "bg-rose-500/15 text-rose-500"
          )}
        >
          <span className="relative flex h-2.5 w-2.5">
            {connected && !reduce && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
            )}
            <span
              className={cn(
                "relative inline-flex h-2.5 w-2.5 rounded-full",
                connected ? "bg-emerald-500" : "bg-rose-500"
              )}
            />
          </span>
          {connected ? "Connected · live" : "Disconnected"}
        </div>

        {!connected ? (
          <button
            onClick={() => setConnected(true)}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
          >
            <Plug className="h-4 w-4" />
            Connect
          </button>
        ) : (
          <button
            onClick={() => setConnected(false)}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-rose-500"
          >
            <Power className="h-4 w-4" />
            Disconnect
          </button>
        )}

        <button
          onClick={() => setPoorNet((v) => !v)}
          disabled={!connected}
          className={cn(
            "ml-auto inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors disabled:opacity-40",
            poorNet
              ? "border-amber-500/40 bg-amber-500/10 text-amber-500"
              : "border-border text-muted hover:text-fg"
          )}
        >
          {poorNet ? (
            <WifiOff className="h-3.5 w-3.5" />
          ) : (
            <Wifi className="h-3.5 w-3.5" />
          )}
          Poor network
        </button>
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        <PlayBtn
          onClick={sendMessage}
          disabled={!connected}
          icon={<Send className="h-3.5 w-3.5" />}
          label="Send message"
        />
        <PlayBtn
          onClick={simulateTyping}
          disabled={!connected}
          icon={<MessageSquare className="h-3.5 w-3.5" />}
          label="Simulate typing"
        />
        <PlayBtn
          onClick={startTracking}
          disabled={!connected}
          icon={<MapPin className="h-3.5 w-3.5" />}
          label="Start live tracking"
        />
        <PlayBtn
          onClick={() => setSpike((v) => !v)}
          disabled={!connected}
          active={spike}
          icon={<Flame className="h-3.5 w-3.5" />}
          label="Traffic spike"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Chat panel */}
        <div className="flex h-72 flex-col rounded-2xl border border-border bg-bg p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
            <MessageSquare className="h-3.5 w-3.5 text-brand" />
            Live chat
          </p>
          <div className="mt-3 flex-1 space-y-2 overflow-hidden">
            <AnimatePresence initial={false}>
              {msgs.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "flex flex-col",
                    m.from === "you" ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-3 py-2 text-[13px]",
                      m.from === "you"
                        ? "bg-brand text-white"
                        : "border border-border bg-surface"
                    )}
                  >
                    {m.text}
                  </div>
                  <span className="mt-0.5 text-[10px] text-muted">
                    delivered in {m.ms}ms
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            {typing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1 text-xs text-muted"
              >
                Rahul is typing
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-muted"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </motion.div>
            )}
            {msgs.length === 0 && !typing && (
              <p className="grid h-full place-items-center text-center text-xs text-muted">
                {connected
                  ? "Send a message or simulate typing"
                  : "Connect to start the live session"}
              </p>
            )}
          </div>
        </div>

        {/* Live tracking panel */}
        <div className="flex h-72 flex-col rounded-2xl border border-border bg-bg p-4">
          <p className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-muted">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-brand" />
              Live delivery tracking
            </span>
            {tracking && (
              <span className="text-emerald-500">ETA {eta} min</span>
            )}
          </p>

          <div className="relative mt-6 flex-1">
            <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-border" />
            <motion.div
              className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-emerald-500"
              animate={{ width: `${carPos}%` }}
              transition={{ duration: 0.8 }}
            />
            {/* restaurant */}
            <span className="absolute left-0 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-border bg-surface text-brand">
              <Flame className="h-4 w-4" />
            </span>
            {/* home */}
            <span className="absolute right-0 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-border bg-surface text-brand">
              <MapPin className="h-4 w-4" />
            </span>
            {/* moving rider */}
            <motion.span
              className="absolute top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-emerald-500 text-white shadow-glow"
              animate={{ left: `calc(${carPos}% - 18px)` }}
              transition={{ duration: 0.8 }}
              style={{ left: "-18px" }}
            >
              🛵
            </motion.span>
          </div>

          <p className="mt-4 text-center text-[12px] text-muted">
            {tracking
              ? "Location pushed every second — the dot moves on its own"
              : carPos >= 100
              ? "Delivered — arrived in real time"
              : "Press “Start live tracking” to watch the rider move live"}
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric
          label="Connection"
          value={connected ? "Open" : "Closed"}
          tone={connected ? "ok" : "bad"}
        />
        <Metric
          label="Latency"
          value={connected ? `${latency}ms` : "—"}
          tone={!connected ? "bad" : latency > 400 ? "warn" : "ok"}
        />
        <Metric
          label="Active users"
          value={connected ? formatNum(activeUsers) : "—"}
          tone="neutral"
        />
        <Metric
          label="Updates / sec"
          value={`${updatesPerSec}`}
          tone={updatesPerSec > 0 ? "ok" : "bad"}
        />
      </div>

      <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">Try this: </span>
        Start live tracking, then hit “Poor network” — watch latency jump and
        delivery times stretch. Disconnect and everything freezes; that's the
        real-time trade-off.
      </p>
    </div>
  );
}

function PlayBtn({
  onClick,
  disabled,
  icon,
  label,
  active,
}: {
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors disabled:opacity-40",
        active
          ? "border-rose-500/40 bg-rose-500/10 text-rose-500"
          : "border-border hover:border-brand/40"
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
