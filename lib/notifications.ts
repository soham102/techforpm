import type { IconName } from "./icons";
import type { InfoCardData } from "@/components/ui/info-card";

export const APP_NAME = "QuickBite";

/* ---------- Section 1: courier-delivery analogy mapping ---------- */

export interface AnalogyPair {
  tech: string;
  real: string;
  icon: IconName;
  plain: string;
}

export const ANALOGY_PAIRS: AnalogyPair[] = [
  {
    tech: "Event trigger",
    real: "The restaurant has an update",
    icon: "store",
    plain:
      "Something worth telling the customer just happened — “the food is ready”. The restaurant doesn't deliver it itself; it hands the update over.",
  },
  {
    tech: "Notification service",
    real: "The courier company",
    icon: "bike",
    plain:
      "Takes the update, figures out who it's for and which address to deliver to, then dispatches it. The brains of the operation.",
  },
  {
    tech: "Push provider",
    real: "The delivery rider on the road",
    icon: "send",
    plain:
      "Carries the message the last mile to the right doorstep. Apple and Google run these riders for iPhones and Android phones.",
  },
  {
    tech: "User device",
    real: "The customer's house",
    icon: "phone",
    plain:
      "The destination. The message is dropped here even if nobody is actively waiting at the door — it shows on the lock screen.",
  },
];

/* ---------- Section 2: architecture flow ---------- */

export interface ArchNode {
  id: string;
  label: string;
  icon: IconName;
  detail: { title: string; body: string; pm: string };
}

export const ARCH_NODES: ArchNode[] = [
  {
    id: "event",
    label: "Backend event",
    icon: "store",
    detail: {
      title: "Event trigger",
      body: "Something important happens inside the app — an order ships, a payment fails, a driver gets close, a friend sends a message. This is the spark that starts everything.",
      pm: "Notifications begin with product events. If the event isn't tracked, the notification can never be sent.",
    },
  },
  {
    id: "service",
    label: "Notification service",
    icon: "bike",
    detail: {
      title: "Notification service",
      body: "The backend decides who should hear about this event, what the message should say, and whether now is a good time to send it. It's the targeting and decision layer.",
      pm: "Targeting matters for engagement. The same event should reach the right users — not everyone, not nobody.",
    },
  },
  {
    id: "provider",
    label: "Push provider",
    icon: "send",
    detail: {
      title: "Push provider (Firebase / Apple)",
      body: "Services run by Google and Apple that actually carry the notification the last mile to a specific phone. Your app hands the message to them and they handle the delivery road.",
      pm: "You don't build this — you rely on it. It's a dependency, which means it can also be a point of failure.",
    },
  },
  {
    id: "device",
    label: "User device",
    icon: "phone",
    detail: {
      title: "The user's phone",
      body: "The notification appears on the lock screen even when the app is completely closed. The user didn't open anything — the update came to them.",
      pm: "Push notifications re-engage inactive users. This is the only channel that reaches someone who isn't currently in your app.",
    },
  },
  {
    id: "shown",
    label: "Notification shown",
    icon: "bellRing",
    detail: {
      title: "Notification displayed",
      body: "“Your order is arriving!” lights up the screen. The user taps it, the app opens to the right place, and the loop closes.",
      pm: "A delivered notification is only valuable if it's opened. Open rate is the metric that actually reflects impact.",
    },
  },
];

/* ---------- Section 3 / 4: playground events ---------- */

export type NotifKind = "transactional" | "engagement" | "realtime";

export interface NotifEvent {
  id: string;
  trigger: string;
  title: string;
  body: string;
  icon: IconName;
  kind: NotifKind;
  priority: "High" | "Medium" | "Low";
  app: string;
}

export const NOTIF_EVENTS: NotifEvent[] = [
  {
    id: "order",
    trigger: "Place Order",
    title: "Order confirmed 🎉",
    body: "QuickBite · Burger Barn is preparing your order.",
    icon: "bag",
    kind: "transactional",
    priority: "High",
    app: "QuickBite",
  },
  {
    id: "driver",
    trigger: "Driver Near You",
    title: "Your order is arriving!",
    body: "QuickBite · Rahul is 2 minutes away. Get ready!",
    icon: "bike",
    kind: "transactional",
    priority: "High",
    app: "QuickBite",
  },
  {
    id: "payment",
    trigger: "Payment Failed",
    title: "Payment failed",
    body: "QuickBite · We couldn't process your card. Tap to retry.",
    icon: "card",
    kind: "transactional",
    priority: "High",
    app: "QuickBite",
  },
  {
    id: "message",
    trigger: "New Message",
    title: "Aanya sent a message",
    body: "WhatsApp · “Are we still on for dinner? 🍕”",
    icon: "message",
    kind: "realtime",
    priority: "High",
    app: "WhatsApp",
  },
  {
    id: "sale",
    trigger: "Flash Sale Started",
    title: "⚡ Flash sale is live!",
    body: "QuickBite · 50% off near you for the next 60 minutes.",
    icon: "tag",
    kind: "engagement",
    priority: "Low",
    app: "QuickBite",
  },
  {
    id: "social",
    trigger: "Friend Liked Your Post",
    title: "rohan_k liked your photo",
    body: "Instagram · and 12 others reacted to your post.",
    icon: "heart",
    kind: "engagement",
    priority: "Low",
    app: "Instagram",
  },
];

/* ---------- Section 5: delivery pipeline stages ---------- */

export interface PipelineStage {
  id: string;
  label: string;
  icon: IconName;
  desc: string;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "triggered",
    label: "Event triggered",
    icon: "store",
    desc: "The order status changed to “Out for delivery”.",
  },
  {
    id: "queued",
    label: "Queued",
    icon: "inbox",
    desc: "The notification waits in line with thousands of others.",
  },
  {
    id: "sent",
    label: "Sent to provider",
    icon: "send",
    desc: "Handed to Firebase / Apple to carry to the device.",
  },
  {
    id: "delivered",
    label: "Delivered",
    icon: "phone",
    desc: "It reached the phone and showed on the lock screen.",
  },
  {
    id: "opened",
    label: "Opened",
    icon: "bellRing",
    desc: "The user tapped it and landed back in the app.",
  },
];

/* ---------- Section 8: notification types ---------- */

export interface NotifType {
  id: NotifKind;
  name: string;
  icon: IconName;
  tone: "transactional" | "engagement" | "realtime";
  examples: string[];
  plain: string;
}

export const NOTIF_TYPES: NotifType[] = [
  {
    id: "transactional",
    name: "Transactional",
    icon: "receipt",
    tone: "transactional",
    examples: ["Order shipped", "OTP / verification code", "Payment confirmed"],
    plain:
      "Tied to something the user did. They expect these and almost always want them — high trust, high open rate. Turning these off feels broken.",
  },
  {
    id: "engagement",
    name: "Engagement",
    icon: "tag",
    tone: "engagement",
    examples: ["Personalised offers", "Cart reminders", "“We miss you”"],
    plain:
      "Sent by the product to pull the user back. Powerful for retention, but the easiest way to annoy people and trigger uninstalls if overdone.",
  },
  {
    id: "realtime",
    name: "Real-time alerts",
    icon: "siren",
    tone: "realtime",
    examples: ["New chat message", "Stock price alert", "Live sports score"],
    plain:
      "Time-sensitive — value drops the moment they're late. A message alert 20 minutes late is almost useless. Speed is the whole point.",
  },
];

/* ---------- Section 7: personalization personas ---------- */

export interface Persona {
  id: string;
  name: string;
  context: string;
  icon: IconName;
  generic: string;
  personalised: string;
}

export const PERSONAS: Persona[] = [
  {
    id: "aanya",
    name: "Aanya",
    context: "Orders dinner around 8pm · loves biryani",
    icon: "user",
    generic: "QuickBite has great food. Order now!",
    personalised: "Hungry? 🍛 Your favourite Paradise Biryani delivers in 25 min — it's 8pm.",
  },
  {
    id: "bilal",
    name: "Bilal",
    context: "Left 2 items in cart · price-sensitive",
    icon: "user",
    generic: "Check out QuickBite today.",
    personalised: "Your cart is waiting 🛒 — here's 20% off to finish your order.",
  },
  {
    id: "chitra",
    name: "Chitra",
    context: "Near a new outlet · tried it once",
    icon: "user",
    generic: "New restaurants added this week.",
    personalised: "📍 Burger Barn just opened 400m from you — free delivery on your first order.",
  },
];

/* ---------- Section 9: PM insight cards ---------- */

export const NOTIF_INSIGHTS: InfoCardData[] = [
  {
    icon: "trendingUp",
    title: "Notifications drive retention",
    body: "Push is the single most effective channel for bringing inactive users back. A well-timed nudge can be the difference between a daily-active user and a churned one.",
  },
  {
    icon: "trendingDown",
    title: "Bad notifications cause uninstalls",
    body: "Irrelevant or excessive alerts are one of the top reasons people uninstall an app. The same channel that retains users can actively repel them.",
  },
  {
    icon: "shield",
    title: "Timely alerts build trust",
    body: "“Your order is arriving” at the right moment reassures the user the product works. Late, wrong, or missing updates make the whole experience feel unreliable.",
  },
  {
    icon: "target",
    title: "Personalisation increases engagement",
    body: "A relevant message to the right person at the right time is opened far more often than a generic blast. Targeting quality beats sending volume.",
  },
  {
    icon: "bellOff",
    title: "Notification fatigue harms UX",
    body: "Every extra low-value alert lowers the odds the next one is opened — and pushes users toward turning notifications off entirely. Less, but better, wins.",
  },
];

/* ---------- Section 10: analytics dashboard baseline ---------- */

export const ANALYTICS_BASELINE = {
  sent: 1_240_000,
  deliveryRate: 96.4,
  openRate: 11.8,
  ctr: 4.2,
  failed: 44_600,
  optOut: 0.9,
  retries: 18_400,
  engagementLift: 23,
};

/* ---------- Section 12: scenario quiz ---------- */

export const NOTIF_QUIZ = {
  scenario:
    "QuickBite users have started ignoring notifications and some are turning them off entirely. Analytics show open rate has dropped from 14% to 4% over two months, while the number of notifications sent per user has tripled — mostly generic offers.",
  question: "What is the MOST likely improvement needed?",
  options: [
    {
      id: "a",
      label: "Better notification personalisation & frequency control",
      correct: true,
      rationale:
        "Tripling generic blasts is textbook notification fatigue: more volume, less relevance, collapsing open rate and rising opt-outs. Fewer, well-targeted, well-timed messages reverse exactly this pattern.",
    },
    {
      id: "b",
      label: "A larger app logo on the notification",
      correct: false,
      rationale:
        "A bigger logo doesn't make an irrelevant message relevant. The problem is what's being sent and how often — not how it's branded.",
    },
    {
      id: "c",
      label: "Slower backend servers",
      correct: false,
      rationale:
        "Server speed has nothing to do with users finding the messages irrelevant. Slowing things down would only delay notifications, not improve them.",
    },
    {
      id: "d",
      label: "More loading animations in the app",
      correct: false,
      rationale:
        "Animations don't address why people are muting notifications. The decision to ignore them happens on the lock screen, before the app even opens.",
    },
  ],
};

/* ---------- shared helpers ---------- */

/** Clamp a number to the 0–100 range. */
export function pct(n: number): number {
  return Math.max(0, Math.min(100, n));
}

/** Human-readable count (e.g. 1,240,000 → 1.2M). */
export function formatNum(n: number): string {
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`;
  return `${Math.round(n)}`;
}
