"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Soft ambient gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-[420px] max-w-3xl rounded-full bg-brand/20 blur-[120px]"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-3xl px-5 py-24 text-center md:py-32"
      >
        <motion.span
          variants={item}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-muted shadow-soft"
        >
          <Sparkles className="h-3.5 w-3.5 text-brand" />
          An interactive concept playground — not a course
        </motion.span>

        <motion.h1
          variants={item}
          className="mt-6 text-balance text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl"
        >
          Technical Concepts Explained for{" "}
          <span className="bg-gradient-to-r from-brand to-indigo-400 bg-clip-text text-transparent">
            Product Managers
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted"
        >
          Learn APIs, databases, and system design visually — without coding.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/api-module"
            className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5"
          >
            Start Learning
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/api-module"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3.5 text-sm font-semibold transition-colors hover:border-brand/40"
          >
            <Play className="h-4 w-4 text-brand" />
            Explore API Module
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
