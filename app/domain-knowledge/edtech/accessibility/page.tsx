"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Keyboard,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  ZoomIn,
  Moon,
  Sun,
  RotateCcw,
  ChevronRight,
  ChevronDown,
  Play,
  Monitor,
  Users,
  Globe,
  TrendingUp,
  Heart,
  BarChart3,
  Activity,
  Crosshair,
  BookOpen,
  Layers,
  FileText,
  Film,
  ImageIcon,
  Type,
  Minus,
  Plus,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Phase =
  | "intro"
  | "lms"
  | "visual"
  | "alttext"
  | "hearing"
  | "keyboard"
  | "explore";

// ─── Data ────────────────────────────────────────────────────────────────────

const LEARNERS = [
  {
    emoji: "👨‍🦯",
    title: "Visual Impairment",
    desc: "Uses a screen reader",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/25",
  },
  {
    emoji: "🧏",
    title: "Hearing Impairment",
    desc: "Relies on captions",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/25",
  },
  {
    emoji: "⌨",
    title: "Keyboard-only User",
    desc: "Never touches a mouse",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/25",
  },
  {
    emoji: "👵",
    title: "Low Vision / Elderly",
    desc: "Needs high contrast",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/25",
  },
];

const SCREEN_READER_ELEMENTS = [
  { tag: "Navigation", content: "API Fundamentals", status: "ok" },
  { tag: "Heading level 1", content: "Introduction to APIs", status: "ok" },
  { tag: "Button", content: "Play Video", status: "ok" },
  { tag: "Image", content: "image", status: "error", note: "No alt text" },
  { tag: "Link", content: "Download Resources", status: "ok" },
  { tag: "Button", content: "Start Quiz", status: "ok" },
];

const PRODUCTS = [
  {
    name: "Coursera",
    emoji: "🎓",
    tag: "Captions & Transcripts",
    color: "text-brand",
    bg: "bg-brand/10",
    border: "border-brand/20",
    detail:
      "Every video has auto-captions + human-reviewed transcripts. Deaf learners can follow along without audio.",
  },
  {
    name: "YouTube",
    emoji: "▶️",
    tag: "Auto-captions",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    detail:
      "Uses speech-to-text AI to auto-generate captions for 1B+ videos. Supports 60+ languages with near-real-time subtitles.",
  },
  {
    name: "Microsoft Learn",
    emoji: "🪟",
    tag: "Keyboard-first",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    detail:
      "Every feature is keyboard-navigable. Fully WCAG 2.1 AA compliant. Partnered with screen reader vendors for testing.",
  },
  {
    name: "Canvas LMS",
    emoji: "🎨",
    tag: "WCAG Compliance",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    detail:
      "Regular VPAT (Voluntary Product Accessibility Template) audits. All course tools meet WCAG 2.1 AA standards.",
  },
  {
    name: "upGrad",
    emoji: "🚀",
    tag: "Future Opportunity",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    detail:
      "Strong opportunity to lead with accessibility in Indian EdTech. Captions, keyboard nav, and screen-reader support could unlock a massive underserved learner base.",
  },
];

const WCAG = [
  {
    letter: "P",
    word: "Perceivable",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/25",
    question: "Can users perceive the content?",
    examples: ["Alt text for images", "Captions for videos", "Sufficient color contrast"],
    icon: Eye,
  },
  {
    letter: "O",
    word: "Operable",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/25",
    question: "Can users interact with the UI?",
    examples: ["Full keyboard access", "No keyboard traps", "Skip navigation links"],
    icon: Keyboard,
  },
  {
    letter: "U",
    word: "Understandable",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    question: "Can users understand it?",
    examples: ["Clear error messages", "Consistent navigation", "Readable language"],
    icon: MessageSquare,
  },
  {
    letter: "R",
    word: "Robust",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/25",
    question: "Works with assistive tech?",
    examples: ["Valid HTML markup", "ARIA labels", "Screen reader tested"],
    icon: Layers,
  },
];

const INSIGHTS = [
  {
    emoji: "🌍",
    title: "Inclusive Design",
    body: "Designing for the edges improves the experience for everyone.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    emoji: "📈",
    title: "Scale",
    body: "1.3 billion people have disabilities globally. Accessibility unlocks that reach.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    emoji: "⚖️",
    title: "Legal Compliance",
    body: "WCAG is law in many regions. Non-compliance means legal risk.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    emoji: "😊",
    title: "Better UX for All",
    body: "Captions help in noisy rooms. Keyboard nav helps power users. High contrast helps everyone in bright sunlight.",
    color: "text-brand",
    bg: "bg-brand/10",
    border: "border-brand/20",
  },
  {
    emoji: "❤️",
    title: "Empathy",
    body: "Great PMs design with diverse users in mind, not just the modal user.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
];

const A11Y_ISSUES = [
  { label: "Missing Alt Text", icon: ImageIcon, fixed: false },
  { label: "Poor Color Contrast", icon: Sun, fixed: false },
  { label: "No Captions", icon: VolumeX, fixed: false },
  { label: "Keyboard Trap", icon: Keyboard, fixed: false },
  { label: "Missing Form Labels", icon: FileText, fixed: false },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

function SceneLabel({ n, title }: { n: number; title: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="mb-3 text-xs font-semibold uppercase tracking-widest text-cyan-400"
    >
      Scene {n} · {title}
    </motion.p>
  );
}

// ─── Scene 2: Standard LMS ───────────────────────────────────────────────────

function LMSScene({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-bg/95 backdrop-blur-lg"
    >
      <div className="mx-auto w-full max-w-xl px-5 py-10">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-cyan-400"
        >
          Scene 2 · Standard LMS
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 text-center text-2xl font-black text-fg"
        >
          Looks easy to use?
        </motion.h2>

        {/* Fake LMS */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-border/50 bg-surface shadow-soft-lg overflow-hidden"
        >
          {/* LMS nav bar */}
          <div className="flex items-center gap-3 border-b border-border/50 bg-elevated px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-500/60" />
              <span className="h-3 w-3 rounded-full bg-amber-500/60" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/60" />
            </div>
            <span className="flex-1 rounded-md bg-surface/60 px-3 py-1 text-center text-xs text-muted">
              lms.example.com/course/api-fundamentals
            </span>
          </div>
          <div className="grid grid-cols-3 gap-0">
            {/* Sidebar */}
            <div className="border-r border-border/50 p-4 space-y-2">
              <p className="text-xs font-bold text-fg mb-3">Course Menu</p>
              {["Introduction", "REST APIs", "HTTP Methods", "Quiz", "Resources"].map((item, i) => (
                <div
                  key={i}
                  className={`rounded-lg px-2.5 py-2 text-xs ${
                    i === 0
                      ? "bg-cyan-500/15 text-cyan-400 font-semibold"
                      : "text-muted hover:bg-elevated cursor-pointer"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
            {/* Main content */}
            <div className="col-span-2 p-4">
              <p className="mb-1 text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                Module 1
              </p>
              <h3 className="mb-3 text-sm font-black text-fg">Introduction to APIs</h3>
              {/* Video placeholder */}
              <div className="mb-3 flex h-24 items-center justify-center rounded-xl bg-elevated border border-border/50">
                <Play className="h-8 w-8 text-muted" />
              </div>
              {/* Image without context */}
              <div className="mb-3 flex h-16 items-center justify-center rounded-xl bg-elevated border border-border/50 gap-2">
                <ImageIcon className="h-5 w-5 text-muted" />
                <span className="text-xs text-muted">System Architecture Diagram</span>
              </div>
              <div className="flex gap-2">
                <button className="rounded-lg bg-cyan-500/15 border border-cyan-500/30 px-3 py-1.5 text-xs font-semibold text-cyan-400">
                  Start Quiz
                </button>
                <button className="rounded-lg border border-border/50 px-3 py-1.5 text-xs text-muted">
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-5 text-center text-sm text-muted"
        >
          This is how a standard LMS looks to most users.
          <br />
          <span className="text-fg font-semibold">Now let's see it through different eyes.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onContinue}
            className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/30"
          >
            Experience Visual Impairment
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Scene 3: Visual Impairment / Screen Reader ──────────────────────────────

function VisualScene({ onContinue }: { onContinue: () => void }) {
  const [srIndex, setSrIndex] = useState(-1);
  const [blurLevel, setBlurLevel] = useState(0);
  const [started, setStarted] = useState(false);
  const reduce = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startScreenReader = useCallback(() => {
    setStarted(true);
    setBlurLevel(8);
    setSrIndex(0);
    let i = 0;
    const tick = () => {
      i++;
      if (i < SCREEN_READER_ELEMENTS.length) {
        setSrIndex(i);
        timerRef.current = setTimeout(tick, 1200);
      } else {
        setSrIndex(SCREEN_READER_ELEMENTS.length);
      }
    };
    timerRef.current = setTimeout(tick, 1200);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const currentEl = srIndex >= 0 && srIndex < SCREEN_READER_ELEMENTS.length
    ? SCREEN_READER_ELEMENTS[srIndex]
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-bg/95 backdrop-blur-lg"
    >
      <div className="mx-auto w-full max-w-2xl px-5 py-10">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-violet-400"
        >
          Scene 3 · 👨‍🦯 Visual Impairment
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 text-center text-2xl font-black text-fg"
        >
          The screen goes dark. The reader speaks.
        </motion.h2>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Blurred LMS */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
              What they see
            </p>
            <div
              className="rounded-2xl border border-border/50 bg-surface overflow-hidden transition-all duration-700"
              style={{ filter: started ? `blur(${blurLevel}px)` : "none" }}
            >
              <div className="flex items-center gap-2 border-b border-border/50 bg-elevated px-3 py-2">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-rose-500/50" />
                  <span className="h-2 w-2 rounded-full bg-amber-500/50" />
                  <span className="h-2 w-2 rounded-full bg-emerald-500/50" />
                </div>
                <span className="text-xs text-muted">API Fundamentals</span>
              </div>
              <div className="p-3 space-y-2">
                {SCREEN_READER_ELEMENTS.map((el, i) => (
                  <motion.div
                    key={i}
                    animate={
                      started && srIndex === i
                        ? { backgroundColor: "rgba(6,182,212,0.15)", borderColor: "rgba(6,182,212,0.5)" }
                        : { backgroundColor: "transparent", borderColor: "rgba(255,255,255,0.05)" }
                    }
                    className="rounded-lg border px-2.5 py-2 text-xs"
                  >
                    <span className="text-muted text-[10px] font-semibold uppercase tracking-wide">
                      {el.tag}
                    </span>
                    <p className={`mt-0.5 font-medium ${el.status === "error" ? "text-rose-400" : "text-fg"}`}>
                      {el.content}
                      {el.status === "error" && (
                        <span className="ml-1.5 rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] text-rose-400">
                          ⚠ {el.note}
                        </span>
                      )}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Screen reader output */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
              What they hear
            </p>
            <div className="rounded-2xl border border-violet-500/25 bg-violet-500/8 p-4 min-h-[200px] flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <motion.div
                  animate={reduce ? {} : started ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20"
                >
                  <MessageSquare className="h-4 w-4 text-violet-400" />
                </motion.div>
                <span className="text-xs font-semibold text-violet-400">Screen Reader</span>
              </div>

              <AnimatePresence mode="wait">
                {!started ? (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-1 items-center justify-center"
                  >
                    <p className="text-center text-sm text-muted">
                      Press start to activate the screen reader
                    </p>
                  </motion.div>
                ) : currentEl ? (
                  <motion.div
                    key={srIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex-1"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-violet-400/70 mb-1">
                      Reading:
                    </p>
                    <p className="text-lg font-bold text-violet-300 mb-1">{currentEl.tag}</p>
                    <p className={`text-sm ${currentEl.status === "error" ? "text-rose-400" : "text-fg"}`}>
                      {currentEl.content}
                    </p>
                    {currentEl.status === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2"
                      >
                        <p className="text-xs text-rose-400 font-semibold">
                          ⚠ {currentEl.note} — learner has no context for this image.
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1"
                  >
                    <p className="text-sm font-semibold text-emerald-400 mb-1">✓ Page read complete</p>
                    <p className="text-xs text-muted">
                      One image had no description. For screen reader users, that's invisible content.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!started ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={startScreenReader}
                className="mt-3 w-full rounded-xl border border-violet-500/30 bg-violet-500/10 py-3 text-sm font-semibold text-violet-400 hover:bg-violet-500/20 transition-colors"
              >
                Activate Screen Reader
              </motion.button>
            ) : srIndex >= SCREEN_READER_ELEMENTS.length ? (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onContinue}
                className="mt-3 w-full rounded-xl bg-cyan-500 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/25"
              >
                Next: Fix Alt Text →
              </motion.button>
            ) : null}
          </div>
        </div>

        {/* Info box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-5 rounded-xl border border-border/50 bg-elevated px-4 py-3 text-xs text-muted"
        >
          <strong className="text-fg">Screen readers</strong> use semantic HTML — heading tags, button roles, alt text — to narrate a page. Without proper markup, the experience breaks completely.
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Scene 4: Alt Text ───────────────────────────────────────────────────────

function AltTextScene({ onContinue }: { onContinue: () => void }) {
  const [hasAlt, setHasAlt] = useState(false);
  const [typing, setTyping] = useState(false);
  const [typed, setTyped] = useState("");
  const ALT = "Architecture diagram showing client, API gateway, and database communication";
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAddAlt = useCallback(() => {
    setTyping(true);
    let i = 0;
    const tick = () => {
      i++;
      setTyped(ALT.slice(0, i));
      if (i < ALT.length) {
        timerRef.current = setTimeout(tick, 22);
      } else {
        setTimeout(() => setHasAlt(true), 300);
      }
    };
    timerRef.current = setTimeout(tick, 200);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-bg/95 backdrop-blur-lg"
    >
      <div className="mx-auto w-full max-w-xl px-5 py-10">
        <motion.p className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-violet-400">
          Scene 4 · Alt Text
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 text-center text-2xl font-black text-fg"
        >
          What does a screen reader see here?
        </motion.h2>

        {/* Image block */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-5 rounded-2xl border border-border/50 bg-surface p-5"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
            Course image
          </p>
          {/* Fake architecture diagram */}
          <div className="mb-4 flex h-32 items-center justify-center gap-4 rounded-xl bg-elevated border border-border/50">
            {[
              { label: "Client", color: "bg-cyan-500/20 border-cyan-500/40" },
              { label: "API", color: "bg-violet-500/20 border-violet-500/40" },
              { label: "DB", color: "bg-emerald-500/20 border-emerald-500/40" },
            ].map((node, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`flex h-10 w-14 items-center justify-center rounded-lg border text-xs font-bold text-fg ${node.color}`}>
                  {node.label}
                </div>
                {i < 2 && <ArrowRight className="h-4 w-4 text-muted" />}
              </div>
            ))}
          </div>

          {/* Screen reader output */}
          <div className={`rounded-xl border p-3 transition-all duration-500 ${hasAlt ? "border-emerald-500/30 bg-emerald-500/8" : "border-rose-500/30 bg-rose-500/8"}`}>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted">
              Screen reader announces:
            </p>
            <AnimatePresence mode="wait">
              {!hasAlt ? (
                <motion.p key="no-alt" className="text-sm font-bold text-rose-400">
                  "Image"
                </motion.p>
              ) : (
                <motion.p
                  key="has-alt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-medium text-emerald-400"
                >
                  "{ALT}"
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Alt text input */}
        {!hasAlt && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-5 rounded-2xl border border-border/50 bg-surface p-5"
          >
            <p className="mb-2 text-sm font-semibold text-fg">Add Alt Text</p>
            <div className="rounded-xl border border-border/50 bg-elevated px-3 py-2.5 text-sm min-h-[44px]">
              {typing ? (
                <span className="text-fg">
                  {typed}
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="ml-0.5 inline-block w-0.5 h-4 bg-cyan-400 align-middle"
                  />
                </span>
              ) : (
                <span className="text-muted">Describe what the image shows…</span>
              )}
            </div>
            {!typing && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddAlt}
                className="mt-3 w-full rounded-xl border border-cyan-500/30 bg-cyan-500/10 py-2.5 text-sm font-semibold text-cyan-400 hover:bg-cyan-500/20 transition-colors"
              >
                Add Alt Text →
              </motion.button>
            )}
          </motion.div>
        )}

        {hasAlt && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4"
          >
            <CheckCircle className="h-6 w-6 text-emerald-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-400">Alt text added.</p>
              <p className="text-xs text-muted">Screen reader users now understand this image.</p>
            </div>
          </motion.div>
        )}

        {hasAlt && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onContinue}
              className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/30"
            >
              Next: Hearing Impairment →
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Scene 5: Hearing Impairment ─────────────────────────────────────────────

function HearingScene({ onContinue }: { onContinue: () => void }) {
  const [captionsOn, setCaptionsOn] = useState(false);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [tick, setTick] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const id = setInterval(() => setTick((p) => p + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const CAPTIONS = [
    "An API, or Application Programming Interface,",
    "is a way for two software programs to communicate.",
    "Think of it like a waiter taking your order",
    "and bringing it to the kitchen.",
    "The API is the messenger between your app and the server.",
  ];
  const captionLine = CAPTIONS[tick % CAPTIONS.length];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-bg/95 backdrop-blur-lg"
    >
      <div className="mx-auto w-full max-w-xl px-5 py-10">
        <motion.p className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-cyan-400">
          Scene 5 · 🧏 Hearing Impairment
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 text-center text-2xl font-black text-fg"
        >
          Can you follow the lesson without audio?
        </motion.h2>

        {/* Video player */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-5 overflow-hidden rounded-2xl border border-border/50 bg-surface shadow-soft"
        >
          {/* Video screen */}
          <div className="relative flex h-40 items-center justify-center bg-elevated">
            <div className="text-center">
              <p className="text-2xl mb-1">🎬</p>
              <p className="text-xs text-muted">Introduction to APIs</p>
            </div>
            {/* Audio waves or mute */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1">
              {captionsOn ? (
                <Volume2 className="h-4 w-4 text-muted" />
              ) : (
                <VolumeX className="h-4 w-4 text-muted" />
              )}
            </div>
            {/* Audio visualizer */}
            {!captionsOn && (
              <div className="absolute bottom-3 left-3 flex items-end gap-0.5 h-4">
                {[3, 5, 7, 5, 3, 6, 4].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={reduce ? {} : { height: [`${h * 2}px`, `${h * 4}px`, `${h * 2}px`] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                    className="w-1 rounded-full bg-muted/40"
                    style={{ height: `${h * 2}px` }}
                  />
                ))}
                <span className="ml-1.5 text-[10px] text-muted">Audio playing…</span>
              </div>
            )}
            {/* Caption bar */}
            <AnimatePresence>
              {captionsOn && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute bottom-0 left-0 right-0 bg-black/80 px-3 py-2 text-center text-xs text-white"
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={captionLine}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {captionLine}
                    </motion.span>
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button className="text-muted">
                <Play className="h-4 w-4" />
              </button>
              <div className="h-1 w-32 rounded-full bg-elevated">
                <motion.div
                  animate={{ width: `${((tick % 60) / 60) * 100}%` }}
                  className="h-full rounded-full bg-cyan-500"
                />
              </div>
              <span className="text-xs text-muted">3:47</span>
            </div>
            <button
              onClick={() => setCaptionsOn((p) => !p)}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all ${
                captionsOn
                  ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-400"
                  : "border-border/50 bg-elevated text-muted hover:border-cyan-500/20"
              }`}
            >
              <Type className="h-3.5 w-3.5" />
              CC
            </button>
          </div>
        </motion.div>

        {/* Status */}
        <AnimatePresence mode="wait">
          {!captionsOn ? (
            <motion.div
              key="no-cc"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-5 rounded-2xl border border-rose-500/30 bg-rose-500/8 p-4 text-center"
            >
              <XCircle className="mx-auto mb-2 h-6 w-6 text-rose-400" />
              <p className="text-sm font-bold text-rose-400">
                Without captions, this lesson is inaccessible.
              </p>
              <p className="mt-1 text-xs text-muted">Toggle CC above to turn on captions.</p>
            </motion.div>
          ) : (
            <motion.div
              key="cc-on"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/8 p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="h-6 w-6 text-emerald-400 shrink-0" />
                <p className="text-sm font-bold text-emerald-400">
                  Captions on — learning is possible again.
                </p>
              </div>
              {/* Transcript teaser */}
              <button
                onClick={() => setTranscriptOpen((p) => !p)}
                className="flex w-full items-center justify-between rounded-xl border border-border/40 bg-elevated px-3 py-2 text-xs font-semibold text-muted hover:text-fg"
              >
                <span>📄 Full Transcript</span>
                {transcriptOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              </button>
              <AnimatePresence>
                {transcriptOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 space-y-1 rounded-xl bg-elevated p-3">
                      {CAPTIONS.map((line, i) => (
                        <p key={i} className="text-xs text-muted leading-relaxed">
                          <span className="text-[10px] text-cyan-400/60 mr-1">{String(i + 1).padStart(2, "0")}.</span>
                          {line}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {captionsOn && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onContinue}
              className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/30"
            >
              Next: Keyboard Navigation →
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Scene 6: Keyboard Navigation ────────────────────────────────────────────

function KeyboardScene({ onContinue }: { onContinue: () => void }) {
  const [focusIndex, setFocusIndex] = useState(-1);
  const [showFocus, setShowFocus] = useState(false);
  const [tabCount, setTabCount] = useState(0);

  const ITEMS = [
    { label: "Skip to Content", type: "link" },
    { label: "Play Video", type: "button" },
    { label: "Start Quiz", type: "button" },
    { label: "Download PDF", type: "link" },
    { label: "Next Module →", type: "button" },
  ];

  const handleTab = useCallback(() => {
    setFocusIndex((p) => (p + 1) % ITEMS.length);
    setTabCount((p) => p + 1);
  }, [ITEMS.length]);

  const handleShiftTab = useCallback(() => {
    setFocusIndex((p) => (p - 1 + ITEMS.length) % ITEMS.length);
    setTabCount((p) => p + 1);
  }, [ITEMS.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) handleShiftTab();
        else handleTab();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleTab, handleShiftTab]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-bg/95 backdrop-blur-lg"
    >
      <div className="mx-auto w-full max-w-xl px-5 py-10">
        <motion.p className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-amber-400">
          Scene 6 · ⌨ Keyboard Navigation
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-3 text-center text-2xl font-black text-fg"
        >
          No mouse. Only keyboard.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-8 text-center text-sm text-muted"
        >
          Press <kbd className="rounded border border-border/60 bg-elevated px-1.5 py-0.5 text-xs font-mono text-fg">Tab</kbd> to navigate,{" "}
          <kbd className="rounded border border-border/60 bg-elevated px-1.5 py-0.5 text-xs font-mono text-fg">Shift+Tab</kbd> to go back.
        </motion.p>

        {/* Focus indicator toggle */}
        <div className="mb-5 flex items-center justify-between rounded-2xl border border-border/50 bg-surface px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-fg">Focus Indicators</p>
            <p className="text-xs text-muted">
              {showFocus ? "Visible — you can see where you are" : "Hidden — you're navigating blind"}
            </p>
          </div>
          <button
            onClick={() => setShowFocus((p) => !p)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              showFocus ? "bg-amber-500" : "bg-border"
            }`}
          >
            <motion.span
              animate={{ x: showFocus ? 20 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="inline-block h-5 w-5 rounded-full bg-white shadow"
            />
          </button>
        </div>

        {/* Navigable elements */}
        <div className="mb-5 rounded-2xl border border-border/50 bg-surface p-4 space-y-2">
          {ITEMS.map((item, i) => (
            <div
              key={i}
              className={`relative flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                focusIndex === i && showFocus
                  ? "border-amber-500 bg-amber-500/10 text-amber-400 shadow-[0_0_0_3px_rgba(245,158,11,0.3)]"
                  : focusIndex === i && !showFocus
                  ? "border-border/50 bg-surface text-fg"
                  : "border-border/40 bg-elevated text-muted"
              }`}
            >
              {focusIndex === i && !showFocus && (
                <span className="absolute -top-5 left-0 text-xs text-rose-400 font-semibold">
                  Where am I? 👁
                </span>
              )}
              <span className={`text-[10px] rounded border px-1.5 py-0.5 font-mono ${
                item.type === "button"
                  ? "border-brand/30 bg-brand/10 text-brand"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              }`}>
                {item.type}
              </span>
              {item.label}
              {focusIndex === i && showFocus && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto flex items-center gap-1 text-xs text-amber-400 font-semibold"
                >
                  <Crosshair className="h-3.5 w-3.5" />
                  Focus
                </motion.span>
              )}
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="mb-5 grid grid-cols-3 gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleTab}
            className="rounded-xl border border-amber-500/30 bg-amber-500/10 py-3 text-xs font-bold text-amber-400"
          >
            Tab →
          </motion.button>
          <div className="flex items-center justify-center rounded-xl border border-border/40 bg-elevated text-xs text-muted">
            {tabCount} presses
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleShiftTab}
            className="rounded-xl border border-amber-500/30 bg-amber-500/10 py-3 text-xs font-bold text-amber-400"
          >
            ← Shift+Tab
          </motion.button>
        </div>

        {tabCount >= 5 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onContinue}
              className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/30"
            >
              Explore Full Simulation →
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AccessibilityPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [contrastVal, setContrastVal] = useState(20);
  const [issues, setIssues] = useState<typeof A11Y_ISSUES>(A11Y_ISSUES);
  const [score, setScore] = useState(42);
  const [fixingAll, setFixingAll] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [expandedWcag, setExpandedWcag] = useState<string | null>(null);
  const [learnerCount, setLearnerCount] = useState(650000);
  const [a11yEnabled, setA11yEnabled] = useState(false);
  const exploreSectionRef = useRef<HTMLDivElement>(null);

  const [a11yToggles, setA11yToggles] = useState({
    screenReader: false,
    captions: false,
    keyboard: false,
    highContrast: false,
    largeFont: false,
    darkMode: false,
    reduceMotion: false,
    altText: false,
  });

  const activeToggles = Object.values(a11yToggles).filter(Boolean).length;

  const contrastRatio = (() => {
    if (contrastVal < 20) return "1.5:1";
    if (contrastVal < 40) return "2.8:1";
    if (contrastVal < 55) return "3.9:1";
    if (contrastVal < 70) return "4.6:1";
    if (contrastVal < 85) return "5.8:1";
    return "8.2:1";
  })();

  const wcagStatus = (() => {
    if (contrastVal < 55) return { label: "Fail", color: "text-rose-400", bg: "bg-rose-500/15", border: "border-rose-500/30" };
    if (contrastVal < 85) return { label: "AA", color: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/30" };
    return { label: "AAA", color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/30" };
  })();

  const textLightness = Math.round(clamp(contrastVal * 0.8, 15, 90));
  const textColor = `hsl(0 0% ${textLightness}%)`;

  const handleFixAll = useCallback(() => {
    setFixingAll(true);
    let i = 0;
    const fix = () => {
      setIssues((prev) => {
        const next = [...prev];
        next[i] = { ...next[i], fixed: true };
        return next;
      });
      setScore((p) => Math.min(p + 12, 100));
      i++;
      if (i < A11Y_ISSUES.length) {
        setTimeout(fix, 500);
      } else {
        setFixingAll(false);
      }
    };
    setTimeout(fix, 400);
  }, []);

  const handlePhaseToExplore = useCallback(() => {
    setPhase("explore");
    setTimeout(() => {
      exploreSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, []);

  const toggleA11y = useCallback((key: keyof typeof a11yToggles) => {
    setA11yToggles((p) => ({ ...p, [key]: !p[key] }));
  }, []);

  return (
    <div className={`min-h-screen bg-bg transition-all duration-500 ${a11yToggles.highContrast ? "contrast-[1.4]" : ""}`}>
      {/* ─── Scene 1: Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border/50 bg-bg">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(6,182,212,0.07) 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

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
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1"
          >
            <Eye className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-400 tracking-wide">
              Accessibility · a11y
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mb-4 text-4xl font-black tracking-tight text-fg md:text-5xl leading-tight"
          >
            Can everyone use
            <br />
            <span className="text-cyan-400">the same learning platform?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-10 max-w-lg text-[15px] text-muted leading-relaxed"
          >
            Let's experience your course through four different learners — and
            discover what breaks, what's missing, and what makes it whole.
          </motion.p>

          {/* Learner Cards */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-2xl"
          >
            {LEARNERS.map((l, i) => (
              <motion.div
                key={l.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center ${l.bg} ${l.border}`}
              >
                <span className="text-3xl">{l.emoji}</span>
                <p className={`text-xs font-bold ${l.color}`}>{l.title}</p>
                <p className="text-[10px] text-muted">{l.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setPhase("lms")}
              className="inline-flex items-center gap-2.5 rounded-full bg-cyan-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/30 transition-shadow hover:shadow-xl hover:shadow-cyan-500/40"
            >
              <Play className="h-4 w-4" />
              Start Experience
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ─── Overlays: Scenes 2–6 ──────────────────────────────────────── */}
      <AnimatePresence>
        {phase === "lms" && <LMSScene key="lms" onContinue={() => setPhase("visual")} />}
        {phase === "visual" && <VisualScene key="visual" onContinue={() => setPhase("alttext")} />}
        {phase === "alttext" && <AltTextScene key="alttext" onContinue={() => setPhase("hearing")} />}
        {phase === "hearing" && <HearingScene key="hearing" onContinue={() => setPhase("keyboard")} />}
        {phase === "keyboard" && <KeyboardScene key="keyboard" onContinue={handlePhaseToExplore} />}
      </AnimatePresence>

      {/* ─── Scenes 7–15: Scrollable Educational Content ──────────────── */}
      <div ref={exploreSectionRef} className="mx-auto max-w-4xl space-y-20 px-5 py-20">
        {/* Scene 7: Color Contrast */}
        <section>
          <SceneLabel n={7} title="Color Contrast" />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-2 text-2xl font-black text-fg"
          >
            Can your learners read this?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-8 text-sm text-muted"
          >
            Drag the slider to change contrast — watch the WCAG indicator update live.
          </motion.p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Controls */}
            <div className="rounded-2xl border border-border/50 bg-surface p-6 shadow-soft space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-fg">Contrast Ratio</label>
                  <span className="text-sm font-bold text-cyan-400">{contrastRatio}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={contrastVal}
                  onChange={(e) => setContrastVal(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
                <div className="mt-1 flex justify-between text-xs text-muted">
                  <span>1:1 (no contrast)</span>
                  <span>21:1 (max)</span>
                </div>
              </div>

              {/* WCAG Badge */}
              <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${wcagStatus.bg} ${wcagStatus.border}`}>
                <div>
                  <p className="text-xs text-muted mb-0.5">WCAG Status</p>
                  <p className={`text-xl font-black ${wcagStatus.color}`}>{wcagStatus.label}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted">Requirement</p>
                  <p className="text-xs font-semibold text-fg">
                    {wcagStatus.label === "Fail" ? "Needs ≥ 4.5:1" : wcagStatus.label === "AA" ? "AA Met (≥ 4.5:1)" : "AAA Met (≥ 7:1)"}
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-xs text-muted">
                <div className="flex justify-between">
                  <span>AA (normal text)</span>
                  <span className={contrastVal >= 55 ? "text-emerald-400" : "text-rose-400"}>
                    {contrastVal >= 55 ? "✓ Pass" : "✗ Fail"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>AAA (enhanced)</span>
                  <span className={contrastVal >= 85 ? "text-emerald-400" : "text-rose-400"}>
                    {contrastVal >= 85 ? "✓ Pass" : "✗ Fail"}
                  </span>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-2xl border border-border/50 bg-white p-6 shadow-soft">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Preview (light background)
              </p>
              <div
                className="space-y-3 transition-all duration-300"
                style={{ color: textColor }}
              >
                <p className="text-xl font-black">Introduction to APIs</p>
                <p className="text-sm leading-relaxed">
                  An API (Application Programming Interface) is a way for two
                  software applications to talk to each other. Like a waiter
                  who takes your order to the kitchen and brings back your food.
                </p>
                <p className="text-sm">
                  Module 1 of 8 · 14 min read
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Scene 8: Accessibility Playground */}
        <section>
          <SceneLabel n={8} title="Accessibility Playground" />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-2 text-2xl font-black text-fg"
          >
            Toggle the experience. See it change.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-8 text-sm text-muted"
          >
            Every toggle immediately changes the simulated LMS on the right.
          </motion.p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Toggle Panel */}
            <div className="rounded-2xl border border-border/50 bg-surface p-5 shadow-soft space-y-3">
              {(
                [
                  { key: "screenReader", label: "Screen Reader", icon: MessageSquare, color: "violet" },
                  { key: "captions", label: "Captions", icon: Type, color: "cyan" },
                  { key: "keyboard", label: "Keyboard Navigation", icon: Keyboard, color: "amber" },
                  { key: "highContrast", label: "High Contrast", icon: Sun, color: "yellow" },
                  { key: "largeFont", label: "Increase Font Size", icon: ZoomIn, color: "emerald" },
                  { key: "darkMode", label: "Dark Mode", icon: Moon, color: "slate" },
                  { key: "reduceMotion", label: "Reduce Motion", icon: Activity, color: "rose" },
                  { key: "altText", label: "Alt Text Enabled", icon: ImageIcon, color: "brand" },
                ] as const
              ).map(({ key, label, icon: Icon, color }) => {
                const on = a11yToggles[key as keyof typeof a11yToggles];
                return (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${on ? `text-${color}-400` : "text-muted"}`} />
                      <span className={`text-sm font-medium ${on ? "text-fg" : "text-muted"}`}>
                        {label}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleA11y(key as keyof typeof a11yToggles)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        on ? "bg-cyan-500" : "bg-border"
                      }`}
                    >
                      <motion.span
                        animate={{ x: on ? 16 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="inline-block h-4 w-4 rounded-full bg-white shadow"
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Simulated LMS */}
            <div
              className={`rounded-2xl border border-border/50 overflow-hidden shadow-soft transition-all duration-500 ${
                a11yToggles.darkMode ? "bg-gray-950 border-gray-800" : "bg-white"
              }`}
            >
              {/* LMS header */}
              <div className={`border-b px-4 py-2 flex items-center gap-2 ${a11yToggles.darkMode ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200"}`}>
                <div className={`text-xs font-bold ${a11yToggles.darkMode ? "text-white" : "text-gray-800"} ${a11yToggles.largeFont ? "text-sm" : ""}`}>
                  API Fundamentals
                </div>
                {a11yToggles.keyboard && (
                  <div className="ml-auto flex items-center gap-1 rounded border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-400">
                    <Keyboard className="h-2.5 w-2.5" />
                    Tab nav
                  </div>
                )}
              </div>

              {/* LMS body */}
              <div className="p-4 space-y-3">
                {/* Image block */}
                <div className={`relative rounded-xl p-3 ${a11yToggles.darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
                  <div className="flex items-center gap-2">
                    <ImageIcon className={`h-5 w-5 ${a11yToggles.darkMode ? "text-gray-600" : "text-gray-400"}`} />
                    <div className="flex-1">
                      {a11yToggles.altText ? (
                        <p className={`text-xs ${a11yToggles.darkMode ? "text-gray-300" : "text-gray-600"} ${a11yToggles.largeFont ? "text-sm" : ""}`}>
                          Architecture diagram: client → API → database
                        </p>
                      ) : (
                        <p className={`text-xs ${a11yToggles.darkMode ? "text-gray-600" : "text-gray-300"} italic`}>
                          img (no description)
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Video block */}
                <div className={`rounded-xl p-3 ${a11yToggles.darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Film className={`h-4 w-4 ${a11yToggles.darkMode ? "text-gray-400" : "text-gray-500"}`} />
                    <span className={`text-xs font-medium ${a11yToggles.darkMode ? "text-gray-300" : "text-gray-600"} ${a11yToggles.largeFont ? "text-sm" : ""}`}>
                      Intro Video
                    </span>
                  </div>
                  {a11yToggles.captions && (
                    <div className={`rounded bg-black/80 px-2 py-1 text-[10px] text-white ${a11yToggles.largeFont ? "text-xs" : ""}`}>
                      [CC] An API is a bridge between systems…
                    </div>
                  )}
                </div>

                {/* Screen reader announcement */}
                {a11yToggles.screenReader && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-violet-500/30 bg-violet-500/10 px-3 py-2"
                  >
                    <p className={`text-[10px] text-violet-400 ${a11yToggles.largeFont ? "text-xs" : ""}`}>
                      🔊 Screen reader: "Heading 1, Introduction to APIs"
                    </p>
                  </motion.div>
                )}

                {/* Buttons */}
                <div className="flex gap-2">
                  {["Start Quiz", "Download PDF"].map((btn, i) => (
                    <button
                      key={i}
                      className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                        i === 0
                          ? "bg-cyan-500 text-white"
                          : a11yToggles.darkMode
                          ? "border border-gray-700 text-gray-400"
                          : "border border-gray-200 text-gray-600"
                      } ${a11yToggles.keyboard ? "focus-visible:ring-2 focus-visible:ring-amber-500" : ""} ${a11yToggles.largeFont ? "text-sm py-2.5" : ""}`}
                    >
                      {btn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active count */}
              <div className={`border-t px-4 py-2 flex items-center justify-between ${a11yToggles.darkMode ? "border-gray-800 bg-gray-900" : "border-gray-100 bg-gray-50"}`}>
                <p className={`text-[10px] ${a11yToggles.darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  {activeToggles} accessibility feature{activeToggles !== 1 ? "s" : ""} active
                </p>
                {activeToggles >= 4 && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-[10px] font-semibold text-emerald-400"
                  >
                    Highly accessible ✓
                  </motion.span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Scene 9: Accessibility Score */}
        <section>
          <SceneLabel n={9} title="Accessibility Score" />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-2xl font-black text-fg"
          >
            Fix the issues. Watch the score climb.
          </motion.h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Score card */}
            <div className="rounded-2xl border border-border/50 bg-surface p-6 shadow-soft">
              <div className="mb-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">
                  Accessibility Score
                </p>
                <motion.p
                  className={`text-6xl font-black ${score < 60 ? "text-rose-400" : score < 90 ? "text-amber-400" : "text-emerald-400"}`}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.3 }}
                  key={score}
                >
                  {score}%
                </motion.p>
                <div className="mt-3 h-2 rounded-full bg-elevated overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full transition-colors ${score < 60 ? "bg-rose-500" : score < 90 ? "bg-amber-500" : "bg-emerald-500"}`}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </div>

              {!fixingAll && score < 100 && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleFixAll}
                  className="w-full rounded-xl bg-cyan-500/15 border border-cyan-500/30 py-3 text-sm font-bold text-cyan-400 hover:bg-cyan-500/25 transition-colors"
                >
                  Fix All Issues →
                </motion.button>
              )}
              {score >= 100 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3"
                >
                  <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                  <p className="text-sm font-bold text-emerald-400">Fully accessible!</p>
                </motion.div>
              )}
            </div>

            {/* Issues list */}
            <div className="space-y-2">
              {issues.map((issue, i) => {
                const Icon = issue.icon;
                return (
                  <motion.div
                    key={issue.label}
                    animate={
                      issue.fixed
                        ? { opacity: 0.6 }
                        : { opacity: 1 }
                    }
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all ${
                      issue.fixed
                        ? "border-emerald-500/20 bg-emerald-500/8"
                        : "border-rose-500/20 bg-rose-500/8"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${issue.fixed ? "text-emerald-400" : "text-rose-400"}`} />
                    <span className={issue.fixed ? "text-muted line-through" : "text-fg"}>
                      {issue.label}
                    </span>
                    {issue.fixed ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      </motion.div>
                    ) : (
                      <AlertCircle className="ml-auto h-4 w-4 text-rose-400" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Scene 10: Product Impact */}
        <section>
          <SceneLabel n={10} title="Product Impact" />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-2xl font-black text-fg"
          >
            Accessibility increases reach.
          </motion.h2>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Without */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 shadow-soft"
            >
              <p className="mb-4 text-sm font-bold text-rose-400 flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Without Accessibility
              </p>
              <p className="mb-1 text-xs text-muted">Potential Learners</p>
              <p className="mb-3 text-4xl font-black text-fg">1,000,000</p>
              <p className="mb-1 text-xs text-muted">Can Successfully Learn</p>
              <p className="text-4xl font-black text-rose-400">650,000</p>
              <p className="mt-3 text-xs text-muted">
                35% of learners face barriers — reduced speed, missed content, or complete exclusion.
              </p>
            </motion.div>

            {/* With */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 shadow-soft"
            >
              <p className="mb-4 text-sm font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                With Accessibility
              </p>
              <p className="mb-1 text-xs text-muted">Potential Learners</p>
              <p className="mb-3 text-4xl font-black text-fg">1,000,000</p>
              <p className="mb-1 text-xs text-muted">Accessible Experience</p>
              <p className="text-4xl font-black text-emerald-400">980,000+</p>
              <p className="mt-3 text-xs text-muted">
                Accessibility improvements benefit all learners — not just those with disabilities.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 rounded-2xl border border-cyan-500/25 bg-cyan-500/8 p-5 text-center"
          >
            <p className="text-lg font-black text-cyan-400">
              330,000 more learners. Same content. Better design.
            </p>
          </motion.div>
        </section>

        {/* Scene 11: Product Examples */}
        <section>
          <SceneLabel n={11} title="Real Products" />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-2xl font-black text-fg"
          >
            Who's doing it right?
          </motion.h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setExpandedProduct(expandedProduct === p.name ? null : p.name)}
                className={`group cursor-pointer rounded-2xl border p-5 shadow-soft transition-all hover:shadow-soft-lg ${p.border} ${p.bg}`}
              >
                <div className="mb-3 flex items-start justify-between">
                  <span className="text-2xl">{p.emoji}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${p.border} ${p.color}`}>
                    {p.tag}
                  </span>
                </div>
                <p className="font-bold text-fg text-sm mb-1">{p.name}</p>
                <AnimatePresence>
                  {expandedProduct === p.name && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`text-xs leading-relaxed overflow-hidden ${p.color} mt-2`}
                    >
                      {p.detail}
                    </motion.p>
                  )}
                </AnimatePresence>
                <div className={`mt-3 flex items-center gap-1 text-xs font-semibold ${p.color}`}>
                  {expandedProduct === p.name ? (
                    <><ChevronDown className="h-3.5 w-3.5" />Collapse</>
                  ) : (
                    <><ChevronRight className="h-3.5 w-3.5" />Learn more</>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Scene 12: WCAG Guide */}
        <section>
          <SceneLabel n={12} title="WCAG Principles" />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-2xl font-black text-fg"
          >
            The four pillars. POUR.
          </motion.h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {WCAG.map((w, i) => {
              const Icon = w.icon;
              return (
                <motion.div
                  key={w.word}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setExpandedWcag(expandedWcag === w.word ? null : w.word)}
                  className={`cursor-pointer rounded-2xl border p-5 shadow-soft transition-all hover:shadow-soft-lg ${w.border} ${w.bg}`}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl border text-xl font-black ${w.border} ${w.color}`}>
                      {w.letter}
                    </span>
                    <div>
                      <p className={`font-black text-base ${w.color}`}>{w.word}</p>
                      <p className="text-xs text-muted">{w.question}</p>
                    </div>
                  </div>
                  <AnimatePresence>
                    {expandedWcag === w.word && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 space-y-1.5 pt-2 border-t border-current/10">
                          {w.examples.map((ex, ei) => (
                            <div key={ei} className="flex items-center gap-2 text-xs">
                              <CheckCircle className={`h-3.5 w-3.5 shrink-0 ${w.color}`} />
                              <span className="text-muted">{ex}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className={`mt-2 flex items-center gap-1 text-xs font-semibold ${w.color}`}>
                    {expandedWcag === w.word ? (
                      <><ChevronDown className="h-3 w-3" />Collapse</>
                    ) : (
                      <><ChevronRight className="h-3 w-3" />See examples</>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Scene 13: Product Thinking */}
        <section>
          <SceneLabel n={13} title="Product Thinking" />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-2xl font-black text-fg"
          >
            Why great PMs prioritize accessibility.
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

        {/* Scene 14: Challenge — Compare two modes */}
        <section>
          <SceneLabel n={14} title="Accessibility Challenge" />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-2xl font-black text-fg"
          >
            Same task. Two experiences.
          </motion.h2>
          <div className="grid gap-5 md:grid-cols-2">
            {[
              {
                label: "Mode A — Poor Accessibility",
                color: "border-rose-500/25 bg-rose-500/5",
                accent: "text-rose-400",
                items: [
                  { icon: XCircle, text: "No keyboard focus visible", cls: "text-rose-400" },
                  { icon: XCircle, text: "Image has no alt text", cls: "text-rose-400" },
                  { icon: XCircle, text: "Gray text on white: 2.1:1 contrast", cls: "text-rose-400" },
                  { icon: XCircle, text: "Video has no captions", cls: "text-rose-400" },
                  { icon: XCircle, text: "Form labels missing", cls: "text-rose-400" },
                ],
                metrics: [
                  { label: "Time to complete", value: "12 min" },
                  { label: "Error rate", value: "34%" },
                  { label: "Frustration", value: "High" },
                ],
              },
              {
                label: "Mode B — Accessible",
                color: "border-emerald-500/25 bg-emerald-500/5",
                accent: "text-emerald-400",
                items: [
                  { icon: CheckCircle, text: "Visible focus indicators", cls: "text-emerald-400" },
                  { icon: CheckCircle, text: "All images have alt text", cls: "text-emerald-400" },
                  { icon: CheckCircle, text: "Black text on white: 9.3:1 contrast", cls: "text-emerald-400" },
                  { icon: CheckCircle, text: "Captions and transcript available", cls: "text-emerald-400" },
                  { icon: CheckCircle, text: "All inputs properly labeled", cls: "text-emerald-400" },
                ],
                metrics: [
                  { label: "Time to complete", value: "6 min" },
                  { label: "Error rate", value: "4%" },
                  { label: "Frustration", value: "Low" },
                ],
              },
            ].map((mode, mi) => (
              <motion.div
                key={mi}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: mi * 0.12 }}
                className={`rounded-2xl border p-6 shadow-soft ${mode.color}`}
              >
                <p className={`mb-4 text-sm font-bold ${mode.accent}`}>{mode.label}</p>
                <div className="space-y-2 mb-5">
                  {mode.items.map((item, ii) => {
                    const Icon = item.icon;
                    return (
                      <div key={ii} className="flex items-center gap-2 text-xs">
                        <Icon className={`h-3.5 w-3.5 shrink-0 ${item.cls}`} />
                        <span className="text-muted">{item.text}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-current/10 pt-4 space-y-1.5">
                  {mode.metrics.map((m, mi2) => (
                    <div key={mi2} className="flex justify-between text-xs">
                      <span className="text-muted">{m.label}</span>
                      <span className={`font-semibold ${mode.accent}`}>{m.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Scene 15: Final */}
        <section className="pb-8">
          <SceneLabel n={15} title="The Foundation" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-bg to-violet-500/10 p-8 md:p-12 text-center shadow-soft-lg"
          >
            {/* Learners converging */}
            <div className="mb-8 flex flex-wrap justify-center gap-4">
              {LEARNERS.map((l, i) => (
                <motion.div
                  key={l.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.12 }}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border px-4 py-3 ${l.bg} ${l.border}`}
                >
                  <span className="text-2xl">{l.emoji}</span>
                  <span className={`text-[10px] font-semibold ${l.color}`}>{l.title}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mb-6 flex justify-center items-center gap-3 text-sm text-muted"
            >
              <div className="h-px w-12 bg-border/60" />
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-400 font-semibold text-xs">
                All complete the course
              </span>
              <div className="h-px w-12 bg-border/60" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="space-y-3"
            >
              <p className="text-lg font-bold text-muted">
                Accessibility isn't a feature.
              </p>
              <p className="text-2xl md:text-3xl font-black text-fg leading-tight">
                It's the <span className="text-cyan-400">foundation</span> of great product design.
              </p>
              <p className="text-base text-muted max-w-md mx-auto mt-2 leading-relaxed">
                Because education is only powerful when{" "}
                <span className="text-fg font-semibold">everyone</span> can access it.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.0 }}
              className="mt-10 flex flex-wrap justify-center gap-3"
            >
              <Link
                href="/domain-knowledge/edtech"
                className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-elevated px-6 py-2.5 text-sm font-semibold text-muted transition-all hover:border-cyan-500/30 hover:text-fg"
              >
                <ArrowLeft className="h-4 w-4" />
                More EdTech Concepts
              </Link>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setPhase("intro");
                  setContrastVal(20);
                  setIssues(A11Y_ISSUES.map((i) => ({ ...i, fixed: false })));
                  setScore(42);
                  setA11yToggles({
                    screenReader: false,
                    captions: false,
                    keyboard: false,
                    highContrast: false,
                    largeFont: false,
                    darkMode: false,
                    reduceMotion: false,
                    altText: false,
                  });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/30"
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
