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
  {
    slug: "load-balancers",
    title: "Load Balancers",
    description:
      "How apps survive millions of users — traffic distribution, balancing strategies, failover, auto-scaling, and why it protects uptime.",
    minutes: 17,
    difficulty: "Beginner",
    icon: "scale",
    available: true,
  },
  {
    slug: "realtime",
    title: "WebSockets & Real-Time Systems",
    description:
      "How apps update instantly without refreshing — polling vs WebSockets, live tracking & chat, multi-user broadcast, and reconnection handling.",
    minutes: 18,
    difficulty: "Beginner",
    icon: "signal",
    available: true,
  },
  {
    slug: "notifications",
    title: "Push Notifications",
    description:
      "How apps notify you instantly — event triggers, the notification pipeline, why delivery fails & retries, personalization, fatigue, and the engagement metrics PMs watch.",
    minutes: 17,
    difficulty: "Beginner",
    icon: "bellRing",
    available: true,
  },
  {
    slug: "queues",
    title: "Queues & Background Jobs",
    description:
      "Why apps process some tasks later — the order-counter analogy, sync vs async, a live task-queue playground, traffic spikes, retries, priority queues and queue health.",
    minutes: 18,
    difficulty: "Beginner",
    icon: "receipt",
    available: true,
  },
  {
    slug: "booking-conflict",
    title: "AI-Assisted Booking Conflict Resolution",
    description:
      "Three customers race for the same slot. Watch slot locks, payment delays, graceful rejection, and AI-assisted alternates — with a hard line between deterministic decisions and AI experience.",
    minutes: 20,
    difficulty: "Advanced",
    icon: "lock",
    available: true,
  },
];
