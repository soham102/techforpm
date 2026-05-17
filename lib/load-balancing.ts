import type { IconName } from "./icons";
import type { InfoCardData } from "@/components/ui/info-card";

export const APP_NAME = "QuickBite";

/* ---------- Section 1: traffic-police analogy mapping ---------- */

export interface AnalogyPair {
  tech: string;
  real: string;
  icon: IconName;
  plain: string;
}

export const ANALOGY_PAIRS: AnalogyPair[] = [
  {
    tech: "User requests",
    real: "Vehicles arriving at the junction",
    icon: "users",
    plain:
      "Every tap, refresh and checkout is one more car heading toward the same intersection at the same time.",
  },
  {
    tech: "Servers",
    real: "The roads leaving the junction",
    icon: "server",
    plain:
      "Each road can carry only so many cars before it clogs. More roads means more cars move at once.",
  },
  {
    tech: "Load balancer",
    real: "The traffic police officer",
    icon: "scale",
    plain:
      "Stands at the junction and waves each car onto whichever road is most free — so no single road jams.",
  },
  {
    tech: "Server overload",
    real: "A traffic jam",
    icon: "alert",
    plain:
      "When every car is funneled onto one road, nothing moves. That stalled road is a crashed server.",
  },
];

/* ---------- Section 4: traffic-distribution playground ---------- */

/** The traffic tiers the playground / spike slider step through. */
export const TRAFFIC_STEPS = [100, 1_000, 10_000, 1_000_000] as const;

export type Strategy = "round-robin" | "least-busy" | "geographic";

export interface StrategyMeta {
  id: Strategy;
  name: string;
  icon: IconName;
  tagline: string;
  how: string;
  pmInsight: string;
}

export const STRATEGIES: StrategyMeta[] = [
  {
    id: "round-robin",
    name: "Round robin",
    icon: "loop",
    tagline: "Traffic shared evenly, one server after another",
    how: "Request 1 goes to Server 1, request 2 to Server 2, request 3 to Server 3 — then back to the start. Simple, predictable, fair.",
    pmInsight:
      "Simple and effective when every server is identical and traffic is steady. The default most products start with.",
  },
  {
    id: "least-busy",
    name: "Least-busy server",
    icon: "gauge",
    tagline: "Each request goes to whichever server is most free",
    how: "Before routing, the balancer checks who is least loaded and sends the request there — automatically steering traffic away from a struggling server.",
    pmInsight:
      "Improves performance when traffic is uneven or some requests are heavier than others. Smoother during spikes.",
  },
  {
    id: "geographic",
    name: "Geographic routing",
    icon: "globe",
    tagline: "Users are sent to the server nearest them",
    how: "A Mumbai user is routed to the Mumbai server, a Delhi user to the Delhi server. Shorter distance means a faster response.",
    pmInsight:
      "Closer servers mean lower latency. Essential once you have users across cities or countries.",
  },
];

/** A simulated server in the playground / failure / scaling views. */
export interface ServerState {
  id: string;
  name: string;
  region: string;
  /** 0–100 */
  cpu: number;
  activeRequests: number;
  responseMs: number;
  status: "healthy" | "stressed" | "down";
}

/* ---------- Section 5: strategy walkthrough rows ---------- */

export interface StrategyStep {
  request: string;
  routedTo: string;
  reason: string;
}

export const STRATEGY_WALKTHROUGH: Record<Strategy, StrategyStep[]> = {
  "round-robin": [
    { request: "Request 1", routedTo: "Server 1", reason: "Next in the rotation" },
    { request: "Request 2", routedTo: "Server 2", reason: "Next in the rotation" },
    { request: "Request 3", routedTo: "Server 3", reason: "Next in the rotation" },
    { request: "Request 4", routedTo: "Server 1", reason: "Rotation loops back" },
  ],
  "least-busy": [
    { request: "Request 1", routedTo: "Server 2", reason: "Server 2 is idle (0% busy)" },
    { request: "Request 2", routedTo: "Server 3", reason: "Server 3 now the most free" },
    { request: "Request 3", routedTo: "Server 1", reason: "Server 1 freed up, others busy" },
    { request: "Request 4", routedTo: "Server 2", reason: "Server 2 finished, free again" },
  ],
  geographic: [
    { request: "Mumbai user", routedTo: "Mumbai server", reason: "Closest — lowest latency" },
    { request: "Delhi user", routedTo: "Delhi server", reason: "Closest — lowest latency" },
    { request: "Bengaluru user", routedTo: "Bengaluru server", reason: "Closest — lowest latency" },
    { request: "Mumbai user", routedTo: "Mumbai server", reason: "Stays on the nearest region" },
  ],
};

/* ---------- Section 8: real product examples ---------- */

export interface ProductExample {
  id: string;
  name: string;
  icon: IconName;
  trigger: string;
  without: string;
  withLb: string;
  peakTraffic: string;
}

export const PRODUCT_EXAMPLES: ProductExample[] = [
  {
    id: "ipl",
    name: "IPL ticket booking",
    icon: "flame",
    trigger: "Final tickets go live — millions hit refresh in the same second.",
    without:
      "Every request piles onto one server. It maxes out, response times explode, and the booking page crashes for everyone.",
    withLb:
      "Traffic is spread across many servers and new ones spin up automatically. The queue stays orderly and bookings keep flowing.",
    peakTraffic: "~3M concurrent",
  },
  {
    id: "blinkit",
    name: "Blinkit flash sale",
    icon: "rocket",
    trigger: "A sale drops at 5 PM and demand spikes 20× in minutes.",
    without:
      "The sudden surge overwhelms a single server before it can react. Carts fail and the sale stalls.",
    withLb:
      "The balancer distributes the surge evenly and auto-scaling adds capacity, so the sale runs smoothly through the peak.",
    peakTraffic: "20× normal load",
  },
  {
    id: "swiggy",
    name: "Swiggy dinner rush",
    icon: "utensils",
    trigger: "Every evening 7–10 PM, orders climb sharply and predictably.",
    without:
      "Servers sized for daytime traffic choke during the rush, and the app slows to a crawl at the worst possible time.",
    withLb:
      "Capacity scales up for the dinner window and back down afterward — fast app at peak, lower cost off-peak.",
    peakTraffic: "5× daytime load",
  },
  {
    id: "netflix",
    name: "Netflix live event",
    icon: "film",
    trigger: "A live finale streams to viewers across the world at once.",
    without:
      "One region's servers can't carry global concurrent streams — buffering and dropouts everywhere.",
    withLb:
      "Traffic is balanced globally and each viewer is routed to the nearest servers, so streams stay smooth worldwide.",
    peakTraffic: "Global concurrent",
  },
];

/* ---------- Section 9: PM insight cards ---------- */

export const LB_INSIGHTS: InfoCardData[] = [
  {
    icon: "trendingDown",
    title: "Downtime directly costs revenue",
    body: "Every minute the app is down during a launch or sale is money not collected and users sent to a competitor. Load balancing is insurance on your biggest revenue moments.",
  },
  {
    icon: "gauge",
    title: "Traffic spikes are a reliability test",
    body: "Your highest-traffic moment is usually your highest-stakes one — a final, a sale, a campaign. That's exactly when an unbalanced system fails. Plan for the peak, not the average.",
  },
  {
    icon: "rocket",
    title: "Scalability protects growth",
    body: "Growth is good news that can break the product. The ability to add capacity on demand means success doesn't take you offline.",
  },
  {
    icon: "click",
    title: "Faster apps retain more users",
    body: "Routing users to the least-busy or nearest server keeps responses fast under load. Speed at peak is a retention lever, not just an engineering metric.",
  },
  {
    icon: "chart",
    title: "Infrastructure planning enables expansion",
    body: "Launching in a new city or country is partly an infrastructure decision. Knowing how traffic distributes lets you say yes to expansion with confidence.",
  },
];

/* ---------- Section 10: analytics dashboard baseline ---------- */

export const ANALYTICS_BASELINE = {
  activeUsers: 842_000,
  throughputRps: 38_500,
  avgServerUtil: 61,
  avgResponseMs: 210,
  failedRequests: 0.04, // percent
  uptimePct: 99.98,
  serversOnline: 6,
};

/* ---------- Section 11: scenario quiz ---------- */

export const LB_QUIZ = {
  scenario:
    "QuickBite crashes almost every Friday night. Orders are fine all week, but when dinner traffic spikes between 8 and 10 PM, the app slows to a crawl and then goes down — all running on a single server.",
  question: "What is the MOST likely infrastructure improvement needed?",
  options: [
    {
      id: "a",
      label: "Add a load balancer and more servers",
      correct: true,
      rationale:
        "The failure happens only at peak traffic on a single server — the classic overload pattern. A load balancer spreads the dinner rush across multiple servers (and lets capacity scale up), so no single machine gets overwhelmed.",
    },
    {
      id: "b",
      label: "Increase the font size on the menu",
      correct: false,
      rationale:
        "Typography has no effect on how many requests a server can handle. The app is going down from traffic load, not a readability issue.",
    },
    {
      id: "c",
      label: "Redesign the app logo",
      correct: false,
      rationale:
        "A visual refresh does nothing about the server being overwhelmed at 8 PM. This is a capacity and reliability problem, not a branding one.",
    },
    {
      id: "d",
      label: "Remove the login system",
      correct: false,
      rationale:
        "Removing authentication hurts security and barely changes load. Every request would still hit the same single server during the rush.",
    },
  ],
};

/* ---------- shared helpers ---------- */

/** Clamp a number to the 0–100 range (used by meters and bars). */
export function pct(n: number): number {
  return Math.max(0, Math.min(100, n));
}

/** Human-readable user / request count. */
export function formatUsers(n: number): string {
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000)
    return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`;
  return `${Math.round(n)}`;
}

/** Make a fresh, healthy fleet of `count` servers. */
export function makeFleet(count: number): ServerState[] {
  const regions = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Pune", "Chennai"];
  return Array.from({ length: count }, (_, i) => ({
    id: `s${i + 1}`,
    name: `Server ${i + 1}`,
    region: regions[i % regions.length],
    cpu: 6,
    activeRequests: 0,
    responseMs: 90,
    status: "healthy" as const,
  }));
}

/**
 * Core model: given a traffic level and the live fleet + strategy, return
 * the new fleet state plus headline metrics. Beginner-friendly, not a real
 * queueing model — tuned so the visuals tell the right story.
 */
export function distribute(
  traffic: number,
  fleet: ServerState[],
  strategy: Strategy
): {
  fleet: ServerState[];
  failedPct: number;
  avgResponseMs: number;
} {
  const live = fleet.filter((s) => s.status !== "down");
  if (live.length === 0) {
    // Total outage — every request fails.
    return {
      fleet: fleet.map((s) => ({ ...s, cpu: 0, activeRequests: 0 })),
      failedPct: 100,
      avgResponseMs: 0,
    };
  }

  const tier = TRAFFIC_STEPS.indexOf(traffic as (typeof TRAFFIC_STEPS)[number]);
  const sharePerServer = traffic / live.length;

  // Geographic & least-busy keep utilisation a little lower / smoother.
  const efficiency =
    strategy === "least-busy" ? 0.82 : strategy === "geographic" ? 0.88 : 1;

  // A square-root load curve. The traffic tiers span 100 → 1,000,000 (a
  // 10,000× range); sqrt compresses that so CPU stays in a readable band
  // and — crucially — every server you add visibly drops the bar instead
  // of every option pegging at 100%. Tuned so 1M on 1 server is a
  // catastrophe and ~6 servers brings it back to healthy.
  const LOAD_K = 0.115;

  const next = fleet.map((s) => {
    if (s.status === "down") {
      return { ...s, cpu: 0, activeRequests: 0, responseMs: 0 };
    }

    const cpu = pct(8 + Math.sqrt(sharePerServer) * LOAD_K * efficiency);
    const status: ServerState["status"] = cpu >= 92 ? "stressed" : "healthy";
    const loadFrac = cpu / 100;
    const responseMs = Math.round(
      90 + loadFrac * loadFrac * 2400 + (status === "stressed" ? 1200 : 0)
    );

    return {
      ...s,
      cpu: Math.round(cpu),
      activeRequests: Math.round(sharePerServer),
      responseMs,
      status,
    };
  });

  const stressed = next.filter((s) => s.status === "stressed").length;
  // Requests start failing only once servers are genuinely overwhelmed.
  const overloadPenalty =
    stressed > 0 ? (stressed / live.length) * (tier >= 3 ? 38 : 14) : 0;
  const failedPct = Math.round(Math.min(70, overloadPenalty) * 10) / 10;

  const avgResponseMs = Math.round(
    next
      .filter((s) => s.status !== "down")
      .reduce((a, s) => a + s.responseMs, 0) / live.length
  );

  return { fleet: next, failedPct, avgResponseMs };
}
