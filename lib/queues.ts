import type { IconName } from "./icons";

export const APP_NAME = "QuickBite";

/* ---------- Section 1: restaurant order-counter analogy ---------- */

export interface QueueAnalogyPair {
  real: string;
  app: string;
  icon: IconName;
  plain: string;
}

export const QUEUE_ANALOGY: QueueAnalogyPair[] = [
  {
    real: "Customers placing orders",
    app: "User requests",
    icon: "users",
    plain:
      "Everyone wants something at once. If each person had to wait for the previous order to be fully cooked before ordering, the line would never move.",
  },
  {
    real: "The order ticket rail",
    app: "The task queue",
    icon: "receipt",
    plain:
      "Orders are written on tickets and lined up. The counter is free again instantly — the kitchen will get to each ticket in turn.",
  },
  {
    real: "Kitchen staff cooking",
    app: "Background workers",
    icon: "kitchen",
    plain:
      "Cooks pull tickets off the rail and prepare meals steadily in the background. Add more cooks and the rail clears faster.",
  },
  {
    real: "Meals being prepared",
    app: "Background jobs",
    icon: "utensils",
    plain:
      "The actual heavy work — cooking, plating, packing. It happens away from the counter so customers aren't stuck watching it.",
  },
];

/* ---------- Section 2: why apps delay tasks ---------- */

export interface OrderStep {
  id: string;
  label: string;
  icon: IconName;
  /** true = must finish before the user sees success */
  critical: boolean;
  /** rough relative time cost, ms, used by the WhyDelay visual */
  cost: number;
}

export const ORDER_STEPS: OrderStep[] = [
  { id: "save", label: "Save order", icon: "database", critical: true, cost: 300 },
  { id: "pay", label: "Process payment", icon: "card", critical: true, cost: 700 },
  { id: "notify", label: "Notify restaurant", icon: "store", critical: false, cost: 600 },
  { id: "email", label: "Send email confirmation", icon: "mail", critical: false, cost: 900 },
  { id: "driver", label: "Assign delivery partner", icon: "bike", critical: false, cost: 800 },
  { id: "analytics", label: "Update analytics", icon: "chart", critical: false, cost: 500 },
];

/* ---------- Section 4 / 5: task queue playground ---------- */

export type Priority = "high" | "normal" | "low";

export interface TaskType {
  id: string;
  label: string;
  icon: IconName;
  priority: Priority;
  /** how many "work units" the task takes to finish */
  weight: number;
  /** probability a single attempt fails (used only with Flaky mode) */
  flaky: number;
}

export const TASK_TYPES: TaskType[] = [
  { id: "order", label: "Place Order", icon: "bag", priority: "high", weight: 3, flaky: 0.04 },
  { id: "payment", label: "Process Payment", icon: "card", priority: "high", weight: 4, flaky: 0.12 },
  { id: "otp", label: "Send OTP", icon: "key", priority: "high", weight: 1, flaky: 0.06 },
  { id: "email", label: "Send Email", icon: "mail", priority: "normal", weight: 2, flaky: 0.15 },
  { id: "invoice", label: "Generate Invoice", icon: "receipt", priority: "low", weight: 5, flaky: 0.05 },
  { id: "video", label: "Upload Video", icon: "film", priority: "low", weight: 8, flaky: 0.08 },
];

export const PRIORITY_RANK: Record<Priority, number> = {
  high: 0,
  normal: 1,
  low: 2,
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  high: "High priority",
  normal: "Normal",
  low: "Low priority",
};

/* ---------- Section 6: real-world product examples ---------- */

export interface ProductExample {
  id: string;
  name: string;
  icon: IconName;
  accent: string;
  instant: string;
  background: string[];
  insight: string;
}

export const PRODUCT_EXAMPLES: ProductExample[] = [
  {
    id: "signup",
    name: "Email confirmations",
    icon: "mail",
    accent: "text-sky-500",
    instant: "Account created — you're in",
    background: ["Render welcome email", "Send via email provider", "Log delivery"],
    insight:
      "Sign-up feels instant because the welcome email is queued, not waited on. The user is already using the app while it sends.",
  },
  {
    id: "video",
    name: "Video processing",
    icon: "film",
    accent: "text-rose-500",
    instant: "Upload complete — processing…",
    background: [
      "Generate thumbnails",
      "Encode HD & SD versions",
      "Create subtitles",
    ],
    insight:
      "Heavy media work can take minutes. Queues let the app accept the upload immediately and grind the rest in the background.",
  },
  {
    id: "order",
    name: "QuickBite order",
    icon: "bag",
    accent: "text-brand",
    instant: "Order placed! 🎉",
    background: [
      "Notify restaurant",
      "Generate invoice",
      "Send SMS confirmation",
      "Update analytics",
    ],
    insight:
      "One tap fans out into many background jobs running at once — none of which the hungry customer should have to wait on.",
  },
  {
    id: "otp",
    name: "OTP delivery",
    icon: "key",
    accent: "text-amber-500",
    instant: "OTP requested",
    background: ["Queue as high priority", "Send SMS / push", "Deliver in ~2s"],
    insight:
      "OTPs are queued at high priority so they jump ahead of bulk jobs — login should never wait behind an analytics batch.",
  },
];

/* ---------- Section 9: priority queue ---------- */

export interface PriorityExample {
  priority: Priority;
  jobs: { label: string; icon: IconName }[];
  why: string;
}

export const PRIORITY_EXAMPLES: PriorityExample[] = [
  {
    priority: "high",
    jobs: [
      { label: "OTP delivery", icon: "key" },
      { label: "Payment confirmation", icon: "card" },
    ],
    why: "Directly blocks a user mid-flow. Slow here = abandoned login or checkout.",
  },
  {
    priority: "normal",
    jobs: [
      { label: "Order confirmation email", icon: "mail" },
      { label: "Restaurant notification", icon: "store" },
    ],
    why: "Matters soon, but a few extra seconds won't break the experience.",
  },
  {
    priority: "low",
    jobs: [
      { label: "Analytics updates", icon: "chart" },
      { label: "Recommendation recalculation", icon: "sparkles" },
    ],
    why: "Invisible to the user right now. Fine to run whenever workers are free.",
  },
];

/* ---------- Section 10: PM insight cards ---------- */

export interface QueueInsight {
  icon: IconName;
  title: string;
  body: string;
}

export const QUEUE_INSIGHTS: QueueInsight[] = [
  {
    icon: "scale",
    title: "Queues improve scalability",
    body: "Traffic spikes get absorbed into a buffer instead of crashing the app. The queue grows; the product stays up.",
  },
  {
    icon: "zap",
    title: "Background work feels instant",
    body: "Users get an immediate confirmation while the heavy work continues out of sight — perceived speed is a product lever.",
  },
  {
    icon: "gauge",
    title: "Delayed jobs reduce backend pressure",
    body: "Spreading non-urgent work over time keeps systems steady instead of overloaded at peak.",
  },
  {
    icon: "refresh",
    title: "Retries improve reliability",
    body: "A flaky email provider or slow payment gateway no longer loses the job — it's retried automatically until it succeeds.",
  },
  {
    icon: "heart",
    title: "Async improves the experience",
    body: "Nobody stares at a spinner waiting for analytics to update. Responsiveness is what users actually feel.",
  },
];

/* ---------- Section 11: analytics dashboard baseline ---------- */

export const QUEUE_ANALYTICS_BASELINE = {
  queueLength: 42,
  throughput: 38, // jobs / sec
  failed: 3,
  retries: 7,
  avgProcessing: 1.4, // seconds
  workerUtil: 78, // %
  backlog: 120,
};

/* ---------- Section 12: scenario quiz ---------- */

export const QUEUE_QUIZ = {
  scenario:
    "QuickBite becomes extremely slow during dinner rush. Every order waits for invoice generation, analytics updates and email confirmations to finish before the success screen appears.",
  question: "What is the MOST likely improvement needed?",
  options: [
    {
      id: "a",
      label: "Move non-critical tasks into background queues",
      correct: true,
      rationale:
        "The user only needs the order saved and paid. Invoice, analytics and email are non-critical — queuing them lets the app confirm instantly and process the rest in the background, which is exactly what fixes this slowdown.",
    },
    {
      id: "b",
      label: "Increase the size of the checkout button",
      correct: false,
      rationale:
        "UI sizing doesn't change the fact that the request is blocked behind slow non-critical work.",
    },
    {
      id: "c",
      label: "Add more loading animations",
      correct: false,
      rationale:
        "A nicer spinner still leaves the user waiting. The goal is to remove the wait, not decorate it.",
    },
    {
      id: "d",
      label: "Remove email confirmations entirely",
      correct: false,
      rationale:
        "Users still want their confirmation email — the problem isn't the email existing, it's the order waiting for it. Queue it instead of deleting it.",
    },
  ],
};
