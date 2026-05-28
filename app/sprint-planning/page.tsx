"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Zap, Users, Brain, BarChart3, GitBranch,
  Lightbulb, Target, TrendingUp, AlertTriangle, ChevronDown,
  Layers, Clock, MessageSquare, LayoutDashboard,
} from "lucide-react";

import { SprintBoard } from "@/components/sprint-planning/sprint-board";
import { TeamCapacity } from "@/components/sprint-planning/team-capacity";
import { AiRecommendations } from "@/components/sprint-planning/ai-recommendations";
import { AgileChaosPanel } from "@/components/sprint-planning/agile-chaos-panel";
import { BurndownChart } from "@/components/sprint-planning/burndown-chart";
import { SprintHealth } from "@/components/sprint-planning/sprint-health";
import { DependencyMap } from "@/components/sprint-planning/dependency-map";
import { SprintMetrics } from "@/components/sprint-planning/sprint-metrics";

import type { BacklogItem, TeamMember, ChaosEvent, Column } from "@/components/sprint-planning/types";

// ─── Static Data ───────────────────────────────────────────────────────────────

const INITIAL_ITEMS: BacklogItem[] = [
  {
    id: "google-login",
    title: "Google Login Integration",
    points: 5,
    businessImpact: "High",
    complexity: "Medium",
    priority: "P1",
    dependencies: [],
    category: "Backend",
    column: "backlog",
    description: "OAuth 2.0 integration with Google for seamless user authentication.",
  },
  {
    id: "payment-gateway",
    title: "Payment Gateway",
    points: 13,
    businessImpact: "Critical",
    complexity: "High",
    priority: "P0",
    dependencies: ["google-login"],
    category: "Backend",
    column: "backlog",
    description: "Stripe integration for processing subscription payments.",
  },
  {
    id: "analytics-dashboard",
    title: "Analytics Dashboard",
    points: 8,
    businessImpact: "High",
    complexity: "Medium",
    priority: "P1",
    dependencies: [],
    category: "Frontend",
    column: "backlog",
    description: "Real-time user engagement metrics and business KPIs.",
  },
  {
    id: "notifications",
    title: "Notification System",
    points: 5,
    businessImpact: "Medium",
    complexity: "Medium",
    priority: "P2",
    dependencies: ["google-login"],
    category: "Backend",
    column: "backlog",
    description: "Push and email notifications for key user events.",
  },
  {
    id: "user-profile",
    title: "User Profile",
    points: 3,
    businessImpact: "Medium",
    complexity: "Low",
    priority: "P2",
    dependencies: ["google-login"],
    category: "Frontend",
    column: "backlog",
    description: "Profile page with avatar, settings, and preferences.",
  },
  {
    id: "search-opt",
    title: "Search Optimization",
    points: 8,
    businessImpact: "High",
    complexity: "High",
    priority: "P1",
    dependencies: [],
    category: "Backend",
    column: "backlog",
    description: "Improve search relevance with ElasticSearch integration.",
  },
  {
    id: "mobile-resp",
    title: "Mobile Responsiveness",
    points: 5,
    businessImpact: "High",
    complexity: "Medium",
    priority: "P1",
    dependencies: [],
    category: "Design",
    column: "backlog",
    description: "Responsive layouts for all mobile screen sizes.",
  },
  {
    id: "bug-fixes",
    title: "Critical Bug Fixes",
    points: 3,
    businessImpact: "Critical",
    complexity: "Low",
    priority: "P0",
    dependencies: [],
    category: "QA",
    column: "backlog",
    description: "Fix checkout flow bug causing 15% cart abandonment.",
  },
  {
    id: "ai-engine",
    title: "AI Recommendation Engine",
    points: 13,
    businessImpact: "High",
    complexity: "High",
    priority: "P1",
    dependencies: ["analytics-dashboard"],
    category: "Backend",
    column: "backlog",
    description: "ML-powered product recommendations based on behavior.",
  },
];

const INITIAL_TEAM: TeamMember[] = [
  { id: "dev1",    name: "Alex Chen",    role: "Senior Developer",  avatar: "AC", color: "blue",   available: true, capacity: 10 },
  { id: "dev2",    name: "Sarah Park",   role: "Frontend Developer",avatar: "SP", color: "cyan",   available: true, capacity: 9  },
  { id: "qa1",     name: "Mike Torres",  role: "QA Engineer",       avatar: "MT", color: "green",  available: true, capacity: 7  },
  { id: "design1", name: "Priya Singh",  role: "UX Designer",       avatar: "PS", color: "purple", available: true, capacity: 4  },
];

const INITIAL_CHAOS: ChaosEvent[] = [
  { id: "stakeholder", title: "Stakeholder adds urgent feature", description: 'CEO requests last-minute feature. "This is a must-have for the board meeting."', emoji: "📢", capacityImpact: -5,  riskImpact: 20, active: false },
  { id: "prod-bug",    title: "Production bug appears",          description: "Critical P0 bug in payment flow. All hands on deck until resolved.",                emoji: "🔥", capacityImpact: -4,  riskImpact: 25, active: false },
  { id: "scope-creep", title: "Scope increases mid-sprint",      description: 'Product clarification expands 3 stories. "We assumed this was included."',         emoji: "📈", capacityImpact: -3,  riskImpact: 15, active: false },
  { id: "dev-out",     title: "Developer becomes unavailable",   description: "Lead developer has personal emergency, out for rest of sprint.",                   emoji: "🤒", capacityImpact: -9,  riskImpact: 30, active: false },
  { id: "api-delay",   title: "API dependency delayed",          description: "External vendor pushes delivery by 1 week. Blocked stories pile up.",              emoji: "🚧", capacityImpact: -2,  riskImpact: 18, active: false },
];

// ─── Health computation ────────────────────────────────────────────────────────

function computeHealth(
  sprintPts: number,
  capacity: number,
  highRisk: number,
  blocked: number,
  chaos: number,
  violations: number,
): number {
  if (sprintPts === 0) return 100;
  let score = 100;
  const util = sprintPts / Math.max(capacity, 1);
  if (util > 1) score -= Math.min(40, (util - 1) * 80);
  else if (util > 0.9) score -= 10;
  score -= highRisk * 8;
  score -= blocked * 12;
  score -= chaos * 8;
  score -= violations * 15;
  return Math.max(0, Math.min(100, Math.round(score)));
}

// ─── Hero Section ──────────────────────────────────────────────────────────────

const ROLES = [
  { label: "Product Manager", emoji: "🎯", color: "from-brand/20 to-brand/5", border: "border-brand/30", text: "text-brand" },
  { label: "Developer",       emoji: "💻", color: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/30", text: "text-blue-400" },
  { label: "QA Engineer",     emoji: "🔍", color: "from-green-500/20 to-green-500/5", border: "border-green-500/30", text: "text-green-400" },
  { label: "UX Designer",     emoji: "🎨", color: "from-purple-500/20 to-purple-500/5", border: "border-purple-500/30", text: "text-purple-400" },
];

function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-bg">
      {/* Animated grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(99,102,241,0.18) 1px, transparent 0)",
          backgroundSize: "36px 36px",
        }}
      />
      {/* Glow blobs */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[400px] w-[400px] translate-x-1/3 translate-y-1/3 rounded-full bg-violet-500/10 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-5 py-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5"
        >
          <LayoutDashboard className="h-3.5 w-3.5 text-brand" />
          <span className="text-xs font-semibold text-brand tracking-wide">Interactive Agile Simulator</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4 text-4xl font-black tracking-tight text-fg md:text-6xl lg:text-7xl"
        >
          Sprint{" "}
          <span className="bg-gradient-to-r from-brand via-violet-400 to-brand bg-clip-text text-transparent">
            Planning
          </span>
          <br />
          Simulator
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mb-8 max-w-2xl text-lg text-muted"
        >
          Learn how Agile teams decide what gets shipped in a sprint.
          Not documentation — a{" "}
          <span className="font-semibold text-fg">live, interactive Scrum playground.</span>
        </motion.p>

        {/* Role cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-10 flex flex-wrap justify-center gap-3"
        >
          {ROLES.map((role, i) => (
            <motion.div
              key={role.label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + i * 0.07 }}
              whileHover={{ y: -3, scale: 1.03 }}
              className={`flex items-center gap-2 rounded-xl border bg-gradient-to-br px-4 py-2.5 ${role.color} ${role.border}`}
            >
              <span className="text-xl">{role.emoji}</span>
              <span className={`text-sm font-semibold ${role.text}`}>{role.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="flex flex-col items-center gap-3"
        >
          <motion.a
            href="#sprint-board"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="group inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-3.5 text-sm font-bold text-white shadow-glow transition-shadow hover:shadow-[0_0_32px_rgba(99,102,241,0.5)]"
          >
            Start Sprint Planning
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </motion.a>
          <p className="text-xs text-muted">
            Build your sprint, trigger chaos, watch metrics live.
          </p>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-12 flex justify-center"
        >
          <ChevronDown className="h-5 w-5 text-muted/40" />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Educational Insights ─────────────────────────────────────────────────────

const INSIGHTS = [
  {
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    title: "Why overcommitment is dangerous",
    body: "Teams that consistently overcommit erode trust with stakeholders. When everything is promised but rarely delivered, executives stop trusting sprint plans — and start micromanaging.",
  },
  {
    icon: GitBranch,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    title: "Why dependencies matter",
    body: "A blocked story on day 8 can collapse a whole sprint. Dependencies create invisible risk that only surfaces late — when context-switching costs are highest.",
  },
  {
    icon: Layers,
    color: "text-brand",
    bg: "bg-brand/10",
    border: "border-brand/20",
    title: "Why prioritization is difficult",
    body: "Every stakeholder believes their feature is the most critical. Real prioritization requires saying no to urgent-but-not-important work — which requires courage and data.",
  },
  {
    icon: Users,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    title: "Why sprint planning is collaborative",
    body: "PMs bring business priority. Developers bring effort estimates. QA brings risk assessment. Remove any voice and the plan becomes dangerously one-sided.",
  },
  {
    icon: Clock,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    title: "Why estimation is uncertain",
    body: "Story points don't map to hours. A 5-point story might take a senior 4 hours or a junior 3 days. Velocity averages this uncertainty — which is why it takes 3+ sprints to calibrate.",
  },
  {
    icon: TrendingUp,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    title: "Why velocity fluctuates",
    body: "Vacations, incidents, onboarding, and technical debt all reduce velocity. Predictability comes from protecting the team's focus time — not from pressure to deliver more.",
  },
];

function EducationalInsights() {
  return (
    <section className="rounded-2xl border border-border/70 bg-surface p-6">
      <div className="mb-6">
        <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-brand">Section 13</p>
        <h2 className="text-xl font-bold text-fg">Educational Insights</h2>
        <p className="mt-1 text-sm text-muted">
          The mental models that separate good PMs from great ones in sprint planning.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INSIGHTS.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              whileHover={{ y: -3 }}
              className={`rounded-xl border p-4 ${item.bg} ${item.border}`}
            >
              <div className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg ${item.bg} ring-1 ring-current/20`}>
                <Icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <p className={`mb-2 text-sm font-bold ${item.color}`}>{item.title}</p>
              <p className="text-xs text-muted leading-relaxed">{item.body}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ─── PM Takeaways ─────────────────────────────────────────────────────────────

const TAKEAWAYS = [
  {
    number: "01",
    title: "Trade-off Thinking",
    body: "Every story in the sprint means another story out. Great PMs make the trade-off explicit — not implicit.",
    color: "text-brand",
    border: "border-brand/25",
    bg: "bg-brand/5",
  },
  {
    number: "02",
    title: "Prioritization Under Pressure",
    body: "Urgency is not the same as importance. P0 bugs eat capacity. Stakeholder requests create scope creep. Protect the sprint.",
    color: "text-orange-400",
    border: "border-orange-500/25",
    bg: "bg-orange-500/5",
  },
  {
    number: "03",
    title: "Stakeholder Management",
    body: "The best PMs say 'not this sprint' with data. Velocity history and health scores turn gut feel into honest conversations.",
    color: "text-purple-400",
    border: "border-purple-500/25",
    bg: "bg-purple-500/5",
  },
  {
    number: "04",
    title: "Delivery Realism",
    body: "Optimism is a feature in product vision. In sprint planning, it's a bug. Teams that under-promise and over-deliver build trust.",
    color: "text-green-400",
    border: "border-green-500/25",
    bg: "bg-green-500/5",
  },
  {
    number: "05",
    title: "Communication Clarity",
    body: "A sprint plan is a contract with the team, not a wish list for leadership. Ambiguity in planning becomes conflict in delivery.",
    color: "text-cyan-400",
    border: "border-cyan-500/25",
    bg: "bg-cyan-500/5",
  },
  {
    number: "06",
    title: "Systems Thinking",
    body: "Sprint health affects team morale. Morale affects velocity. Velocity affects roadmap. Everything is connected — plan accordingly.",
    color: "text-amber-400",
    border: "border-amber-500/25",
    bg: "bg-amber-500/5",
  },
];

function PmTakeaways() {
  return (
    <section className="rounded-2xl border border-border/70 bg-surface p-6">
      <div className="mb-6 text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-brand">Section 14</p>
        <h2 className="text-2xl font-bold text-fg">What Great PMs Learn From Sprint Planning</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
          Sprint planning is where product strategy meets engineering reality. The best PMs treat it as a learning system.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TAKEAWAYS.map((t, i) => (
          <motion.div
            key={t.number}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            whileHover={{ y: -3 }}
            className={`rounded-xl border p-5 ${t.bg} ${t.border}`}
          >
            <p className={`mb-2 text-3xl font-black opacity-30 ${t.color}`}>{t.number}</p>
            <p className={`mb-2 text-sm font-bold ${t.color}`}>{t.title}</p>
            <p className="text-xs text-muted leading-relaxed">{t.body}</p>
          </motion.div>
        ))}
      </div>

      {/* Final callout */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-6 rounded-xl border border-brand/25 bg-gradient-to-r from-brand/10 via-violet-500/5 to-transparent p-6 text-center"
      >
        <Brain className="mx-auto mb-3 h-8 w-8 text-brand" />
        <p className="text-lg font-bold text-fg">
          Now you understand why sprint planning is{" "}
          <span className="bg-gradient-to-r from-brand to-violet-400 bg-clip-text text-transparent">
            hard.
          </span>
        </p>
        <p className="mt-2 text-sm text-muted max-w-lg mx-auto">
          The constraints are real. The trade-offs are painful. The chaos is unpredictable.
          Great product managers don't eliminate this complexity — they navigate it with clarity.
        </p>
      </motion.div>
    </section>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function SprintPlanningPage() {
  const [items, setItems] = useState<BacklogItem[]>(INITIAL_ITEMS);
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [chaos, setChaos] = useState<ChaosEvent[]>(INITIAL_CHAOS);

  // ── Derived state
  const baseCapacity = useMemo(
    () => team.filter(m => m.available).reduce((s, m) => s + m.capacity, 0),
    [team]
  );

  const chaosImpact = useMemo(
    () => chaos.filter(e => e.active).reduce((s, e) => s + e.capacityImpact, 0),
    [chaos]
  );

  const totalCapacity = Math.max(0, baseCapacity + chaosImpact);

  const sprintItems    = useMemo(() => items.filter(i => i.column === "sprint"),    [items]);
  const highRiskItems  = useMemo(() => items.filter(i => i.column === "high-risk"), [items]);
  const blockedItems   = useMemo(() => items.filter(i => i.column === "blocked"),   [items]);

  const sprintPoints = useMemo(
    () => sprintItems.reduce((s, i) => s + i.points, 0),
    [sprintItems]
  );

  const dependencyViolations = useMemo(() => {
    const sprintAndRisk = new Set([
      ...sprintItems.map(i => i.id),
      ...highRiskItems.map(i => i.id),
    ]);
    return sprintItems.filter(item =>
      item.dependencies.some(dep => !sprintAndRisk.has(dep))
    );
  }, [sprintItems, highRiskItems]);

  const activeChaos = useMemo(() => chaos.filter(e => e.active), [chaos]);

  const healthScore = useMemo(() => computeHealth(
    sprintPoints,
    totalCapacity,
    highRiskItems.length,
    blockedItems.length,
    activeChaos.length,
    dependencyViolations.length,
  ), [sprintPoints, totalCapacity, highRiskItems, blockedItems, activeChaos, dependencyViolations]);

  const deliveryConfidence = useMemo(() => {
    if (sprintPoints === 0) return 85;
    const overload = Math.max(0, sprintPoints - totalCapacity);
    return Math.max(10, Math.round(healthScore - overload * 2));
  }, [healthScore, sprintPoints, totalCapacity]);

  // ── Handlers
  const moveItem       = (id: string, col: Column) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, column: col } : i));
  const toggleTeam     = (id: string) =>
    setTeam(prev => prev.map(m => m.id === id ? { ...m, available: !m.available } : m));
  const toggleChaos    = (id: string) =>
    setChaos(prev => prev.map(e => e.id === id ? { ...e, active: !e.active } : e));

  return (
    <div className="min-h-screen bg-bg">
      <HeroSection onStart={() => {}} />

      <div className="mx-auto max-w-7xl space-y-8 px-4 pb-24 pt-10 sm:px-6">
        {/* Sprint Board + Capacity */}
        <SprintBoard
          items={items}
          onMove={moveItem}
          dependencyViolations={dependencyViolations}
          sprintPoints={sprintPoints}
          totalCapacity={totalCapacity}
          healthScore={healthScore}
        />

        {/* Team Availability */}
        <TeamCapacity
          team={team}
          baseCapacity={baseCapacity}
          totalCapacity={totalCapacity}
          chaosImpact={chaosImpact}
          onToggle={toggleTeam}
        />

        {/* AI + Chaos side-by-side */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AiRecommendations
            items={items}
            sprintPoints={sprintPoints}
            totalCapacity={totalCapacity}
            dependencyViolations={dependencyViolations}
            activeChaos={activeChaos}
            healthScore={healthScore}
          />
          <AgileChaosPanel
            events={chaos}
            onToggle={toggleChaos}
            healthScore={healthScore}
          />
        </div>

        {/* Dependency Map */}
        <DependencyMap
          items={items}
          sprintItems={sprintItems}
          violations={dependencyViolations}
        />

        {/* Burndown Chart */}
        <BurndownChart
          sprintPoints={sprintPoints}
          totalCapacity={totalCapacity}
          activeChaos={activeChaos}
          healthScore={healthScore}
        />

        {/* Sprint Health Dashboard */}
        <SprintHealth
          healthScore={healthScore}
          sprintPoints={sprintPoints}
          totalCapacity={totalCapacity}
          team={team}
          sprintItems={sprintItems}
          highRiskItems={highRiskItems}
          blockedItems={blockedItems}
          activeChaos={activeChaos}
          dependencyViolations={dependencyViolations}
          deliveryConfidence={deliveryConfidence}
        />

        {/* Retrospective Preview */}
        <SprintMetrics
          healthScore={healthScore}
          sprintItems={sprintItems}
          highRiskItems={highRiskItems}
          blockedItems={blockedItems}
          team={team}
          activeChaos={activeChaos}
          sprintPoints={sprintPoints}
          totalCapacity={totalCapacity}
        />

        {/* Educational Insights */}
        <EducationalInsights />

        {/* PM Takeaways */}
        <PmTakeaways />
      </div>
    </div>
  );
}
