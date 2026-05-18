"use client";

import { motion } from "framer-motion";
import {
  MousePointerClick,
  Boxes,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { GoogleSignInButton } from "./google-signin-button";
import { AuthBackground } from "./auth-background";

const VALUE_CARDS = [
  {
    icon: MousePointerClick,
    title: "Interactive Simulations",
    body: "Click through real request/response flows, cache hits, and DB queries — learn by doing, not reading.",
  },
  {
    icon: Boxes,
    title: "Real Product Scenarios",
    body: "Every concept is framed around decisions PMs actually make — scaling, latency, trade-offs.",
  },
  {
    icon: Sparkles,
    title: "Beginner-Friendly Visuals",
    body: "Plain-language analogies and animated diagrams. Zero code required to follow along.",
  },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

export function LoginScreen({
  redirectedFrom,
  error,
}: {
  redirectedFrom?: string;
  error?: string;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#070710] text-white">
      <AuthBackground />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-8 lg:py-12">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="flex items-center gap-2.5"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-500 shadow-[0_0_24px_rgba(99,102,241,0.6)]">
            <Boxes className="h-5 w-5" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            PMverse
          </span>
        </motion.div>

        <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Left — hero + value props */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[12px] font-medium text-white/70 backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
              The visual systems course for product managers
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.05 }}
              className="mt-6 text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]"
            >
              Learn Technical
              <br />
              Concepts{" "}
              <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                Visually
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.12 }}
              className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/60"
            >
              Built for non-technical Product Managers who want to
              understand APIs, databases, caching, system design, and
              more — without coding.
            </motion.p>

            <div className="mt-9 grid gap-4 sm:grid-cols-3">
              {VALUE_CARDS.map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.55,
                    ease,
                    delay: 0.2 + i * 0.08,
                  }}
                  whileHover={{ y: -4 }}
                  className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md transition-colors hover:border-indigo-400/40 hover:bg-white/[0.07]"
                >
                  <span className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-indigo-500/15 text-indigo-300 ring-1 ring-inset ring-indigo-400/20 transition-transform group-hover:scale-110">
                    <card.icon className="h-4 w-4" />
                  </span>
                  <h3 className="text-[13.5px] font-semibold">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/50">
                    {card.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — glassmorphism login card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.15 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="absolute -inset-px rounded-[1.75rem] bg-gradient-to-b from-white/20 via-white/5 to-transparent" />
            <div className="relative rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-10">
              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight">
                  Welcome 👋
                </h2>
                <p className="mt-2 text-[14px] text-white/55">
                  Sign in to unlock every interactive module.
                </p>
              </div>

              <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

              <GoogleSignInButton redirectedFrom={redirectedFrom} />

              {error && (
                <p
                  className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-center text-[13px] text-red-300"
                  role="alert"
                >
                  {decodeURIComponent(error)}
                </p>
              )}

              <p className="mt-6 flex items-center justify-center gap-1.5 text-[12px] text-white/40">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secured by Supabase · We never post on your behalf
              </p>

              <p className="mt-6 text-center text-[12px] leading-relaxed text-white/35">
                By continuing you agree to our Terms of Service and
                Privacy Policy.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="pt-4 text-center text-[12px] text-white/30"
        >
          © {new Date().getFullYear()} PMverse — Learn
          systems the way you ship products.
        </motion.p>
      </div>
    </div>
  );
}
