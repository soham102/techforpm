"use client";

import { useEffect, useState, useRef } from "react";

/* ══════════════ Static data ══════════════ */

const HERO_STATS = [
  { label: "Total Interviews", value: 14, suffix: "", icon: "◈", color: "violet" },
  { label: "Average Score",    value: 79, suffix: "/100", icon: "◉", color: "indigo" },
  { label: "Current Streak",   value: 5,  suffix: " days", icon: "◎", color: "amber" },
  { label: "PM Skill Level",   value: "Senior",  suffix: "", icon: "✦", color: "emerald", isText: true },
];

const CHART_DATA = {
  "Product Sense": [52, 58, 61, 67, 71, 75, 80, 82, 84, 88],
  "Communication": [44, 50, 55, 59, 62, 66, 70, 72, 76, 79],
  "Structure":     [48, 54, 58, 64, 68, 72, 76, 79, 82, 84],
};
type ChartKey = keyof typeof CHART_DATA;
const CHART_COLORS: Record<ChartKey, { line: string; glow: string; label: string }> = {
  "Product Sense": { line: "#7c3aed", glow: "rgba(124,58,237,0.25)", label: "text-violet-400" },
  "Communication": { line: "#6366f1", glow: "rgba(99,102,241,0.25)", label: "text-indigo-400" },
  "Structure":     { line: "#a855f7", glow: "rgba(168,85,247,0.25)", label: "text-purple-400" },
};
const SESSIONS = ["S1","S2","S3","S4","S5","S6","S7","S8","S9","S10"];

const INTERVIEW_HISTORY = [
  { date: "26 May 2026", round: "Product Sense",  score: 88, duration: "6:52", badge: "Best",    color: "violet" },
  { date: "24 May 2026", round: "Execution",       score: 81, duration: "7:14", badge: null,       color: "indigo" },
  { date: "21 May 2026", round: "Behavioral",      score: 76, duration: "5:40", badge: null,       color: "purple" },
  { date: "18 May 2026", round: "Estimation",      score: 73, duration: "8:03", badge: null,       color: "fuchsia" },
  { date: "15 May 2026", round: "Strategy",        score: 70, duration: "6:30", badge: "First",   color: "sky" },
];

const ACHIEVEMENTS = [
  {
    title: "Product Thinker",
    desc: "Scored 85+ in Product Sense 3 times",
    icon: "◈",
    color: "violet",
    earned: true,
  },
  {
    title: "Metrics Master",
    desc: "Defined a north star metric in every session",
    icon: "◉",
    color: "indigo",
    earned: true,
  },
  {
    title: "Structured Communicator",
    desc: "Applied CIRCLES framework in 5+ interviews",
    icon: "◎",
    color: "purple",
    earned: true,
  },
  {
    title: "Trade-off Analyst",
    desc: "Score 90+ in Prioritization",
    icon: "◐",
    color: "fuchsia",
    earned: false,
  },
  {
    title: "Speed Thinker",
    desc: "Complete an interview in under 5 minutes",
    icon: "⏱",
    color: "amber",
    earned: false,
  },
  {
    title: "Consistency King",
    desc: "Maintain a 10-day practice streak",
    icon: "✦",
    color: "emerald",
    earned: false,
  },
];

const INSIGHTS = [
  {
    icon: "↑",
    color: "emerald",
    title: "Strongest growth in Structure (+36pts)",
    body: "Your framework adoption has been the biggest driver of improvement. You went from ad-hoc answers to consistently using CIRCLES and RICE across sessions.",
  },
  {
    icon: "→",
    color: "amber",
    title: "Communication plateau since Session 7",
    body: "Your communication score has stalled at ~75. The pattern shows verbose opening statements. Practice the 'lead with the answer' technique to break through.",
  },
  {
    icon: "✦",
    color: "violet",
    title: "Ready for senior PM rounds",
    body: "Based on your trajectory, you're performing at a senior PM level. Your next step is to push quantification — numbers in every trade-off and metric statement.",
  },
];

const PRACTICE_AREAS = [
  { label: "Trade-off Quantification", priority: "High",   score: 64, color: "rose"   },
  { label: "Competitive Analysis",     priority: "High",   score: 68, color: "amber"  },
  { label: "GTM Strategy",             priority: "Medium", score: 71, color: "orange" },
  { label: "Estimation Frameworks",    priority: "Medium", score: 74, color: "yellow" },
];

/* ══════════════ Color map ══════════════ */
const C: Record<string, { text: string; border: string; bg: string; bar: string; ring: string }> = {
  violet:  { text: "text-violet-400",  border: "border-violet-500/20",  bg: "bg-violet-600/10",  bar: "bg-violet-500",  ring: "ring-violet-500/20"  },
  indigo:  { text: "text-indigo-400",  border: "border-indigo-500/20",  bg: "bg-indigo-600/10",  bar: "bg-indigo-500",  ring: "ring-indigo-500/20"  },
  purple:  { text: "text-purple-400",  border: "border-purple-500/20",  bg: "bg-purple-600/10",  bar: "bg-purple-500",  ring: "ring-purple-500/20"  },
  fuchsia: { text: "text-fuchsia-400", border: "border-fuchsia-500/20", bg: "bg-fuchsia-600/10", bar: "bg-fuchsia-500", ring: "ring-fuchsia-500/20" },
  sky:     { text: "text-sky-400",     border: "border-sky-500/20",     bg: "bg-sky-600/10",     bar: "bg-sky-500",     ring: "ring-sky-500/20"     },
  amber:   { text: "text-amber-400",   border: "border-amber-500/20",   bg: "bg-amber-600/10",   bar: "bg-amber-500",   ring: "ring-amber-500/20"   },
  emerald: { text: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-600/10", bar: "bg-emerald-500", ring: "ring-emerald-500/20" },
  rose:    { text: "text-rose-400",    border: "border-rose-500/20",    bg: "bg-rose-600/10",    bar: "bg-rose-500",    ring: "ring-rose-500/20"    },
  orange:  { text: "text-orange-400",  border: "border-orange-500/20",  bg: "bg-orange-600/10",  bar: "bg-orange-500",  ring: "ring-orange-500/20"  },
  yellow:  { text: "text-yellow-400",  border: "border-yellow-500/20",  bg: "bg-yellow-600/10",  bar: "bg-yellow-500",  ring: "ring-yellow-500/20"  },
};

/* ══════════════ Hooks ══════════════ */
function useCountUp(target: number, duration = 1000, delay = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      let start: number | null = null;
      const step = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        setVal(Math.round(p * target));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return val;
}

function useMountFade() {
  const [m, setM] = useState(false);
  useEffect(() => { const r = requestAnimationFrame(() => setM(true)); return () => cancelAnimationFrame(r); }, []);
  return m;
}

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

/* ══════════════ Page ══════════════ */
export default function ProgressPage() {
  const pageFade = useMountFade();

  return (
    <main
      className={`min-h-screen bg-[#0a0a0f] text-white pb-28 transition-opacity duration-500 ${
        pageFade ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[700px] w-[700px] rounded-full bg-violet-600/8 blur-[140px]" />
        <div className="absolute top-1/2 right-0 h-[500px] w-[500px] rounded-full bg-indigo-500/6 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-purple-500/6 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pt-10 space-y-10">

        {/* Page header */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-1">PMVerse AI</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Interview Progress</h1>
            <p className="text-sm text-zinc-500 mt-1">Your growth over the last 10 sessions</p>
          </div>
          <a
            href="/interview-coach"
            className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition"
          >
            ← Back to home
          </a>
        </div>

        {/* Hero stats */}
        <HeroStats />

        {/* Charts */}
        <Section title="Score Trends" sub="All three dimensions over your last 10 sessions">
          <ChartsGrid />
        </Section>

        {/* History + Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Section title="Interview History" sub="5 most recent sessions">
            <HistoryList />
          </Section>
          <Section title="Achievements" sub="Earned and upcoming badges">
            <AchievementsGrid />
          </Section>
        </div>

        {/* AI Insights */}
        <Section title="AI Growth Insights" sub="Patterns identified across your sessions">
          <InsightsList />
        </Section>

        {/* Recommended */}
        <Section title="Recommended Practice Areas" sub="Ranked by improvement potential">
          <PracticeAreas />
        </Section>

        {/* CTA */}
        <CTARow />
      </div>
    </main>
  );
}

/* ══════════════ Section wrapper ══════════════ */
function Section({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        <p className="text-xs text-zinc-600 mt-0.5">{sub}</p>
      </div>
      {children}
    </div>
  );
}

/* ══════════════ Hero Stats ══════════════ */
function StatCard({ stat, delay }: { stat: typeof HERO_STATS[0]; delay: number }) {
  const count = useCountUp(typeof stat.value === "number" ? stat.value : 0, 900, delay);
  const display = stat.isText ? stat.value : count;
  const c = C[stat.color];
  return (
    <div className={`rounded-2xl border ${c.border} ${c.bg} p-5 backdrop-blur-sm group hover:-translate-y-1 transition-transform duration-200`}>
      <div className="flex items-start justify-between mb-3">
        <span className={`text-xl ${c.text}`}>{stat.icon}</span>
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${c.text} opacity-60`}>
          {stat.label}
        </span>
      </div>
      <p className="text-3xl font-bold text-white tabular-nums leading-none">
        {display}
        <span className="text-sm font-normal text-zinc-500 ml-1">{stat.suffix}</span>
      </p>
    </div>
  );
}

function HeroStats() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {HERO_STATS.map((s, i) => <StatCard key={s.label} stat={s} delay={i * 100} />)}
    </div>
  );
}

/* ══════════════ Sparkline chart ══════════════ */
function SparkChart({ metric, delay }: { metric: ChartKey; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const data = CHART_DATA[metric];
  const cfg  = CHART_COLORS[metric];

  const W = 280, H = 80, PAD = 6;
  const min = Math.min(...data) - 4;
  const max = Math.max(...data) + 4;
  const xs = data.map((_, i) => PAD + (i / (data.length - 1)) * (W - PAD * 2));
  const ys = data.map(v => H - PAD - ((v - min) / (max - min)) * (H - PAD * 2));

  const linePath = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const areaPath = linePath + ` L${xs[xs.length-1].toFixed(1)},${H} L${xs[0].toFixed(1)},${H} Z`;

  const latest = data[data.length - 1];
  const first  = data[0];
  const delta  = latest - first;

  return (
    <div
      ref={ref}
      className={`rounded-xl border border-white/8 bg-white/[0.02] p-4 transition-all duration-500 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className={`text-xs font-semibold ${cfg.label}`}>{metric}</p>
          <p className="text-[10px] text-zinc-600 mt-0.5">Over 10 sessions</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-white tabular-nums">{latest}</p>
          <p className="text-[10px] text-emerald-500 font-medium">+{delta} total</p>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" style={{ height: 80 }}>
        <defs>
          <linearGradient id={`area-${metric}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={cfg.line} stopOpacity="0.3" />
            <stop offset="100%" stopColor={cfg.line} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Area fill */}
        <path d={areaPath} fill={`url(#area-${metric})`} />
        {/* Line */}
        <path d={linePath} fill="none" stroke={cfg.line} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        {xs.map((x, i) => (
          <circle key={i} cx={x} cy={ys[i]} r="2.5" fill={cfg.line} opacity={i === data.length - 1 ? 1 : 0.4} />
        ))}
        {/* Latest glow */}
        <circle cx={xs[xs.length-1]} cy={ys[ys.length-1]} r="5" fill={cfg.glow} />
      </svg>

      {/* Session labels */}
      <div className="flex justify-between mt-1.5">
        {SESSIONS.map((s, i) => (
          <span key={i} className="text-[8px] text-zinc-700 tabular-nums">{s}</span>
        ))}
      </div>
    </div>
  );
}

function ChartsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {(Object.keys(CHART_DATA) as ChartKey[]).map((k, i) => (
        <SparkChart key={k} metric={k} delay={i * 100} />
      ))}
    </div>
  );
}

/* ══════════════ History ══════════════ */
function HistoryList() {
  return (
    <div className="flex flex-col gap-2.5">
      {INTERVIEW_HISTORY.map((h, i) => {
        const c = C[h.color];
        return (
          <div
            key={i}
            className={`flex items-center justify-between rounded-xl border ${c.border} bg-white/[0.02] px-4 py-3 group hover:bg-white/[0.04] transition-colors duration-150`}
          >
            <div className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center`}>
                <span className={`text-xs font-bold ${c.text}`}>{h.score}</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-white">{h.round}</p>
                <p className="text-[10px] text-zinc-600">{h.date} · {h.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {h.badge && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.bg} ${c.text} ring-1 ${c.ring}`}>
                  {h.badge}
                </span>
              )}
              <svg className="h-3.5 w-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════ Achievements ══════════════ */
function AchievementsGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {ACHIEVEMENTS.map((a, i) => {
        const c = C[a.color];
        return (
          <div
            key={i}
            className={`rounded-xl border p-3.5 transition-all duration-200 hover:-translate-y-0.5 ${
              a.earned
                ? `${c.border} ${c.bg}`
                : "border-white/6 bg-white/[0.01] opacity-50 grayscale"
            }`}
          >
            <div className="flex items-start gap-2">
              <span className={`text-lg ${a.earned ? c.text : "text-zinc-600"}`}>{a.icon}</span>
              <div>
                <p className={`text-xs font-semibold ${a.earned ? "text-white" : "text-zinc-500"}`}>{a.title}</p>
                <p className="text-[10px] text-zinc-600 mt-0.5 leading-tight">{a.desc}</p>
              </div>
            </div>
            {a.earned && (
              <div className="mt-2 flex items-center gap-1">
                <span className="text-[10px] text-emerald-500 font-semibold">✓ Earned</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════ Insights ══════════════ */
function InsightsList() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const colorMap: Record<string, string> = {
    emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-600/10",
    amber:   "text-amber-400   border-amber-500/20   bg-amber-600/10",
    violet:  "text-violet-400  border-violet-500/20  bg-violet-600/10",
  };
  return (
    <div ref={ref} className="flex flex-col gap-4">
      {INSIGHTS.map((ins, i) => (
        <div
          key={i}
          className={`flex gap-4 rounded-xl border border-white/8 bg-white/[0.02] p-5 transition-all duration-500 ${
            inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          }`}
          style={{ transitionDelay: `${i * 100}ms` }}
        >
          <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-sm font-bold ${colorMap[ins.color]}`}>
            {ins.icon}
          </span>
          <div>
            <p className="text-sm font-semibold text-white">{ins.title}</p>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{ins.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════ Practice Areas ══════════════ */
function PracticeAreas() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  return (
    <div ref={ref} className="flex flex-col gap-3">
      {PRACTICE_AREAS.map((p, i) => {
        const c = C[p.color];
        const isHigh = p.priority === "High";
        return (
          <div
            key={i}
            className={`rounded-xl border border-white/8 bg-white/[0.02] px-5 py-4 transition-all duration-500 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white">{p.label}</p>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isHigh
                      ? "bg-rose-600/15 text-rose-400 ring-1 ring-rose-500/20"
                      : "bg-amber-600/15 text-amber-400 ring-1 ring-amber-500/20"
                  }`}
                >
                  {p.priority}
                </span>
              </div>
              <span className={`text-sm font-bold tabular-nums ${c.text}`}>{p.score}/100</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
              <div
                className={`h-full rounded-full ${c.bar} transition-all duration-700`}
                style={{ width: inView ? `${p.score}%` : "0%" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════ CTA ══════════════ */
function CTARow() {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-6 sm:p-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white">Keep building momentum</h2>
        <p className="text-sm text-zinc-500 mt-1">
          You're on a {" "}
          <span className="text-amber-400 font-semibold">5-day streak</span>
          . Don't break the chain.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href="/interview-coach/session"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all hover:bg-violet-500 hover:-translate-y-0.5"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
          </svg>
          Start New Interview
        </a>
        <a
          href="/interview-coach/onboarding"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-300 transition-all hover:border-white/20 hover:bg-white/8 hover:text-white hover:-translate-y-0.5"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
          </svg>
          Practice Weak Areas
        </a>
      </div>
    </div>
  );
}
