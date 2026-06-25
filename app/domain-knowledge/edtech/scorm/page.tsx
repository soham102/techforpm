"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Monitor,
  Server,
  Package,
  RefreshCw,
  Play,
  RotateCcw,
  Wifi,
  WifiOff,
  Database,
} from "lucide-react";

// ─── Quiz Data ─────────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    text: "What does API stand for?",
    options: [
      { id: "A", text: "Application Programming Interface" },
      { id: "B", text: "Automated Processing Interface" },
      { id: "C", text: "Advanced Program Integration" },
      { id: "D", text: "Application Process Instruction" },
    ],
    correct: "A",
  },
  {
    text: "What does a database primarily store?",
    options: [
      { id: "A", text: "Persistent app data and user records" },
      { id: "B", text: "Only images and media files" },
      { id: "C", text: "Real-time network requests" },
      { id: "D", text: "Browser session cookies only" },
    ],
    correct: "A",
  },
  {
    text: "What does caching primarily help with?",
    options: [
      { id: "A", text: "Reducing load times and server load" },
      { id: "B", text: "Storing user passwords securely" },
      { id: "C", text: "Sending emails to users" },
      { id: "D", text: "Managing database schemas" },
    ],
    correct: "A",
  },
];

// ─── Types ─────────────────────────────────────────────────────────────────────

type Phase =
  | "intro"
  | "quiz"
  | "crashed"
  | "reconnecting"
  | "complete";

interface ScormState {
  lesson_status: "not_attempted" | "incomplete" | "passed";
  score: number;
  location: string;
  time_spent: number;
  completion: number;
  suspend_data: string;
}

// ─── SCORM Data Panel ──────────────────────────────────────────────────────────

function ScormDataPanel({
  data,
  highlight = [],
  restored = false,
}: {
  data: ScormState;
  highlight?: string[];
  restored?: boolean;
}) {
  const fields = [
    {
      key: "lesson_status",
      label: "cmi.core.lesson_status",
      value: data.lesson_status,
      valueColor:
        data.lesson_status === "passed"
          ? "text-emerald-400"
          : data.lesson_status === "incomplete"
          ? "text-amber-400"
          : "text-muted",
    },
    {
      key: "score",
      label: "cmi.core.score.raw",
      value: `${data.score}`,
      valueColor: data.score > 0 ? "text-brand" : "text-muted",
    },
    {
      key: "location",
      label: "cmi.core.lesson_location",
      value: data.location || '""',
      valueColor: data.location ? "text-violet-400" : "text-muted",
    },
    {
      key: "time_spent",
      label: "cmi.core.total_time",
      value: `${Math.floor(data.time_spent / 60)}:${String(
        data.time_spent % 60
      ).padStart(2, "0")}`,
      valueColor: "text-fg",
    },
    {
      key: "completion",
      label: "completion_percentage",
      value: `${data.completion}%`,
      valueColor: data.completion > 0 ? "text-cyan-400" : "text-muted",
    },
    {
      key: "suspend_data",
      label: "cmi.suspend_data",
      value: data.suspend_data || '""',
      valueColor: data.suspend_data ? "text-emerald-400" : "text-muted",
    },
  ];

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-300 ${
        restored
          ? "border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
          : "border-border bg-surface"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`grid h-8 w-8 place-items-center rounded-lg ${
              restored ? "bg-emerald-500/20" : "bg-brand/10"
            }`}
          >
            <Monitor
              className={`h-4 w-4 ${restored ? "text-emerald-400" : "text-brand"}`}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-fg">Student Device</p>
            <p className="text-[10px] text-muted">SCORM runtime data</p>
          </div>
        </div>
        {restored && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5"
          >
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            <span className="text-[10px] font-semibold text-emerald-400">
              Restored
            </span>
          </motion.div>
        )}
      </div>

      <div className="space-y-2">
        {fields.map((field) => {
          const isHighlighted = highlight.includes(field.key);
          return (
            <motion.div
              key={field.key}
              animate={
                isHighlighted
                  ? { scale: [1, 1.02, 1], backgroundColor: ["rgba(99,102,241,0.05)", "rgba(99,102,241,0.15)", "rgba(99,102,241,0.05)"] }
                  : {}
              }
              transition={{ duration: 0.5 }}
              className={`rounded-lg px-3 py-2 transition-all ${
                isHighlighted ? "ring-1 ring-brand/40" : "bg-bg"
              }`}
            >
              <p className="text-[10px] font-mono text-muted">{field.label}</p>
              <p
                className={`mt-0.5 truncate text-sm font-semibold font-mono ${field.valueColor}`}
              >
                {field.value}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Quiz Section ──────────────────────────────────────────────────────────────

function QuizSection({
  currentQ,
  restored,
  onAnswer,
  scormData,
  highlight,
}: {
  currentQ: number;
  restored: boolean;
  onAnswer: (answer: string) => void;
  scormData: ScormState;
  highlight: string[];
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const q = QUESTIONS[currentQ];

  useEffect(() => {
    setSelected(null);
  }, [currentQ]);

  return (
    <div>
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-fg">
            Question {currentQ + 1} of {QUESTIONS.length}
            {restored && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                Resumed from SCORM
              </span>
            )}
          </p>
          <p className="text-sm text-muted">
            {Math.round(((currentQ) / QUESTIONS.length) * 100)}% complete
          </p>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-bg">
          <motion.div
            className="h-1.5 rounded-full bg-brand"
            animate={{ width: `${(currentQ / QUESTIONS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Question card */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand">
                  {restored ? "Continuing your saved session..." : "Tech Quiz"}
                </p>
                <h3 className="mb-6 text-lg font-bold text-fg">{q.text}</h3>
                <div className="space-y-3">
                  {q.options.map((opt) => (
                    <motion.button
                      key={opt.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelected(opt.id)}
                      className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                        selected === opt.id
                          ? "border-brand bg-brand/10 text-fg ring-1 ring-brand/60"
                          : "border-border bg-bg text-muted hover:border-brand/40 hover:bg-brand/5 hover:text-fg"
                      }`}
                    >
                      <span
                        className={`mr-2 font-bold ${
                          selected === opt.id ? "text-brand" : "text-muted"
                        }`}
                      >
                        {opt.id}.
                      </span>
                      {opt.text}
                    </motion.button>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <motion.button
                    whileHover={selected ? { scale: 1.03 } : {}}
                    whileTap={selected ? { scale: 0.97 } : {}}
                    disabled={!selected}
                    onClick={() => selected && onAnswer(selected)}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-glow transition-all hover:shadow-[0_0_24px_rgba(99,102,241,0.5)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {currentQ === QUESTIONS.length - 1 ? "Finish Quiz" : "Next"}
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* SCORM panel */}
        <div className="lg:col-span-2">
          <ScormDataPanel
            data={scormData}
            highlight={highlight}
            restored={restored}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Crash Overlay ─────────────────────────────────────────────────────────────

function CrashOverlay({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/96 backdrop-blur-md"
    >
      <div className="mx-auto max-w-md px-6 text-center">
        {/* Animated browser window */}
        <motion.div
          initial={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
          animate={{
            y: [0, -30, 80],
            opacity: [1, 1, 0],
            scale: [1, 0.92, 0.6],
            rotate: [0, -4, 6],
          }}
          transition={{ duration: 1.1, delay: 0.2, ease: "easeIn" }}
          className="mx-auto mb-10 w-52 overflow-hidden rounded-xl border border-border bg-surface shadow-soft-lg"
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-1.5 border-b border-border bg-elevated px-3 py-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <div className="ml-2 h-2 flex-1 rounded bg-border/80" />
          </div>
          {/* Fake content */}
          <div className="space-y-2 p-4">
            <div className="h-2 w-4/5 rounded bg-border/70" />
            <div className="h-2 w-3/5 rounded bg-border/70" />
            <div className="h-6 w-full rounded bg-brand/20" />
            <div className="h-2 w-2/5 rounded bg-border/70" />
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.95, duration: 0.45, type: "spring", bounce: 0.3 }}
        >
          <div className="mb-3 text-6xl">😱</div>
          <h2 className="mb-3 text-3xl font-black text-fg">Oops!</h2>
          <p className="mb-2 text-lg font-semibold text-rose-400">
            Your browser accidentally closed.
          </p>
          <p className="mb-8 text-sm text-muted">
            You were on{" "}
            <span className="font-semibold text-fg">Question 2</span>. Without
            SCORM, you&apos;d restart from scratch.
            <br />
            <span className="mt-1 block text-brand font-medium">
              But SCORM already saved your progress...
            </span>
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onContinue}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-8 py-3.5 text-sm font-bold text-white shadow-glow hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
          >
            <RefreshCw className="h-4 w-4" />
            Continue Later
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Reconnect Screen ──────────────────────────────────────────────────────────

function ReconnectScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const doneCalled = useRef(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 700),
      setTimeout(() => setStep(2), 1700),
      setTimeout(() => setStep(3), 2700),
      setTimeout(() => setStep(4), 3800),
      setTimeout(() => {
        if (!doneCalled.current) {
          doneCalled.current = true;
          onDone();
        }
      }, 5200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  const steps = [
    { label: "Connecting to LMS...", icon: Wifi },
    { label: "Fetching learner data...", icon: Server },
    { label: "Restoring previous session...", icon: RefreshCw },
  ];

  const flowNodes = [
    { label: "Quiz", bg: "bg-brand/10", text: "text-brand", border: "border-brand/30" },
    { label: "SCORM", bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/30" },
    { label: "LMS", bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
    { label: "Progress", bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
    { label: "Quiz", bg: "bg-brand/10", text: "text-brand", border: "border-brand/30" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/96 backdrop-blur-md"
    >
      <div className="mx-auto w-full max-w-md px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-sm font-semibold uppercase tracking-[0.2em] text-muted"
        >
          Student returns after 30 minutes...
        </motion.p>

        {/* Steps */}
        <div className="mb-8 space-y-3 text-left">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === i + 1;
            const isDone = step > i + 1;
            return (
              <AnimatePresence key={s.label}>
                {step >= i + 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35 }}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                      isDone
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-brand/30 bg-brand/5"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        isDone ? "bg-emerald-500/15" : "bg-brand/15"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.9,
                            ease: "linear",
                          }}
                        >
                          <Icon className="h-4 w-4 text-brand" />
                        </motion.div>
                      )}
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        isDone ? "text-emerald-400" : "text-brand"
                      }`}
                    >
                      {s.label}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}
        </div>

        {/* Flow diagram */}
        <AnimatePresence>
          {step >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6"
            >
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                {flowNodes.map((node, i) => (
                  <div key={`${node.label}-${i}`} className="flex items-center gap-1.5">
                    {i > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.25 }}
                      >
                        <ArrowRight className="h-3.5 w-3.5 text-muted" />
                      </motion.div>
                    )}
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1, duration: 0.25 }}
                      className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${node.bg} ${node.text} ${node.border}`}
                    >
                      {node.label}
                    </motion.span>
                  </div>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-sm font-semibold text-emerald-400"
              >
                ✓ Progress restored — continuing from Question 3
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Complete Card ─────────────────────────────────────────────────────────────

function CompleteCard({ score }: { score: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.25 }}
      className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-10 text-center shadow-[0_0_30px_rgba(16,185,129,0.08)]"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
        className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full border-2 border-emerald-500/40 bg-emerald-500/10"
      >
        <CheckCircle2 className="h-10 w-10 text-emerald-400" />
      </motion.div>
      <h3 className="mb-2 text-2xl font-black text-fg">Quiz Complete!</h3>
      <p className="mb-1 text-muted">
        Final Score:{" "}
        <span className="font-bold text-emerald-400">{score}/100</span>
      </p>
      <p className="text-sm text-muted">
        SCORM tracked every answer — even through the crash.
      </p>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2"
      >
        <span className="text-xs font-semibold text-emerald-400">
          Now scroll down to understand how SCORM works ↓
        </span>
      </motion.div>
    </motion.div>
  );
}

// ─── Scene 5: SCORM Flow ───────────────────────────────────────────────────────

function ScormFlowSection() {
  const triggers = [
    { emoji: "✏️", label: "Student answers" },
    { emoji: "✅", label: "Lesson completed" },
    { emoji: "⏸️", label: "Student pauses" },
    { emoji: "▶️", label: "Student resumes" },
  ];

  const packets = [
    { label: "Score", value: "80", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Lesson Status", value: "passed", color: "text-brand", bg: "bg-brand/10", border: "border-brand/20" },
    { label: "Completion", value: "100%", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
    { label: "Time Spent", value: "12 min", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { label: "Bookmark", value: "Q4", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
    { label: "Answers", value: "A, B, A, C", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  ];

  const nodes = [
    { label: "Student", emoji: "🎓", color: "text-brand", border: "border-brand/30", bg: "bg-brand/5" },
    { label: "SCORM Package", emoji: "📦", color: "text-violet-400", border: "border-violet-500/30", bg: "bg-violet-500/5" },
    { label: "LMS", emoji: "🏫", color: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/5" },
  ];

  return (
    <section className="rounded-2xl border border-border/70 bg-surface p-6">
      <div className="mb-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-brand">
          Scene 5 · How SCORM Works
        </p>
        <h2 className="text-xl font-bold text-fg">
          Data travels between Student, Package, and LMS
        </h2>
        <p className="mt-1.5 text-sm text-muted">
          Whenever a student interacts, SCORM sends data packets to the LMS in
          real-time.
        </p>
      </div>

      {/* Nodes */}
      <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-10">
        {nodes.map((node, i) => (
          <div key={node.label} className="flex items-center gap-4">
            {i > 0 && (
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.2 }}
                className="hidden sm:block"
              >
                <ArrowRight className="h-5 w-5 text-muted" />
              </motion.div>
            )}
            {i > 0 && (
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.2 }}
                className="text-muted text-lg sm:hidden"
              >
                ↓
              </motion.div>
            )}
            <motion.div
              whileHover={{ y: -4, scale: 1.04 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`flex flex-col items-center gap-2 rounded-2xl border p-5 text-center min-w-[100px] ${node.bg} ${node.border}`}
            >
              <span className="text-3xl">{node.emoji}</span>
              <span className={`text-xs font-bold ${node.color}`}>
                {node.label}
              </span>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Triggers */}
      <div className="mb-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
          When does SCORM send data?
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {triggers.map((t) => (
            <div
              key={t.label}
              className="flex items-center gap-2 rounded-xl border border-border bg-bg px-3 py-2.5"
            >
              <span className="text-lg">{t.emoji}</span>
              <span className="text-xs text-muted">{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Packets */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
          What&apos;s inside each packet?
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {packets.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              whileHover={{ y: -3 }}
              className={`rounded-xl border p-3.5 ${p.bg} ${p.border}`}
            >
              <p className="mb-1 text-[10px] text-muted uppercase tracking-wider">
                {p.label}
              </p>
              <p className={`text-xl font-black ${p.color}`}>{p.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Scene 6: Interactive Playground ──────────────────────────────────────────

function InteractivePlayground() {
  const initial = {
    lesson_status: "not_attempted",
    score: 0,
    bookmark: "—",
    time_spent: "0 min",
    completion: "0%",
  };
  type PlayData = typeof initial;

  const [data, setData] = useState<PlayData>(initial);
  const [qCount, setQCount] = useState(0);
  const [isClosed, setIsClosed] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const handleAnswer = () => {
    if (isClosed || data.lesson_status === "passed") return;
    const next = qCount + 1;
    setQCount(next);
    const score = Math.min(100, next * 20);
    setData({
      lesson_status: "incomplete",
      score,
      bookmark: `Q${next + 1}`,
      time_spent: `${next * 2} min`,
      completion: `${score}%`,
    });
    setLastAction("answer");
  };

  const handleFinish = () => {
    if (isClosed) return;
    setData({ lesson_status: "passed", score: 100, bookmark: "Complete", time_spent: "12 min", completion: "100%" });
    setLastAction("finish");
  };

  const handleClose = () => {
    if (isClosed) return;
    setIsClosed(true);
    setLastAction("close");
  };

  const handleResume = () => {
    if (!isClosed || isReconnecting) return;
    setIsReconnecting(true);
    setLastAction("resume");
    setTimeout(() => {
      setIsReconnecting(false);
      setIsClosed(false);
    }, 2400);
  };

  const handleReset = () => {
    setData(initial);
    setQCount(0);
    setIsClosed(false);
    setIsReconnecting(false);
    setLastAction(null);
  };

  const actions = [
    {
      id: "answer",
      emoji: "✏️",
      label: "Answer Question",
      desc: "Updates score, bookmark, and completion",
      border: "border-brand/30",
      bg: "bg-brand/5 hover:bg-brand/10",
      disabled: isClosed || data.lesson_status === "passed",
      onClick: handleAnswer,
    },
    {
      id: "finish",
      emoji: "✅",
      label: "Finish Lesson",
      desc: 'Sets lesson_status to "passed"',
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/5 hover:bg-emerald-500/10",
      disabled: isClosed,
      onClick: handleFinish,
    },
    {
      id: "close",
      emoji: "🔴",
      label: "Close Browser",
      desc: "Simulates accidental tab close",
      border: "border-rose-500/30",
      bg: "bg-rose-500/5 hover:bg-rose-500/10",
      disabled: isClosed,
      onClick: handleClose,
    },
    {
      id: "resume",
      emoji: "🔄",
      label: "Resume Session",
      desc: "Reconnects and restores from LMS",
      border: "border-violet-500/30",
      bg: "bg-violet-500/5 hover:bg-violet-500/10",
      disabled: !isClosed || isReconnecting,
      onClick: handleResume,
    },
  ];

  const statusColor: Record<string, string> = {
    "not_attempted": "text-muted",
    "incomplete": "text-amber-400",
    "passed": "text-emerald-400",
  };

  return (
    <section className="rounded-2xl border border-border/70 bg-surface p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-brand">
            Scene 6 · Interactive Playground
          </p>
          <h2 className="text-xl font-bold text-fg">Try it yourself</h2>
          <p className="mt-1.5 text-sm text-muted">
            Click the actions and watch the SCORM data update in real-time.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:text-fg"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </motion.button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Actions */}
        <div className="space-y-3">
          {actions.map((action) => (
            <motion.button
              key={action.id}
              whileHover={!action.disabled ? { scale: 1.01, x: 2 } : {}}
              whileTap={!action.disabled ? { scale: 0.99 } : {}}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all disabled:cursor-not-allowed disabled:opacity-40 ${action.border} ${action.bg}`}
            >
              <span className="text-xl shrink-0">{action.emoji}</span>
              <div>
                <p className="text-sm font-semibold text-fg">{action.label}</p>
                <p className="text-xs text-muted">{action.desc}</p>
              </div>
              {lastAction === action.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="ml-auto"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        {/* SCORM data display */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
            SCORM Data
          </p>

          <AnimatePresence mode="wait">
            {isReconnecting ? (
              <motion.div
                key="reconnecting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center rounded-2xl border border-brand/30 bg-brand/5 py-12"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                >
                  <RefreshCw className="h-8 w-8 text-brand" />
                </motion.div>
                <p className="mt-3 text-sm font-semibold text-brand">
                  Reconnecting to LMS...
                </p>
                <p className="mt-1 text-xs text-muted">Fetching saved progress</p>
              </motion.div>
            ) : isClosed ? (
              <motion.div
                key="closed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/5 py-12"
              >
                <WifiOff className="h-8 w-8 text-rose-400" />
                <p className="mt-3 text-sm font-semibold text-rose-400">
                  Browser closed
                </p>
                <p className="mt-1 text-xs text-muted">Data safely stored in LMS</p>
                <p className="mt-3 text-xs font-medium text-emerald-400">
                  → Click &quot;Resume Session&quot; to restore
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="data"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-border bg-bg"
              >
                {Object.entries(data).map(([key, value], i) => (
                  <motion.div
                    key={key}
                    animate={
                      lastAction
                        ? { backgroundColor: ["rgba(99,102,241,0)", "rgba(99,102,241,0.08)", "rgba(99,102,241,0)"] }
                        : {}
                    }
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className={`flex items-center justify-between px-4 py-3 ${
                      i < Object.keys(data).length - 1
                        ? "border-b border-border/50"
                        : ""
                    }`}
                  >
                    <span className="text-xs font-mono text-muted">{key}</span>
                    <span
                      className={`text-sm font-bold font-mono ${
                        key === "lesson_status"
                          ? statusColor[value as string] ?? "text-fg"
                          : Number(value) > 0 ||
                            (typeof value === "string" && value !== "—" && value !== "0%" && value !== "0 min" && value !== "0")
                          ? "text-fg"
                          : "text-muted"
                      }`}
                    >
                      {String(value)}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// ─── Scene 7: Real World Examples ─────────────────────────────────────────────

const REAL_WORLD = [
  {
    name: "Coursera",
    emoji: "🎓",
    description:
      "Uses SCORM to track video progress, quiz scores, and certificate completion across devices.",
    color: "border-blue-500/20 bg-blue-500/5",
    text: "text-blue-400",
  },
  {
    name: "Udemy",
    emoji: "📚",
    description:
      "Enterprise clients export SCORM packages so companies can host courses on their internal LMS.",
    color: "border-violet-500/20 bg-violet-500/5",
    text: "text-violet-400",
  },
  {
    name: "upGrad",
    emoji: "🚀",
    description:
      "SCORM powers upGrad&apos;s enterprise training — employers see completion rates and assessment scores.",
    color: "border-emerald-500/20 bg-emerald-500/5",
    text: "text-emerald-400",
  },
  {
    name: "Simplilearn",
    emoji: "🏆",
    description:
      "Certification courses track every milestone via SCORM to ensure compliance with training mandates.",
    color: "border-amber-500/20 bg-amber-500/5",
    text: "text-amber-400",
  },
  {
    name: "Moodle",
    emoji: "🏫",
    description:
      "The world&apos;s most popular open-source LMS — built with native SCORM 1.2 and SCORM 2004 support.",
    color: "border-rose-500/20 bg-rose-500/5",
    text: "text-rose-400",
  },
];

function RealWorldSection() {
  return (
    <section className="rounded-2xl border border-border/70 bg-surface p-6">
      <div className="mb-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-brand">
          Scene 7 · Real World
        </p>
        <h2 className="text-xl font-bold text-fg">
          Where you&apos;ve already used SCORM
        </h2>
        <p className="mt-1.5 text-sm text-muted">
          These platforms quietly rely on SCORM behind the scenes.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REAL_WORLD.map((ex, i) => (
          <motion.div
            key={ex.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            whileHover={{ y: -4 }}
            className={`rounded-xl border p-4 ${ex.color}`}
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="text-2xl">{ex.emoji}</span>
              <p className={`text-sm font-bold ${ex.text}`}>{ex.name}</p>
            </div>
            <p className="text-xs leading-relaxed text-muted">
              {ex.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Scene 8: PM Takeaways ─────────────────────────────────────────────────────

const TAKEAWAYS = [
  {
    emoji: "✅",
    label: "Reliability",
    body: "Learners never lose progress — even during crashes, poor connections, or accidental closes.",
    color: "text-emerald-400",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
  },
  {
    emoji: "✅",
    label: "Better User Experience",
    body: "Resuming from exactly where you left off builds trust and reduces frustration.",
    color: "text-brand",
    border: "border-brand/20",
    bg: "bg-brand/5",
  },
  {
    emoji: "✅",
    label: "Resume Learning",
    body: "Users can pause on mobile and continue on desktop — the LMS bridges the gap invisibly.",
    color: "text-violet-400",
    border: "border-violet-500/20",
    bg: "bg-violet-500/5",
  },
  {
    emoji: "✅",
    label: "Cross-device Continuity",
    body: "Score on laptop, continue on tablet — SCORM stores state server-side, not locally.",
    color: "text-cyan-400",
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/5",
  },
  {
    emoji: "✅",
    label: "Standardization",
    body: "Any SCORM-compliant course works on any SCORM-compliant LMS — like USB for e-learning.",
    color: "text-amber-400",
    border: "border-amber-500/20",
    bg: "bg-amber-500/5",
  },
];

function PmTakeawaysSection() {
  return (
    <section className="rounded-2xl border border-border/70 bg-surface p-6">
      <div className="mb-6 text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-brand">
          Scene 8 · Product Manager Takeaway
        </p>
        <h2 className="text-2xl font-bold text-fg">Why SCORM matters to PMs</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
          Understanding SCORM helps you make better decisions about LMS
          integrations, content packaging, and learner experience design.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TAKEAWAYS.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            whileHover={{ y: -4 }}
            className={`rounded-xl border p-4 ${t.bg} ${t.border}`}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg">{t.emoji}</span>
              <p className={`text-sm font-bold ${t.color}`}>{t.label}</p>
            </div>
            <p className="text-xs leading-relaxed text-muted">{t.body}</p>
          </motion.div>
        ))}
      </div>

      {/* Final callout */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-6 rounded-2xl border border-brand/25 bg-gradient-to-br from-brand/10 via-violet-500/5 to-transparent p-8 text-center"
      >
        <div className="mb-3 text-5xl">🏆</div>
        <p className="text-xl font-black text-fg">
          Now you understand{" "}
          <span className="bg-gradient-to-r from-brand via-violet-400 to-cyan-400 bg-clip-text text-transparent">
            SCORM
          </span>{" "}
          without reading docs.
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted">
          Every quiz you&apos;ve ever resumed — Coursera, Udemy, upGrad — was
          powered by this exact standard. You just experienced it.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/domain-knowledge/edtech"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-muted transition-colors hover:text-fg"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to EdTech
          </Link>
          <Link
            href="/domain-knowledge"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-muted transition-colors hover:text-fg"
          >
            All Domains
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ScormPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [highlight, setHighlight] = useState<string[]>([]);
  const [restored, setRestored] = useState(false);
  const [scormData, setScormData] = useState<ScormState>({
    lesson_status: "not_attempted",
    score: 0,
    location: "",
    time_spent: 0,
    completion: 0,
    suspend_data: "",
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clock tick
  useEffect(() => {
    if (phase === "quiz") {
      timerRef.current = setInterval(() => {
        setScormData((prev) => ({ ...prev, time_spent: prev.time_spent + 1 }));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const flash = (keys: string[]) => {
    setHighlight(keys);
    setTimeout(() => setHighlight([]), 1600);
  };

  const handleStart = () => {
    setPhase("quiz");
    setScormData((prev) => ({
      ...prev,
      lesson_status: "incomplete",
      location: "Q1",
      suspend_data: '{"started":true}',
    }));
    flash(["lesson_status", "location", "suspend_data"]);
  };

  const handleAnswer = useCallback(
    (answer: string) => {
      const newAnswers = { ...answers, [currentQ]: answer };
      setAnswers(newAnswers);

      const correctCount = Object.entries(newAnswers).filter(
        ([qi, a]) => QUESTIONS[Number(qi)]?.correct === a
      ).length;
      const newScore = Math.round((correctCount / QUESTIONS.length) * 100);
      const nextQ = currentQ + 1;
      const newCompletion = Math.round((nextQ / QUESTIONS.length) * 100);

      if (currentQ < QUESTIONS.length - 1) {
        setScormData((prev) => ({
          ...prev,
          score: newScore,
          location: `Q${nextQ + 1}`,
          completion: newCompletion,
          suspend_data: JSON.stringify({ q: nextQ, answers: newAnswers }),
        }));
        flash(["score", "location", "completion", "suspend_data"]);

        if (currentQ === 1) {
          // After Q2 → trigger crash
          setTimeout(() => setPhase("crashed"), 1200);
        } else {
          setCurrentQ(nextQ);
        }
      } else {
        // Q3 done → complete
        setScormData((prev) => ({
          ...prev,
          score: newScore,
          location: "Complete",
          completion: 100,
          lesson_status: "passed",
          suspend_data: JSON.stringify({ answers: newAnswers }),
        }));
        flash(["score", "location", "completion", "lesson_status"]);
        setPhase("complete");
      }
    },
    [answers, currentQ]
  );

  const handleContinueLater = () => setPhase("reconnecting");

  const handleReconnectDone = useCallback(() => {
    setCurrentQ(2);
    setRestored(true);
    setPhase("quiz");
    flash(["location", "suspend_data", "score"]);
    setTimeout(() => setRestored(false), 8000);
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      {/* ── Scene 1: Hero ── */}
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

        <div className="relative mx-auto max-w-5xl px-5 py-6">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              href="/domain-knowledge/edtech"
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
            >
              <ArrowLeft className="h-4 w-4" />
              EdTech Concepts
            </Link>
          </motion.div>
        </div>

        <div className="relative mx-auto max-w-4xl px-5 pb-24 pt-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5"
          >
            <BookOpen className="h-3.5 w-3.5 text-brand" />
            <span className="text-xs font-semibold text-brand tracking-wide">
              EdTech Simulation · SCORM
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-4xl font-black tracking-tight text-fg md:text-5xl lg:text-6xl leading-tight"
          >
            Ever wondered how platforms{" "}
            <span className="bg-gradient-to-r from-brand via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              remember your quiz progress
            </span>{" "}
            after you close the tab?
          </motion.h1>

          {/* Student illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10 flex flex-wrap justify-center gap-3 sm:gap-6"
          >
            {[
              { emoji: "🎓", label: "Student", color: "border-brand/30 bg-brand/5" },
              { emoji: "📋", label: "Quiz", color: "border-violet-500/30 bg-violet-500/5", arrow: true },
              { emoji: "📦", label: "SCORM", color: "border-cyan-500/30 bg-cyan-500/5", arrow: true },
              { emoji: "🏫", label: "LMS", color: "border-emerald-500/30 bg-emerald-500/5", arrow: true },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center gap-3">
                {item.arrow && (
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.15 }}
                  >
                    <ArrowRight className="h-5 w-5 text-muted" />
                  </motion.div>
                )}
                <div
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border px-4 py-3 ${item.color}`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-[11px] font-semibold text-muted">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            {phase === "intro" ? (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStart}
                className="inline-flex items-center gap-2.5 rounded-xl bg-brand px-8 py-4 text-base font-bold text-white shadow-glow transition-shadow hover:shadow-[0_0_36px_rgba(99,102,241,0.55)]"
              >
                <Play className="h-5 w-5" />
                Start Quiz
              </motion.button>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-400">
                  SCORM tracking active
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Scene 2: Quiz ── */}
      <AnimatePresence>
        {phase !== "intro" && (
          <motion.section
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-5xl px-5 py-12"
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand">
                Scene 2
              </span>
              <div className="h-px flex-1 bg-border/50" />
              <span className="text-xs text-muted">
                Watch SCORM update every answer →
              </span>
            </div>

            {phase === "complete" ? (
              <CompleteCard score={scormData.score} />
            ) : (
              <QuizSection
                currentQ={currentQ}
                restored={restored}
                onAnswer={handleAnswer}
                scormData={scormData}
                highlight={highlight}
              />
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Scenes 5–8: Only revealed after quiz is complete ── */}
      <AnimatePresence>
        {phase === "complete" && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto max-w-5xl space-y-8 px-5 pb-24 pt-2"
          >
            <ScormFlowSection />
            <InteractivePlayground />
            <RealWorldSection />
            <PmTakeawaysSection />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Crash Overlay ── */}
      <AnimatePresence>
        {phase === "crashed" && (
          <CrashOverlay onContinue={handleContinueLater} />
        )}
      </AnimatePresence>

      {/* ── Reconnect Overlay ── */}
      <AnimatePresence>
        {phase === "reconnecting" && (
          <ReconnectScreen onDone={handleReconnectDone} />
        )}
      </AnimatePresence>
    </div>
  );
}
