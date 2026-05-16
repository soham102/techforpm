"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Database,
  ShieldCheck,
  KeyRound,
  Smartphone,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { cn, sleep } from "@/lib/utils";

/** Section 6 — password encryption + 2FA, explained visually. */
export function SecurityConcepts() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <PasswordEncryption />
      <TwoFactor />
    </div>
  );
}

function scramble(len: number) {
  const chars = "abcdef0123456789";
  return Array.from({ length: len }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

function PasswordEncryption() {
  const [pw, setPw] = useState("quickbite123");
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const [hash, setHash] = useState("");

  async function encrypt() {
    setStage(1);
    for (let i = 0; i < 6; i++) {
      setHash(scramble(24));
      await sleep(90);
    }
    setHash("e3b0c44298fc1c149afbf4c8996f");
    await sleep(450);
    setStage(2);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand">
        <Lock className="h-5 w-5" />
      </span>
      <h4 className="mt-4 text-base font-semibold">Password encryption</h4>
      <p className="mt-1 text-sm font-medium text-brand">
        Like locking information inside a safe
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Apps never store your real password. They lock it into unreadable text
        first — even the company can't read it back.
      </p>

      <div className="mt-5 flex items-center gap-2">
        <input
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            setStage(0);
          }}
          className="flex-1 rounded-xl border border-border bg-bg px-3 py-2.5 text-sm outline-none"
        />
        <button
          onClick={encrypt}
          className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
        >
          Encrypt
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <Box label="Your password" value={pw || "—"} muted />
        <Arrow />
        <Box
          label="Encrypted"
          value={stage === 0 ? "•••••••" : hash}
          mono
          active={stage >= 1}
        />
        <Arrow />
        <div
          className={cn(
            "flex flex-1 items-center gap-2 rounded-xl border px-3 py-2.5 text-xs transition-colors",
            stage === 2
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
              : "border-border bg-bg text-muted"
          )}
        >
          <Database className="h-4 w-4" />
          {stage === 2 ? "Stored safely" : "Database"}
        </div>
      </div>
    </div>
  );
}

function Box({
  label,
  value,
  mono,
  muted,
  active,
}: {
  label: string;
  value: string;
  mono?: boolean;
  muted?: boolean;
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex-1 rounded-xl border px-3 py-2 transition-colors",
        active ? "border-brand/40 bg-brand-soft" : "border-border bg-bg"
      )}
    >
      <p className="text-[10px] uppercase tracking-wide text-muted">{label}</p>
      <p
        className={cn(
          "mt-0.5 truncate text-xs",
          mono && "font-mono",
          muted && "text-muted"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function Arrow() {
  return (
    <ArrowRight className="hidden h-4 w-4 shrink-0 self-center text-muted sm:block" />
  );
}

const STEPS = [
  { icon: KeyRound, label: "Password", sub: "Step 1 — what you know" },
  { icon: Smartphone, label: "OTP on phone", sub: "Step 2 — what you have" },
  { icon: CheckCircle2, label: "Access granted", sub: "Identity confirmed" },
];

function TwoFactor() {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);

  async function run() {
    if (running) return;
    setRunning(true);
    setStep(-1);
    for (let i = 0; i < STEPS.length; i++) {
      setStep(i);
      await sleep(900);
    }
    setRunning(false);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand">
        <ShieldCheck className="h-5 w-5" />
      </span>
      <h4 className="mt-4 text-base font-semibold">
        Two-factor authentication (2FA)
      </h4>
      <p className="mt-1 text-sm font-medium text-brand">
        Logging in from a new device
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        A password alone could be stolen. 2FA also requires something only the
        real user has — their phone.
      </p>

      <button
        onClick={run}
        disabled={running}
        className="mt-5 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {running ? "Verifying…" : "Log in from new device"}
      </button>

      <div className="mt-5 space-y-2.5">
        {STEPS.map((s, i) => {
          const active = step === i;
          const done = step > i;
          return (
            <motion.div
              key={s.label}
              animate={{ opacity: step >= i ? 1 : 0.45 }}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
                done
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : active
                  ? "border-brand/40 bg-brand-soft"
                  : "border-border bg-bg"
              )}
            >
              <span
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-lg",
                  done
                    ? "bg-emerald-500/20 text-emerald-500"
                    : active
                    ? "bg-brand text-white"
                    : "bg-surface text-muted"
                )}
              >
                <s.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium">{s.label}</p>
                <p className="text-[11px] text-muted">{s.sub}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-4 rounded-xl bg-amber-500/10 px-3 py-2 text-[11px] text-amber-600 dark:text-amber-400">
        PM insight: extra security improves trust but adds friction — 2FA is a
        deliberate trade-off, not a default for every flow.
      </p>
    </div>
  );
}
