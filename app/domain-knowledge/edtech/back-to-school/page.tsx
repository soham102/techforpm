"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Users,
  Server,
  Zap,
  CheckCircle,
  XCircle,
  Calendar,
  AlertTriangle,
  Star,
  TrendingUp,
  Activity,
  Shield,
  Database,
  Play,
  RefreshCw,
  ChevronRight,
  Cpu,
  Globe,
  BookOpen,
  MessageSquare,
  Award,
  BarChart3,
  Bug,
  Rocket,
  Clock,
  Target,
} from "lucide-react";
import { trackEvent } from "@/lib/lib/gtag";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase =
  | "mission"
  | "calm"
  | "countdown"
  | "plan"
  | "warroom"
  | "traffic"
  | "bug"
  | "journey"
  | "analytics"
  | "impact"
  | "checklist"
  | "examples"
  | "final"
  | "done";

type Priority = "high" | "medium" | "low" | null;

interface Task {
  id: string;
  label: string;
  icon: React.ElementType;
  recommended: "high" | "medium" | "low";
  reason: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TASKS: Task[] = [
  { id: "servers",      label: "Scale Servers",          icon: Server,       recommended: "high",   reason: "Traffic will increase 30×. Server scaling is non-negotiable." },
  { id: "login",        label: "Fix Login Issues",        icon: Bug,          recommended: "high",   reason: "Login failures block all users. Fix before launch day." },
  { id: "loadtest",     label: "Load Testing",            icon: Activity,     recommended: "high",   reason: "Validate performance under 2.5M users before going live." },
  { id: "payment",      label: "Payment Validation",      icon: Shield,       recommended: "high",   reason: "Payment failures during BTS peak = direct revenue loss." },
  { id: "support",      label: "Train Support Team",      icon: MessageSquare,recommended: "high",   reason: "Support volume will spike 20×. Team must be prepared." },
  { id: "onboarding",   label: "Improve Onboarding",      icon: Users,        recommended: "medium", reason: "Critical for retention, but can be iterated post-launch." },
  { id: "courses",      label: "Publish New Courses",     icon: BookOpen,     recommended: "medium", reason: "New content drives enrollment — important but not blocking." },
  { id: "recommend",    label: "Launch Recommendations",  icon: Star,         recommended: "low",    reason: "Nice feature, but not critical for a stable BTS launch." },
  { id: "notifs",       label: "Improve Notifications",   icon: AlertTriangle,recommended: "low",    reason: "Can be enhanced post-launch without blocking new users." },
];

const DEPARTMENTS = [
  {
    emoji: "🧑‍💻", name: "Engineering",
    task: "Login & performance optimization",
    status: "done" as const,
    color: "border-sky-500/30 bg-sky-500/8 text-sky-400",
  },
  {
    emoji: "☁", name: "DevOps",
    task: "Auto-scaling infrastructure",
    status: "progress" as const,
    color: "border-amber-500/30 bg-amber-500/8 text-amber-400",
  },
  {
    emoji: "🎨", name: "Design",
    task: "Onboarding flow refresh",
    status: "done" as const,
    color: "border-violet-500/30 bg-violet-500/8 text-violet-400",
  },
  {
    emoji: "📚", name: "Content",
    task: "BTS course catalogue",
    status: "progress" as const,
    color: "border-emerald-500/30 bg-emerald-500/8 text-emerald-400",
  },
  {
    emoji: "📞", name: "Support",
    task: "Knowledge base & team training",
    status: "pending" as const,
    color: "border-rose-500/30 bg-rose-500/8 text-rose-400",
  },
  {
    emoji: "📢", name: "Marketing",
    task: "BTS campaign & notifications",
    status: "done" as const,
    color: "border-cyan-500/30 bg-cyan-500/8 text-cyan-400",
  },
];

const JOURNEY_STEPS = [
  { id: "signup",     label: "Sign Up",             icon: Users,      hasFriction: false },
  { id: "onboarding", label: "Onboarding",           icon: BookOpen,   hasFriction: true  },
  { id: "recommend",  label: "Course Recommended",   icon: Star,       hasFriction: false },
  { id: "enroll",     label: "Enrollment",           icon: CheckCircle,hasFriction: false },
  { id: "watch",      label: "Watch Lesson",         icon: Play,       hasFriction: false },
  { id: "quiz",       label: "Quiz",                 icon: Target,     hasFriction: false },
  { id: "complete",   label: "Completion",           icon: Award,      hasFriction: false },
];

const CHECKLIST_ITEMS = [
  "Servers Ready",
  "Support Team Trained",
  "New Courses Published",
  "Notifications Configured",
  "Load Testing Passed",
  "Onboarding Optimized",
  "Recommendations Ready",
];

const REAL_EXAMPLES = [
  {
    name: "Coursera",
    emoji: "🎓",
    color: "border-sky-500/30 bg-sky-500/8",
    accent: "text-sky-400",
    detail: "Runs large enrollment campaigns, optimises onboarding flows, and scales cloud infra before academic intake seasons.",
  },
  {
    name: "Canvas LMS",
    emoji: "🖼",
    color: "border-violet-500/30 bg-violet-500/8",
    accent: "text-violet-400",
    detail: "Prepares infrastructure for institutional customers, coordinates with university IT teams weeks before semester start.",
  },
  {
    name: "Google Classroom",
    emoji: "🏫",
    color: "border-emerald-500/30 bg-emerald-500/8",
    accent: "text-emerald-400",
    detail: "Scales globally during school reopening — handles hundreds of millions of active users with near-zero downtime.",
  },
  {
    name: "upGrad",
    emoji: "📈",
    color: "border-amber-500/30 bg-amber-500/8",
    accent: "text-amber-400",
    detail: "Launches new cohorts, redesigns onboarding, and runs targeted engagement campaigns tied to BTS season.",
  },
  {
    name: "Kitaboo",
    emoji: "📚",
    color: "border-rose-500/30 bg-rose-500/8",
    accent: "text-rose-400",
    detail: "Peak operational planning: content delivery, platform readiness, regression testing, and monitoring before each academic session.",
  },
];

const PRODUCT_IMPACTS = [
  { icon: "📈", title: "User Acquisition",  body: "Millions of new learners join during BTS — the single largest acquisition window of the year.", color: "border-sky-500/30 bg-sky-500/8", accent: "text-sky-400" },
  { icon: "💰", title: "Revenue",           body: "Peak enrollment season drives subscription, seat, and course-sale revenue in a compressed window.", color: "border-emerald-500/30 bg-emerald-500/8", accent: "text-emerald-400" },
  { icon: "😊", title: "User Experience",   body: "First impressions determine retention. A rough BTS onboarding can permanently lose a learner.", color: "border-violet-500/30 bg-violet-500/8", accent: "text-violet-400" },
  { icon: "🔄", title: "Retention",         body: "Good BTS onboarding creates long-term learners. Bad onboarding creates immediate churn.", color: "border-amber-500/30 bg-amber-500/8", accent: "text-amber-400" },
  { icon: "⭐", title: "Platform Reputation",body: "A stable BTS builds institutional trust. An outage during BTS gets remembered for years.", color: "border-rose-500/30 bg-rose-500/8", accent: "text-rose-400" },
];

// ─── Scene 1: Calm Before the Storm ───────────────────────────────────────────

function CalmScene({ onContinue }: { onContinue: () => void }) {
  const STATS = [
    { label: "Daily Active Users", value: "45,000", icon: Users,    color: "text-sky-400",     pulse: false },
    { label: "Support Tickets",    value: "120",     icon: MessageSquare, color: "text-violet-400", pulse: false },
    { label: "Server Load",        value: "18%",     icon: Cpu,      color: "text-emerald-400", pulse: false },
    { label: "Enrollments/Day",    value: "320",     icon: BookOpen, color: "text-amber-400",   pulse: false },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 overflow-y-auto bg-bg/95 backdrop-blur-lg">
      <div className="mx-auto w-full max-w-2xl px-5 py-10">
        <p className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-sky-400">
          Scene 1 · Calm Before the Storm
        </p>
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-2 text-center text-2xl font-black text-fg">
          Your platform looks fine… for now
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="mb-8 text-center text-sm text-muted">
          Everything is stable. Traffic is normal. Support is manageable.
        </motion.p>

        <div className="mb-6 grid grid-cols-2 gap-4">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                className="rounded-2xl border border-border/50 bg-surface p-4 shadow-soft">
                <div className="mb-2 flex items-center gap-2">
                  <div className="relative">
                    <Icon className={`h-4 w-4 ${s.color}`} />
                    {s.pulse && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-75" />}
                  </div>
                  <span className="text-xs text-muted">{s.label}</span>
                </div>
                <motion.p initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.07, type: "spring" }}
                  className={`text-2xl font-black ${s.color}`}>
                  {s.value}
                </motion.p>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/8 p-4 text-center">
          <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            All systems healthy
          </div>
          <p className="mt-2 text-sm font-bold text-fg">Looks manageable?</p>
          <p className="mt-1 text-xs text-muted">Wait until BTS begins. Everything is about to change.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-center">
          <button onClick={onContinue}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-sky-400">
            See What's Coming
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Scene 2: BTS Countdown ───────────────────────────────────────────────────

function CountdownScene({ onContinue }: { onContinue: () => void }) {
  const [step, setStep] = useState(0);
  const reduce = useReducedMotion();

  const DAYS = ["30 Days", "14 Days", "7 Days", "Tomorrow"];
  const REGS = ["120K", "350K", "900K", "1.8M"];

  useEffect(() => {
    if (reduce) { setStep(3); return; }
    const timings = [800, 1200, 1200, 1200];
    let s = 0;
    const next = () => {
      if (s >= 3) return;
      setTimeout(() => { s++; setStep(s); next(); }, timings[s]);
    };
    const t = setTimeout(next, 600);
    return () => clearTimeout(t);
  }, [reduce]);

  const done = step >= 3;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-bg/95 backdrop-blur-lg">
      <div className="mx-auto w-full max-w-lg px-5 py-10 text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-sky-400">
          Scene 2 · BTS Countdown
        </p>
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-8 text-2xl font-black text-fg">
          Millions of learners are coming.
        </motion.h2>

        <div className="mb-8 grid grid-cols-2 gap-4">
          {/* Calendar countdown */}
          <div className="rounded-2xl border border-border/50 bg-surface p-5">
            <div className="mb-3 flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4 text-sky-400" />
              <span className="text-xs font-semibold text-muted">Time to BTS</span>
            </div>
            <div className="space-y-2">
              {DAYS.map((d, i) => (
                <motion.div key={d}
                  animate={i <= step ? { opacity: 1, x: 0 } : { opacity: 0.2, x: 8 }}
                  className={`rounded-lg px-3 py-2 text-sm font-bold text-center transition-all ${
                    i === step ? "border border-sky-500/40 bg-sky-500/10 text-sky-400" :
                    i < step ? "text-muted" : "text-muted/30"
                  }`}>
                  {d}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pre-registrations */}
          <div className="rounded-2xl border border-border/50 bg-surface p-5">
            <div className="mb-3 flex items-center justify-center gap-2">
              <Users className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-semibold text-muted">Pre-registrations</span>
            </div>
            <div className="space-y-2">
              {REGS.map((r, i) => (
                <motion.div key={r}
                  animate={i <= step ? { opacity: 1, x: 0 } : { opacity: 0.2, x: 8 }}
                  className={`rounded-lg px-3 py-2 text-sm font-bold text-center transition-all ${
                    i === step ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-400" :
                    i < step ? "text-muted" : "text-muted/30"
                  }`}>
                  {r}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {done && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/8 p-4">
              <AlertTriangle className="mx-auto mb-2 h-6 w-6 text-rose-400" />
              <p className="text-sm font-bold text-rose-400">BTS is tomorrow. Is your platform ready?</p>
              <p className="mt-1 text-xs text-muted">1.8M learners registered. Preparation starts now.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {done && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={onContinue}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-sky-400">
              Build Your BTS Plan
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Scene 3: Priority Board ───────────────────────────────────────────────────

function PlanScene({ onContinue }: { onContinue: () => void }) {
  const [priorities, setPriorities] = useState<Record<string, "high" | "medium" | "low">>({});
  const [reviewed, setReviewed] = useState(false);

  const allPlaced = TASKS.every((t) => priorities[t.id] !== undefined);
  const correctCount = TASKS.filter((t) => priorities[t.id] === t.recommended).length;

  const handlePlace = (taskId: string, priority: "high" | "medium" | "low") => {
    setPriorities((p) => ({ ...p, [taskId]: priority }));
  };

  const unplaced = TASKS.filter((t) => priorities[t.id] === undefined);
  const highTasks    = TASKS.filter((t) => priorities[t.id] === "high");
  const mediumTasks  = TASKS.filter((t) => priorities[t.id] === "medium");
  const lowTasks     = TASKS.filter((t) => priorities[t.id] === "low");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 overflow-y-auto bg-bg/95 backdrop-blur-lg">
      <div className="mx-auto w-full max-w-2xl px-5 py-10">
        <p className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-sky-400">
          Scene 3 · BTS Plan
        </p>
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-2 text-center text-2xl font-black text-fg">
          Prioritise before launch
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="mb-6 text-center text-sm text-muted">
          Assign each task a priority. Resources are limited — choose wisely.
        </motion.p>

        {/* Unplaced tasks */}
        <div className="mb-5 space-y-2">
          <AnimatePresence>
            {unplaced.map((task) => {
              const Icon = task.icon;
              return (
                <motion.div key={task.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-3 rounded-2xl border border-border/50 bg-surface px-4 py-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border/40 bg-elevated">
                    <Icon className="h-4 w-4 text-muted" />
                  </div>
                  <span className="flex-1 text-sm font-semibold text-fg">{task.label}</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => handlePlace(task.id, "high")}
                      className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-2.5 py-1.5 text-xs font-bold text-rose-400 transition-all hover:bg-rose-500/20 active:scale-95">
                      High
                    </button>
                    <button onClick={() => handlePlace(task.id, "medium")}
                      className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1.5 text-xs font-bold text-amber-400 transition-all hover:bg-amber-500/20 active:scale-95">
                      Med
                    </button>
                    <button onClick={() => handlePlace(task.id, "low")}
                      className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-bold text-emerald-400 transition-all hover:bg-emerald-500/20 active:scale-95">
                      Low
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Placed bucket summaries */}
        {(highTasks.length > 0 || mediumTasks.length > 0 || lowTasks.length > 0) && (
          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            {[
              { label: "High Priority", tasks: highTasks,   color: "text-rose-400",    bg: "border-rose-500/20 bg-rose-500/8" },
              { label: "Medium",        tasks: mediumTasks, color: "text-amber-400",   bg: "border-amber-500/20 bg-amber-500/8" },
              { label: "Low",           tasks: lowTasks,    color: "text-emerald-400", bg: "border-emerald-500/20 bg-emerald-500/8" },
            ].map((bucket) => (
              <div key={bucket.label} className={`rounded-2xl border p-3 ${bucket.bg}`}>
                <p className={`mb-2 text-xs font-bold ${bucket.color}`}>{bucket.label}</p>
                <div className="space-y-1">
                  {bucket.tasks.map((t) => (
                    <div key={t.id} className="flex items-center gap-1.5 text-xs text-muted">
                      <CheckCircle className="h-3 w-3 text-emerald-400 shrink-0" />
                      {t.label}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review / Continue */}
        <AnimatePresence>
          {allPlaced && !reviewed && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <button onClick={() => setReviewed(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-sky-400">
                Review My Plan
                <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {reviewed && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-4 rounded-2xl border border-sky-500/30 bg-sky-500/8 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-bold text-fg">Expert Recommendation</p>
                  <span className={`text-sm font-black ${correctCount >= 7 ? "text-emerald-400" : correctCount >= 5 ? "text-amber-400" : "text-rose-400"}`}>
                    {correctCount}/9 matched
                  </span>
                </div>
                <div className="space-y-1.5">
                  {TASKS.map((t) => {
                    const chose = priorities[t.id];
                    const match = chose === t.recommended;
                    return (
                      <div key={t.id} className="flex items-start gap-2 text-xs">
                        {match
                          ? <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                          : <XCircle    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                        }
                        <div>
                          <span className="font-semibold text-fg">{t.label}</span>
                          {!match && <span className="ml-1 text-muted">→ recommended: <span className="font-semibold text-sky-400">{t.recommended}</span></span>}
                          {!match && <p className="mt-0.5 text-muted">{t.reason}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="text-center">
                <button onClick={() => { trackEvent("priority_planning_completed"); onContinue(); }}
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-sky-400">
                  Enter the War Room
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Scene 4: War Room ────────────────────────────────────────────────────────

function WarRoomScene({ onContinue }: { onContinue: () => void }) {
  const STATUS_LABELS = {
    done:     { label: "Completed", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
    progress: { label: "In Progress", color: "text-amber-400",  bg: "bg-amber-500/10 border-amber-500/30" },
    pending:  { label: "Pending",    color: "text-rose-400",   bg: "bg-rose-500/10 border-rose-500/30" },
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 overflow-y-auto bg-bg/95 backdrop-blur-lg">
      <div className="mx-auto w-full max-w-2xl px-5 py-10">
        <p className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-sky-400">
          Scene 4 · Cross-Functional War Room
        </p>
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-2 text-center text-2xl font-black text-fg">
          Every team is on deck
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="mb-8 text-center text-sm text-muted">
          BTS is a company-wide event. Every department has a role.
        </motion.p>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {DEPARTMENTS.map((dept, i) => {
            const s = STATUS_LABELS[dept.status];
            return (
              <motion.div key={dept.name} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className={`rounded-2xl border p-4 ${dept.color}`}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{dept.emoji}</span>
                    <span className="text-sm font-bold text-fg">{dept.name}</span>
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${s.bg} ${s.color}`}>
                    {s.label}
                  </span>
                </div>
                <p className="text-xs text-muted">{dept.task}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Dependency callout */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="mb-6 rounded-2xl border border-sky-500/30 bg-sky-500/8 p-4">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-sky-400" />
            <span className="text-sm font-bold text-sky-400">Critical Dependency</span>
          </div>
          <p className="text-xs text-muted">
            Support team training (Pending) is blocked until Engineering finishes the knowledge base tool. One team's delay ripples across the launch.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="text-center">
          <button onClick={onContinue}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-sky-400">
            Launch Day — Traffic Spike
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Scene 5: Traffic Spike ───────────────────────────────────────────────────

function TrafficScene({ onContinue }: { onContinue: () => void }) {
  const [stage, setStage] = useState(0); // 0=idle,1=spike,2=critical,3=scaled,4=stable
  const [scaling, setScaling] = useState(false);
  const reduce = useReducedMotion();

  const STAGES = [
    { users: "100K",  cpu: "18%",  response: "210ms", cpuN: 18 },
    { users: "500K",  cpu: "42%",  response: "340ms", cpuN: 42 },
    { users: "1M",    cpu: "74%",  response: "780ms", cpuN: 74 },
    { users: "2.5M",  cpu: "91%",  response: "1,240ms",cpuN: 91 },
  ];

  useEffect(() => {
    if (stage !== 0 || reduce) return;
    const timings = [1000, 1200, 1400];
    let s = 0;
    const next = () => {
      if (s >= 3) return;
      setTimeout(() => { s++; setStage(s); next(); }, timings[Math.min(s, 2)]);
    };
    const t = setTimeout(() => { setStage(1); next(); }, 800);
    return () => clearTimeout(t);
  }, [stage, reduce]);

  const handleScale = () => {
    setScaling(true);
    setTimeout(() => { setStage(4); setScaling(false); }, 2200);
  };

  const current = stage === 4
    ? { users: "2.5M", cpu: "31%", response: "195ms", cpuN: 31 }
    : STAGES[Math.min(stage, 3)];

  const isCritical = stage === 3 && !scaling;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-bg/95 backdrop-blur-lg">
      <div className="mx-auto w-full max-w-xl px-5 py-10 text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-sky-400">
          Scene 5 · Traffic Spike Simulation
        </p>
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-8 text-2xl font-black text-fg">
          Launch Day — users are flooding in
        </motion.h2>

        {/* Live metrics */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          {[
            { label: "Active Users",   value: current.users,    color: "text-sky-400",    warn: stage >= 3 && stage !== 4 },
            { label: "Server CPU",     value: current.cpu,      color: stage >= 3 && stage !== 4 ? "text-rose-400" : "text-amber-400", warn: stage >= 3 && stage !== 4 },
            { label: "Response Time",  value: current.response, color: stage >= 3 && stage !== 4 ? "text-rose-400" : "text-emerald-400", warn: stage >= 3 && stage !== 4 },
          ].map((m) => (
            <motion.div key={m.label}
              animate={m.warn && !reduce ? { borderColor: ["rgba(239,68,68,0.2)", "rgba(239,68,68,0.5)", "rgba(239,68,68,0.2)"] } : {}}
              transition={{ repeat: Infinity, duration: 1 }}
              className={`rounded-2xl border bg-surface p-4 ${m.warn ? "border-rose-500/30" : "border-border/50"}`}>
              <p className="mb-1 text-xs text-muted">{m.label}</p>
              <motion.p key={m.value} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className={`text-xl font-black tabular-nums ${m.color}`}>
                {m.value}
              </motion.p>
            </motion.div>
          ))}
        </div>

        {/* CPU bar */}
        <div className="mb-6 rounded-2xl border border-border/50 bg-surface p-4">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-muted flex items-center gap-1.5"><Cpu className="h-3 w-3" />Server CPU</span>
            <span className={current.cpuN > 80 ? "font-bold text-rose-400" : "text-muted"}>{current.cpu}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-elevated">
            <motion.div animate={{ width: `${current.cpuN}%` }} transition={{ duration: 0.6 }}
              className={`h-full rounded-full ${current.cpuN > 80 ? "bg-rose-500" : current.cpuN > 60 ? "bg-amber-500" : "bg-sky-500"}`} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isCritical && (
            <motion.div key="critical" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="mb-6 rounded-2xl border border-rose-500/40 bg-rose-500/8 p-4">
              <AlertTriangle className="mx-auto mb-2 h-6 w-6 text-rose-400" />
              <p className="text-sm font-bold text-rose-400">System under critical load!</p>
              <p className="mt-1 text-xs text-muted">Response times are degrading. Users are experiencing slowness.</p>
            </motion.div>
          )}

          {stage === 4 && (
            <motion.div key="stable" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/8 p-4">
              <CheckCircle className="mx-auto mb-2 h-6 w-6 text-emerald-400" />
              <p className="text-sm font-bold text-emerald-400">Infrastructure scaled. All systems stable.</p>
              <p className="mt-1 text-xs text-muted">New cloud instances deployed. CPU and response time normalised.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {isCritical && !scaling && (
          <button onClick={handleScale}
            className="mb-4 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-sky-400">
            <Server className="h-4 w-4" />
            Scale Servers Now
          </button>
        )}

        {scaling && (
          <div className="mb-4 flex items-center justify-center gap-2 text-sm text-muted">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <RefreshCw className="h-4 w-4" />
            </motion.div>
            Provisioning cloud instances…
          </div>
        )}

        {stage === 4 && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onClick={() => { trackEvent("traffic_spike_handled"); onContinue(); }}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-sky-400">
            A Bug Appeared
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        )}

        {stage < 3 && (
          <p className="text-xs text-muted animate-pulse">Traffic increasing…</p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Scene 6: Bug ─────────────────────────────────────────────────────────────

function BugScene({ onContinue }: { onContinue: () => void }) {
  const [fixed, setFixed] = useState(false);
  const [fixing, setFixing] = useState(false);
  const reduce = useReducedMotion();

  const handleFix = () => {
    setFixing(true);
    setTimeout(() => { setFixing(false); setFixed(true); }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-bg/95 backdrop-blur-lg">
      <div className="mx-auto w-full max-w-xl px-5 py-10 text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-sky-400">
          Scene 6 · Small Bug, Huge Impact
        </p>
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-8 text-2xl font-black text-fg">
          A login bug just appeared
        </motion.h2>

        <div className="mb-6 grid grid-cols-3 gap-3">
          {[
            { label: "Failed Logins",   before: "48,000", after: "12",     icon: XCircle,     color: "text-rose-400",    okColor: "text-emerald-400" },
            { label: "Support Tickets", before: "+8,400", after: "+47",    icon: MessageSquare,color: "text-rose-400",   okColor: "text-emerald-400" },
            { label: "User Rating",     before: "3.9 ★",  after: "4.7 ★", icon: Star,        color: "text-rose-400",    okColor: "text-amber-400" },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <motion.div key={m.label}
                animate={!fixed && !reduce ? { borderColor: ["rgba(239,68,68,0.2)", "rgba(239,68,68,0.5)", "rgba(239,68,68,0.2)"] } : {}}
                transition={{ repeat: !fixed ? Infinity : 0, duration: 1 }}
                className={`rounded-2xl border bg-surface p-4 ${!fixed ? "border-rose-500/30" : "border-emerald-500/30"}`}>
                <Icon className={`mx-auto mb-1 h-4 w-4 ${!fixed ? m.color : m.okColor}`} />
                <p className="text-xs text-muted mb-1">{m.label}</p>
                <motion.p key={fixed ? "after" : "before"}
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  className={`text-lg font-black tabular-nums ${!fixed ? m.color : m.okColor}`}>
                  {fixed ? m.after : m.before}
                </motion.p>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {!fixed && (
            <motion.div key="bug" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/8 p-4">
              <Bug className="mx-auto mb-2 h-6 w-6 text-rose-400" />
              <p className="text-sm font-bold text-rose-400">Login API returning 500 errors intermittently</p>
              <p className="mt-1 text-xs text-muted">48,000 users can't access the platform. Every minute matters.</p>
            </motion.div>
          )}

          {fixed && (
            <motion.div key="fixed" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/8 p-4">
              <CheckCircle className="mx-auto mb-2 h-6 w-6 text-emerald-400" />
              <p className="text-sm font-bold text-emerald-400">Hotfix deployed. All systems recovered.</p>
              <p className="mt-1 text-xs text-muted">During BTS, even a tiny bug affects thousands of learners.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {!fixed && !fixing && (
          <button onClick={handleFix}
            className="mb-4 inline-flex items-center gap-2 rounded-xl bg-rose-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-rose-400">
            <Zap className="h-4 w-4" />
            Deploy Hotfix
          </button>
        )}

        {fixing && (
          <div className="mb-4 flex items-center justify-center gap-2 text-sm text-muted">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <RefreshCw className="h-4 w-4" />
            </motion.div>
            Deploying hotfix…
          </div>
        )}

        {fixed && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onClick={() => { trackEvent("login_bug_fixed"); onContinue(); }}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-sky-400">
            Follow a New Student
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Scene 7: Student Journey ─────────────────────────────────────────────────

function JourneyScene({ onContinue }: { onContinue: () => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const [fixed, setFixed] = useState(false);
  const [done, setDone] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) { setActiveStep(JOURNEY_STEPS.length); return; }
    const id = setInterval(() => {
      setActiveStep((p) => {
        if (p >= JOURNEY_STEPS.length) { clearInterval(id); return p; }
        return p + 1;
      });
    }, 700);
    return () => clearInterval(id);
  }, [reduce]);

  const frictionStep = JOURNEY_STEPS.findIndex((s) => s.hasFriction);
  const atFriction = activeStep > frictionStep && !fixed && !done;

  useEffect(() => {
    if (fixed) {
      setTimeout(() => setDone(true), 1500);
    }
  }, [fixed]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-bg/95 backdrop-blur-lg">
      <div className="mx-auto w-full max-w-xl px-5 py-10">
        <p className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-sky-400">
          Scene 7 · New Student Journey
        </p>
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-2 text-center text-2xl font-black text-fg">
          Follow Maya's first day
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="mb-8 text-center text-sm text-muted">
          She just signed up during BTS. Every step matters.
        </motion.p>

        <div className="mb-6 space-y-3">
          {JOURNEY_STEPS.map((step, i) => {
            const Icon = step.icon;
            const isActive = i < activeStep;
            const isFriction = step.hasFriction && isActive && !fixed;
            const isPast = isActive && !isFriction;

            return (
              <motion.div key={step.id}
                animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0.25, x: -8 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                  isFriction ? "border-rose-500/50 bg-rose-500/8" :
                  isPast ? "border-emerald-500/30 bg-emerald-500/8" :
                  "border-border/40 bg-surface"
                }`}>
                <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${
                  isFriction ? "border-rose-500/40 bg-rose-500/10" :
                  isPast ? "border-emerald-500/40 bg-emerald-500/10" :
                  "border-border/40 bg-elevated"
                }`}>
                  <Icon className={`h-4 w-4 ${isFriction ? "text-rose-400" : isPast ? "text-emerald-400" : "text-muted"}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${isFriction ? "text-rose-400" : isPast ? "text-fg" : "text-muted"}`}>
                    {step.label}
                  </p>
                  {isFriction && <p className="text-xs text-rose-400/80 mt-0.5">Friction detected — 42% of users dropping off here</p>}
                  {isPast && !step.hasFriction && <p className="text-xs text-muted mt-0.5">Completed successfully</p>}
                  {fixed && step.hasFriction && <p className="text-xs text-emerald-400/80 mt-0.5">Onboarding optimised — drop-off reduced to 8%</p>}
                </div>
                {isFriction && <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />}
                {isPast && <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />}
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {atFriction && !fixed && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-4 text-center">
              <button onClick={() => setFixed(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-rose-400">
                <Zap className="h-4 w-4" />
                Fix Onboarding Flow
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {done && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/8 p-4">
                <CheckCircle className="mx-auto mb-2 h-6 w-6 text-emerald-400" />
                <p className="text-sm font-bold text-emerald-400">Maya completed her first course!</p>
                <p className="mt-1 text-xs text-muted">Completion rate jumped from 38% → 71% after fixing onboarding.</p>
              </div>
              <button onClick={() => { trackEvent("student_journey_completed"); onContinue(); }}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-sky-400">
                See BTS Analytics
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Scene 8: Analytics Dashboard ────────────────────────────────────────────

function AnalyticsScene({ onContinue }: { onContinue: () => void }) {
  const [showAfter, setShowAfter] = useState(false);
  const reduce = useReducedMotion();

  const ROWS = [
    { label: "Daily Active Users",    before: "45K",   after: "420K",   unit: "", colorBefore: "text-muted", colorAfter: "text-sky-400" },
    { label: "Enrollments / Day",     before: "320",   after: "7,900",  unit: "", colorBefore: "text-muted", colorAfter: "text-emerald-400" },
    { label: "Support Tickets",       before: "120",   after: "2,300",  unit: "", colorBefore: "text-muted", colorAfter: "text-rose-400" },
    { label: "Completion Rate",       before: "38%",   after: "71%",    unit: "", colorBefore: "text-muted", colorAfter: "text-violet-400" },
    { label: "Revenue (indexed)",     before: "1×",    after: "18×",    unit: "", colorBefore: "text-muted", colorAfter: "text-amber-400" },
  ];

  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setShowAfter(true), 600);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 overflow-y-auto bg-bg/95 backdrop-blur-lg">
      <div className="mx-auto w-full max-w-xl px-5 py-10">
        <p className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-sky-400">
          Scene 8 · BTS Analytics
        </p>
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-2 text-center text-2xl font-black text-fg">
          The platform after BTS
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="mb-8 text-center text-sm text-muted">
          Every metric tells the BTS story.
        </motion.p>

        <div className="mb-6 space-y-3">
          {ROWS.map((row, i) => (
            <motion.div key={row.label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="flex items-center justify-between rounded-2xl border border-border/50 bg-surface px-4 py-3.5">
              <span className="text-sm text-muted">{row.label}</span>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold tabular-nums ${row.colorBefore}`}>{row.before}</span>
                <ChevronRight className="h-3.5 w-3.5 text-muted" />
                <motion.span
                  initial={reduce ? {} : { opacity: 0, scale: 0.8 }}
                  animate={showAfter ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
                  className={`text-base font-black tabular-nums ${row.colorAfter}`}>
                  {row.after}
                </motion.span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Retention chart (decorative) */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="mb-6 rounded-2xl border border-border/50 bg-surface p-4">
          <div className="mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-sky-400" />
            <span className="text-xs font-semibold text-muted">DAU Growth During BTS</span>
          </div>
          <div className="flex items-end gap-1.5 h-14">
            {[15, 18, 20, 25, 35, 55, 80, 100, 95, 90].map((h, i) => (
              <motion.div key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.9 + i * 0.06, duration: 0.4 }}
                className={`flex-1 rounded-t-sm ${i >= 6 ? "bg-sky-500" : "bg-sky-500/30"}`}
              />
            ))}
          </div>
          <div className="mt-1 flex justify-between text-xs text-muted">
            <span>Pre-BTS</span>
            <span>BTS Peak</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-center">
          <button onClick={() => { trackEvent("analytics_dashboard_viewed"); onContinue(); }}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-sky-400">
            Product Impact
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Scene 9: Product Impact ───────────────────────────────────────────────────

function ImpactScene({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 overflow-y-auto bg-bg/95 backdrop-blur-lg">
      <div className="mx-auto w-full max-w-2xl px-5 py-10">
        <p className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-sky-400">
          Scene 9 · Product Impact
        </p>
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-2 text-center text-2xl font-black text-fg">
          Why BTS matters to every PM
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="mb-8 text-center text-sm text-muted">
          This isn't just a seasonal traffic event — it touches every product metric.
        </motion.p>

        <div className="mb-8 space-y-3">
          {PRODUCT_IMPACTS.map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, x: i % 2 === 0 ? -16 : 16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className={`rounded-2xl border p-4 ${item.color}`}>
              <div className="mb-1.5 flex items-center gap-2">
                <span className="text-xl">{item.icon}</span>
                <span className={`text-sm font-bold ${item.accent}`}>{item.title}</span>
              </div>
              <p className="text-sm leading-relaxed text-muted">{item.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="text-center">
          <button onClick={onContinue}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-sky-400">
            BTS Command Centre
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Scene 10: Command Centre Checklist ───────────────────────────────────────

function ChecklistScene({ onContinue }: { onContinue: () => void }) {
  const [visible, setVisible] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) { setVisible(CHECKLIST_ITEMS.length); return; }
    const id = setInterval(() => {
      setVisible((p) => (p >= CHECKLIST_ITEMS.length ? p : p + 1));
    }, 450);
    return () => clearInterval(id);
  }, [reduce]);

  const pct = Math.round((visible / CHECKLIST_ITEMS.length) * 100);
  const done = visible >= CHECKLIST_ITEMS.length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-bg/95 backdrop-blur-lg">
      <div className="relative mx-auto w-full max-w-lg px-5 py-10 text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-sky-400">
          Scene 10 · BTS Command Centre
        </p>
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-8 text-2xl font-black text-fg">
          Mission checklist
        </motion.h2>

        <div className="mb-6 rounded-2xl border border-border/50 bg-surface p-6">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="font-semibold text-fg">Launch Readiness</span>
            <span className="font-black text-sky-400">{pct}%</span>
          </div>
          <div className="mb-6 h-3 overflow-hidden rounded-full bg-elevated">
            <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }}
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-400" />
          </div>
          <div className="space-y-3">
            {CHECKLIST_ITEMS.map((item, i) => (
              <motion.div key={item}
                animate={i < visible ? { opacity: 1, x: 0 } : { opacity: 0.3, x: 0 }}
                className="flex items-center gap-3 text-left">
                <div className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${
                  i < visible ? "border-emerald-500/50 bg-emerald-500/15" : "border-border/40 bg-elevated"
                }`}>
                  {i < visible
                    ? <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                    : <div className="h-2 w-2 rounded-full bg-muted/30" />
                  }
                </div>
                <span className={`text-sm ${i < visible ? "font-semibold text-fg" : "text-muted"}`}>{item}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {done && (
            <motion.div className="pointer-events-none absolute inset-0 overflow-hidden">
              {Array.from({ length: 28 }).map((_, i) => (
                <motion.div key={i}
                  initial={{ opacity: 1, y: "60vh", x: `${5 + (i * 3.4) % 88}vw`, scale: 0 }}
                  animate={{ opacity: 0, y: "-5vh", scale: 1 }}
                  transition={{ duration: 1.4 + (i % 4) * 0.2, delay: i * 0.04 }}
                  className="absolute h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: ["#0ea5e9","#10b981","#6366f1","#f59e0b","#ec4899"][i % 5] }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {done && (
            <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              onClick={onContinue}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-sky-400">
              See Real Examples
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Scene 11: Real Examples ──────────────────────────────────────────────────

function ExamplesScene({ onContinue }: { onContinue: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 overflow-y-auto bg-bg/95 backdrop-blur-lg">
      <div className="mx-auto w-full max-w-2xl px-5 py-10">
        <p className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-sky-400">
          Scene 11 · Real Product Examples
        </p>
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-2 text-center text-2xl font-black text-fg">
          How real EdTech companies do BTS
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="mb-8 text-center text-sm text-muted">
          Tap each company to see how they prepare.
        </motion.p>

        <div className="mb-8 space-y-3">
          {REAL_EXAMPLES.map((ex, i) => (
            <motion.div key={ex.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.09 }}>
              <button
                onClick={() => setExpanded(expanded === ex.name ? null : ex.name)}
                className={`w-full rounded-2xl border p-4 text-left transition-all ${ex.color} ${
                  expanded === ex.name ? "ring-1 ring-sky-500/30" : "hover:opacity-90"
                }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{ex.emoji}</span>
                    <span className={`text-sm font-bold ${ex.accent}`}>{ex.name}</span>
                  </div>
                  <motion.div animate={{ rotate: expanded === ex.name ? 90 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronRight className={`h-4 w-4 ${ex.accent}`} />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {expanded === ex.name && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 text-sm leading-relaxed text-muted overflow-hidden">
                      {ex.detail}
                    </motion.p>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center">
          <button onClick={onContinue}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-sky-400">
            Launch the Platform
            <Rocket className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Scene 12: Final Launch ───────────────────────────────────────────────────

function FinalScene({ onContinue }: { onContinue: () => void }) {
  const [countN, setCountN] = useState(3);
  const [launched, setLaunched] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) { setCountN(0); setLaunched(true); setTimeout(() => setShowStats(true), 300); return; }
    const t1 = setTimeout(() => setCountN(2), 1000);
    const t2 = setTimeout(() => setCountN(1), 2000);
    const t3 = setTimeout(() => { setCountN(0); setLaunched(true); }, 3000);
    const t4 = setTimeout(() => setShowStats(true), 4200);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [reduce]);

  const FINAL_STATS = [
    { label: "Students Onboarded",  value: "2.5M",    icon: Users,       color: "text-sky-400" },
    { label: "Platform Uptime",     value: "99.99%",   icon: Shield,      color: "text-emerald-400" },
    { label: "Avg Response Time",   value: "210 ms",   icon: Zap,         color: "text-amber-400" },
    { label: "User Satisfaction",   value: "4.8 ★",    icon: Star,        color: "text-violet-400" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-bg/95 backdrop-blur-lg">
      <div className="mx-auto w-full max-w-xl px-5 py-10 text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-sky-400">
          Scene 12 · Final Launch
        </p>
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-8 text-2xl font-black text-fg">
          The moment you've prepared for
        </motion.h2>

        {/* Countdown */}
        <AnimatePresence mode="wait">
          {!launched && (
            <motion.div key="countdown" exit={{ opacity: 0, scale: 0.5 }}
              className="mb-8 flex justify-center">
              <motion.div
                key={countN}
                initial={{ opacity: 0, scale: 2 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="grid h-32 w-32 place-items-center rounded-full border-4 border-sky-500/40 bg-sky-500/10">
                <span className="text-6xl font-black text-sky-400">{countN}</span>
              </motion.div>
            </motion.div>
          )}

          {launched && !showStats && (
            <motion.div key="launch" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
              className="mb-8 flex justify-center">
              <div className="grid h-32 w-32 place-items-center rounded-full border-4 border-emerald-500/40 bg-emerald-500/10">
                <Rocket className="h-14 w-14 text-emerald-400" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {launched && !showStats && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-8 text-xl font-black text-emerald-400">
              🚀 Platform Live!
            </motion.p>
          )}
        </AnimatePresence>

        {/* Stats grid */}
        <AnimatePresence>
          {showStats && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6 grid grid-cols-2 gap-3">
                {FINAL_STATS.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.div key={s.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1, type: "spring" }}
                      className="rounded-2xl border border-border/50 bg-surface p-4">
                      <Icon className={`mx-auto mb-2 h-5 w-5 ${s.color}`} />
                      <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                      <p className="text-xs text-muted">{s.label}</p>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="mb-6 rounded-2xl border border-sky-500/30 bg-sky-500/8 p-2 text-center">
                <div className="inline-flex items-center gap-2 rounded-xl bg-sky-500/15 px-4 py-2">
                  <Globe className="h-4 w-4 text-sky-400" />
                  <span className="text-sm font-black text-sky-400">BTS Launch Successful</span>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                className="mb-8 rounded-2xl border border-border/50 bg-surface p-5 text-left">
                <div className="space-y-2 text-sm leading-relaxed text-muted">
                  <p>Back to School isn't just a marketing season.</p>
                  <p>It's one of the most important product launches of the year.</p>
                  <p>Months of planning, testing, scaling, and collaboration ensure millions of learners have a seamless first experience.</p>
                </div>
                <div className="mt-4 rounded-xl border border-sky-500/20 bg-sky-500/8 px-4 py-3 text-center">
                  <p className="text-sm font-black text-sky-400">That's the power of BTS.</p>
                </div>
              </motion.div>

              <button onClick={() => { trackEvent("bts_simulation_completed"); onContinue(); }}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-sky-400">
                <CheckCircle className="h-4 w-4" />
                Complete Simulation
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BackToSchoolPage() {
  const [phase, setPhase] = useState<Phase>("mission");

  useEffect(() => {
    trackEvent("bts_simulation_started");
  }, []);

  const go = (p: Phase) => setPhase(p);

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="relative overflow-hidden border-b border-border/50 bg-bg">
        <div className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(14,165,233,0.08) 1px, transparent 0)", backgroundSize: "36px 36px" }} />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/15 blur-[100px]" />
        <div className="relative mx-auto max-w-3xl px-5 py-12">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <Link href="/domain-knowledge/edtech"
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg">
              <ArrowLeft className="h-4 w-4" />
              EdTech Concepts
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1">
            <span className="text-xs font-semibold tracking-wide text-sky-400">Interactive Simulation</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mb-3 text-3xl font-black tracking-tight text-fg md:text-4xl">
            Back to School
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="max-w-xl text-[15px] leading-relaxed text-muted">
            Become the PM responsible for the year's biggest product launch.
          </motion.p>
        </div>
      </header>

      {/* Mission screen */}
      {phase === "mission" && (
        <div className="mx-auto max-w-2xl px-5 py-16 text-center">
          <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mb-3 text-3xl font-black text-fg md:text-4xl">
            Back to School is 30 Days Away
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="mb-10 text-sm leading-relaxed text-muted">
            You're the Product Manager of an LMS. Millions of students will join your platform next month. Your mission is to prepare the platform before launch day.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="mb-8 rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-surface p-8 text-left shadow-soft">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-sky-500/30 bg-sky-500/15">
                <Globe className="h-5 w-5 text-sky-400" />
              </div>
              <div>
                <p className="text-xs text-muted">Your Platform</p>
                <p className="text-lg font-black text-fg">BrightPath LMS</p>
              </div>
            </div>
            <div className="mb-6 grid grid-cols-3 gap-4">
              {[
                { label: "Current Users",       value: "820K",    color: "text-sky-400" },
                { label: "Expected BTS Users",  value: "2.5M",    color: "text-emerald-400" },
                { label: "Time Remaining",      value: "30 Days", color: "text-rose-400" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border/40 bg-elevated/50 p-3 text-center">
                  <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-sky-500/20 bg-sky-500/8 px-4 py-3">
              <p className="text-xs text-muted">Mission</p>
              <p className="text-sm font-bold text-sky-400">Prepare the platform for 2.5M learners without disruption</p>
            </div>
          </motion.div>

          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            onClick={() => go("calm")}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition-all hover:bg-sky-400">
            <Play className="h-4 w-4" />
            Start Mission
          </motion.button>
        </div>
      )}

      {/* Done screen */}
      {phase === "done" && (
        <div className="mx-auto max-w-xl px-5 py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-sky-500/30 bg-sky-500/8 p-10">
            <Rocket className="mx-auto mb-4 h-12 w-12 text-sky-400" />
            <h2 className="mb-3 text-2xl font-black text-fg">Simulation Complete</h2>
            <p className="mb-6 text-sm leading-relaxed text-muted">
              You've experienced the full Back to School launch — from calm pre-season to a 2.5M-user platform event. You planned, scaled, fixed bugs, and launched successfully.
            </p>
            <Link href="/domain-knowledge/edtech"
              className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-surface px-6 py-3 text-sm font-semibold text-muted transition-all hover:border-sky-500/40 hover:text-fg">
              <ArrowLeft className="h-4 w-4" />
              Back to EdTech Concepts
            </Link>
          </motion.div>
        </div>
      )}

      {/* Overlay scenes */}
      <AnimatePresence>
        {phase === "calm"      && <CalmScene      key="calm"      onContinue={() => go("countdown")} />}
        {phase === "countdown" && <CountdownScene key="countdown" onContinue={() => go("plan")}      />}
        {phase === "plan"      && <PlanScene      key="plan"      onContinue={() => go("warroom")}   />}
        {phase === "warroom"   && <WarRoomScene   key="warroom"   onContinue={() => go("traffic")}   />}
        {phase === "traffic"   && <TrafficScene   key="traffic"   onContinue={() => go("bug")}       />}
        {phase === "bug"       && <BugScene       key="bug"       onContinue={() => go("journey")}   />}
        {phase === "journey"   && <JourneyScene   key="journey"   onContinue={() => go("analytics")} />}
        {phase === "analytics" && <AnalyticsScene key="analytics" onContinue={() => go("impact")}    />}
        {phase === "impact"    && <ImpactScene    key="impact"    onContinue={() => go("checklist")} />}
        {phase === "checklist" && <ChecklistScene key="checklist" onContinue={() => go("examples")}  />}
        {phase === "examples"  && <ExamplesScene  key="examples"  onContinue={() => go("final")}     />}
        {phase === "final"     && <FinalScene     key="final"     onContinue={() => go("done")}      />}
      </AnimatePresence>
    </div>
  );
}
