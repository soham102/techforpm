import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/section";
import { AnimatedFlow, type FlowNode } from "@/components/animated-flow";
import { InfoCard } from "@/components/ui/info-card";
import { Quiz } from "@/components/quiz";
import { ModuleSidebar, type ModuleStep } from "@/components/module-sidebar";
import { SearchAnalogyMap } from "@/components/search/search-analogy-map";
import { SearchPlayground } from "@/components/search/search-playground";
import { IndexingViz } from "@/components/search/indexing-viz";
import { RankingEngine } from "@/components/search/ranking-engine";
import { TypoCorrection } from "@/components/search/typo-correction";
import { FilterSort } from "@/components/search/filter-sort";
import { SearchFailures } from "@/components/search/search-failures";
import { SearchAnalytics } from "@/components/search/search-analytics";
import { SEARCH_INSIGHTS, SEARCH_QUIZ } from "@/lib/search";

export const metadata: Metadata = {
  title: "Search Systems — Tech Concepts for PMs",
  description:
    "Understand app search visually: a directory analogy, a live search playground, indexing, ranking, typo correction, filters, failure modes, and a search analytics dashboard.",
};

const steps: ModuleStep[] = [
  { id: "analogy", label: "Real-World Analogy" },
  { id: "architecture", label: "How Search Works" },
  { id: "playground", label: "Search Playground" },
  { id: "indexing", label: "Indexing" },
  { id: "ranking", label: "Ranking Engine" },
  { id: "typo", label: "Typo Correction" },
  { id: "filters", label: "Filters & Sorting" },
  { id: "failures", label: "Failure Scenarios" },
  { id: "why", label: "Why PMs Should Care" },
  { id: "analytics", label: "Analytics Dashboard" },
  { id: "quiz", label: "Scenario Quiz" },
];

const searchFlow: FlowNode[] = [
  {
    id: "fe",
    label: "Frontend App",
    icon: "phone",
    detail: {
      title: "Frontend — the search bar",
      body: "Captures what the user types and shows suggestions and results. The whole experience starts here.",
    },
  },
  {
    id: "api",
    label: "Search API",
    icon: "network",
    accent: "brand",
    detail: {
      title: "Search API",
      body: "The app sends user search requests to the backend through this. PM insight: fast search APIs improve user experience — latency here is felt instantly.",
    },
  },
  {
    id: "index",
    label: "Search Index",
    icon: "bookOpen",
    detail: {
      title: "Search index",
      body: "A pre-organised catalog, like a book's index helping you find a page instantly. PM insight: without indexes, search becomes slow as the catalog grows.",
    },
  },
  {
    id: "rank",
    label: "Ranking Engine",
    icon: "star",
    detail: {
      title: "Ranking engine",
      body: "Decides which results appear first — using popularity, ratings, relevance and delivery time. PM insight: ranking directly impacts conversions.",
    },
  },
  {
    id: "filter",
    label: "Filters",
    icon: "filter",
    detail: {
      title: "Filtering system",
      body: "Lets users narrow results — veg only, under 30 mins, rating above 4.5. Good filters turn a long list into a decision.",
    },
  },
  {
    id: "res",
    label: "Results Returned",
    icon: "search",
    detail: {
      title: "Results returned",
      body: "Ranked, filtered, typo-corrected results travel back to the app and render as restaurant cards.",
    },
  },
];

export default function SearchPage() {
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
              Module 06 · Intermediate · 17 min
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Search Systems
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
              When a QuickBite user types “Pizza”, a lot happens before the
              first card appears. We'll trace how results are found, ranked and
              corrected — and why search quality is a conversion lever.
            </p>
          </header>

          <Section
            id="analogy"
            eyebrow="Section 1"
            title="Search Works Like a Restaurant Directory"
            description="A host who knows every restaurant, organises them, recommends the best, and understands you even when you mumble. That's search. Hover each pairing."
          >
            <SearchAnalogyMap />
          </Section>

          <Section
            id="architecture"
            eyebrow="Section 2"
            title="How QuickBite Search Works"
            description="A user searches “Pizza”. The query travels through these stages before results come back. Tap any component to see what it does and why it matters."
          >
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
              <AnimatedFlow nodes={searchFlow} />
              <p className="mt-7 text-sm leading-relaxed text-muted">
                Each stage has one job — find candidates, order them, narrow
                them, return them. Search quality is how well these work
                together.
              </p>
            </div>
          </Section>

          <Section
            id="playground"
            eyebrow="Section 3"
            title="Interactive Search Playground"
            description="A working QuickBite search. Try Pizza, Burger, Biryani or Sushi — or a typo like “piza” — and watch suggestions, loading, ranking and empty states."
          >
            <SearchPlayground />
          </Section>

          <Section
            id="indexing"
            eyebrow="Section 4"
            title="Why Search Is Instant — Indexing"
            description="The single biggest reason search stays fast at scale. Compare scanning everything vs an organised lookup."
          >
            <IndexingViz />
          </Section>

          <Section
            id="ranking"
            eyebrow="Section 5"
            title="The Ranking Engine"
            description="Two pizza places, same search — who shows first? Move the sliders and toggles and watch results reorder live."
          >
            <RankingEngine />
          </Section>

          <Section
            id="typo"
            eyebrow="Section 6"
            title="Typo Correction"
            description="Users mistype constantly. Watch the system figure out what they meant — with a confidence score."
          >
            <TypoCorrection />
          </Section>

          <Section
            id="filters"
            eyebrow="Section 7"
            title="Filtering & Sorting"
            description="Apply filters and sorts and watch the list reshape. This is how users get from “lots of options” to “the one I'll order”."
          >
            <FilterSort />
          </Section>

          <Section
            id="failures"
            eyebrow="Section 8"
            title="When Search Fails"
            description="Slow, irrelevant, or empty — each failure mode has a distinct product cost. Run them and feel the difference."
          >
            <SearchFailures />
          </Section>

          <Section
            id="why"
            eyebrow="Section 9"
            title="Why this matters for product managers"
            description="Search is the highest-intent surface in most apps. Its quality is one of the most direct levers on conversion and retention you have."
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SEARCH_INSIGHTS.map((card, i) => (
                <InfoCard key={card.title} data={card} index={i} />
              ))}
            </div>
          </Section>

          <Section
            id="analytics"
            eyebrow="Section 10"
            title="Search Analytics Dashboard"
            description="This is how a PM actually improves search — by watching these numbers, not the algorithm."
          >
            <SearchAnalytics />
          </Section>

          <Section
            id="quiz"
            eyebrow="Section 11"
            title="Test your instinct"
            description="A real pattern in QuickBite's data. What would a strong PM suspect first?"
          >
            <Quiz
              scenario={SEARCH_QUIZ.scenario}
              question={SEARCH_QUIZ.question}
              options={SEARCH_QUIZ.options}
            />
          </Section>

          <div className="mt-10 rounded-2xl border border-border bg-brand-soft p-8 text-center">
            <h3 className="text-lg font-semibold">Module complete</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              You can now explain how apps find and rank results, why indexing
              and typo handling matter, and how to read search analytics to
              improve conversion.
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
