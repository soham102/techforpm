"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Users, TrendingDown, Info } from "lucide-react";
import type { TeamMember } from "./types";

const COLOR: Record<string, { ring: string; bg: string; text: string }> = {
  blue:   { ring: "ring-blue-500/40",   bg: "bg-blue-500/15",   text: "text-blue-400"   },
  cyan:   { ring: "ring-cyan-500/40",   bg: "bg-cyan-500/15",   text: "text-cyan-400"   },
  green:  { ring: "ring-green-500/40",  bg: "bg-green-500/15",  text: "text-green-400"  },
  purple: { ring: "ring-purple-500/40", bg: "bg-purple-500/15", text: "text-purple-400" },
};

interface Props {
  team: TeamMember[];
  baseCapacity: number;
  totalCapacity: number;
  chaosImpact: number;
  onToggle: (id: string) => void;
}

export function TeamCapacity({ team, baseCapacity, totalCapacity, chaosImpact, onToggle }: Props) {
  const availableCount = team.filter(m => m.available).length;

  return (
    <section className="rounded-2xl border border-border/70 bg-surface p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-brand">
            Section 5
          </p>
          <h2 className="text-xl font-bold text-fg">Team Availability</h2>
          <p className="mt-1 text-sm text-muted">
            Real-world constraints shape your sprint capacity. Toggle team members to see the live impact.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-elevated px-4 py-3">
          <Users className="h-5 w-5 text-brand" />
          <div>
            <p className="text-xs text-muted">Available</p>
            <p className="text-lg font-bold text-fg">
              {availableCount}
              <span className="text-sm font-normal text-muted">/{team.length}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Team members grid */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((member) => {
          const c = COLOR[member.color] ?? COLOR.blue;
          return (
            <motion.div
              key={member.id}
              layout
              whileHover={{ y: -2 }}
              onClick={() => onToggle(member.id)}
              className={[
                "relative cursor-pointer rounded-xl border p-4 transition-all select-none",
                member.available
                  ? `border-border/60 bg-elevated ring-1 ${c.ring}`
                  : "border-border/30 bg-surface opacity-50",
              ].join(" ")}
            >
              {/* Avatar */}
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ring-2 ${c.ring} ${c.bg} ${c.text}`}>
                {member.avatar}
              </div>
              <p className="text-sm font-semibold text-fg">{member.name}</p>
              <p className="text-xs text-muted">{member.role}</p>

              {/* Capacity chip */}
              <div className="mt-2 flex items-center justify-between">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}>
                  {member.capacity} pts
                </span>
                <AnimatePresence mode="wait">
                  {member.available ? (
                    <motion.span
                      key="on"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-xs"
                    >
                      ✓
                    </motion.span>
                  ) : (
                    <motion.span
                      key="off"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20 text-red-400 text-xs"
                    >
                      ✕
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Unavailable overlay label */}
              {!member.available && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl">
                  <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-semibold text-red-400 border border-red-500/30">
                    On Leave
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Capacity summary */}
      <div className="rounded-xl border border-border/50 bg-elevated p-4">
        <div className="mb-3 flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs text-muted">Base Capacity</p>
            <p className="text-2xl font-bold text-fg">{baseCapacity} <span className="text-sm font-normal text-muted">story pts</span></p>
          </div>
          {chaosImpact < 0 && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <p className="text-xs text-muted">Chaos Impact</p>
              <p className="flex items-center gap-1 text-2xl font-bold text-red-400">
                <TrendingDown className="h-5 w-5" />
                {chaosImpact} pts
              </p>
            </motion.div>
          )}
          <div className="ml-auto">
            <p className="text-xs text-muted">Effective Capacity</p>
            <motion.p
              key={totalCapacity}
              initial={{ scale: 1.15, color: "#f59e0b" }}
              animate={{ scale: 1, color: "#edeff5" }}
              className="text-2xl font-bold text-fg"
            >
              {totalCapacity} <span className="text-sm font-normal text-muted">story pts</span>
            </motion.p>
          </div>
        </div>

        {/* PM insight */}
        <div className="flex items-start gap-2 rounded-lg border border-brand/20 bg-brand/5 p-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          <p className="text-xs text-muted leading-relaxed">
            <span className="font-semibold text-fg">Story points ≠ time.</span>{" "}
            They represent <em>complexity and uncertainty</em>. A 5-point story might take 2 hours for a senior dev or 2 days for a junior. Sprint capacity is shaped by team experience, focus time, and reality.
          </p>
        </div>
      </div>
    </section>
  );
}
