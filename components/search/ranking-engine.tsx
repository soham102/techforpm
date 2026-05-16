"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Megaphone, UserCheck, RotateCcw } from "lucide-react";
import {
  RESTAURANTS,
  DEFAULT_WEIGHTS,
  scoreRestaurant,
  type RankWeights,
} from "@/lib/search";
import { RestaurantCard } from "./restaurant-card";
import { cn } from "@/lib/utils";

const PIZZA = RESTAURANTS.filter((r) => r.cuisine === "Pizza");

/** Section 5 — tweak ranking factors and watch results reorder live. */
export function RankingEngine() {
  const [w, setW] = useState<RankWeights>({ ...DEFAULT_WEIGHTS });

  const ranked = [...PIZZA]
    .map((r) => ({ r, score: scoreRestaurant(r, w) }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      {/* controls */}
      <div className="space-y-5 rounded-2xl border border-border bg-surface p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Ranking factors</p>
          <button
            onClick={() => setW({ ...DEFAULT_WEIGHTS })}
            className="inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-fg"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        <Slider
          label="Rating weight"
          value={w.rating}
          onChange={(v) => setW({ ...w, rating: v })}
        />
        <Slider
          label="Delivery speed weight"
          value={w.speed}
          onChange={(v) => setW({ ...w, speed: v })}
        />
        <Slider
          label="Popularity weight"
          value={w.popularity}
          onChange={(v) => setW({ ...w, popularity: v })}
        />

        <Toggle
          icon={<Megaphone className="h-4 w-4" />}
          label="Sponsored boost"
          on={w.sponsoredBoost}
          onClick={() => setW({ ...w, sponsoredBoost: !w.sponsoredBoost })}
        />
        <Toggle
          icon={<UserCheck className="h-4 w-4" />}
          label="Personalize (user likes veg)"
          on={w.personalize}
          onClick={() => setW({ ...w, personalize: !w.personalize })}
        />

        <p className="rounded-lg bg-brand-soft px-3 py-2 text-[11px] leading-relaxed text-brand">
          Same restaurants, different order. Ranking decisions directly shape
          which business gets the order.
        </p>
      </div>

      {/* live results */}
      <div className="space-y-3">
        <p className="text-xs text-muted">
          Results for “Pizza” — reordering in real time
        </p>
        <AnimatePresence>
          {ranked.map(({ r, score }, i) => (
            <RestaurantCard key={r.id} r={r} rank={i + 1} score={score} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-muted">{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-[rgb(var(--brand))]"
      />
    </div>
  );
}

function Toggle({
  icon,
  label,
  on,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-xs font-medium transition-colors",
        on
          ? "border-brand/50 bg-brand-soft text-brand"
          : "border-border bg-bg text-muted"
      )}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span
        className={cn(
          "relative h-4 w-7 rounded-full transition-colors",
          on ? "bg-brand" : "bg-border"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all",
            on ? "left-3.5" : "left-0.5"
          )}
        />
      </span>
    </button>
  );
}
