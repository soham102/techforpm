"use client";

import { motion } from "framer-motion";
import { Star, Clock, MapPin, Leaf, Megaphone } from "lucide-react";
import type { Restaurant } from "@/lib/search";
import { cn } from "@/lib/utils";

/** Reusable restaurant result card, used across search-related sections. */
export function RestaurantCard({
  r,
  rank,
  score,
}: {
  r: Restaurant;
  rank?: number;
  score?: number;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", damping: 24, stiffness: 280 }}
      className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-soft"
    >
      {rank !== undefined && (
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand">
          {rank}
        </span>
      )}

      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 text-sm font-bold text-brand">
        {r.name.slice(0, 2).toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold">{r.name}</p>
          {r.sponsored && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-500 ring-1 ring-amber-500/30">
              <Megaphone className="h-3 w-3" />
              Sponsored
            </span>
          )}
          {r.veg && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500 ring-1 ring-emerald-500/30">
              <Leaf className="h-3 w-3" />
              Veg
            </span>
          )}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1 font-medium text-fg">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {r.rating.toFixed(1)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {r.deliveryMins} min
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {r.distanceKm} km
          </span>
          <span>{r.cuisine}</span>
          <span>₹{r.priceForTwo} for two</span>
        </div>
      </div>

      {score !== undefined && (
        <div className="shrink-0 text-right">
          <p className="text-[10px] uppercase tracking-wide text-muted">
            Score
          </p>
          <p
            className={cn(
              "text-lg font-bold tabular-nums",
              score >= 70
                ? "text-emerald-500"
                : score >= 45
                ? "text-amber-500"
                : "text-muted"
            )}
          >
            {score}
          </p>
        </div>
      )}
    </motion.div>
  );
}
