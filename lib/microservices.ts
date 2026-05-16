import type { IconName } from "./icons";

export const APP_NAME = "QuickBite";

/* ---------- services ---------- */

export type ServiceId =
  | "auth"
  | "order"
  | "payment"
  | "notification"
  | "restaurant"
  | "delivery";

export interface ServiceMeta {
  id: ServiceId;
  name: string;
  icon: IconName;
}

export const SERVICES: ServiceMeta[] = [
  { id: "auth", name: "Auth Service", icon: "shield" },
  { id: "order", name: "Order Service", icon: "receipt" },
  { id: "payment", name: "Payment Service", icon: "card" },
  { id: "notification", name: "Notification Service", icon: "bell" },
  { id: "restaurant", name: "Restaurant Service", icon: "store" },
  { id: "delivery", name: "Delivery Tracking", icon: "bike" },
];

/* What the monolith bundles into one app. */
export const MONOLITH_FEATURES = [
  { label: "Login", icon: "shield" as IconName },
  { label: "Payments", icon: "card" as IconName },
  { label: "Restaurants", icon: "store" as IconName },
  { label: "Delivery tracking", icon: "bike" as IconName },
  { label: "Notifications", icon: "bell" as IconName },
];

/* ---------- user actions → which services they hit ---------- */

export interface UserAction {
  id: string;
  label: string;
  icon: IconName;
  services: ServiceId[];
  note: string;
}

export const USER_ACTIONS: UserAction[] = [
  {
    id: "login",
    label: "Log in",
    icon: "shield",
    services: ["auth"],
    note: "Only the Auth Service is involved — nothing else is touched.",
  },
  {
    id: "order",
    label: "Place an order",
    icon: "receipt",
    services: ["order", "payment"],
    note: "Order Service handles the order and calls Payment Service to charge.",
  },
  {
    id: "notify",
    label: "Send notification",
    icon: "bell",
    services: ["notification"],
    note: "Notification Service runs on its own — if it's slow, ordering still works.",
  },
  {
    id: "track",
    label: "Track delivery",
    icon: "bike",
    services: ["delivery", "restaurant"],
    note: "Delivery Tracking reads live status; Restaurant Service confirms prep.",
  },
];

/* ---------- Section 3: scaling timeline ---------- */

export interface GrowthStage {
  users: string;
  headline: string;
  stress: number; // 0-100 backend stress
  body: string;
}

export const GROWTH_TIMELINE: GrowthStage[] = [
  {
    users: "10K users",
    headline: "Launch",
    stress: 18,
    body: "One backend, one team, ships fast. The monolith is the right call here.",
  },
  {
    users: "250K users",
    headline: "Traction",
    stress: 45,
    body: "Deploys get slower. A bug in one feature now risks the whole app.",
  },
  {
    users: "1.5M users",
    headline: "Strain",
    stress: 72,
    body: "Dinner-time spikes overload everything at once. Outages get frequent.",
  },
  {
    users: "5M users",
    headline: "Breaking point",
    stress: 94,
    body: "Teams block each other, releases stall, downtime hits revenue. Time to split.",
  },
];

/* ---------- Section 7: team ownership ---------- */

export const TEAMS = [
  { team: "Payments Team", service: "Payment Service", icon: "card" as IconName },
  { team: "Delivery Team", service: "Delivery Tracking", icon: "bike" as IconName },
  {
    team: "Notifications Team",
    service: "Notification Service",
    icon: "bell" as IconName,
  },
  { team: "Orders Team", service: "Order Service", icon: "receipt" as IconName },
];

/* ---------- Section 8: tradeoffs ---------- */

export const TRADEOFFS = {
  monolithBenefits: [
    "Easier to build initially",
    "Simpler debugging — one place to look",
    "Faster early-stage development",
    "Lower infrastructure complexity",
  ],
  microBenefits: [
    "Better scalability — scale only what's hot",
    "Independent deployments",
    "Fault isolation — one failure stays contained",
    "Team autonomy",
  ],
  microChallenges: [
    "Operational complexity",
    "Harder debugging across services",
    "Distributed failures & network issues",
    "Infrastructure & cost overhead",
  ],
};

/* ---------- Section 9: PM insights ---------- */

export interface MsInsight {
  icon: IconName;
  title: string;
  body: string;
}

export const MS_INSIGHTS: MsInsight[] = [
  {
    icon: "scale",
    title: "Architecture caps scalability",
    body: "How the system is split decides how big the product can grow before it buckles. It's a ceiling on ambition.",
  },
  {
    icon: "shield",
    title: "Failures shape user trust",
    body: "Whether one broken feature takes down checkout is an architecture decision — and a trust decision.",
  },
  {
    icon: "rocket",
    title: "Deploy speed = experiment speed",
    body: "If shipping is risky and slow, A/B tests and iteration slow down too. Velocity is a product asset.",
  },
  {
    icon: "users",
    title: "Structure drives roadmap velocity",
    body: "Independent services let teams move in parallel. Architecture quietly shapes how fast the roadmap moves.",
  },
  {
    icon: "alert",
    title: "Over-engineering early is risky",
    body: "Microservices too soon adds cost and complexity with no payoff. The right answer depends on scale.",
  },
];

/* ---------- Section 10: quiz ---------- */

export const MS_QUIZ = {
  scenario:
    "QuickBite's notification system crashes during dinner rush, but leadership wants order placement to keep working normally for customers.",
  question: "Which architectural approach helps most here?",
  options: [
    {
      id: "a",
      label: "Microservices",
      correct: true,
      rationale:
        "With independent services, Notification can fail in isolation while Order and Payment keep running. That fault isolation is exactly what protects checkout when one feature breaks.",
    },
    {
      id: "b",
      label: "Monolith",
      correct: false,
      rationale:
        "In a monolith everything shares one process — a crashing notification component can slow or take down ordering too. That's the opposite of what's wanted.",
    },
    {
      id: "c",
      label: "Single database",
      correct: false,
      rationale:
        "A shared database doesn't isolate failures between features — it's not what keeps ordering alive when notifications break.",
    },
    {
      id: "d",
      label: "Static frontend",
      correct: false,
      rationale:
        "A static frontend doesn't change how backend features fail or stay isolated from each other.",
    },
  ],
};
