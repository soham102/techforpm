import { cn } from "@/lib/utils";
import type { Difficulty } from "@/lib/concepts";

const styles: Record<Difficulty, string> = {
  Beginner:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
  Intermediate:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20",
  Advanced: "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/20",
};

export function DifficultyBadge({ level }: { level: Difficulty }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        styles[level]
      )}
    >
      {level}
    </span>
  );
}
