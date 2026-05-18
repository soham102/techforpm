import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/section";
import { AnimatedFlow, type FlowNode } from "@/components/animated-flow";
import { QuickBitePlayground } from "@/components/quickbite-playground";
import { InfoCard, type InfoCardData } from "@/components/ui/info-card";
import { Quiz, type QuizOption } from "@/components/quiz";
import { ModuleSidebar, type ModuleStep } from "@/components/module-sidebar";

export const metadata: Metadata = {
  title: "API Fundamentals — PMverse",
  description:
    "Understand APIs visually: a restaurant analogy, a real food-delivery flow, an interactive simulator, and why it matters for product decisions.",
};

const steps: ModuleStep[] = [
  { id: "analogy", label: "Real-World Analogy" },
  { id: "product", label: "Real Product Example" },
  { id: "playground", label: "QuickBite Playground" },
  { id: "why", label: "Why PMs Should Care" },
  { id: "quiz", label: "Scenario Quiz" },
];

const restaurantFlow: FlowNode[] = [
  { id: "c1", label: "Customer", icon: "user" },
  { id: "w1", label: "Waiter", icon: "waiter", accent: "brand" },
  { id: "k", label: "Kitchen", icon: "kitchen" },
  { id: "w2", label: "Waiter", icon: "waiter", accent: "brand" },
  { id: "c2", label: "Customer", icon: "user" },
];

const productFlow: FlowNode[] = [
  {
    id: "app",
    label: "User opens app",
    icon: "phone",
    detail: {
      title: "The user taps “Order”",
      body: "The customer interacts with the app's screen. They never see code or servers — just buttons. Every tap is a potential API call waiting to happen.",
    },
  },
  {
    id: "fe",
    label: "Frontend request",
    icon: "globe",
    accent: "brand",
    detail: {
      title: "Frontend sends an API request",
      body: "The app packages the request (e.g. “get restaurants near me”) and sends it over the internet to the backend. This is the API call — a structured ask with a clear contract.",
    },
  },
  {
    id: "be",
    label: "Backend processes",
    icon: "server",
    detail: {
      title: "Backend processes the request",
      body: "Server code validates the request, checks the user's auth, applies business rules (promos, availability) and decides what data it needs. This is where most product logic lives.",
    },
  },
  {
    id: "db",
    label: "Database queried",
    icon: "database",
    detail: {
      title: "The database is queried",
      body: "The backend asks the database for the right rows — restaurants, prices, delivery times. Slow or unindexed queries here are a common cause of laggy product experiences.",
    },
  },
  {
    id: "res",
    label: "Response returned",
    icon: "phone",
    accent: "brand",
    detail: {
      title: "Response returned to the user",
      body: "The backend sends structured data back. The app turns it into a nice UI. The round trip — request to response — is the latency your users actually feel.",
    },
  },
];

const whyCards: InfoCardData[] = [
  {
    icon: "gauge",
    title: "API latency shapes the experience",
    body: "Every screen that loads data waits on an API. A 200ms call feels instant; a 3s call feels broken. Latency is a UX metric, not just an engineering one.",
  },
  {
    icon: "trendingDown",
    title: "Failed APIs reduce conversion",
    body: "A failed checkout or payment API doesn't just error — it loses revenue. Reliability targets (e.g. 99.9%) map directly to money and trust.",
  },
  {
    icon: "wrench",
    title: "Backend limits shape the roadmap",
    body: "What an API can return, how fast, and at what cost defines what features are realistic this quarter. Knowing the constraints makes your roadmap credible.",
  },
];

const quizOptions: QuizOption[] = [
  {
    id: "a",
    label: "Add a loading spinner and ship — it's a frontend problem",
    correct: false,
    rationale:
      "A spinner hides the symptom but the payment still takes too long. During a flash sale, slow payments directly kill conversion and frustrate users.",
  },
  {
    id: "b",
    label:
      "Work with engineering on caching, scaling, and a fallback before the sale",
    correct: true,
    rationale:
      "Slow APIs under load are usually a capacity/scaling issue. Pre-scaling, caching hot data, adding timeouts and a graceful retry protects revenue during peak traffic.",
  },
  {
    id: "c",
    label: "Remove the payment step to make checkout faster",
    correct: false,
    rationale:
      "You can't remove payment from a purchase. Speeding up the path is good, but the bottleneck is the API under load, not the existence of the step.",
  },
];

export default function ApiModulePage() {
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
              Module 01 · Beginner · 12 min
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              API Fundamentals
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
              An API is how two pieces of software talk to each other. We'll
              build the intuition with a restaurant, then a real food-delivery
              app, then let you run requests yourself.
            </p>
          </header>

          <Section
            id="analogy"
            eyebrow="Section 1"
            title="An API is like a restaurant waiter"
            description="You don't walk into the kitchen to cook your own food. You tell the waiter what you want, they carry the request to the kitchen, and bring back exactly what you asked for."
          >
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
              <AnimatedFlow nodes={restaurantFlow} />
              <div className="mt-7 grid gap-4 text-sm leading-relaxed text-muted sm:grid-cols-2">
                <p>
                  <span className="font-semibold text-fg">
                    You (the app)
                  </span>{" "}
                  don't need to know how the kitchen works. You just need a
                  clear way to ask and a reliable answer back.
                </p>
                <p>
                  <span className="font-semibold text-fg">
                    The waiter (the API)
                  </span>{" "}
                  is the contract: a defined menu of what you can ask for and
                  what you'll get in return.
                </p>
              </div>
            </div>
          </Section>

          <Section
            id="product"
            eyebrow="Section 2"
            title="The same flow in a food-delivery app"
            description="Tap each step to see what's actually happening behind the screen — from the user's tap to the data coming back."
          >
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
              <AnimatedFlow nodes={productFlow} />
              <p className="mt-7 text-sm leading-relaxed text-muted">
                Every visible interaction in a modern app is one or more API
                calls stitched together. When a screen is slow or broken, it's
                usually one of these steps.
              </p>
            </div>
          </Section>

          <Section
            id="playground"
            eyebrow="Section 3"
            title="How APIs Power a Food Delivery App"
            description="Every action inside an app — placing orders, updating addresses, tracking delivery, or cancelling orders — happens through APIs communicating with backend systems. In this playground, you'll simulate how a food delivery app uses CRUD operations behind the scenes."
          >
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
                <p className="text-sm font-semibold">Meet the story</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  You're watching one real customer use{" "}
                  <span className="font-semibold text-fg">QuickBite</span>, a
                  food delivery app. Follow Rahul as he tracks, places,
                  changes, and cancels an order — and see exactly what the API
                  does each time.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
                <p className="text-sm font-semibold">CRUD in one line</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Almost everything an app does is{" "}
                  <span className="font-semibold text-fg">C</span>reate,{" "}
                  <span className="font-semibold text-fg">R</span>ead,{" "}
                  <span className="font-semibold text-fg">U</span>pdate, or{" "}
                  <span className="font-semibold text-fg">D</span>elete —
                  POST, GET, PUT, DELETE. That's it.
                </p>
              </div>
            </div>
            <QuickBitePlayground />
          </Section>

          <Section
            id="why"
            eyebrow="Section 4"
            title="Why this matters for product managers"
            description="You don't need to write the API — but these three realities will shape almost every product decision you make."
          >
            <div className="grid gap-5 md:grid-cols-3">
              {whyCards.map((card, i) => (
                <InfoCard key={card.title} data={card} index={i} />
              ))}
            </div>
          </Section>

          <Section
            id="quiz"
            eyebrow="Section 5"
            title="Test your instinct"
            description="One scenario, three responses. Pick the one a strong PM would choose."
          >
            <Quiz
              scenario="Your payment API becomes slow during a flash sale. Checkout times jump from 1s to 8s and orders start dropping."
              question="What's the right product response?"
              options={quizOptions}
            />
          </Section>

          <div className="mt-10 rounded-2xl border border-border bg-brand-soft p-8 text-center">
            <h3 className="text-lg font-semibold">You finished the module</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              You can now reason about how apps talk to each other, where they
              break, and why it matters for the roadmap.
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
