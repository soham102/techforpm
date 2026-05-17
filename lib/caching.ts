import type { IconName } from "./icons";
import type { InfoCardData } from "@/components/ui/info-card";

export const APP_NAME = "QuickBite";

/* ---------- Section 1: coffee / supermarket analogy mapping ---------- */

export interface AnalogyPair {
  cache: string;
  real: string;
  icon: IconName;
  plain: string;
}

export const ANALOGY_PAIRS: AnalogyPair[] = [
  {
    cache: "Database",
    real: "The supermarket across town",
    icon: "warehouse",
    plain:
      "Everything is there and it's always correct — but getting to it takes a trip every single time.",
  },
  {
    cache: "Cache",
    real: "The coffee jar on your kitchen shelf",
    icon: "coffee",
    plain:
      "A small copy of the thing you need most, kept right next to you for instant access.",
  },
  {
    cache: "A request",
    real: "Wanting a cup of coffee",
    icon: "home",
    plain:
      "Every morning you need the same thing. The question is how far you have to go to get it.",
  },
  {
    cache: "A faster response",
    real: "Coffee already within reach",
    icon: "zap",
    plain:
      "Because a copy is nearby, you skip the long trip. Same coffee, a fraction of the wait.",
  },
];

/* ---------- Section 4 & 5: simulator resources ---------- */

export interface CacheResource {
  id: string;
  label: string;
  sub: string;
  icon: IconName;
  /** Cold latency when it has to hit the database, in ms. */
  dbMs: number;
  /** Warm latency when served from cache, in ms. */
  cacheMs: number;
}

export const RESOURCES: CacheResource[] = [
  {
    id: "restaurant",
    label: "Open restaurant page",
    sub: "QuickBite · Burger Barn",
    icon: "store",
    dbMs: 1400,
    cacheMs: 90,
  },
  {
    id: "search",
    label: "Search “pizza”",
    sub: "QuickBite · search results",
    icon: "search",
    dbMs: 1700,
    cacheMs: 120,
  },
  {
    id: "feed",
    label: "Load Instagram feed",
    sub: "Photo & video feed",
    icon: "sparkles",
    dbMs: 2100,
    cacheMs: 140,
  },
  {
    id: "ipl",
    label: "Refresh IPL tickets",
    sub: "Trending · final tickets",
    icon: "flame",
    dbMs: 2600,
    cacheMs: 160,
  },
];

/* ---------- Section 7: cache expiry stages ---------- */

export interface ExpiryStage {
  id: string;
  title: string;
  body: string;
  icon: IconName;
  tone: "fresh" | "stale" | "refresh";
}

export const EXPIRY_STAGES: ExpiryStage[] = [
  {
    id: "fresh",
    title: "Menu cached & fresh",
    body: "Burger Barn's menu is copied into the cache. Every user gets it instantly — and it's correct.",
    icon: "coffee",
    tone: "fresh",
  },
  {
    id: "changed",
    title: "Restaurant updates the menu",
    body: "Burger Barn removes a sold-out item. The database is now correct — but the cache still holds the old copy.",
    icon: "pencil",
    tone: "stale",
  },
  {
    id: "stale",
    title: "Users briefly see stale data",
    body: "For a short window, users still see the old menu. Fast, but temporarily out of date.",
    icon: "alert",
    tone: "stale",
  },
  {
    id: "refresh",
    title: "Cache expires & refreshes",
    body: "The cached copy times out, the next request refills it from the database, and everyone is back in sync.",
    icon: "refresh",
    tone: "refresh",
  },
];

/* ---------- Section 8: types of caching ---------- */

export interface CacheType {
  id: string;
  name: string;
  icon: IconName;
  analogy: string;
  example: string;
}

export const CACHE_TYPES: CacheType[] = [
  {
    id: "browser",
    name: "Browser cache",
    icon: "chrome",
    analogy: "Like keeping a photo saved on your own phone.",
    example:
      "After your first visit, the app's logo and images load instantly because your browser already has a copy.",
  },
  {
    id: "server",
    name: "Server cache",
    icon: "server",
    analogy: "Like a chef prepping popular dishes before the rush.",
    example:
      "QuickBite keeps the “restaurants near you” list ready on the backend, so it doesn't rebuild it for every user.",
  },
  {
    id: "cdn",
    name: "CDN cache",
    icon: "globe",
    analogy: "Like having a local store in every city instead of one warehouse.",
    example:
      "Netflix keeps videos and thumbnails on servers near you, so they stream fast wherever you are in the world.",
  },
];

/* ---------- Section 9: PM insight cards ---------- */

export const CACHE_INSIGHTS: InfoCardData[] = [
  {
    icon: "rocket",
    title: "Faster apps retain more users",
    body: "Speed is a feature. When screens load instantly, people stay longer and come back more — caching is one of the cheapest ways to buy that speed.",
  },
  {
    icon: "trendingDown",
    title: "Slow loading quietly kills engagement",
    body: "Every extra second of spinner loses users before they ever see your product. The drop-off is invisible in the UI but very visible in retention.",
  },
  {
    icon: "chart",
    title: "Caching lowers infrastructure cost",
    body: "A cache hit avoids a database query. Serving most traffic from cache means fewer servers and a smaller bill at the same scale.",
  },
  {
    icon: "click",
    title: "Performance affects conversion",
    body: "Checkout, search and feeds convert better when they're fast. Latency improvements often move revenue more than new features do.",
  },
  {
    icon: "gauge",
    title: "Scalability protects growth",
    body: "Traffic spikes — launches, finals, sales — break uncached apps. Caching is what lets the product survive its own success.",
  },
];

/* ---------- Section 10: analytics dashboard baseline ---------- */

export const ANALYTICS_BASELINE = {
  avgResponseMs: 180,
  cacheHitRate: 92,
  dbLoadReduction: 88,
  trafficHandled: 1_200_000,
  latencyImprovement: 11,
  failedRequestsAvoided: 47_500,
};

/* ---------- Section 11: scenario quiz ---------- */

export const CACHE_QUIZ = {
  scenario:
    "QuickBite becomes extremely slow during a cricket final because millions of users keep refreshing the same few restaurant pages, and every refresh hits the database again.",
  question: "What is the MOST likely solution?",
  options: [
    {
      id: "a",
      label: "Introduce caching for popular pages",
      correct: true,
      rationale:
        "The same data is being requested over and over. Caching serves those repeated requests from a fast nearby copy instead of querying the database each time — directly relieving the overload during the spike.",
    },
    {
      id: "b",
      label: "Increase the button size on the page",
      correct: false,
      rationale:
        "Bigger buttons are a UI tweak. They do nothing about millions of identical requests hammering the database — the actual cause of the slowdown.",
    },
    {
      id: "c",
      label: "Change the restaurant card colors",
      correct: false,
      rationale:
        "Visual styling has zero effect on how fast data is fetched. This is a load and performance problem, not a design one.",
    },
    {
      id: "d",
      label: "Remove the login system",
      correct: false,
      rationale:
        "Removing login hurts security and personalization and still leaves every request going to the database. It doesn't address the repeated-query bottleneck.",
    },
  ],
};

/* ---------- shared helpers ---------- */

/** Clamp a number to the 0–100 range (used by meters and bars). */
export function pct(n: number): number {
  return Math.max(0, Math.min(100, n));
}

/** Human-readable user count for the traffic slider. */
export function formatUsers(n: number): string {
  if (n >= 1_000_000) return `${n / 1_000_000}M`;
  if (n >= 1_000) return `${n / 1_000}K`;
  return `${n}`;
}
