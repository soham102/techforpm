"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Lightbulb, RotateCcw } from "lucide-react";
import type { BacklogItem, TeamMember, ChaosEvent } from "./types";

interface Props {
  healthScore: number;
  sprintItems: BacklogItem[];
  highRiskItems: BacklogItem[];
  blockedItems: BacklogItem[];
  team: TeamMember[];
  activeChaos: ChaosEvent[];
  sprintPoints: number;
  totalCapacity: number;
}

export function SprintMetrics({
  healthScore,
  sprintItems,
  highRiskItems,
  blockedItems,
  team,
  activeChaos,
  sprintPoints,
  totalCapacity,
}: Props) {
  const isOvercommitted = sprintPoints > totalCapacity;
  const hasChaos = activeChaos.length > 0;
  const hasViolations = false; // passed via violations prop if needed

  const wentWell: string[] = [];
  const failed: string[] = [];
  const actions: string[] = [];
  const learnings: string[] = [];

  if (sprintItems.length > 0 && !isOvercommitted) wentWell.push("Sprint was scoped within team capacity.");
  if (blockedItems.length === 0) wentWell.push("No dependencies were blocked at sprint start.");
  if (activeChaos.length === 0) wentWell.push("No unplanned disruptions during this sprint.");
  if (sprintItems.length >= 3 && sprintItems.length <= 8) wentWell.push("Good number of stories selected (manageable scope).");
  if (healthScore >= 80) wentWell.push("Sprint health score stayed in the healthy zone.");

  if (isOvercommitted) failed.push(`Sprint overcommitted by ${sprintPoints - totalCapacity} story points — classic planning failure.`);
  if (highRiskItems.length > 2) failed.push(`${highRiskItems.length} high-risk items flagged — risk concentration was too high.`);
  if (hasChaos) failed.push(`${activeChaos.length} disruption${activeChaos.length > 1 ? "s" : ""} impacted capacity mid-sprint.`);
  if (blockedItems.length > 0) failed.push(`${blockedItems.length} stories blocked due to unresolved dependencies.`);
  if (sprintItems.length === 0) failed.push("No stories were selected for the sprint.");

  if (isOvercommitted) actions.push("Next sprint: cap total story points at 90% of capacity to leave buffer.");
  if (highRiskItems.length > 0) actions.push("Conduct risk spike sessions before adding risky stories to sprint.");
  if (hasChaos) actions.push("Add a 'chaos buffer' (2-3 unallocated story points) for unplanned work.");
  if (sprintItems.filter(i => i.points >= 13).length > 0) actions.push("Split 13-point stories into smaller sub-tasks before next sprint planning.");
  actions.push("Review velocity data from last 3 sprints to set realistic capacity expectations.");

  learnings.push("Sprint planning is a negotiation between ambition and reality.");
  if (isOvercommitted) learnings.push("Overcommitment is predictable — teams often forget QA, reviews, and meetings reduce coding time.");
  learnings.push("Dependencies are invisible until they block you. Map them before planning.");
  if (hasChaos) learnings.push("Agile's real advantage is adaptation speed, not perfect planning.");

  return (
    <section className="rounded-2xl border border-border/70 bg-surface p-6">
      <div className="mb-6">
        <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-brand">Section 12</p>
        <h2 className="text-xl font-bold text-fg">Sprint Retrospective Preview</h2>
        <p className="mt-1 text-sm text-muted">
          What would your team discuss after this sprint? Generated from your planning decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* What went well */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border border-green-500/25 bg-green-500/5 p-4"
        >
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            <p className="text-sm font-bold text-green-400">What Went Well</p>
          </div>
          {wentWell.length > 0 ? (
            <ul className="space-y-2">
              {wentWell.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-green-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted italic">Add stories to the sprint to generate retro insights.</p>
          )}
        </motion.div>

        {/* What failed */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-red-500/25 bg-red-500/5 p-4"
        >
          <div className="mb-3 flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-400" />
            <p className="text-sm font-bold text-red-400">What Failed</p>
          </div>
          {failed.length > 0 ? (
            <ul className="space-y-2">
              {failed.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted italic">No major failures detected — well planned!</p>
          )}
        </motion.div>

        {/* Action items */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-brand/25 bg-brand/5 p-4"
        >
          <div className="mb-3 flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-brand" />
            <p className="text-sm font-bold text-brand">Action Items</p>
          </div>
          <ul className="space-y-2">
            {actions.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Sprint learnings */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4"
        >
          <div className="mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-400" />
            <p className="text-sm font-bold text-amber-400">Sprint Learnings</p>
          </div>
          <ul className="space-y-2">
            {learnings.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
