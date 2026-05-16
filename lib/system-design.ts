import type { IconName } from "./icons";

export const APP_NAME = "QuickBite";

/* ---------- Section 1: restaurant-chain analogy ---------- */

export interface SdAnalogyPair {
  real: string;
  app: string;
  icon: IconName;
  plain: string;
}

export const SD_ANALOGY: SdAnalogyPair[] = [
  {
    real: "The customer",
    app: "Mobile app (frontend)",
    icon: "phone",
    plain:
      "What the user actually sees and taps. It doesn't cook anything — it just takes the order and shows the result.",
  },
  {
    real: "The waiter",
    app: "APIs",
    icon: "network",
    plain:
      "Carries requests to the kitchen and brings answers back. A clear, reliable messenger between the user and the system.",
  },
  {
    real: "The kitchen",
    app: "Backend server",
    icon: "server",
    plain:
      "Where the real work happens — orders are processed, payments handled, drivers assigned.",
  },
  {
    real: "The storage room",
    app: "Database",
    icon: "database",
    plain:
      "Where everything is kept: customers, restaurants, past orders. Nothing is forgotten between visits.",
  },
  {
    real: "The delivery network",
    app: "Real-time logistics",
    icon: "bike",
    plain:
      "Gets the order to the door and keeps the live map updating. The part the customer anxiously watches.",
  },
];

/* ---------- Section 2: clickable architecture ---------- */
/* Detail copy is rendered through the shared AnimatedFlow modal. */

/* ---------- Section 3: request journey ---------- */

export interface JourneyStep {
  key: string;
  label: string;
  icon: IconName;
  detail: string;
}

/* Each control maps to its own ordered set of steps. */
export const JOURNEYS: Record<
  "order" | "track" | "cancel" | "retry",
  { title: string; steps: JourneyStep[] }
> = {
  order: {
    title: "Place Order",
    steps: [
      { key: "fe", label: "Frontend captures tap", icon: "phone", detail: "The app records “Place Order” and shows a loading state." },
      { key: "api", label: "API request sent", icon: "network", detail: "A structured request travels to the backend." },
      { key: "be", label: "Backend processes", icon: "server", detail: "Business rules run — availability, pricing, promos." },
      { key: "db", label: "Order stored", icon: "database", detail: "A permanent order record is written to the database." },
      { key: "pay", label: "Payment validated", icon: "card", detail: "Payment service authorises the charge." },
      { key: "notif", label: "Restaurant notified", icon: "bell", detail: "An alert is pushed to the restaurant to start cooking." },
      { key: "drv", label: "Driver assigned", icon: "bike", detail: "The logistics system finds the nearest free rider." },
      { key: "done", label: "Confirmation to user", icon: "badge", detail: "The app shows “Order placed” with a live ETA." },
    ],
  },
  track: {
    title: "Track Delivery",
    steps: [
      { key: "fe", label: "Frontend opens tracker", icon: "phone", detail: "The app requests the latest delivery status." },
      { key: "api", label: "API request sent", icon: "network", detail: "A lightweight read request goes out." },
      { key: "be", label: "Backend reads status", icon: "server", detail: "It checks the live driver position and order state." },
      { key: "db", label: "Latest data fetched", icon: "database", detail: "Current ETA and location are pulled from storage." },
      { key: "done", label: "Live map updates", icon: "mapPin", detail: "The user sees the rider moving in near real time." },
    ],
  },
  cancel: {
    title: "Cancel Order",
    steps: [
      { key: "fe", label: "Frontend sends cancel", icon: "phone", detail: "The user taps Cancel before food prep starts." },
      { key: "api", label: "API request sent", icon: "network", detail: "A cancel request is delivered to the backend." },
      { key: "be", label: "Backend checks rules", icon: "server", detail: "Is it still cancellable? Policy is applied here." },
      { key: "db", label: "Order marked cancelled", icon: "database", detail: "The record is updated, not deleted (for audits)." },
      { key: "pay", label: "Refund initiated", icon: "card", detail: "Payment service starts the refund." },
      { key: "done", label: "User notified", icon: "badge", detail: "Confirmation and refund timeline are shown." },
    ],
  },
  retry: {
    title: "Retry Failed Request",
    steps: [
      { key: "fe", label: "Request failed", icon: "alert", detail: "The first attempt timed out — the app caught it." },
      { key: "wait", label: "Brief backoff", icon: "hourglass", detail: "The app waits a moment before trying again." },
      { key: "api", label: "Request re-sent", icon: "refresh", detail: "The same request is sent a second time." },
      { key: "be", label: "Backend processes", icon: "server", detail: "This time the backend responds in time." },
      { key: "done", label: "Recovered", icon: "badge", detail: "The user barely noticed — a good retry is invisible." },
    ],
  },
};

/* ---------- Section 6: failure scenarios ---------- */

export interface FailureScenario {
  id: "database" | "payment" | "notification";
  name: string;
  icon: IconName;
  trigger: string;
  symptoms: string[];
  insight: string;
}

export const FAILURES: FailureScenario[] = [
  {
    id: "database",
    name: "Database slowdown",
    icon: "database",
    trigger: "The database starts responding slowly under load.",
    symptoms: [
      "Order screens hang on spinners",
      "Some requests time out and fail",
      "Every data-backed feature feels broken",
    ],
    insight:
      "One infrastructure issue can impact the entire user experience — users don't see “the database”, they just see a frozen app.",
  },
  {
    id: "payment",
    name: "Payment service crash",
    icon: "card",
    trigger: "The payment service goes down mid–dinner-rush.",
    symptoms: [
      "Checkout fails at the last step",
      "Automatic retries kick in",
      "Fallback: order saved as “payment pending”",
    ],
    insight:
      "System resilience directly affects revenue — a failed checkout is lost money, so graceful fallbacks matter.",
  },
  {
    id: "notification",
    name: "Notification failure",
    icon: "bell",
    trigger: "The restaurant never receives the new-order alert.",
    symptoms: [
      "Food prep never starts",
      "Customer sees “preparing” but nothing happens",
      "Support tickets and cancellations rise",
    ],
    insight:
      "Internal systems directly affect operations — an invisible backend failure becomes a very visible customer problem.",
  },
];

/* ---------- Section 7: playground palette ---------- */

export interface PaletteItem {
  id: string;
  label: string;
  icon: IconName;
  role: "client" | "edge" | "compute" | "data" | "async";
  hint: string;
}

export const PALETTE: PaletteItem[] = [
  { id: "frontend", label: "Frontend", icon: "phone", role: "client", hint: "What users tap" },
  { id: "loadbalancer", label: "Load Balancer", icon: "split", role: "edge", hint: "Spreads traffic" },
  { id: "api", label: "API Layer", icon: "network", role: "edge", hint: "Front door to the backend" },
  { id: "backend", label: "Backend", icon: "server", role: "compute", hint: "Runs the logic" },
  { id: "cache", label: "Cache", icon: "zap", role: "compute", hint: "Fast repeated reads" },
  { id: "database", label: "Database", icon: "database", role: "data", hint: "Stores everything" },
  { id: "notification", label: "Notifications", icon: "bell", role: "async", hint: "Alerts & messages" },
];

/* A sensible reference order for the “animate data flow” pass. */
export const FLOW_ORDER = [
  "frontend",
  "loadbalancer",
  "api",
  "backend",
  "cache",
  "database",
  "notification",
];

/* ---------- Section 8: PM insights ---------- */

export interface SdInsight {
  icon: IconName;
  title: string;
  body: string;
}

export const SD_INSIGHTS: SdInsight[] = [
  {
    icon: "gauge",
    title: "Performance drives retention",
    body: "Users equate speed with quality. A consistently fast system keeps people ordering; a sluggish one quietly bleeds users.",
  },
  {
    icon: "trendingDown",
    title: "Downtime is lost revenue",
    body: "Every minute the system is down during peak hours is orders — and trust — that don't come back.",
  },
  {
    icon: "scale",
    title: "Scalability gates growth",
    body: "If the system can't absorb a traffic spike, marketing wins become outages. Scale is a growth enabler.",
  },
  {
    icon: "rocket",
    title: "Architecture sets release speed",
    body: "A clean, well-separated system is faster and safer to change — which means faster experiments and iteration.",
  },
  {
    icon: "wrench",
    title: "Tech limits shape the roadmap",
    body: "What's feasible this quarter is bounded by the current architecture. Knowing the limits makes roadmaps credible.",
  },
];

/* ---------- Section 9: quiz ---------- */

export const SD_QUIZ = {
  scenario:
    "QuickBite crashes during a major cricket final when millions of users open the app and order simultaneously.",
  question: "What is the MOST likely issue?",
  options: [
    {
      id: "a",
      label: "The system could not scale to handle the traffic surge",
      correct: true,
      rationale:
        "A sudden spike of millions of concurrent users overwhelms servers and the database unless the system can scale out (more servers, load balancing, caching). This is the classic “couldn't handle peak load” failure.",
    },
    {
      id: "b",
      label: "Restaurant menus are too colorful",
      correct: false,
      rationale:
        "Visual design has no effect on whether the system can handle millions of concurrent requests.",
    },
    {
      id: "c",
      label: "Drivers forgot their passwords",
      correct: false,
      rationale:
        "Driver logins are unrelated to a mass simultaneous-traffic crash affecting all users.",
    },
    {
      id: "d",
      label: "UI animations are too smooth",
      correct: false,
      rationale:
        "Smooth animations are a frontend detail and don't cause a system-wide outage under load.",
    },
  ],
};
