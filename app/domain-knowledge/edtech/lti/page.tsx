"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Link2,
  Shield,
  Key,
  CheckCircle,
  XCircle,
  User,
  Code,
  Award,
  Send,
  Sparkles,
  ExternalLink,
  GraduationCap,
  BarChart3,
  RefreshCw,
  Globe,
  Zap,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Phase = "idle" | "launching" | "exchanging" | "authenticated";

interface LtiParams {
  user_id: string;
  resource_link_id: string;
  oauth_consumer_key: string;
  lis_person_name_full: string;
  roles: string;
  context_id: string;
  launch_presentation_return_url: string;
  oauth_signature: string;
  oauth_timestamp: string;
}

// ─── Scene Label ─────────────────────────────────────────────────────────────

function SceneLabel({ number, title }: { number: number; title: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-400"
    >
      Scene {number} · {title}
    </motion.p>
  );
}

// ─── LMS Dashboard ───────────────────────────────────────────────────────────

function LmsDashboard({
  phase,
  onLaunch,
}: {
  phase: Phase;
  onLaunch: () => void;
}) {
  const isLaunching = phase !== "idle";

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
          pmverse-lms.app/courses/backend
        </div>
      </div>

      {/* LMS body */}
      <div className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-brand" />
          <span className="text-sm font-semibold text-fg">My Courses</span>
        </div>

        {/* Active course card */}
        <div className="mb-3 rounded-xl border border-violet-500/30 bg-violet-500/5 p-4">
          <p className="mb-1 text-xs text-muted">Backend Development · Week 3</p>
          <h3 className="mb-3 text-sm font-bold text-fg">
            Node.js REST API — Coding Lab
          </h3>

          <motion.button
            onClick={onLaunch}
            disabled={isLaunching}
            whileHover={!isLaunching ? { scale: 1.02 } : {}}
            whileTap={!isLaunching ? { scale: 0.97 } : {}}
            animate={
              !isLaunching
                ? {
                    boxShadow: [
                      "0 0 0px 0px rgba(139,92,246,0)",
                      "0 0 18px 4px rgba(139,92,246,0.35)",
                      "0 0 0px 0px rgba(139,92,246,0)",
                    ],
                  }
                : {}
            }
            transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-violet-500/40 bg-violet-500/15 px-4 py-2.5 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/25 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLaunching ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Launching…
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4" />
                Launch Coding Lab
              </>
            )}
          </motion.button>
        </div>

        {/* Other courses dimmed */}
        {["UI/UX Design Fundamentals", "Product Analytics Basics"].map(
          (name) => (
            <div
              key={name}
              className="mb-2 rounded-lg border border-border/40 bg-surface/40 px-4 py-2.5 opacity-40"
            >
              <p className="text-xs text-muted">{name}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ─── Token Exchange Animation ─────────────────────────────────────────────────

function TokenExchangeAnimation({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  const steps = [
    { label: "Generating OAuth signature…", icon: Key, activeColor: "text-amber-400", activeBorder: "border-amber-500/30", activeBg: "bg-amber-500/10" },
    { label: "Signing LTI launch parameters…", icon: Shield, activeColor: "text-violet-400", activeBorder: "border-violet-500/30", activeBg: "bg-violet-500/10" },
    { label: "POSTing to tool endpoint…", icon: Send, activeColor: "text-brand", activeBorder: "border-brand/30", activeBg: "bg-brand/10" },
    { label: "Tool validates OAuth signature…", icon: Shield, activeColor: "text-violet-400", activeBorder: "border-violet-500/30", activeBg: "bg-violet-500/10" },
    { label: "User authenticated ✓", icon: CheckCircle, activeColor: "text-emerald-400", activeBorder: "border-emerald-500/30", activeBg: "bg-emerald-500/10" },
  ];

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    steps.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setStep(i + 1);
          if (i === steps.length - 1) {
            setTimeout(onComplete, 700);
          }
        }, (i + 1) * 750)
      );
    });
    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-3">
      {steps.map((s, i) => {
        const Icon = s.icon;
        const done = step > i;
        const active = step === i + 1;
        const pending = step <= i;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0.3, x: -8 }}
            animate={
              done || active ? { opacity: 1, x: 0 } : { opacity: 0.3, x: 0 }
            }
            transition={{ duration: 0.35 }}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
              done
                ? "border-emerald-500/30 bg-emerald-500/10"
                : active
                ? `${s.activeBorder} ${s.activeBg}`
                : "border-border bg-surface"
            }`}
          >
            <Icon
              className={`h-4 w-4 shrink-0 ${
                done
                  ? "text-emerald-400"
                  : active
                  ? s.activeColor
                  : "text-muted"
              }`}
            />
            <span
              className={`text-sm ${
                done
                  ? "text-emerald-400"
                  : active
                  ? "text-fg"
                  : "text-muted"
              }`}
            >
              {s.label}
            </span>
            {done && (
              <CheckCircle className="ml-auto h-4 w-4 shrink-0 text-emerald-400" />
            )}
            {active && !done && (
              <RefreshCw className="ml-auto h-4 w-4 shrink-0 animate-spin text-muted" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── LTI Data Panel ──────────────────────────────────────────────────────────

function LtiDataPanel({
  params,
  highlight,
}: {
  params: LtiParams;
  highlight: string[];
}) {
  const fields: { key: keyof LtiParams; label: string }[] = [
    { key: "user_id", label: "user_id" },
    { key: "resource_link_id", label: "resource_link_id" },
    { key: "oauth_consumer_key", label: "oauth_consumer_key" },
    { key: "lis_person_name_full", label: "lis_person_name_full" },
    { key: "roles", label: "roles" },
    { key: "context_id", label: "context_id" },
    { key: "oauth_signature", label: "oauth_signature" },
    { key: "oauth_timestamp", label: "oauth_timestamp" },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-bg font-mono text-xs">
      <div className="flex items-center gap-2 border-b border-border bg-surface/60 px-4 py-2.5">
        <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="ml-2 text-[11px] text-muted">LTI Launch Parameters</span>
      </div>
      <div className="space-y-1.5 p-3">
        {fields.map(({ key, label }) => (
          <motion.div
            key={key}
            animate={
              highlight.includes(key)
                ? {
                    backgroundColor: [
                      "rgba(99,102,241,0)",
                      "rgba(99,102,241,0.15)",
                      "rgba(99,102,241,0)",
                    ],
                  }
                : {}
            }
            transition={{ duration: 0.8 }}
            className="flex gap-2 rounded px-1.5 py-0.5"
          >
            <span className="shrink-0 text-brand">{label}:</span>
            <span
              className={`break-all ${
                highlight.includes(key) ? "text-brand" : "text-fg/70"
              }`}
            >
              &quot;{params[key]}&quot;
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Interactive Playground ───────────────────────────────────────────────────

function InteractivePlayground() {
  const [params, setParams] = useState<LtiParams>({
    user_id: "usr_8f4a2b",
    resource_link_id: "link_coding_lab_01",
    oauth_consumer_key: "pmverse_lms_prod",
    lis_person_name_full: "Soham Chakraborty",
    roles: "Learner",
    context_id: "course_backend_dev",
    launch_presentation_return_url: "https://pmverse.app/courses/backend",
    oauth_signature: "sha1_a9f3e…",
    oauth_timestamp: "1750000000",
  });
  const [highlight, setHighlight] = useState<string[]>([]);
  const [log, setLog] = useState<string[]>([]);

  const flash = (keys: string[]) => {
    setHighlight(keys);
    setTimeout(() => setHighlight([]), 1200);
  };

  const addLog = (msg: string) => {
    setLog((prev) => [
      `[${new Date().toLocaleTimeString()}] ${msg}`,
      ...prev.slice(0, 4),
    ]);
  };

  const actions = [
    {
      label: "Launch as Student",
      desc: "Set role to Learner",
      fn: () => {
        setParams((p) => ({ ...p, roles: "Learner", user_id: "usr_8f4a2b" }));
        flash(["roles", "user_id"]);
        addLog("Role → Learner. Tool renders student assignment view.");
      },
    },
    {
      label: "Launch as Instructor",
      desc: "Elevate to Instructor role",
      fn: () => {
        setParams((p) => ({
          ...p,
          roles: "Instructor",
          user_id: "usr_admin_01",
          lis_person_name_full: "Prof. Rajan",
        }));
        flash(["roles", "user_id", "lis_person_name_full"]);
        addLog("Role → Instructor. Tool renders analytics & grading dashboard.");
      },
    },
    {
      label: "Switch Resource",
      desc: "Load a different course module",
      fn: () => {
        const next =
          params.resource_link_id === "link_coding_lab_01"
            ? "link_quiz_module_02"
            : "link_coding_lab_01";
        const ctx =
          next === "link_coding_lab_01"
            ? "course_backend_dev"
            : "course_frontend_basics";
        setParams((p) => ({ ...p, resource_link_id: next, context_id: ctx }));
        flash(["resource_link_id", "context_id"]);
        addLog(`Switched to resource: ${next}`);
      },
    },
    {
      label: "Rotate OAuth Key",
      desc: "Simulate key rotation",
      fn: () => {
        const newKey = `pmverse_${Math.random().toString(36).slice(2, 8)}`;
        const newTs = String(Math.floor(Date.now() / 1000));
        setParams((p) => ({
          ...p,
          oauth_consumer_key: newKey,
          oauth_timestamp: newTs,
          oauth_signature: `sha1_${Math.random().toString(36).slice(2, 8)}…`,
        }));
        flash(["oauth_consumer_key", "oauth_signature", "oauth_timestamp"]);
        addLog("OAuth key rotated — new signature generated.");
      },
    },
    {
      label: "Simulate Grade Return",
      desc: "Tool POSTs grade back to LMS",
      fn: () => {
        flash(["resource_link_id"]);
        addLog(
          "Tool POSTed score 87/100 via lis_result_sourcedid → LMS gradebook updated ✓"
        );
      },
    },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Actions + log */}
      <div className="space-y-3">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted">
          Try These Actions
        </p>
        {actions.map((a, i) => (
          <button
            key={i}
            onClick={a.fn}
            className="flex w-full items-start gap-3 rounded-xl border border-border bg-surface p-4 text-left transition hover:border-violet-500/30 hover:bg-violet-500/5"
          >
            <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-violet-500/15">
              <span className="text-xs font-bold text-violet-400">{i + 1}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-fg">{a.label}</p>
              <p className="text-xs text-muted">{a.desc}</p>
            </div>
          </button>
        ))}

        {log.length > 0 && (
          <div className="mt-2 space-y-1.5 pt-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              Activity Log
            </p>
            {log.map((l, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-surface px-3 py-2 font-mono text-xs text-muted"
              >
                {l}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Live panel */}
      <LtiDataPanel params={params} highlight={highlight} />
    </div>
  );
}

// ─── Grade Passback Section ───────────────────────────────────────────────────

function GradePassbackSection() {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);

  const handleRun = () => {
    if (running) return;
    setRunning(true);
    setStep(0);
    setTimeout(() => setStep(1), 500);
    setTimeout(() => setStep(2), 1400);
    setTimeout(() => {
      setStep(3);
      setRunning(false);
    }, 2200);
  };

  const boxes = [
    {
      title: "Coding Lab",
      subtitle: "External Tool",
      icon: Code,
      activeColor: "text-brand",
      activeBorder: "border-brand/40",
      activeBg: "bg-brand/10",
      activeLabel: "Score: 87/100",
      activeLabelColor: "text-brand",
      showAt: 1,
    },
    {
      title: "LTI Bridge",
      subtitle: "Secure Channel",
      icon: Link2,
      activeColor: "text-violet-400",
      activeBorder: "border-violet-500/40",
      activeBg: "bg-violet-500/10",
      activeLabel: "Routing…",
      activeLabelColor: "text-violet-400",
      showAt: 2,
    },
    {
      title: "LMS Gradebook",
      subtitle: "Your Platform",
      icon: BarChart3,
      activeColor: "text-emerald-400",
      activeBorder: "border-emerald-500/40",
      activeBg: "bg-emerald-500/10",
      activeLabel: "✓ Grade Recorded",
      activeLabelColor: "text-emerald-400",
      showAt: 3,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Three boxes */}
      <div className="grid gap-4 sm:grid-cols-3">
        {boxes.map((box, i) => {
          const Icon = box.icon;
          const active = step >= box.showAt;
          return (
            <motion.div
              key={i}
              animate={
                active
                  ? { borderColor: "rgba(99,102,241,0.4)" }
                  : { borderColor: "rgba(99,102,241,0.1)" }
              }
              className={`rounded-xl border p-5 text-center transition-all ${
                active ? `${box.activeBorder} ${box.activeBg}` : "border-border bg-surface"
              }`}
            >
              <Icon
                className={`mx-auto mb-3 h-8 w-8 transition-colors ${
                  active ? box.activeColor : "text-muted"
                }`}
              />
              <p className="text-sm font-semibold text-fg">{box.title}</p>
              <p className="mt-0.5 text-xs text-muted">{box.subtitle}</p>
              {active && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-2 text-xs font-bold ${box.activeLabelColor}`}
                >
                  {box.activeLabel}
                </motion.p>
              )}
              {/* Arrow between boxes (except last) */}
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={handleRun}
          disabled={running}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          <Award className="h-4 w-4" />
          Submit Assignment &amp; Pass Grade Back
        </button>
      </div>

      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center"
        >
          <p className="text-sm font-semibold text-emerald-400">
            Grade 87/100 automatically synced to the LMS — no manual entry, no
            copy-paste.
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ─── Comparison Table ─────────────────────────────────────────────────────────

function ComparisonTable() {
  const rows = [
    {
      feature: "Purpose",
      scorm: "Track progress within content",
      lti: "Launch external tools from LMS",
    },
    {
      feature: "Content lives",
      scorm: "Inside the LMS",
      lti: "On an external server",
    },
    {
      feature: "Auth mechanism",
      scorm: "None needed (same origin)",
      lti: "OAuth-signed SSO token",
    },
    {
      feature: "Data direction",
      scorm: "Content → LMS (score/progress)",
      lti: "LMS ↔ Tool (launch + grade passback)",
    },
    {
      feature: "Complexity",
      scorm: "Simple JS API calls",
      lti: "Signed OAuth handshake",
    },
    {
      feature: "Example",
      scorm: "Quiz built in Articulate Storyline",
      lti: "Coding lab powered by CoderPad",
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted">
              Feature
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-brand">
              SCORM
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-violet-400">
              LTI
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-border/60 ${
                i % 2 === 0 ? "bg-bg" : "bg-surface/40"
              }`}
            >
              <td className="px-4 py-3 font-medium text-fg">{row.feature}</td>
              <td className="px-4 py-3 text-muted">{row.scorm}</td>
              <td className="px-4 py-3 text-muted">{row.lti}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Real World Section ───────────────────────────────────────────────────────

function RealWorldSection() {
  const products = [
    {
      name: "Coursera",
      tag: "Consumer EdTech",
      desc: "Launches Jupyter Notebooks and coding environments inside courses without separate logins.",
      color: "text-brand",
      bg: "bg-brand/10",
      border: "border-brand/20",
    },
    {
      name: "Scaler",
      tag: "Upskilling Platform",
      desc: "Integrates coding IDE and mock interview tools directly inside course modules via LTI.",
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
    {
      name: "upGrad",
      tag: "Higher Ed",
      desc: "Connects project submission tools and plagiarism checkers to the LMS via LTI grade passback.",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      name: "Moodle",
      tag: "Open-source LMS",
      desc: "Deep LTI support out of the box — connects hundreds of certified third-party tools.",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      name: "Canvas",
      tag: "University LMS",
      desc: "Used by universities globally — LTI enables Turnitin, Zoom, and lab tools without re-login.",
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

// ─── PM Takeaways ─────────────────────────────────────────────────────────────

function PmTakeawaysSection() {
  const cards = [
    {
      icon: Zap,
      color: "text-brand",
      bg: "bg-brand/10",
      title: "Friction is a product decision",
      body: "Every extra login is a drop-off event. When speccing a tool integration, the default ask should be \"can this be LTI?\" not \"link to their website.\"",
    },
    {
      icon: Shield,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      title: "Security is baked in, not bolted on",
      body: "LTI uses OAuth signatures — credentials never cross systems as plain text. Ask your security team to verify that third-party integrations are LTI-certified.",
    },
    {
      icon: BarChart3,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      title: "Grade passback enables real dashboards",
      body: "Without LTI passback, instructors manually enter scores. With it, you can build real-time learning analytics without extra engineering work.",
    },
    {
      icon: Globe,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      title: "Push for open standards, not proprietary hooks",
      body: "LTI is an IMS standard. Push vendors to be LTI-certified rather than building proprietary integrations you'll own forever.",
    },
    {
      icon: User,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      title: "Roles shape the tool experience",
      body: "The same LTI tool shows a different UI to a Student vs Instructor. Your PRD should explicitly specify what each role sees when the tool opens.",
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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LtiPage() {
  const [phase, setPhase] = useState<Phase>("idle");

  const handleLaunch = () => {
    setPhase("launching");
    // Auto-advance to token exchange after comparison is shown
    setTimeout(() => setPhase("exchanging"), 2800);
  };

  const handleExchangeComplete = () => {
    setPhase("authenticated");
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* ── Hero / Scene 1 ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(139,92,246,0.1) 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="pointer-events-none absolute left-1/3 top-0 h-[400px] w-[500px] -translate-y-1/3 rounded-full bg-violet-500/15 blur-[120px]" />
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
            {/* Left copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1"
              >
                <Link2 className="h-3.5 w-3.5 text-violet-400" />
                <span className="text-xs font-semibold tracking-wide text-violet-400">
                  EdTech · LTI · Scene 1 of 10
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="mb-4 text-3xl font-black tracking-tight text-fg md:text-4xl"
              >
                Ever opened a coding lab inside your LMS{" "}
                <span className="bg-gradient-to-r from-violet-400 to-brand bg-clip-text text-transparent">
                  without logging in again?
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-[15px] leading-relaxed text-muted"
              >
                That seamless jump is{" "}
                <strong className="text-fg">LTI</strong> — a secure handshake
                that tells the external tool exactly who you are, what course
                you&apos;re in, and what role you hold. No re-login. No
                copy-paste.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 flex flex-wrap gap-2"
              >
                {["SSO", "OAuth Signed", "Grade Passback", "Role Aware"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted"
                    >
                      {tag}
                    </span>
                  )
                )}
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="mt-5 text-xs text-muted"
              >
                👆 Click{" "}
                <strong className="text-violet-400">Launch Coding Lab</strong>{" "}
                in the dashboard to start the simulation
              </motion.p>
            </div>

            {/* Right: LMS dashboard */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <LmsDashboard phase={phase} onLaunch={handleLaunch} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Scene 2: Comparison overlay ────────────────────────────────────── */}
      <AnimatePresence>
        {phase === "launching" && (
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
                className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-violet-400"
              >
                Scene 2 · Why LTI Exists
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8 text-center text-2xl font-black text-fg"
              >
                Without LTI vs With LTI
              </motion.h2>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Without */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-400" />
                    <span className="font-bold text-red-400">Without LTI</span>
                  </div>
                  <ul className="space-y-2.5">
                    {[
                      "Opens a new tab → login page",
                      "User creates yet another account",
                      "Grades manually entered in LMS",
                      "Tool has no context (course, role)",
                      "Friction → learner drop-off",
                    ].map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="flex items-start gap-2 text-sm text-muted"
                      >
                        <span className="mt-0.5 shrink-0 text-red-400">✗</span>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* With */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <span className="font-bold text-emerald-400">With LTI</span>
                  </div>
                  <ul className="space-y-2.5">
                    {[
                      "One click → directly inside tool",
                      "Auto-authenticated as correct user",
                      "Grades flow back automatically",
                      "Tool knows course, role, context",
                      "Seamless UX → higher completion",
                    ].map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + i * 0.1 }}
                        className="flex items-start gap-2 text-sm text-muted"
                      >
                        <span className="mt-0.5 shrink-0 text-emerald-400">
                          ✓
                        </span>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-6 text-center text-xs text-muted"
              >
                Establishing secure connection…
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Scene 3: Token exchange overlay ────────────────────────────────── */}
      <AnimatePresence>
        {phase === "exchanging" && (
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
                className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-violet-400"
              >
                Scene 3 · Secure Handshake
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6 text-center text-xl font-black text-fg"
              >
                Token Exchange in Progress
              </motion.h2>
              <TokenExchangeAnimation onComplete={handleExchangeComplete} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Scene 4: Tool opened overlay ───────────────────────────────────── */}
      <AnimatePresence>
        {phase === "authenticated" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-bg/92 backdrop-blur-md"
          >
            <div className="mx-auto w-full max-w-lg px-5">
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-emerald-400"
              >
                Scene 4 · Tool Launched
              </motion.p>

              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1,
                }}
                className="overflow-hidden rounded-2xl border border-emerald-500/30 bg-surface shadow-glow"
              >
                {/* Fake browser chrome */}
                <div className="flex items-center gap-3 border-b border-border bg-surface/80 px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 rounded-md bg-bg/60 px-3 py-1 text-center text-xs text-muted">
                    coderpad.io/lab/backend_fundamentals
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-fg">
                        Welcome, Soham 👋
                      </h3>
                      <p className="text-sm text-muted">
                        Backend Development · Coding Lab
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                      <Shield className="h-3 w-3" />
                      Authenticated by LMS
                    </span>
                  </div>

                  <div className="mb-5 space-y-2">
                    {[
                      { label: "Role", value: "Learner" },
                      { label: "Course", value: "Backend Development" },
                      { label: "Assignment", value: "Node.js REST API" },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between rounded-lg bg-bg/60 px-3 py-2 text-sm"
                      >
                        <span className="text-muted">{label}</span>
                        <span className="font-medium text-fg">{value}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setPhase("idle")}
                    className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Awesome! Back to learning →
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Scene 5: Interactive Playground ────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SceneLabel number={5} title="Interactive Playground" />
          <h2 className="mb-3 text-2xl font-black tracking-tight text-fg md:text-3xl">
            Explore LTI Parameters Live
          </h2>
          <p className="mb-8 max-w-xl text-[15px] text-muted">
            Tweak launch parameters and watch the panel update in real time —
            just like what happens during an actual LTI handshake.
          </p>
          <InteractivePlayground />
        </motion.div>
      </section>

      {/* ── Scene 6: Grade Passback ─────────────────────────────────────────── */}
      <section className="border-t border-border/50 bg-surface/30">
        <div className="mx-auto max-w-5xl px-5 py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SceneLabel number={6} title="Grade Passback" />
            <h2 className="mb-3 text-2xl font-black tracking-tight text-fg md:text-3xl">
              Grades flow back automatically
            </h2>
            <p className="mb-8 max-w-xl text-[15px] text-muted">
              When a learner submits work in the external tool, LTI sends the
              score back to the LMS — no manual grading, no copy-paste, no
              delay.
            </p>
            <GradePassbackSection />
          </motion.div>
        </div>
      </section>

      {/* ── Scene 7: SCORM vs LTI ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SceneLabel number={7} title="SCORM vs LTI" />
          <h2 className="mb-3 text-2xl font-black tracking-tight text-fg md:text-3xl">
            SCORM and LTI are not the same thing
          </h2>
          <p className="mb-8 max-w-xl text-[15px] text-muted">
            Engineers and PMs confuse these constantly. Here&apos;s the clean
            breakdown:
          </p>
          <ComparisonTable />
          <div className="mt-6 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
            <p className="text-sm text-muted">
              <span className="font-semibold text-fg">Mental model:</span> SCORM
              is for content that lives <em>inside</em> the LMS. LTI is for
              tools that live <em>outside</em> the LMS but need to talk to it.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── Scene 8: Real World ─────────────────────────────────────────────── */}
      <section className="border-t border-border/50 bg-surface/30">
        <div className="mx-auto max-w-5xl px-5 py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SceneLabel number={8} title="Real World" />
            <h2 className="mb-3 text-2xl font-black tracking-tight text-fg md:text-3xl">
              Products you know that use LTI
            </h2>
            <p className="mb-10 max-w-xl text-[15px] text-muted">
              Every time you &quot;launch&quot; a tool inside a learning
              platform without logging in, LTI is running the handshake.
            </p>
            <RealWorldSection />
          </motion.div>
        </div>
      </section>

      {/* ── Scene 9: PM Takeaways ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SceneLabel number={9} title="Product Thinking" />
          <h2 className="mb-3 text-2xl font-black tracking-tight text-fg md:text-3xl">
            What a PM needs to know about LTI
          </h2>
          <p className="mb-10 max-w-xl text-[15px] text-muted">
            You won&apos;t implement LTI yourself — but knowing this helps you
            ask the right questions and make better integration decisions.
          </p>
          <PmTakeawaysSection />
        </motion.div>
      </section>

      {/* ── Scene 10: Final callout ─────────────────────────────────────────── */}
      <section className="border-t border-border/50 bg-surface/30">
        <div className="mx-auto max-w-3xl px-5 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-violet-400">
              Scene 10 · The Big Picture
            </p>

            <div className="mb-8 flex justify-center gap-3">
              {[GraduationCap, Link2, Code, BarChart3, Sparkles].map(
                (Icon, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -10 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: i * 0.1,
                      type: "spring",
                      stiffness: 280,
                    }}
                    className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/15 text-violet-400"
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>
                )
              )}
            </div>

            <h2 className="mb-4 text-3xl font-black tracking-tight text-fg md:text-4xl">
              Now you know why you{" "}
              <span className="bg-gradient-to-r from-violet-400 to-brand bg-clip-text text-transparent">
                never log in twice.
              </span>
            </h2>
            <p className="mb-2 text-xl font-bold text-muted">That&apos;s LTI.</p>
            <p className="mx-auto max-w-md text-[15px] text-muted">
              A secure, standardized handshake that glues your LMS to every
              external tool — making the experience seamless for learners and
              automatic for instructors.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                href="/domain-knowledge/edtech/scorm"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium text-muted transition hover:text-fg"
              >
                <ArrowLeft className="h-4 w-4" />
                Revisit SCORM
              </Link>
              <Link
                href="/domain-knowledge/edtech"
                className="inline-flex items-center gap-2 rounded-full bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:opacity-90"
              >
                Explore More EdTech Concepts
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
