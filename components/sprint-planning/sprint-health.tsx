"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Activity, Users, GitBranch, TrendingUp, AlertTriangle, Target, ShieldCheck } from "lucide-react";
import type { BacklogItem, TeamMember, ChaosEvent } from "./types";

interface Props {
  healthScore: number;
  sprintPoints: number;
  totalCapacity: number;
  team: TeamMember[];
  sprintItems: BacklogItem[];
  highRiskItems: BacklogItem[];
  blockedItems: BacklogItem[];
  activeChaos: ChaosEvent[];
  dependencyViolations: BacklogItem[];
  deliveryConfidence: number;
}

function getHealthLabel(score: number): { label: string; color: string; bg: string; ring: string } {
  if (score >= 80) return { label: "Healthy",       color: "text-green-400",  bg: "bg-green-500/15",  ring: "ring-green-500/40"  };
  if (score >= 60) return { label: "Moderate Risk", color: "text-amber-400",  bg: "bg-amber-500/15",  ring: "ring-amber-500/40"  };
  if (score >= 40) return { label: "At Risk",       color: "text-orange-400", bg: "bg-orange-500/15", ring: "ring-orange-500/40" };
  return              { label: "Critical",      color: "text-red-400",    bg: "bg-red-500/15",    ring: "ring-red-500/40"   };
}

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  progress,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
  color: string;
  progress?: number;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-xl border border-border/60 bg-elevated p-4"
    >
      <div className="mb-3 flex items-center justify-between">
        <Icon className={`h-4 w-4 ${color}`} />
        <span className="text-[11px] text-muted">{label}</span>
      </div>
      <motion.p
        key={value}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        className={`text-2xl font-bold ${color}`}
      >
        {value}
      </motion.p>
      <p className="mt-0.5 text-xs text-muted">{sub}</p>
      {progress !== undefined && (
        <div className="mt-2 h-1 rounded-full bg-border/40">
          <motion.div
            key={progress}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, progress)}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`h-full rounded-full ${color.replace("text-", "bg-")}`}
          />
        </div>
      )}
    </motion.div>
  );
}

export function SprintHealth({
  healthScore,
  sprintPoints,
  totalCapacity,
  team,
  sprintItems,
  highRiskItems,
  blockedItems,
  activeChaos,
  dependencyViolations,
  deliveryConfidence,
}: Props) {
  const h = getHealthLabel(healthScore);
  const utilization = totalCapacity > 0 ? Math.round((sprintPoints / totalCapacity) * 100) : 0;
  const availableTeam = team.filter(m => m.available).length;
  const backendCount = sprintItems.filter(i => i.category === "Backend").length;
  const qaBottleneckRisk = backendCount >= 4 ? Math.min(95, backendCount * 18) : Math.min(50, backendCount * 10);
  const velocityPrediction = Math.round(totalCapacity * (healthScore / 100));

  return (
    <section className="rounded-2xl border border-border/70 bg-surface p-6">
      <div className="mb-6 flex flex-wrap items-start gap-6">
        <div>
          <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-brand">Section 11</p>
          <h2 className="text-xl font-bold text-fg">Sprint Health Dashboard</h2>
          <p className="mt-1 text-sm text-muted">Live metrics update as you plan. This is your sprint's vital signs.</p>
        </div>

        {/* Big health score */}
        <motion.div
          key={healthScore}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className={`ml-auto flex flex-col items-center rounded-2xl border p-5 ring-2 ${h.bg} ${h.ring} border-transparent`}
        >
          <AnimatePresence mode="wait">
            {healthScore >= 80 ? (
              <motion.span key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-2xl">🟢</motion.span>
            ) : healthScore >= 60 ? (
              <motion.span key="mod" initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-2xl">🟡</motion.span>
            ) : (
              <motion.span key="bad" initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-2xl">🔴</motion.span>
            )}
          </AnimatePresence>
          <motion.p
            key={healthScore}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className={`mt-1 text-4xl font-black ${h.color}`}
          >
            {healthScore}
          </motion.p>
          <p className={`text-xs font-semibold ${h.color}`}>{h.label}</p>
          <p className="mt-0.5 text-[11px] text-muted">Sprint Health Score</p>
        </motion.div>
      </div>

      {/* Overcommitment alert */}
      <AnimatePresence>
        {sprintPoints > totalCapacity && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-red-400 animate-pulse" />
              <div>
                <p className="text-sm font-bold text-red-400">
                  High probability of sprint spillover.
                </p>
                <p className="text-xs text-red-300/80">
                  Sprint is overcommitted by {sprintPoints - totalCapacity} story points. Remove lower-priority items to protect delivery.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
        <MetricCard
          icon={Target}
          label="Team Utilization"
          value={`${Math.min(utilization, 999)}%`}
          sub={utilization > 100 ? "overloaded" : utilization > 85 ? "near limit" : "optimal"}
          color={utilization > 100 ? "text-red-400" : utilization > 85 ? "text-amber-400" : "text-green-400"}
          progress={Math.min(utilization, 100)}
        />
        <MetricCard
          icon={GitBranch}
          label="Dependency Risk"
          value={`${dependencyViolations.length + blockedItems.length}`}
          sub="violations detected"
          color={dependencyViolations.length + blockedItems.length > 0 ? "text-amber-400" : "text-green-400"}
          progress={(dependencyViolations.length + blockedItems.length) * 20}
        />
        <MetricCard
          icon={TrendingUp}
          label="Velocity Prediction"
          value={`${velocityPrediction}`}
          sub="expected story pts"
          color="text-brand"
          progress={(velocityPrediction / Math.max(sprintPoints, 1)) * 100}
        />
        <MetricCard
          icon={AlertTriangle}
          label="Overcommitment Risk"
          value={sprintPoints > totalCapacity ? "HIGH" : sprintPoints > totalCapacity * 0.9 ? "MOD" : "LOW"}
          sub={`${sprintPoints}/${totalCapacity} pts`}
          color={sprintPoints > totalCapacity ? "text-red-400" : sprintPoints > totalCapacity * 0.9 ? "text-amber-400" : "text-green-400"}
        />
        <MetricCard
          icon={Activity}
          label="QA Bottleneck Risk"
          value={`${qaBottleneckRisk}%`}
          sub={backendCount >= 4 ? "high backend load" : "manageable"}
          color={qaBottleneckRisk > 60 ? "text-amber-400" : "text-green-400"}
          progress={qaBottleneckRisk}
        />
        <MetricCard
          icon={ShieldCheck}
          label="Delivery Confidence"
          value={`${deliveryConfidence}%`}
          sub={deliveryConfidence >= 75 ? "will ship" : deliveryConfidence >= 50 ? "partial risk" : "likely incomplete"}
          color={deliveryConfidence >= 75 ? "text-green-400" : deliveryConfidence >= 50 ? "text-amber-400" : "text-red-400"}
          progress={deliveryConfidence}
        />
      </div>

      {/* Team + Sprint summary */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Stories in Sprint", value: sprintItems.length, color: "text-brand" },
          { label: "High Risk Stories", value: highRiskItems.length, color: "text-amber-400" },
          { label: "Blocked Stories", value: blockedItems.length, color: "text-red-400" },
          { label: "Active Disruptions", value: activeChaos.length, color: activeChaos.length > 0 ? "text-red-400" : "text-green-400" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border/50 bg-elevated px-4 py-3 text-center">
            <motion.p key={stat.value} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </motion.p>
            <p className="mt-0.5 text-xs text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
