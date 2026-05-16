"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ModuleStep {
  id: string;
  label: string;
}

/**
 * Sticky in-page navigation with scroll-spy + a reading-progress bar.
 * Tracks which section is on screen via IntersectionObserver.
 */
export function ModuleSidebar({ steps }: { steps: ModuleStep[] }) {
  const [activeId, setActiveId] = useState(steps[0]?.id);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    steps.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [steps]);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
      setProgress(Math.min(1, Math.max(0, scrolled)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeIndex = steps.findIndex((s) => s.id === activeId);

  return (
    <aside className="sticky top-24 hidden h-fit w-60 shrink-0 lg:block">
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs font-medium text-muted">
          <span>Progress</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
          <motion.div
            className="h-full rounded-full bg-brand"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>

      <nav className="space-y-1">
        {steps.map((step, i) => {
          const active = step.id === activeId;
          const done = i < activeIndex;
          return (
            <a
              key={step.id}
              href={`#${step.id}`}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-brand-soft font-medium text-brand"
                  : "text-muted hover:bg-surface hover:text-fg"
              )}
            >
              <span
                className={cn(
                  "grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] font-semibold transition-colors",
                  active
                    ? "border-brand bg-brand text-white"
                    : done
                    ? "border-brand/40 bg-brand-soft text-brand"
                    : "border-border text-muted"
                )}
              >
                {i + 1}
              </span>
              {step.label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
