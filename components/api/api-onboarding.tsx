"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight, Rocket, Play } from "lucide-react";

/* ─── Constants ─────────────────────────────────────────────────────────────── */
const STORAGE_KEY = "pmverse-api-onboarding-v2";

/* ─── Steps (each targetId maps to a section id on the page) ───────────────── */
const STEPS = [
  {
    targetId: "analogy",
    badge: "01",
    title: "Start with the analogy",
    body: "APIs work like a restaurant waiter — see the request travel from app → API → server. Click the animated nodes to explore.",
  },
  {
    targetId: "product",
    badge: "02",
    title: "A real app, step by step",
    body: "Tap each node in this food-delivery flow to see what actually happens behind every screen tap.",
  },
  {
    targetId: "playground",
    badge: "03",
    title: "Try it yourself",
    body: "Simulate real API calls — place an order, update it, cancel it. This is what product teams review every sprint.",
  },
  {
    targetId: "why",
    badge: "04",
    title: "Why this matters for you",
    body: "Three realities every PM runs into when working with APIs — read these, they'll change how you write specs.",
  },
  {
    targetId: "quiz",
    badge: "05",
    title: "Test your instinct",
    body: "One real-world scenario. Pick what a strong PM would do — this is a learning moment.",
  },
] as const;

const TOTAL = STEPS.length;

/* ─── Spotlight rect hook ───────────────────────────────────────────────────── */
function useSpotlightRect(targetId: string, step: number) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    setRect(null);
    const el = document.getElementById(targetId);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });

    const measure = () => setRect(el.getBoundingClientRect());
    const t = setTimeout(measure, 520);

    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });

    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [targetId, step]);

  return rect;
}

/* ─── SVG spotlight overlay ─────────────────────────────────────────────────── */
function SpotlightOverlay({ rect }: { rect: DOMRect | null }) {
  const PAD = 14;
  const vh = typeof window !== "undefined" ? window.innerHeight : 900;

  const cx = rect ? rect.left - PAD : 0;
  const cy = rect ? Math.max(rect.top - PAD, 0) : 0;
  const cw = rect ? rect.width + PAD * 2 : 0;
  const ch = rect ? Math.min(rect.height + PAD * 2, vh * 0.68) : 0;
  const visible = !!rect;

  return (
    <svg
      className="pointer-events-none fixed inset-0 z-[90] h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <mask id="pmv-spot">
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <motion.rect
            animate={visible ? { x: cx, y: cy, width: cw, height: ch, opacity: 1 } : { opacity: 0, width: 0, height: 0 }}
            transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
            rx={12}
            fill="black"
          />
        </mask>
      </defs>

      {/* dim layer with hole */}
      <motion.rect
        x="0" y="0" width="100%" height="100%"
        fill="rgba(7,7,16,0.76)"
        mask="url(#pmv-spot)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      />

      {/* glow ring */}
      <motion.rect
        animate={visible ? { x: cx, y: cy, width: cw, height: ch, opacity: 1 } : { opacity: 0, width: 0, height: 0 }}
        transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
        rx={12}
        fill="none"
        stroke="rgba(99,102,241,0.55)"
        strokeWidth={1.5}
        style={{ filter: "drop-shadow(0 0 8px rgba(99,102,241,0.4))" }}
      />
    </svg>
  );
}

/* ─── Animated gradient border wrapper ─────────────────────────────────────── */
function GradBorder({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-[1.5px]">
      <motion.div
        className="absolute rounded-2xl"
        style={{
          inset: "-80%",
          background:
            "conic-gradient(from 0deg at 50% 50%, #6366f1 0%, #8b5cf6 25%, #06b6d4 50%, #6366f1 75%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />
      <div
        className="relative rounded-[14px]"
        style={{
          background:
            "linear-gradient(160deg, rgba(22,23,33,0.98) 0%, rgba(16,17,24,0.99) 100%)",
          backdropFilter: "blur(24px)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ─── Welcome banner ────────────────────────────────────────────────────────── */
function WelcomeBanner({
  onStart,
  onSkip,
}: {
  onStart: () => void;
  onSkip: () => void;
}) {
  return (
    <motion.div
      className="fixed bottom-5 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-[360px] -translate-x-1/2"
      initial={{ y: 24, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 24, opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
    >
      <GradBorder>
        <div className="p-5">
          <div className="flex items-start gap-3.5">
            <motion.div
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white"
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
                boxShadow:
                  "0 0 0 1px rgba(99,102,241,0.4), 0 4px 20px rgba(99,102,241,0.3)",
              }}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Rocket className="h-5 w-5" />
            </motion.div>
            <div>
              <p className="font-semibold leading-snug text-white">
                Welcome to API Playground 🚀
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-white/50">
                2-min guided tour through this page — no popups, just highlights.
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-2.5">
            <motion.button
              onClick={onStart}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #6366f1, #818cf8)",
                boxShadow:
                  "0 0 0 1px rgba(99,102,241,0.3), 0 4px 20px rgba(99,102,241,0.25)",
              }}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <Play className="h-4 w-4 fill-white" />
              Start Tour
            </motion.button>
            <button
              onClick={onSkip}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/45 transition-colors hover:border-white/20 hover:text-white/70"
            >
              Skip
            </button>
          </div>
        </div>
      </GradBorder>
    </motion.div>
  );
}

/* ─── Tour tooltip ──────────────────────────────────────────────────────────── */
function TourTooltip({
  stepIndex,
  onNext,
  onBack,
  onClose,
}: {
  stepIndex: number;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
}) {
  const s = STEPS[stepIndex - 1];
  const isFirst = stepIndex === 1;
  const isLast = stepIndex === TOTAL;

  return (
    <motion.div
      className="fixed bottom-5 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-[360px] -translate-x-1/2"
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 16, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
    >
      <GradBorder>
        <div className="p-4">
          {/* Progress bar */}
          <div className="mb-3.5 h-[2px] overflow-hidden rounded-full bg-white/8">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #6366f1, #818cf8, #a78bfa)",
                boxShadow: "0 0 6px rgba(99,102,241,0.6)",
              }}
              animate={{ width: `${(stepIndex / TOTAL) * 100}%` }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18 }}
            >
              <div className="mb-1 flex items-center gap-2">
                <span
                  className="rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold"
                  style={{
                    background: "rgba(99,102,241,0.15)",
                    color: "rgba(129,140,248,1)",
                    border: "1px solid rgba(99,102,241,0.2)",
                  }}
                >
                  {s.badge}
                </span>
                <p className="text-sm font-semibold text-white">{s.title}</p>
              </div>
              <p className="text-[13px] leading-relaxed text-white/50">{s.body}</p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-3.5 flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              {!isFirst && (
                <motion.button
                  onClick={onBack}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/35 transition-colors hover:bg-white/6 hover:text-white/65"
                  whileHover={{ x: -1 }}
                >
                  <ArrowLeft className="h-3 w-3" />
                  Back
                </motion.button>
              )}
              {!isLast && (
                <button
                  onClick={onClose}
                  className="rounded-lg px-2.5 py-1.5 text-xs text-white/25 transition-colors hover:text-white/50"
                >
                  Skip
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              {/* Dot progress */}
              <div className="flex items-center gap-1">
                {Array.from({ length: TOTAL }, (_, i) => (
                  <motion.div
                    key={i}
                    className="h-1 rounded-full"
                    animate={{
                      width: i === stepIndex - 1 ? 16 : 4,
                      background:
                        i < stepIndex
                          ? "rgba(99,102,241,0.9)"
                          : "rgba(255,255,255,0.15)",
                    }}
                    transition={{ duration: 0.25 }}
                  />
                ))}
              </div>

              <motion.button
                onClick={onNext}
                className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #818cf8)",
                  boxShadow:
                    "0 0 0 1px rgba(99,102,241,0.3), 0 4px 16px rgba(99,102,241,0.22)",
                }}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                {isLast ? "Done 🎉" : "Next"}
                {!isLast && <ChevronRight className="h-3.5 w-3.5" />}
              </motion.button>
            </div>
          </div>
        </div>
      </GradBorder>
    </motion.div>
  );
}

/* ─── Active tour (spotlight + tooltip mounted together) ────────────────────── */
function ActiveTour({
  stepIndex,
  onNext,
  onBack,
  onClose,
}: {
  stepIndex: number;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
}) {
  const rect = useSpotlightRect(STEPS[stepIndex - 1].targetId, stepIndex);

  return (
    <>
      <SpotlightOverlay rect={rect} />
      <TourTooltip
        stepIndex={stepIndex}
        onNext={onNext}
        onBack={onBack}
        onClose={onClose}
      />
    </>
  );
}

/* ─── Public export ─────────────────────────────────────────────────────────── */
export function ApiOnboarding() {
  const [phase, setPhase] = useState<"idle" | "welcome" | "touring" | "done">(
    "idle"
  );
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setPhase("welcome");
  }, []);

  const close = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "1");
    setPhase("done");
  }, []);

  function startTour() {
    setStep(1);
    setPhase("touring");
  }

  function next() {
    if (step >= TOTAL) {
      close();
      return;
    }
    setStep((s) => s + 1);
  }

  function back() {
    if (step <= 1) return;
    setStep((s) => s - 1);
  }

  // Keyboard nav
  useEffect(() => {
    if (phase !== "touring") return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") back();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, step, close]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {phase === "welcome" && (
        <WelcomeBanner key="welcome" onStart={startTour} onSkip={close} />
      )}
      {phase === "touring" && (
        <ActiveTour
          key="tour"
          stepIndex={step}
          onNext={next}
          onBack={back}
          onClose={close}
        />
      )}
    </AnimatePresence>
  );
}
