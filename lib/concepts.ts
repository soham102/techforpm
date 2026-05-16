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
];
