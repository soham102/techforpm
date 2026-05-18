import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/section";
import { AnimatedFlow, type FlowNode } from "@/components/animated-flow";
import { InfoCard } from "@/components/ui/info-card";
import { Quiz } from "@/components/quiz";
import { ModuleSidebar, type ModuleStep } from "@/components/module-sidebar";
import { LbAnalogyMap } from "@/components/lb/lb-analogy-map";
import { TrafficOverloadSim } from "@/components/lb/traffic-overload-sim";
import { LbArchitecture } from "@/components/lb/lb-architecture";
import { TrafficPlayground } from "@/components/lb/traffic-playground";
import { BalancingStrategies } from "@/components/lb/balancing-strategies";
import { FailureSim } from "@/components/lb/failure-sim";
import { AutoscalingSim } from "@/components/lb/autoscaling-sim";
import { ProductExamples } from "@/components/lb/product-examples";
import { LbAnalytics } from "@/components/lb/lb-analytics";
import { LB_INSIGHTS, LB_QUIZ } from "@/lib/load-balancing";

export const metadata: Metadata = {
  title: "Load Balancers — PMverse",
  description:
    "Understand load balancers visually: a traffic-police analogy, why apps crash at peak, an interactive traffic-distribution playground, balancing strategies, failure handling, auto-scaling, and a live traffic dashboard — built for non-technical PMs.",
};

const steps: ModuleStep[] = [
  { id: "analogy", label: "Real-World Analogy" },
  { id: "overload", label: "Why Apps Crash at Peak" },
  { id: "intro", label: "Introducing Load Balancers" },
  { id: "playground", label: "Traffic Playground" },
  { id: "strategies", label: "Balancing Strategies" },
  { id: "failure", label: "Server Failure" },
  { id: "scaling", label: "Auto-Scaling" },
  { id: "examples", label: "Real Product Examples" },
  { id: "why", label: "Why PMs Should Care" },
  { id: "analytics", label: "Live Traffic Dashboard" },
  { id: "quiz", label: "Scenario Quiz" },
];

const archFlow: FlowNode[] = [
  {
    id: "users",
    label: "Millions of users",
    icon: "users",
    detail: {
      title: "Users — all arriving at once",
      body: "During a final, a sale or a dinner rush, a huge number of requests hit the product in the same window. The system has to absorb that without falling over.",
    },
  },
  {
    id: "lb",
    label: "Load balancer",
    icon: "scale",
    accent: "brand",
    detail: {
      title: "Load balancer — the smart traffic manager",
      body: "Sits in front of every server. For each incoming request it picks a server with capacity to spare, skips unhealthy ones, and spreads the load so none is overwhelmed.",
    },
  },
  {
    id: "s1",
    label: "Server 1",
    icon: "server",
    detail: {
      title: "Server 1",
      body: "One of many identical workers. It only ever sees its share of the traffic — not all of it — so it stays healthy.",
    },
  },
  {
    id: "s2",
    label: "Server 2",
    icon: "server",
    detail: {
      title: "Server 2",
      body: "Another worker behind the balancer. Add more of these and the product can handle proportionally more users.",
    },
  },
  {
    id: "s3",
    label: "Server 3 · 4 …",
    icon: "server",
    detail: {
      title: "More servers, on demand",
      body: "When traffic spikes, more servers can be added automatically. When it calms down, they're removed — capacity follows demand.",
    },
  },
];

export default function LoadBalancersPage() {
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
              Module 09 · Beginner · 17 min
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Load Balancers — Explained for Product Managers
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
              Why does a ticketing site collapse the second IPL finals go on
              sale, while Netflix streams a live finale to the whole world
              without a hiccup? The answer is how traffic gets spread across
              servers — and you can understand it without a single line of
              infrastructure code.
            </p>
          </header>

          <Section
            id="analogy"
            eyebrow="Section 1"
            title="Load Balancers Work Like Traffic Police"
            description="Picture a huge wave of vehicles approaching a city junction. Funnel them all onto one road and nothing moves. Put an officer there to wave cars across every road, and traffic flows. Toggle between the two."
          >
            <LbAnalogyMap />
          </Section>

          <Section
            id="overload"
            eyebrow="Section 2"
            title="Why Apps Crash During Peak Traffic"
            description="IPL finals booking opens and millions click in the same second. Every request lands on one server. Push the traffic up and watch the stress meter, the pile-up, the response time and the crash."
          >
            <TrafficOverloadSim />
          </Section>

          <Section
            id="intro"
            eyebrow="Section 3"
            title="Introducing the Load Balancer"
            description="Add one smart layer between users and the servers. Instead of everything hitting a single machine, requests are distributed across many. Tap any stage to learn its job."
          >
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
              <AnimatedFlow nodes={archFlow} />
              <p className="mt-7 text-sm leading-relaxed text-muted">
                The load balancer is the single front door. Behind it, traffic
                is shared across as many servers as the product needs.
              </p>
            </div>
            <div className="mt-6">
              <LbArchitecture />
            </div>
          </Section>

          <Section
            id="playground"
            eyebrow="Section 4"
            title="Interactive Traffic Distribution Playground"
            description="A working load balancer. Change the traffic, add or remove servers, fire a flash sale or IPL spike, disable a server, and switch strategy. Watch CPU, active requests, response time and failures react live."
          >
            <TrafficPlayground />
          </Section>

          <Section
            id="strategies"
            eyebrow="Section 5"
            title="Load Balancing Strategies"
            description="How does the balancer decide which server gets each request? Three intuitive approaches — pick one and watch the step-by-step routing."
          >
            <BalancingStrategies />
          </Section>

          <Section
            id="failure"
            eyebrow="Section 6"
            title="What Happens When a Server Fails"
            description="A server crashes mid-IPL-rush. Without a load balancer the whole app goes dark. With one, traffic reroutes instantly. Crash it yourself in both modes."
          >
            <FailureSim />
          </Section>

          <Section
            id="scaling"
            eyebrow="Section 7"
            title="Auto-Scaling — Capacity That Follows Demand"
            description="QuickBite's dinner rush begins. Press play and watch traffic spike, new servers spin up automatically, load spread out, and response time recover."
          >
            <AutoscalingSim />
          </Section>

          <Section
            id="examples"
            eyebrow="Section 8"
            title="Real Product Examples"
            description="The same pattern, in apps you use every day. Pick a product and flip between with and without balancing."
          >
            <ProductExamples />
          </Section>

          <Section
            id="why"
            eyebrow="Section 9"
            title="Why this matters for product managers"
            description="Load balancing isn't an infrastructure detail — it's a lever on revenue, reliability, retention and the ability to grow without breaking."
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {LB_INSIGHTS.map((card, i) => (
                <InfoCard key={card.title} data={card} index={i} />
              ))}
            </div>
          </Section>

          <Section
            id="analytics"
            eyebrow="Section 10"
            title="Live Traffic Analytics Dashboard"
            description="This is how a PM actually knows the system is holding during a launch — by watching these numbers move, not the code behind them."
          >
            <LbAnalytics />
          </Section>

          <Section
            id="quiz"
            eyebrow="Section 11"
            title="Test your instinct"
            description="A real failure pattern. What would a strong PM push for first?"
          >
            <Quiz
              scenario={LB_QUIZ.scenario}
              question={LB_QUIZ.question}
              options={LB_QUIZ.options}
            />
          </Section>

          <div className="mt-10 rounded-2xl border border-border bg-brand-soft p-8 text-center">
            <h3 className="text-lg font-semibold">Module complete</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              You can now explain why apps crash at peak, what a load balancer
              actually does, how traffic gets distributed, how scaling works
              behind the scenes, and why all of it protects reliability and
              uptime.
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
