import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/section";
import { AnimatedFlow, type FlowNode } from "@/components/animated-flow";
import { InfoCard } from "@/components/ui/info-card";
import { Quiz } from "@/components/quiz";
import { ModuleSidebar, type ModuleStep } from "@/components/module-sidebar";
import { QueueAnalogyMap } from "@/components/queue/queue-analogy-map";
import { WhyDelay } from "@/components/queue/why-delay";
import { SyncVsAsync } from "@/components/queue/sync-vs-async";
import { QueuePlayground } from "@/components/queue/queue-playground";
import { ProductExamples } from "@/components/queue/product-examples";
import { TrafficSpike } from "@/components/queue/traffic-spike";
import { FailureRetry } from "@/components/queue/failure-retry";
import { PriorityQueue } from "@/components/queue/priority-queue";
import { QueueAnalytics } from "@/components/queue/queue-analytics";
import { QUEUE_INSIGHTS, QUEUE_QUIZ } from "@/lib/queues";

export const metadata: Metadata = {
  title: "Queues & Background Jobs — Tech Concepts for PMs",
  description:
    "Why apps process some tasks later, explained visually: a restaurant order-counter analogy, synchronous vs asynchronous, a live task-queue playground, traffic spikes, retries, priority queues and a queue analytics dashboard.",
};

const steps: ModuleStep[] = [
  { id: "analogy", label: "Real-World Analogy" },
  { id: "why", label: "Why Apps Delay Tasks" },
  { id: "intro", label: "Queues & Background Jobs" },
  { id: "playground", label: "Task Queue Playground" },
  { id: "sync", label: "Sync vs Async" },
  { id: "examples", label: "Real Product Examples" },
  { id: "spike", label: "Traffic Spike" },
  { id: "failure", label: "Failure & Retry" },
  { id: "priority", label: "Priority Queues" },
  { id: "why-pm", label: "Why PMs Should Care" },
  { id: "analytics", label: "Analytics Dashboard" },
  { id: "quiz", label: "Scenario Quiz" },
];

const archFlow: FlowNode[] = [
  {
    id: "action",
    label: "User Action",
    icon: "click",
    detail: {
      title: "User action",
      body: "A tap that kicks off real work — placing an order, requesting an OTP, uploading a video.",
    },
  },
  {
    id: "resp",
    label: "Instant Response",
    icon: "zap",
    accent: "brand",
    detail: {
      title: "Instant response",
      body: "The app does only what's essential, then immediately confirms. The user moves on — they don't wait for the heavy work.",
    },
  },
  {
    id: "queue",
    label: "Task Queue",
    icon: "receipt",
    detail: {
      title: "Task queue",
      body: "The non-critical work is written down as jobs and lined up — safely buffered, even during a traffic spike.",
    },
  },
  {
    id: "workers",
    label: "Background Workers",
    icon: "kitchen",
    detail: {
      title: "Background workers",
      body: "Independent workers pull jobs off the queue and process them. Add more workers to clear the queue faster.",
    },
  },
  {
    id: "done",
    label: "Jobs Processed",
    icon: "badge",
    detail: {
      title: "Jobs processed",
      body: "Emails sent, invoices generated, analytics updated — all completed after the user already got their confirmation.",
    },
  },
];

export default function QueuesPage() {
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
              Module 12 · Beginner · 18 min
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Queues &amp; Background Jobs
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
              Why does “Order placed!” appear instantly, even though an email,
              an invoice and a dozen other things still have to happen? Let's
              see why apps do some work later — and how that keeps them fast.
            </p>
          </header>

          <Section
            id="analogy"
            eyebrow="Section 1"
            title="Queues Work Like a Restaurant Order Counter"
            description="Imagine a busy restaurant. If the cashier cooked each meal fully before taking the next order, the line would never move. A queue fixes that. Hover each pairing."
          >
            <QueueAnalogyMap />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-rose-500/30 bg-surface p-5 shadow-soft">
                <p className="text-sm font-semibold text-rose-500">
                  Without a queue
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  The chef finishes one customer completely before serving the
                  next — long delays, a frustrated line, an overwhelmed
                  kitchen.
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-500/30 bg-surface p-5 shadow-soft">
                <p className="text-sm font-semibold text-emerald-500">
                  With a queue
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Orders go on the ticket rail; the counter is free instantly.
                  The kitchen works through tickets steadily — smooth, fast,
                  scalable.
                </p>
              </div>
            </div>
          </Section>

          <Section
            id="why"
            eyebrow="Section 2"
            title="Why apps delay some tasks"
            description="One QuickBite order triggers six things. If the user has to wait for all of them, the app feels broken. Toggle the two modes and watch the timer."
          >
            <WhyDelay />
          </Section>

          <Section
            id="intro"
            eyebrow="Section 3"
            title="Introducing queues & background jobs"
            description="The fix is a tiny architectural shift: respond immediately, then do the heavy work separately. Tap each stage to see its job."
          >
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
              <AnimatedFlow nodes={archFlow} />
              <p className="mt-7 text-sm leading-relaxed text-muted">
                The app responds quickly while heavy tasks continue in the
                background. That single idea is what queues and background
                jobs are for.
              </p>
            </div>
          </Section>

          <Section
            id="playground"
            eyebrow="Section 4"
            title="Interactive Task Queue Playground"
            description="This is the core experience. Add tasks, spike traffic, pause and add workers, and retry failures — and watch jobs flow through the queue in real time."
          >
            <QueuePlayground />
          </Section>

          <Section
            id="sync"
            eyebrow="Section 5"
            title="Synchronous vs Asynchronous"
            description="The single hardest idea for PMs — made visual. Same work, completely different feel."
          >
            <SyncVsAsync />
          </Section>

          <Section
            id="examples"
            eyebrow="Section 6"
            title="Real-world product examples"
            description="The apps you use every day run on this exact pattern. Pick one and see what's instant vs. what quietly happens in the background."
          >
            <ProductExamples />
          </Section>

          <Section
            id="spike"
            eyebrow="Section 7"
            title="Surviving a traffic spike"
            description="An IPL-final flash sale hits both systems at the same instant. One has a queue, one doesn't. Launch it."
          >
            <TrafficSpike />
          </Section>

          <Section
            id="failure"
            eyebrow="Section 8"
            title="Failure & retry handling"
            description="Things fail all the time — providers go down, payments lag, workers crash. Queues are what make that survivable."
          >
            <FailureRetry />
          </Section>

          <Section
            id="priority"
            eyebrow="Section 9"
            title="Priority queues"
            description="Not all jobs are equal. An OTP a user is staring at should never wait behind an analytics batch."
          >
            <PriorityQueue />
          </Section>

          <Section
            id="why-pm"
            eyebrow="Section 10"
            title="Why this matters for product managers"
            description="Queues are quietly responsible for an app feeling fast, staying up under load, and not losing work — three things PMs are measured on."
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {QUEUE_INSIGHTS.map((card, i) => (
                <InfoCard key={card.title} data={card} index={i} />
              ))}
            </div>
          </Section>

          <Section
            id="analytics"
            eyebrow="Section 11"
            title="Queue Analytics Dashboard"
            description="This is how a PM actually keeps a queue-backed system healthy — by watching the backlog and throughput, not the code."
          >
            <QueueAnalytics />
          </Section>

          <Section
            id="quiz"
            eyebrow="Section 12"
            title="Test your instinct"
            description="A real pattern in QuickBite's data. What would a strong PM push for first?"
          >
            <Quiz
              scenario={QUEUE_QUIZ.scenario}
              question={QUEUE_QUIZ.question}
              options={QUEUE_QUIZ.options}
            />
          </Section>

          <div className="mt-10 rounded-2xl border border-border bg-brand-soft p-8 text-center">
            <h3 className="text-lg font-semibold">Module complete</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              You can now explain why apps confirm instantly and finish work
              later, how queues absorb traffic spikes, why retries make
              systems reliable, and how to read a queue's health.
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
