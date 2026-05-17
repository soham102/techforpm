import type { IconName } from "./icons";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Concept {
  slug: string;
  title: string;
  description: string;
  minutes: number;
  difficulty: Difficulty;
  icon: IconName;
  available: boolean;
}

export const concepts: Concept[] = [
  {
    slug: "api-module",
    title: "API Fundamentals",
    description:
      "How apps talk to each other — explained with a restaurant, a food-delivery app, and a live simulator.",
    minutes: 12,
    difficulty: "Beginner",
    icon: "network",
    available: true,
  },
  {
    slug: "databases",
    title: "Databases",
    description:
      "Where product data lives, how it's queried, and why schema decisions shape what you can ship.",
    minutes: 15,
    difficulty: "Beginner",
    icon: "database",
    available: true,
  },
  {
    slug: "authentication",
    title: "Authentication",
    description:
      "Logins, sessions, and tokens — what keeps users secure and where the UX trade-offs hide.",
    minutes: 14,
    difficulty: "Intermediate",
    icon: "shield",
    available: true,
  },
  {
    slug: "microservices",
    title: "Microservices vs Monolith",
    description:
      "Why companies split one big system into independent services — scaling, releases, reliability and team ownership.",
    minutes: 16,
    difficulty: "Intermediate",
    icon: "layers",
    available: true,
  },
  {
    slug: "system-design",
    title: "System Design Basics",
    description:
      "How modern apps are structured end-to-end — requests, scaling, load balancing and failure, seen from the product side.",
    minutes: 18,
    difficulty: "Intermediate",
    icon: "workflow",
    available: true,
  },
  {
    slug: "search",
    title: "Search Systems",
    description:
      "How apps find, rank and correct results — indexing, relevance, typos and why search quality drives conversion.",
    minutes: 17,
    difficulty: "Intermediate",
    icon: "search",
    available: true,
  },
  {
    slug: "recommendations",
    title: "Recommendation Systems",
    description:
      "Why every user sees a different feed — behavior signals, personalization, feedback loops and the cold-start problem.",
    minutes: 18,
    difficulty: "Intermediate",
    icon: "sparkles",
    available: true,
  },
  {
    slug: "caching",
    title: "Caching",
    description:
      "Why apps load faster the second time — cache hit vs miss, surviving traffic spikes, stale data, and why speed drives retention.",
    minutes: 16,
    difficulty: "Beginner",
    icon: "zap",
    available: true,
  },
];
