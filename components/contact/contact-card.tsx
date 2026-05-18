"use client";

import { motion } from "framer-motion";
import { Mail, User, MessageSquareHeart, ArrowUpRight } from "lucide-react";

const NAME = "Soham Chotalia";
const EMAIL = "sohamssb102@gmail.com";

export function ContactCard() {
  return (
    <section className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-72 max-w-xl rounded-full bg-brand/20 blur-[120px]"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative text-center"
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Contact
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Get in touch
        </h1>
        <p className="mx-auto mt-4 max-w-md text-pretty text-[15px] leading-relaxed text-muted">
          This platform is always evolving. Please feel free to suggest
          any improvements and write to me on the email below — I&apos;d
          genuinely love to hear your ideas.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="relative mx-auto mt-10 max-w-md overflow-hidden rounded-3xl border border-border bg-surface p-8 shadow-soft-lg"
      >
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
              <User className="h-5 w-5" />
            </span>
            <div className="text-left">
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                Name
              </p>
              <p className="mt-0.5 text-[15px] font-semibold">{NAME}</p>
            </div>
          </div>

          <div className="h-px bg-border/70" />

          <div className="flex items-center gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
              <Mail className="h-5 w-5" />
            </span>
            <div className="text-left">
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                Contact email
              </p>
              <a
                href={`mailto:${EMAIL}`}
                className="mt-0.5 inline-block text-[15px] font-semibold text-brand transition-opacity hover:opacity-80"
              >
                {EMAIL}
              </a>
            </div>
          </div>
        </div>

        <a
          href={`mailto:${EMAIL}?subject=${encodeURIComponent(
            "Suggestion for PMverse"
          )}`}
          className="group mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5"
        >
          <MessageSquareHeart className="h-4 w-4" />
          Suggest an improvement
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </motion.div>
    </section>
  );
}
