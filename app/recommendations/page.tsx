import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/section";
import { AnimatedFlow, type FlowNode } from "@/components/animated-flow";
import { InfoCard } from "@/components/ui/info-card";
import { Quiz } from "@/components/quiz";
import { ModuleSidebar, type ModuleStep } from "@/components/module-sidebar";
import { RecAnalogyMap } from "@/components/rec/rec-analogy-map";
import { PlatformExamples } from "@/components/rec/platform-examples";
import { BehaviorSimulator } from "@/components/rec/behavior-simulator";
import { PersonalizationPlayground } from "@/components/rec/personalization-playground";
import { FeedbackLoop } from "@/components/rec/feedback-loop";
import { ColdStart } from "@/components/rec/cold-start";
import { RecFailures } from "@/components/rec/rec-failures";
import { RecAnalytics } from "@/components/rec/rec-analytics";
import { REC_INSIGHTS, REC_QUIZ } from "@/lib/recommendations";

export const metadata: Metadata = {
  title: "Recommendation Systems — PMverse",
  description:
    "Understand personalization visually: a smart-assistant analogy, behaviour signals, a live personalization playground, feedback loops, the cold-start problem, failure modes, and a recommendation analytics dashboard.",
};

const steps: ModuleStep[] = [
  { id: "analogy", label: "Real-World Analogy" },
  { id: "platforms", label: "How Apps Personalize" },
  { id: "behavior", label: "Behavior Simulator" },
  { id: "engine", label: "Recommendation Engine" },
  { id: "personalization", label: "Personalization Playground" },
  { id: "feedback", label: "Feedback Loop" },
  { id: "coldstart", label: "Cold Start Problem" },
  { id: "failures", label: "When Recs Fail" },
  { id: "why", label: "Why PMs Should Care" },
  { id: "analytics", label: "Analytics Dashboard" },
  { id: "quiz", label: "Scenario Quiz" },
];

const personalizeFlow: FlowNode[] = [
  { id: "ub", label: "User Behavior", icon: "click" },
  { id: "re", label: "Recommendation Engine", icon: "sparkles", accent: "brand" },
  { id: "pf", label: "Personalized Feed", icon: "heart" },
];

const engineFlow: FlowNode[] = [
  {
    id: "act",
    label: "User Activity",
    icon: "click",
    detail: {
      title: "User activity",
      body: "Every tap, watch, like, skip and order. Raw behaviour is the fuel — nothing personalises without it.",
    },
  },
  {
    id: "track",
    label: "Behavior Tracking",
    icon: "activity",
    detail: {
      title: "Behaviour tracking",
      body: "Apps observe actions to understand preferences — clicks, watch time, likes, purchases, skips. PM insight: user behaviour data powers personalization.",
    },
  },
  {
    id: "engine",
    label: "Recommendation Engine",
    icon: "sparkles",
    accent: "brand",
    detail: {
      title: "Recommendation engine",
      body: "Predicts what this user may like next — like a friend recommending movies based on your taste, at massive scale.",
    },
  },
  {
    id: "rank",
    label: "Ranking System",
    icon: "star",
    detail: {
      title: "Ranking system",
      body: "Decides which suggestions appear first — relevance, popularity, recency, engagement probability. PM insight: ranking affects engagement and retention.",
    },
  },
  {
    id: "res",
    label: "Personalized Results",
    icon: "heart",
    detail: {
      title: "Personalized results",
      body: "The final feed — different for every user, which is exactly why your app looks nothing like your friend's.",
    },
  },
];

export default function RecommendationsPage() {
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
              Module 07 · Intermediate · 18 min
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Recommendation Systems
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
              Why does your QuickBite home screen — or Netflix, or Spotify —
              look nothing like anyone else's? Let's see how apps watch
              behaviour and personalise a feed for every single user.
            </p>
          </header>

          <Section
            id="analogy"
            eyebrow="Section 1"
            title="Recommendations Work Like a Smart Store Assistant"
            description="A great shop assistant watches what you browse, remembers your past visits, and suggests things you'll actually want. That's a recommendation system. Hover each pairing."
          >
            <RecAnalogyMap />
          </Section>

          <Section
            id="platforms"
            eyebrow="Section 2"
            title="How Apps Personalize Experiences"
            description="The apps you use every day all run this same loop — different signals, identical idea: behaviour in, a feed tuned just for you out."
          >
            <PlatformExamples />
            <div className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
              <AnimatedFlow nodes={personalizeFlow} />
              <p className="mt-7 text-sm leading-relaxed text-muted">
                Strip away the platform and it's always these three steps —
                watch behaviour, predict interest, render a personal feed.
              </p>
            </div>
          </Section>

          <Section
            id="behavior"
            eyebrow="Section 3"
            title="User Behavior Simulator"
            description="Meet Rahul — a brand-new user with no profile. Act on his behalf and watch the system silently learn who he is."
          >
            <BehaviorSimulator />
          </Section>

          <Section
            id="engine"
            eyebrow="Section 4"
            title="Inside the Recommendation Engine"
            description="How does raw behaviour become a ranked feed? Tap each stage to see what it does and why it matters for the product."
          >
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
              <AnimatedFlow nodes={engineFlow} />
              <p className="mt-7 text-sm leading-relaxed text-muted">
                Behaviour is tracked, the engine predicts interest, ranking
                orders it — and the feed you see is the output of all three.
              </p>
            </div>
          </Section>

          <Section
            id="personalization"
            eyebrow="Section 5"
            title="Personalization Playground"
            description="This is the aha moment. Flip a few traits and watch the exact same catalog reorder into a completely different feed."
          >
            <PersonalizationPlayground />
          </Section>

          <Section
            id="feedback"
            eyebrow="Section 6"
            title="The Feedback Loop"
            description="Recommendations get better the more you use the app. Run a few cycles and watch accuracy compound."
          >
            <FeedbackLoop />
          </Section>

          <Section
            id="coldstart"
            eyebrow="Section 7"
            title="The Cold Start Problem"
            description="The hardest moment for any recommender: when it has zero data — a brand-new user, or a brand-new restaurant."
          >
            <ColdStart />
          </Section>

          <Section
            id="failures"
            eyebrow="Section 8"
            title="When Recommendations Go Wrong"
            description="Personalization can fail in three very different ways — each with a real product cost."
          >
            <RecFailures />
          </Section>

          <Section
            id="why"
            eyebrow="Section 9"
            title="Why this matters for product managers"
            description="Recommendations are the single biggest lever on engagement, retention and discovery-driven revenue in most consumer apps."
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {REC_INSIGHTS.map((card, i) => (
                <InfoCard key={card.title} data={card} index={i} />
              ))}
            </div>
          </Section>

          <Section
            id="analytics"
            eyebrow="Section 10"
            title="Recommendation Analytics Dashboard"
            description="This is how a PM actually steers a recommender — by watching behaviour, not the model internals."
          >
            <RecAnalytics />
          </Section>

          <Section
            id="quiz"
            eyebrow="Section 11"
            title="Test your instinct"
            description="A real pattern in QuickBite's data. What would a strong PM suspect first?"
          >
            <Quiz
              scenario={REC_QUIZ.scenario}
              question={REC_QUIZ.question}
              options={REC_QUIZ.options}
            />
          </Section>

          <div className="mt-10 rounded-2xl border border-border bg-brand-soft p-8 text-center">
            <h3 className="text-lg font-semibold">Module complete</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              You can now explain why every user sees a different feed, how
              behaviour and feedback loops shape it, and how to read the
              metrics that actually move engagement.
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
