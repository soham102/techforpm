"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Monitor,
  Smartphone,
  Tablet,
  Type,
  Sun,
  Moon,
  RotateCcw,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
  Eye,
  Layers,
  Activity,
  BarChart3,
  ChevronRight,
  Play,
  Award,
  Maximize2,
} from "lucide-react";

// ─── Analytics ───────────────────────────────────────────────────────────────

function trackEvent(name: string): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any)?.posthog?.capture?.(name);
  } catch {}
}

// ─── Types ───────────────────────────────────────────────────────────────────

type Phase =
  | "intro"
  | "pdf_epub"
  | "devices"
  | "reflowable"
  | "fixed"
  | "compare"
  | "challenge"
  | "explore"
  | "complete";

type DeviceType = "mobile" | "laptop" | "ereader" | "tablet";
type ThemeType = "light" | "dark" | "sepia";
type EpubType = "reflowable" | "fixed";

// ─── Data ────────────────────────────────────────────────────────────────────

const DEVICES: Array<{
  id: DeviceType;
  label: string;
  emoji: string;
  maxWidth: number;
  fontSize: number;
  pageCount: number;
  desc: string;
}> = [
  {
    id: "mobile",
    label: "Mobile",
    emoji: "📱",
    maxWidth: 200,
    fontSize: 12,
    pageCount: 312,
    desc: "Text wraps to narrow column",
  },
  {
    id: "laptop",
    label: "Laptop",
    emoji: "💻",
    maxWidth: 360,
    fontSize: 15,
    pageCount: 247,
    desc: "Comfortable wide layout",
  },
  {
    id: "ereader",
    label: "eReader",
    emoji: "📖",
    maxWidth: 260,
    fontSize: 14,
    pageCount: 268,
    desc: "E-ink optimised spacing",
  },
  {
    id: "tablet",
    label: "Tablet",
    emoji: "📱",
    maxWidth: 320,
    fontSize: 14,
    pageCount: 252,
    desc: "Two-column potential",
  },
];

const CHALLENGE_PRODUCTS: Array<{
  id: string;
  name: string;
  emoji: string;
  description: string;
  correct: EpubType;
  reason: string;
}> = [
  {
    id: "novel",
    name: "Novel Reading App",
    emoji: "📚",
    description:
      "Long-form fiction with minimal images. Users want to customise font size, margins, and theme.",
    correct: "reflowable",
    reason:
      "Text-heavy content should adapt to every reader's preferred settings and screen size.",
  },
  {
    id: "children",
    name: "Interactive Children's Book",
    emoji: "🎨",
    description:
      "Illustrated pages where character positions and speech bubbles are part of the story.",
    correct: "fixed",
    reason:
      "The exact placement of images and text IS the experience. Reflowing would break the narrative.",
  },
  {
    id: "programming",
    name: "Programming Handbook",
    emoji: "💻",
    description:
      "Code examples, technical diagrams, and step-by-step instructions for developers.",
    correct: "reflowable",
    reason:
      "Developers read on many devices. Text and code need to flow naturally across all screen sizes.",
  },
];

const FINAL_BOOKS: Array<{
  id: string;
  title: string;
  emoji: string;
  description: string;
  correct: EpubType;
  reason: string;
}> = [
  {
    id: "guide",
    title: "Programming Guide",
    emoji: "💻",
    description: "Text, code snippets, diagrams. Readers on phones, tablets, and laptops.",
    correct: "reflowable",
    reason: "Code and text need to flow naturally for readability across all devices.",
  },
  {
    id: "comic",
    title: "Comic Book",
    emoji: "💬",
    description: "Panel-based storytelling with speech bubbles placed precisely on artwork.",
    correct: "fixed",
    reason: "Panel layout is part of the narrative. Reflowing would destroy the visual story.",
  },
  {
    id: "science",
    title: "Interactive Science Textbook",
    emoji: "🔬",
    description: "Rich diagrams with labeled parts and embedded interactive elements.",
    correct: "fixed",
    reason:
      "Labeled diagrams require exact positioning to remain educational and usable.",
  },
];

const REAL_PRODUCTS: Array<{
  name: string;
  emoji: string;
  tag: string;
  color: string;
  bg: string;
  border: string;
  detail: string;
}> = [
  {
    name: "Amazon Kindle",
    emoji: "📚",
    tag: "Mostly Reflowable",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    detail:
      "Kindle primarily uses reflowable formats — readers control font size, family, line spacing, and margins. Fixed Layout is supported for illustrated children's books. The PM decision: reader comfort drives long-session engagement on any device.",
  },
  {
    name: "Apple Books",
    emoji: "📖",
    tag: "Supports Both",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    detail:
      "Apple Books natively supports EPUB 3 in both Reflowable and Fixed Layout. Reflowable for novels; FXL for illustrated titles. Apple's PM insight: full spec support attracts all publishers to the platform.",
  },
  {
    name: "Google Play Books",
    emoji: "📗",
    tag: "Responsive Reading",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    detail:
      "Google Play Books is built for reflowable EPUB — it even converts PDFs into flowing text. The PM insight: Google optimised for mobile-first reading. Reflowable content adapts to every Android device without extra production work.",
  },
  {
    name: "EdTech Platforms",
    emoji: "🎓",
    tag: "Fixed Layout Often",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    detail:
      "Interactive learning platforms often use Fixed Layout for drag-and-drop exercises, labeled diagrams, and embedded assessments. The trade-off: full design control at the cost of flexibility and accessibility.",
  },
];

const METRICS: Array<{
  label: string;
  reflowable: number;
  fixed: number;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { label: "Reading Comfort", reflowable: 95, fixed: 60, icon: Eye },
  { label: "Font Flexibility", reflowable: 100, fixed: 15, icon: Type },
  { label: "Accessibility", reflowable: 90, fixed: 45, icon: Activity },
  { label: "Visual Consistency", reflowable: 55, fixed: 98, icon: Layers },
  { label: "Device Compatibility", reflowable: 95, fixed: 65, icon: Monitor },
];

const INSIGHTS = [
  {
    emoji: "📱",
    title: "Responsive Design",
    body: "One EPUB, every screen. The format does the heavy lifting — not your engineering team.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },
  {
    emoji: "♿",
    title: "Accessibility",
    body: "Users customise their reading experience. That isn't a feature — it's respect.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    emoji: "🎨",
    title: "Visual Consistency",
    body: "When design carries meaning, Fixed Layout preserves exactly what the author intended.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    emoji: "⚖️",
    title: "Product Trade-off",
    body: "Flexibility vs. pixel-perfect design. The right answer depends entirely on what your content is.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    emoji: "😊",
    title: "Better UX",
    body: "Great PMs choose the format based on user needs — not what's technically easier to produce.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
];

// ─── Reusable: Book Reader ────────────────────────────────────────────────────

function BookReader({
  fontSize = 14,
  lineHeight = 1.7,
  theme = "dark" as ThemeType,
  isFixed = false,
  compact = false,
}: {
  fontSize?: number;
  lineHeight?: number;
  theme?: ThemeType;
  isFixed?: boolean;
  compact?: boolean;
}) {
  const bg =
    theme === "light"
      ? "bg-white"
      : theme === "sepia"
      ? "bg-amber-50"
      : "bg-[#12122a]";
  const textColor =
    theme === "light"
      ? "text-gray-800"
      : theme === "sepia"
      ? "text-amber-900"
      : "text-gray-100";
  const mutedText =
    theme === "light"
      ? "text-gray-500"
      : theme === "sepia"
      ? "text-amber-700"
      : "text-gray-400";
  const borderColor =
    theme === "light"
      ? "border-gray-200"
      : theme === "sepia"
      ? "border-amber-200"
      : "border-gray-800";
  const headerBg =
    theme === "light"
      ? "bg-gray-50 border-gray-200"
      : theme === "sepia"
      ? "bg-amber-100 border-amber-200"
      : "bg-[#0d0d1f] border-gray-800";

  const shortPara =
    "An API (Application Programming Interface) is a bridge that allows two software applications to communicate. Think of it as a waiter — you place your order, the waiter relays it to the kitchen, and brings back exactly what you asked for.";
  const longPara =
    "APIs enable developers to use functionality from external services without needing to understand how they work internally. When you log in with Google, that's an API. When you see a map embedded in a website, that's an API too.";

  return (
    <div
      className={`rounded-xl overflow-hidden border transition-all duration-300 ${bg} ${borderColor}`}
    >
      <div
        className={`flex items-center justify-between border-b px-3 py-2 ${headerBg}`}
      >
        <span className={`text-xs font-semibold ${mutedText}`}>
          API Fundamentals
        </span>
        <span
          className={`text-[10px] rounded-full px-2 py-0.5 font-semibold ${
            isFixed
              ? "bg-cyan-500/15 text-cyan-400"
              : "bg-pink-500/15 text-pink-400"
          }`}
        >
          {isFixed ? "Fixed" : "Reflowable"}
        </span>
      </div>
      <div
        className={`p-4 ${textColor} transition-all duration-300`}
        style={{
          fontSize: isFixed ? "14px" : `${fontSize}px`,
          lineHeight: isFixed ? 1.7 : lineHeight,
        }}
      >
        <p
          className="mb-3 font-bold"
          style={{ fontSize: isFixed ? "15px" : `${fontSize + 1}px` }}
        >
          Chapter 1: What Is an API?
        </p>
        {isFixed ? (
          <div className="relative">
            <div className="float-right ml-3 mb-2 flex h-14 w-14 items-center justify-center rounded-lg border border-pink-500/20 bg-pink-500/10 text-xl">
              🔌
            </div>
            <p className="text-[13px] leading-relaxed">{shortPara}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p>{shortPara}</p>
            {!compact && <p>{longPara}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Scene Label ─────────────────────────────────────────────────────────────

function SceneLabel({ n, title }: { n: number; title: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="mb-3 text-xs font-semibold uppercase tracking-widest text-pink-400"
    >
      Scene {n} · {title}
    </motion.p>
  );
}

// ─── Scene 2: PDF vs EPUB ─────────────────────────────────────────────────────

function PDFvsEPUBScene({ onContinue }: { onContinue: () => void }) {
  const [resized, setResized] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleResize = useCallback(() => {
    setResized(true);
    setTimeout(() => setShowMessage(true), 700);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-bg/96 backdrop-blur-lg"
    >
      <div className="mx-auto w-full max-w-3xl px-5 py-10">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-pink-400"
        >
          Scene 2 · PDF vs EPUB
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-2 text-center text-2xl font-black text-fg"
        >
          Same content. Very different experience.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-8 text-center text-sm text-muted"
        >
          Click "Resize Browser" to see how each format responds.
        </motion.p>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* PDF */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="overflow-hidden rounded-2xl border border-rose-500/20 bg-surface"
          >
            <div className="flex items-center justify-between border-b border-border/50 bg-elevated px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
                </div>
                <span className="text-xs text-muted">document.pdf</span>
              </div>
              <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-400">
                PDF
              </span>
            </div>
            <div className="overflow-hidden p-1">
              <div
                className="overflow-hidden bg-white transition-all duration-700"
                style={{ width: resized ? "55%" : "100%" }}
              >
                <div className="p-3" style={{ minWidth: "220px" }}>
                  <p className="mb-1.5 text-[9px] font-bold text-gray-700">
                    API Fundamentals — Ch. 1
                  </p>
                  <div className="mb-2 flex h-8 items-center justify-center rounded bg-gray-100">
                    <span className="text-[7px] text-gray-400">
                      [Architecture Diagram — Fixed Size]
                    </span>
                  </div>
                  <p className="text-[7px] leading-tight text-gray-700">
                    An API (Application Programming Interface) is a bridge that
                    allows two software applications to communicate with each
                    other. Think of it as a waiter in a restaurant — you place
                    your order, the waiter relays it to the kitchen, and brings
                    back exactly what you asked for. APIs enable developers to
                    use functionality from external services.
                  </p>
                </div>
              </div>
            </div>
            <AnimatePresence>
              {resized && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden border-t border-rose-500/20 bg-rose-500/8 px-4 py-3"
                >
                  <div className="space-y-1.5">
                    {[
                      "Text gets tiny",
                      "Horizontal scrolling needed",
                      "Difficult to read",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <XCircle className="h-3.5 w-3.5 shrink-0 text-rose-400" />
                        <span className="text-xs text-rose-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* EPUB */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="overflow-hidden rounded-2xl border border-pink-500/20 bg-surface"
          >
            <div className="flex items-center justify-between border-b border-border/50 bg-elevated px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
                </div>
                <span className="text-xs text-muted">book.epub</span>
              </div>
              <span className="rounded-full border border-pink-500/30 bg-pink-500/10 px-2 py-0.5 text-[10px] font-semibold text-pink-400">
                EPUB
              </span>
            </div>
            <div className="p-1">
              <div
                className="overflow-hidden bg-[#12122a] transition-all duration-700"
                style={{
                  maxWidth: resized ? "65%" : "100%",
                  margin: "0 auto",
                }}
              >
                <div className="p-3">
                  <p className="mb-2 text-[11px] font-bold text-gray-200">
                    Chapter 1: What Is an API?
                  </p>
                  <p
                    className="text-gray-300 transition-all duration-700"
                    style={{ fontSize: resized ? "10px" : "11px" }}
                  >
                    {resized
                      ? "An API is a bridge that allows two software applications to communicate. Think of it as a waiter in a restaurant."
                      : "An API (Application Programming Interface) is a bridge that allows two software applications to communicate. Think of it as a waiter — you place your order, the waiter relays it, and brings back exactly what you asked for."}
                  </p>
                </div>
              </div>
            </div>
            <AnimatePresence>
              {resized && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden border-t border-pink-500/20 bg-emerald-500/8 px-4 py-3"
                >
                  <div className="space-y-1.5">
                    {[
                      "Text automatically rearranges",
                      "Comfortable reading",
                      "No horizontal scrolling",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                        <span className="text-xs text-emerald-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {!resized && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleResize}
              className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-8 py-3 text-sm font-bold text-pink-400 transition-colors hover:bg-pink-500/20"
            >
              Resize Browser
              <Maximize2 className="h-4 w-4" />
            </motion.button>
          </motion.div>
        )}

        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="mt-8 text-center"
            >
              <motion.p
                className="mb-6 text-3xl font-black text-fg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                EPUB adapts.{" "}
                <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                  PDF doesn&apos;t.
                </span>
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onContinue}
                className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-pink-500/30"
              >
                One EPUB, Multiple Devices
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Scene 3: Device Switcher ─────────────────────────────────────────────────

function DeviceSwitcherScene({ onContinue }: { onContinue: () => void }) {
  const [active, setActive] = useState<DeviceType>("laptop");
  const [visited, setVisited] = useState<Set<DeviceType>>(
    new Set<DeviceType>(["laptop"])
  );

  const handleSelect = useCallback((id: DeviceType) => {
    setActive(id);
    setVisited((prev) => new Set<DeviceType>(Array.from(prev).concat(id)));
  }, []);

  const currentDevice = DEVICES.find((d) => d.id === active)!;
  const allVisited = DEVICES.every((d) => visited.has(d.id));

  const deviceIcons: Record<DeviceType, React.ComponentType<{ className?: string }>> = {
    mobile: Smartphone,
    laptop: Monitor,
    ereader: BookOpen,
    tablet: Tablet,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-bg/96 backdrop-blur-lg"
    >
      <div className="mx-auto w-full max-w-2xl px-5 py-10">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-pink-400"
        >
          Scene 3 · Device Switcher
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-2 text-center text-2xl font-black text-fg"
        >
          One EPUB. Every device.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-8 text-center text-sm text-muted"
        >
          Click each device to see the same book automatically adapt.
        </motion.p>

        {/* Device selector */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 grid grid-cols-4 gap-3"
        >
          {DEVICES.map((device) => {
            const Icon = deviceIcons[device.id];
            const isActive = active === device.id;
            const wasVisited = visited.has(device.id);
            return (
              <motion.button
                key={device.id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(device.id)}
                className={`relative flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all duration-200 ${
                  isActive
                    ? "border-pink-500/50 bg-pink-500/10 shadow-lg shadow-pink-500/15"
                    : wasVisited
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-border/50 bg-surface hover:border-pink-500/30 hover:bg-pink-500/5"
                }`}
              >
                {wasVisited && !isActive && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500"
                  >
                    <CheckCircle className="h-3 w-3 text-white" />
                  </motion.span>
                )}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    isActive ? "bg-pink-500/20" : "bg-elevated"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      isActive ? "text-pink-400" : "text-muted"
                    }`}
                  />
                </div>
                <span
                  className={`text-xs font-semibold ${
                    isActive ? "text-pink-400" : "text-muted"
                  }`}
                >
                  {device.emoji} {device.label}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Book preview */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.35 }}
            className="mb-5 flex justify-center"
          >
            <div
              className="overflow-hidden rounded-2xl border border-pink-500/20 bg-[#12122a] shadow-lg shadow-pink-500/10 transition-all duration-500"
              style={{ width: `${currentDevice.maxWidth}px`, maxWidth: "100%" }}
            >
              <div className="flex items-center justify-between border-b border-gray-800 bg-[#0d0d1f] px-3 py-2">
                <span className="text-[10px] font-semibold text-gray-400">
                  API Fundamentals
                </span>
                <span className="text-[10px] text-gray-500">
                  p.1 of {currentDevice.pageCount}
                </span>
              </div>
              <div
                className="p-4 text-gray-200 transition-all duration-500"
                style={{
                  fontSize: `${currentDevice.fontSize}px`,
                  lineHeight: 1.75,
                }}
              >
                <p
                  className="mb-2 font-bold text-white"
                  style={{ fontSize: `${currentDevice.fontSize + 1}px` }}
                >
                  Chapter 1: What Is an API?
                </p>
                <p className="text-gray-300">
                  An API (Application Programming Interface) is a bridge that
                  allows two software applications to communicate. Think of it as
                  a waiter — you place your order, the waiter relays it to the
                  kitchen, and brings back exactly what you asked for.
                </p>
              </div>
              <div className="border-t border-gray-800 bg-[#0d0d1f] px-3 py-2">
                <p className="text-[10px] text-pink-400">{currentDevice.desc}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Stats row */}
        <div className="mb-6 grid grid-cols-3 gap-3 text-center">
          {[
            { label: "Page Count", value: `${currentDevice.pageCount} pages` },
            { label: "Font Size", value: `${currentDevice.fontSize}px` },
            {
              label: "Devices Tried",
              value: `${visited.size} / ${DEVICES.length}`,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border/50 bg-surface px-3 py-3"
            >
              <p className="mb-0.5 text-xs text-muted">{stat.label}</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={stat.value}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-sm font-bold text-pink-400"
                >
                  {stat.value}
                </motion.p>
              </AnimatePresence>
            </div>
          ))}
        </div>

        {!allVisited ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-muted"
          >
            Try all {DEVICES.length} devices to continue —{" "}
            <span className="text-fg font-semibold">
              {DEVICES.length - visited.size} left
            </span>
          </motion.p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="mb-4 text-sm font-semibold text-emerald-400">
              ✓ Page count changed. Font adapted. Same EPUB file.
            </p>
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onContinue}
              className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-pink-500/30"
            >
              Experience Reflowable EPUB
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Scene 4: Reflowable EPUB ─────────────────────────────────────────────────

function ReflowableScene({ onContinue }: { onContinue: () => void }) {
  const [fontSize, setFontSize] = useState(14);
  const [lineHeight, setLineHeight] = useState(1.7);
  const [theme, setTheme] = useState<ThemeType>("dark");
  const [isLandscape, setIsLandscape] = useState(false);
  const [interacted, setInteracted] = useState(0);

  const markInteracted = useCallback(() => {
    setInteracted((p) => Math.min(p + 1, 4));
  }, []);

  const themes: Array<{ id: ThemeType; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: "dark", label: "Dark", icon: Moon },
    { id: "light", label: "Light", icon: Sun },
    { id: "sepia", label: "Sepia", icon: BookOpen },
  ];

  const bg =
    theme === "light"
      ? "bg-white"
      : theme === "sepia"
      ? "bg-amber-50"
      : "bg-[#12122a]";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-bg/96 backdrop-blur-lg"
    >
      <div className="mx-auto w-full max-w-3xl px-5 py-10">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-pink-400"
        >
          Scene 4 · Reflowable EPUB
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-2 text-center text-2xl font-black text-fg"
        >
          You control the reading experience.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-8 text-center text-sm text-muted"
        >
          Every control instantly updates the book. This is what Reflowable EPUB enables.
        </motion.p>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Font size */}
            <div className="rounded-2xl border border-border/50 bg-surface p-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">
                <Type className="h-4 w-4 text-pink-400" />
                Font Size
                <span className="ml-auto text-sm font-bold text-pink-400">
                  {fontSize}px
                </span>
              </p>
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setFontSize((p) => Math.max(11, p - 1));
                    markInteracted();
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/50 bg-elevated text-muted hover:border-pink-500/30 hover:text-pink-400 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </motion.button>
                <div className="flex-1">
                  <input
                    type="range"
                    min={11}
                    max={22}
                    value={fontSize}
                    onChange={(e) => {
                      setFontSize(Number(e.target.value));
                      markInteracted();
                    }}
                    className="w-full accent-pink-500"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setFontSize((p) => Math.min(22, p + 1));
                    markInteracted();
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/50 bg-elevated text-muted hover:border-pink-500/30 hover:text-pink-400 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </motion.button>
              </div>
            </div>

            {/* Line spacing */}
            <div className="rounded-2xl border border-border/50 bg-surface p-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">
                <Layers className="h-4 w-4 text-pink-400" />
                Line Spacing
                <span className="ml-auto text-sm font-bold text-pink-400">
                  {lineHeight.toFixed(1)}
                </span>
              </p>
              <input
                type="range"
                min={14}
                max={24}
                value={Math.round(lineHeight * 10)}
                onChange={(e) => {
                  setLineHeight(Number(e.target.value) / 10);
                  markInteracted();
                }}
                className="w-full accent-pink-500"
              />
              <div className="mt-1 flex justify-between text-[10px] text-muted">
                <span>Compact</span>
                <span>Spacious</span>
              </div>
            </div>

            {/* Theme */}
            <div className="rounded-2xl border border-border/50 bg-surface p-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">
                <Sun className="h-4 w-4 text-pink-400" />
                Theme
              </p>
              <div className="grid grid-cols-3 gap-2">
                {themes.map((t) => {
                  const Icon = t.icon;
                  return (
                    <motion.button
                      key={t.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setTheme(t.id);
                        markInteracted();
                      }}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs font-semibold transition-all ${
                        theme === t.id
                          ? "border-pink-500/50 bg-pink-500/10 text-pink-400"
                          : "border-border/50 bg-elevated text-muted hover:border-pink-500/20"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {t.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Orientation */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setIsLandscape((p) => !p);
                markInteracted();
              }}
              className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 transition-all ${
                isLandscape
                  ? "border-pink-500/50 bg-pink-500/10"
                  : "border-border/50 bg-surface"
              }`}
            >
              <div className="flex items-center gap-2">
                <RotateCcw
                  className={`h-4 w-4 ${
                    isLandscape ? "text-pink-400" : "text-muted"
                  }`}
                />
                <span
                  className={`text-sm font-semibold ${
                    isLandscape ? "text-pink-400" : "text-fg"
                  }`}
                >
                  {isLandscape ? "Landscape" : "Portrait"}
                </span>
              </div>
              <span className="text-xs text-muted">Tap to rotate</span>
            </motion.button>
          </motion.div>

          {/* Live book preview */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="flex items-start justify-center"
          >
            <div
              className={`overflow-hidden rounded-2xl border border-pink-500/20 shadow-lg shadow-pink-500/10 transition-all duration-500 ${bg}`}
              style={{
                width: isLandscape ? "100%" : "85%",
                maxWidth: isLandscape ? "100%" : "280px",
              }}
            >
              <BookReader
                fontSize={fontSize}
                lineHeight={lineHeight}
                theme={theme}
              />
              <div
                className={`flex items-center justify-between border-t px-3 py-2 ${
                  theme === "light"
                    ? "border-gray-200 bg-gray-50"
                    : theme === "sepia"
                    ? "border-amber-200 bg-amber-100"
                    : "border-gray-800 bg-[#0d0d1f]"
                }`}
              >
                <span
                  className={`text-[10px] ${
                    theme === "light"
                      ? "text-gray-400"
                      : theme === "sepia"
                      ? "text-amber-600"
                      : "text-gray-500"
                  }`}
                >
                  {isLandscape ? "Landscape" : "Portrait"}
                </span>
                <span
                  className={`text-[10px] font-semibold ${
                    theme === "light"
                      ? "text-gray-500"
                      : theme === "sepia"
                      ? "text-amber-700"
                      : "text-gray-400"
                  }`}
                >
                  {fontSize}px · {lineHeight.toFixed(1)} spacing
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 rounded-2xl border border-pink-500/20 bg-pink-500/8 px-5 py-4 text-center"
        >
          <p className="text-sm font-bold text-pink-300">
            Perfect for text-heavy content.
          </p>
          <p className="mt-1 text-xs text-muted">
            Every reader gets the experience that works for them.
          </p>
        </motion.div>

        {interacted >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onContinue}
              className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-pink-500/30"
            >
              Explore Fixed Layout EPUB
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        )}
        {interacted < 2 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center text-sm text-muted"
          >
            Use at least 2 controls to continue
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Scene 5: Fixed Layout EPUB ───────────────────────────────────────────────

function FixedLayoutScene({ onContinue }: { onContinue: () => void }) {
  const [viewportShrunk, setViewportShrunk] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [triedResize, setTriedResize] = useState(false);
  const [triedZoom, setTriedZoom] = useState(false);

  const FXL_EXAMPLES = [
    { emoji: "📚", label: "Children's Books", desc: "Characters at precise positions" },
    { emoji: "💬", label: "Comics & Manga", desc: "Speech bubbles can't move" },
    { emoji: "🔬", label: "Interactive Textbooks", desc: "Labeled diagrams stay exact" },
    { emoji: "🎨", label: "Graphic-rich Learning", desc: "Visual design tells the story" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-bg/96 backdrop-blur-lg"
    >
      <div className="mx-auto w-full max-w-3xl px-5 py-10">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-cyan-400"
        >
          Scene 5 · Fixed Layout EPUB
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-2 text-center text-2xl font-black text-fg"
        >
          Visual consistency comes first.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-8 text-center text-sm text-muted"
        >
          Try resizing and zooming. Notice what happens — and what doesn&apos;t.
        </motion.p>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Fixed book preview */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div
              className="overflow-hidden rounded-2xl border border-cyan-500/20 bg-[#0a0a1a] shadow-lg shadow-cyan-500/10 transition-all duration-700"
              style={{
                width: viewportShrunk ? "70%" : "100%",
                transform: zoomed ? "scale(1.15)" : "scale(1)",
                transformOrigin: "top left",
              }}
            >
              <div className="flex items-center justify-between border-b border-gray-800 bg-[#050510] px-3 py-2">
                <span className="text-[10px] font-semibold text-gray-400">
                  API Fundamentals — Illustrated
                </span>
                <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-[10px] font-semibold text-cyan-400">
                  FXL
                </span>
              </div>
              {/* Fixed layout content */}
              <div className="relative p-4" style={{ minHeight: "180px" }}>
                {/* Precisely placed illustration */}
                <div
                  className="absolute right-4 top-4 flex h-20 w-20 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-3xl"
                  style={{ position: "absolute" }}
                >
                  🔌
                </div>
                <div className="pr-24">
                  <p
                    className="mb-1 text-sm font-bold text-white"
                    style={{ fontSize: "13px" }}
                  >
                    Chapter 1: APIs
                  </p>
                  <p
                    className="text-gray-300 leading-relaxed"
                    style={{ fontSize: "11px" }}
                  >
                    An API is a bridge between two software systems. The
                    diagram on the right shows the connection flow.
                  </p>
                  {/* Positioned label arrow */}
                  <div
                    className="absolute right-16 top-16 text-[8px] text-cyan-400 font-semibold"
                    style={{ position: "absolute" }}
                  >
                    ↑ Connector
                  </div>
                </div>
                {/* Bottom positioned elements */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="h-6 w-12 rounded bg-cyan-500/20 flex items-center justify-center">
                    <span className="text-[8px] text-cyan-400">Client</span>
                  </div>
                  <ArrowRight className="h-3 w-3 text-cyan-400" />
                  <div className="h-6 w-12 rounded bg-pink-500/20 flex items-center justify-center">
                    <span className="text-[8px] text-pink-400">API</span>
                  </div>
                  <ArrowRight className="h-3 w-3 text-cyan-400" />
                  <div className="h-6 w-12 rounded bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-[8px] text-emerald-400">Server</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resize indicator */}
            <AnimatePresence>
              {viewportShrunk && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2"
                >
                  <p className="text-xs font-semibold text-amber-400">
                    Layout stays fixed — content clips at small viewports
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setViewportShrunk((p) => !p);
                  setTriedResize(true);
                }}
                className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all ${
                  viewportShrunk
                    ? "border-amber-500/40 bg-amber-500/15 text-amber-400"
                    : "border-border/50 bg-elevated text-muted hover:border-cyan-500/30 hover:text-cyan-400"
                }`}
              >
                {viewportShrunk ? "↔ Restore Size" : "⇔ Resize Viewport"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setZoomed((p) => !p);
                  setTriedZoom(true);
                }}
                className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all ${
                  zoomed
                    ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-400"
                    : "border-border/50 bg-elevated text-muted hover:border-cyan-500/30 hover:text-cyan-400"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                {zoomed ? "Zoom Out" : "Zoom In"}
              </motion.button>
            </div>
          </motion.div>

          {/* FXL use-cases */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-3"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              When to use Fixed Layout
            </p>
            {FXL_EXAMPLES.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-3 rounded-xl border border-border/50 bg-surface px-4 py-3"
              >
                <span className="text-xl">{item.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-fg">{item.label}</p>
                  <p className="text-xs text-muted">{item.desc}</p>
                </div>
              </motion.div>
            ))}

            <div className="mt-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/8 px-4 py-4">
              <p className="text-sm font-bold text-cyan-300">
                Zoom works. Everything else stays.
              </p>
              <p className="mt-1 text-xs text-muted">
                Fixed Layout sacrifices flexibility for pixel-perfect visual
                precision.
              </p>
            </div>
          </motion.div>
        </div>

        {triedResize && triedZoom ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onContinue}
              className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/25"
            >
              Compare Both Side by Side
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center text-sm text-muted"
          >
            Try both Resize and Zoom to continue
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Scene 6: Side-by-Side Comparison ────────────────────────────────────────

function CompareScene({ onContinue }: { onContinue: () => void }) {
  const [fontSize, setFontSize] = useState(14);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [zoomed, setZoomed] = useState(false);
  const [actionsUsed, setActionsUsed] = useState(0);

  const COMPARE_ROWS: Array<{
    feature: string;
    reflowable: string;
    fixed: string;
    rOk: boolean;
    fOk: boolean;
  }> = [
    { feature: "Text Moves", reflowable: "✅ Yes", fixed: "❌ No", rOk: true, fOk: false },
    {
      feature: "Images Fixed",
      reflowable: "❌ Repositions",
      fixed: "✅ Always",
      rOk: false,
      fOk: true,
    },
    {
      feature: "Font Customisation",
      reflowable: "✅ Full",
      fixed: "⚠ Limited",
      rOk: true,
      fOk: false,
    },
    {
      feature: "Responsive",
      reflowable: "✅ Yes",
      fixed: "❌ No",
      rOk: true,
      fOk: false,
    },
    {
      feature: "Accessibility",
      reflowable: "✅ Excellent",
      fixed: "⚠ Moderate",
      rOk: true,
      fOk: false,
    },
  ];

  const action = (fn: () => void) => () => {
    fn();
    setActionsUsed((p) => Math.min(p + 1, 3));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-bg/96 backdrop-blur-lg"
    >
      <div className="mx-auto w-full max-w-4xl px-5 py-10">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-pink-400"
        >
          Scene 6 · Side-by-Side Comparison
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-2 text-center text-2xl font-black text-fg"
        >
          Same controls. Different responses.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-8 text-center text-sm text-muted"
        >
          Use the controls below and observe how each EPUB type reacts.
        </motion.p>

        {/* Control bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-5 flex flex-wrap items-center justify-center gap-3"
        >
          {[
            {
              label: `Font ${fontSize}px`,
              icon: Plus,
              action: action(() => setFontSize((p) => Math.min(20, p + 2))),
              color: "pink",
            },
            {
              label: isLandscape ? "Portrait" : "Landscape",
              icon: RotateCcw,
              action: action(() => setIsLandscape((p) => !p)),
              color: "violet",
            },
            {
              label: isDark ? "Light Theme" : "Dark Theme",
              icon: isDark ? Sun : Moon,
              action: action(() => setIsDark((p) => !p)),
              color: "amber",
            },
            {
              label: zoomed ? "Zoom Out" : "Zoom In",
              icon: Eye,
              action: action(() => setZoomed((p) => !p)),
              color: "cyan",
            },
          ].map((btn) => {
            const Icon = btn.icon;
            return (
              <motion.button
                key={btn.label}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={btn.action}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition-all border-${btn.color}-500/30 bg-${btn.color}-500/10 text-${btn.color}-400 hover:bg-${btn.color}-500/20`}
              >
                <Icon className="h-3.5 w-3.5" />
                {btn.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Split screen */}
        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          {/* Reflowable */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <p className="mb-2 text-center text-xs font-bold uppercase tracking-widest text-pink-400">
              Reflowable
            </p>
            <div
              className={`overflow-hidden rounded-2xl border border-pink-500/20 transition-all duration-500 ${
                isDark ? "bg-[#12122a]" : "bg-white"
              }`}
              style={{
                maxWidth: isLandscape ? "100%" : "80%",
                margin: "0 auto",
                transform: zoomed ? "scale(1.08)" : "scale(1)",
                transformOrigin: "top center",
              }}
            >
              <div
                className={`border-b px-3 py-2 text-[10px] font-semibold ${
                  isDark
                    ? "border-gray-800 bg-[#0d0d1f] text-gray-400"
                    : "border-gray-200 bg-gray-50 text-gray-500"
                }`}
              >
                book.epub — Reflowable
              </div>
              <div
                className={`p-4 transition-all duration-500 ${
                  isDark ? "text-gray-100" : "text-gray-800"
                }`}
                style={{ fontSize: `${fontSize}px`, lineHeight: 1.7 }}
              >
                <p className="mb-2 font-bold">Chapter 1: What Is an API?</p>
                <p>
                  An API is a bridge that allows two software applications to
                  communicate. Think of it as a waiter in a restaurant.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Fixed */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="mb-2 text-center text-xs font-bold uppercase tracking-widest text-cyan-400">
              Fixed Layout
            </p>
            <div
              className="overflow-hidden rounded-2xl border border-cyan-500/20 bg-[#0a0a1a] transition-all duration-500"
              style={{
                transform: zoomed ? "scale(1.08)" : "scale(1)",
                transformOrigin: "top center",
              }}
            >
              <div className="border-b border-gray-800 bg-[#050510] px-3 py-2 text-[10px] font-semibold text-gray-400">
                book.epub — Fixed Layout
              </div>
              <div className="relative p-4" style={{ minHeight: "100px" }}>
                <div className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-xl">
                  🔌
                </div>
                <div className="pr-16 text-gray-200" style={{ fontSize: "13px", lineHeight: 1.7 }}>
                  <p className="mb-1 font-bold text-white" style={{ fontSize: "14px" }}>
                    Chapter 1
                  </p>
                  <p>
                    An API is a bridge between two software systems. The
                    diagram shows the connection.
                  </p>
                </div>
              </div>
              <div className="border-t border-cyan-500/10 bg-cyan-500/5 px-3 py-1.5">
                <p className="text-[10px] text-cyan-500/70">
                  Font controls have no effect on FXL
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 overflow-hidden rounded-2xl border border-border/50 bg-surface"
        >
          <div className="grid grid-cols-3 border-b border-border/50 bg-elevated px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted">
            <span>Feature</span>
            <span className="text-pink-400">Reflowable</span>
            <span className="text-cyan-400">Fixed Layout</span>
          </div>
          {COMPARE_ROWS.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-3 px-4 py-3 text-xs ${
                i < COMPARE_ROWS.length - 1 ? "border-b border-border/50" : ""
              }`}
            >
              <span className="font-semibold text-fg">{row.feature}</span>
              <span className={row.rOk ? "text-emerald-400" : "text-rose-400"}>
                {row.reflowable}
              </span>
              <span className={row.fOk ? "text-emerald-400" : "text-amber-400"}>
                {row.fixed}
              </span>
            </div>
          ))}
        </motion.div>

        {actionsUsed >= 2 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onContinue}
              className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-pink-500/30"
            >
              Take the Product Challenge
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        ) : (
          <p className="text-center text-sm text-muted">
            Use at least 2 controls above to continue
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Scene 7: Product Challenge ───────────────────────────────────────────────

function ChallengeScene({ onContinue }: { onContinue: () => void }) {
  const [answers, setAnswers] = useState<Record<string, EpubType>>({});
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const handleAnswer = useCallback(
    (productId: string, choice: EpubType) => {
      if (revealed.has(productId)) return;
      setAnswers((p) => ({ ...p, [productId]: choice }));
      setRevealed((p) => new Set<string>(Array.from(p).concat(productId)));
    },
    [revealed]
  );

  const allAnswered = CHALLENGE_PRODUCTS.every((p) => revealed.has(p.id));
  const correctCount = CHALLENGE_PRODUCTS.filter(
    (p) => answers[p.id] === p.correct
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-bg/96 backdrop-blur-lg"
    >
      <div className="mx-auto w-full max-w-2xl px-5 py-10">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-pink-400"
        >
          Scene 7 · Product Challenge
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-2 text-center text-2xl font-black text-fg"
        >
          Which format would you choose?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-8 text-center text-sm text-muted"
        >
          Three products. Pick Reflowable or Fixed Layout for each.
        </motion.p>

        <div className="space-y-4">
          {CHALLENGE_PRODUCTS.map((product, i) => {
            const isRevealed = revealed.has(product.id);
            const userAnswer = answers[product.id];
            const isCorrect = userAnswer === product.correct;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isRevealed
                    ? isCorrect
                      ? "border-emerald-500/40 bg-emerald-500/8"
                      : "border-rose-500/40 bg-rose-500/8"
                    : "border-border/50 bg-surface"
                }`}
              >
                <div className="p-5">
                  <div className="mb-3 flex items-start gap-3">
                    <span className="text-2xl">{product.emoji}</span>
                    <div>
                      <p className="font-bold text-fg">{product.name}</p>
                      <p className="text-sm text-muted">{product.description}</p>
                    </div>
                    {isRevealed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto shrink-0"
                      >
                        {isCorrect ? (
                          <CheckCircle className="h-6 w-6 text-emerald-400" />
                        ) : (
                          <XCircle className="h-6 w-6 text-rose-400" />
                        )}
                      </motion.div>
                    )}
                  </div>

                  {!isRevealed ? (
                    <div className="grid grid-cols-2 gap-2">
                      {(["reflowable", "fixed"] as EpubType[]).map((type) => (
                        <motion.button
                          key={type}
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleAnswer(product.id, type)}
                          className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                            type === "reflowable"
                              ? "border-pink-500/30 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20"
                              : "border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
                          }`}
                        >
                          {type === "reflowable" ? "Reflowable" : "Fixed Layout"}
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold ${
                            isCorrect ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {isCorrect ? "✓ Correct!" : "✗ Not quite —"}
                        </span>
                        <span className="text-xs text-muted">
                          Answer:{" "}
                          <span className="font-semibold text-fg">
                            {product.correct === "reflowable"
                              ? "Reflowable"
                              : "Fixed Layout"}
                          </span>
                        </span>
                      </div>
                      <p className="text-xs text-muted">{product.reason}</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {allAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <div className="mb-5 inline-flex items-center gap-3 rounded-2xl border border-border/50 bg-surface px-6 py-4">
              <Award className="h-8 w-8 text-pink-400" />
              <div className="text-left">
                <p className="text-2xl font-black text-fg">
                  {correctCount} / {CHALLENGE_PRODUCTS.length}
                </p>
                <p className="text-sm text-muted">
                  {correctCount === CHALLENGE_PRODUCTS.length
                    ? "Perfect score!"
                    : "Keep exploring to build intuition"}
                </p>
              </div>
            </div>
            <br />
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onContinue}
              className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-pink-500/30"
            >
              Explore the Full Picture
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Scene 13: Complete ───────────────────────────────────────────────────────

function CompleteOverlay({ onClose }: { onClose: () => void }) {
  const journey = [
    { emoji: "📱", label: "Mobile" },
    { emoji: "📱", label: "Tablet" },
    { emoji: "💻", label: "Laptop" },
    { emoji: "📖", label: "eReader" },
    { emoji: "📚", label: "Kindle" },
    { emoji: "📖", label: "Apple Books" },
    { emoji: "🎓", label: "Platform" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-bg/98 backdrop-blur-xl"
    >
      {/* Floating confetti dots */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            x: Math.random() * 600 - 300,
            y: Math.random() * 400 - 200,
            scale: 0,
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [0, -80 - Math.random() * 120],
            scale: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2.5 + Math.random() * 2,
            delay: Math.random() * 1.5,
            ease: "easeOut",
          }}
          className="pointer-events-none absolute rounded-full"
          style={{
            width: `${6 + Math.random() * 10}px`,
            height: `${6 + Math.random() * 10}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: [
              "#ec4899",
              "#a855f7",
              "#06b6d4",
              "#10b981",
              "#f59e0b",
            ][i % 5],
          }}
        />
      ))}

      <div className="relative mx-auto max-w-xl px-5 py-10 text-center">
        {/* Book journey animation */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex items-center justify-center gap-1 overflow-x-auto"
        >
          {journey.map((stop, i) => (
            <div key={i} className="flex items-center gap-1">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.15 }}
                className="flex h-10 w-10 flex-col items-center justify-center rounded-xl border border-pink-500/30 bg-pink-500/10 shrink-0"
              >
                <span className="text-base">{stop.emoji}</span>
              </motion.div>
              {i < journey.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  className="h-px w-3 bg-pink-500/40 origin-left"
                />
              )}
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5"
        >
          <Award className="h-3.5 w-3.5 text-pink-400" />
          <span className="text-xs font-semibold tracking-wide text-pink-400">
            Mission Complete
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-4 text-3xl font-black text-fg"
        >
          You delivered a great
          <br />
          <span className="bg-gradient-to-r from-pink-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
            reading experience.
          </span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8 space-y-3 text-left"
        >
          {[
            {
              icon: "📱",
              text: "Reflowable EPUB provides flexibility and accessibility across every device.",
            },
            {
              icon: "🎨",
              text: "Fixed Layout EPUB preserves rich visual experiences exactly as designed.",
            },
            {
              icon: "🧠",
              text: "Great PMs choose the right format based on user needs — not technology.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="flex items-start gap-3 rounded-xl border border-border/50 bg-surface px-4 py-3"
            >
              <span className="mt-0.5 text-lg">{item.icon}</span>
              <p className="text-sm text-muted">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col items-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-pink-500/30"
          >
            Back to EdTech Concepts
            <ArrowRight className="h-4 w-4" />
          </motion.button>
          <Link
            href="/domain-knowledge/edtech"
            className="text-sm text-muted transition-colors hover:text-fg"
          >
            Browse all simulations →
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EPUBPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [score, setScore] = useState(0);
  const [finalAnswers, setFinalAnswers] = useState<Record<string, EpubType>>({});
  const [finalRevealed, setFinalRevealed] = useState<Set<string>>(new Set());
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [metricEpubType, setMetricEpubType] = useState<EpubType>("reflowable");
  const exploreSectionRef = useRef<HTMLDivElement>(null);

  const handleStartSimulation = useCallback(() => {
    trackEvent("epub_simulation_started");
    setPhase("pdf_epub");
  }, []);

  const handlePDFComplete = useCallback(() => {
    trackEvent("pdf_vs_epub_completed");
    setPhase("devices");
  }, []);

  const handleDevicesComplete = useCallback(() => {
    trackEvent("device_switch_completed");
    setPhase("reflowable");
  }, []);

  const handleReflowableComplete = useCallback(() => {
    trackEvent("reflowable_explored");
    setPhase("fixed");
  }, []);

  const handleFixedComplete = useCallback(() => {
    trackEvent("fixed_layout_explored");
    setPhase("compare");
  }, []);

  const handleCompareComplete = useCallback(() => {
    setPhase("challenge");
  }, []);

  const handleChallengeComplete = useCallback(() => {
    trackEvent("product_challenge_completed");
    setPhase("explore");
    setTimeout(() => {
      exploreSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }, []);

  const handleFinalAnswer = useCallback(
    (bookId: string, choice: EpubType) => {
      if (finalRevealed.has(bookId)) return;
      const book = FINAL_BOOKS.find((b) => b.id === bookId);
      if (!book) return;
      setFinalAnswers((p) => ({ ...p, [bookId]: choice }));
      setFinalRevealed((p) => new Set<string>(Array.from(p).concat(bookId)));
      if (choice === book.correct) {
        setScore((p) => Math.min(100, p + 34));
      }
    },
    [finalRevealed]
  );

  const allFinalAnswered = FINAL_BOOKS.every((b) => finalRevealed.has(b.id));

  const handleSimulationComplete = useCallback(() => {
    trackEvent("epub_simulation_completed");
    setPhase("complete");
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      {/* ─── Scene 1: Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border/50 bg-bg">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(236,72,153,0.08) 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/10 blur-[140px]" />

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
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3.5 py-1"
          >
            <BookOpen className="h-3.5 w-3.5 text-pink-400" />
            <span className="text-xs font-semibold tracking-wide text-pink-400">
              EPUB · Electronic Publication
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mb-4 text-4xl font-black leading-tight tracking-tight text-fg md:text-5xl"
          >
            Read Anywhere,
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              On Any Device.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-10 max-w-lg text-[15px] leading-relaxed text-muted"
          >
            You&apos;re the Product Manager of a digital learning platform. Your
            job is to deliver the best reading experience across phones, tablets,
            laptops and eReaders. Can you choose the right EPUB format?
          </motion.p>

          {/* Mission card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mb-10 inline-block"
          >
            <div className="overflow-hidden rounded-2xl border border-pink-500/30 bg-pink-500/8 p-5 shadow-lg shadow-pink-500/10">
              <div className="mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-pink-400" />
                <p className="font-bold text-fg">API Fundamentals</p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: "Target Devices", value: "4" },
                  { label: "Experience Score", value: `${score}%` },
                  { label: "Goal", value: "100%" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={stat.value}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-xl font-black text-pink-400"
                      >
                        {stat.value}
                      </motion.p>
                    </AnimatePresence>
                    <p className="text-[10px] text-muted">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStartSimulation}
              className="inline-flex items-center gap-2.5 rounded-full bg-pink-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-500/30 transition-shadow hover:shadow-xl hover:shadow-pink-500/40"
            >
              <Play className="h-4 w-4" />
              Start Simulation
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ─── Overlays: Scenes 2–7 ─────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === "pdf_epub" && (
          <PDFvsEPUBScene key="pdf" onContinue={handlePDFComplete} />
        )}
        {phase === "devices" && (
          <DeviceSwitcherScene key="devices" onContinue={handleDevicesComplete} />
        )}
        {phase === "reflowable" && (
          <ReflowableScene key="reflowable" onContinue={handleReflowableComplete} />
        )}
        {phase === "fixed" && (
          <FixedLayoutScene key="fixed" onContinue={handleFixedComplete} />
        )}
        {phase === "compare" && (
          <CompareScene key="compare" onContinue={handleCompareComplete} />
        )}
        {phase === "challenge" && (
          <ChallengeScene key="challenge" onContinue={handleChallengeComplete} />
        )}
        {phase === "complete" && (
          <CompleteOverlay
            key="complete"
            onClose={() => {
              window.location.href = "/domain-knowledge/edtech";
            }}
          />
        )}
      </AnimatePresence>

      {/* ─── Scenes 8–12: Scrollable Educational Content ─────────────────── */}
      <div
        ref={exploreSectionRef}
        className="mx-auto max-w-4xl space-y-20 px-5 py-20"
      >
        {/* Scene 8: Accessibility Connection */}
        <section>
          <SceneLabel n={8} title="Accessibility Connection" />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-2 text-2xl font-black text-fg"
          >
            Who benefits from Reflowable EPUB?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-8 text-sm text-muted"
          >
            See how the same book behaves for a reader with visual impairment.
          </motion.p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Reflowable — large font */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-500/10">
                  <Eye className="h-4 w-4 text-pink-400" />
                </div>
                <p className="text-sm font-semibold text-fg">Reflowable EPUB</p>
                <span className="text-xs text-muted">· 20px font</span>
              </div>
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="overflow-hidden rounded-2xl border border-pink-500/20 shadow-soft"
              >
                <BookReader fontSize={20} lineHeight={1.9} theme="dark" />
                <div className="border-t border-gray-800 bg-[#0d0d1f] px-4 py-2">
                  <p className="flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Everything adapts beautifully
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Fixed Layout — same large font attempt */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10">
                  <Layers className="h-4 w-4 text-cyan-400" />
                </div>
                <p className="text-sm font-semibold text-fg">Fixed Layout EPUB</p>
                <span className="text-xs text-muted">· 20px attempted</span>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="overflow-hidden rounded-2xl border border-cyan-500/20 shadow-soft"
              >
                <BookReader fontSize={14} lineHeight={1.7} theme="dark" isFixed />
                <div className="border-t border-gray-800 bg-[#0d0d1f] px-4 py-2">
                  <p className="flex items-center gap-2 text-xs text-amber-400">
                    <XCircle className="h-3.5 w-3.5" />
                    Font controls have no effect
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 rounded-2xl border border-pink-500/20 bg-pink-500/8 px-5 py-4 text-center"
          >
            <p className="font-semibold text-pink-300">
              Reflowable EPUB greatly improves accessibility.
            </p>
            <p className="mt-1 text-sm text-muted">
              1.3 billion people globally have disabilities. Accessibility
              isn&apos;t a nice-to-have — it&apos;s scale.
            </p>
          </motion.div>
        </section>

        {/* Scene 9: Reading Experience Dashboard */}
        <section>
          <SceneLabel n={9} title="Reading Experience Dashboard" />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-2 text-2xl font-black text-fg"
          >
            Compare the metrics. Make the call.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-6 text-sm text-muted"
          >
            Switch between EPUB types to see how each metric changes.
          </motion.p>

          {/* Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 rounded-2xl border border-border/50 bg-surface p-1.5">
              {(["reflowable", "fixed"] as EpubType[]).map((type) => (
                <motion.button
                  key={type}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setMetricEpubType(type)}
                  className={`rounded-xl px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                    metricEpubType === type
                      ? type === "reflowable"
                        ? "bg-pink-500 text-white shadow-md shadow-pink-500/30"
                        : "bg-cyan-500 text-white shadow-md shadow-cyan-500/30"
                      : "text-muted hover:text-fg"
                  }`}
                >
                  {type === "reflowable" ? "Reflowable" : "Fixed Layout"}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {METRICS.map((metric, i) => {
              const Icon = metric.icon;
              const value =
                metricEpubType === "reflowable"
                  ? metric.reflowable
                  : metric.fixed;
              const color =
                value >= 80
                  ? "bg-emerald-500"
                  : value >= 50
                  ? "bg-amber-500"
                  : "bg-rose-500";
              const textColor =
                value >= 80
                  ? "text-emerald-400"
                  : value >= 50
                  ? "text-amber-400"
                  : "text-rose-400";

              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="rounded-2xl border border-border/50 bg-surface p-5 shadow-soft"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-elevated">
                      <Icon className="h-4 w-4 text-muted" />
                    </div>
                    <p className="text-sm font-semibold text-fg">
                      {metric.label}
                    </p>
                  </div>
                  <div className="mb-2 flex items-end justify-between">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={`${metric.label}-${metricEpubType}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className={`text-2xl font-black ${textColor}`}
                      >
                        {value}%
                      </motion.p>
                    </AnimatePresence>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-elevated">
                    <motion.div
                      className={`h-full rounded-full ${color}`}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Scene 10: Real Product Examples */}
        <section>
          <SceneLabel n={10} title="Real Product Examples" />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-2 text-2xl font-black text-fg"
          >
            How did real products choose?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-8 text-sm text-muted"
          >
            Click each card to understand the PM thinking behind the decision.
          </motion.p>

          <div className="grid gap-4 sm:grid-cols-2">
            {REAL_PRODUCTS.map((product, i) => {
              const isExpanded = expandedProduct === product.name;
              return (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  onClick={() =>
                    setExpandedProduct(isExpanded ? null : product.name)
                  }
                  className={`cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ${product.border} ${product.bg} hover:shadow-soft-lg`}
                >
                  <div className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{product.emoji}</span>
                      <div>
                        <p className="font-bold text-fg">{product.name}</p>
                        <span
                          className={`text-xs font-semibold ${product.color}`}
                        >
                          {product.tag}
                        </span>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="h-5 w-5 text-muted" />
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border/30 px-5 py-4">
                          <p className="text-sm leading-relaxed text-muted">
                            {product.detail}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Scene 11: Product Thinking */}
        <section>
          <SceneLabel n={11} title="Product Thinking" />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-2xl font-black text-fg"
          >
            The PM lens on EPUB.
          </motion.h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INSIGHTS.map((insight, i) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className={`rounded-2xl border p-5 transition-all duration-200 ${insight.border} ${insight.bg}`}
              >
                <span className="mb-3 block text-2xl">{insight.emoji}</span>
                <p className={`mb-2 font-bold ${insight.color}`}>
                  {insight.title}
                </p>
                <p className="text-sm leading-relaxed text-muted">
                  {insight.body}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Scene 12: Final Challenge */}
        <section>
          <SceneLabel n={12} title="Final Challenge" />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-2 text-2xl font-black text-fg"
          >
            Three books. Choose the right format.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-6 text-sm text-muted"
          >
            Apply everything you&apos;ve learned. Your Reading Experience Score
            depends on it.
          </motion.p>

          {/* Score bar */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 rounded-2xl border border-border/50 bg-surface p-5 shadow-soft"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-pink-400" />
                <span className="text-sm font-semibold text-fg">
                  Reading Experience Score
                </span>
              </div>
              <motion.span
                key={score}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`text-2xl font-black ${
                  score === 100
                    ? "text-emerald-400"
                    : score >= 66
                    ? "text-amber-400"
                    : "text-pink-400"
                }`}
              >
                {score}%
              </motion.span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-elevated">
              <motion.div
                className={`h-full rounded-full transition-colors ${
                  score === 100
                    ? "bg-emerald-500"
                    : score >= 66
                    ? "bg-amber-500"
                    : "bg-pink-500"
                }`}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          <div className="space-y-4">
            {FINAL_BOOKS.map((book, i) => {
              const isRevealed = finalRevealed.has(book.id);
              const userAnswer = finalAnswers[book.id];
              const isCorrect = userAnswer === book.correct;

              return (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isRevealed
                      ? isCorrect
                        ? "border-emerald-500/40 bg-emerald-500/8"
                        : "border-rose-500/40 bg-rose-500/8"
                      : "border-border/50 bg-surface"
                  }`}
                >
                  <div className="p-5">
                    <div className="mb-3 flex items-start gap-3">
                      <span className="text-2xl">{book.emoji}</span>
                      <div className="flex-1">
                        <p className="font-bold text-fg">{book.title}</p>
                        <p className="text-sm text-muted">{book.description}</p>
                      </div>
                      {isRevealed && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="shrink-0"
                        >
                          {isCorrect ? (
                            <CheckCircle className="h-6 w-6 text-emerald-400" />
                          ) : (
                            <XCircle className="h-6 w-6 text-rose-400" />
                          )}
                        </motion.div>
                      )}
                    </div>

                    {!isRevealed ? (
                      <div className="grid grid-cols-2 gap-2">
                        {(["reflowable", "fixed"] as EpubType[]).map((type) => (
                          <motion.button
                            key={type}
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleFinalAnswer(book.id, type)}
                            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                              type === "reflowable"
                                ? "border-pink-500/30 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20"
                                : "border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
                            }`}
                          >
                            {type === "reflowable" ? "Reflowable" : "Fixed Layout"}
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-semibold ${
                              isCorrect ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            {isCorrect ? "✓ Correct!" : "✗ Not quite —"}
                          </span>
                          <span className="text-xs text-muted">
                            Best choice:{" "}
                            <span className="font-semibold text-fg">
                              {book.correct === "reflowable"
                                ? "Reflowable"
                                : "Fixed Layout"}
                            </span>
                          </span>
                        </div>
                        <p className="text-xs text-muted">{book.reason}</p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Completion */}
          {allFinalAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="mt-8 overflow-hidden rounded-2xl border border-pink-500/40 bg-pink-500/10 p-8 text-center shadow-lg shadow-pink-500/15"
            >
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="mb-3 text-5xl"
              >
                🎉
              </motion.p>
              <p className="mb-1 text-2xl font-black text-fg">
                {score === 100
                  ? "Perfect Score!"
                  : score >= 66
                  ? "Well Done!"
                  : "Good Effort!"}
              </p>
              <p className="mb-6 text-sm text-muted">
                {score === 100
                  ? "You chose the right EPUB format for every content type."
                  : "Every decision teaches you to think about content and user needs together."}
              </p>
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSimulationComplete}
                className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-500/30"
              >
                <Award className="h-4 w-4" />
                Complete the Mission
              </motion.button>
            </motion.div>
          )}
        </section>
      </div>

      {/* ─── Complete Overlay ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === "complete" && (
          <CompleteOverlay
            key="complete-final"
            onClose={() => {
              window.location.href = "/domain-knowledge/edtech";
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
