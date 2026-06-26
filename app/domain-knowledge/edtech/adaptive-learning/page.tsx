"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  CheckCircle,
  XCircle,
  RotateCcw,
  BookOpen,
  Clock,
  Star,
  Activity,
  GitBranch,
  Cpu,
  Gauge,
  Lightbulb,
  ChevronDown,
  ChevronRight,
  Play,
  SkipForward,
  AlertCircle,
  RefreshCw,
  MessageCircle,
  Database,
  Layers,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Phase = "intro" | "timeline" | "quiz" | "analyzing" | "split" | "explore";
type StudentAnswer = string | null;

// ─── Data ────────────────────────────────────────────────────────────────────

const QUIZ_QUESTION = {
  text: "What is an API?",
  hint: "Pick an answer for each learner — they can be different.",
  options: [
    { id: "a", label: "A user interface for apps", correct: false },
    {
      id: "b",
      label: "A bridge that lets systems talk to each other",
      correct: true,
    },
    { id: "c", label: "A type of database", correct: false },
    { id: "d", label: "A programming language", correct: false },
  ],
};

const ENGINE_INPUTS = [
  { label: "Quiz Score", icon: BarChart3, color: "text-rose-400", delay: 0 },
  { label: "Time Taken", icon: Clock, color: "text-amber-400", delay: 0.4 },
  {
    label: "Confidence",
    icon: Gauge,
    color: "text-emerald-400",
    delay: 0.8,
  },
  { label: "Attempts", icon: RotateCcw, color: "text-violet-400", delay: 1.2 },
  {
    label: "Past Performance",
    icon: TrendingUp,
    color: "text-cyan-400",
    delay: 1.6,
  },
  { label: "Learning Speed", icon: Zap, color: "text-brand", delay: 2.0 },
];

const PRODUCTS = [
  {
    name: "Khan Academy",
    emoji: "🟢",
    tag: "Mastery Progression",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    summary: "Adjusts practice difficulty",
    detail:
      "Uses mastery-based progression — you don't advance until you hit 70%+ on 5 consecutive problems. Wrong answers loop you back with scaffolded hints.",
  },
  {
    name: "Duolingo",
    emoji: "🦉",
    tag: "Spaced Repetition",
    color: "text-lime-400",
    bg: "bg-lime-500/10",
    border: "border-lime-500/20",
    summary: "Repeats weak concepts",
    detail:
      "Tracks every mistake and uses a spaced repetition algorithm to resurface content at optimal intervals — maximizing memory retention over time.",
  },
  {
    name: "Coursera",
    emoji: "🎓",
    tag: "Personalized Recs",
    color: "text-brand",
    bg: "bg-brand/10",
    border: "border-brand/20",
    summary: "Personalized recommendations",
    detail:
      "Analyzes completion rates, video replay patterns, and quiz scores to surface the most relevant follow-up content for each learner.",
  },
  {
    name: "DreamBox",
    emoji: "📐",
    tag: "Micro-Adaptations",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    summary: "Math adapts continuously",
    detail:
      "Makes 48,000+ micro-adaptations per student per session — adjusting problem type, difficulty, scaffolding, and pacing in real time.",
  },
  {
    name: "upGrad",
    emoji: "🚀",
    tag: "Future Opportunity",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    summary: "Adaptive cohorts ahead",
    detail:
      "Potential to group learners with similar weak areas for targeted live sessions, personalized revision paths, and AI-driven mentor recommendations.",
  },
];

const INSIGHTS = [
  {
    emoji: "🎯",
    title: "Personalization",
    body: "Every learner is different. Adaptive systems treat them that way.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
  {
    emoji: "📈",
    title: "Better Outcomes",
    body: "Optimize for mastery, not completion rates.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    emoji: "⚡",
    title: "Dynamic Content",
    body: "Content changes automatically based on behavior.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    emoji: "😊",
    title: "Better Engagement",
    body: "Learners don't feel bored or overwhelmed.",
    color: "text-brand",
    bg: "bg-brand/10",
    border: "border-brand/20",
  },
  {
    emoji: "🧠",
    title: "Data-Driven",
    body: "Every interaction improves future recommendations.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
];

const PLAYGROUND_ACTIONS = [
  {
    id: "correct",
    label: "Answer Correctly",
    icon: CheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    hoverBorder: "hover:border-emerald-500/60",
    effect: { mastery: 8, confidence: 6, difficulty: 1 },
    outcome: "System advances you to a harder topic.",
  },
  {
    id: "incorrect",
    label: "Answer Incorrectly",
    icon: XCircle,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    hoverBorder: "hover:border-rose-500/60",
    effect: { mastery: -4, confidence: -5, difficulty: -1 },
    outcome: "Extra examples and a simpler explanation queued.",
  },
  {
    id: "skip",
    label: "Skip Lesson",
    icon: SkipForward,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    hoverBorder: "hover:border-amber-500/60",
    effect: { mastery: -2, confidence: -3, difficulty: 0 },
    outcome: "Gap detected. System schedules revision later.",
  },
  {
    id: "slower",
    label: "Take Longer",
    icon: Clock,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    hoverBorder: "hover:border-violet-500/60",
    effect: { mastery: 2, confidence: -2, difficulty: 0 },
    outcome: "Shorter videos and simpler explanations recommended.",
  },
  {
    id: "faster",
    label: "Finish Quickly",
    icon: Zap,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    hoverBorder: "hover:border-cyan-500/60",
    effect: { mastery: 5, confidence: 8, difficulty: 2 },
    outcome: "Advanced content unlocked. Practice steps skipped.",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

function SceneLabel({ n, title }: { n: number; title: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="mb-3 text-xs font-semibold uppercase tracking-widest text-rose-400"
    >
      Scene {n} · {title}
    </motion.p>
  );
}

// ─── Scene 4 Overlay: Adaptive Engine ────────────────────────────────────────

function AdaptiveEngineOverlay({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    ENGINE_INPUTS.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i + 1), 500 + i * 420));
    });
    timers.push(
      setTimeout(onDone, 500 + ENGINE_INPUTS.length * 420 + 900)
    );
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/95 backdrop-blur-lg"
    >
      <div className="mx-auto w-full max-w-lg px-5">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-rose-400"
        >
          Scene 4 · Adaptive Engine
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 text-center text-2xl font-black text-fg"
        >
          Analyzing Performance…
        </motion.h2>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {ENGINE_INPUTS.map((inp, i) => {
            const Icon = inp.icon;
            const active = step > i;
            return (
              <motion.div
                key={inp.label}
                initial={{ opacity: 0.2 }}
                animate={active ? { opacity: 1 } : { opacity: 0.2 }}
                transition={{ duration: 0.35 }}
                className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 transition-colors ${
                  active
                    ? "border-rose-500/40 bg-rose-500/10"
                    : "border-border/50 bg-surface"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${active ? inp.color : "text-muted"}`}
                />
                <span
                  className={`text-sm font-medium ${active ? "text-fg" : "text-muted"}`}
                >
                  {inp.label}
                </span>
                {active && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto"
                  >
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={
              reduce
                ? {}
                : {
                    boxShadow: [
                      "0 0 0 0px rgba(244,63,94,0.4)",
                      "0 0 0 16px rgba(244,63,94,0)",
                    ],
                  }
            }
            transition={{ repeat: Infinity, duration: 1.6 }}
            className="flex h-16 w-16 items-center justify-center rounded-full border border-rose-500/50 bg-rose-500/20"
          >
            <Brain className="h-8 w-8 text-rose-400" />
          </motion.div>

          <AnimatePresence>
            {step >= ENGINE_INPUTS.length && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-semibold text-rose-400"
              >
                Personalizing learning paths…
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Scene 5 Overlay: Path Split ─────────────────────────────────────────────

function PathSplitOverlay({
  answerA,
  answerB,
  onDone,
}: {
  answerA: StudentAnswer;
  answerB: StudentAnswer;
  onDone: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const aCorrect =
    QUIZ_QUESTION.options.find((o) => o.id === answerA)?.correct ?? false;
  const bCorrect =
    QUIZ_QUESTION.options.find((o) => o.id === answerB)?.correct ?? false;

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 400);
    return () => clearTimeout(t);
  }, []);

  const pathA = aCorrect
    ? [
        { label: "✅ Correct Answer", cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
        { label: "Advanced Topic", cls: "border-brand/30 bg-brand/10 text-brand" },
        { label: "Skip Practice", cls: "border-amber-500/30 bg-amber-500/10 text-amber-400" },
        { label: "→ Next Module", cls: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 font-semibold" },
      ]
    : [
        { label: "❌ Incorrect", cls: "border-rose-500/30 bg-rose-500/10 text-rose-400" },
        { label: "Explanation", cls: "border-violet-500/30 bg-violet-500/10 text-violet-400" },
        { label: "Interactive Example", cls: "border-brand/30 bg-brand/10 text-brand" },
        { label: "Practice Quiz", cls: "border-amber-500/30 bg-amber-500/10 text-amber-400" },
        { label: "Retry → Next Module", cls: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 font-semibold" },
      ];

  const pathB = bCorrect
    ? [
        { label: "✅ Correct Answer", cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
        { label: "Advanced Topic", cls: "border-brand/30 bg-brand/10 text-brand" },
        { label: "Skip Practice", cls: "border-amber-500/30 bg-amber-500/10 text-amber-400" },
        { label: "→ Next Module", cls: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 font-semibold" },
      ]
    : [
        { label: "❌ Incorrect", cls: "border-rose-500/30 bg-rose-500/10 text-rose-400" },
        { label: "Explanation", cls: "border-violet-500/30 bg-violet-500/10 text-violet-400" },
        { label: "Interactive Example", cls: "border-brand/30 bg-brand/10 text-brand" },
        { label: "Practice Quiz", cls: "border-amber-500/30 bg-amber-500/10 text-amber-400" },
        { label: "Retry → Next Module", cls: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 font-semibold" },
      ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-bg/95 backdrop-blur-lg"
    >
      <div className="mx-auto w-full max-w-2xl px-5 py-10">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-rose-400"
        >
          Scene 5 · Learning Paths Split
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 text-center text-2xl font-black text-fg"
        >
          Same course. Different journeys.
        </motion.h2>

        <div className="grid grid-cols-2 gap-5">
          {[
            { emoji: "👨", name: "Student A", tag: "Quick learner", tagColor: "text-emerald-400", path: pathA },
            { emoji: "👩", name: "Student B", tag: "Needs more practice", tagColor: "text-rose-400", path: pathB },
          ].map((student, si) => (
            <div key={si}>
              <div className="mb-4 flex items-center gap-2">
                <span className="text-2xl">{student.emoji}</span>
                <div>
                  <p className="font-bold text-fg text-sm">{student.name}</p>
                  <p className={`text-xs ${student.tagColor}`}>{student.tag}</p>
                </div>
              </div>
              <div className="space-y-2">
                {student.path.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: si === 0 ? -16 : 16 }}
                    animate={revealed ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.1 + i * 0.15 }}
                    className={`rounded-xl border px-4 py-2.5 text-sm ${step.cls}`}
                  >
                    {step.label}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={revealed ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.4 }}
          className="mt-10 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onDone}
            className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/30"
          >
            Explore the Full System
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Learning Map Tree (Scene 7) ──────────────────────────────────────────────

function LearningMapTree({ accuracy }: { accuracy: number }) {
  const goAdvanced = accuracy >= 70;

  const Node = ({
    label,
    color,
    active,
    delay = 0,
  }: {
    label: string;
    color: string;
    active?: boolean;
    delay?: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className={`rounded-xl border px-4 py-2.5 text-center text-sm font-semibold transition-all ${
        active
          ? `${color} ring-2 ring-current ring-offset-2 ring-offset-bg`
          : "border-border/50 bg-surface text-muted"
      }`}
    >
      {label}
    </motion.div>
  );

  const Arrow = ({ delay = 0 }: { delay?: number }) => (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      whileInView={{ opacity: 1, scaleY: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      className="flex justify-center"
    >
      <div className="h-6 w-px bg-border/60" />
    </motion.div>
  );

  return (
    <div className="mx-auto max-w-sm">
      <div className="space-y-1">
        <Node label="Video 1 — API Basics" color="border-brand/40 bg-brand/10 text-brand" active delay={0} />
        <Arrow delay={0.1} />
        <Node label="Quick Quiz" color="border-amber-500/40 bg-amber-500/10 text-amber-400" active delay={0.2} />
        <Arrow delay={0.3} />

        {/* Decision fork */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-3"
        >
          <div className="space-y-1">
            <div className="text-center text-xs text-emerald-400 font-semibold mb-1">✅ Correct</div>
            <Node
              label="Advanced Topic"
              color="border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
              active={goAdvanced}
              delay={0.5}
            />
          </div>
          <div className="space-y-1">
            <div className="text-center text-xs text-rose-400 font-semibold mb-1">❌ Incorrect</div>
            <Node
              label="Practice Examples"
              color="border-rose-500/40 bg-rose-500/10 text-rose-400"
              active={!goAdvanced}
              delay={0.5}
            />
          </div>
        </motion.div>

        <Arrow delay={0.6} />
        <Node label="Quiz Check" color="border-violet-500/40 bg-violet-500/10 text-violet-400" active delay={0.7} />
        <Arrow delay={0.8} />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-2 gap-3"
        >
          <div className="space-y-1">
            <div className="text-center text-xs text-emerald-400 font-semibold mb-1">✅ Passed</div>
            <Node
              label="Final Module"
              color="border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
              active={goAdvanced}
              delay={1.0}
            />
          </div>
          <div className="space-y-1">
            <div className="text-center text-xs text-amber-400 font-semibold mb-1">⚠️ Needs Work</div>
            <Node
              label="More Examples"
              color="border-amber-500/40 bg-amber-500/10 text-amber-400"
              active={!goAdvanced}
              delay={1.0}
            />
          </div>
        </motion.div>

        <Arrow delay={1.1} />
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
          className={`rounded-xl border-2 px-4 py-3 text-center text-sm font-bold ${
            goAdvanced
              ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300"
              : "border-brand/60 bg-brand/15 text-brand"
          }`}
        >
          🎓 Mastery Achieved
        </motion.div>
      </div>
    </div>
  );
}

// ─── Mastery Dashboard (Scene 9) ─────────────────────────────────────────────

function MasteryDashboard({
  mastery,
  confidence,
}: {
  mastery: number;
  confidence: number;
}) {
  const weakTopics = mastery < 60 ? ["Authentication", "Caching"] : mastery < 80 ? ["Caching"] : [];
  const nextRec = mastery < 50 ? "Beginner API Quiz" : mastery < 75 ? "API Practice Quiz" : "Advanced API Design";

  return (
    <div className="rounded-2xl border border-border/50 bg-surface p-6 shadow-soft">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10">
          <Activity className="h-4 w-4 text-rose-400" />
        </div>
        <p className="font-bold text-fg text-sm">Adaptive Dashboard</p>
      </div>

      <div className="space-y-5">
        {[
          { label: "Confidence", value: confidence, color: "bg-brand" },
          { label: "Mastery", value: mastery, color: "bg-emerald-500" },
        ].map((m) => (
          <div key={m.label}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm text-muted">{m.label}</span>
              <span className="text-sm font-bold text-fg">{m.value}%</span>
            </div>
            <div className="h-2 rounded-full bg-elevated overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${m.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${m.value}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}

        {weakTopics.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold text-muted uppercase tracking-wide">Weak Topics</p>
            <div className="flex flex-wrap gap-2">
              {weakTopics.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-400"
                >
                  <AlertCircle className="h-3 w-3" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-xl border border-brand/30 bg-brand/10 px-4 py-3">
          <p className="text-xs font-semibold text-brand uppercase tracking-wide mb-1">
            Recommended Next
          </p>
          <p className="text-sm font-bold text-fg">{nextRec}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdaptiveLearningPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answerA, setAnswerA] = useState<StudentAnswer>(null);
  const [answerB, setAnswerB] = useState<StudentAnswer>(null);
  const [quizStep, setQuizStep] = useState<"A" | "B" | "done">("A");

  // Interactive controls
  const [speed, setSpeed] = useState(50);
  const [accuracy, setAccuracy] = useState(60);
  const [needsRevision, setNeedsRevision] = useState(false);
  const [knowledgeLevel, setKnowledgeLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");

  // Playground state
  const [mastery, setMastery] = useState(40);
  const [confidence, setConfidence] = useState(50);
  const [difficulty, setDifficulty] = useState(1);
  const [lastOutcome, setLastOutcome] = useState<string | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  // Real-time adaptation state
  const [rtStep, setRtStep] = useState(0);
  const [rtRunning, setRtRunning] = useState(false);
  const rtRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();
  const exploreSectionRef = useRef<HTMLDivElement>(null);

  const RT_STEPS = [
    { label: "Learner misses Question 1", icon: XCircle, color: "text-rose-400" },
    { label: "Learner misses Question 2", icon: XCircle, color: "text-rose-400" },
    { label: "System detected learning gap.", icon: AlertCircle, color: "text-amber-400" },
    { label: "Additional Example Added", icon: Lightbulb, color: "text-brand" },
    { label: "Shorter Video Recommended", icon: Play, color: "text-violet-400" },
    { label: "Simpler Explanation", icon: MessageCircle, color: "text-cyan-400" },
    { label: "Mini Quiz Delivered", icon: CheckCircle, color: "text-emerald-400" },
  ];

  const startRealTimeAdaptation = useCallback(() => {
    setRtStep(0);
    setRtRunning(true);
    let i = 0;
    const tick = () => {
      i++;
      setRtStep(i);
      if (i < RT_STEPS.length) {
        rtRef.current = setTimeout(tick, 900);
      } else {
        setRtRunning(false);
      }
    };
    rtRef.current = setTimeout(tick, 800);
  }, []);

  useEffect(() => () => { if (rtRef.current) clearTimeout(rtRef.current); }, []);

  const handlePlaygroundAction = useCallback(
    (action: typeof PLAYGROUND_ACTIONS[0]) => {
      setMastery((p) => clamp(p + action.effect.mastery, 0, 100));
      setConfidence((p) => clamp(p + action.effect.confidence, 0, 100));
      setDifficulty((p) => clamp(p + action.effect.difficulty, 1, 5));
      setLastOutcome(action.outcome);
    },
    []
  );

  const handleQuizAnswer = useCallback(
    (optionId: string) => {
      if (quizStep === "A") {
        setAnswerA(optionId);
        setQuizStep("B");
      } else if (quizStep === "B") {
        setAnswerB(optionId);
        setQuizStep("done");
      }
    },
    [quizStep]
  );

  const handleStartAnalyzing = useCallback(() => {
    setPhase("analyzing");
  }, []);

  const handleAnalysisDone = useCallback(() => {
    setPhase("split");
  }, []);

  const handleSplitDone = useCallback(() => {
    setPhase("explore");
    setTimeout(() => {
      exploreSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, []);

  // Derive recommended path from controls
  const recommendedPath = (() => {
    if (knowledgeLevel === "Advanced" || accuracy >= 80) {
      return ["Skip Basics", "Advanced Deep-Dive", "Challenge Quiz", "Final Module"];
    }
    if (needsRevision || accuracy < 40) {
      return ["Revision Module", "Slow-Paced Video", "Practice Examples", "Quiz", "Retry Loop", "Next Module"];
    }
    if (knowledgeLevel === "Intermediate" || accuracy >= 60) {
      return ["Quick Overview", "Core Concept", "Quiz", "Practice", "Next Module"];
    }
    return ["Intro Video", "Simple Examples", "Guided Quiz", "Practice", "Next Module"];
  })();

  const difficultyLabel = ["", "Beginner", "Elementary", "Intermediate", "Advanced", "Expert"][difficulty] ?? "Intermediate";

  return (
    <div className="min-h-screen bg-bg">
      {/* ─── Scene 1: Hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border/50 bg-bg">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(244,63,94,0.08) 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/12 blur-[140px]" />

        <div className="relative mx-auto max-w-4xl px-5 py-16">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/domain-knowledge/edtech"
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
            >
              <ArrowLeft className="h-4 w-4" />
              EdTech Concepts
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1"
          >
            <Brain className="h-3.5 w-3.5 text-rose-400" />
            <span className="text-xs font-semibold text-rose-400 tracking-wide">
              Adaptive Learning
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mb-4 text-4xl font-black tracking-tight text-fg md:text-5xl leading-tight"
          >
            What if the course changed
            <br />
            <span className="text-rose-400">based on how YOU learn?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-10 max-w-lg text-[15px] text-muted leading-relaxed"
          >
            Let's compare two learners taking the same course — and watch the
            system give them completely different paths.
          </motion.p>

          {/* Learner Cards */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-md"
          >
            {[
              {
                emoji: "👨",
                name: "Student A",
                tag: "Quick learner",
                color: "border-emerald-500/30 bg-emerald-500/8",
                tagColor: "text-emerald-400",
                dot: "bg-emerald-400",
              },
              {
                emoji: "👩",
                name: "Student B",
                tag: "Needs more practice",
                color: "border-rose-500/30 bg-rose-500/8",
                tagColor: "text-rose-400",
                dot: "bg-rose-400",
              },
            ].map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={`flex items-center gap-3 rounded-2xl border p-4 ${s.color}`}
              >
                <span className="text-3xl">{s.emoji}</span>
                <div>
                  <p className="font-bold text-fg text-sm">{s.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                    <span className={`text-xs ${s.tagColor}`}>{s.tag}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setPhase("timeline")}
              className="inline-flex items-center gap-2.5 rounded-full bg-rose-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-500/30 transition-shadow hover:shadow-xl hover:shadow-rose-500/40"
            >
              <Play className="h-4 w-4" />
              Start Learning Journey
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ─── Scene 2: Same Starting Point ──────────────────────── */}
      <AnimatePresence>
        {(phase === "timeline" || phase === "quiz") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-bg/95 backdrop-blur-lg"
          >
            {phase === "timeline" && (
              <div className="mx-auto w-full max-w-lg px-5 py-10">
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-rose-400"
                >
                  Scene 2 · Same Starting Point
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-2 text-center text-2xl font-black text-fg"
                >
                  Both students. Same course.
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8 text-center text-sm text-muted"
                >
                  API Fundamentals — everyone starts here.
                </motion.p>

                <div className="space-y-2 mb-8">
                  {[
                    { label: "Module 1 — REST API Basics", done: true },
                    { label: "Module 2 — HTTP Methods", done: true },
                    { label: "Quiz ← You are here", done: false, active: true },
                    { label: "Module 3 — Authentication", done: false },
                    { label: "Final Assessment", done: false },
                  ].map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                        step.active
                          ? "border-rose-500/40 bg-rose-500/10 text-rose-400 font-semibold"
                          : step.done
                          ? "border-emerald-500/30 bg-emerald-500/8 text-muted"
                          : "border-border/50 bg-surface text-muted"
                      }`}
                    >
                      {step.done ? (
                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                      ) : step.active ? (
                        <motion.div
                          animate={reduce ? {} : { scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1.2 }}
                        >
                          <Star className="h-4 w-4 text-rose-400 shrink-0" />
                        </motion.div>
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-border/60 shrink-0" />
                      )}
                      {step.label}
                    </motion.div>
                  ))}
                </div>

                <div className="flex items-center gap-3 mb-8">
                  {["👨 Student A", "👩 Student B"].map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className="flex-1 rounded-xl border border-border/50 bg-surface px-4 py-2.5 text-center text-sm font-medium text-fg"
                    >
                      {s}
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="text-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setPhase("quiz")}
                    className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/30"
                  >
                    Take the Quiz
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              </div>
            )}

            {phase === "quiz" && (
              <div className="mx-auto w-full max-w-xl px-5 py-10">
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-rose-400"
                >
                  Scene 3 · First Quiz
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-2 text-center text-2xl font-black text-fg"
                >
                  {QUIZ_QUESTION.text}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="mb-6 text-center text-sm text-muted"
                >
                  {quizStep === "done"
                    ? "Both answered. Let the adaptive engine analyze."
                    : quizStep === "A"
                    ? "Pick an answer for 👨 Student A"
                    : "Now pick an answer for 👩 Student B"}
                </motion.p>

                {/* Student indicator */}
                <div className="mb-5 flex items-center gap-3">
                  {[
                    { id: "A" as const, emoji: "👨", label: "Student A", done: answerA !== null },
                    { id: "B" as const, emoji: "👩", label: "Student B", done: answerB !== null },
                  ].map((s) => (
                    <div
                      key={s.id}
                      className={`flex flex-1 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-all ${
                        quizStep === s.id
                          ? "border-rose-500/50 bg-rose-500/10 text-rose-400 font-semibold"
                          : s.done
                          ? "border-emerald-500/30 bg-emerald-500/8 text-emerald-400"
                          : "border-border/50 bg-surface text-muted"
                      }`}
                    >
                      <span>{s.emoji}</span>
                      <span>{s.label}</span>
                      {s.done && <CheckCircle className="ml-auto h-4 w-4 text-emerald-400" />}
                    </div>
                  ))}
                </div>

                {/* Options */}
                <div className="space-y-2.5 mb-6">
                  {QUIZ_QUESTION.options.map((opt, i) => {
                    const picked =
                      (quizStep === "A" || quizStep === "done") && answerA === opt.id
                        ? "A"
                        : (quizStep === "B" || quizStep === "done") && answerB === opt.id
                        ? "B"
                        : null;
                    const disabled = quizStep === "done";

                    return (
                      <motion.button
                        key={opt.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.08 }}
                        whileHover={disabled ? {} : { x: 4 }}
                        whileTap={disabled ? {} : { scale: 0.98 }}
                        disabled={disabled}
                        onClick={() => handleQuizAnswer(opt.id)}
                        className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all ${
                          picked
                            ? "border-rose-500/40 bg-rose-500/10 text-fg"
                            : disabled
                            ? "border-border/40 bg-surface/60 text-muted cursor-not-allowed"
                            : "border-border/50 bg-surface text-fg hover:border-rose-500/30 hover:bg-rose-500/5 cursor-pointer"
                        }`}
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold">
                          {opt.id.toUpperCase()}
                        </span>
                        <span className="flex-1">{opt.label}</span>
                        {picked && (
                          <span className="text-xs font-semibold text-rose-400">
                            {picked === "A" ? "👨 A" : "👩 B"}
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Results after both answered */}
                <AnimatePresence>
                  {quizStep === "done" && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3 mb-6"
                    >
                      {[
                        { emoji: "👨", name: "Student A", answer: answerA },
                        { emoji: "👩", name: "Student B", answer: answerB },
                      ].map((s) => {
                        const opt = QUIZ_QUESTION.options.find((o) => o.id === s.answer);
                        const correct = opt?.correct ?? false;
                        return (
                          <motion.div
                            key={s.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                              correct
                                ? "border-emerald-500/30 bg-emerald-500/10"
                                : "border-rose-500/30 bg-rose-500/10"
                            }`}
                          >
                            <span className="text-xl">{s.emoji}</span>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-fg">{s.name}</p>
                              <p className="text-xs text-muted">{opt?.label}</p>
                            </div>
                            {correct ? (
                              <CheckCircle className="h-5 w-5 text-emerald-400" />
                            ) : (
                              <XCircle className="h-5 w-5 text-rose-400" />
                            )}
                          </motion.div>
                        );
                      })}

                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-center pt-2"
                      >
                        <motion.button
                          whileHover={{ scale: 1.04, y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={handleStartAnalyzing}
                          className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/30"
                        >
                          <Cpu className="h-4 w-4" />
                          Analyze with Adaptive Engine
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Scene 4: Adaptive Engine Overlay ──────────────────── */}
      <AnimatePresence>
        {phase === "analyzing" && (
          <AdaptiveEngineOverlay onDone={handleAnalysisDone} />
        )}
      </AnimatePresence>

      {/* ─── Scene 5: Path Split Overlay ───────────────────────── */}
      <AnimatePresence>
        {phase === "split" && (
          <PathSplitOverlay
            answerA={answerA}
            answerB={answerB}
            onDone={handleSplitDone}
          />
        )}
      </AnimatePresence>

      {/* ─── Scenes 6–15: Scrollable Educational Content ────────── */}
      <div ref={exploreSectionRef} className="mx-auto max-w-4xl space-y-20 px-5 py-20">
        {/* Scene 6: Interactive Controls */}
        <section>
          <SceneLabel n={6} title="Interactive Controls" />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-2 text-2xl font-black text-fg"
          >
            Tune the learner. Watch the path change.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-8 text-sm text-muted"
          >
            Every control instantly updates the recommended learning path below.
          </motion.p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Controls panel */}
            <div className="rounded-2xl border border-border/50 bg-surface p-6 shadow-soft space-y-6">
              {/* Learning Speed */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-fg">
                    Learning Speed
                  </label>
                  <span className="text-xs text-muted">
                    {speed < 33 ? "Slow" : speed < 66 ? "Moderate" : "Fast"}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
                <div className="flex justify-between text-xs text-muted mt-1">
                  <span>Slow</span>
                  <span>Fast</span>
                </div>
              </div>

              {/* Knowledge Level */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-fg">
                  Knowledge Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Beginner", "Intermediate", "Advanced"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setKnowledgeLevel(lvl)}
                      className={`rounded-xl border py-2 text-xs font-semibold transition-all ${
                        knowledgeLevel === lvl
                          ? "border-rose-500/50 bg-rose-500/15 text-rose-400"
                          : "border-border/50 bg-elevated text-muted hover:border-rose-500/20"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quiz Accuracy */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-fg">
                    Quiz Accuracy
                  </label>
                  <span className="text-xs font-bold text-rose-400">{accuracy}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={accuracy}
                  onChange={(e) => setAccuracy(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>

              {/* Needs Revision toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-fg">
                  Needs Revision
                </label>
                <button
                  onClick={() => setNeedsRevision((p) => !p)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    needsRevision ? "bg-rose-500" : "bg-border"
                  }`}
                >
                  <motion.span
                    animate={{ x: needsRevision ? 20 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="inline-block h-5 w-5 rounded-full bg-white shadow"
                  />
                </button>
              </div>
            </div>

            {/* Path result */}
            <div className="rounded-2xl border border-border/50 bg-surface p-6 shadow-soft">
              <p className="mb-4 text-sm font-bold text-fg">Recommended Path</p>
              <div className="space-y-2">
                {recommendedPath.map((step, i) => (
                  <motion.div
                    key={`${step}-${i}`}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-2.5"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-xs font-bold text-rose-400">
                      {i + 1}
                    </span>
                    <span className="text-sm text-fg">{step}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-rose-500/20 bg-rose-500/8 px-4 py-3">
                <p className="text-xs text-muted">
                  {knowledgeLevel === "Advanced" || accuracy >= 80
                    ? "Expert mode — skipping fundamentals entirely."
                    : needsRevision || accuracy < 40
                    ? "Slow-paced mode — extra examples and retry loops added."
                    : "Standard adaptive path for your level."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Scene 7: Visual Learning Map */}
        <section>
          <SceneLabel n={7} title="Visual Learning Map" />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-2 text-2xl font-black text-fg"
          >
            Not a list — a decision tree.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-8 text-sm text-muted"
          >
            Your quiz accuracy above controls which branch is highlighted.
          </motion.p>
          <LearningMapTree accuracy={accuracy} />
        </section>

        {/* Scene 8: Real-Time Adaptation */}
        <section>
          <SceneLabel n={8} title="Real-Time Adaptation" />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-2 text-2xl font-black text-fg"
          >
            Watch the system react live.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-6 text-sm text-muted"
          >
            A learner misses two questions. The system doesn't wait until the
            end — it adapts instantly.
          </motion.p>

          <div className="rounded-2xl border border-border/50 bg-surface p-6 shadow-soft">
            <div className="space-y-3 mb-6">
              {RT_STEPS.map((step, i) => {
                const Icon = step.icon;
                const active = rtStep > i;
                return (
                  <motion.div
                    key={i}
                    animate={active ? { opacity: 1 } : { opacity: 0.2 }}
                    transition={{ duration: 0.4 }}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                      active
                        ? i < 2
                          ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                          : i === 2
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-border/40 bg-elevated text-muted"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${active ? step.color : "text-muted"}`} />
                    {step.label}
                    {active && i === 2 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-400"
                      >
                        AUTO
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {!rtRunning && rtStep === 0 && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={startRealTimeAdaptation}
                className="w-full rounded-xl bg-rose-500/15 border border-rose-500/30 px-4 py-3 text-sm font-semibold text-rose-400 hover:bg-rose-500/25 transition-colors"
              >
                Simulate Learner Struggling →
              </motion.button>
            )}
            {rtStep >= RT_STEPS.length && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setRtStep(0); setRtRunning(false); }}
                className="w-full rounded-xl border border-border/50 bg-elevated px-4 py-3 text-sm font-semibold text-muted hover:text-fg transition-colors"
              >
                <RefreshCw className="mr-2 inline h-4 w-4" />
                Reset
              </motion.button>
            )}
          </div>
        </section>

        {/* Scene 9: Mastery Dashboard */}
        <section>
          <SceneLabel n={9} title="Mastery Dashboard" />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-2 text-2xl font-black text-fg"
          >
            Everything updates dynamically.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-8 text-sm text-muted"
          >
            Use the playground below to change these numbers in real time.
          </motion.p>
          <div className="max-w-sm">
            <MasteryDashboard mastery={mastery} confidence={confidence} />
          </div>
        </section>

        {/* Scene 10: Traditional vs Adaptive */}
        <section>
          <SceneLabel n={10} title="Traditional vs Adaptive" />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-2xl font-black text-fg"
          >
            The difference in one frame.
          </motion.h2>

          <div className="grid gap-5 md:grid-cols-2">
            {[
              {
                title: "Traditional LMS",
                icon: BookOpen,
                color: "text-muted",
                border: "border-border/50",
                bg: "bg-surface",
                steps: [
                  { label: "Video 1" },
                  { label: "Video 2" },
                  { label: "Quiz" },
                  { label: "End" },
                ],
                note: "Everyone follows the exact same path, regardless of what they already know.",
              },
              {
                title: "Adaptive LMS",
                icon: Brain,
                color: "text-rose-400",
                border: "border-rose-500/30",
                bg: "bg-rose-500/5",
                steps: [
                  { label: "Video 1" },
                  { label: "Quiz → Performance Analysis" },
                  { label: "Personalized Path" },
                  { label: "Different Journey" },
                  { label: "✓ Mastery" },
                ],
                note: "Content, order, and difficulty change for every learner based on their behavior.",
              },
            ].map((col, ci) => {
              const Icon = col.icon;
              return (
                <motion.div
                  key={ci}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: ci * 0.12 }}
                  className={`rounded-2xl border p-6 shadow-soft ${col.border} ${col.bg}`}
                >
                  <div className="mb-5 flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${col.color}`} />
                    <p className={`font-bold text-sm ${col.color}`}>{col.title}</p>
                  </div>
                  <div className="space-y-2 mb-5">
                    {col.steps.map((s, si) => (
                      <div
                        key={si}
                        className={`rounded-xl border px-4 py-2.5 text-sm ${
                          ci === 0
                            ? "border-border/40 bg-elevated text-muted"
                            : si === col.steps.length - 1
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-semibold"
                            : "border-rose-500/20 bg-rose-500/8 text-fg"
                        }`}
                      >
                        {s.label}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{col.note}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Scene 11: Product Examples */}
        <section>
          <SceneLabel n={11} title="Product Examples" />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-2xl font-black text-fg"
          >
            Who's doing it well?
          </motion.h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`group cursor-pointer rounded-2xl border p-5 shadow-soft transition-all hover:shadow-soft-lg ${p.border} ${p.bg}`}
                onClick={() =>
                  setExpandedProduct(expandedProduct === p.name ? null : p.name)
                }
              >
                <div className="mb-3 flex items-start justify-between">
                  <span className="text-2xl">{p.emoji}</span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${p.border} ${p.color}`}
                  >
                    {p.tag}
                  </span>
                </div>
                <p className="font-bold text-fg text-sm mb-1">{p.name}</p>
                <p className="text-xs text-muted">{p.summary}</p>

                <AnimatePresence>
                  {expandedProduct === p.name && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`mt-3 text-xs leading-relaxed overflow-hidden ${p.color}`}
                    >
                      {p.detail}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className={`mt-3 flex items-center gap-1 text-xs font-semibold ${p.color}`}>
                  {expandedProduct === p.name ? (
                    <>
                      <ChevronDown className="h-3.5 w-3.5" /> Collapse
                    </>
                  ) : (
                    <>
                      <ChevronRight className="h-3.5 w-3.5" /> Learn more
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Scene 12: Product Thinking */}
        <section>
          <SceneLabel n={12} title="Product Thinking" />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-2xl font-black text-fg"
          >
            Why PMs care about adaptive learning.
          </motion.h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INSIGHTS.map((ins, i) => (
              <motion.div
                key={ins.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`rounded-2xl border p-5 shadow-soft ${ins.border} ${ins.bg}`}
              >
                <span className="mb-3 block text-3xl">{ins.emoji}</span>
                <p className={`mb-1.5 font-bold text-sm ${ins.color}`}>{ins.title}</p>
                <p className="text-sm text-muted leading-relaxed">{ins.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Scene 13: Interactive Playground */}
        <section>
          <SceneLabel n={13} title="Interactive Playground" />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-2 text-2xl font-black text-fg"
          >
            You control the learner.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-8 text-sm text-muted"
          >
            Every action changes the learning path, difficulty, and mastery
            score — live.
          </motion.p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Action buttons */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted">
                Learner Actions
              </p>
              <div className="space-y-2.5">
                {PLAYGROUND_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  return (
                    <motion.button
                      key={action.id}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handlePlaygroundAction(action)}
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-semibold transition-all ${action.bg} ${action.border} ${action.hoverBorder} ${action.color}`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {action.label}
                      <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Live state */}
            <div className="space-y-4">
              <MasteryDashboard mastery={mastery} confidence={confidence} />

              {/* Current difficulty */}
              <div className="rounded-2xl border border-border/50 bg-surface p-5 shadow-soft">
                <p className="mb-3 text-sm font-bold text-fg">Current Difficulty</p>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <motion.div
                      key={lvl}
                      animate={{ opacity: lvl <= difficulty ? 1 : 0.2 }}
                      className={`h-3 flex-1 rounded-full ${
                        lvl <= difficulty ? "bg-rose-500" : "bg-border"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted">{difficultyLabel}</p>
              </div>

              {/* Last outcome */}
              <AnimatePresence mode="wait">
                {lastOutcome && (
                  <motion.div
                    key={lastOutcome}
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="rounded-2xl border border-brand/30 bg-brand/10 px-4 py-3"
                  >
                    <p className="text-xs font-semibold text-brand uppercase tracking-wide mb-1">
                      System Response
                    </p>
                    <p className="text-sm text-fg">{lastOutcome}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Scene 14: Behind the Scenes */}
        <section>
          <SceneLabel n={14} title="Behind the Scenes" />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-2xl font-black text-fg"
          >
            How the engine actually works.
          </motion.h2>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Data inputs */}
            <div className="rounded-2xl border border-border/50 bg-surface p-6 shadow-soft">
              <p className="mb-4 text-sm font-bold text-fg flex items-center gap-2">
                <Database className="h-4 w-4 text-rose-400" />
                Data Collected Per Interaction
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Score", icon: BarChart3, color: "text-rose-400" },
                  { label: "Time", icon: Clock, color: "text-amber-400" },
                  { label: "Attempts", icon: RotateCcw, color: "text-violet-400" },
                  { label: "Accuracy", icon: Target, color: "text-emerald-400" },
                  { label: "Topic Strength", icon: Layers, color: "text-cyan-400" },
                  { label: "Confidence", icon: Gauge, color: "text-brand" },
                ].map((d, i) => {
                  const Icon = d.icon;
                  return (
                    <motion.div
                      key={d.label}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07 }}
                      className="flex items-center gap-2 rounded-xl border border-border/40 bg-elevated px-3 py-2.5"
                    >
                      <Icon className={`h-4 w-4 ${d.color}`} />
                      <span className="text-xs font-medium text-muted">{d.label}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Pipeline */}
            <div className="rounded-2xl border border-border/50 bg-surface p-6 shadow-soft">
              <p className="mb-4 text-sm font-bold text-fg flex items-center gap-2">
                <Cpu className="h-4 w-4 text-rose-400" />
                Adaptive Pipeline
              </p>
              <div className="space-y-2">
                {[
                  { label: "Student Activity", color: "text-fg border-border/50 bg-elevated" },
                  { label: "Collect Data", color: "text-muted border-border/50 bg-elevated" },
                  { label: "Learning Engine", color: "text-rose-400 border-rose-500/30 bg-rose-500/10 font-semibold" },
                  { label: "Analyze Patterns", color: "text-muted border-border/50 bg-elevated" },
                  { label: "Choose Next Lesson", color: "text-brand border-brand/30 bg-brand/10 font-semibold" },
                  { label: "Personalized Experience", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10 font-semibold" },
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div
                      className={`rounded-xl border px-4 py-2.5 text-sm ${step.color}`}
                    >
                      {step.label}
                    </div>
                    {i < 5 && (
                      <div className="flex justify-center">
                        <div className="h-3 w-px bg-border/60" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Scene 15: Final Animation */}
        <section className="pb-8">
          <SceneLabel n={15} title="The Goal" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 via-bg to-brand/10 p-8 md:p-12 text-center shadow-soft-lg"
          >
            {/* Three learners */}
            <div className="mb-8 flex justify-center gap-4 md:gap-8">
              {[
                { emoji: "🌱", label: "Beginner", color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
                { emoji: "🌿", label: "Intermediate", color: "border-brand/30 bg-brand/10 text-brand" },
                { emoji: "🌳", label: "Advanced", color: "border-violet-500/30 bg-violet-500/10 text-violet-400" },
              ].map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.15 }}
                  className={`flex flex-col items-center gap-2 rounded-2xl border px-5 py-4 ${l.color}`}
                >
                  <span className="text-3xl">{l.emoji}</span>
                  <span className="text-xs font-semibold">{l.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Diverging lines */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mb-6 flex justify-center"
            >
              <GitBranch className="h-8 w-8 text-rose-400" />
            </motion.div>

            {/* Three different paths → same destination */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mb-8 flex items-center justify-center gap-2 text-sm text-muted"
            >
              <span className="rounded-full bg-elevated border border-border/50 px-3 py-1">Different journeys</span>
              <ArrowRight className="h-4 w-4" />
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-400 font-semibold">Same destination</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="space-y-3"
            >
              <p className="text-lg font-bold text-muted">
                The goal isn't for everyone to finish the course.
              </p>
              <p className="text-2xl md:text-3xl font-black text-fg leading-tight">
                The goal is for everyone to{" "}
                <span className="text-rose-400">MASTER</span> it.
              </p>
              <p className="text-lg font-semibold text-muted mt-2">
                That's Adaptive Learning.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.0 }}
              className="mt-8 flex flex-wrap justify-center gap-3"
            >
              <Link
                href="/domain-knowledge/edtech"
                className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-elevated px-6 py-2.5 text-sm font-semibold text-muted transition-all hover:border-rose-500/30 hover:text-fg"
              >
                <ArrowLeft className="h-4 w-4" />
                More EdTech Concepts
              </Link>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setPhase("intro");
                  setAnswerA(null);
                  setAnswerB(null);
                  setQuizStep("A");
                  setMastery(40);
                  setConfidence(50);
                  setDifficulty(1);
                  setLastOutcome(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-500/30"
              >
                <RotateCcw className="h-4 w-4" />
                Start Over
              </motion.button>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
