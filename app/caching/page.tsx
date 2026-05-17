import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/section";
import { AnimatedFlow, type FlowNode } from "@/components/animated-flow";
import { InfoCard } from "@/components/ui/info-card";
import { Quiz } from "@/components/quiz";
import { ModuleSidebar, type ModuleStep } from "@/components/module-sidebar";
import { CacheAnalogyMap } from "@/components/cache/cache-analogy-map";
import { SlowAppDemo } from "@/components/cache/slow-app-demo";
import { CacheFlowExplainer } from "@/components/cache/cache-flow-explainer";
import { CachePlayground } from "@/components/cache/cache-playground";
import { ProductExamples } from "@/components/cache/product-examples";
import { TrafficSpikeSim } from "@/components/cache/traffic-spike-sim";
import { CacheExpiry } from "@/components/cache/cache-expiry";
import { CacheTypes } from "@/components/cache/cache-types";
import { CacheAnalytics } from "@/components/cache/cache-analytics";
import { CACHE_INSIGHTS, CACHE_QUIZ } from "@/lib/caching";

export const metadata: Metadata = {
  title: "Caching — Tech Concepts for PMs",
  description:
    "Understand caching visually: a coffee-jar analogy, why apps slow down, cache hit vs miss, an interactive cache playground, traffic-spike survival, stale data, and a live performance dashboard — built for non-technical PMs.",
};

const steps: ModuleStep[] = [
  { id: "analogy", label: "Real-World Analogy" },
  { id: "slow", label: "Why Apps Become Slow" },
  { id: "caching", label: "What Caching Does" },
  { id: "playground", label: "Cache Playground" },
  { id: "examples", label: "Real Product Examples" },
  { id: "traffic", label: "Traffic Spike Sim" },
  { id: "expiry", label: "Cache Expiry" },
  { id: "types", label: "Types of Caching" },
  { id: "why", label: "Why PMs Should Care" },
  { id: "analytics", label: "Performance Dashboard" },
  { id: "quiz", label: "Scenario Quiz" },
];

const cacheArchFlow: FlowNode[] = [
  {
    id: "fe",
    label: "Frontend App",
    icon: "phone",
    detail: {
      title: "Frontend — what the user taps",
      body: "The screen the user sees. It just wants data back fast — it doesn't care where it comes from.",
    },
  },
  {
    id: "be",
    label: "Backend",
    icon: "server",
    detail: {
      title: "Backend",
      body: "Receives the request and decides how to answer it. With caching, its first move is to check the cache — not the database.",
    },
  },
  {
    id: "cache",
    label: "Cache Layer",
    icon: "zap",
    accent: "brand",
    detail: {
      title: "Cache layer",
      body: "A fast, nearby copy of recently-needed data. PM insight: most requests can be answered here in milliseconds, never touching the database.",
    },
  },
  {
    id: "db",
    label: "Database",
    icon: "database",
    detail: {
      title: "Database",
      body: "The slow but complete source of truth. The cache only falls back to it on a miss — which keeps it from being overwhelmed.",
    },
  },
];

export default function CachingPage() {
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
              Module 08 · Beginner · 16 min
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Caching — Explained for Product Managers
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
              Why does an app crawl the first time and load instantly the
              second? Why do some apps survive a cricket-final traffic spike
              while others fall over? The answer is mostly caching — and you
              can understand it without a single line of backend code.
            </p>
          </header>

          <Section
            id="analogy"
            eyebrow="Section 1"
            title="Caching Works Like Keeping Frequently Used Things Nearby"
            description="You need coffee every morning. You can walk to the supermarket across town every single time — or keep a jar on your kitchen shelf. Same coffee, very different wait."
          >
            <CacheAnalogyMap />
          </Section>

          <Section
            id="slow"
            eyebrow="Section 2"
            title="Why Apps Become Slow"
            description="A user opens QuickBite during the dinner rush. Every request travels Frontend → Backend → Database. Add more users and watch the queue — and the loading time — build up."
          >
            <SlowAppDemo />
          </Section>

          <Section
            id="caching"
            eyebrow="Section 3"
            title="What Caching Actually Does"
            description="Add one fast layer between the backend and the database. The first request still goes the long way (a cache miss). Every request after is answered instantly (a cache hit). Tap any stage to learn its job, then run the requests."
          >
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
              <AnimatedFlow nodes={cacheArchFlow} />
              <p className="mt-7 text-sm leading-relaxed text-muted">
                The cache sits in front of the database. Most traffic stops at
                the cache and never reaches the slow source of truth.
              </p>
            </div>
            <div className="mt-6">
              <CacheFlowExplainer />
            </div>
          </Section>

          <Section
            id="playground"
            eyebrow="Section 4"
            title="Interactive Cache Playground"
            description="A working cache. Pick what to load, then First Visit, Reload, Clear Cache, or Traffic Spike. Watch the request travel, the response-time meter, and the hit rate climb."
          >
            <CachePlayground />
          </Section>

          <Section
            id="examples"
            eyebrow="Section 5"
            title="Real Product Examples"
            description="The same pattern, in apps you use every day. Replay each scenario without a cache and with one, side by side."
          >
            <ProductExamples />
          </Section>

          <Section
            id="traffic"
            eyebrow="Section 6"
            title="Traffic Spike Simulation"
            description="Drag from 100 to 1,000,000 concurrent users. Without a cache the database overloads and requests start failing. With a cache, the same servers stay calm."
          >
            <TrafficSpikeSim />
          </Section>

          <Section
            id="expiry"
            eyebrow="Section 7"
            title="Cache Expiry & Stale Data"
            description="Caching's one trade-off: a restaurant updates its menu, but cached users briefly see the old one — until the copy expires and refreshes. Step through it."
          >
            <CacheExpiry />
          </Section>

          <Section
            id="types"
            eyebrow="Section 8"
            title="Types of Caching, Simply"
            description="Caching happens in more than one place. Three of them, each with a familiar analogy — no infrastructure jargon required."
          >
            <CacheTypes />
          </Section>

          <Section
            id="why"
            eyebrow="Section 9"
            title="Why this matters for product managers"
            description="Caching isn't a backend detail — it's a lever on retention, conversion, cost and the ability to grow without breaking."
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {CACHE_INSIGHTS.map((card, i) => (
                <InfoCard key={card.title} data={card} index={i} />
              ))}
            </div>
          </Section>

          <Section
            id="analytics"
            eyebrow="Section 10"
            title="Performance Analytics Dashboard"
            description="This is how a PM actually knows caching is working — by watching these numbers move, not the code behind them."
          >
            <CacheAnalytics />
          </Section>

          <Section
            id="quiz"
            eyebrow="Section 11"
            title="Test your instinct"
            description="A real failure pattern. What would a strong PM push for first?"
          >
            <Quiz
              scenario={CACHE_QUIZ.scenario}
              question={CACHE_QUIZ.question}
              options={CACHE_QUIZ.options}
            />
          </Section>

          <div className="mt-10 rounded-2xl border border-border bg-brand-soft p-8 text-center">
            <h3 className="text-lg font-semibold">Module complete</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              You can now explain why apps load faster the second time, what
              cache hit vs miss means, and why caching is one of the biggest
              levers on speed, scalability and cost.
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
