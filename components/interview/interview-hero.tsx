"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Target, MessageSquareText } from "lucide-react";
import { STATS } from "@/lib/interview-prep";

const FLOATING = [
  {
    label: "Product Sense",
    q: "“Improve Spotify for road-trips.”",
    className: "left-[4%] top-[14%]",
    delay: 0,
  },
  {
    label: "Estimation",
    q: "“# of EVs in Bangalore?”",
    className: "right-[5%] top-[20%]",
    delay: 0.6,
  },
  {
    label: "Metrics",
    q: "“Success for Uber Pool?”",
    className: "left-[8%] bottom-[14%]",
    delay: 1.2,
  },
  {
    label: "Strategy",
    q: "“Should YouTube do podcasts?”",
    className: "right-[7%] bottom-[16%]",
    delay: 1.8,
  },
];

export function InterviewHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Animated gradient backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-40 left-1/2 h-[460px] w-[680px] -translate-x-1/2 rounded-full bg-brand/25 blur-[130px]"
          animate={{ opacity: [0.55, 0.85, 0.55], scale: [1, 1.08, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-32 top-24 h-[320px] w-[320px] rounded-full bg-fuchsia-500/15 blur-[120px]"
          animate={{ y: [0, 28, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(127,127,170,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(127,127,170,0.05)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_70%)]" />
      </div>

      {/* Floating interview cards (decorative, hidden on small screens) */}
      {FLOATING.map((f) => (
        <motion.div
          key={f.label}
          aria-hidden
          className={`pointer-events-none absolute hidden w-52 rounded-2xl border border-border bg-surface/70 p-4 shadow-soft backdrop-blur-md xl:block ${f.className}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: [0, -12, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: f.delay },
            y: {
              duration: 6,
              delay: f.delay,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-semibold text-brand">
            <MessageSquareText className="h-3 w-3" />
            {f.label}
          </span>
          <p className="mt-2.5 text-sm font-medium leading-snug">{f.q}</p>
        </motion.div>
      ))}

      <div className="relative mx-auto max-w-3xl px-5 py-24 text-center md:py-32">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-muted shadow-soft"
        >
          <Sparkles className="h-3.5 w-3.5 text-brand" />
          PM Interview Prep — think, structure, win
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mt-6 text-balance text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl"
        >
          Crack Product{" "}
          <span className="bg-gradient-to-r from-brand to-fuchsia-400 bg-clip-text text-transparent">
            Management
          </span>{" "}
          Interviews
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted"
        >
          Learn how top PM candidates think, structure answers, and solve
          product problems — built for beginners from non-tech backgrounds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href="#categories"
            className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5"
          >
            Start Preparing
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#mock"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3.5 text-sm font-semibold transition-colors hover:border-brand/40"
          >
            <Target className="h-4 w-4 text-brand" />
            Try Mock Questions
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-4"
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-surface/60 px-4 py-5 shadow-soft backdrop-blur-sm"
            >
              <div className="bg-gradient-to-r from-brand to-fuchsia-400 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
                {s.value}
              </div>
              <div className="mt-1 text-xs font-medium text-muted">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
