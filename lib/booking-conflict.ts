import type { IconName } from "./icons";
import type { InfoCardData } from "@/components/ui/info-card";

export interface Customer {
  id: "A" | "B" | "C";
  name: string;
  avatar: string;
  city: string;
  device: string;
  /** Simulated request arrival time in ms — deterministic ordering. */
  arrivalMs: number;
  /** Time taken to complete payment (ms). */
  paymentMs: number;
  accent: "rose" | "amber" | "sky";
}

export const CUSTOMERS: Customer[] = [
  {
    id: "A",
    name: "Aanya",
    avatar: "🧑‍💼",
    city: "Bengaluru",
    device: "iPhone · 4G",
    arrivalMs: 0,
    paymentMs: 1400,
    accent: "rose",
  },
  {
    id: "B",
    name: "Bilal",
    avatar: "👨‍🦱",
    city: "Mumbai",
    device: "Android · Wi-Fi",
    arrivalMs: 90,
    paymentMs: 900,
    accent: "amber",
  },
  {
    id: "C",
    name: "Chitra",
    avatar: "🧕",
    city: "Delhi",
    device: "iPhone · Wi-Fi",
    arrivalMs: 180,
    paymentMs: 1100,
    accent: "sky",
  },
];

export type BookingStage =
  | "idle"
  | "requested"
  | "queued"
  | "lock-acquired"
  | "payment-processing"
  | "payment-failed"
  | "confirmed"
  | "rejected"
  | "ai-recommended";

export interface StageMeta {
  label: string;
  tone: "neutral" | "brand" | "amber" | "rose" | "emerald" | "sky";
  icon: IconName;
}

export const STAGE_META: Record<BookingStage, StageMeta> = {
  idle: { label: "Idle", tone: "neutral", icon: "user" },
  requested: { label: "Entering payment flow", tone: "brand", icon: "click" },
  queued: { label: "Waiting on slot", tone: "amber", icon: "hourglass" },
  "lock-acquired": { label: "Slot locked", tone: "brand", icon: "lock" },
  "payment-processing": { label: "Payment processing", tone: "amber", icon: "card" },
  "payment-failed": { label: "Payment timed out", tone: "rose", icon: "alert" },
  confirmed: { label: "Booking confirmed", tone: "emerald", icon: "badge" },
  rejected: { label: "Slot unavailable", tone: "rose", icon: "lockOpen" },
  "ai-recommended": { label: "AI alternative offered", tone: "sky", icon: "sparkles" },
};

export const TONE_CLASSES: Record<
  StageMeta["tone"],
  { ring: string; bg: string; text: string; dot: string }
> = {
  neutral: {
    ring: "ring-border",
    bg: "bg-surface",
    text: "text-muted",
    dot: "bg-muted",
  },
  brand: {
    ring: "ring-brand/40",
    bg: "bg-brand-soft",
    text: "text-brand",
    dot: "bg-brand",
  },
  amber: {
    ring: "ring-amber-500/40",
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    dot: "bg-amber-500",
  },
  rose: {
    ring: "ring-rose-500/40",
    bg: "bg-rose-500/10",
    text: "text-rose-500",
    dot: "bg-rose-500",
  },
  emerald: {
    ring: "ring-emerald-500/40",
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    dot: "bg-emerald-500",
  },
  sky: {
    ring: "ring-sky-500/40",
    bg: "bg-sky-500/10",
    text: "text-sky-500",
    dot: "bg-sky-500",
  },
};

export const ACCENT_CLASSES: Record<
  Customer["accent"],
  { border: string; ring: string; text: string; bgSoft: string }
> = {
  rose: {
    border: "border-rose-500/40",
    ring: "ring-rose-500/30",
    text: "text-rose-500",
    bgSoft: "bg-rose-500/10",
  },
  amber: {
    border: "border-amber-500/40",
    ring: "ring-amber-500/30",
    text: "text-amber-500",
    bgSoft: "bg-amber-500/10",
  },
  sky: {
    border: "border-sky-500/40",
    ring: "ring-sky-500/30",
    text: "text-sky-500",
    bgSoft: "bg-sky-500/10",
  },
};

export interface AISuggestion {
  id: string;
  title: string;
  body: string;
  icon: IconName;
  badge: string;
}

export const AI_SUGGESTIONS: AISuggestion[] = [
  {
    id: "alt-slot",
    title: "Suggest alternate slots",
    body: "Same provider, two slots later today — both with high availability and no surge pricing.",
    icon: "clock",
    badge: "Alt slot",
  },
  {
    id: "nearby",
    title: "Suggest nearby providers",
    body: "Three verified providers within 2 km can take this exact time slot. Ratings ≥ 4.7.",
    icon: "mapPin",
    badge: "Nearby",
  },
  {
    id: "empathy",
    title: "Generate empathetic messaging",
    body: "“Sorry Aanya — that slot was just booked. Here are two equally great options we’ve held for 90 seconds.”",
    icon: "heart",
    badge: "Copy",
  },
];

export const TRADEOFFS: InfoCardData[] = [
  {
    icon: "shield",
    title: "Trust vs Conversion",
    body: "Aggressive holds boost conversion but if a held slot fails to confirm, trust collapses. PMs tune lock TTL to keep both alive.",
  },
  {
    icon: "scale",
    title: "Fairness vs Speed",
    body: "First-come-first-served is fair but punishes slow networks. Speed-optimised systems win conversion but bias against weaker connections.",
  },
  {
    icon: "sparkles",
    title: "Simplicity vs Optimization",
    body: "A single Redis lock is simple and predictable. Multi-region locks, waitlists and AI nudges optimise more — at a cost in operational surface area.",
  },
];

export const ARCH_FLOW = [
  {
    id: "frontend",
    label: "Frontend",
    icon: "phone" as IconName,
    detail: {
      title: "Frontend",
      body: "Three customers tap Book at nearly the same instant. The client only knows what it can see — it cannot decide who wins.",
    },
  },
  {
    id: "api",
    label: "Booking API",
    icon: "server" as IconName,
    detail: {
      title: "Booking API",
      body: "Serialises competing requests into a single ordered queue and asks the lock service for slot ownership.",
    },
  },
  {
    id: "lock",
    label: "Redis Lock",
    icon: "lock" as IconName,
    accent: "brand" as const,
    detail: {
      title: "Redis Lock (deterministic)",
      body: "Atomic SETNX with a TTL — exactly one writer wins. This is the source of truth. AI never touches it.",
    },
  },
  {
    id: "payment",
    label: "Payment Gateway",
    icon: "card" as IconName,
    detail: {
      title: "Payment Gateway",
      body: "The winner gets ~60 seconds to pay. If payment fails or times out, the lock releases — the next waiter is offered the slot.",
    },
  },
  {
    id: "db",
    label: "Database Confirmation",
    icon: "database" as IconName,
    detail: {
      title: "Database Confirmation",
      body: "Only after the payment is captured does the booking row land in the DB. Now the slot is permanent.",
    },
  },
];
