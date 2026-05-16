import type { IconName } from "./icons";

export const APP_NAME = "QuickBite";

/* ---------- Section 1: store-assistant analogy ---------- */

export interface RecAnalogyPair {
  real: string;
  app: string;
  icon: IconName;
  plain: string;
}

export const REC_ANALOGY: RecAnalogyPair[] = [
  {
    real: "Customer browses the aisles",
    app: "User clicks & taps",
    icon: "click",
    plain:
      "Every click is a tiny hint about taste. The assistant isn't reading minds — it's watching behaviour.",
  },
  {
    real: "Assistant remembers past visits",
    app: "Watch / order history",
    icon: "loop",
    plain:
      "What you bought before is the strongest signal for what you'll want next.",
  },
  {
    real: "The assistant's intuition",
    app: "Recommendation engine",
    icon: "sparkles",
    plain:
      "It connects “people like you also liked…” to make a smart guess — like a friend who knows your taste.",
  },
  {
    real: "“You'll love this one”",
    app: "Personalized suggestions",
    icon: "heart",
    plain:
      "The payoff: a shortlist tuned to one person, so they engage more and decide faster.",
  },
];

/* ---------- Section 2: platform examples ---------- */

export interface PlatformExample {
  name: string;
  icon: IconName;
  accent: string; // tailwind text color
  signals: string[];
}

export const PLATFORMS: PlatformExample[] = [
  {
    name: "Netflix",
    icon: "film",
    accent: "text-rose-500",
    signals: ["Watch history", "Genres liked", "Watch duration", "Time of day"],
  },
  {
    name: "YouTube",
    icon: "click",
    accent: "text-red-500",
    signals: ["Clicked videos", "Watch time", "Subscriptions", "Skips"],
  },
  {
    name: "Spotify",
    icon: "music",
    accent: "text-emerald-500",
    signals: ["Listening habits", "Liked songs", "Skipped tracks", "Playlists"],
  },
  {
    name: "QuickBite",
    icon: "utensils",
    accent: "text-brand",
    signals: ["Previous orders", "Favourite cuisines", "Ordering time", "Location"],
  },
];

/* ---------- Section 3: behavior simulator ---------- */

export type Trait =
  | "spicy"
  | "budget"
  | "lateNight"
  | "healthy"
  | "comedy"
  | "action";

export interface BehaviorAction {
  id: string;
  label: string;
  icon: IconName;
  trait: Trait;
}

export const BEHAVIOR_ACTIONS: BehaviorAction[] = [
  { id: "a1", label: "Order spicy biryani", icon: "flame", trait: "spicy" },
  { id: "a2", label: "Pick a budget restaurant", icon: "tag", trait: "budget" },
  { id: "a3", label: "Order at 1 AM", icon: "clock", trait: "lateNight" },
  { id: "a4", label: "Search “healthy meals”", icon: "leaf", trait: "healthy" },
  { id: "a5", label: "Watch a comedy clip", icon: "film", trait: "comedy" },
  { id: "a6", label: "Like an action movie", icon: "thumbsUp", trait: "action" },
];

export const TRAIT_LABEL: Record<Trait, string> = {
  spicy: "Loves spicy food",
  budget: "Budget-conscious",
  lateNight: "Late-night orderer",
  healthy: "Health-focused",
  comedy: "Enjoys comedy",
  action: "Likes action",
};

/* ---------- Section 5: personalization feed ---------- */

export interface FeedItem {
  id: string;
  title: string;
  platform: "QuickBite" | "Netflix" | "YouTube" | "Spotify";
  kind: string;
  base: number; // baseline appeal 0-40
  tags: Trait[];
}

export const FEED: FeedItem[] = [
  { id: "f1", title: "Fiery Chicken Biryani", platform: "QuickBite", kind: "Restaurant", base: 20, tags: ["spicy"] },
  { id: "f2", title: "₹99 Combo Meals", platform: "QuickBite", kind: "Restaurant", base: 18, tags: ["budget"] },
  { id: "f3", title: "24×7 Midnight Diner", platform: "QuickBite", kind: "Restaurant", base: 16, tags: ["lateNight"] },
  { id: "f4", title: "Green Bowl Salads", platform: "QuickBite", kind: "Restaurant", base: 17, tags: ["healthy"] },
  { id: "f5", title: "Stand-up Specials", platform: "Netflix", kind: "Show", base: 19, tags: ["comedy"] },
  { id: "f6", title: "Action Blockbusters", platform: "Netflix", kind: "Show", base: 21, tags: ["action"] },
  { id: "f7", title: "Late Night Comedy Clips", platform: "YouTube", kind: "Video", base: 15, tags: ["comedy", "lateNight"] },
  { id: "f8", title: "Workout & Healthy Eating", platform: "YouTube", kind: "Video", base: 14, tags: ["healthy"] },
  { id: "f9", title: "Comedy Podcasts", platform: "Spotify", kind: "Podcast", base: 16, tags: ["comedy"] },
  { id: "f10", title: "High-Energy Action OSTs", platform: "Spotify", kind: "Playlist", base: 15, tags: ["action"] },
];

export const PERSONA_TOGGLES: { trait: Trait; label: string; icon: IconName }[] =
  [
    { trait: "spicy", label: "Likes spicy food", icon: "flame" },
    { trait: "lateNight", label: "Orders late at night", icon: "clock" },
    { trait: "budget", label: "Prefers budget options", icon: "tag" },
    { trait: "comedy", label: "Watches comedy", icon: "film" },
    { trait: "action", label: "Likes action", icon: "thumbsUp" },
    { trait: "healthy", label: "Eats healthy", icon: "leaf" },
  ];

/** Score a feed item against the active set of preference traits. */
export function scoreFeedItem(item: FeedItem, active: Set<Trait>): number {
  let score = item.base;
  let matches = 0;
  item.tags.forEach((t) => {
    if (active.has(t)) matches += 1;
  });
  score += matches * 30;
  const maxPossible = item.base + item.tags.length * 30;
  const confidence = Math.round((score / Math.max(1, maxPossible + 0)) * 100);
  return Math.min(99, active.size === 0 ? Math.round(item.base * 1.4) : confidence);
}

/* ---------- Section 8: failures ---------- */

export interface RecFailure {
  id: "irrelevant" | "bubble" | "viral";
  name: string;
  icon: IconName;
  insight: string;
}

export const REC_FAILURES: RecFailure[] = [
  {
    id: "irrelevant",
    name: "Irrelevant recs",
    icon: "thumbsDown",
    insight:
      "Poor personalization reduces trust — a vegetarian shown meat every day stops believing the feed is “for them”.",
  },
  {
    id: "bubble",
    name: "Filter bubble",
    icon: "loop",
    insight:
      "Over-personalization narrows discovery — if users only ever see one thing, novelty and long-term engagement drop.",
  },
  {
    id: "viral",
    name: "Viral domination",
    icon: "flame",
    insight:
      "Ranking decisions influence platform fairness — if only viral hits surface, great niche options never get discovered.",
  },
];

/* ---------- Section 9: PM insights ---------- */

export interface RecInsight {
  icon: IconName;
  title: string;
  body: string;
}

export const REC_INSIGHTS: RecInsight[] = [
  {
    icon: "sparkles",
    title: "Recommendations drive engagement",
    body: "A relevant feed is the difference between one tap and a long session. It's the engine of time-in-app.",
  },
  {
    icon: "heart",
    title: "Personalization improves retention",
    body: "When the app feels like it “gets” the user, they come back. Generic feeds churn; personal ones stick.",
  },
  {
    icon: "trendingDown",
    title: "Discovery drives revenue",
    body: "Most orders and watches come from recommendations, not search. Better discovery is more revenue per user.",
  },
  {
    icon: "star",
    title: "Ranking shapes behaviour",
    body: "Users mostly engage with the top few items. What you rank first quietly steers what the whole base does.",
  },
  {
    icon: "thumbsDown",
    title: "Bad recs erode trust fast",
    body: "A few wrong recommendations and users stop trusting the feed — and stop scrolling it. Trust is fragile.",
  },
];

/* ---------- Section 10: analytics ---------- */

export const REC_ANALYTICS = {
  baseline: {
    ctr: 38, // %
    watchMin: 42, // avg session minutes
    acceptance: 56, // % of recs acted on
    engagement: 71, // composite score
    accuracy: 83, // personalization accuracy %
    repeat: 64, // % repeat usage
  },
};

/* ---------- Section 11: quiz ---------- */

export const REC_QUIZ = {
  scenario:
    "QuickBite users increasingly scroll past the “Recommended for you” row and go straight to search instead.",
  question: "What is the MOST likely issue?",
  options: [
    {
      id: "a",
      label: "Recommendation relevance has degraded",
      correct: true,
      rationale:
        "Users abandoning the recommended row and self-serving via search is the classic signal that recs aren't matching intent — a relevance/personalization quality problem, and a measurable engagement risk.",
    },
    {
      id: "b",
      label: "Restaurant logos are too small",
      correct: false,
      rationale:
        "Logo size doesn't explain a systematic shift away from recommendations toward search.",
    },
    {
      id: "c",
      label: "Delivery drivers are offline",
      correct: false,
      rationale:
        "Driver availability affects fulfilment, not whether the recommended row is worth engaging with.",
    },
    {
      id: "d",
      label: "Password reset emails are delayed",
      correct: false,
      rationale:
        "Already-logged-in users ignoring recs has nothing to do with password email latency.",
    },
  ],
};
