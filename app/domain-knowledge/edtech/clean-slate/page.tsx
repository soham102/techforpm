"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Archive,
  RotateCcw,
  Shield,
  CheckCircle,
  XCircle,
  Users,
  BookOpen,
  ClipboardList,
  Award,
  MessageSquare,
  Lock,
  Unlock,
  TrendingUp,
  Database,
  FileText,
  AlertTriangle,
  Star,
  ChevronRight,
  Play,
  RefreshCw,
  Zap,
} from "lucide-react";
import { trackEvent } from "@/lib/lib/gtag";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase =
  | "mission"
  | "lms"
  | "classify"
  | "archive"
  | "reset"
  | "batch"
  | "compare"
  | "compliance"
  | "progress"
  | "impact"
  | "thinking"
  | "final"
  | "done";

type Bucket = "archive" | "reset" | null;

interface DataCard {
  id: string;
  label: string;
  icon: React.ElementType;
  correct: Bucket;
  reason: string;
  color: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const DATA_CARDS: DataCard[] = [
  {
    id: "grades",
    label: "Grades",
    icon: Star,
    correct: "archive",
    reason: "Grades are permanent academic records required for transcripts and audits.",
    color: "text-amber-400",
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: CheckCircle,
    correct: "archive",
    reason: "Attendance history is needed for compliance and government reporting.",
    color: "text-emerald-400",
  },
  {
    id: "submissions",
    label: "Assignment Submissions",
    icon: ClipboardList,
    correct: "archive",
    reason: "Submitted work is a student's intellectual record — never delete it.",
    color: "text-violet-400",
  },
  {
    id: "discussions",
    label: "Discussion History",
    icon: MessageSquare,
    correct: "archive",
    reason: "Discussions capture academic discourse — archived for institutional knowledge.",
    color: "text-sky-400",
  },
  {
    id: "certificates",
    label: "Certificates",
    icon: Award,
    correct: "archive",
    reason: "Certificates are legal proof of completion — must be preserved forever.",
    color: "text-rose-400",
  },
  {
    id: "enrollments",
    label: "Active Enrollments",
    icon: Users,
    correct: "reset",
    reason: "Last year's enrollments don't apply to new students — reset for fresh intake.",
    color: "text-cyan-400",
  },
  {
    id: "progress",
    label: "Learning Progress",
    icon: TrendingUp,
    correct: "reset",
    reason: "Progress bars belong to individuals — new students start from zero.",
    color: "text-orange-400",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: AlertTriangle,
    correct: "reset",
    reason: "Old alerts and deadlines are irrelevant to incoming students.",
    color: "text-pink-400",
  },
];

const LMS_STATS = [
  { label: "Students", value: "2,842", icon: Users, color: "text-cyan-400" },
  { label: "Courses", value: "156", icon: BookOpen, color: "text-violet-400" },
  { label: "Assignments", value: "8,945", icon: ClipboardList, color: "text-amber-400" },
  { label: "Attendance", value: "18,312", icon: CheckCircle, color: "text-emerald-400" },
  { label: "Discussions", value: "4,201", icon: MessageSquare, color: "text-sky-400" },
  { label: "Certificates", value: "1,094", icon: Award, color: "text-rose-400" },
];

const PROGRESS_STEPS = [
  { id: "identify", label: "Identify historical data" },
  { id: "archive", label: "Archive student records" },
  { id: "compliance", label: "Preserve compliance data" },
  { id: "reset", label: "Reset active environment" },
  { id: "prepare", label: "Prepare LMS for new learners" },
];

const PRODUCT_INSIGHTS = [
  {
    icon: "⚙",
    title: "Operational Efficiency",
    body: "Automate repetitive yearly operations to reduce admin burden across hundreds of institutions.",
    color: "border-amber-500/30 bg-amber-500/8",
    accent: "text-amber-400",
  },
  {
    icon: "📈",
    title: "Scalability",
    body: "Support millions of learners across academic years without data bloat degrading performance.",
    color: "border-violet-500/30 bg-violet-500/8",
    accent: "text-violet-400",
  },
  {
    icon: "🔒",
    title: "Compliance",
    body: "Preserve historical records securely — GDPR, FERPA, government audits, and accreditation require this.",
    color: "border-emerald-500/30 bg-emerald-500/8",
    accent: "text-emerald-400",
  },
  {
    icon: "😊",
    title: "Better UX",
    body: "Students only see relevant, current information. No clutter from previous batches.",
    color: "border-sky-500/30 bg-sky-500/8",
    accent: "text-sky-400",
  },
  {
    icon: "🏫",
    title: "Academic Continuity",
    body: "Every new batch starts with a clean learning environment while inheriting institutional knowledge.",
    color: "border-rose-500/30 bg-rose-500/8",
    accent: "text-rose-400",
  },
];

const TIMELINE_STEPS = [
  { label: "Academic Year 2025–26", icon: BookOpen, color: "bg-violet-500/20 border-violet-500/40 text-violet-400" },
  { label: "Archive Historical Data", icon: Archive, color: "bg-amber-500/20 border-amber-500/40 text-amber-400" },
  { label: "Reset Active Workspace", icon: RefreshCw, color: "bg-rose-500/20 border-rose-500/40 text-rose-400" },
  { label: "Prepare New Courses", icon: ClipboardList, color: "bg-sky-500/20 border-sky-500/40 text-sky-400" },
  { label: "New Batch Joins", icon: Users, color: "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" },
  { label: "Academic Year 2026–27", icon: Star, color: "bg-cyan-500/20 border-cyan-500/40 text-cyan-400" },
];

// ─── Scene 1: LMS Dashboard ───────────────────────────────────────────────────

function LMSScene({ onContinue }: { onContinue: () => void }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 overflow-y-auto bg-bg/95 backdrop-blur-lg"
    >
      <div className="mx-auto w-full max-w-3xl px-5 py-10">
        <p className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-amber-400">
          Scene 1 · LMS Dashboard
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-2 text-center text-2xl font-black text-fg"
        >
          Academic Year 2025–26 is Active
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-8 text-center text-sm text-muted"
        >
          Everything is live. Thousands of students, courses, and records.
        </motion.p>

        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {LMS_STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                className="rounded-2xl border border-border/50 bg-surface p-4 shadow-soft"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-xs text-muted">{stat.label}</span>
                </div>
                <motion.p
                  initial={reduce ? {} : { opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.06, type: "spring" }}
                  className={`text-2xl font-black ${stat.color}`}
                >
                  {stat.value}
                </motion.p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/8 p-4 text-center"
        >
          <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            All systems active
          </div>
          <p className="mt-2 text-sm font-bold text-fg">What happens when tomorrow's students arrive?</p>
          <p className="mt-1 text-xs text-muted">2,500 new learners will join. Old data must be handled first.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-center">
          <button
            onClick={onContinue}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-amber-400"
          >
            Open Year Management
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Scene 2: Classifier ─────────────────────────────────────────────────────

function ClassifyScene({ onContinue }: { onContinue: () => void }) {
  const [feedback, setFeedback] = useState<Record<string, "correct" | "wrong">>({});
  const [wrongReason, setWrongReason] = useState<string | null>(null);
  const wrongTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allDone = DATA_CARDS.every((c) => feedback[c.id] === "correct");

  const handlePlace = useCallback(
    (bucket: Bucket, cardId: string) => {
      const card = DATA_CARDS.find((c) => c.id === cardId);
      if (!card || feedback[cardId] === "correct") return;
      if (card.correct === bucket) {
        setFeedback((p) => ({ ...p, [cardId]: "correct" }));
        setWrongReason(null);
        if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current);
      } else {
        setFeedback((p) => ({ ...p, [cardId]: "wrong" }));
        setWrongReason(card.reason);
        if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current);
        wrongTimerRef.current = setTimeout(() => {
          setFeedback((p) => {
            if (p[cardId] === "wrong") { const n = { ...p }; delete n[cardId]; return n; }
            return p;
          });
          setWrongReason(null);
        }, 2500);
      }
    },
    [feedback]
  );

  useEffect(() => () => { if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current); }, []);

  const unplaced = DATA_CARDS.filter((c) => feedback[c.id] !== "correct");
  const archiveCards = DATA_CARDS.filter((c) => feedback[c.id] === "correct" && c.correct === "archive");
  const resetCards = DATA_CARDS.filter((c) => feedback[c.id] === "correct" && c.correct === "reset");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 overflow-y-auto bg-bg/95 backdrop-blur-lg"
    >
      <div className="mx-auto w-full max-w-2xl px-5 py-10">
        <p className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-amber-400">
          Scene 2 · Data Classification
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-2 text-center text-2xl font-black text-fg"
        >
          What do you archive vs. reset?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-5 text-center text-sm text-muted"
        >
          For each data type, choose where it belongs.
        </motion.p>

        <AnimatePresence>
          {wrongReason && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/8 p-3 text-center text-sm text-rose-400"
            >
              <XCircle className="mx-auto mb-1 h-4 w-4" />
              {wrongReason}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-5 space-y-2.5">
          <AnimatePresence>
            {unplaced.map((card) => {
              const Icon = card.icon;
              const isWrong = feedback[card.id] === "wrong";
              return (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all ${
                    isWrong ? "border-rose-500/50 bg-rose-500/8" : "border-border/50 bg-surface"
                  }`}
                >
                  <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${
                    isWrong ? "border-rose-500/30 bg-rose-500/10" : "border-border/40 bg-elevated"
                  }`}>
                    <Icon className={`h-4 w-4 ${isWrong ? "text-rose-400" : card.color}`} />
                  </div>
                  <span className={`flex-1 text-sm font-semibold ${isWrong ? "text-rose-400" : "text-fg"}`}>
                    {card.label}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePlace("archive", card.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-400 transition-all hover:bg-amber-500/20 active:scale-95"
                    >
                      <Archive className="h-3 w-3" />
                      Archive
                    </button>
                    <button
                      onClick={() => handlePlace("reset", card.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-400 transition-all hover:bg-rose-500/20 active:scale-95"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Reset
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {(archiveCards.length > 0 || resetCards.length > 0) && (
          <div className="mb-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/8 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Archive className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-400">Archive</span>
                <span className="ml-auto text-xs text-muted">{archiveCards.length}/{DATA_CARDS.filter(c => c.correct === "archive").length}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {archiveCards.map((c) => (
                  <span key={c.id} className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400">✓ {c.label}</span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/8 p-4">
              <div className="mb-2 flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-rose-400" />
                <span className="text-xs font-bold text-rose-400">Reset</span>
                <span className="ml-auto text-xs text-muted">{resetCards.length}/{DATA_CARDS.filter(c => c.correct === "reset").length}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {resetCards.map((c) => (
                  <span key={c.id} className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400">✓ {c.label}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {allDone && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/8 p-4">
                <CheckCircle className="mx-auto mb-2 h-8 w-8 text-emerald-400" />
                <p className="font-bold text-emerald-400">Perfect classification!</p>
                <p className="mt-1 text-xs text-muted">Historical data archived. Active workspace ready to reset.</p>
              </div>
              <button
                onClick={() => { trackEvent("data_classification_completed"); onContinue(); }}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-amber-400"
              >
                Begin Archive Process
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Scene 3: Archive Process ─────────────────────────────────────────────────

function ArchiveScene({ onContinue }: { onContinue: () => void }) {
  const [step, setStep] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (step >= 4) return;
    const id = setTimeout(() => setStep((p) => p + 1), 900);
    return () => clearTimeout(id);
  }, [step]);

  const LABELS = ["Encrypted", "Searchable", "Recoverable", "Compliance Ready"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-bg/95 backdrop-blur-lg"
    >
      <div className="mx-auto w-full max-w-xl px-5 py-10 text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
          Scene 3 · Archive Process
        </p>
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-8 text-2xl font-black text-fg">
          Moving data to secure archive…
        </motion.h2>

        <div className="mb-8 flex items-center justify-between gap-4">
          <motion.div
            animate={step >= 1 && !reduce ? { opacity: [1, 0.5, 1] } : {}}
            transition={{ repeat: step < 4 ? Infinity : 0, duration: 1.2 }}
            className="flex-1 rounded-2xl border border-border/60 bg-surface p-5"
          >
            <Database className="mx-auto mb-2 h-10 w-10 text-muted" />
            <p className="text-xs font-bold text-fg">Academic Year</p>
            <p className="text-xs text-muted">2025–26</p>
          </motion.div>

          <div className="flex flex-col items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={step >= 1 && !reduce ? { opacity: [0, 1, 0], x: [0, 16, 0] } : { opacity: 0.2 }}
                transition={{ repeat: step < 4 ? Infinity : 0, duration: 1.2, delay: i * 0.3 }}
                className="h-1.5 w-6 rounded-full bg-amber-400"
              />
            ))}
          </div>

          <motion.div
            animate={step >= 4 ? { borderColor: "rgba(245,158,11,0.5)", backgroundColor: "rgba(245,158,11,0.06)" } : {}}
            className="flex-1 rounded-2xl border border-border/60 bg-surface p-5 transition-all"
          >
            <Archive className={`mx-auto mb-2 h-10 w-10 ${step >= 4 ? "text-amber-400" : "text-muted"}`} />
            <p className="text-xs font-bold text-fg">Secure Archive</p>
            <p className="text-xs text-muted">Storage</p>
          </motion.div>
        </div>

        <AnimatePresence>
          {step >= 4 && (
            <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="mb-6 flex justify-center">
              <div className="rounded-full border border-amber-500/40 bg-amber-500/10 p-4">
                <Lock className="h-8 w-8 text-amber-400" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {LABELS.map((label, i) => (
            <AnimatePresence key={label}>
              {step > i && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          ))}
        </div>

        <AnimatePresence>
          {step >= 4 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/8 p-4">
              <p className="text-sm font-bold text-emerald-400">Nothing is deleted.</p>
              <p className="text-xs text-muted mt-1">Everything is archived safely and remains accessible forever.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {step >= 4 && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={() => { trackEvent("archive_completed"); onContinue(); }}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-amber-400">
              Reset Active Workspace
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Scene 4: Reset ───────────────────────────────────────────────────────────

function ResetScene({ onContinue }: { onContinue: () => void }) {
  const [animating, setAnimating] = useState(false);
  const [done, setDone] = useState(false);
  const reduce = useReducedMotion();

  const ROWS = [
    { label: "Current Students", value: 2842, icon: Users, color: "text-cyan-400" },
    { label: "Assignments", value: 8945, icon: ClipboardList, color: "text-amber-400" },
    { label: "Attendance Records", value: 18312, icon: CheckCircle, color: "text-emerald-400" },
  ];

  const handleReset = () => {
    setAnimating(true);
    setTimeout(() => setDone(true), 2200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-bg/95 backdrop-blur-lg"
    >
      <div className="mx-auto w-full max-w-xl px-5 py-10 text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
          Scene 4 · Workspace Reset
        </p>
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-2 text-2xl font-black text-fg">
          Clear the active environment
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="mb-8 text-sm text-muted">
          Historical records stay archived. Only the active workspace resets.
        </motion.p>

        <div className="mb-8 grid gap-4">
          {ROWS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl border border-border/50 bg-surface p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${item.color}`} />
                  <span className="text-xs text-muted">{item.label}</span>
                </div>
                <div className="flex items-center justify-center gap-6">
                  <div className="text-center">
                    <p className="mb-1 text-xs text-muted">Before</p>
                    <motion.p
                      animate={animating && !reduce ? { opacity: [1, 0] } : {}}
                      transition={{ duration: 0.8, delay: i * 0.2 }}
                      className={`text-2xl font-black ${item.color}`}
                    >
                      {item.value.toLocaleString()}
                    </motion.p>
                  </div>
                  <span className="text-muted">→</span>
                  <div className="text-center">
                    <p className="mb-1 text-xs text-muted">After</p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={animating ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.9 + i * 0.2 }}
                      className="text-2xl font-black text-rose-400"
                    >
                      0
                    </motion.p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <AnimatePresence>
          {done && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/8 p-5">
              <motion.div animate={reduce ? {} : { rotate: [0, 360] }} transition={{ duration: 0.6 }}>
                <RefreshCw className="mx-auto mb-3 h-8 w-8 text-emerald-400" />
              </motion.div>
              <p className="text-base font-black text-emerald-400">Fresh Workspace Ready</p>
              <p className="mt-1 text-xs text-muted">Only the active layer was cleared. Archived data remains untouched.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {!animating ? (
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-rose-400"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Active Environment
          </button>
        ) : done ? (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onClick={() => { trackEvent("workspace_reset_completed"); onContinue(); }}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-amber-400">
            Onboard New Batch
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        ) : (
          <div className="flex items-center justify-center gap-2 text-sm text-muted">
            <motion.div animate={reduce ? {} : { rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <RefreshCw className="h-4 w-4" />
            </motion.div>
            Resetting…
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Scene 5: New Batch Arrives ───────────────────────────────────────────────

function BatchScene({ onContinue }: { onContinue: () => void }) {
  const [count, setCount] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) { setCount(2500); return; }
    const targets = [150, 800, 2500];
    let ti = 0;
    const step = () => {
      if (ti >= targets.length) return;
      const target = targets[ti];
      const start = ti === 0 ? 0 : targets[ti - 1];
      ti++;
      const duration = 1200;
      const startTime = Date.now();
      const animate = () => {
        const progress = Math.min((Date.now() - startTime) / duration, 1);
        setCount(Math.round(start + (target - start) * progress));
        if (progress < 1) requestAnimationFrame(animate);
        else setTimeout(step, 600);
      };
      requestAnimationFrame(animate);
    };
    setTimeout(step, 500);
  }, [reduce]);

  const done = count >= 2500;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-bg/95 backdrop-blur-lg"
    >
      <div className="mx-auto w-full max-w-xl px-5 py-10 text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
          Scene 5 · New Batch
        </p>
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-8 text-2xl font-black text-fg">
          The class of 2026–27 is arriving
        </motion.h2>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="mb-6 rounded-3xl border border-amber-500/30 bg-surface p-8 shadow-soft">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">Students Enrolled</p>
          <p className="text-6xl font-black tabular-nums text-amber-400">{count.toLocaleString()}</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-elevated">
            <motion.div
              animate={{ width: `${(count / 2500) * 100}%` }}
              transition={{ duration: 0.3 }}
              className="h-full rounded-full bg-amber-500"
            />
          </div>
          <p className="mt-2 text-xs text-muted">of 2,500 expected</p>
        </motion.div>

        <div className="mb-6 space-y-2 text-left">
          {[
            { label: "New courses created", value: "42", color: "text-violet-400", show: count > 150 },
            { label: "Fresh assignments added", value: "320", color: "text-sky-400", show: count > 800 },
            { label: "Attendance tracking live", value: "Active", color: "text-emerald-400", show: count >= 2500 },
          ].map((item) => (
            <AnimatePresence key={item.label}>
              {item.show && (
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between rounded-xl border border-border/50 bg-surface px-4 py-2.5 text-sm"
                >
                  <span className="text-muted">{item.label}</span>
                  <span className={`font-bold ${item.color}`}>{item.value}</span>
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>

        <AnimatePresence>
          {done && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/8 p-4">
              <p className="text-sm font-bold text-emerald-400">Everything feels like a brand-new LMS.</p>
              <p className="mt-1 text-xs text-muted">Because the workspace was clean. That's Clean Slate in action.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {done && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={() => { trackEvent("new_batch_initialized"); onContinue(); }}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-amber-400">
              See What Happens Without This
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Scene 6: Before vs After ─────────────────────────────────────────────────

function CompareScene({ onContinue }: { onContinue: () => void }) {
  const WITHOUT = [
    "Old assignments visible to new students",
    "Stale grades mixed with current work",
    "Wrong attendance from last year",
    "Duplicate enrollments",
    "Slow, bloated dashboards",
    "Confused administrators",
  ];
  const WITH = [
    "Clean workspace for new students",
    "Only current learners visible",
    "Fast system performance",
    "Organised course catalogue",
    "Historical data safely archived",
    "Happy administrators",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-bg/95 backdrop-blur-lg"
    >
      <div className="mx-auto w-full max-w-3xl px-5 py-10">
        <p className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-amber-400">
          Scene 6 · Before vs After
        </p>
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-8 text-center text-2xl font-black text-fg">
          What if you skipped Clean Slate?
        </motion.h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            className="rounded-2xl border border-rose-500/30 bg-rose-500/8 p-5">
            <div className="mb-4 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-rose-400" />
              <span className="text-sm font-bold text-rose-400">Without Clean Slate</span>
            </div>
            <ul className="space-y-2.5">
              {WITHOUT.map((item, i) => (
                <motion.li key={item} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.07 }}
                  className="flex items-start gap-2 text-sm text-rose-300">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            className="rounded-2xl border border-emerald-500/30 bg-emerald-500/8 p-5">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-bold text-emerald-400">With Clean Slate</span>
            </div>
            <ul className="space-y-2.5">
              {WITH.map((item, i) => (
                <motion.li key={item} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.07 }}
                  className="flex items-start gap-2 text-sm text-emerald-300">
                  <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="mt-6 text-center">
          <button
            onClick={onContinue}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-amber-400"
          >
            View Compliance Dashboard
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Scene 7: Compliance Dashboard ───────────────────────────────────────────

function ComplianceScene({ onContinue }: { onContinue: () => void }) {
  const [fetching, setFetching] = useState(false);
  const [fetched, setFetched] = useState(false);

  const ITEMS = [
    { label: "Historical Data", status: "Archived", icon: Archive, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
    { label: "Audit Logs", status: "Available", icon: FileText, color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/30" },
    { label: "Government Reporting", status: "Ready", icon: Shield, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
    { label: "Student Transcript Requests", status: "Supported", icon: Award, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/30" },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-bg/95 backdrop-blur-lg"
    >
      <div className="mx-auto w-full max-w-xl px-5 py-10">
        <p className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-amber-400">
          Scene 7 · Compliance Center
        </p>
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-8 text-center text-2xl font-black text-fg">
          Old records never disappear
        </motion.h2>

        <div className="mb-6 space-y-3">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className={`flex items-center justify-between rounded-2xl border p-4 ${item.bg}`}>
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${item.color}`} />
                  <span className="text-sm font-semibold text-fg">{item.label}</span>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-bold ${item.bg} ${item.color}`}>
                  {item.status}
                </span>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
          className="mb-6 rounded-2xl border border-border/50 bg-surface p-5">
          <p className="mb-3 text-sm font-bold text-fg">Retrieve Archived Record</p>
          <div className="mb-3 flex items-center gap-3 rounded-xl border border-border/40 bg-elevated px-3 py-2 text-sm text-muted">
            <Database className="h-4 w-4 text-amber-400" />
            Student ID: STU-2025-0842 · Academic Year 2023–24
          </div>

          {!fetched ? (
            <button
              onClick={() => { setFetching(true); setTimeout(() => { setFetching(false); setFetched(true); }, 2000); }}
              disabled={fetching}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-amber-400 disabled:opacity-60"
            >
              {fetching ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <RefreshCw className="h-4 w-4" />
                  </motion.div>
                  Fetching from archive…
                </>
              ) : (
                <><Unlock className="h-4 w-4" />Retrieve Archived Record</>
              )}
            </button>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="space-y-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/8 p-3">
              {[
                ["Student", "Priya Sharma"],
                ["Course", "Data Structures — A+"],
                ["Attendance", "94%"],
                ["Certificate", "Issued 2024-05-15"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs">
                  <span className="text-muted">{k}</span>
                  <span className="font-semibold text-fg">{v}</span>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {fetched && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mb-4 text-center text-sm font-bold text-emerald-400">
            Old records remain available whenever needed.
          </motion.p>
        )}

        <div className="text-center">
          <button
            onClick={() => { trackEvent("compliance_dashboard_viewed"); onContinue(); }}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-amber-400"
          >
            See Mission Progress
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Scene 8: Progress Tracker ────────────────────────────────────────────────

function ProgressScene({ onContinue }: { onContinue: () => void }) {
  const [visible, setVisible] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) { setVisible(PROGRESS_STEPS.length); return; }
    const id = setInterval(() => {
      setVisible((p) => (p >= PROGRESS_STEPS.length ? p : p + 1));
    }, 500);
    return () => clearInterval(id);
  }, [reduce]);

  const pct = Math.round((visible / PROGRESS_STEPS.length) * 100);
  const done = visible >= PROGRESS_STEPS.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-bg/95 backdrop-blur-lg"
    >
      <div className="relative mx-auto w-full max-w-lg px-5 py-10 text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
          Scene 8 · Mission Progress
        </p>
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-8 text-2xl font-black text-fg">
          Clean Slate: complete
        </motion.h2>

        <div className="mb-8 rounded-2xl border border-border/50 bg-surface p-6">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="font-semibold text-fg">Overall Progress</span>
            <span className="font-black text-amber-400">{pct}%</span>
          </div>
          <div className="mb-6 h-3 overflow-hidden rounded-full bg-elevated">
            <motion.div
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4 }}
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
            />
          </div>
          <div className="space-y-3">
            {PROGRESS_STEPS.map((step, i) => (
              <motion.div
                key={step.id}
                animate={i < visible ? { opacity: 1, x: 0 } : { opacity: 0.3, x: 0 }}
                className="flex items-center gap-3 text-left"
              >
                <div className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${
                  i < visible ? "border-emerald-500/50 bg-emerald-500/15" : "border-border/40 bg-elevated"
                }`}>
                  {i < visible
                    ? <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                    : <div className="h-2 w-2 rounded-full bg-muted/30" />
                  }
                </div>
                <span className={`text-sm ${i < visible ? "font-semibold text-fg" : "text-muted"}`}>{step.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {done && (
            <motion.div className="pointer-events-none absolute inset-0 overflow-hidden">
              {Array.from({ length: 24 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, y: "60vh", x: `${5 + (i * 4.1) % 88}vw`, scale: 0 }}
                  animate={{ opacity: 0, y: "-5vh", scale: 1 }}
                  transition={{ duration: 1.4 + (i % 4) * 0.2, delay: i * 0.05 }}
                  className="absolute h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: ["#f59e0b", "#10b981", "#6366f1", "#ec4899", "#22d3ee"][i % 5] }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {done && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={onContinue}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-amber-400"
            >
              See the Impact
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Scene 9: Product Impact ──────────────────────────────────────────────────

function ImpactScene({ onContinue }: { onContinue: () => void }) {
  const METRICS = [
    { label: "System Performance", before: 68, after: 96, color: "from-amber-500 to-amber-400" },
    { label: "Storage Efficiency", before: 52, after: 91, color: "from-violet-500 to-violet-400" },
  ];
  const QUAL = [
    { label: "Admin Effort", before: "High", after: "Low" },
    { label: "Student Confusion", before: "Very High", after: "Minimal" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 overflow-y-auto bg-bg/95 backdrop-blur-lg"
    >
      <div className="mx-auto w-full max-w-2xl px-5 py-10">
        <p className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-amber-400">
          Scene 9 · Product Impact
        </p>
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-2 text-center text-2xl font-black text-fg">
          The numbers speak
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="mb-8 text-center text-sm text-muted">
          What changes after Clean Slate is implemented at scale.
        </motion.p>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          {METRICS.map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="rounded-2xl border border-border/50 bg-surface p-5">
              <p className="mb-4 text-sm font-semibold text-fg">{m.label}</p>
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <p className="text-xs text-muted">Before</p>
                  <p className="text-2xl font-black text-rose-400">{m.before}%</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted" />
                <div className="text-right">
                  <p className="text-xs text-muted">After</p>
                  <p className="text-2xl font-black text-emerald-400">{m.after}%</p>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-elevated">
                <motion.div
                  initial={{ width: `${m.before}%` }}
                  animate={{ width: `${m.after}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 + i * 0.1 }}
                  className={`h-full rounded-full bg-gradient-to-r ${m.color}`}
                />
              </div>
            </motion.div>
          ))}
          {QUAL.map((q, i) => (
            <motion.div key={q.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="rounded-2xl border border-border/50 bg-surface p-5">
              <p className="mb-4 text-sm font-semibold text-fg">{q.label}</p>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 rounded-xl border border-rose-500/30 bg-rose-500/8 py-2 text-center">
                  <p className="text-xs text-muted">Before</p>
                  <p className="text-sm font-bold text-rose-400">{q.before}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
                <div className="flex-1 rounded-xl border border-emerald-500/30 bg-emerald-500/8 py-2 text-center">
                  <p className="text-xs text-muted">After</p>
                  <p className="text-sm font-bold text-emerald-400">{q.after}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-500/8 p-4 text-center">
          <p className="text-sm font-black text-amber-400">
            Clean Slate improves operational efficiency and learner experience.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center">
          <button
            onClick={onContinue}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-amber-400"
          >
            Product Thinking
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Scene 10: Product Thinking ───────────────────────────────────────────────

function ThinkingScene({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 overflow-y-auto bg-bg/95 backdrop-blur-lg"
    >
      <div className="mx-auto w-full max-w-2xl px-5 py-10">
        <p className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-amber-400">
          Scene 10 · Product Thinking
        </p>
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-2 text-center text-2xl font-black text-fg">
          Why PMs care about this
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="mb-8 text-center text-sm text-muted">
          Clean Slate isn't just a technical operation — it's a product decision.
        </motion.p>

        <div className="mb-8 space-y-3">
          {PRODUCT_INSIGHTS.map((insight, i) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -16 : 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className={`rounded-2xl border p-5 ${insight.color}`}
            >
              <div className="mb-1.5 flex items-center gap-2">
                <span className="text-xl">{insight.icon}</span>
                <span className={`text-sm font-bold ${insight.accent}`}>{insight.title}</span>
              </div>
              <p className="text-sm leading-relaxed text-muted">{insight.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="text-center">
          <button
            onClick={onContinue}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-amber-400"
          >
            See the Full Timeline
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Final Scene ──────────────────────────────────────────────────────────────

function FinalScene({ onContinue }: { onContinue: () => void }) {
  const [visibleStep, setVisibleStep] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) { setVisibleStep(TIMELINE_STEPS.length); return; }
    const id = setInterval(() => {
      setVisibleStep((p) => (p >= TIMELINE_STEPS.length ? p : p + 1));
    }, 500);
    return () => clearInterval(id);
  }, [reduce]);

  const done = visibleStep >= TIMELINE_STEPS.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 overflow-y-auto bg-bg/95 backdrop-blur-lg"
    >
      <div className="mx-auto w-full max-w-xl px-5 py-10 text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
          Final · Academic Year Timeline
        </p>
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-8 text-2xl font-black text-fg">
          The full cycle
        </motion.h2>

        <div className="mb-10 flex flex-col items-center">
          {TIMELINE_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex flex-col items-center">
                <motion.div
                  animate={i < visibleStep ? { opacity: 1, scale: 1 } : { opacity: 0.2, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center gap-3 rounded-2xl border px-5 py-3 text-sm font-semibold ${step.color}`}
                >
                  <Icon className="h-4 w-4" />
                  {step.label}
                </motion.div>
                {i < TIMELINE_STEPS.length - 1 && (
                  <motion.div
                    animate={i < visibleStep - 1 ? { opacity: 1, scaleY: 1 } : { opacity: 0.15, scaleY: 1 }}
                    className="my-2 h-6 w-0.5 origin-top bg-gradient-to-b from-border/80 to-transparent"
                  />
                )}
              </div>
            );
          })}
        </div>

        <AnimatePresence>
          {done && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="mb-8 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent p-8">
              <div className="mb-4 flex justify-center">
                <div className="grid h-14 w-14 place-items-center rounded-2xl border border-amber-500/30 bg-amber-500/15">
                  <Star className="h-7 w-7 text-amber-400" />
                </div>
              </div>
              <h3 className="mb-4 text-2xl font-black text-fg">Mission Complete</h3>
              <div className="space-y-2 text-sm leading-relaxed text-muted">
                <p>The LMS is now ready for a new academic year.</p>
                <p>Old academic records remain safely archived.</p>
                <p>New learners begin with a clean, clutter-free experience.</p>
              </div>
              <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3">
                <p className="text-sm font-black text-amber-400">That's the power of Clean Slate.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {done && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => { trackEvent("clean_slate_completed"); onContinue(); }}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-amber-400"
            >
              <Zap className="h-4 w-4" />
              Finish Simulation
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CleanSlatePage() {
  const [phase, setPhase] = useState<Phase>("mission");

  useEffect(() => {
    if (phase === "mission") trackEvent("clean_slate_started");
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="relative overflow-hidden border-b border-border/50 bg-bg">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(245,158,11,0.08) 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/15 blur-[100px]" />
        <div className="relative mx-auto max-w-3xl px-5 py-12">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <Link href="/domain-knowledge/edtech"
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg">
              <ArrowLeft className="h-4 w-4" />
              EdTech Concepts
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1">
            <span className="text-xs font-semibold tracking-wide text-amber-400">Interactive Simulation</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mb-3 text-3xl font-black tracking-tight text-fg md:text-4xl">
            Clean Slate
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="max-w-xl text-[15px] leading-relaxed text-muted">
            Become an LMS administrator. Archive the past. Prepare the future.
          </motion.p>
        </div>
      </header>

      {/* Mission screen */}
      {phase === "mission" && (
        <div className="mx-auto max-w-2xl px-5 py-16 text-center">
          <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mb-3 text-3xl font-black text-fg md:text-4xl">
            A New Academic Year is About to Begin
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="mb-10 text-sm leading-relaxed text-muted">
            You're the Product Manager of a Learning Management System. Thousands of students are graduating. A new batch joins tomorrow. Prepare the LMS without losing important historical data.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="mb-8 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-surface p-8 text-left shadow-soft">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-amber-500/30 bg-amber-500/15">
                <BookOpen className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-muted">Current Academic Year</p>
                <p className="text-lg font-black text-fg">2025–2026</p>
              </div>
            </div>
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Students", value: "2,842", color: "text-cyan-400" },
                { label: "Courses", value: "156", color: "text-violet-400" },
                { label: "Assignments", value: "8,945", color: "text-amber-400" },
                { label: "Records", value: "18k+", color: "text-emerald-400" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border/40 bg-elevated/50 p-3 text-center">
                  <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3">
              <p className="text-xs text-muted">Goal</p>
              <p className="text-sm font-bold text-amber-400">Prepare the LMS for 2026–2027</p>
            </div>
          </motion.div>

          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            onClick={() => setPhase("lms")}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:bg-amber-400">
            <Play className="h-4 w-4" />
            Start Mission
          </motion.button>
        </div>
      )}

      {/* Done screen */}
      {phase === "done" && (
        <div className="mx-auto max-w-xl px-5 py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-emerald-500/30 bg-emerald-500/8 p-10">
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-emerald-400" />
            <h2 className="mb-3 text-2xl font-black text-fg">Simulation Complete</h2>
            <p className="mb-6 text-sm leading-relaxed text-muted">
              You've experienced the full Clean Slate workflow — from a live academic year to a fresh, compliant LMS ready for a new batch.
            </p>
            <Link href="/domain-knowledge/edtech"
              className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-surface px-6 py-3 text-sm font-semibold text-muted transition-all hover:border-amber-500/40 hover:text-fg">
              <ArrowLeft className="h-4 w-4" />
              Back to EdTech Concepts
            </Link>
          </motion.div>
        </div>
      )}

      {/* Overlay scenes */}
      <AnimatePresence>
        {phase === "lms"        && <LMSScene        key="lms"        onContinue={() => setPhase("classify")}   />}
        {phase === "classify"   && <ClassifyScene   key="classify"   onContinue={() => setPhase("archive")}    />}
        {phase === "archive"    && <ArchiveScene    key="archive"    onContinue={() => setPhase("reset")}      />}
        {phase === "reset"      && <ResetScene      key="reset"      onContinue={() => setPhase("batch")}      />}
        {phase === "batch"      && <BatchScene      key="batch"      onContinue={() => setPhase("compare")}    />}
        {phase === "compare"    && <CompareScene    key="compare"    onContinue={() => setPhase("compliance")} />}
        {phase === "compliance" && <ComplianceScene key="compliance" onContinue={() => setPhase("progress")}   />}
        {phase === "progress"   && <ProgressScene   key="progress"   onContinue={() => setPhase("impact")}     />}
        {phase === "impact"     && <ImpactScene     key="impact"     onContinue={() => setPhase("thinking")}   />}
        {phase === "thinking"   && <ThinkingScene   key="thinking"   onContinue={() => setPhase("final")}      />}
        {phase === "final"      && <FinalScene      key="final"      onContinue={() => setPhase("done")}       />}
      </AnimatePresence>
    </div>
  );
}
