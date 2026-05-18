import { Hero } from "@/components/hero";
import { ConceptCard } from "@/components/concept-card";
import { concepts, type Difficulty } from "@/lib/concepts";

const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  Beginner: 0,
  Intermediate: 1,
  Advanced: 2,
};

// Easiest first → Beginner, then Intermediate, then Advanced.
const sortedConcepts = [...concepts].sort(
  (a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]
);

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-5">
      <Hero />

      <section className="pb-28">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Start with a concept
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] text-muted">
            Each module is a hands-on playground — analogies, real product
            flows, and interactive simulators built for PMs.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedConcepts.map((concept, i) => (
            <ConceptCard key={concept.slug} concept={concept} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
