import type { IconName } from "./icons";
import type { InfoCardData } from "@/components/ui/info-card";

export const APP_NAME = "QuickBite";

/* ---------- Section 1: live-phone-call analogy mapping ---------- */

export interface AnalogyPair {
  tech: string;
  real: string;
  icon: IconName;
  plain: string;
}

export const ANALOGY_PAIRS: AnalogyPair[] = [
  {
    tech: "API polling",
    real: "Calling someone every few seconds",
    icon: "refresh",
    plain:
      "“Any update? … Any update now? … How about now?” You hang up and redial constantly, mostly to hear “nothing yet”.",
  },
  {
    tech: "WebSocket",
    real: "Staying on one live phone call",
    icon: "phone",
    plain:
      "You dial once and stay connected. The moment there's news, you hear it — no redialing, no waiting.",
  },
  {
    tech: "The server",
    real: "The person sharing updates",
    icon: "radio",
    plain:
      "They don't wait to be asked. As soon as something changes, they just say it down the open line.",
  },
  {
    tech: "The client (your app)",
    real: "The person receiving updates",
    icon: "phone",
    plain:
      "Your app keeps the line open and reacts the instant something arrives — the screen updates by itself.",
  },
];

/* ---------- Section 2 / 5: polling vs websocket model ---------- */

/** Traffic tiers used by spike controls. */
export const TRAFFIC_STEPS = [1_000, 50_000, 500_000, 5_000_000] as const;

/* ---------- Section 6: QuickBite order tracking stages ---------- */

export interface OrderStage {
  id: string;
  label: string;
  icon: IconName;
  sub: string;
}

export const ORDER_STAGES: OrderStage[] = [
  { id: "preparing", label: "Preparing", icon: "kitchen", sub: "Burger Barn is cooking your order" },
  { id: "picked", label: "Picked up", icon: "bike", sub: "Rahul collected your order" },
  { id: "near", label: "Near you", icon: "mapPin", sub: "2 minutes away — arriving soon" },
  { id: "delivered", label: "Delivered", icon: "badge", sub: "Enjoy your meal!" },
];

/* ---------- Section 6: stock tickers ---------- */

export interface Ticker {
  symbol: string;
  name: string;
  price: number;
}

export const TICKERS: Ticker[] = [
  { symbol: "RELI", name: "Reliance", price: 2940 },
  { symbol: "TCS", name: "TCS", price: 4115 },
  { symbol: "INFY", name: "Infosys", price: 1605 },
  { symbol: "HDFC", name: "HDFC Bank", price: 1712 },
];

/* ---------- Section 9: types of real-time systems ---------- */

export interface RtType {
  id: string;
  name: string;
  icon: IconName;
  example: string;
  plain: string;
}

export const RT_TYPES: RtType[] = [
  {
    id: "chat",
    name: "Live chat",
    icon: "message",
    example: "WhatsApp · Slack",
    plain:
      "Messages, typing dots and read receipts appear the instant they happen — a conversation, not a refresh.",
  },
  {
    id: "tracking",
    name: "Live tracking",
    icon: "mapPin",
    example: "Uber · Swiggy",
    plain:
      "A moving dot on a map and a shrinking ETA. The location is pushed continuously so you always know where things are.",
  },
  {
    id: "streaming",
    name: "Live streaming",
    icon: "film",
    example: "YouTube Live · Twitch",
    plain:
      "Video and a running chat delivered to huge audiences at once, with everyone roughly in sync.",
  },
  {
    id: "collab",
    name: "Live collaboration",
    icon: "users",
    example: "Google Docs · Figma",
    plain:
      "Several people edit the same document and see each other's cursors and changes appear live.",
  },
];

/* ---------- Section 10: PM insight cards ---------- */

export const RT_INSIGHTS: InfoCardData[] = [
  {
    icon: "activity",
    title: "Real-time updates drive engagement",
    body: "Live scores, typing dots and moving maps keep people watching the screen instead of leaving and coming back. Real-time turns a check-in into a session.",
  },
  {
    icon: "shield",
    title: "Instant updates build trust",
    body: "Seeing the driver actually move, or the order status change on its own, reassures users that the product is working — uncertainty is what makes people anxious and churn.",
  },
  {
    icon: "layers",
    title: "Real-time adds infrastructure complexity",
    body: "An always-open connection per user, broadcasting, reconnection and scale are real engineering cost. It's worth it where it matters — and overkill where it doesn't.",
  },
  {
    icon: "gauge",
    title: "Latency is the experience",
    body: "For real-time features, the delay between event and screen is the product. A 'live' tracker that lags by 30 seconds feels broken even when it's technically working.",
  },
  {
    icon: "heart",
    title: "Live collaboration drives retention",
    body: "When a product becomes the shared place where a team works together in real time, switching away gets painful. Collaboration is one of the strongest retention moats.",
  },
];

/* ---------- Section 11: analytics dashboard baseline ---------- */

export const ANALYTICS_BASELINE = {
  activeConnections: 486_000,
  messagesPerSec: 71_500,
  avgLatencyMs: 84,
  reconnectsPerMin: 320,
  deliverySuccess: 99.95,
  concurrentUsers: 512_000,
  updatesPerSec: 240,
};

/* ---------- Section 12: scenario quiz ---------- */

export const RT_QUIZ = {
  scenario:
    "QuickBite users complain that the order-tracking screen only changes after they pull to refresh. The driver has clearly moved, but the app keeps showing the old status until the user manually reloads.",
  question: "What is the MOST likely missing capability?",
  options: [
    {
      id: "a",
      label: "A real-time WebSocket connection",
      correct: true,
      rationale:
        "The screen only updates on a manual refresh — the classic sign there's no live connection. A WebSocket keeps the app and server connected so status changes are pushed instantly, with no refresh.",
    },
    {
      id: "b",
      label: "Larger restaurant images",
      correct: false,
      rationale:
        "Image size has nothing to do with how fresh the status is. Bigger pictures won't make the tracker update on its own.",
    },
    {
      id: "c",
      label: "More colorful buttons",
      correct: false,
      rationale:
        "Styling doesn't change when or how data arrives. The complaint is about stale information, not appearance.",
    },
    {
      id: "d",
      label: "Slower database queries",
      correct: false,
      rationale:
        "Slowing anything down makes updates later, not sooner. The problem is the app never receives updates until it asks again.",
    },
  ],
};

/* ---------- shared helpers ---------- */

/** Clamp a number to the 0–100 range. */
export function pct(n: number): number {
  return Math.max(0, Math.min(100, n));
}

/** Human-readable count (e.g. 5,000,000 → 5M). */
export function formatNum(n: number): string {
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000)
    return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`;
  return `${Math.round(n)}`;
}

/** Nudge a stock price by a small random walk. */
export function tickPrice(price: number): { price: number; delta: number } {
  const delta = Math.round((Math.random() - 0.48) * price * 0.006 * 100) / 100;
  return { price: Math.round((price + delta) * 100) / 100, delta };
}
