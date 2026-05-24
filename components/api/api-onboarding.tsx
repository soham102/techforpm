"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  ArrowRight,
  ArrowLeft,
  Zap,
  X,
  Globe,
  Server,
  Smartphone,
  Trophy,
  CheckCircle,
  MessageSquare,
  Wrench,
  Lightbulb,
  Link2,
  Database,
  ChevronRight,
  Star,
  Play,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Constants ─────────────────────────────────────────────────────────────── */

const STORAGE_KEY = "pmverse-api-onboarding-v2";
const TOTAL = 6;
type Dir = 1 | -1;

/* ─── Slide variants ────────────────────────────────────────────────────────── */

const slide = {
  enter: (d: Dir) => ({ x: d > 0 ? 40 : -40, opacity: 0, scale: 0.98 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (d: Dir) => ({ x: d > 0 ? -40 : 40, opacity: 0, scale: 0.98 }),
};

/* ─── Animated gradient border wrapper ─────────────────────────────────────── */

function GradientBorder({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-3xl p-[1.5px]">
      {/* Rotating conic gradient — creates the animated border */}
      <motion.div
        className="absolute rounded-3xl"
        style={{
          inset: "-120%",
          background:
            "conic-gradient(from 0deg at 50% 50%, #6366f1 0%, #8b5cf6 20%, #06b6d4 40%, #10b981 55%, #6366f1 70%, #8b5cf6 85%, #6366f1 100%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />
      {/* Dimmed overlay so the border isn't too bright */}
      <div className="absolute inset-0 bg-black/30" />
      {/* Actual card */}
      <div className="relative overflow-hidden rounded-[22px]">{children}</div>
    </div>
  );
}

/* ─── Progress dots ─────────────────────────────────────────────────────────── */

function ProgressDots({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: TOTAL }, (_, i) => (
        <motion.div
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-colors duration-300",
            i < step ? "bg-brand" : "bg-border"
          )}
          animate={{ width: i === step - 1 ? 24 : 6 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/* ─── Confetti ──────────────────────────────────────────────────────────────── */

const PALETTE = [
  "#6366f1", "#8b5cf6", "#06b6d4", "#10b981",
  "#f59e0b", "#ec4899", "#f97316", "#14b8a6",
];

const PIECES = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  color: PALETTE[i % PALETTE.length],
  left: `${(i / 70) * 100}%`,
  delay: (i % 14) * 0.048,
  dur: 2.0 + (i % 7) * 0.26,
  w: 5 + (i % 5) * 2,
  h: 4 + (i % 6) * 2,
  rot: (i * 53) % 360,
  drift: ((i % 5) - 2) * 28,
}));

function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[22px]">
      {PIECES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-0 rounded-sm"
          style={{
            left: p.left,
            width: p.w,
            height: p.h,
            backgroundColor: p.color,
          }}
          initial={{ y: -20, opacity: 1, rotate: p.rot }}
          animate={{
            y: 620,
            opacity: [1, 1, 0.7, 0],
            rotate: p.rot + 450,
            x: [0, p.drift],
          }}
          transition={{ duration: p.dur, delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

/* ─── Step 1 — Welcome ──────────────────────────────────────────────────────── */

const FLOAT_ICONS = [Globe, Server, Zap, Smartphone] as const;
const FLOAT_POSITIONS = [
  { top: "4px", left: "0px" },
  { top: "4px", right: "0px" },
  { bottom: "4px", left: "0px" },
  { bottom: "4px", right: "0px" },
] as React.CSSProperties[];

function Step1({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 px-2 py-8 text-center">
      {/* Hero — icon + orbit rings + floating chips */}
      <div className="relative flex h-44 w-72 items-center justify-center">
        {/* Ambient glow */}
        <div className="absolute h-36 w-36 rounded-full bg-brand/20 blur-3xl" />

        {/* Orbit rings */}
        {[96, 128].map((size, r) => (
          <motion.div
            key={r}
            className="absolute rounded-full border border-brand/15"
            style={{ width: size, height: size }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.2, 0.6] }}
            transition={{
              duration: 2.8 + r * 0.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: r * 0.7,
            }}
          />
        ))}

        {/* Central icon */}
        <motion.div
          className="relative grid h-20 w-20 place-items-center rounded-2xl text-white"
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #818cf8 50%, #a78bfa 100%)",
            boxShadow: "0 0 0 1px rgba(99,102,241,0.4), 0 8px 48px rgba(99,102,241,0.35)",
          }}
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
        >
          <Rocket className="h-10 w-10" />
          {/* Inner shine */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>

        {/* Floating corner chips */}
        {FLOAT_ICONS.map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute grid h-9 w-9 place-items-center rounded-xl border border-border/60 bg-elevated/80 text-brand backdrop-blur-sm"
            style={{
              ...FLOAT_POSITIONS[i],
              boxShadow: "0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
            transition={{
              opacity: { delay: 0.25 + i * 0.1, duration: 0.3 },
              scale: { delay: 0.25 + i * 0.1, duration: 0.3, type: "spring", stiffness: 240 },
              y: {
                delay: 0.6 + i * 0.12,
                duration: 2.4 + i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            <Icon className="h-4 w-4" />
          </motion.div>
        ))}
      </div>

      {/* Headline */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold tracking-tight sm:text-[28px]">
          Welcome to the{" "}
          <span className="bg-gradient-to-r from-brand via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            API Playground
          </span>{" "}
          🚀
        </h2>
        <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted">
          Understand APIs visually through real-world simulations — without
          writing a single line of code.
        </p>
      </motion.div>

      {/* Meta */}
      <motion.div
        className="flex items-center gap-3 text-xs text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-brand" />
          6 interactive steps
        </span>
        <span>·</span>
        <span>~3 min</span>
      </motion.div>

      {/* CTA buttons */}
      <motion.div
        className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <motion.button
          onClick={onStart}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-7 py-3 text-sm font-semibold text-white sm:w-auto"
          style={{
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            boxShadow: "0 0 0 1px rgba(99,102,241,0.3), 0 8px 32px rgba(99,102,241,0.3)",
          }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          <Play className="h-4 w-4 fill-white" />
          Start Tour
        </motion.button>
        <button
          onClick={onSkip}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border/60 bg-surface/50 px-7 py-3 text-sm font-medium text-muted transition-colors hover:border-border hover:text-fg sm:w-auto"
        >
          Skip for now
        </button>
      </motion.div>
    </div>
  );
}

/* ─── Step 2 — Analogy ──────────────────────────────────────────────────────── */

const ANALOGY = [
  { Icon: Smartphone, label: "You (App)", sub: "Places the order", accent: false },
  { Icon: Globe,      label: "API",       sub: "The waiter",       accent: true  },
  { Icon: Server,     label: "Kitchen",   sub: "Processes & responds", accent: false },
] as const;

function Step2() {
  return (
    <div className="py-4">
      <div className="mb-7 text-center">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          An API is like a restaurant waiter
        </h2>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted">
          You don&apos;t walk into the kitchen. The waiter carries your request
          and brings back exactly what you need.
        </p>
      </div>

      {/* Flow */}
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        {ANALOGY.map(({ Icon, label, sub, accent }, i) => (
          <div key={i} className="flex flex-col items-center gap-3 sm:flex-row">
            <motion.div
              className={cn(
                "relative flex w-[138px] flex-col items-center gap-3 rounded-2xl border p-5 text-center",
                accent
                  ? "border-brand/40 bg-brand-soft"
                  : "border-border bg-surface shadow-soft"
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.14, duration: 0.4 }}
              whileHover={{ y: -5, boxShadow: accent ? "0 0 0 1px rgba(99,102,241,0.4), 0 8px 32px rgba(99,102,241,0.2)" : "0 2px 4px rgba(0,0,0,0.04), 0 16px 48px rgba(0,0,0,0.10)" }}
            >
              {/* Glow for accent node */}
              {accent && (
                <div className="absolute inset-0 rounded-2xl bg-brand/5 blur-xl" />
              )}
              <span
                className={cn(
                  "relative grid h-11 w-11 place-items-center rounded-xl",
                  accent ? "bg-brand text-white" : "bg-brand-soft text-brand"
                )}
                style={accent ? { boxShadow: "0 0 0 1px rgba(99,102,241,0.3), 0 4px 20px rgba(99,102,241,0.3)" } : undefined}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold leading-tight">{label}</p>
                <p className="mt-0.5 text-[11px] text-muted">{sub}</p>
              </div>
            </motion.div>

            {i < ANALOGY.length - 1 && (
              <div className="flex rotate-90 flex-col items-center gap-1 sm:rotate-0">
                <div className="flex items-center gap-1.5">
                  {/* Sweeping data-flow beam */}
                  <div className="relative h-[2px] w-10 overflow-hidden rounded-full bg-brand/15">
                    <motion.div
                      className="absolute inset-y-0 w-10 rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.9) 50%, transparent 100%)",
                        boxShadow: "0 0 5px rgba(99,102,241,0.7)",
                      }}
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{
                        duration: 1.1,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 0.4,
                      }}
                    />
                  </div>
                  {/* Arrow icon */}
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.35 }}
                    className="text-brand"
                    style={{ filter: "drop-shadow(0 0 5px rgba(99,102,241,0.6))" }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Animated label sequence */}
      <motion.div
        className="mt-7 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
      >
        <div className="flex items-center justify-center gap-2">
          {["Request", "→", "Processing", "→", "Response"].map((label, i) => (
            <motion.span
              key={i}
              className={cn(
                "text-xs font-medium",
                i % 2 === 1 ? "text-brand/50" : "text-muted"
              )}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
            >
              {label}
            </motion.span>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <span
            className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft px-4 py-2 text-xs text-brand"
            style={{ boxShadow: "0 0 0 1px rgba(99,102,241,0.1), 0 4px 16px rgba(99,102,241,0.1)" }}
          >
            <span>✦</span>
            The API acts like a waiter between the app and the server
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Step 3 — Interactive ──────────────────────────────────────────────────── */

type ReqState = "idle" | "sending" | "processing" | "received" | "done";

function Step3() {
  const [st, setSt] = useState<ReqState>("idle");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  function reset() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setSt("idle");
  }

  function send() {
    if (st !== "idle") return;
    setSt("sending");
    timersRef.current = [
      setTimeout(() => setSt("processing"), 920),
      setTimeout(() => setSt("received"), 1870),
      setTimeout(() => setSt("done"), 2480),
    ];
  }

  const outWidth = st === "idle" ? "0%" : "100%";
  const inWidth  = st === "received" || st === "done" ? "100%" : "0%";

  const btnLabel =
    st === "idle"       ? "Send API Request" :
    st === "sending"    ? "Sending…"          :
    st === "processing" ? "Processing…"       :
    st === "received"   ? "Receiving…"        : "Done!";

  return (
    <div className="py-4">
      <div className="mb-5 text-center">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Now it&apos;s your turn
        </h2>
        <p className="mt-2 text-sm text-muted">
          Click the button below to make your first API request.
        </p>
      </div>

      {/* Terminal / Simulation panel */}
      <div
        className="overflow-hidden rounded-2xl border border-border/60"
        style={{
          background: "linear-gradient(160deg, rgba(18,19,26,0.95) 0%, rgba(9,9,14,0.98) 100%)",
          boxShadow: "0 0 0 1px rgba(99,102,241,0.08), 0 16px 48px rgba(0,0,0,0.3)",
        }}
      >
        {/* Mac window chrome */}
        <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5">
          {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
            <span
              key={i}
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: c }}
            />
          ))}
          <span className="ml-2 font-mono text-[10px] text-white/25">
            api-playground.local
          </span>
        </div>

        <div className="p-5">
          {/* Wire diagram */}
          <div className="flex items-center gap-3">
            {/* Client node */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="grid h-11 w-11 place-items-center rounded-xl border border-brand/30 text-brand"
                style={{ background: "rgba(99,102,241,0.1)" }}
              >
                <Smartphone className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-medium text-white/30">Client</span>
            </div>

            {/* Wire column */}
            <div className="flex flex-1 flex-col gap-2.5 py-0.5">
              {/* Request beam */}
              <div className="flex items-center gap-2">
                <span className="w-8 shrink-0 text-right font-mono text-[9px] text-brand/70">GET</span>
                <div className="relative flex-1 overflow-hidden rounded-full">
                  <div className="h-[3px] w-full rounded-full bg-white/8" />
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      background: "linear-gradient(90deg, #6366f1, #818cf8, #a5b4fc)",
                      boxShadow: "0 0 8px rgba(99,102,241,0.8)",
                    }}
                    animate={{ width: outWidth }}
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                  />
                </div>
                <ArrowRight className="h-3 w-3 shrink-0 text-brand/40" />
              </div>
              {/* Response beam */}
              <div className="flex items-center gap-2">
                <ArrowLeft className="h-3 w-3 shrink-0 text-emerald-500/40" />
                <div className="relative flex-1 overflow-hidden rounded-full">
                  <div className="h-[3px] w-full rounded-full bg-white/8" />
                  <motion.div
                    className="absolute inset-y-0 right-0 rounded-full"
                    style={{
                      background: "linear-gradient(270deg, #10b981, #34d399)",
                      boxShadow: "0 0 8px rgba(16,185,129,0.7)",
                    }}
                    animate={{ width: inWidth }}
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                  />
                </div>
                <span className="w-8 shrink-0 font-mono text-[9px] text-emerald-500/70">200</span>
              </div>
            </div>

            {/* Server node */}
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                className="grid h-11 w-11 place-items-center rounded-xl border text-white/40"
                style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)" }}
                animate={
                  st === "processing"
                    ? {
                        borderColor: ["rgba(99,102,241,0.8)", "rgba(99,102,241,0.2)", "rgba(99,102,241,0.8)"],
                        boxShadow: [
                          "0 0 0 0 transparent",
                          "0 0 20px rgba(99,102,241,0.5)",
                          "0 0 0 0 transparent",
                        ],
                      }
                    : {}
                }
                transition={{ duration: 0.7, repeat: st === "processing" ? Infinity : 0 }}
              >
                <Server
                  className={cn(
                    "h-5 w-5 transition-colors",
                    st === "processing" ? "text-brand" : "text-white/30"
                  )}
                />
              </motion.div>
              <span className="text-[10px] font-medium text-white/30">Server</span>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col items-center">
            <AnimatePresence mode="wait">
              {st !== "done" ? (
                <motion.div
                  key="cta"
                  className="relative flex flex-col items-center gap-3"
                  exit={{ opacity: 0, scale: 0.9, y: -4 }}
                  transition={{ duration: 0.18 }}
                >
                  {/* Spotlight overlay behind button */}
                  {st === "idle" && (
                    <div
                      className="pointer-events-none absolute inset-[-24px] rounded-2xl"
                      style={{
                        background: "radial-gradient(ellipse 140px 80px at 50% 60%, rgba(99,102,241,0.15) 0%, transparent 70%)",
                      }}
                    />
                  )}

                  {/* Pulse rings */}
                  {st === "idle" &&
                    [1, 2, 3].map((r) => (
                      <motion.div
                        key={r}
                        className="absolute inset-0 rounded-xl"
                        style={{ border: "1.5px solid rgba(99,102,241,0.5)" }}
                        animate={{ scale: [1, 1.6 + r * 0.2], opacity: [0.6, 0] }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                          delay: r * 0.45,
                          ease: "easeOut",
                        }}
                      />
                    ))}

                  {/* Tooltip */}
                  {st === "idle" && (
                    <motion.div
                      className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span
                        className="rounded-full px-3 py-1.5 text-[11px] font-medium text-white"
                        style={{
                          background: "rgba(99,102,241,0.9)",
                          boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
                        }}
                      >
                        Click here to send a request ↓
                      </span>
                    </motion.div>
                  )}

                  <motion.button
                    onClick={send}
                    disabled={st !== "idle"}
                    className={cn(
                      "relative inline-flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-semibold text-white",
                      st !== "idle" && "cursor-not-allowed opacity-60"
                    )}
                    style={{
                      background: "linear-gradient(135deg, #6366f1, #818cf8)",
                      boxShadow: st === "idle"
                        ? "0 0 0 1px rgba(99,102,241,0.5), 0 8px 32px rgba(99,102,241,0.4)"
                        : "none",
                    }}
                    whileHover={st === "idle" ? { scale: 1.05, y: -2 } : undefined}
                    whileTap={st === "idle" ? { scale: 0.97 } : undefined}
                  >
                    <Zap className="h-4 w-4" />
                    {btnLabel}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  className="flex flex-col items-center gap-3 text-center"
                  initial={{ opacity: 0, scale: 0.88, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 14 }}
                >
                  <motion.div
                    className="grid h-12 w-12 place-items-center rounded-full text-emerald-400"
                    style={{
                      background: "rgba(16,185,129,0.12)",
                      border: "1px solid rgba(16,185,129,0.3)",
                      boxShadow: "0 0 20px rgba(16,185,129,0.25)",
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 280, damping: 12 }}
                  >
                    <CheckCircle className="h-6 w-6" />
                  </motion.div>
                  <div>
                    <p className="font-semibold text-white">
                      You just made your first API call 🎉
                    </p>
                    <p className="mt-1 text-sm text-white/50">
                      Server responded with{" "}
                      <code
                        className="rounded px-1.5 py-0.5 font-mono text-xs text-emerald-400"
                        style={{ background: "rgba(16,185,129,0.1)" }}
                      >
                        200 OK
                      </code>{" "}
                      and delivered restaurant data.
                    </p>
                  </div>
                  <motion.button
                    onClick={reset}
                    className="flex items-center gap-1.5 text-xs text-white/30 transition-colors hover:text-white/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <RotateCcw className="h-3 w-3" />
                    Try again
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 4 — Why PMs ──────────────────────────────────────────────────────── */

const WHY_CARDS = [
  {
    Icon: MessageSquare,
    color: "#6366f1",
    bg: "rgba(99,102,241,0.08)",
    border: "rgba(99,102,241,0.2)",
    title: "Talk to engineers fluently",
    body: 'Understand what "the API is down" means — and ask the right questions instantly.',
  },
  {
    Icon: Link2,
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.2)",
    title: "Evaluate integrations",
    body: "Every 3rd-party tool is just an API. Now you can scope and prioritize them.",
  },
  {
    Icon: Wrench,
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.08)",
    border: "rgba(6,182,212,0.2)",
    title: "Debug issues faster",
    body: "When a feature breaks, you'll know which call to trace and what to ask.",
  },
  {
    Icon: Lightbulb,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
    title: "Scope features realistically",
    body: "Know what your API can return, how fast, at what cost — this sprint.",
  },
] as const;

function Step4() {
  return (
    <div className="py-4">
      <div className="mb-5 text-center">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Why PMs should understand APIs
        </h2>
        <p className="mt-2 text-sm text-muted">
          You don&apos;t need to build them. But knowing them changes everything.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {WHY_CARDS.map(({ Icon, color, bg, border, title, body }, i) => (
          <motion.div
            key={i}
            className="cursor-default rounded-2xl border p-4"
            style={{ background: bg, borderColor: border }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.09, duration: 0.38 }}
            whileHover={{
              y: -5,
              boxShadow: `0 0 0 1px ${border}, 0 12px 40px ${bg.replace("0.08", "0.2")}`,
            }}
          >
            <div className="flex gap-3">
              <span
                className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border"
                style={{ color, background: bg, borderColor: border }}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-muted">{body}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Step 5 — Real Examples ────────────────────────────────────────────────── */

const EXAMPLES = [
  {
    emoji: "🚗",
    company: "Uber",
    api: "Maps API",
    desc: "Live location, routes & ETA",
    from: "#0f172a",
    to: "#1e293b",
    accent: "#38bdf8",
  },
  {
    emoji: "🎵",
    company: "Spotify",
    api: "Recommendation API",
    desc: "Discover Weekly & Wrapped",
    from: "#052e16",
    to: "#14532d",
    accent: "#4ade80",
  },
  {
    emoji: "🍕",
    company: "Swiggy",
    api: "Payment API",
    desc: "Secure checkout in 1 tap",
    from: "#431407",
    to: "#7c2d12",
    accent: "#fb923c",
  },
  {
    emoji: "📸",
    company: "Instagram",
    api: "Feed API",
    desc: "Your personalized photo feed",
    from: "#4a044e",
    to: "#831843",
    accent: "#f472b6",
  },
] as const;

function Step5() {
  return (
    <div className="py-4">
      <div className="mb-5 text-center">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          APIs power every app you love
        </h2>
        <p className="mt-2 text-sm text-muted">
          Behind every tap, swipe, or scroll — there&apos;s an API at work.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {EXAMPLES.map(({ emoji, company, api, desc, from, to, accent }, i) => (
          <motion.div
            key={i}
            className="relative overflow-hidden rounded-2xl p-5 text-white"
            style={{
              background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
              boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.3)`,
            }}
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.09, duration: 0.38 }}
            whileHover={{ scale: 1.03, y: -3 }}
          >
            {/* Glow blob */}
            <div
              className="absolute -right-4 -top-4 h-20 w-20 rounded-full blur-2xl"
              style={{ backgroundColor: accent, opacity: 0.2 }}
            />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xl">{emoji}</p>
                <p className="mt-2 font-bold">{company}</p>
                <p className="mt-0.5 text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {desc}
                </p>
              </div>
              <div
                className="shrink-0 rounded-xl px-3 py-2 text-right"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <p className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
                  uses
                </p>
                <p className="text-xs font-bold" style={{ color: accent }}>
                  {api}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2 }}
              >
                <ArrowRight className="h-3 w-3" style={{ color: accent, opacity: 0.6 }} />
              </motion.span>
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Step 6 — Complete ─────────────────────────────────────────────────────── */

const STAR_DECO = [
  { style: { top: "-14px", left: "-14px" } as React.CSSProperties, delay: 0.5 },
  { style: { top: "-18px", right: "6px"  } as React.CSSProperties, delay: 0.7 },
  { style: { bottom: "-12px", right: "-16px" } as React.CSSProperties, delay: 0.9 },
];

function Step6({ onClose }: { onClose: () => void }) {
  return (
    <div className="relative flex flex-col items-center gap-6 overflow-hidden py-10 text-center">
      <Confetti />

      {/* Trophy */}
      <motion.div
        className="relative"
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 190, damping: 12, delay: 0.2 }}
      >
        <div
          className="absolute inset-0 scale-[1.8] rounded-full blur-3xl"
          style={{ background: "rgba(251,191,36,0.2)" }}
        />
        <div
          className="relative grid h-24 w-24 place-items-center rounded-3xl text-white"
          style={{
            background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)",
            boxShadow: "0 0 0 1px rgba(251,191,36,0.4), 0 0 48px rgba(251,191,36,0.4)",
          }}
        >
          <Trophy className="h-12 w-12" />
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/20 to-transparent" />
        </div>

        {STAR_DECO.map(({ style, delay }, i) => (
          <motion.span
            key={i}
            className="absolute"
            style={{ ...style, color: "#fbbf24" }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: [0, 16, -16, 0] }}
            transition={{
              opacity: { delay, duration: 0.4 },
              scale: { delay, duration: 0.4, type: "spring" },
              rotate: { delay, duration: 3, repeat: Infinity },
            }}
          >
            <Star className="h-5 w-5 fill-current" />
          </motion.span>
        ))}
      </motion.div>

      {/* Text */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <h2 className="text-2xl font-semibold tracking-tight sm:text-[28px]">
          You now understand APIs{" "}
          <span className="bg-gradient-to-r from-brand via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            better than most
          </span>{" "}
          aspiring PMs.
        </h2>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted">
          Continue exploring more simulations inside PMVerse and level up your
          technical intuition.
        </p>
      </motion.div>

      {/* Buttons */}
      <motion.div
        className="flex flex-col items-center gap-3 sm:flex-row"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
      >
        <motion.button
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-semibold text-white"
          style={{
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            boxShadow: "0 0 0 1px rgba(99,102,241,0.3), 0 8px 32px rgba(99,102,241,0.3)",
          }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          Continue Learning
          <ChevronRight className="h-4 w-4" />
        </motion.button>
        <a
          href="/databases"
          className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-surface/60 px-7 py-3 text-sm font-semibold shadow-soft transition-transform hover:-translate-y-0.5"
        >
          Explore Databases
          <Database className="h-4 w-4" />
        </a>
      </motion.div>
    </div>
  );
}

/* ─── Modal shell ───────────────────────────────────────────────────────────── */

function OnboardingModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState<Dir>(1);
  const isFirst = step === 1;
  const isLast  = step === TOTAL;

  function next() {
    if (step >= TOTAL) return;
    setDir(1);
    setStep((s) => s + 1);
  }

  function back() {
    if (step <= 1) return;
    setDir(-1);
    setStep((s) => s - 1);
  }

  // Keyboard nav
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape")      { onClose(); return; }
      if (e.key === "ArrowRight" && step < TOTAL) { setDir(1);  setStep((s) => s + 1); }
      if (e.key === "ArrowLeft"  && step > 1)     { setDir(-1); setStep((s) => s - 1); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-6">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 backdrop-blur-lg"
        style={{ background: "rgba(9,9,14,0.75)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Animated gradient border + glass card */}
      <motion.div
        className="relative w-full max-w-xl"
        initial={{ scale: 0.94, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 24 }}
        transition={{ type: "spring", damping: 26, stiffness: 310 }}
        layout
      >
        <GradientBorder>
          {/* Glass surface */}
          <div
            className="relative"
            style={{
              background: "linear-gradient(160deg, rgba(24,25,34,0.97) 0%, rgba(18,19,26,0.99) 100%)",
              backdropFilter: "blur(24px)",
            }}
          >
            {/* Progress fill strip */}
            <div className="relative h-[2px] bg-white/5">
              <motion.div
                className="absolute inset-y-0 left-0"
                style={{
                  background: "linear-gradient(90deg, #6366f1, #818cf8, #a78bfa)",
                  boxShadow: "0 0 8px rgba(99,102,241,0.6)",
                }}
                animate={{ width: `${(step / TOTAL) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4">
              <ProgressDots step={step} />
              <button
                onClick={onClose}
                aria-label="Skip tour"
                className="grid h-7 w-7 place-items-center rounded-full text-white/30 transition-colors hover:bg-white/8 hover:text-white/70"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Step content */}
            <div className="min-h-[300px] px-5 pb-1">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
                >
                  {step === 1 && <Step1 onStart={next} onSkip={onClose} />}
                  {step === 2 && <Step2 />}
                  {step === 3 && <Step3 />}
                  {step === 4 && <Step4 />}
                  {step === 5 && <Step5 />}
                  {step === 6 && <Step6 onClose={onClose} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer nav — hidden on step 1 (has own CTAs) and step 6 (has own buttons) */}
            {!isFirst && !isLast && (
              <div className="flex items-center justify-between px-5 pb-5 pt-2">
                <motion.button
                  onClick={back}
                  className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium text-white/35 transition-colors hover:bg-white/5 hover:text-white/70"
                  whileHover={{ x: -2 }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </motion.button>

                <span className="tabular-nums text-xs text-white/20">
                  {step} / {TOTAL}
                </span>

                <motion.button
                  onClick={step === TOTAL - 1 ? next : next}
                  className="inline-flex items-center gap-1.5 rounded-xl px-5 py-2 text-sm font-semibold text-white"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #818cf8)",
                    boxShadow: "0 0 0 1px rgba(99,102,241,0.3), 0 4px 20px rgba(99,102,241,0.25)",
                  }}
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {step === TOTAL - 1 ? "Let's go" : "Next"}
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              </div>
            )}
          </div>
        </GradientBorder>
      </motion.div>
    </div>
  );
}

/* ─── Public export ─────────────────────────────────────────────────────────── */

export function ApiOnboarding() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setShow(true);
    }
  }, []);

  const handleClose = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "1");
    setShow(false);
  }, []);

  return (
    <AnimatePresence>
      {show && <OnboardingModal key="onboarding" onClose={handleClose} />}
    </AnimatePresence>
  );
}
