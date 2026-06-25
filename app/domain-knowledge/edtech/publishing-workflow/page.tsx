"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Video,
  FileText,
  ClipboardList,
  Package,
  Upload,
  Wifi,
  Sparkles,
  GitMerge,
  RefreshCw,
  BookOpen,
  AlertCircle,
  Lock,
  BarChart3,
  Award,
  Zap,
  Shield,
  Server,
  Globe,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type PublishPhase =
  | "idle"
  | "comparing"
  | "pipeline"
  | "validating"
  | "permissions"
  | "packaging"
  | "deploying"
  | "tracking"
  | "published";

// ─── Pre-computed confetti (avoids Math.random hydration mismatch) ────────────

const CONFETTI = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${4 + i * 3.8}%`,
  color: ["#6366f1","#8b5cf6","#10b981","#f59e0b","#ef4444","#06b6d4","#ec4899"][i % 7],
  w: 6 + (i % 4) * 3,
  h: 6 + (i % 3) * 4,
  dur: 1.2 + (i % 5) * 0.15,
  delay: (i % 8) * 0.07,
  y: -80 - (i % 6) * 30,
  rot: (i % 4) * 90,
  circle: i % 3 === 0,
}));

// ─── Scene Label ─────────────────────────────────────────────────────────────

function SceneLabel({ number, title }: { number: number; title: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-400"
    >
      Scene {number} · {title}
    </motion.p>
  );
}

// ─── Scene 2: Draft vs Published ─────────────────────────────────────────────

function Scene2Compare({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/92 backdrop-blur-md"
    >
      <div className="mx-auto w-full max-w-3xl px-5">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-emerald-400"
        >
          Scene 2 · Draft vs Published
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 text-center text-2xl font-black text-fg"
        >
          What actually changes when you hit Publish?
        </motion.h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-border bg-surface p-5"
          >
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-bg px-3 py-1 text-xs font-semibold text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-muted" />
              Draft
            </span>
            <ul className="space-y-3">
              {[
                "Hidden from all learners",
                "Only instructor can view",
                "Content can still be edited",
                "No tracking active",
                "Validation not enforced",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="flex items-start gap-2 text-sm text-muted"
                >
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted/40" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5"
          >
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live
            </span>
            <ul className="space-y-3">
              {[
                "Visible to enrolled learners",
                "Searchable on the platform",
                "Content locked for editing",
                "SCORM/xAPI tracking active",
                "All validations must pass first",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.08 }}
                  className="flex items-start gap-2 text-sm text-muted"
                >
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="mt-8 flex justify-center"
        >
          <button
            onClick={onContinue}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Start Publishing Pipeline
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Scene 3: Pipeline animation ─────────────────────────────────────────────

const PIPELINE_STEPS = [
  { label: "Draft", icon: FileText, color: "text-muted", bg: "bg-surface", border: "border-border" },
  { label: "Validate Content", icon: CheckCircle, color: "text-brand", bg: "bg-brand/10", border: "border-brand/30" },
  { label: "Check Missing Files", icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  { label: "Configure Permissions", icon: Lock, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/30" },
  { label: "Package Content", icon: Package, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  { label: "Deploy to Server", icon: Upload, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
  { label: "Enable Tracking", icon: Wifi, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30" },
  { label: "Live Course ✓", icon: Sparkles, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
];

function Scene3Pipeline({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    PIPELINE_STEPS.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setVisible(i + 1);
          if (i === PIPELINE_STEPS.length - 1) {
            setTimeout(onComplete, 900);
          }
        }, 350 + i * 480)
      );
    });
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/92 backdrop-blur-md"
    >
      <div className="mx-auto w-full max-w-xs px-5">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-emerald-400"
        >
          Scene 3 · Publishing Pipeline
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 text-center text-xl font-black text-fg"
        >
          Running pipeline…
        </motion.h2>

        <div className="space-y-0">
          {PIPELINE_STEPS.map((step, i) => {
            const Icon = step.icon;
            const shown = visible > i;
            const active = visible === i + 1;
            const done = visible > i + 1;
            const isLast = i === PIPELINE_STEPS.length - 1;

            return (
              <div key={i}>
                <motion.div
                  initial={{ opacity: 0.2, x: -8 }}
                  animate={shown ? { opacity: 1, x: 0 } : { opacity: 0.2, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 ${
                    shown
                      ? `${step.bg} ${step.border}`
                      : "border-transparent bg-surface/20"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${shown ? step.color : "text-muted/20"}`}
                  />
                  <span
                    className={`text-sm font-medium ${shown ? "text-fg" : "text-muted/20"}`}
                  >
                    {step.label}
                  </span>
                  {done && (
                    <CheckCircle className="ml-auto h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  )}
                  {active && (
                    <RefreshCw className="ml-auto h-3.5 w-3.5 shrink-0 animate-spin text-muted" />
                  )}
                </motion.div>
                {!isLast && (
                  <div
                    className={`ml-[30px] h-3 w-px transition-colors ${
                      shown ? "bg-border" : "bg-border/20"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Scene 4: Validation ──────────────────────────────────────────────────────

const VALIDATION_CHECKS = [
  { label: "Video uploaded", pass: true },
  { label: "Quiz complete", pass: true },
  { label: "Assignment added", pass: true },
  { label: "Broken links", pass: false }, // index 3 — triggers error
  { label: "Thumbnail", pass: true },
  { label: "Course description", pass: true },
];

function Scene4Validate({ onContinue }: { onContinue: () => void }) {
  const [visible, setVisible] = useState(0);
  const [errorShown, setErrorShown] = useState(false);
  const [fixed, setFixed] = useState(false);
  const [resumeDone, setResumeDone] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i <= 3; i++) {
      timers.push(
        setTimeout(() => {
          setVisible(i + 1);
          if (i === 3) setTimeout(() => setErrorShown(true), 450);
        }, 500 + i * 680)
      );
    }
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleFix = () => {
    setFixed(true);
    setErrorShown(false);
    setTimeout(() => setVisible(5), 500);
    setTimeout(() => setVisible(6), 1100);
    setTimeout(() => setResumeDone(true), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/92 backdrop-blur-md"
    >
      <div className="mx-auto w-full max-w-md px-5">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-emerald-400"
        >
          Scene 4 · Content Validation
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 text-center text-xl font-black text-fg"
        >
          Validating your course…
        </motion.h2>

        <div className="space-y-2">
          {VALIDATION_CHECKS.map((check, i) => {
            if (visible <= i) return null;
            const isBrokenRow = i === 3;
            const pass = isBrokenRow ? fixed : check.pass;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                  pass
                    ? "border-emerald-500/30 bg-emerald-500/10"
                    : "border-red-500/30 bg-red-500/10"
                }`}
              >
                <span className="text-sm text-fg">{check.label}</span>
                {pass ? (
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400" />
                )}
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {errorShown && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-4 overflow-hidden rounded-2xl border border-red-500/30 bg-bg"
            >
              <div className="border-b border-red-500/20 bg-red-500/10 px-4 py-3">
                <p className="text-sm font-bold text-red-400">⚠ Publishing Paused</p>
                <p className="text-xs text-muted mt-0.5">Broken resource found in Module 3</p>
              </div>
              <div className="p-4">
                <button
                  onClick={handleFix}
                  className="w-full rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Fix Issue &amp; Continue
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {resumeDone && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex justify-center"
          >
            <button
              onClick={onContinue}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              All checks passed — Set Permissions
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Scene 5: Permissions ─────────────────────────────────────────────────────

function Scene5Permissions({ onContinue }: { onContinue: () => void }) {
  const [selected, setSelected] = useState<string[]>(["students"]);
  const [visibility, setVisibility] = useState("public");

  const toggle = (id: string) =>
    setSelected((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );

  const audiences = ["Students", "Teachers", "Admins", "Guests"];
  const visibilities = [
    { id: "public", label: "Public" },
    { id: "private", label: "Private" },
    { id: "cohort", label: "Cohort Only" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/92 backdrop-blur-md"
    >
      <div className="mx-auto w-full max-w-md px-5">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-emerald-400"
        >
          Scene 5 · Permissions
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 text-center text-xl font-black text-fg"
        >
          Who can access this course?
        </motion.h2>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
              Audience
            </p>
            <div className="grid grid-cols-2 gap-2">
              {audiences.map((a) => {
                const id = a.toLowerCase();
                const on = selected.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => toggle(id)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                      on
                        ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                        : "border-border bg-bg text-muted hover:border-border/80"
                    }`}
                  >
                    <div
                      className={`h-3.5 w-3.5 rounded border-2 transition ${
                        on
                          ? "border-emerald-400 bg-emerald-400"
                          : "border-muted/40"
                      }`}
                    />
                    {a}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
              Visibility
            </p>
            <div className="flex gap-2">
              {visibilities.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVisibility(v.id)}
                  className={`flex-1 rounded-lg border px-2 py-2 text-xs font-medium transition ${
                    visibility === v.id
                      ? "border-brand/40 bg-brand/15 text-brand"
                      : "border-border bg-bg text-muted"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex justify-center"
        >
          <button
            onClick={onContinue}
            disabled={selected.length === 0}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            Lock In Permissions
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Scene 6: Packaging ───────────────────────────────────────────────────────

const ASSETS = [
  { icon: Video, label: "Videos", color: "text-brand", bg: "bg-brand/10" },
  { icon: ClipboardList, label: "Quiz", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { icon: FileText, label: "PDFs", color: "text-amber-400", bg: "bg-amber-500/10" },
  { icon: BookOpen, label: "Assignments", color: "text-violet-400", bg: "bg-violet-500/10" },
];

function Scene6Package({ onComplete }: { onComplete: () => void }) {
  const [packPhase, setPackPhase] = useState<"dropping" | "packaging" | "done">("dropping");

  useEffect(() => {
    const t1 = setTimeout(() => setPackPhase("packaging"), 1800);
    const t2 = setTimeout(() => {
      setPackPhase("done");
      setTimeout(onComplete, 1200);
    }, 3300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/92 backdrop-blur-md"
    >
      <div className="mx-auto w-full max-w-sm px-5 text-center">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-400"
        >
          Scene 6 · Packaging
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 text-xl font-black text-fg"
        >
          Bundling into SCORM package…
        </motion.h2>

        {/* Assets falling into box */}
        <div className="relative mb-4 flex justify-center gap-3">
          {ASSETS.map((asset, i) => {
            const Icon = asset.icon;
            return (
              <motion.div
                key={i}
                animate={
                  packPhase !== "dropping"
                    ? { y: 64, opacity: 0, scale: 0.8 }
                    : { y: 0, opacity: 1, scale: 1 }
                }
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className={`flex flex-col items-center gap-1.5 rounded-xl border border-border p-3 ${asset.bg}`}
              >
                <Icon className={`h-5 w-5 ${asset.color}`} />
                <span className="text-[10px] font-medium text-muted">
                  {asset.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Package box */}
        <motion.div
          animate={
            packPhase === "done"
              ? { borderColor: "rgba(16,185,129,0.5)", scale: [1, 1.04, 1] }
              : packPhase === "packaging"
              ? { borderColor: "rgba(16,185,129,0.3)" }
              : {}
          }
          transition={{ duration: 0.4 }}
          className="mx-auto w-44 rounded-2xl border-2 border-border bg-surface p-5 text-center"
        >
          <Package
            className={`mx-auto mb-2 h-8 w-8 transition-colors ${
              packPhase !== "dropping" ? "text-emerald-400" : "text-muted"
            }`}
          />
          {packPhase === "dropping" && (
            <p className="text-xs text-muted">Ready…</p>
          )}
          {packPhase === "packaging" && (
            <motion.p
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 0.7, repeat: Infinity }}
              className="text-xs font-medium text-emerald-400"
            >
              Packaging…
            </motion.p>
          )}
          {packPhase === "done" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-xs font-bold text-fg">Course.zip</p>
              <p className="mt-0.5 text-[10px] text-emerald-400">
                ✓ Package complete
              </p>
            </motion.div>
          )}
        </motion.div>

        {packPhase !== "dropping" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-xs text-muted"
          >
            LMS prefers standardized packages — SCORM or xAPI.
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Scene 7: Deployment ──────────────────────────────────────────────────────

const DEPLOY_STAGES = [
  { pct: 25, label: "Uploading to server…" },
  { pct: 50, label: "Processing content…" },
  { pct: 75, label: "Propagating to CDN…" },
  { pct: 100, label: "Deployment complete!" },
];

function Scene7Deploy({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [stageIdx, setStageIdx] = useState(-1);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    DEPLOY_STAGES.forEach((stage, i) => {
      timers.push(
        setTimeout(() => {
          setProgress(stage.pct);
          setStageIdx(i);
          if (stage.pct === 100) {
            setShowConfetti(true);
            setTimeout(onComplete, 2200);
          }
        }, 600 + i * 900)
      );
    });
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const label =
    stageIdx >= 0 ? DEPLOY_STAGES[stageIdx].label : "Preparing deployment…";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-bg/92 backdrop-blur-md"
    >
      {/* Confetti */}
      {showConfetti && (
        <div className="pointer-events-none absolute inset-0">
          {CONFETTI.map((p) => (
            <motion.div
              key={p.id}
              initial={{ bottom: "40%", left: p.left, opacity: 1, scale: 0 }}
              animate={{ y: p.y, opacity: 0, scale: 1, rotate: p.rot }}
              transition={{ duration: p.dur, delay: p.delay, ease: "easeOut" }}
              style={{
                position: "absolute",
                width: p.w,
                height: p.h,
                backgroundColor: p.color,
                borderRadius: p.circle ? "50%" : "2px",
              }}
            />
          ))}
        </div>
      )}

      <div className="relative mx-auto w-full max-w-sm px-5 text-center">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-400"
        >
          Scene 7 · Deployment
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 text-xl font-black text-fg"
        >
          {progress === 100 ? "🎉 Course deployed!" : "Deploying to production…"}
        </motion.h2>

        {/* Progress bar */}
        <div className="mb-2 h-3 overflow-hidden rounded-full bg-surface">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-brand"
          />
        </div>
        <div className="mb-8 flex items-center justify-between text-xs">
          <span className="text-muted">{label}</span>
          <span className="font-bold text-fg">{progress}%</span>
        </div>

        {/* Mini pipeline nodes */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          {["Package", "Server", "LMS", "CDN", "Learners"].map((node, i, arr) => (
            <span key={i} className="flex items-center gap-2">
              <span
                className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                  progress >= (i + 1) * 20
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-surface text-muted/40"
                }`}
              >
                {node}
              </span>
              {i < arr.length - 1 && (
                <ArrowRight
                  className={`h-3 w-3 transition-colors ${
                    progress >= (i + 1) * 20
                      ? "text-emerald-400"
                      : "text-muted/20"
                  }`}
                />
              )}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Scene 8: Tracking Activation ────────────────────────────────────────────

const TRACKING_SERVICES = [
  { label: "Progress Tracking", color: "text-brand" },
  { label: "Completion Status", color: "text-violet-400" },
  { label: "Analytics", color: "text-emerald-400" },
  { label: "Quiz Tracking", color: "text-amber-400" },
  { label: "Certificates", color: "text-rose-400" },
];

function Scene8Tracking({ onComplete }: { onComplete: () => void }) {
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    TRACKING_SERVICES.forEach((_, i) => {
      setTimeout(() => {
        setActiveCount(i + 1);
        if (i === TRACKING_SERVICES.length - 1) {
          setTimeout(onComplete, 1200);
        }
      }, 500 + i * 600);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/92 backdrop-blur-md"
    >
      <div className="mx-auto w-full max-w-sm px-5">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-emerald-400"
        >
          Scene 8 · Tracking Activation
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 text-center text-xl font-black text-fg"
        >
          Activating backend services…
        </motion.h2>

        <div className="space-y-3">
          {TRACKING_SERVICES.map((svc, i) => {
            const on = activeCount > i;
            return (
              <motion.div
                key={i}
                animate={{ opacity: on ? 1 : 0.3 }}
                transition={{ duration: 0.4 }}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                  on
                    ? "border-emerald-500/30 bg-emerald-500/10"
                    : "border-border bg-surface"
                }`}
              >
                <span
                  className={`text-sm font-medium ${on ? "text-fg" : "text-muted"}`}
                >
                  {svc.label}
                </span>
                {/* CSS-only toggle knob to avoid Framer Motion conflict */}
                <div
                  className={`relative h-5 w-9 rounded-full transition-colors duration-300 ${
                    on ? "bg-emerald-500" : "bg-surface border border-border"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300 ${
                      on ? "left-[18px]" : "left-0.5"
                    }`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Scene 9: Learner Experience ──────────────────────────────────────────────

function LearnerExperience() {
  const steps = [
    "Student logs in to the LMS",
    "Course immediately visible in dashboard",
    "Student clicks Start Course",
    "Video plays, quiz is functional",
    "Progress auto-saves after each section",
    "Completion badge unlocked at 100%",
  ];

  return (
    <div className="space-y-3">
      {steps.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
        >
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
            {i + 1}
          </span>
          <span className="text-sm text-fg">{s}</span>
          <CheckCircle className="ml-auto h-4 w-4 shrink-0 text-emerald-400" />
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7 }}
        className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400"
      >
        Everything works because Publishing ran the full validation + deployment
        pipeline before any learner could access it.
      </motion.div>
    </div>
  );
}

// ─── Scene 10: Interactive Playground ────────────────────────────────────────

const PLAYGROUND_ISSUES = [
  {
    id: "missing_video",
    label: "Missing Video",
    error: "Publishing Failed: Missing video content in Module 1",
    warn: false,
  },
  {
    id: "broken_link",
    label: "Broken Link",
    error: "Publishing Failed: Broken resource found in Module 3",
    warn: false,
  },
  {
    id: "missing_quiz",
    label: "Missing Quiz",
    error: "Publishing Failed: Quiz not complete",
    warn: false,
  },
  {
    id: "no_thumbnail",
    label: "No Thumbnail",
    error: "Publishing Failed: Course thumbnail is required",
    warn: false,
  },
  {
    id: "permission_error",
    label: "Permission Error",
    error: "Publishing Failed: No audience selected",
    warn: false,
  },
  {
    id: "tracking_disabled",
    label: "Disable Tracking",
    error: "Published with Warning: Tracking disabled — no analytics",
    warn: true,
  },
];

function PublishingPlayground() {
  const [active, setActive] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setActive((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const issues = PLAYGROUND_ISSUES.filter((t) => active.has(t.id));
  const errors = issues.filter((i) => !i.warn);
  const warnings = issues.filter((i) => i.warn);
  const success = issues.length === 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Toggles */}
      <div className="space-y-3">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted">
          Introduce Problems
        </p>
        {PLAYGROUND_ISSUES.map((t) => {
          const on = active.has(t.id);
          return (
            <button
              key={t.id}
              onClick={() => toggle(t.id)}
              className="flex w-full items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-sm transition hover:border-border/60"
            >
              <span className="font-medium text-fg">{t.label}</span>
              <div
                className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${
                  on ? "bg-red-500" : "bg-emerald-500"
                }`}
              >
                <div
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200 ${
                    on ? "left-[18px]" : "left-0.5"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Result */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Publishing Result
        </p>
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center"
            >
              <CheckCircle className="h-10 w-10 text-emerald-400" />
              <p className="text-lg font-bold text-emerald-400">
                Publishing Successful
              </p>
              <p className="text-sm text-muted">
                All validations passed. Course is live.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 rounded-2xl border border-red-500/30 bg-red-500/10 p-5"
            >
              <div className="mb-3 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-400" />
                <span className="font-bold text-red-400">
                  {errors.length > 0 ? "Publishing Failed" : "Published with Warnings"}
                </span>
              </div>
              <div className="space-y-2">
                {errors.map((issue, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400"
                  >
                    {issue.error}
                  </div>
                ))}
                {warnings.map((issue, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-400"
                  >
                    {issue.error}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Scene 11: Real Products ──────────────────────────────────────────────────

function RealProductsSection() {
  const products = [
    {
      name: "Coursera",
      tag: "Consumer EdTech",
      desc: "Publishes entire Specializations — each module goes through video processing, quiz validation, and peer review gates before learners can see it.",
      color: "text-brand",
      bg: "bg-brand/10",
      border: "border-brand/20",
    },
    {
      name: "upGrad",
      tag: "Higher Ed",
      desc: "Batch-publishes instructor-created cohort content through an editorial review queue with automated plagiarism and link checks.",
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
    {
      name: "Scaler",
      tag: "Upskilling",
      desc: "Coding modules go through automated lint + test execution checks before publishing — broken code examples are blocked at the pipeline.",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      name: "Udemy",
      tag: "Marketplace",
      desc: "Human review + automated quality checks (audio quality, video resolution, minimum lecture count) before content goes live to millions.",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      name: "Moodle",
      tag: "Open-source LMS",
      desc: "Packages content as SCORM or IMS Common Cartridge, then imports and deploys to the LMS — publish is a structured import pipeline.",
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p, i) => (
        <motion.div
          key={p.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className={`rounded-xl border ${p.border} bg-surface p-5`}
        >
          <span
            className={`mb-3 inline-block rounded-md px-2 py-0.5 text-xs font-medium ${p.bg} ${p.color}`}
          >
            {p.tag}
          </span>
          <h3 className="mb-1.5 text-sm font-bold text-fg">{p.name}</h3>
          <p className="text-xs leading-relaxed text-muted">{p.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Scene 12: Product Thinking ───────────────────────────────────────────────

function ProductThinkingSection() {
  const cards = [
    {
      icon: Package,
      color: "text-brand",
      bg: "bg-brand/10",
      title: "Publishing is content delivery",
      body: "Clicking Publish converts raw draft assets into a standardized, CDN-distributed, learner-ready experience. It's not a visibility toggle — it's a release.",
    },
    {
      icon: Shield,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      title: "Validation is the gatekeeper",
      body: "Learners should never encounter a broken video, missing quiz, or dead link. Validation gates are the PM's promise that the experience is complete.",
    },
    {
      icon: Zap,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      title: "Automation = reliability at scale",
      body: "Manual publishing works for 10 courses. When you have 10,000, every step must be automatable — from packaging to CDN propagation.",
    },
    {
      icon: BarChart3,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      title: "Tracking must be activated at publish",
      body: "Tracking can't be retrofitted after learners start. The window to wire up SCORM/xAPI, analytics, and certificates is the publishing pipeline.",
    },
    {
      icon: Globe,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      title: "Rollback is a feature, not an afterthought",
      body: "Good publishing systems let you unpublish or version-roll. Design your PRD to include rollback paths — just like a software deployment.",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.09 }}
            className="rounded-xl border border-border bg-surface p-5"
          >
            <div
              className={`mb-3 inline-grid h-9 w-9 place-items-center rounded-xl ${card.bg}`}
            >
              <Icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <h3 className="mb-2 text-sm font-bold text-fg">{card.title}</h3>
            <p className="text-xs leading-relaxed text-muted">{card.body}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Scene 13: Final Animation ────────────────────────────────────────────────

const LIFECYCLE_NODES = [
  { label: "Instructor", icon: Award, color: "text-brand", bg: "bg-brand/10" },
  { label: "Creates Content", icon: FileText, color: "text-violet-400", bg: "bg-violet-500/10" },
  { label: "Validates", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Packages", icon: Package, color: "text-amber-400", bg: "bg-amber-500/10" },
  { label: "Deploys", icon: Upload, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { label: "LMS", icon: Server, color: "text-rose-400", bg: "bg-rose-500/10" },
  { label: "Learners", icon: Globe, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Progress Tracking", icon: BarChart3, color: "text-brand", bg: "bg-brand/10" },
  { label: "Analytics", icon: Sparkles, color: "text-violet-400", bg: "bg-violet-500/10" },
];

function FinalSection() {
  return (
    <div className="text-center">
      {/* Lifecycle flow */}
      <div className="mb-12 flex flex-wrap items-center justify-center gap-0">
        {LIFECYCLE_NODES.map((node, i) => {
          const Icon = node.icon;
          const isLast = i === LIFECYCLE_NODES.length - 1;
          return (
            <span key={i} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 280 }}
                className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 ${node.bg}`}
              >
                <Icon className={`h-5 w-5 ${node.color}`} />
                <span className="text-[10px] font-medium text-muted whitespace-nowrap">
                  {node.label}
                </span>
              </motion.div>
              {!isLast && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.05 }}
                >
                  <ArrowRight className="mx-1 h-3 w-3 text-muted/40" />
                </motion.div>
              )}
            </span>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h2 className="mb-2 text-3xl font-black tracking-tight text-fg md:text-4xl">
          Publishing isn&apos;t a button.
        </h2>
        <p className="mb-1 text-2xl font-bold bg-gradient-to-r from-emerald-400 to-brand bg-clip-text text-transparent">
          It&apos;s an automated release pipeline.
        </p>
        <p className="mb-8 text-lg text-muted font-medium">
          Just like deploying software to production.
        </p>
        <p className="mx-auto max-w-md text-[15px] text-muted">
          Every validation gate, every permission check, every tracking switch —
          they all exist so learners receive a reliable experience, every time.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-10 flex flex-wrap justify-center gap-3"
      >
        <Link
          href="/domain-knowledge/edtech/lti"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium text-muted transition hover:text-fg"
        >
          <ArrowLeft className="h-4 w-4" />
          Revisit LTI
        </Link>
        <Link
          href="/domain-knowledge/edtech"
          className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Explore More EdTech Concepts
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PublishingWorkflowPage() {
  const [phase, setPhase] = useState<PublishPhase>("idle");

  const advance = (next: PublishPhase) => setPhase(next);

  return (
    <div className="min-h-screen bg-bg">
      {/* ── Hero / Scene 1 ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(16,185,129,0.08) 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="pointer-events-none absolute left-1/4 top-0 h-[400px] w-[500px] -translate-y-1/3 rounded-full bg-emerald-500/12 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-[300px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full bg-brand/10 blur-[100px]" />

        <div className="relative mx-auto max-w-5xl px-5 py-12">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/domain-knowledge/edtech"
              className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
            >
              <ArrowLeft className="h-4 w-4" />
              EdTech Concepts
            </Link>
          </motion.div>

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1"
              >
                <GitMerge className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-xs font-semibold tracking-wide text-emerald-400">
                  EdTech · Publishing Workflow · Scene 1 of 13
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="mb-4 text-3xl font-black tracking-tight text-fg md:text-4xl"
              >
                Ever wondered what actually happens when a course goes{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-brand bg-clip-text text-transparent">
                  LIVE?
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-[15px] leading-relaxed text-muted"
              >
                Most people think &quot;Publish&quot; is just a button. It&apos;s
                actually an orchestration pipeline — validation, packaging,
                deployment, and tracking activation all happen in seconds.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 flex flex-wrap gap-2"
              >
                {[
                  "Validation",
                  "Packaging",
                  "Deployment",
                  "Tracking",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-5 text-xs text-muted"
              >
                👆 Click{" "}
                <strong className="text-emerald-400">Publish Course</strong> in
                the dashboard to start
              </motion.p>
            </div>

            {/* Instructor dashboard */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <InstructorDashboard
                phase={phase}
                onPublish={() => advance("comparing")}
                onReset={() => setPhase("idle")}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Overlays ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === "comparing" && (
          <Scene2Compare onContinue={() => advance("pipeline")} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "pipeline" && (
          <Scene3Pipeline onComplete={() => advance("validating")} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "validating" && (
          <Scene4Validate onContinue={() => advance("permissions")} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "permissions" && (
          <Scene5Permissions onContinue={() => advance("packaging")} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "packaging" && (
          <Scene6Package onComplete={() => advance("deploying")} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "deploying" && (
          <Scene7Deploy onComplete={() => advance("tracking")} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "tracking" && (
          <Scene8Tracking onComplete={() => advance("published")} />
        )}
      </AnimatePresence>

      {/* ── Scroll sections ──────────────────────────────────────────────────── */}

      {/* Scene 9: Learner Experience */}
      <section className="mx-auto max-w-5xl px-5 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SceneLabel number={9} title="Learner Experience" />
          <h2 className="mb-3 text-2xl font-black tracking-tight text-fg md:text-3xl">
            What the learner sees after a successful publish
          </h2>
          <p className="mb-8 max-w-xl text-[15px] text-muted">
            The pipeline runs so that the learner experience is seamless —
            nothing broken, nothing missing.
          </p>
          <LearnerExperience />
        </motion.div>
      </section>

      {/* Scene 10: Playground */}
      <section className="border-t border-border/50 bg-surface/30">
        <div className="mx-auto max-w-5xl px-5 py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SceneLabel number={10} title="Interactive Playground" />
            <h2 className="mb-3 text-2xl font-black tracking-tight text-fg md:text-3xl">
              Break the publishing pipeline
            </h2>
            <p className="mb-8 max-w-xl text-[15px] text-muted">
              Toggle each issue to see exactly why validation gates exist — and
              what happens when you skip them.
            </p>
            <PublishingPlayground />
          </motion.div>
        </div>
      </section>

      {/* Scene 11: Real Products */}
      <section className="mx-auto max-w-5xl px-5 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SceneLabel number={11} title="Real World" />
          <h2 className="mb-3 text-2xl font-black tracking-tight text-fg md:text-3xl">
            How real platforms publish content
          </h2>
          <p className="mb-10 max-w-xl text-[15px] text-muted">
            Every major learning platform runs a publishing pipeline — the
            complexity just scales with the product.
          </p>
          <RealProductsSection />
        </motion.div>
      </section>

      {/* Scene 12: Product Thinking */}
      <section className="border-t border-border/50 bg-surface/30">
        <div className="mx-auto max-w-5xl px-5 py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SceneLabel number={12} title="Product Thinking" />
            <h2 className="mb-3 text-2xl font-black tracking-tight text-fg md:text-3xl">
              What a PM needs to know about Publishing
            </h2>
            <p className="mb-10 max-w-xl text-[15px] text-muted">
              The decisions you make around publishing gates directly affect
              learner trust, completion rates, and support volume.
            </p>
            <ProductThinkingSection />
          </motion.div>
        </div>
      </section>

      {/* Scene 13: Final */}
      <section className="mx-auto max-w-5xl px-5 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-emerald-400">
            Scene 13 · The Full Picture
          </p>
          <FinalSection />
        </motion.div>
      </section>
    </div>
  );
}

// ─── Instructor Dashboard (hero widget) ──────────────────────────────────────

function InstructorDashboard({
  phase,
  onPublish,
  onReset,
}: {
  phase: PublishPhase;
  onPublish: () => void;
  onReset: () => void;
}) {
  const isPublished = phase === "published";
  const isLaunching = phase !== "idle" && phase !== "published";

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
      {/* Browser chrome */}
      <div className="flex items-center gap-3 border-b border-border bg-surface/80 px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
        </div>
        <div className="flex-1 rounded-md bg-bg/80 px-3 py-1 text-center text-xs text-muted/60">
          lms.pmverse.app/courses/api-fundamentals/edit
        </div>
      </div>

      <div className="p-5">
        {/* Course header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-base font-bold text-fg">API Fundamentals</h3>
            <p className="text-xs text-muted mt-0.5">Instructor view</p>
          </div>
          <AnimatePresence mode="wait">
            {isPublished ? (
              <motion.span
                key="live"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-400"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Live
              </motion.span>
            ) : (
              <motion.span
                key="draft"
                exit={{ scale: 0.8, opacity: 0 }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg px-2.5 py-1 text-xs font-semibold text-muted"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-muted" />
                Draft
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Course sections */}
        <div className="mb-4 space-y-2">
          {[
            { icon: Video, label: "Videos", count: "4 lectures", color: "text-brand" },
            { icon: ClipboardList, label: "Quiz", count: "12 questions", color: "text-emerald-400" },
            { icon: FileText, label: "Assignments", count: "2 tasks", color: "text-amber-400" },
            { icon: BookOpen, label: "Resources", count: "3 PDFs", color: "text-violet-400" },
          ].map(({ icon: Icon, label, count, color }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 rounded-lg bg-bg/60 px-3 py-2"
            >
              <Icon className={`h-3.5 w-3.5 ${color}`} />
              <span className="text-xs font-medium text-fg">{label}</span>
              <span className="ml-auto text-xs text-muted">{count}</span>
            </div>
          ))}
        </div>

        {/* Publish button */}
        <motion.button
          onClick={!isPublished && !isLaunching ? onPublish : undefined}
          disabled={isPublished || isLaunching}
          whileHover={!isPublished && !isLaunching ? { scale: 1.02 } : {}}
          whileTap={!isPublished && !isLaunching ? { scale: 0.97 } : {}}
          animate={
            !isPublished && !isLaunching
              ? {
                  boxShadow: [
                    "0 0 0px 0px rgba(16,185,129,0)",
                    "0 0 18px 4px rgba(16,185,129,0.35)",
                    "0 0 0px 0px rgba(16,185,129,0)",
                  ],
                }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            isPublished
              ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 cursor-default"
              : isLaunching
              ? "bg-emerald-500/30 text-emerald-300 cursor-not-allowed"
              : "bg-emerald-500 text-white hover:opacity-90"
          }`}
        >
          {isPublished ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Course Published ✓
            </>
          ) : isLaunching ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Publishing…
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Publish Course
            </>
          )}
        </motion.button>

        {isPublished && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onReset}
            className="mt-2 w-full text-center text-xs text-muted underline-offset-2 hover:underline"
          >
            Reset simulation
          </motion.button>
        )}
      </div>
    </div>
  );
}

