"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Database,
  Sparkles,
  Clock,
  ChevronRight,
  TrendingUp,
  Users,
  Zap,
  Cpu,
  Trophy,
  ArrowLeft,
  Play,
} from "lucide-react";
import { SCENARIOS, type Scenario } from "./data";
import { FOUNDATION_SCENARIOS } from "./foundation-data";
import { ActiveSimulator } from "./simulator";
import { cn } from "@/lib/utils";

// ─── Floating background SQL/chart elements ───────────────────────────────────
const FLOATING_SNIPPETS = [
  "SELECT DAU, MAU\nFROM metrics\nWHERE date = TODAY()",
  "GROUP BY\n  city, category\nORDER BY\n  retention DESC",
  "ROUND(AVG(\n  delivery_time\n), 1) AS avg_min",
  "WITH cohorts AS (\n  SELECT ...\n  FROM users\n)",
  "PARTITION BY\n  user_id\nORDER BY\n  event_at DESC",
];

function FloatingSnippet({
  text,
  style,
  delay,
}: {
  text: string;
  style: React.CSSProperties;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: [0, 0.55, 0.55, 0], y: [20, 0, 0, -20] }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        repeatDelay: 4,
        ease: "easeInOut",
      }}
      className="pointer-events-none absolute hidden rounded-xl border border-border/40 bg-surface/60 px-3 py-2.5 font-mono text-[10px] leading-relaxed text-muted/80 shadow-soft backdrop-blur-sm xl:block"
      style={style}
    >
      {text.split("\n").map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </motion.div>
  );
}

// ─── Stats bar ────────────────────────────────────────────────────────────────
const STATS = [
  { icon: Database, label: "Business Scenarios", value: "50+" },
  { icon: BarChart3, label: "SQL Challenges", value: "200+" },
  { icon: Cpu, label: "PM Simulations", value: "Real" },
  { icon: TrendingUp, label: "Product Metrics", value: "Live" },
];

// ─── Hero section ─────────────────────────────────────────────────────────────
function LabHero({ onStart }: { onStart: () => void }) {
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="relative overflow-hidden">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 mx-auto h-[500px] max-w-3xl rounded-full bg-brand/15 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-20 h-[300px] w-[300px] rounded-full bg-violet-500/8 blur-[100px]"
      />

      {/* Floating SQL snippets */}
      {FLOATING_SNIPPETS.map((text, i) => (
        <FloatingSnippet
          key={i}
          text={text}
          delay={i * 1.5}
          style={{
            top: `${[15, 35, 55, 20, 65][i]}%`,
            left: i % 2 === 0 ? `${[2, 4, 1][i % 3]}%` : undefined,
            right: i % 2 !== 0 ? `${[2, 3][Math.floor(i / 2) % 2]}%` : undefined,
          }}
        />
      ))}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-4xl px-5 py-20 text-center md:py-28"
      >
        {/* Badge */}
        <motion.span
          variants={item}
          className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-4 py-1.5 text-xs font-semibold text-brand"
        >
          <Sparkles className="h-3.5 w-3.5" />
          PM Analytics Lab · SQL Simulation Platform
        </motion.span>

        {/* Headline */}
        <motion.h1
          variants={item}
          className="mt-6 text-balance text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl"
        >
          Learn SQL Through{" "}
          <span className="bg-gradient-to-r from-brand via-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Product Thinking
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={item}
          className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted"
        >
          Practice SQL, analyze business metrics, and solve real PM scenarios
          through interactive simulations. Feel like you're the PM working on
          live product data.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={item}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <button
            onClick={onStart}
            className="group inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5 active:scale-95"
          >
            <Play className="h-4 w-4" />
            Start a Scenario
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-7 py-3.5 text-sm font-semibold transition-colors hover:border-brand/40"
          >
            <BarChart3 className="h-4 w-4 text-brand" />
            Explore Analytics Lab
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={item}
          className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {STATS.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1.5 rounded-2xl border border-border/60 bg-surface/50 px-4 py-4 backdrop-blur-sm"
            >
              <Icon className="h-5 w-5 text-brand" />
              <span className="text-xl font-bold tracking-tight">{value}</span>
              <span className="text-center text-xs text-muted">{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Mini animated chart (decorative, on scenario cards) ─────────────────────
function MiniSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 24;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / range) * h,
  }));
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: 80, height: 24 }}>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Scenario card ────────────────────────────────────────────────────────────
function ScenarioCard({
  scenario,
  index,
  onSelect,
  conceptBadge,
}: {
  scenario: Scenario;
  index: number;
  onSelect: (s: Scenario) => void;
  conceptBadge?: string;
}) {
  const diffColor: Record<string, string> = {
    Beginner: "text-emerald-500 bg-emerald-500/10 ring-emerald-500/20",
    Intermediate: "text-amber-500 bg-amber-500/10 ring-amber-500/20",
    Advanced: "text-rose-500 bg-rose-500/10 ring-rose-500/20",
  };

  const sparkValues = scenario.chartData.map((d) => d.value);

  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      onClick={() => onSelect(scenario)}
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border bg-surface p-6 text-left shadow-soft transition-all duration-300",
        scenario.accentBorder,
        "hover:shadow-lg"
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "grid h-12 w-12 place-items-center rounded-xl text-2xl shadow-soft",
              scenario.accentBg
            )}
          >
            {scenario.emoji}
          </span>
          <div>
            <p className={cn("text-xs font-semibold uppercase tracking-wider", scenario.accentText)}>
              {scenario.industry}
            </p>
            <h3 className="mt-0.5 text-base font-semibold tracking-tight">
              {scenario.company}
            </h3>
          </div>
        </div>

        {/* Sparkline */}
        <div className={cn("opacity-60 transition-opacity group-hover:opacity-100", scenario.accentText)}>
          <MiniSparkline data={sparkValues} />
        </div>
      </div>

      {/* Description */}
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
        {scenario.description}
      </p>

      {/* SQL Concept badge (foundation scenarios only) */}
      {conceptBadge && (
        <div className="mt-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand">
            <Database className="h-3 w-3" />
            {conceptBadge}
          </span>
        </div>
      )}

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {scenario.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-border/60 bg-elevated px-2 py-0.5 text-[10px] font-medium text-muted"
          >
            {skill}
          </span>
        ))}
        {scenario.skills.length > 4 && (
          <span className="rounded-full border border-border/60 bg-elevated px-2 py-0.5 text-[10px] font-medium text-muted">
            +{scenario.skills.length - 4}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-y-2 border-t border-border/60 pt-4 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-muted">
            <Clock className="h-3.5 w-3.5" />
            {scenario.estimatedMinutes} min
          </span>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 font-medium ring-1 ring-inset",
              diffColor[scenario.sqlDifficulty]
            )}
          >
            SQL: {scenario.sqlDifficulty}
          </span>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 font-medium ring-1 ring-inset",
              diffColor[scenario.pmDifficulty]
            )}
          >
            PM: {scenario.pmDifficulty}
          </span>
        </div>
        <span
          className={cn(
            "flex items-center gap-1 font-semibold transition-transform group-hover:translate-x-1",
            scenario.accentText
          )}
        >
          Start <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </motion.button>
  );
}

// ─── Gamification badges ───────────────────────────────────────────────────────
const BADGES = [
  { icon: "🔍", name: "SQL Explorer", desc: "Run your first query" },
  { icon: "📊", name: "Metrics Detective", desc: "Solve 3 scenarios" },
  { icon: "🔽", name: "Funnel Analyst", desc: "Complete a funnel challenge" },
  { icon: "♻️", name: "Retention Master", desc: "Solve a cohort query" },
  { icon: "🧠", name: "PM Strategist", desc: "Answer 5 PM questions correctly" },
];

function BadgeShowcase() {
  return (
    <section className="py-16">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Gamification
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          Earn Badges. Level Up Your PM Skills.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] text-muted">
          Every SQL query you run and business question you answer brings you
          closer to becoming a data-driven PM.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {BADGES.map((badge, i) => (
          <motion.div
            key={badge.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface px-6 py-5 text-center shadow-soft"
          >
            <span className="text-3xl">{badge.icon}</span>
            <span className="text-sm font-semibold">{badge.name}</span>
            <span className="text-xs text-muted">{badge.desc}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────────────────────
const HOW_STEPS = [
  {
    icon: Users,
    title: "Choose a Business Scenario",
    desc: "Pick from 7 real-world companies: food delivery, streaming, ride-sharing, SaaS, and more.",
  },
  {
    icon: Database,
    title: "Explore the Live Dashboard",
    desc: "Analyze KPI cards, trend charts, and real product metrics before you write a single query.",
  },
  {
    icon: BarChart3,
    title: "Write & Run SQL Queries",
    desc: "Use the built-in editor with schema viewer and a multi-level hint system to write your query.",
  },
  {
    icon: Cpu,
    title: "Answer PM Thinking Questions",
    desc: "Interpret the data like a real PM — identify root causes, recommend experiments, prioritize.",
  },
  {
    icon: Trophy,
    title: "Get the Full Insight Review",
    desc: "See the ideal SQL solution, business breakdown, and senior PM recommendations side by side.",
  },
  {
    icon: Zap,
    title: "Earn XP & Unlock Badges",
    desc: "Track your progress across scenarios. Build a portfolio of PM analytical thinking skills.",
  },
];

function HowItWorks() {
  return (
    <section className="pb-16">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          How it Works
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          Not a Coding Drill. A PM Simulation.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] text-muted">
          The focus is always on{" "}
          <em>thinking like a Product Manager using data</em> — not memorizing
          SQL syntax.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {HOW_STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6 shadow-soft"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{step.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Scenario picker section ──────────────────────────────────────────────────
function ScenarioPicker({ onSelect }: { onSelect: (s: Scenario) => void }) {
  return (
    <section className="pb-10" id="scenarios">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          7 Business Scenarios
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          Choose Your Simulation
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-[15px] text-muted">
          Each scenario drops you inside a real-world company with live KPI
          dashboards, product data, and a business problem to solve.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SCENARIOS.map((scenario, i) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            index={i}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Foundation scenarios picker ──────────────────────────────────────────────
function FoundationPicker({ onSelect }: { onSelect: (s: Scenario) => void }) {
  return (
    <section className="pb-16 pt-4" id="foundations">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">
          SQL Foundations
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          Learn One Concept at a Time
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-[15px] text-muted">
          20 beginner-friendly scenarios, each focused on a single SQL concept.
          Perfect for building intuition from scratch before tackling complex simulations.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {FOUNDATION_SCENARIOS.map((scenario, i) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            index={i}
            onSelect={onSelect}
            conceptBadge={scenario.sqlConcept}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Root orchestrator ────────────────────────────────────────────────────────
export function PMAnalyticsLab() {
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);

  const handleSelectScenario = (scenario: Scenario) => {
    setActiveScenario(scenario);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setActiveScenario(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToScenarios = () => {
    document.getElementById("scenarios")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-6xl px-5 pb-28">
      <AnimatePresence mode="wait">
        {activeScenario ? (
          <motion.div
            key="simulator"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            <div className="pt-6">
              <button
                onClick={handleBack}
                className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to scenarios
              </button>
              <ActiveSimulator scenario={activeScenario} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LabHero onStart={scrollToScenarios} />
            <HowItWorks />
            <ScenarioPicker onSelect={handleSelectScenario} />
            <FoundationPicker onSelect={handleSelectScenario} />
            <BadgeShowcase />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
