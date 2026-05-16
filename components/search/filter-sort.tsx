"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { RESTAURANTS, FILTERS, type FilterId } from "@/lib/search";
import { getIcon } from "@/lib/icons";
import { RestaurantCard } from "./restaurant-card";
import { cn } from "@/lib/utils";

/** Section 7 — additive filters + sorts that re-shape results live. */
export function FilterSort() {
  const [active, setActive] = useState<Set<FilterId>>(new Set());

  function toggle(id: FilterId) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        // price + nearest are sorts — only one sort at a time
        if (id === "priceLowHigh") next.delete("nearest");
        if (id === "nearest") next.delete("priceLowHigh");
        next.add(id);
      }
      return next;
    });
  }

  let list = [...RESTAURANTS];
  if (active.has("fast")) list = list.filter((r) => r.deliveryMins < 30);
  if (active.has("topRated")) list = list.filter((r) => r.rating >= 4.5);
  if (active.has("veg")) list = list.filter((r) => r.veg);
  if (active.has("priceLowHigh"))
    list = list.sort((a, b) => a.priceForTwo - b.priceForTwo);
  else if (active.has("nearest"))
    list = list.sort((a, b) => a.distanceKm - b.distanceKm);
  else list = list.sort((a, b) => b.rating - a.rating);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const Icon = getIcon(f.icon);
          const on = active.has(f.id);
          return (
            <button
              key={f.id}
              onClick={() => toggle(f.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                on
                  ? "border-brand/50 bg-brand-soft text-brand"
                  : "border-border bg-bg text-muted hover:text-fg"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {f.label}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-muted">
        {list.length} of {RESTAURANTS.length} restaurants match —{" "}
        {active.size === 0
          ? "no filters applied"
          : "filtering & re-sorting live"}
      </p>

      <div className="mt-3 space-y-3">
        <AnimatePresence>
          {list.map((r) => (
            <RestaurantCard key={r.id} r={r} />
          ))}
        </AnimatePresence>
        {list.length === 0 && (
          <p className="rounded-xl border border-dashed border-border bg-bg px-4 py-6 text-center text-sm text-muted">
            No restaurants match every filter — too many constraints is its own
            kind of bad discovery.
          </p>
        )}
      </div>

      <p className="mt-4 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">PM insight: </span>
        better discovery improves conversion — filters turn a long list into
        the few options a user will actually order from.
      </p>
    </div>
  );
}
