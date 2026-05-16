"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  KeyRound,
  Loader2,
  CheckCircle2,
  XCircle,
  LogIn,
  RotateCcw,
  Lock,
  LockOpen,
  Timer,
} from "lucide-react";
import {
  LOGIN_PIPELINE,
  OUTCOME_RESPONSE,
  CREDENTIALS,
  PROTECTED_ROUTES,
  type LoginOutcome,
} from "@/lib/auth";
import { getIcon } from "@/lib/icons";
import { cn, sleep } from "@/lib/utils";

type Phase = "idle" | "running" | "done";

const SESSION_SECONDS = 30;

const SCENARIOS: { id: LoginOutcome; label: string }[] = [
  { id: "success", label: "Correct login" },
  { id: "wrong-password", label: "Wrong password" },
  { id: "expired", label: "Expired session" },
  { id: "server-error", label: "Server failure" },
];

/** How far the pipeline animates before a given outcome stops it. */
const STOP_AT: Record<LoginOutcome, number> = {
  success: LOGIN_PIPELINE.length,
  "wrong-password": 2, // request + db check, then fail
  expired: 1,
  "server-error": 1,
};

export function LoginPlayground() {
  const [email, setEmail] = useState(CREDENTIALS.email);
  const [password, setPassword] = useState(CREDENTIALS.password);
  const [scenario, setScenario] = useState<LoginOutcome>("success");
  const [phase, setPhase] = useState<Phase>("idle");
  const [stepIdx, setStepIdx] = useState(-1);
  const [result, setResult] = useState<LoginOutcome | null>(null);
  const [seconds, setSeconds] = useState(SESSION_SECONDS);
  const [shake, setShake] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => () => clearInterval(timer.current), []);

  const loggedIn = result === "success" && seconds > 0;

  // Session countdown — auto-expires when it hits zero.
  useEffect(() => {
    if (result !== "success") return;
    setSeconds(SESSION_SECONDS);
    timer.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timer.current);
          setResult("expired");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer.current);
  }, [result]);

  async function login() {
    if (phase === "running") return;
    clearInterval(timer.current);
    setResult(null);
    setPhase("running");
    setStepIdx(-1);

    // Typed-credential check still matters for the success path.
    const credsOk =
      email.trim() === CREDENTIALS.email &&
      password === CREDENTIALS.password;
    const outcome: LoginOutcome =
      scenario === "success" && !credsOk ? "wrong-password" : scenario;

    const stop = STOP_AT[outcome];
    for (let i = 0; i < stop; i++) {
      setStepIdx(i);
      await sleep(620);
    }

    if (outcome !== "success") {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }

    setResult(outcome);
    setPhase("done");
  }

  function reset() {
    clearInterval(timer.current);
    setPhase("idle");
    setStepIdx(-1);
    setResult(null);
    setSeconds(SESSION_SECONDS);
    setEmail(CREDENTIALS.email);
    setPassword(CREDENTIALS.password);
    setScenario("success");
  }

  return (
    <div className="space-y-5">
      {/* scenario chips */}
      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setScenario(s.id);
              setPhase("idle");
              setResult(null);
              setStepIdx(-1);
            }}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              scenario === s.id
                ? "border-brand/50 bg-brand-soft text-brand"
                : "border-border bg-surface text-muted hover:text-fg"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        {/* login card */}
        <motion.div
          animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
          transition={{ duration: 0.45 }}
          className={cn(
            "rounded-2xl border bg-surface p-6 shadow-soft transition-colors",
            result === "success" && "border-emerald-500/40",
            result &&
              result !== "success" &&
              "border-rose-500/40"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white">
              <LogIn className="h-4 w-4" />
            </span>
            <p className="text-sm font-semibold">Log in to QuickBite</p>
          </div>

          <label className="mt-5 block text-xs font-medium text-muted">
            Email
          </label>
          <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-border bg-bg px-3 py-2.5">
            <Mail className="h-4 w-4 text-muted" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <label className="mt-3 block text-xs font-medium text-muted">
            Password
          </label>
          <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-border bg-bg px-3 py-2.5">
            <KeyRound className="h-4 w-4 text-muted" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <p className="mt-2 text-[11px] text-muted">
            Demo: <span className="font-mono">{CREDENTIALS.email}</span> /{" "}
            <span className="font-mono">{CREDENTIALS.password}</span>
          </p>

          <div className="mt-4 flex gap-2">
            <button
              onClick={login}
              disabled={phase === "running"}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {phase === "running" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {phase === "running" ? "Verifying…" : "Log in"}
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center justify-center rounded-xl border border-border px-3 py-2.5 transition-colors hover:border-brand/40"
              aria-label="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* status */}
          <div className="mt-4 rounded-xl border border-border bg-bg p-3 text-sm">
            <AnimatePresence mode="wait">
              {!result && phase !== "running" && (
                <motion.p
                  key="lo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-muted"
                >
                  <Lock className="h-4 w-4" /> Logged out
                </motion.p>
              )}
              {phase === "running" && (
                <motion.p
                  key="auth"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-brand"
                >
                  <Loader2 className="h-4 w-4 animate-spin" /> Authenticating…
                </motion.p>
              )}
              {result === "success" && (
                <motion.p
                  key="ok"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 font-medium text-emerald-500"
                >
                  <CheckCircle2 className="h-4 w-4" /> Logged in as Rahul
                </motion.p>
              )}
              {result && result !== "success" && (
                <motion.p
                  key="err"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 font-medium text-rose-500"
                >
                  <XCircle className="h-4 w-4" />
                  {result === "expired"
                    ? "Session expired — log in again"
                    : result === "server-error"
                    ? "Auth service unavailable"
                    : "Login failed"}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* pipeline + response + token */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              What happens behind the scenes
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
              {LOGIN_PIPELINE.map((s, i) => {
                const Icon = getIcon(s.icon);
                const reached = stepIdx >= i || result === "success";
                const isFailPoint =
                  result &&
                  result !== "success" &&
                  i === STOP_AT[result] - 1;
                const done =
                  result === "success" ? true : stepIdx > i && !isFailPoint;
                return (
                  <div
                    key={s.key}
                    className="flex items-center gap-2 sm:flex-1 sm:flex-col sm:gap-1.5"
                  >
                    <motion.span
                      animate={{
                        scale: stepIdx === i && phase === "running" ? 1.12 : 1,
                      }}
                      className={cn(
                        "grid h-9 w-9 place-items-center rounded-xl border transition-colors",
                        isFailPoint
                          ? "border-rose-500/40 bg-rose-500/10 text-rose-500"
                          : done
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                          : reached
                          ? "border-brand/40 bg-brand-soft text-brand"
                          : "border-border bg-bg text-muted"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </motion.span>
                    <span
                      className={cn(
                        "text-[11px] sm:text-center",
                        reached ? "text-fg" : "text-muted"
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* response json */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Auth response
            </p>
            <div className="mt-3 rounded-lg bg-[#0b0c12] p-3 font-mono text-[12px] text-slate-300">
              <AnimatePresence mode="wait">
                {phase === "running" ? (
                  <motion.p
                    key="w"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-slate-500"
                  >
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    waiting…
                  </motion.p>
                ) : result ? (
                  <motion.pre
                    key={result}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="whitespace-pre-wrap break-words"
                  >
                    {JSON.stringify(OUTCOME_RESPONSE[result], null, 2)}
                  </motion.pre>
                ) : (
                  <motion.p
                    key="i"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-slate-600"
                  >
                    {"// pick a scenario and log in"}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* token + session + protected routes */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Session
                </p>
                {loggedIn && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-500">
                    <Timer className="h-3.5 w-3.5" />
                    {seconds}s
                  </span>
                )}
              </div>
              {loggedIn ? (
                <>
                  <p className="mt-3 break-all rounded-lg bg-bg px-3 py-2 font-mono text-[11px] text-brand">
                    qb_jwt_token_92x...
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                    <motion.div
                      className="h-full rounded-full bg-emerald-500"
                      animate={{
                        width: `${(seconds / SESSION_SECONDS) * 100}%`,
                      }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-muted">
                    The app remembers Rahul using this token until it expires.
                  </p>
                </>
              ) : (
                <p className="mt-3 text-xs text-muted">
                  No active session. A token appears here only after a
                  successful login.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Protected screens
              </p>
              <div className="mt-3 space-y-2">
                {PROTECTED_ROUTES.map((r) => {
                  const Icon = getIcon(r.icon);
                  return (
                    <div
                      key={r.label}
                      className={cn(
                        "flex items-center justify-between rounded-lg border px-3 py-2 text-xs transition-colors",
                        loggedIn
                          ? "border-emerald-500/30 bg-emerald-500/10"
                          : "border-border bg-bg text-muted"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5" />
                        {r.label}
                      </span>
                      {loggedIn ? (
                        <LockOpen className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Lock className="h-3.5 w-3.5" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
