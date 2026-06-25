"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, ArrowRight, Sparkles } from "lucide-react";

const DOMAINS = [
  {
    id: "edtech",
    title: "EdTech Concepts",
    description:
      "SCORM, LTI, Adaptive Learning, EPUB, and more — how education technology works behind the scenes.",
    icon: GraduationCap,
    count: 9,
    available: true,
    color: "brand",
    gradient: "from-brand/20 via-violet-500/10 to-transparent",
    border: "border-brand/30",
    iconBg: "bg-brand-soft",
    iconColor: "text-brand",
    badge: "Active",
    badgeStyle: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  },
  {
    id: "fintech",
    title: "FinTech Concepts",
    description:
      "Payment rails, KYC, fraud detection, and open banking — how financial products are built.",
    icon: BookOpen,
    count: 0,
    available: false,
    color: "amber",
    gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
    border: "border-amber-500/20",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    badge: "Coming Soon",
    badgeStyle: "bg-bg text-muted ring-border",
  },
  {
    id: "healthtech",
    title: "HealthTech Concepts",
    description:
      "EHR systems, FHIR, HIPAA compliance, and telemedicine infrastructure — the healthcare stack.",
    icon: BookOpen,
    count: 0,
    available: false,
    color: "rose",
    gradient: "from-rose-500/10 via-pink-500/5 to-transparent",
    border: "border-rose-500/20",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-400",
    badge: "Coming Soon",
    badgeStyle: "bg-bg text-muted ring-border",
  },
];

export default function DomainKnowledgePage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(99,102,241,0.12) 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-[140px]" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-[300px] w-[400px] translate-x-1/3 translate-y-1/3 rounded-full bg-violet-500/10 blur-[100px]" />

        <div className="relative mx-auto max-w-4xl px-5 py-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            <span className="text-xs font-semibold text-brand tracking-wide">
              Domain Knowledge · PMverse
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-5 text-4xl font-black tracking-tight text-fg md:text-5xl lg:text-6xl leading-tight"
          >
            Learn Industry Concepts Through{" "}
            <span className="bg-gradient-to-r from-brand via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Interactive Simulations
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-muted leading-relaxed"
          >
            Understand how real products work behind the scenes using visual
            stories and hands-on simulations.
          </motion.p>

          {/* Differentiators */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-3"
          >
            {[
              { emoji: "🎮", label: "Simulation-first" },
              { emoji: "📖", label: "Storytelling" },
              { emoji: "🎨", label: "Visual" },
              { emoji: "🔰", label: "Beginner friendly" },
            ].map((tag) => (
              <span
                key={tag.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-muted"
              >
                {tag.emoji} {tag.label}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Domain cards */}
      <section className="mx-auto max-w-5xl px-5 py-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Choose a Domain
          </h2>
          <p className="mt-3 text-[15px] text-muted">
            Each domain is a deep-dive into a real industry vertical.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map((domain, i) => {
            const Icon = domain.icon;
            const card = (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1, ease: "easeOut" }}
                whileHover={domain.available ? { y: -6 } : undefined}
                className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-surface p-6 shadow-soft transition-all ${
                  domain.available
                    ? `${domain.border} hover:shadow-soft-lg cursor-pointer`
                    : "border-border opacity-60"
                }`}
              >
                {/* Gradient wash */}
                {domain.available && (
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${domain.gradient} opacity-0 transition-opacity group-hover:opacity-100`}
                  />
                )}

                <div className="relative flex items-start justify-between mb-5">
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-xl ${domain.iconBg} ${domain.iconColor} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${domain.badgeStyle}`}
                  >
                    {domain.badge}
                  </span>
                </div>

                <div className="relative flex-1">
                  <h3 className="text-xl font-bold tracking-tight text-fg mb-2">
                    {domain.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {domain.description}
                  </p>
                </div>

                <div className="relative mt-5 flex items-center justify-between border-t border-border/60 pt-4">
                  {domain.available ? (
                    <>
                      <span className="text-xs text-muted">
                        {domain.count} concepts
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-sm font-semibold ${domain.iconColor}`}
                      >
                        Explore
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-muted">Simulations coming soon</span>
                  )}
                </div>
              </motion.div>
            );

            if (!domain.available) return <div key={domain.id}>{card}</div>;
            return (
              <Link
                key={domain.id}
                href={`/domain-knowledge/${domain.id}`}
                className="block h-full"
              >
                {card}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Philosophy strip */}
      <section className="border-t border-border/50 bg-surface">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-3">
              PMverse Philosophy
            </p>
            <h2 className="text-2xl font-bold text-fg mb-3">
              People don't just read concepts —
            </h2>
            <p className="text-2xl font-bold bg-gradient-to-r from-brand via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              they interact with them.
            </p>
            <p className="mt-4 text-muted max-w-lg mx-auto text-[15px]">
              Every simulation here is designed so you finish understanding how
              something works in a real product — without reading a single page
              of documentation.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
