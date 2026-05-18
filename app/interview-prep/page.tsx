import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ModuleSidebar, type ModuleStep } from "@/components/module-sidebar";
import { InterviewHero } from "@/components/interview/interview-hero";
import { QuestionCategories } from "@/components/interview/question-categories";
import { ApproachTimeline } from "@/components/interview/approach-timeline";
import { FrameworkCards } from "@/components/interview/framework-cards";
import { MockInterview } from "@/components/interview/mock-interview";
import { CommonMistakes } from "@/components/interview/common-mistakes";
import { InterviewRoadmap } from "@/components/interview/interview-roadmap";
import { InterviewCTA } from "@/components/interview/interview-cta";

export const metadata: Metadata = {
  title: "PM Interview Prep — PMverse",
  description:
    "Crack Product Management interviews: question types, answer frameworks, a step-by-step approach, interactive mock practice, common mistakes, and a 6-week roadmap.",
};

const steps: ModuleStep[] = [
  { id: "categories", label: "Question Types" },
  { id: "approach", label: "How to Approach" },
  { id: "frameworks", label: "Frameworks" },
  { id: "mock", label: "Mock Practice" },
  { id: "mistakes", label: "Common Mistakes" },
  { id: "roadmap", label: "6-Week Roadmap" },
];

export default function InterviewPrepPage() {
  return (
    <div className="pb-28">
      <InterviewHero />

      <div className="mx-auto max-w-6xl px-5">
        <div className="flex gap-12 pt-6">
          <ModuleSidebar steps={steps} />

          <div className="min-w-0 flex-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
            >
              <ArrowLeft className="h-4 w-4" />
              All concepts
            </Link>

            <Section
              id="categories"
              eyebrow="Section 1"
              title="Types of PM interview questions"
              description="Every PM loop is a mix of these. Know what each one is really testing, see a real sample, and gauge how often it shows up."
            >
              <QuestionCategories />
            </Section>

            <Section
              id="approach"
              eyebrow="Section 2"
              title="How to approach any PM question"
              description="Great answers aren't improvised — they follow a structure. Switch tracks and expand each step to see exactly what to say."
            >
              <ApproachTimeline />
            </Section>

            <Section
              id="frameworks"
              eyebrow="Section 3"
              title="The frameworks that do the heavy lifting"
              description="Memorize these once and you'll always have a structure to fall back on under pressure."
            >
              <FrameworkCards />
            </Section>

            <Section
              id="mock"
              eyebrow="Section 4"
              title="Mock interview practice"
              description="Pick a real question, start the timer, think out loud, use hints sparingly — then reveal the structure and compare."
            >
              <MockInterview />
            </Section>

            <Section
              id="mistakes"
              eyebrow="Section 5"
              title="Mistakes that quietly fail candidates"
              description="None of these are about knowledge — they're about structure and judgment. Fix these and your signal jumps."
            >
              <CommonMistakes />
            </Section>

            <Section
              id="roadmap"
              eyebrow="Section 6"
              title="Your 6-week interview roadmap"
              description="A realistic, confidence-building path from product thinking to interview day. Tick items off as you go."
            >
              <InterviewRoadmap />
            </Section>

            <div className="mt-16">
              <InterviewCTA />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
