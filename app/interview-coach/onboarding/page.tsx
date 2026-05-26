"use client";

import { useState } from "react";

type Role = "Product Manager" | "Business Analyst" | "Product Analytics";
type Experience = "Fresher" | "1-2 Years" | "3+ Years";

interface FormData {
  role: Role | null;
  experience: Experience | null;
  targetCompanies: string;
  strengths: string;
  weaknesses: string;
}

const STEPS = ["Role", "Experience", "Companies", "Skills", "Summary"];

const ROLES: { label: Role; icon: string; desc: string }[] = [
  { label: "Product Manager", icon: "◈", desc: "Drive product vision & roadmap" },
  { label: "Business Analyst", icon: "◉", desc: "Translate data into decisions" },
  { label: "Product Analytics", icon: "◎", desc: "Turn metrics into strategy" },
];

const EXPERIENCE_LEVELS: { label: Experience; desc: string }[] = [
  { label: "Fresher", desc: "0–1 year, entering the field" },
  { label: "1-2 Years", desc: "Some industry experience" },
  { label: "3+ Years", desc: "Senior-level practitioner" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const [form, setForm] = useState<FormData>({
    role: null,
    experience: null,
    targetCompanies: "",
    strengths: "",
    weaknesses: "",
  });

  const transition = (cb: () => void) => {
    setVisible(false);
    setTimeout(() => {
      cb();
      setVisible(true);
    }, 160);
  };

  const next = () => transition(() => setStep((s) => s + 1));
  const back = () => transition(() => setStep((s) => s - 1));

  const canAdvance = () => {
    if (step === 0) return !!form.role;
    if (step === 1) return !!form.experience;
    if (step === 2) return form.targetCompanies.trim().length > 0;
    if (step === 3) return form.strengths.trim().length > 0 && form.weaknesses.trim().length > 0;
    return true;
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4 py-12">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-violet-400 mb-2">
            PMVerse AI
          </p>
          <h1 className="text-2xl font-bold text-white">Interview Coach Setup</h1>
          <p className="text-sm text-zinc-500 mt-1">Personalise your practice experience</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex flex-col items-center gap-1 flex-1">
                <div
                  className={`h-1.5 w-full rounded-full transition-all duration-500 ${
                    i < step
                      ? "bg-violet-500"
                      : i === step
                      ? "bg-violet-600"
                      : "bg-white/10"
                  }`}
                />
                <span
                  className={`text-[10px] font-medium transition-colors duration-300 ${
                    i <= step ? "text-violet-400" : "text-zinc-600"
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div
          className={`rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 shadow-2xl transition-all duration-160 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          {/* Step 0 — Role */}
          {step === 0 && (
            <div>
              <StepHeader
                title="What's your role?"
                subtitle="Choose the track that best fits your goals"
              />
              <div className="flex flex-col gap-3 mt-6">
                {ROLES.map(({ label, icon, desc }) => (
                  <SelectCard
                    key={label}
                    selected={form.role === label}
                    onClick={() => setForm((f) => ({ ...f, role: label }))}
                    icon={icon}
                    label={label}
                    desc={desc}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 1 — Experience */}
          {step === 1 && (
            <div>
              <StepHeader
                title="Your experience level?"
                subtitle="We'll calibrate question difficulty accordingly"
              />
              <div className="flex flex-col gap-3 mt-6">
                {EXPERIENCE_LEVELS.map(({ label, desc }) => (
                  <SelectCard
                    key={label}
                    selected={form.experience === label}
                    onClick={() => setForm((f) => ({ ...f, experience: label }))}
                    label={label}
                    desc={desc}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Target Companies */}
          {step === 2 && (
            <div>
              <StepHeader
                title="Target companies"
                subtitle="Which companies are you interviewing at?"
              />
              <div className="mt-6">
                <label className="block text-xs font-medium text-zinc-400 mb-2">
                  Company names <span className="text-zinc-600">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Google, Meta, Airbnb, Stripe..."
                  value={form.targetCompanies}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, targetCompanies: e.target.value }))
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none ring-0 transition focus:border-violet-500/60 focus:bg-white/8 focus:ring-1 focus:ring-violet-500/30"
                />
                <p className="mt-3 text-xs text-zinc-600">
                  We'll tailor questions to each company's interview style.
                </p>
              </div>
            </div>
          )}

          {/* Step 3 — Strengths & Weaknesses */}
          {step === 3 && (
            <div>
              <StepHeader
                title="Strengths & weaknesses"
                subtitle="Help us focus your practice sessions"
              />
              <div className="flex flex-col gap-4 mt-6">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2">
                    Your strengths
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Strong analytical thinking, good at stakeholder communication..."
                    value={form.strengths}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, strengths: e.target.value }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none resize-none transition focus:border-violet-500/60 focus:bg-white/8 focus:ring-1 focus:ring-violet-500/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2">
                    Areas to improve
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Structuring answers under pressure, metric-driven thinking..."
                    value={form.weaknesses}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, weaknesses: e.target.value }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none resize-none transition focus:border-violet-500/60 focus:bg-white/8 focus:ring-1 focus:ring-violet-500/30"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4 — Summary */}
          {step === 4 && (
            <div className="text-center">
              <div className="flex justify-center mb-5">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600/20 text-3xl border border-violet-500/20">
                  ✦
                </span>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-br from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Your PM Interview Journey
                <br />
                Starts Here
              </h2>
              <p className="text-sm text-zinc-500 mt-2 mb-8">
                Here's a summary of your profile
              </p>

              <div className="text-left flex flex-col gap-3">
                <SummaryRow label="Role" value={form.role ?? "—"} />
                <SummaryRow label="Experience" value={form.experience ?? "—"} />
                <SummaryRow label="Target Companies" value={form.targetCompanies || "—"} />
                <SummaryRow label="Strengths" value={form.strengths || "—"} multiline />
                <SummaryRow label="Improve On" value={form.weaknesses || "—"} multiline />
              </div>

              <a
                href="/interview-coach/session"
                className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all duration-200 hover:bg-violet-500 hover:-translate-y-0.5 active:translate-y-0"
              >
                Start Practicing
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          )}
        </div>

        {/* Navigation */}
        {step < 4 && (
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={back}
              disabled={step === 0}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-400 transition hover:border-white/20 hover:text-white disabled:pointer-events-none disabled:opacity-30"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Back
            </button>

            <span className="text-xs text-zinc-600">
              {step + 1} / {STEPS.length}
            </span>

            <button
              onClick={next}
              disabled={!canAdvance()}
              className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-600/20 transition-all hover:bg-violet-500 hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-40"
            >
              Next
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

/* ── Sub-components ── */

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>
    </div>
  );
}

function SelectCard({
  selected,
  onClick,
  icon,
  label,
  desc,
}: {
  selected: boolean;
  onClick: () => void;
  icon?: string;
  label: string;
  desc: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group w-full rounded-xl border px-4 py-3.5 text-left transition-all duration-150 ${
        selected
          ? "border-violet-500/60 bg-violet-600/10 shadow-sm shadow-violet-500/10"
          : "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/5"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span
            className={`text-lg transition-colors ${
              selected ? "text-violet-400" : "text-zinc-600 group-hover:text-zinc-400"
            }`}
          >
            {icon}
          </span>
        )}
        <div>
          <p
            className={`text-sm font-semibold transition-colors ${
              selected ? "text-white" : "text-zinc-300"
            }`}
          >
            {label}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
        </div>
        <div className="ml-auto">
          <div
            className={`h-4 w-4 rounded-full border-2 transition-all ${
              selected
                ? "border-violet-500 bg-violet-500"
                : "border-zinc-700 group-hover:border-zinc-500"
            }`}
          >
            {selected && (
              <div className="flex h-full w-full items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function SummaryRow({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3">
      <p className="text-[10px] font-semibold tracking-wider uppercase text-zinc-600 mb-1">
        {label}
      </p>
      <p className={`text-sm text-zinc-300 ${multiline ? "leading-relaxed" : ""}`}>
        {value}
      </p>
    </div>
  );
}
