import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/section";
import { InfoCard } from "@/components/ui/info-card";
import { Quiz } from "@/components/quiz";
import { ModuleSidebar, type ModuleStep } from "@/components/module-sidebar";
import { NotifAnalogyMap } from "@/components/notif/notif-analogy-map";
import { NotifArchitecture } from "@/components/notif/notif-architecture";
import { NotifPlayground } from "@/components/notif/notif-playground";
import { EventTriggerFlow } from "@/components/notif/event-trigger-flow";
import { DeliveryPipeline } from "@/components/notif/delivery-pipeline";
import { FailureRetrySim } from "@/components/notif/failure-retry-sim";
import { PersonalizationSim } from "@/components/notif/personalization-sim";
import { NotifTypes } from "@/components/notif/notif-types";
import { ProductExamples } from "@/components/notif/product-examples";
import { NotifAnalytics } from "@/components/notif/notif-analytics";
import { NOTIF_INSIGHTS, NOTIF_QUIZ } from "@/lib/notifications";

export const metadata: Metadata = {
  title: "Push Notifications — Tech Concepts for PMs",
  description:
    "Understand push notifications visually: a courier-delivery analogy, the full notification architecture, an interactive notification playground, event triggers, the delivery pipeline, failure & retry handling, personalization, and a live analytics dashboard — built for non-technical PMs.",
};

const steps: ModuleStep[] = [
  { id: "analogy", label: "Real-World Analogy" },
  { id: "architecture", label: "How It Works" },
  { id: "playground", label: "Notification Playground" },
  { id: "events", label: "Event Triggers" },
  { id: "pipeline", label: "Delivery Pipeline" },
  { id: "failure", label: "Failure & Retry" },
  { id: "personalization", label: "Personalization" },
  { id: "types", label: "Notification Types" },
  { id: "why", label: "Why PMs Should Care" },
  { id: "analytics", label: "Analytics Dashboard" },
  { id: "examples", label: "Real Product Examples" },
  { id: "quiz", label: "Scenario Quiz" },
];

export default function NotificationsPage() {
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
              Module 11 · Beginner · 17 min
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Push Notifications — Explained for Product Managers
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
              How does “Your order is arriving” pop up the second the rider
              gets close? How does WhatsApp buzz the instant someone messages —
              even with the app closed? It's one idea, and you can understand
              it without touching a line of mobile code.
            </p>
          </header>

          <Section
            id="analogy"
            eyebrow="Section 1"
            title="Push Notifications Work Like a Courier Delivery System"
            description="The restaurant doesn't walk your food over itself — it hands the update to a courier who delivers it to your door, even when you're not watching. That's exactly how a notification reaches your phone. Toggle life without notifications vs with."
          >
            <NotifAnalogyMap />
          </Section>

          <Section
            id="architecture"
            eyebrow="Section 2"
            title="How a Push Notification Actually Works"
            description="QuickBite's order status changes to “arriving”. Watch that one event travel all the way to a phone — backend event → notification service → push provider → device. Tap any stage to learn its job."
          >
            <NotifArchitecture />
          </Section>

          <Section
            id="playground"
            eyebrow="Section 3"
            title="Interactive Notification Playground"
            description="A working notification system. Trigger real product events, then bend the conditions — delay delivery, fail the first attempt, turn notifications off — and watch messages flow through the pipeline onto a live lock screen."
          >
            <NotifPlayground />
          </Section>

          <Section
            id="events"
            eyebrow="Section 4"
            title="What Actually Triggers a Notification"
            description="Most PMs never see this part. A notification isn't sent by hand — a system event fires it automatically. Run the chain and watch one status change become an alert on a phone."
          >
            <EventTriggerFlow />
          </Section>

          <Section
            id="pipeline"
            eyebrow="Section 5"
            title="The Delivery Pipeline"
            description="“Sent” is not “delivered”, and “delivered” is not “opened”. Send a batch and watch each notification move through the lifecycle — most arrive, some fail, about half get opened."
          >
            <DeliveryPipeline />
          </Section>

          <Section
            id="failure"
            eyebrow="Section 6"
            title="Why Notifications Fail — and How Systems Recover"
            description="Notifications fail more often than people think. Four real failure modes — an offline phone, a down provider, a user who turned them off, and notification overload — and what a well-built system does about each."
          >
            <FailureRetrySim />
          </Section>

          <Section
            id="personalization"
            eyebrow="Section 7"
            title="Personalization & Notification Fatigue"
            description="The same event can be a generic blast or a message that feels written for one person. Toggle the signals an app is allowed to use and watch three users get very different notifications."
          >
            <PersonalizationSim />
          </Section>

          <Section
            id="types"
            eyebrow="Section 8"
            title="The Three Types of Notifications"
            description="“Notification” covers three very different things, with very different rules. Same delivery system — completely different product expectations."
          >
            <NotifTypes />
          </Section>

          <Section
            id="why"
            eyebrow="Section 9"
            title="Why this matters for product managers"
            description="Push is the most powerful re-engagement channel you have — and the fastest way to get uninstalled. The same lever cuts both ways."
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {NOTIF_INSIGHTS.map((card, i) => (
                <InfoCard key={card.title} data={card} index={i} />
              ))}
            </div>
          </Section>

          <Section
            id="analytics"
            eyebrow="Section 10"
            title="Notification Analytics Dashboard"
            description="This is how a PM actually knows the notification strategy is working — by watching these numbers move, not the code behind them."
          >
            <NotifAnalytics />
          </Section>

          <Section
            id="examples"
            eyebrow="Section 11"
            title="The Same Idea, In Apps You Use Daily"
            description="QuickBite, WhatsApp, Blinkit, Instagram, YouTube — identical machinery, different urgency. Notice how priority tracks how much the user is actually waiting for it."
          >
            <ProductExamples />
          </Section>

          <Section
            id="quiz"
            eyebrow="Section 12"
            title="Test your instinct"
            description="A real complaint pattern. What would a strong PM identify first?"
          >
            <Quiz
              scenario={NOTIF_QUIZ.scenario}
              question={NOTIF_QUIZ.question}
              options={NOTIF_QUIZ.options}
            />
          </Section>

          <div className="mt-10 rounded-2xl border border-border bg-brand-soft p-8 text-center">
            <h3 className="text-lg font-semibold">Module complete</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              You can now explain how a product event becomes a notification on
              a phone, why notifications fail and how systems retry, why
              personalization beats blasting, and how notification quality
              drives both engagement and uninstalls.
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
