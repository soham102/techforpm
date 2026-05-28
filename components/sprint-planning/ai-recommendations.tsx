"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Brain, AlertTriangle, Lightbulb, CheckCircle2, XCircle, ShieldAlert } from "lucide-react";
import type { BacklogItem, ChaosEvent } from "./types";

interface Recommendation {
  id: string;
  type: "warning" | "info" | "danger" | "tip";
  message: string;
  detail?: string;
}

function buildRecommendations(
  items: BacklogItem[],
  sprintPoints: number,
  totalCapacity: number,
  dependencyViolations: BacklogItem[],
  activeChaos: ChaosEvent[],
  healthScore: number,
): Recommendation[] {
  const recs: Recommendation[] = [];
  const sprint = items.filter(i => i.column === "sprint");
  const backendCount = sprint.filter(i => i.category === "Backend").length;
  const qaCount = sprint.filter(i => i.category === "QA").length;

  if (sprintPoints === 0) {
    recs.push({
      id: "empty",
      type: "info",
      message: "Sprint board is empty.",
      detail: "Start by dragging backlog items into the 'Selected for Sprint' column. Try adding high-priority items first.",
    });
    return recs;
  }

  if (sprintPoints > totalCapacity) {
    recs.push({
      id: "overcommit",
      type: "danger",
      message: `Sprint overcommitted by ${sprintPoints - totalCapacity} story points.`,
      detail: "Remove lower-priority items to reduce delivery risk. Overcommitment is the #1 cause of sprint failure.",
    });
  } else if (sprintPoints > totalCapacity * 0.9) {
    recs.push({
      id: "near-capacity",
      type: "warning",
      message: "Sprint is at 90%+ capacity — little buffer for surprises.",
      detail: "Best practice: leave 10–15% capacity slack for unplanned work and bug fixes.",
    });
  }

  if (dependencyViolations.length > 0) {
    const titles = dependencyViolations.map(i => i.title).join(", ");
    recs.push({
      id: "deps",
      type: "danger",
      message: `Dependency risk: ${titles}`,
      detail: "These stories have unresolved dependencies. Add the prerequisite stories or move them to 'Blocked'.",
    });
  }

  const paymentInSprint = sprint.find(i => i.id === "payment-gateway");
  const loginNotInSprint = !sprint.find(i => i.id === "google-login") && !items.find(i => i.id === "google-login" && i.column === "high-risk");
  if (paymentInSprint && loginNotInSprint) {
    recs.push({
      id: "payment-dep",
      type: "warning",
      message: "Payment Gateway requires Google Login Integration.",
      detail: "Consider splitting Payment Gateway into smaller stories, or ensure the auth dependency is resolved first.",
    });
  }

  if (backendCount >= 4 && qaCount === 0) {
    recs.push({
      id: "qa-bottleneck",
      type: "warning",
      message: "QA bandwidth may become a bottleneck.",
      detail: `${backendCount} backend stories with no dedicated QA work. Testing lag often spills stories into the next sprint.`,
    });
  }

  if (backendCount >= 5) {
    recs.push({
      id: "backend-heavy",
      type: "warning",
      message: "Too many backend-heavy tasks in one sprint.",
      detail: "Backend tasks often have hidden complexity. Consider splitting or deferring to avoid 'development complete but not shipped' status.",
    });
  }

  const aiInSprint = sprint.find(i => i.id === "ai-engine");
  const analyticsNotPresent = !sprint.find(i => i.id === "analytics-dashboard") && !items.find(i => i.id === "analytics-dashboard" && i.column === "high-risk");
  if (aiInSprint && analyticsNotPresent) {
    recs.push({
      id: "ai-dep",
      type: "warning",
      message: "AI Recommendation Engine depends on Analytics Dashboard.",
      detail: "The ML model needs training data from the analytics pipeline. Ensure dependencies are resolved first.",
    });
  }

  if (activeChaos.length > 0) {
    recs.push({
      id: "chaos",
      type: "danger",
      message: `${activeChaos.length} disruption${activeChaos.length > 1 ? "s" : ""} active — sprint is under pressure.`,
      detail: "Unplanned events are happening. Work with the team to re-scope or protect the sprint commitment.",
    });
  }

  const largeStories = sprint.filter(i => i.points >= 13);
  if (largeStories.length > 0) {
    recs.push({
      id: "large",
      type: "tip",
      message: `Consider splitting large stories: ${largeStories.map(i => i.title).join(", ")}.`,
      detail: "13-point stories are high-risk. Splitting them into smaller deliverables reduces uncertainty and improves tracking.",
    });
  }

  if (healthScore > 80 && recs.length === 0) {
    recs.push({
      id: "healthy",
      type: "info",
      message: "Sprint plan looks healthy! Good balance of priorities and capacity.",
      detail: "Team is well-utilized. Dependencies are managed. This sprint has a high probability of successful delivery.",
    });
  }

  return recs;
}

const TYPE_STYLES = {
  danger:  { icon: XCircle,      border: "border-red-500/30",    bg: "bg-red-500/8",    text: "text-red-400",    label: "Risk"    },
  warning: { icon: AlertTriangle, border: "border-amber-500/30",  bg: "bg-amber-500/8",  text: "text-amber-400",  label: "Warning" },
  info:    { icon: Lightbulb,     border: "border-brand/30",      bg: "bg-brand/8",      text: "text-brand",      label: "Info"    },
  tip:     { icon: CheckCircle2,  border: "border-green-500/30",  bg: "bg-green-500/8",  text: "text-green-400",  label: "Tip"     },
};

interface Props {
  items: BacklogItem[];
  sprintPoints: number;
  totalCapacity: number;
  dependencyViolations: BacklogItem[];
  activeChaos: ChaosEvent[];
  healthScore: number;
}

export function AiRecommendations({ items, sprintPoints, totalCapacity, dependencyViolations, activeChaos, healthScore }: Props) {
  const recs = buildRecommendations(items, sprintPoints, totalCapacity, dependencyViolations, activeChaos, healthScore);

  return (
    <section className="rounded-2xl border border-border/70 bg-surface p-6">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/15 ring-1 ring-brand/30">
          <Brain className="h-5 w-5 text-brand" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">AI Sprint Assistant</p>
          <h2 className="text-lg font-bold text-fg">Recommendations</h2>
        </div>
        <span className="ml-auto rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand border border-brand/20">
          {recs.length} insight{recs.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Human note */}
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-border/40 bg-elevated px-3 py-2">
        <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-muted" />
        <p className="text-[11px] text-muted">
          <span className="font-semibold text-fg">Final sprint decisions remain human-controlled.</span>{" "}
          AI only assists — never auto-plans.
        </p>
      </div>

      {/* Recommendations */}
      <div className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {recs.map((rec, i) => {
            const s = TYPE_STYLES[rec.type];
            const Icon = s.icon;
            return (
              <motion.div
                key={rec.id}
                layout
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-xl border p-3.5 ${s.border} ${s.bg}`}
              >
                <div className="flex items-start gap-2.5">
                  <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${s.text}`} />
                  <div>
                    <p className={`text-sm font-semibold ${s.text}`}>{rec.message}</p>
                    {rec.detail && (
                      <p className="mt-1 text-xs text-muted leading-relaxed">{rec.detail}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
