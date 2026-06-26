"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Lock,
  Package,
  Link2,
  GitMerge,
  Brain,
  Eye,
  Eraser,
  BookMarked,
  BookOpen,
  BarChart3,
} from "lucide-react";

const CONCEPTS = [
  {
    id: "scorm",
    title: "SCORM",
    description:
      "How platforms remember your quiz progress across sessions and devices.",
    icon: Package,
    difficulty: "Beginner" as const,
    minutes: 15,
    available: true,
    color: "text-brand",
    bg: "bg-brand-soft",
    border: "border-brand/20",
    gradient: "from-brand/10 to-transparent",
  },
  {
    id: "lti",
    title: "LTI",
    description:
      "The bridge between external tools and your LMS — seamless single-sign-on integrations.",
    icon: Link2,
    difficulty: "Intermediate" as const,
    minutes: 12,
    available: true,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    gradient: "from-violet-500/10 to-transparent",
  },
  {
    id: "publishing-workflow",
    title: "Publishing Workflow",
    description:
      "How e-learning content moves from authoring tools to live courses on an LMS.",
    icon: GitMerge,
    difficulty: "Beginner" as const,
    minutes: 10,
    available: true,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    gradient: "from-emerald-500/10 to-transparent",
  },
  {
    id: "adaptive-learning",
    title: "Adaptive Learning",
    description:
      "AI-powered systems that adjust course difficulty based on learner performance.",
    icon: Brain,
    difficulty: "Advanced" as const,
    minutes: 18,
    available: true,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    gradient: "from-rose-500/10 to-transparent",
  },
  {
    id: "accessibility",
    title: "Accessibility",
    description:
      "Making courses WCAG-compliant — screen readers, captions, and keyboard navigation.",
    icon: Eye,
    difficulty: "Intermediate" as const,
    minutes: 14,
    available: true,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    gradient: "from-cyan-500/10 to-transparent",
  },
  {
    id: "clean-slate",
    title: "Clean Slate",
    description:
      "Data privacy in EdTech — GDPR, COPPA, and learner data deletion flows.",
    icon: Eraser,
    difficulty: "Intermediate" as const,
    minutes: 12,
    available: false,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    gradient: "from-amber-500/10 to-transparent",
  },
  {
    id: "back-to-school",
    title: "Back To School",
    description:
      "How institutions reset cohorts, migrate content, and handle enrollment cycles.",
    icon: BookMarked,
    difficulty: "Beginner" as const,
    minutes: 10,
    available: false,
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    gradient: "from-sky-500/10 to-transparent",
  },
  {
    id: "epub",
    title: "EPUB",
    description:
      "The open ebook standard — reflowable content, metadata, and DRM explained.",
    icon: BookOpen,
    difficulty: "Beginner" as const,
    minutes: 8,
    available: false,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    gradient: "from-pink-500/10 to-transparent",
  },
  {
    id: "rubrics",
    title: "Rubrics",
    description:
      "Structured assessment criteria — how grading becomes fair, scalable, and consistent.",
    icon: BarChart3,
    difficulty: "Beginner" as const,
    minutes: 8,
    available: false,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    gradient: "from-orange-500/10 to-transparent",
  },
];

const DIFFICULTY_STYLES = {
  Beginner:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
  Intermediate:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20",
  Advanced: "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/20",
};

export default function EdTechPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border/50 bg-bg">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(99,102,241,0.1) 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-[120px]" />

        <div className="relative mx-auto max-w-5xl px-5 py-16">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/domain-knowledge"
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
            >
              <ArrowLeft className="h-4 w-4" />
              Domain Knowledge
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1"
          >
            <span className="text-xs font-semibold text-brand tracking-wide">
              EdTech Concepts
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-black tracking-tight text-fg md:text-4xl mb-3"
          >
            How EdTech Products Actually Work
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="max-w-xl text-[15px] text-muted leading-relaxed"
          >
            9 interactive simulations that teach you the standards and systems
            behind every learning platform — from SCORM to accessibility to
            adaptive AI.
          </motion.p>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-5xl px-5 py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CONCEPTS.map((concept, i) => {
            const Icon = concept.icon;

            const card = (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07, ease: "easeOut" }}
                whileHover={concept.available ? { y: -5 } : undefined}
                className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-surface p-5 shadow-soft transition-all ${
                  concept.available
                    ? `${concept.border} hover:shadow-soft-lg cursor-pointer`
                    : "border-border opacity-65"
                }`}
              >
                {/* Hover gradient */}
                {concept.available && (
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${concept.gradient} opacity-0 transition-opacity group-hover:opacity-100`}
                  />
                )}

                {/* Icon + badge */}
                <div className="relative flex items-start justify-between mb-4">
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-xl ${concept.bg} ${concept.color} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${DIFFICULTY_STYLES[concept.difficulty]}`}
                  >
                    {concept.difficulty}
                  </span>
                </div>

                {/* Content */}
                <div className="relative flex-1">
                  <h3 className="text-base font-bold tracking-tight text-fg mb-1.5">
                    {concept.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {concept.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="relative mt-5 flex items-center justify-between border-t border-border/60 pt-4 text-sm">
                  <span className="inline-flex items-center gap-1.5 text-muted">
                    <Clock className="h-3.5 w-3.5" />
                    {concept.minutes} min
                  </span>

                  {concept.available ? (
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${concept.color}`}
                    >
                      Start Simulation
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-muted">
                      <Lock className="h-3.5 w-3.5" />
                      Coming Soon
                    </span>
                  )}
                </div>
              </motion.div>
            );

            if (!concept.available) return <div key={concept.id}>{card}</div>;
            return (
              <Link
                key={concept.id}
                href={`/domain-knowledge/edtech/${concept.id}`}
                className="block h-full"
              >
                {card}
              </Link>
            );
          })}
        </div>

        {/* Coming soon note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 rounded-2xl border border-border/50 bg-surface p-6 text-center"
        >
          <p className="text-sm font-semibold text-fg mb-1">
            More simulations launching soon
          </p>
          <p className="text-sm text-muted">
            EPUB, Accessibility, Clean Slate, and 3 more are in development —
            built with the same interactive, simulation-first philosophy.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
