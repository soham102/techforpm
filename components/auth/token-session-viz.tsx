"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Contact,
  Badge,
  Smartphone,
  Server,
  ArrowRight,
  CheckCircle2,
  Lock,
  LockOpen,
} from "lucide-react";
import { PROTECTED_ROUTES } from "@/lib/auth";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/** Section 4 — sessions vs tokens, animated token travel, protected routes. */
export function TokenSessionViz() {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <AnalogyCard
          icon={<Badge className="h-5 w-5" />}
          title="What is a session?"
          tagline="Like a visitor badge in an office"
          body="Once security verifies you at the front desk, you get a badge. For the rest of your visit the building just checks the badge — it doesn't re-verify your ID at every door. A session is the app temporarily remembering “this person is verified”."
        />
        <AnalogyCard
          icon={<Contact className="h-5 w-5" />}
          title="What is a token?"
          tagline="Like a digital identity card"
          body="The token is the badge itself — a tamper-proof card the app holds. Every time the app asks the backend for something, it shows this card so the backend knows who's asking, without a fresh password each time."
        />
      </div>

      <TokenTravel />
      <ProtectedRoutes />
    </div>
  );
}

function AnalogyCard({
  icon,
  title,
  tagline,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  tagline: string;
  body: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-border bg-surface p-6 shadow-soft"
    >
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand">
        {icon}
      </span>
      <h4 className="mt-4 text-base font-semibold">{title}</h4>
      <p className="mt-1 text-sm font-medium text-brand">{tagline}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </motion.div>
  );
}

function TokenTravel() {
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);

  function send() {
    if (sent) return;
    setVerified(false);
    setSent(true);
    setTimeout(() => setVerified(true), 1100);
    setTimeout(() => setSent(false), 1700);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-base font-semibold">
            How the token is actually used
          </h4>
          <p className="mt-1 text-sm text-muted">
            After login the app keeps the token and attaches it to every
            request — the backend verifies it instead of asking for the
            password again.
          </p>
        </div>
        <button
          onClick={send}
          disabled={sent}
          className="shrink-0 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
        >
          Send a request
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 rounded-xl bg-bg px-6 py-8">
        <Node icon={<Smartphone className="h-5 w-5" />} label="Frontend" sub="holds token" />

        <div className="relative mx-2 h-px flex-1 bg-gradient-to-r from-brand/30 via-brand/40 to-brand/30">
          <AnimatePresence>
            {sent && (
              <motion.span
                initial={{ left: "0%", opacity: 0 }}
                animate={{ left: "100%", opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold text-white shadow-glow"
              >
                <Contact className="h-3 w-3" /> token
              </motion.span>
            )}
          </AnimatePresence>
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] text-muted">
            request + token
          </span>
        </div>

        <Node
          icon={
            verified ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Server className="h-5 w-5" />
            )
          }
          label="Backend"
          sub={verified ? "token verified" : "verifies token"}
          accent={verified}
        />
      </div>
    </div>
  );
}

function Node({
  icon,
  label,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span
        className={cn(
          "grid h-12 w-12 place-items-center rounded-2xl transition-colors",
          accent ? "bg-emerald-500 text-white" : "bg-brand-soft text-brand"
        )}
      >
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold leading-tight">{label}</p>
        <p className="text-[11px] text-muted">{sub}</p>
      </div>
    </div>
  );
}

function ProtectedRoutes() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-base font-semibold">Protected routes</h4>
          <p className="mt-1 text-sm text-muted">
            Some screens need a valid token. Toggle the login state and watch
            them lock and unlock.
          </p>
        </div>
        <button
          onClick={() => setLoggedIn((v) => !v)}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
            loggedIn
              ? "bg-emerald-500 text-white"
              : "border border-border bg-bg"
          )}
        >
          {loggedIn ? (
            <LockOpen className="h-4 w-4" />
          ) : (
            <Lock className="h-4 w-4" />
          )}
          {loggedIn ? "Logged in" : "Logged out"}
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {PROTECTED_ROUTES.map((r) => {
          const Icon = getIcon(r.icon);
          return (
            <motion.div
              key={r.label}
              animate={{
                opacity: loggedIn ? 1 : 0.65,
              }}
              className={cn(
                "relative overflow-hidden rounded-xl border p-4 transition-colors",
                loggedIn
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : "border-border bg-bg"
              )}
            >
              <span
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-lg",
                  loggedIn
                    ? "bg-emerald-500/20 text-emerald-500"
                    : "bg-surface text-muted"
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <p className="mt-3 text-sm font-medium">{r.label}</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={loggedIn ? "open" : "locked"}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "mt-1 flex items-center gap-1 text-[11px] font-medium",
                    loggedIn ? "text-emerald-500" : "text-muted"
                  )}
                >
                  {loggedIn ? (
                    <>
                      <LockOpen className="h-3 w-3" /> Access granted
                    </>
                  ) : (
                    <>
                      <Lock className="h-3 w-3" /> Access denied
                    </>
                  )}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
