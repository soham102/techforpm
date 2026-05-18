"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Boxes } from "lucide-react";

export function InterviewCTA() {
  return (
    <section className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-border bg-surface px-6 py-16 text-center shadow-soft-lg md:px-12 md:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-brand/20 blur-[110px]" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-fuchsia-500/15 blur-[90px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Start Thinking Like a{" "}
          <span className="bg-gradient-to-r from-brand to-fuchsia-400 bg-clip-text text-transparent">
            Product Manager
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted">
          Structure beats memorization. Practice the way real interviews
          work — and walk in knowing you can crack it.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#mock"
            className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5"
          >
            Practice Questions
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3.5 text-sm font-semibold transition-colors hover:border-brand/40"
          >
            <Boxes className="h-4 w-4 text-brand" />
            Explore Tech Concepts
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
