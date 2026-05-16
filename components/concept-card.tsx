"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Lock } from "lucide-react";
import type { Concept } from "@/lib/concepts";
import { getIcon } from "@/lib/icons";
import { DifficultyBadge } from "./ui/badge";
import { cn } from "@/lib/utils";

/** Reusable concept card used on the homepage grid. */
export function ConceptCard({
  concept,
  index = 0,
}: {
  concept: Concept;
  index?: number;
}) {
  const Icon = getIcon(concept.icon);
  const { available } = concept;

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
      whileHover={available ? { y: -6 } : undefined}
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-soft transition-shadow",
        available
          ? "hover:border-brand/40 hover:shadow-soft-lg"
          : "opacity-70"
      )}
    >
      <div className="flex items-start justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-5 w-5" />
        </span>
        <DifficultyBadge level={concept.difficulty} />
      </div>

      <h3 className="mt-5 text-lg font-semibold tracking-tight">
        {concept.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {concept.description}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-4 text-sm">
        <span className="inline-flex items-center gap-1.5 text-muted">
          <Clock className="h-4 w-4" />
          {concept.minutes} min
        </span>
        {available ? (
          <span className="inline-flex items-center gap-1 font-medium text-brand">
            Start
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-muted">
            <Lock className="h-3.5 w-3.5" />
            Soon
          </span>
        )}
      </div>
    </motion.div>
  );

  if (!available) return card;

  return (
    <Link href={`/${concept.slug}`} className="block h-full">
      {card}
    </Link>
  );
}
