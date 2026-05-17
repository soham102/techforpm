"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, MessageSquare, TrendingUp, Bike, MapPin } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { ORDER_STAGES, TICKERS, tickPrice } from "@/lib/realtime";
import { cn } from "@/lib/utils";

type Sim = "uber" | "whatsapp" | "stocks" | "order";

const TABS: { id: Sim; label: string; icon: React.ReactNode }[] = [
  { id: "uber", label: "Uber live location", icon: <Car className="h-3.5 w-3.5" /> },
  { id: "whatsapp", label: "WhatsApp typing", icon: <MessageSquare className="h-3.5 w-3.5" /> },
  { id: "stocks", label: "Stock prices", icon: <TrendingUp className="h-3.5 w-3.5" /> },
  { id: "order", label: "QuickBite tracking", icon: <Bike className="h-3.5 w-3.5" /> },
];

const PM_INSIGHT: Record<Sim, string> = {
  uber: "Real-time tracking improves user trust — seeing the car actually move removes the “is this working?” anxiety.",
  whatsapp:
    "Tiny real-time interactions improve engagement — a typing dot is trivial tech but a powerful signal that someone's there.",
  stocks:
    "Real-time systems are critical for financial products — a stale price isn't just bad UX, it's the wrong decision.",
  order:
    "Live status changes keep users in the app and reduce “where is my order?” support tickets.",
};

/** Section 6 — four continuously-animating real-world simulations. */
export function ProductSims() {
  const [sim, setSim] = useState<Sim>("uber");

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSim(t.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium transition-colors",
              sim === t.id
                ? "bg-brand text-white shadow-soft"
                : "border border-border text-muted hover:text-fg"
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-bg p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={sim}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {sim === "uber" && <UberSim />}
            {sim === "whatsapp" && <WhatsappSim />}
            {sim === "stocks" && <StocksSim />}
            {sim === "order" && <OrderSim />}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">PM insight: </span>
        {PM_INSIGHT[sim]}
      </p>
    </div>
  );
}

function UberSim() {
  const [pos, setPos] = useState(4);
  const [eta, setEta] = useState(9);

  useEffect(() => {
    const id = setInterval(() => {
      setPos((p) => (p >= 92 ? 4 : p + 6));
      setEta((e) => (e <= 1 ? 9 : Math.round((e - 0.5) * 10) / 10));
    }, 1100);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">Driver en route</span>
        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-500">
          ETA {eta} min
        </span>
      </div>
      <div className="relative mt-8 h-24 overflow-hidden rounded-xl border border-border bg-surface">
        {/* road */}
        <div className="absolute left-6 right-6 top-1/2 h-1 -translate-y-1/2 rounded-full border-2 border-dashed border-border" />
        <span className="absolute left-6 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-border bg-bg text-brand">
          <MapPin className="h-4 w-4" />
        </span>
        <motion.div
          className="absolute top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-brand text-white shadow-glow"
          animate={{ left: `${pos}%` }}
          transition={{ duration: 1, ease: "linear" }}
        >
          <Car className="h-5 w-5" />
        </motion.div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-[12px] text-muted">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        Location pushed continuously — the car moves and the ETA drops on its
        own.
      </div>
    </div>
  );
}

function WhatsappSim() {
  const [phase, setPhase] = useState<"idle" | "typing" | "sent">("idle");

  useEffect(() => {
    const seq = [
      () => setPhase("typing"),
      () => setPhase("sent"),
      () => setPhase("idle"),
    ];
    let i = 0;
    const id = setInterval(() => {
      seq[i % seq.length]();
      i += 1;
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-auto max-w-sm">
      <div className="flex items-center gap-3 border-b border-border pb-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-soft text-brand">
          A
        </span>
        <div>
          <p className="text-sm font-semibold">Aanya</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={phase}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "text-[11px]",
                phase === "typing" ? "text-emerald-500" : "text-muted"
              )}
            >
              {phase === "typing" ? "typing…" : "online"}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="max-w-[75%] rounded-2xl border border-border bg-surface px-3 py-2 text-[13px]">
          Are you coming tonight?
        </div>
        <AnimatePresence>
          {phase === "typing" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-fit items-center gap-1 rounded-2xl border border-border bg-surface px-3 py-2.5"
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-muted"
                  animate={{ y: [0, -3, 0] }}
                  transition={{
                    duration: 0.7,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </motion.div>
          )}
          {phase === "sent" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="ml-auto w-fit max-w-[75%] rounded-2xl bg-brand px-3 py-2 text-[13px] text-white"
            >
              Yes! On my way 🎉
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-5 text-[12px] text-muted">
        The “typing…” signal is sent live the instant a key is pressed — no
        request, no refresh.
      </p>
    </div>
  );
}

function StocksSim() {
  const [rows, setRows] = useState(
    TICKERS.map((t) => ({ ...t, delta: 0 }))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setRows((rs) =>
        rs.map((r) => {
          const { price, delta } = tickPrice(r.price);
          return { ...r, price, delta };
        })
      );
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">Live market</span>
        <span className="flex items-center gap-1.5 text-[11px] text-muted">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          updating every second
        </span>
      </div>
      <div className="mt-4 space-y-2">
        {rows.map((r) => {
          const up = r.delta >= 0;
          return (
            <div
              key={r.symbol}
              className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold">{r.symbol}</p>
                <p className="text-[11px] text-muted">{r.name}</p>
              </div>
              <div className="text-right">
                <motion.p
                  key={r.price}
                  initial={{ color: up ? "#10b981" : "#f43f5e" }}
                  animate={{ color: "rgb(var(--fg))" }}
                  transition={{ duration: 1 }}
                  className="text-sm font-bold tabular-nums"
                >
                  ₹{r.price.toFixed(2)}
                </motion.p>
                <p
                  className={cn(
                    "text-[11px] font-medium tabular-nums",
                    up ? "text-emerald-500" : "text-rose-500"
                  )}
                >
                  {up ? "▲" : "▼"} {Math.abs(r.delta).toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrderSim() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStage((s) => (s >= ORDER_STAGES.length - 1 ? 0 : s + 1));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <p className="text-sm font-semibold">Order #4821 · Burger Barn</p>
      <div className="mt-5 space-y-2">
        {ORDER_STAGES.map((st, i) => {
          const Icon = getIcon(st.icon);
          const active = i === stage;
          const done = i < stage;
          return (
            <motion.div
              key={st.id}
              animate={{ opacity: active || done ? 1 : 0.4 }}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
                active
                  ? "border-emerald-500/40 bg-emerald-500/10"
                  : "border-border bg-surface"
              )}
            >
              <span
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-lg",
                  active || done
                    ? "bg-emerald-500/15 text-emerald-500"
                    : "bg-border text-muted"
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium">{st.label}</p>
                <p className="text-[11px] text-muted">{st.sub}</p>
              </div>
              {active && (
                <motion.span
                  className="ml-auto h-2 w-2 rounded-full bg-emerald-500"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
      <p className="mt-4 text-[12px] text-muted">
        The status advances on its own — pushed live as the order really
        moves, no refresh needed.
      </p>
    </div>
  );
}
