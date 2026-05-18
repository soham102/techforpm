import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/section";
import { AnimatedFlow, type FlowNode } from "@/components/animated-flow";
import { InfoCard } from "@/components/ui/info-card";
import { Quiz } from "@/components/quiz";
import { ModuleSidebar, type ModuleStep } from "@/components/module-sidebar";
import { RtAnalogyMap } from "@/components/rt/rt-analogy-map";
import { PollingProblem } from "@/components/rt/polling-problem";
import { WebsocketArchitecture } from "@/components/rt/websocket-architecture";
import { RealtimePlayground } from "@/components/rt/realtime-playground";
import { PollingVsWs } from "@/components/rt/polling-vs-ws";
import { ProductSims } from "@/components/rt/product-sims";
import { MultiUserChat } from "@/components/rt/multi-user-chat";
import { FailureReconnect } from "@/components/rt/failure-reconnect";
import { RtTypes } from "@/components/rt/rt-types";
import { RtAnalytics } from "@/components/rt/rt-analytics";
import { RT_INSIGHTS, RT_QUIZ } from "@/lib/realtime";

export const metadata: Metadata = {
  title: "WebSockets & Real-Time Systems — PMverse",
  description:
    "Understand real-time systems visually: a live-phone-call analogy, polling vs WebSockets, an interactive real-time playground, live tracking and chat simulations, failure & reconnection handling, and a live analytics dashboard — built for non-technical PMs.",
};

const steps: ModuleStep[] = [
  { id: "analogy", label: "Real-World Analogy" },
  { id: "polling", label: "Why APIs Aren't Enough" },
  { id: "intro", label: "Introducing WebSockets" },
  { id: "playground", label: "Real-Time Playground" },
  { id: "compare", label: "Polling vs WebSockets" },
  { id: "sims", label: "Product Simulations" },
  { id: "multiuser", label: "Multi-User Communication" },
  { id: "failure", label: "Failure & Reconnection" },
  { id: "types", label: "Types of Real-Time" },
  { id: "why", label: "Why PMs Should Care" },
  { id: "analytics", label: "Real-Time Dashboard" },
  { id: "quiz", label: "Scenario Quiz" },
];

const wsFlow: FlowNode[] = [
  {
    id: "app",
    label: "User app",
    icon: "phone",
    detail: {
      title: "The client — your app",
      body: "Opens one connection and keeps it open. Instead of asking again and again, it just listens and reacts the moment something arrives.",
    },
  },
  {
    id: "conn",
    label: "Persistent connection",
    icon: "signal",
    accent: "brand",
    detail: {
      title: "The open line",
      body: "A single always-on connection that stays up after one short handshake. Both sides can send across it at any time — no new request per update.",
    },
  },
  {
    id: "server",
    label: "Real-time server",
    icon: "server",
    detail: {
      title: "The real-time server",
      body: "Pushes updates the instant they happen and broadcasts one event to many connected users at once — live scores, locations, messages.",
    },
  },
];

export default function RealtimePage() {
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
              Module 10 · Beginner · 18 min
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              WebSockets & Real-Time Systems — Explained for Product Managers
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
              How does the Uber car move on the map without you touching
              anything? How does “typing…” appear the instant someone starts?
              How do live scores update on their own? It's all one idea — and
              you can understand it without a single line of socket code.
            </p>
          </header>

          <Section
            id="analogy"
            eyebrow="Section 1"
            title="Real-Time Systems Work Like a Live Phone Call"
            description="Normal API requests are like calling someone every few seconds to ask “any update?”. WebSockets are like staying on one open call — the moment there's news, you just hear it. Toggle between the two."
          >
            <RtAnalogyMap />
          </Section>

          <Section
            id="polling"
            eyebrow="Section 2"
            title="Why Normal APIs Aren't Enough"
            description="Place a QuickBite order. The order really moves on its own — but the app only changes when the user pulls to refresh. Watch the status go stale and the wasted calls pile up."
          >
            <PollingProblem />
          </Section>

          <Section
            id="intro"
            eyebrow="Section 3"
            title="Introducing WebSockets"
            description="Open one persistent connection between the app and the server. Tap any stage to learn its job, then press Connect to watch the line open and messages flow both ways."
          >
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
              <AnimatedFlow nodes={wsFlow} />
              <p className="mt-7 text-sm leading-relaxed text-muted">
                One connection, kept open, used in both directions — that's the
                whole idea behind every “live” feature you've ever used.
              </p>
            </div>
            <div className="mt-6">
              <WebsocketArchitecture />
            </div>
          </Section>

          <Section
            id="playground"
            eyebrow="Section 4"
            title="Interactive Real-Time Playground"
            description="A working live session. Connect, send messages, fire typing, run live delivery tracking, spike traffic and drop the network. Watch the connection pulse, latency and updates react instantly."
          >
            <RealtimePlayground />
          </Section>

          <Section
            id="compare"
            eyebrow="Section 5"
            title="Polling vs WebSockets, Side by Side"
            description="The same live cricket match, two ways. The true score changes on its own — watch polling lag a few seconds behind while burning requests, and the live one stay perfectly in sync."
          >
            <PollingVsWs />
          </Section>

          <Section
            id="sims"
            eyebrow="Section 6"
            title="Real-World Product Simulations"
            description="The same real-time idea, in apps you use every day. Each one is live and continuously animating — pick a tab."
          >
            <ProductSims />
          </Section>

          <Section
            id="multiuser"
            eyebrow="Section 7"
            title="Multi-User Communication"
            description="Real-time isn't just one user. Aanya sends one message; the server broadcasts it so Bilal and Chitra receive it instantly. Send it and watch it propagate."
          >
            <MultiUserChat />
          </Section>

          <Section
            id="failure"
            eyebrow="Section 8"
            title="Failure & Reconnection Handling"
            description="Real-time is powerful but complex. Three things that go wrong — a dropped network, a traffic surge, and a delayed message — and how a well-built system recovers."
          >
            <FailureReconnect />
          </Section>

          <Section
            id="types"
            eyebrow="Section 9"
            title="Types of Real-Time Systems"
            description="“Real-time” shows up in four common shapes. Same underlying idea, different product experiences — no protocol detail required."
          >
            <RtTypes />
          </Section>

          <Section
            id="why"
            eyebrow="Section 10"
            title="Why this matters for product managers"
            description="Real-time isn't a backend nicety — it's a lever on engagement, trust and retention, traded off against real infrastructure complexity."
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {RT_INSIGHTS.map((card, i) => (
                <InfoCard key={card.title} data={card} index={i} />
              ))}
            </div>
          </Section>

          <Section
            id="analytics"
            eyebrow="Section 11"
            title="Real-Time Analytics Dashboard"
            description="This is how a PM actually knows “live” is healthy during a launch — by watching these numbers move, not the code behind them."
          >
            <RtAnalytics />
          </Section>

          <Section
            id="quiz"
            eyebrow="Section 12"
            title="Test your instinct"
            description="A real complaint pattern. What would a strong PM identify first?"
          >
            <Quiz
              scenario={RT_QUIZ.scenario}
              question={RT_QUIZ.question}
              options={RT_QUIZ.options}
            />
          </Section>

          <div className="mt-10 rounded-2xl border border-border bg-brand-soft p-8 text-center">
            <h3 className="text-lg font-semibold">Module complete</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              You can now explain how live updates work, why apps use
              WebSockets instead of polling, how one event reaches many users
              at once, and why real-time boosts engagement while adding real
              complexity.
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
