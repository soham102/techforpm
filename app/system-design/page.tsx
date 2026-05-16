import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/section";
import { AnimatedFlow, type FlowNode } from "@/components/animated-flow";
import { InfoCard } from "@/components/ui/info-card";
import { Quiz } from "@/components/quiz";
import { ModuleSidebar, type ModuleStep } from "@/components/module-sidebar";
import { SdAnalogyMap } from "@/components/sys/sd-analogy-map";
import { RequestJourney } from "@/components/sys/request-journey";
import {
  ScalingSimulation,
  LoadBalancer,
} from "@/components/sys/scaling";
import { FailureSim } from "@/components/sys/failure-sim";
import { ArchitecturePlayground } from "@/components/sys/architecture-playground";
import { SD_INSIGHTS, SD_QUIZ } from "@/lib/system-design";

export const metadata: Metadata = {
  title: "System Design Basics — Tech Concepts for PMs",
  description:
    "Understand system design visually: a restaurant-chain analogy, a clickable architecture, a full request-journey simulator, scaling, load balancing, failure simulations, and a build-it-yourself playground.",
};

const steps: ModuleStep[] = [
  { id: "analogy", label: "Real-World Analogy" },
  { id: "internals", label: "How QuickBite Works" },
  { id: "journey", label: "Request Journey" },
  { id: "scaling", label: "Scaling Simulation" },
  { id: "loadbalancer", label: "Load Balancer" },
  { id: "failures", label: "Failure Simulation" },
  { id: "playground", label: "Architecture Playground" },
  { id: "why", label: "Why PMs Should Care" },
  { id: "quiz", label: "Scenario Quiz" },
];

const archFlow: FlowNode[] = [
  {
    id: "fe",
    label: "Frontend App",
    icon: "phone",
    detail: {
      title: "Frontend — what users interact with",
      body: "Buttons, screens, the order-tracking UI. It doesn't process anything itself. PM insight: frontend performance shapes user perception — a fast-feeling app feels trustworthy.",
    },
  },
  {
    id: "api",
    label: "API Layer",
    icon: "network",
    accent: "brand",
    detail: {
      title: "API layer — the messenger",
      body: "APIs let the frontend and backend talk in a clear, agreed format. Every request and response passes through here.",
    },
  },
  {
    id: "be",
    label: "Backend Services",
    icon: "server",
    detail: {
      title: "Backend — the business logic",
      body: "Placing orders, processing payments, assigning drivers. PM insight: backend reliability affects product trust — if it's flaky, the whole product feels unreliable.",
    },
  },
  {
    id: "db",
    label: "Database",
    icon: "database",
    detail: {
      title: "Database — permanent storage",
      body: "Users, restaurants, orders. PM insight: data quality impacts analytics and personalization — bad data means bad decisions later.",
    },
  },
  {
    id: "notif",
    label: "Notification System",
    icon: "bell",
    detail: {
      title: "Notifications — keeping everyone informed",
      body: "Alerts the restaurant to cook and updates the customer. Invisible when it works, very visible when it doesn't.",
    },
  },
  {
    id: "track",
    label: "Delivery Tracking",
    icon: "bike",
    detail: {
      title: "Delivery tracking — real-time logistics",
      body: "Assigns riders and streams live location to the map. The part customers anxiously watch.",
    },
  },
];

export default function SystemDesignPage() {
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
              Module 05 · Intermediate · 18 min
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              System Design Basics
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
              What actually happens between tapping a button and seeing a
              result? We'll trace one request end to end, then watch QuickBite
              scale, balance load, and fail — all visually.
            </p>
          </header>

          <Section
            id="analogy"
            eyebrow="Section 1"
            title="System Design Is Like Running a Restaurant Chain"
            description="Customer → cashier → kitchen → storage → delivery. Every software system is just this same flow with different names. Hover each pairing."
          >
            <SdAnalogyMap />
          </Section>

          <Section
            id="internals"
            eyebrow="Section 2"
            title="How QuickBite Works Internally"
            description="When a user opens QuickBite and orders food, the request travels through these layers. Tap any component to see what it does and why it matters for product."
          >
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
              <AnimatedFlow nodes={archFlow} />
              <p className="mt-7 text-sm leading-relaxed text-muted">
                Each layer has one job. Good system design is mostly about
                keeping these responsibilities clean and the connections
                reliable.
              </p>
            </div>
          </Section>

          <Section
            id="journey"
            eyebrow="Section 3"
            title="The User Request Journey"
            description="This is the core of the module. Trigger an action and watch the request travel through every internal step in real time."
          >
            <RequestJourney />
          </Section>

          <Section
            id="scaling"
            eyebrow="Section 4"
            title="Scaling Simulation"
            description="QuickBite traffic explodes during an IPL final. Compare the same spike with and without the system's ability to scale."
          >
            <ScalingSimulation />
          </Section>

          <Section
            id="loadbalancer"
            eyebrow="Section 5"
            title="The Load Balancer"
            description="How does traffic get shared across all those servers? One quiet component does it — the load balancer."
          >
            <LoadBalancer />
          </Section>

          <Section
            id="failures"
            eyebrow="Section 6"
            title="When Systems Fail"
            description="Reliability isn't abstract. Trigger a real failure and watch how one internal problem becomes a very visible user problem."
          >
            <FailureSim />
          </Section>

          <Section
            id="playground"
            eyebrow="Section 7"
            title="Build It Yourself"
            description="Tap components onto the canvas to assemble a QuickBite system, then run a request and watch the data flow through what you built."
          >
            <ArchitecturePlayground />
          </Section>

          <Section
            id="why"
            eyebrow="Section 8"
            title="Why this matters for product managers"
            description="You won't design the system — but its shape decides the speed, reliability and scale your product can actually deliver."
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SD_INSIGHTS.map((card, i) => (
                <InfoCard key={card.title} data={card} index={i} />
              ))}
            </div>
          </Section>

          <Section
            id="quiz"
            eyebrow="Section 9"
            title="Test your instinct"
            description="A real outage at QuickBite. What would a strong PM suspect first?"
          >
            <Quiz
              scenario={SD_QUIZ.scenario}
              question={SD_QUIZ.question}
              options={SD_QUIZ.options}
            />
          </Section>

          <div className="mt-10 rounded-2xl border border-border bg-brand-soft p-8 text-center">
            <h3 className="text-lg font-semibold">Module complete</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              You can now picture exactly what happens when a user taps a
              button — and why scaling, load balancing and resilience are
              product concerns, not just engineering ones.
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
