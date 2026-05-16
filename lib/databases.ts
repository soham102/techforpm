import type { IconName } from "./icons";

export const APP_NAME = "QuickBite";

/* ---------- Section 1: warehouse analogy mapping ---------- */

export interface AnalogyPair {
  db: string;
  warehouse: string;
  icon: IconName;
  plain: string;
}

export const ANALOGY_PAIRS: AnalogyPair[] = [
  {
    db: "Database Table",
    warehouse: "A storage shelf",
    icon: "table",
    plain:
      "One shelf holds one kind of thing — a “Users” shelf, an “Orders” shelf. A table is just an organised list.",
  },
  {
    db: "Row",
    warehouse: "One box on the shelf",
    icon: "boxes",
    plain:
      "Each box is a single record — one customer, or one order. Add a customer, you add a box.",
  },
  {
    db: "Column",
    warehouse: "A label on the box",
    icon: "tag",
    plain:
      "Every box has the same labels: name, email, city. Columns keep every record consistent.",
  },
  {
    db: "Query",
    warehouse: "Searching for an item",
    icon: "search",
    plain:
      "“Find all orders that are still cooking.” A query is just asking the warehouse a question.",
  },
];

/* ---------- Section 2 & 3: tables ---------- */

export type TableId = "users" | "orders" | "restaurants" | "partners";

export interface TableMeta {
  id: TableId;
  name: string;
  icon: IconName;
  columns: string[];
  why: string;
  appUse: string;
  insight: string;
}

export const TABLES: Record<TableId, TableMeta> = {
  users: {
    id: "users",
    name: "Users",
    icon: "users",
    columns: ["id", "name", "email", "city", "joined"],
    why: "Every person who signs up needs a saved profile so they don't re-enter details each visit.",
    appUse:
      "Powers login, saved addresses, personalised restaurant suggestions and order history.",
    insight:
      "If user data is wrong or lost, people get logged out and abandon the app — trust evaporates fast.",
  },
  orders: {
    id: "orders",
    name: "Orders",
    icon: "receipt",
    columns: ["orderId", "customer", "items", "status", "eta"],
    why: "An order is the core transaction — it must survive app refreshes, crashes and handoffs.",
    appUse:
      "Drives live tracking, the restaurant dashboard, driver assignment and refunds.",
    insight:
      "If order data is inaccurate, customer trust drops — a wrong status is worse than a slow one.",
  },
  restaurants: {
    id: "restaurants",
    name: "Restaurants",
    icon: "store",
    columns: ["id", "name", "cuisine", "area", "rating"],
    why: "The catalog users browse. It changes constantly — menus, availability, hours.",
    appUse:
      "Feeds the home feed, search results, filters and the “open now” badge.",
    insight:
      "Stale restaurant data means users order from closed kitchens — guaranteed cancellations and refunds.",
  },
  partners: {
    id: "partners",
    name: "Delivery Partners",
    icon: "bike",
    columns: ["id", "name", "vehicle", "status", "rating"],
    why: "The app needs to know who is free, where they are, and how reliable they are.",
    appUse:
      "Used for driver assignment, live ETA calculation and rider payouts.",
    insight:
      "Bad partner availability data leads to long waits and cancelled orders during peak hours.",
  },
};

export type Row = Record<string, string>;

export const SEED_DATA: Record<TableId, Row[]> = {
  users: [
    { id: "U-1", name: "Rahul Sharma", email: "rahul@mail.com", city: "Bangalore", joined: "2024-11-02" },
    { id: "U-2", name: "Aisha Khan", email: "aisha@mail.com", city: "Mumbai", joined: "2025-01-18" },
    { id: "U-3", name: "Dev Mehta", email: "dev@mail.com", city: "Pune", joined: "2025-03-09" },
  ],
  orders: [
    { orderId: "ORD-4815", customer: "Rahul Sharma", items: "Cheeseburger Combo", status: "Preparing", eta: "28 min" },
    { orderId: "ORD-4816", customer: "Aisha Khan", items: "Margherita Pizza", status: "Out for Delivery", eta: "12 min" },
    { orderId: "ORD-4817", customer: "Dev Mehta", items: "Paneer Wrap", status: "Delivered", eta: "—" },
  ],
  restaurants: [
    { id: "R-1", name: "Burger Barn", cuisine: "Burgers", area: "Koramangala", rating: "4.5" },
    { id: "R-2", name: "Pizza Town", cuisine: "Pizza", area: "Indiranagar", rating: "4.7" },
    { id: "R-3", name: "Curry House", cuisine: "Indian", area: "HSR Layout", rating: "4.3" },
    { id: "R-4", name: "Pizza Central", cuisine: "Pizza", area: "Whitefield", rating: "4.1" },
  ],
  partners: [
    { id: "D-1", name: "Imran K.", vehicle: "Bike", status: "Available", rating: "4.8" },
    { id: "D-2", name: "Sunil R.", vehicle: "Scooter", status: "On Delivery", rating: "4.6" },
    { id: "D-3", name: "Maria F.", vehicle: "Bike", status: "Available", rating: "4.9" },
  ],
};

/* Predefined "next" row used by the guided INSERT scenario. */
export const NEW_USER_ROW: Row = {
  id: "U-4",
  name: "Priya Nair",
  email: "priya@mail.com",
  city: "Chennai",
  joined: "today",
};

/* ---------- Section 4: PM insight cards ---------- */

export interface DbInsight {
  icon: IconName;
  title: string;
  body: string;
}

export const DB_INSIGHTS: DbInsight[] = [
  {
    icon: "zap",
    title: "Slow databases slow the whole app",
    body: "Every screen waits on a query. A 50ms query feels instant; a 2s query makes the app feel broken — no frontend polish can hide it.",
  },
  {
    icon: "wrench",
    title: "Bad design blocks scaling",
    body: "A structure that works for 1,000 users can collapse at 1,000,000. Early data decisions quietly define how far you can grow.",
  },
  {
    icon: "chart",
    title: "Missing data kills analytics",
    body: "If it wasn't stored, you can't measure it. Untracked events mean blind product decisions later.",
  },
  {
    icon: "activity",
    title: "Real-time features need fast data",
    body: "Live tracking, ETAs and dashboards are only as fresh as the database behind them.",
  },
  {
    icon: "trendingDown",
    title: "Downtime is lost revenue",
    body: "If the database is down, the product is down. Minutes of outage during dinner rush = real money lost.",
  },
];

/* ---------- Section 5: quiz ---------- */

export const DB_QUIZ = {
  scenario:
    "QuickBite users complain that order tracking takes too long to load during dinner hours — the spinner spins for 6–8 seconds before the map appears.",
  question: "What is the most likely cause?",
  options: [
    {
      id: "a",
      label: "Database queries are slow under heavy dinner-time load",
      correct: true,
      rationale:
        "Peak hours mean far more reads/writes hitting the same tables. Without indexing, caching or scaling, queries queue up and tracking loads slowly — exactly the symptom described.",
    },
    {
      id: "b",
      label: "Delivery drivers are offline",
      correct: false,
      rationale:
        "Offline drivers would affect assignment and ETAs, not the loading speed of the tracking screen itself.",
    },
    {
      id: "c",
      label: "UI colors are incorrect",
      correct: false,
      rationale:
        "Visual styling has no effect on how long data takes to load. This is a performance problem, not a design one.",
    },
    {
      id: "d",
      label: "Restaurants are closed",
      correct: false,
      rationale:
        "Closed restaurants would block new orders, but existing orders would still track normally and quickly.",
    },
  ],
};
