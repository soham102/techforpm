import type { IconName } from "./icons";

export const APP_NAME = "QuickBite";

/* ---------- Section 1: directory analogy ---------- */

export interface SearchAnalogyPair {
  real: string;
  app: string;
  icon: IconName;
  plain: string;
}

export const SEARCH_ANALOGY: SearchAnalogyPair[] = [
  {
    real: "Asking the host for food",
    app: "Search bar",
    icon: "search",
    plain:
      "The user says what they want in their own words. The whole system exists to answer that one question well.",
  },
  {
    real: "The restaurant directory",
    app: "Search index",
    icon: "bookOpen",
    plain:
      "A pre-organised catalog of every restaurant, built so the system can find matches instantly instead of reading the whole list.",
  },
  {
    real: "“Our best recommendations”",
    app: "Ranking engine",
    icon: "star",
    plain:
      "Of all the matches, which to show first — based on rating, speed, popularity and relevance.",
  },
  {
    real: "“Only veg, under 30 mins”",
    app: "Filters",
    icon: "filter",
    plain:
      "Lets the user narrow a big list down to exactly what fits their need right now.",
  },
  {
    real: "Understanding a mumbled order",
    app: "Typo correction",
    icon: "spellcheck",
    plain:
      "“You said piza — did you mean pizza?” The system forgives mistakes so users still find what they meant.",
  },
];

/* ---------- shared restaurant dataset ---------- */

export type Cuisine = "Pizza" | "Burger" | "Biryani" | "Sushi";

export interface Restaurant {
  id: string;
  name: string;
  cuisine: Cuisine;
  rating: number; // 0-5
  deliveryMins: number;
  popularity: number; // 0-100
  priceForTwo: number; // ₹
  veg: boolean;
  sponsored: boolean;
  distanceKm: number;
}

export const RESTAURANTS: Restaurant[] = [
  { id: "r1", name: "Pizza Town", cuisine: "Pizza", rating: 4.7, deliveryMins: 25, popularity: 92, priceForTwo: 500, veg: true, sponsored: false, distanceKm: 1.2 },
  { id: "r2", name: "Crust & Co.", cuisine: "Pizza", rating: 4.3, deliveryMins: 38, popularity: 70, priceForTwo: 650, veg: false, sponsored: true, distanceKm: 3.4 },
  { id: "r3", name: "Slice Theory", cuisine: "Pizza", rating: 4.5, deliveryMins: 29, popularity: 81, priceForTwo: 450, veg: true, sponsored: false, distanceKm: 2.1 },
  { id: "r4", name: "Burger Barn", cuisine: "Burger", rating: 4.5, deliveryMins: 22, popularity: 88, priceForTwo: 400, veg: false, sponsored: false, distanceKm: 0.9 },
  { id: "r5", name: "Patty Palace", cuisine: "Burger", rating: 4.1, deliveryMins: 34, popularity: 64, priceForTwo: 350, veg: true, sponsored: true, distanceKm: 2.8 },
  { id: "r6", name: "Biryani House", cuisine: "Biryani", rating: 4.6, deliveryMins: 31, popularity: 90, priceForTwo: 550, veg: false, sponsored: false, distanceKm: 1.7 },
  { id: "r7", name: "Dum Darbar", cuisine: "Biryani", rating: 4.2, deliveryMins: 27, popularity: 73, priceForTwo: 480, veg: true, sponsored: false, distanceKm: 3.0 },
  { id: "r8", name: "Sushi Spot", cuisine: "Sushi", rating: 4.8, deliveryMins: 40, popularity: 76, priceForTwo: 900, veg: false, sponsored: false, distanceKm: 4.2 },
  { id: "r9", name: "Roll & Rice", cuisine: "Sushi", rating: 4.4, deliveryMins: 33, popularity: 60, priceForTwo: 800, veg: true, sponsored: true, distanceKm: 3.6 },
];

export const QUERIES: { term: string; cuisine: Cuisine }[] = [
  { term: "Pizza", cuisine: "Pizza" },
  { term: "Burger", cuisine: "Burger" },
  { term: "Biryani", cuisine: "Biryani" },
  { term: "Sushi", cuisine: "Sushi" },
];

export const TRENDING = ["Pizza", "Biryani", "Burger", "Sushi"];

/* ---------- ranking weights ---------- */

export interface RankWeights {
  rating: number; // 0-100
  speed: number; // 0-100
  popularity: number; // 0-100
  sponsoredBoost: boolean;
  personalize: boolean; // favours veg (mock "user likes veg")
}

export const DEFAULT_WEIGHTS: RankWeights = {
  rating: 60,
  speed: 50,
  popularity: 40,
  sponsoredBoost: true,
  personalize: false,
};

/** Returns a 0-100 relevance score for a restaurant under given weights. */
export function scoreRestaurant(r: Restaurant, w: RankWeights): number {
  const ratingScore = (r.rating / 5) * w.rating;
  const speedScore = ((60 - Math.min(60, r.deliveryMins)) / 60) * w.speed;
  const popScore = (r.popularity / 100) * w.popularity;
  let score = ratingScore + speedScore + popScore;
  if (w.sponsoredBoost && r.sponsored) score += 25;
  if (w.personalize && r.veg) score += 20;
  const max = w.rating + w.speed + w.popularity + 45;
  return Math.round((score / Math.max(1, max)) * 100);
}

/* ---------- typo correction ---------- */

export const TYPOS: Record<
  string,
  { correct: string; confidence: number }
> = {
  piza: { correct: "Pizza", confidence: 96 },
  pizaa: { correct: "Pizza", confidence: 91 },
  burgr: { correct: "Burger", confidence: 94 },
  burgar: { correct: "Burger", confidence: 89 },
  biryanii: { correct: "Biryani", confidence: 93 },
  biriyani: { correct: "Biryani", confidence: 90 },
  suchi: { correct: "Sushi", confidence: 88 },
  sushii: { correct: "Sushi", confidence: 95 },
};

/* ---------- filters & sorts ---------- */

export type FilterId =
  | "fast"
  | "topRated"
  | "veg"
  | "priceLowHigh"
  | "nearest";

export const FILTERS: { id: FilterId; label: string; icon: IconName }[] = [
  { id: "fast", label: "Fast Delivery", icon: "zap" },
  { id: "topRated", label: "Top Rated", icon: "star" },
  { id: "veg", label: "Veg Only", icon: "leaf" },
  { id: "priceLowHigh", label: "Price: Low to High", icon: "sort" },
  { id: "nearest", label: "Nearest First", icon: "mapPin" },
];

/* ---------- Section 8: failures ---------- */

export interface SearchFailure {
  id: "slow" | "irrelevant" | "empty";
  name: string;
  icon: IconName;
  insight: string;
}

export const SEARCH_FAILURES: SearchFailure[] = [
  {
    id: "slow",
    name: "Slow search",
    icon: "clock",
    insight:
      "Slow search increases drop-offs — every second of spinner is users deciding to give up and close the app.",
  },
  {
    id: "irrelevant",
    name: "Irrelevant results",
    icon: "alert",
    insight:
      "Poor relevance reduces trust — if “Pizza” returns sushi, users stop trusting search and stop using it.",
  },
  {
    id: "empty",
    name: "No results found",
    icon: "search",
    insight:
      "Good empty states improve retention — a dead end loses the user; smart fallbacks keep them ordering.",
  },
];

/* ---------- Section 9: PM insights ---------- */

export interface SearchInsight {
  icon: IconName;
  title: string;
  body: string;
}

export const SEARCH_INSIGHTS: SearchInsight[] = [
  {
    icon: "trendingDown",
    title: "Search quality drives conversion",
    body: "Search is the highest-intent surface in the app. A user who searches wants to buy — bad results turn intent into a bounce.",
  },
  {
    icon: "zap",
    title: "Speed protects retention",
    body: "Search latency is felt instantly. Consistently fast results keep users browsing; slow ones train them to leave.",
  },
  {
    icon: "star",
    title: "Ranking shapes the business",
    body: "What ranks first gets the orders. Ranking is a product and commercial lever, not just an algorithm.",
  },
  {
    icon: "filter",
    title: "Discovery influences revenue",
    body: "Filters and sorting help users find what fits — better discovery means more completed orders per session.",
  },
  {
    icon: "users",
    title: "Personalization boosts engagement",
    body: "Results tuned to a user's habits feel effortless and bring them back more often.",
  },
];

/* ---------- Section 10: analytics ---------- */

export const ANALYTICS = {
  topSearches: [
    { term: "Pizza", share: 34 },
    { term: "Biryani", share: 27 },
    { term: "Burger", share: 21 },
    { term: "Sushi", share: 9 },
  ],
  noResultQueries: ["vegan ramen", "gluten-free pizza", "midnight thali"],
  baseline: {
    successRate: 92, // %
    latencyMs: 180,
    ctr: 61, // %
    conversion: 24, // %
  },
};

/* ---------- Section 11: quiz ---------- */

export const SEARCH_QUIZ = {
  scenario:
    "QuickBite users search for “Pizza” very frequently, but most of them leave without placing an order.",
  question: "What is the MOST likely issue?",
  options: [
    {
      id: "a",
      label: "Search ranking / relevance quality is poor",
      correct: true,
      rationale:
        "High search volume with low conversion is the classic signature of bad ranking — users find the query but the results aren't compelling or relevant, so they bounce. That's a search-quality problem.",
    },
    {
      id: "b",
      label: "Restaurant logos are too colorful",
      correct: false,
      rationale:
        "Visual styling doesn't explain why high-intent searchers consistently fail to convert.",
    },
    {
      id: "c",
      label: "Delivery drivers are offline",
      correct: false,
      rationale:
        "Driver availability affects fulfilment, not whether search results convince users to order.",
    },
    {
      id: "d",
      label: "The login button is too small",
      correct: false,
      rationale:
        "These users are already in the app searching — a login button size wouldn't cause this drop-off pattern.",
    },
  ],
};
