"use client";

import { useEffect, useState } from "react";

/* ── Dummy data ── */
const OVERALL_SCORE = 82;

const METRICS = [
  {
    label: "Product Sense",
    score: 88,
    delta: "+12",
    color: "violet",
    icon: "◈",
    summary: "Strong user empathy and problem framing. You consistently anchored decisions in user needs.",
  },
  {
    label: "Communication",
    score: 79,
    delta: "+8",
    color: "indigo",
    icon: "◉",
    summary: "Clear structure throughout. Occasional verbosity — aim for tighter, more decisive statements.",
  },
  {
    label: "Structure",
    score: 84,
    delta: "+15",
    color: "purple",
    icon: "◎",
    summary: "Good use of CIRCLES and RICE frameworks. Transitions between sections were logical and smooth.",
  },
  {
    label: "Prioritization",
    score: 76,
    delta: "+5",
    color: "fuchsia",
    icon: "◐",
    summary: "Solid instinct, but needs more explicit trade-off reasoning. Quantify the impact-effort ratio.",
  },
];

const STRENGTHS = [
  { title: "User-Centric Thinking", desc: "You naturally led with user pain points before proposing solutions in every answer." },
  { title: "Metric Fluency", desc: "Defined a clear north star metric (affordability rate) with supporting guardrails." },
  { title: "Structured Frameworks", desc: "Applied CIRCLES methodology cleanly across product sense and design questions." },
  { title: "Stakeholder Awareness", desc: "Proactively addressed driver incentives and Uber's revenue model in trade-off analysis." },
];

const IMPROVEMENTS = [
  { title: "Quantify Trade-offs", desc: "State explicit numbers when discussing trade-offs — e.g. '20% cost increase vs 15% retention gain'." },
  { title: "Sharper Hypotheses", desc: "Lead with a clear hypothesis before explaining reasoning. Don't bury the answer." },
  { title: "Competitive Context", desc: "Bring in 1-2 competitor examples to ground your strategy in market reality." },
  { title: "Launch Sequencing", desc: "Be more specific about phased rollout — city selection criteria, pilot duration, and success gates." },
];

const FRAMEWORKS = [
  {
    name: "CIRCLES",
    category: "Product Design",
    desc: "Comprehend → Identify → Report → Cut → List → Evaluate → Summarise",
    relevance: "High",
    color: "violet",
  },
  {
    name: "RICE Scoring",
    category: "Prioritization",
    desc: "Reach × Impact × Confidence ÷ Effort — for feature backlog prioritization",
    relevance: "High",
    color: "indigo",
  },
  {
    name: "Jobs-to-be-Done",
    category: "User Research",
    desc: "Frame features around the job users hire them for, not demographics",
    relevance: "Medium",
    color: "purple",
  },
  {
    name: "North Star Framework",
    category: "Metrics",
    desc: "One primary metric + 3-5 input metrics + guardrail metrics",
    relevance: "High",
    color: "fuchsia",
  },
  {
    name: "Go-to-Market Canvas",
    category: "Launch Strategy",
    desc: "Target → Message → Channel → Timeline → Success criteria",
    relevance: "Medium",
    color: "sky",
  },
];

const TIMELINE = [
  { time: "0:00", actor: "AI", event: "Opening question delivered", type: "question" },
  { time: "0:48", actor: "You", event: "Answered with user segmentation approach", type: "answer" },
  { time: "1:02", actor: "AI", event: "Follow-up: primary user segment identification", type: "question" },
  { time: "2:15", actor: "You", event: "Defined college commuter segment with research methods", type: "answer" },
  { time: "2:31", actor: "AI", event: "Follow-up: success metrics & north star", type: "question" },
  { time: "3:44", actor: "You", event: "Proposed affordability rate + retention guardrail", type: "answer" },
  { time: "3:58", actor: "AI", event: "Follow-up: trade-offs with driver & revenue model", type: "question" },
  { time: "5:10", actor: "You", event: "Identified 3 trade-offs with mitigation strategies", type: "answer" },
  { time: "5:26", actor: "AI", event: "Final: MVP launch strategy", type: "question" },
  { time: "6:52", actor: "You", event: "Outlined phased city rollout with success gates", type: "answer" },
];

/* ── Helpers ── */
const COLOR = {
  violet:  { bar: "bg-violet-500",  text: "text-violet-400",  border: "border-violet-500/20", bg: "bg-violet-600/10",  ring: "ring-violet-500/20"  },
  indigo:  { bar: "bg-indigo-500",  text: "text-indigo-400",  border: "border-indigo-500/20", bg: "bg-indigo-600/10",  ring: "ring-indigo-500/20"  },
  purple:  { bar: "bg-purple-500",  text: "text-purple-400",  border: "border-purple-500/20", bg: "bg-purple-600/10",  ring: "ring-purple-500/20"  },
  fuchsia: { bar: "bg-fuchsia-500", text: "text-fuchsia-400", border: "border-fuchsia-500/20",bg: "bg-fuchsia-600/10", ring: "ring-fuchsia-500/20" },
  sky:     { bar: "bg-sky-500",     text: "text-sky-400",     border: "border-sky-500/20",    bg: "bg-sky-600/10",     ring: "ring-sky-500/20"     },
} as const;
type ColorKey = keyof typeof COLOR;

function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
}

function useMountFade() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const r = requestAnimationFrame(() => setMounted(true)); return () => cancelAnimationFrame(r); }, []);
  return mounted;
}

/* ════════════════════════════════════════════ */
export default function ReportPage() {
  const overallDisplay = useCountUp(OVERALL_SCORE, 1400);
  const pageMounted = useMountFade();

  return (
    <main
      className={`min-h-screen bg-[#0a0a0f] text-white pb-24 transition-opacity duration-500 ${
        pageMounted ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[700px] w-[700px] rounded-full bg-violet-600/8 blur-[140px]" />
        <div className="absolute top-1/2 right-0 h-[500px] w-[500px] rounded-full bg-indigo-500/6 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/6 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pt-10 space-y-8">

        {/* ── HERO ── */}
        <HeroSection overallDisplay={overallDisplay} />

        {/* ── PERFORMANCE METRICS ── */}
        <Section title="Performance Breakdown" subtitle="Scores across the 4 core PM interview dimensions">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {METRICS.map((m, i) => (
              <MetricCard key={m.label} metric={m} delay={i * 80} />
            ))}
          </div>
        </Section>

        {/* ── STRENGTHS + IMPROVEMENTS (2-col) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Section title="Strengths" subtitle="What you did well">
            <div className="flex flex-col gap-3">
              {STRENGTHS.map((s, i) => (
                <FeedbackItem key={s.title} item={s} variant="strength" delay={i * 60} />
              ))}
            </div>
          </Section>
          <Section title="Areas to Improve" subtitle="Focus points for next session">
            <div className="flex flex-col gap-3">
              {IMPROVEMENTS.map((s, i) => (
                <FeedbackItem key={s.title} item={s} variant="improve" delay={i * 60} />
              ))}
            </div>
          </Section>
        </div>

        {/* ── FRAMEWORKS ── */}
        <Section title="Recommended PM Frameworks" subtitle="Practise these to sharpen your toolkit">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FRAMEWORKS.map((f, i) => (
              <FrameworkCard key={f.name} fw={f} delay={i * 70} />
            ))}
          </div>
        </Section>

        {/* ── TIMELINE ── */}
        <Section title="Interview Timeline" subtitle="A minute-by-minute breakdown of your session">
          <TimelineList />
        </Section>

        {/* ── CTA ── */}
        <CTASection />
      </div>
    </main>
  );
}

/* ══════════════════════ Sub-components ══════════════════════ */

function HeroSection({ overallDisplay }: { overallDisplay: number }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.025] backdrop-blur-sm p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-center gap-8">
        {/* Circular score */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg width="140" height="140" viewBox="0 0 100 100" className="-rotate-90">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="url(#scoreGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="283"
              strokeDashoffset={283 - (overallDisplay / 100) * 283}
              style={{ transition: "stroke-dashoffset 0.05s linear" }}
            />
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold tabular-nums text-white">{overallDisplay}</span>
            <span className="text-xs text-zinc-500">/ 100</span>
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-4 text-center sm:text-left">
          {/* Badge */}
          <div className="flex justify-center sm:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-600/15 px-4 py-1.5 text-sm font-semibold text-violet-300">
              <span className="text-base">✦</span>
              Senior PM Potential
            </span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
              Strong performance across<br className="hidden sm:block" /> all dimensions
            </h1>
            <p className="mt-2 text-zinc-400 text-sm leading-relaxed max-w-lg">
              You demonstrated solid product thinking and structured communication. Your user-centric framing and
              metric fluency stand out. Focus on sharpening trade-off quantification and you'll be interview-ready
              for senior PM roles.
            </p>
          </div>
          {/* Mini stat row */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-4">
            {[
              { label: "Questions", value: "5" },
              { label: "Duration", value: "6:52" },
              { label: "Round", value: "Product Sense" },
              { label: "Level", value: "Senior PM" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center sm:items-start">
                <span className="text-base font-bold text-white">{s.value}</span>
                <span className="text-[10px] text-zinc-600 uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-white">{title}</h2>
        <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function MetricCard({ metric, delay }: { metric: typeof METRICS[0]; delay: number }) {
  const [visible, setVisible] = useState(false);
  const [barWidth, setBarWidth] = useState(0);
  const c = COLOR[metric.color as ColorKey];

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(true);
      setBarWidth(metric.score);
    }, delay + 200);
    return () => clearTimeout(t);
  }, [delay, metric.score]);

  return (
    <div
      className={`rounded-xl border ${c.border} bg-white/[0.02] p-5 backdrop-blur-sm transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-lg ${c.text}`}>{metric.icon}</span>
          <div>
            <p className="text-sm font-semibold text-white">{metric.label}</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-bold tabular-nums ${c.text}`}>{metric.score}</span>
          <span className="text-zinc-600 text-xs">/100</span>
          <p className="text-[10px] text-emerald-500 font-medium mt-0.5">{metric.delta} vs last</p>
        </div>
      </div>

      {/* Bar */}
      <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden mb-3">
        <div
          className={`h-full rounded-full ${c.bar} transition-all duration-700 ease-out`}
          style={{ width: `${barWidth}%` }}
        />
      </div>

      <p className="text-xs text-zinc-500 leading-relaxed">{metric.summary}</p>
    </div>
  );
}

function FeedbackItem({
  item,
  variant,
  delay,
}: {
  item: { title: string; desc: string };
  variant: "strength" | "improve";
  delay: number;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay + 300);
    return () => clearTimeout(t);
  }, [delay]);

  const isStrength = variant === "strength";

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-500 ${
        visible ? "opacity-100 translate-x-0" : `opacity-0 ${isStrength ? "-translate-x-3" : "translate-x-3"}`
      } ${
        isStrength
          ? "border-emerald-500/15 bg-emerald-500/5"
          : "border-amber-500/15 bg-amber-500/5"
      }`}
    >
      <div className="flex items-start gap-2.5">
        <span className={`mt-0.5 text-sm ${isStrength ? "text-emerald-400" : "text-amber-400"}`}>
          {isStrength ? "✓" : "→"}
        </span>
        <div>
          <p className="text-xs font-semibold text-white">{item.title}</p>
          <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{item.desc}</p>
        </div>
      </div>
    </div>
  );
}

function FrameworkCard({ fw, delay }: { fw: typeof FRAMEWORKS[0]; delay: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay + 400);
    return () => clearTimeout(t);
  }, [delay]);

  const c = COLOR[fw.color as ColorKey];

  return (
    <div
      className={`rounded-xl border ${c.border} ${c.bg} p-4 backdrop-blur-sm transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <p className={`text-sm font-bold ${c.text}`}>{fw.name}</p>
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ring-1 ${c.ring} ${c.text} ${c.bg}`}
        >
          {fw.relevance}
        </span>
      </div>
      <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">{fw.category}</p>
      <p className="text-xs text-zinc-400 leading-relaxed">{fw.desc}</p>
    </div>
  );
}

function TimelineList() {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5 space-y-0">
      {TIMELINE.map((item, i) => {
        const isLast = i === TIMELINE.length - 1;
        const isQuestion = item.type === "question";
        return (
          <div key={i} className="flex gap-4">
            {/* Spine */}
            <div className="flex flex-col items-center">
              <div
                className={`mt-1 h-5 w-5 shrink-0 rounded-full border flex items-center justify-center text-[8px] font-bold ${
                  isQuestion
                    ? "border-violet-500/40 bg-violet-600/20 text-violet-400"
                    : "border-indigo-500/40 bg-indigo-600/20 text-indigo-400"
                }`}
              >
                {isQuestion ? "Q" : "A"}
              </div>
              {!isLast && <div className="w-px flex-1 bg-white/8 my-1" />}
            </div>

            {/* Content */}
            <div className={`pb-4 ${isLast ? "pb-0" : ""}`}>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-[10px] text-zinc-600">{item.time}</span>
                <span className={`text-[10px] font-semibold ${isQuestion ? "text-violet-400" : "text-indigo-400"}`}>
                  {item.actor}
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{item.event}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CTASection() {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-6 sm:p-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white">Ready for your next round?</h2>
        <p className="text-sm text-zinc-500 mt-1">Keep the momentum going — consistent practice is the fastest path to an offer.</p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href="/interview-coach/session"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all duration-200 hover:bg-violet-500 hover:-translate-y-0.5 active:translate-y-0"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Practice Again
        </a>
        <a
          href="/interview-coach/onboarding"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:border-white/20 hover:bg-white/8 hover:text-white hover:-translate-y-0.5"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
          Start Mock Interview
        </a>
        <a
          href="/interview-coach"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:border-white/20 hover:bg-white/8 hover:text-white hover:-translate-y-0.5"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
          </svg>
          View Progress
        </a>
      </div>
    </div>
  );
}
