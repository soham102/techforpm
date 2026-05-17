"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Server, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = 0 | 1 | 2 | 3;

const PEOPLE = [
  { id: "a", name: "Aanya", role: "sender" },
  { id: "b", name: "Bilal", role: "receiver" },
  { id: "c", name: "Chitra", role: "receiver" },
] as const;

/**
 * Section 7 — one message, many users. A sends → server broadcasts → B and C
 * receive instantly. Step it manually or watch it play.
 */
export function MultiUserChat() {
  const [step, setStep] = useState<Step>(0);

  function send() {
    if (step !== 0) return;
    setStep(1);
    setTimeout(() => setStep(2), 750);
    setTimeout(() => setStep(3), 1500);
  }
  function reset() {
    setStep(0);
  }

  const received = step >= 3;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={send}
          disabled={step !== 0}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          Aanya sends a message
        </button>
        <button
          onClick={reset}
          className="rounded-full border border-border px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:text-fg"
        >
          Reset
        </button>
      </div>

      <div className="mt-7 rounded-2xl border border-border bg-bg p-6">
        {/* Server */}
        <div className="flex flex-col items-center">
          <motion.span
            animate={
              step === 1 || step === 2
                ? { scale: [1, 1.12, 1], borderColor: "rgb(16 185 129 / 0.5)" }
                : {}
            }
            transition={{ duration: 0.5, repeat: step === 1 || step === 2 ? Infinity : 0 }}
            className={cn(
              "grid h-14 w-14 place-items-center rounded-2xl border text-brand transition-colors",
              step >= 1
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                : "border-border bg-surface"
            )}
          >
            <Server className="h-6 w-6" />
          </motion.span>
          <p className="mt-2 text-xs font-medium text-muted">
            {step === 1
              ? "Message received…"
              : step === 2
              ? "Broadcasting to everyone…"
              : "Real-time server"}
          </p>
        </div>

        {/* Connections */}
        <div className="relative mt-2 h-10">
          {PEOPLE.map((p, i) => {
            const x = ["20%", "50%", "80%"][i];
            const lit =
              (p.role === "sender" && step >= 1) ||
              (p.role === "receiver" && step >= 2);
            return (
              <div
                key={p.id}
                className="absolute top-0 h-full w-px"
                style={{ left: x }}
              >
                <div
                  className={cn(
                    "h-full w-px transition-colors",
                    lit ? "bg-emerald-500/50" : "bg-border"
                  )}
                />
                {/* moving packet */}
                {p.role === "sender" && step === 1 && (
                  <motion.span
                    className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-brand"
                    initial={{ bottom: 0 }}
                    animate={{ bottom: ["0%", "100%"] }}
                    transition={{ duration: 0.7 }}
                  />
                )}
                {p.role === "receiver" && step === 2 && (
                  <motion.span
                    className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-emerald-500"
                    initial={{ top: 0 }}
                    animate={{ top: ["0%", "100%"] }}
                    transition={{ duration: 0.7 }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* People */}
        <div className="grid grid-cols-3 gap-3">
          {PEOPLE.map((p) => {
            const isSender = p.role === "sender";
            const got = !isSender && received;
            return (
              <div
                key={p.id}
                className={cn(
                  "rounded-xl border p-4 text-center transition-colors",
                  isSender
                    ? "border-brand/40 bg-brand-soft"
                    : got
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : "border-border bg-surface"
                )}
              >
                <span
                  className={cn(
                    "mx-auto grid h-10 w-10 place-items-center rounded-full text-sm font-bold",
                    isSender
                      ? "bg-brand text-white"
                      : got
                      ? "bg-emerald-500 text-white"
                      : "bg-border text-muted"
                  )}
                >
                  {p.name[0]}
                </span>
                <p className="mt-2 text-sm font-medium">{p.name}</p>
                <p className="text-[11px] text-muted">
                  {isSender ? "Sender" : "Receiver"}
                </p>
                <AnimatePresence>
                  {isSender && step >= 1 && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 rounded-lg bg-brand px-2 py-1 text-[11px] text-white"
                    >
                      “Match starts at 7!”
                    </motion.p>
                  )}
                  {got && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-center justify-center gap-1 rounded-lg bg-emerald-500/15 px-2 py-1 text-[11px] text-emerald-500"
                    >
                      <Check className="h-3 w-3" /> received
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">In plain terms: </span>
        One event updates many users at once. Aanya sends once; the server
        fans it out so Bilal and Chitra see it instantly — that's how group
        chats, live scores and collaborative docs stay in sync.
      </p>
    </div>
  );
}
