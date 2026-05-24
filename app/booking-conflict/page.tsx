import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Section } from "@/components/ui/section";
import { InfoCard } from "@/components/ui/info-card";
import { ModuleSidebar, type ModuleStep } from "@/components/module-sidebar";
import { BookingSimulator } from "@/components/booking/booking-simulator";
import { ArchitectureFlow } from "@/components/booking/architecture-flow";
import { AIAssistantPanel } from "@/components/booking/ai-assistant-panel";
import { DeterministicVsAI } from "@/components/booking/deterministic-vs-ai";
import { TRADEOFFS } from "@/lib/booking-conflict";

export const metadata: Metadata = {
  title: "AI-Assisted Booking Conflict Resolution — PMverse",
  description:
    "An interactive PM hackathon simulator: three customers race for one slot. Watch slot locking, payment delays, graceful rejection, AI alternatives, and the hard rule that AI assists but never decides booking ownership.",
};

const steps: ModuleStep[] = [
  { id: "scenario", label: "The Scenario" },
  { id: "simulator", label: "Live Simulator" },
  { id: "architecture", label: "System Architecture" },
  { id: "ai", label: "AI Assistant" },
  { id: "vs", label: "Deterministic vs AI" },
  { id: "tradeoffs", label: "Product Trade-offs" },
  { id: "takeaways", label: "Key Takeaways" },
];

export default function BookingConflictPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-28">
      <div className="flex gap-12 pt-10">
        <ModuleSidebar steps={steps} />

        <div className="min-w-0 flex-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
          >
            <ArrowLeft className="h-4 w-4" />
            All concepts
          </Link>

          {/* Hero */}
          <header className="relative mt-6 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand-soft via-surface to-surface p-7 md:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/20 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"
            />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand shadow-soft">
                <Sparkles className="h-3.5 w-3.5" />
                PM Hackathon · Advanced · 20 min
              </span>
              <h1 className="mt-5 text-balance text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
                AI-Assisted Booking{" "}
                <span className="bg-gradient-to-r from-brand to-sky-400 bg-clip-text text-transparent">
                  Conflict Resolution
                </span>
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted md:text-base">
                Three customers tap{" "}
                <span className="font-semibold text-fg">Book</span> on the
                same slot at the same instant. Only one can win. How do you
                pick the winner fairly, recover the losers gracefully, and use
                AI to soften the disappointment — without ever letting AI
                decide ownership?
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-medium">
                {[
                  "Concurrency",
                  "Distributed locks",
                  "Graceful failure",
                  "AI as experience layer",
                  "Trust & fairness",
                ].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-surface px-3 py-1 text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </header>

          <Section
            id="scenario"
            eyebrow="The Scenario"
            title="One slot. Three customers. Same millisecond."
            description="A high-demand provider posts a single 5pm appointment. Aanya, Bilal and Chitra all tap Book within ~200ms of each other. Without a deterministic decider, you risk a double-booking, a refund spiral, and three angry tweets."
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <InfoCard
                index={0}
                data={{
                  icon: "alert",
                  title: "The risk",
                  body: "Two customers paid, one slot exists. Either you double-book and burn a provider, or you refund and burn trust.",
                }}
              />
              <InfoCard
                index={1}
                data={{
                  icon: "lock",
                  title: "The mechanism",
                  body: "A Redis lock with a short TTL gives exactly one writer ownership. Losers receive a clean 409, not a 500.",
                }}
              />
              <InfoCard
                index={2}
                data={{
                  icon: "sparkles",
                  title: "The experience",
                  body: "AI doesn't pick the winner — it cushions the losers with relevant alternates and warm copy in under a second.",
                }}
              />
            </div>
          </Section>

          <Section
            id="simulator"
            eyebrow="Live Simulator"
            title="Run the conflict yourself"
            description="Press Start Simulation to fire three concurrent booking requests. Watch slot locking, payment processing, graceful rejection, and AI-assisted recovery happen in real time."
          >
            <BookingSimulator />
          </Section>

          <Section
            id="architecture"
            eyebrow="System Architecture"
            title="Where the decision actually happens"
            description="A request flows through five layers. Only one of them is allowed to say who owns the slot."
          >
            <ArchitectureFlow />
          </Section>

          <Section
            id="ai"
            eyebrow="AI Assistant"
            title="What the AI is allowed to do"
            description="The model gets three jobs — and one hard guardrail. Pick a suggestion type to see the live preview."
          >
            <AIAssistantPanel />
          </Section>

          <Section
            id="vs"
            eyebrow="Deterministic vs AI"
            title="Who owns what"
            description="The clearest line a PM can draw on the spec: deterministic systems own the booking, AI owns the experience around it."
          >
            <DeterministicVsAI />
          </Section>

          <Section
            id="tradeoffs"
            eyebrow="Trade-offs"
            title="The three tensions you're really designing"
            description="There's no objectively right answer to any of these — only the one your product team picks on purpose."
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {TRADEOFFS.map((card, i) => (
                <InfoCard key={card.title} data={card} index={i} />
              ))}
            </div>
          </Section>

          <Section
            id="takeaways"
            eyebrow="Key Takeaways"
            title="What you'd say in the interview"
            description="The PM-level summary of how to design a booking system that can race three customers for one slot and still feel kind."
          >
            <ol className="space-y-3">
              {[
                "Make the decider deterministic. A Redis lock or DB-level unique constraint is the source of truth — never the LLM, never the client.",
                "Reject losers cleanly and fast. A 409 with an immediate alternative beats a 500 with a refund email.",
                "Use AI as the experience layer. Alternate slots, nearby providers, empathetic copy — never the allocator.",
                "Tune lock TTLs as a product lever. Too short = abandoned carts. Too long = held-but-empty slots.",
                "Measure what matters to trust. Double bookings prevented, payment timeouts handled, alt-slot recovery rate.",
              ].map((t, i) => (
                <li
                  key={i}
                  className="flex gap-3 rounded-2xl border border-border bg-surface p-4 shadow-soft"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-xs font-semibold text-white">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed">{t}</p>
                </li>
              ))}
            </ol>
          </Section>

          <div className="mt-10 rounded-2xl border border-border bg-brand-soft p-8 text-center">
            <h3 className="text-lg font-semibold">Module complete</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              You can now defend the design of a high-contention booking flow:
              who owns the decision, where AI helps, and how to measure
              fairness without sacrificing conversion.
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
            >
              Back to all concepts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
