import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/section";
import { AnimatedFlow, type FlowNode } from "@/components/animated-flow";
import { InfoCard } from "@/components/ui/info-card";
import { Quiz } from "@/components/quiz";
import { ModuleSidebar, type ModuleStep } from "@/components/module-sidebar";
import { RestaurantAnalogy } from "@/components/micro/restaurant-analogy";
import { MonolithSimulator } from "@/components/micro/monolith-simulator";
import { ScalingTimeline } from "@/components/micro/scaling-timeline";
import { MicroservicesPlayground } from "@/components/micro/microservices-playground";
import {
  ScalingComparison,
  DeploymentComparison,
  TeamOwnership,
} from "@/components/micro/comparisons";
import { Tradeoffs } from "@/components/micro/tradeoffs";
import { MS_INSIGHTS, MS_QUIZ } from "@/lib/microservices";

export const metadata: Metadata = {
  title: "Microservices vs Monolith — PMverse",
  description:
    "Understand monolith vs microservices visually: a restaurant analogy, interactive simulators, scaling and failure demos, team ownership, balanced trade-offs, and why it matters for product.",
};

const steps: ModuleStep[] = [
  { id: "analogy", label: "Real-World Analogy" },
  { id: "monolith", label: "QuickBite as a Monolith" },
  { id: "scaling", label: "The Scaling Problem" },
  { id: "microservices", label: "Microservices" },
  { id: "scale-compare", label: "Scaling Compared" },
  { id: "deploy-compare", label: "Deployment Compared" },
  { id: "teams", label: "Team Ownership" },
  { id: "tradeoffs", label: "Trade-offs" },
  { id: "why", label: "Why PMs Should Care" },
  { id: "quiz", label: "Scenario Quiz" },
];

const monolithFlow: FlowNode[] = [
  { id: "fe", label: "Frontend", icon: "phone" },
  { id: "be", label: "Single Backend", icon: "boxes", accent: "brand" },
  { id: "db", label: "Single Database", icon: "database" },
];

export default function MicroservicesPage() {
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

          <header className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              Module 04 · Intermediate · 16 min
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Microservices vs Monolith
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
              Why do companies split one big system into many small ones? Watch
              QuickBite grow from a scrappy startup into a platform — and see
              exactly when, and why, the architecture has to change.
            </p>
          </header>

          <Section
            id="analogy"
            eyebrow="Section 1"
            title="Monolith vs Microservices, Explained With a Restaurant"
            description="One small restaurant where everything is connected, versus a food court of independent counters. Toggle between them — that's the entire idea."
          >
            <RestaurantAnalogy />
          </Section>

          <Section
            id="monolith"
            eyebrow="Section 2"
            title="How QuickBite Started — One Big Backend"
            description="At launch, login, payments, restaurants, delivery and notifications all live inside a single backend talking to a single database. Send traffic through it — then crash one feature."
          >
            <div className="mb-6 rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
              <AnimatedFlow nodes={monolithFlow} />
              <p className="mt-7 text-sm leading-relaxed text-muted">
                Simple and fast to build — every feature shares one codebase,
                one process, one database.
              </p>
            </div>
            <MonolithSimulator />
          </Section>

          <Section
            id="scaling"
            eyebrow="Section 3"
            title="The Scaling Problem"
            description="QuickBite goes from 10K to 5 million users. Step through the growth and watch traffic, backend stress and downtime risk climb together."
          >
            <ScalingTimeline />
          </Section>

          <Section
            id="microservices"
            eyebrow="Section 4"
            title="QuickBite Moves to Microservices"
            description="The backend is split into independent services behind an API gateway. Trigger a user action and watch the request route only to the services it actually needs."
          >
            <MicroservicesPlayground />
          </Section>

          <Section
            id="scale-compare"
            eyebrow="Section 5"
            title="Scaling — Monolith vs Microservices"
            description="A dinner-time traffic spike hits. See what scales in each model — and what it costs."
          >
            <ScalingComparison />
          </Section>

          <Section
            id="deploy-compare"
            eyebrow="Section 6"
            title="Deployment — Monolith vs Microservices"
            description="Engineering ships a small notification-feature update. Watch how much of the product is put at risk in each model."
          >
            <DeploymentComparison />
          </Section>

          <Section
            id="teams"
            eyebrow="Section 7"
            title="Team Ownership"
            description="Architecture quietly shapes how your engineering org works — and how fast it can move."
          >
            <TeamOwnership />
            <p className="mt-5 rounded-xl bg-brand-soft px-4 py-3 text-sm">
              <span className="font-semibold text-brand">PM insight: </span>
              architecture affects organizational structure — clear service
              ownership lets teams move in parallel instead of waiting on each
              other.
            </p>
          </Section>

          <Section
            id="tradeoffs"
            eyebrow="Section 8"
            title="The Honest Trade-offs"
            description="Microservices are not “always better”. For a young product, a monolith is often the right call. Here's the balanced view."
          >
            <Tradeoffs />
          </Section>

          <Section
            id="why"
            eyebrow="Section 9"
            title="Why this matters for product managers"
            description="You won't choose the architecture — but it sets the limits on scale, reliability, release speed and roadmap velocity that you live with."
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {MS_INSIGHTS.map((card, i) => (
                <InfoCard key={card.title} data={card} index={i} />
              ))}
            </div>
          </Section>

          <Section
            id="quiz"
            eyebrow="Section 10"
            title="Test your instinct"
            description="A real incident at QuickBite. Which architecture protects the business here?"
          >
            <Quiz
              scenario={MS_QUIZ.scenario}
              question={MS_QUIZ.question}
              options={MS_QUIZ.options}
            />
          </Section>

          <div className="mt-10 rounded-2xl border border-border bg-brand-soft p-8 text-center">
            <h3 className="text-lg font-semibold">Module complete</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              You can now explain why companies split systems into services,
              the real trade-offs involved, and how architecture shapes
              scalability, releases and team velocity.
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
