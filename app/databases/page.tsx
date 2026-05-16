import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/section";
import { AnimatedFlow, type FlowNode } from "@/components/animated-flow";
import { InfoCard } from "@/components/ui/info-card";
import { Quiz } from "@/components/quiz";
import { ModuleSidebar, type ModuleStep } from "@/components/module-sidebar";
import { ConceptMap } from "@/components/db/concept-map";
import { TableExplorer } from "@/components/db/table-explorer";
import { DatabasePlayground } from "@/components/db/database-playground";
import {
  RelationalView,
  IndexDemo,
  LatencyDemo,
} from "@/components/db/advanced-learning";
import { DB_INSIGHTS, DB_QUIZ } from "@/lib/databases";

export const metadata: Metadata = {
  title: "Databases for Product Managers — Tech Concepts for PMs",
  description:
    "Understand databases visually: a warehouse analogy, how QuickBite stores data, an interactive database simulator, relationships, indexing, latency, and why it matters for product.",
};

const steps: ModuleStep[] = [
  { id: "analogy", label: "Real-World Analogy" },
  { id: "product", label: "How QuickBite Uses Data" },
  { id: "playground", label: "Database Playground" },
  { id: "why", label: "Why PMs Should Care" },
  { id: "quiz", label: "Scenario Quiz" },
];

const warehouseFlow: FlowNode[] = [
  { id: "co", label: "Customer Orders", icon: "user" },
  { id: "k", label: "Kitchen", icon: "kitchen", accent: "brand" },
  { id: "ws", label: "Warehouse Storage", icon: "warehouse" },
];

const archFlow: FlowNode[] = [
  {
    id: "fe",
    label: "Frontend App",
    icon: "phone",
    detail: {
      title: "The QuickBite app",
      body: "What Rahul taps and sees. It never touches the database directly — it only asks the backend for what it needs.",
    },
  },
  {
    id: "be",
    label: "Backend Server",
    icon: "server",
    accent: "brand",
    detail: {
      title: "The backend",
      body: "The middle-man. It receives the app's request, checks rules and permissions, then translates it into a database query.",
    },
  },
  {
    id: "db",
    label: "Database",
    icon: "database",
    detail: {
      title: "The database",
      body: "Where every restaurant, order, user and driver is stored permanently. The single source of truth the whole product runs on.",
    },
  },
];

export default function DatabasesPage() {
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
              Module 02 · Beginner · 15 min
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Databases for Product Managers
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
              Every restaurant, order and customer in QuickBite lives
              somewhere. That somewhere is a database. Let's see where app data
              is stored — and why those decisions shape the product.
            </p>
          </header>

          <Section
            id="analogy"
            eyebrow="Section 1"
            title="Think of a Database Like a Restaurant Warehouse"
            description="A restaurant keeps its ingredients in an organised warehouse so the kitchen can find anything fast. Apps do the same thing with information — they store it in a database."
          >
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
              <AnimatedFlow nodes={warehouseFlow} />
              <p className="mt-7 text-sm leading-relaxed text-muted">
                Orders come in, the kitchen works, and everything it needs is
                pulled from organised storage. Swap “warehouse” for “database”
                and you already understand the core idea.
              </p>
            </div>
            <div className="mt-6">
              <ConceptMap />
            </div>
          </Section>

          <Section
            id="product"
            eyebrow="Section 2"
            title="How QuickBite Uses Databases"
            description="When a user opens QuickBite to browse restaurants, place an order, or track delivery, the app never talks to the database directly — it goes through the backend. Tap each stage, then open each table."
          >
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
              <AnimatedFlow nodes={archFlow} />
              <p className="mt-7 text-sm leading-relaxed text-muted">
                The data itself is split into focused tables. Open each one to
                see what it stores and why the product needs it.
              </p>
            </div>
            <div className="mt-6">
              <TableExplorer />
            </div>
          </Section>

          <Section
            id="playground"
            eyebrow="Section 3"
            title="Interactive Database Playground"
            description="This is a live, fake QuickBite database. Run the guided scenarios — or poke at it yourself — and watch records get added, updated, deleted and searched in real time."
          >
            <DatabasePlayground />

            <div className="mt-12 space-y-3">
              <h3 className="text-lg font-semibold tracking-tight">
                How tables connect — relationships
              </h3>
              <p className="max-w-2xl text-sm leading-relaxed text-muted">
                Data isn't one giant list. It's split into tables that link to
                each other so nothing is duplicated.
              </p>
              <div className="pt-2">
                <RelationalView />
              </div>
            </div>

            <div className="mt-10 space-y-3">
              <h3 className="text-lg font-semibold tracking-tight">
                Why some searches are instant — indexing
              </h3>
              <p className="max-w-2xl text-sm leading-relaxed text-muted">
                Indexes are why search feels instant even with millions of
                records.
              </p>
              <div className="pt-2">
                <IndexDemo />
              </div>
            </div>

            <div className="mt-10 space-y-3">
              <h3 className="text-lg font-semibold tracking-tight">
                Why speed matters — database latency
              </h3>
              <p className="max-w-2xl text-sm leading-relaxed text-muted">
                The same screen feels great or broken depending entirely on how
                fast the database answers.
              </p>
              <div className="pt-2">
                <LatencyDemo />
              </div>
            </div>
          </Section>

          <Section
            id="why"
            eyebrow="Section 4"
            title="Why this matters for product managers"
            description="You won't design the schema — but every one of these realities will land on your roadmap."
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {DB_INSIGHTS.map((card, i) => (
                <InfoCard key={card.title} data={card} index={i} />
              ))}
            </div>
          </Section>

          <Section
            id="quiz"
            eyebrow="Section 5"
            title="Test your instinct"
            description="One real complaint from QuickBite users. What would a strong PM suspect first?"
          >
            <Quiz
              scenario={DB_QUIZ.scenario}
              question={DB_QUIZ.question}
              options={DB_QUIZ.options}
            />
          </Section>

          <div className="mt-10 rounded-2xl border border-border bg-brand-soft p-8 text-center">
            <h3 className="text-lg font-semibold">Module complete</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              You can now picture where app data lives, how it's fetched and
              changed, and why database decisions shape the product experience.
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
