"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingDown, Info } from "lucide-react";
import type { ChaosEvent } from "./types";

const W = 560;
const H = 220;
const PAD = { top: 20, right: 20, bottom: 40, left: 48 };
const DAYS = 10;
const innerW = W - PAD.left - PAD.right;
const innerH = H - PAD.top - PAD.bottom;

function toX(day: number) {
  return PAD.left + (day / DAYS) * innerW;
}
function toY(pts: number, max: number) {
  return PAD.top + (1 - pts / Math.max(max, 1)) * innerH;
}
function pts2path(points: [number, number][]) {
  return points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
}

interface Props {
  sprintPoints: number;
  totalCapacity: number;
  activeChaos: ChaosEvent[];
  healthScore: number;
}

export function BurndownChart({ sprintPoints, totalCapacity, activeChaos, healthScore }: Props) {
  const maxPts = Math.max(sprintPoints, totalCapacity, 5);
  const hasChaos = activeChaos.length > 0;
  const isOvercommitted = sprintPoints > totalCapacity;

  const idealPoints = useMemo<[number, number][]>(() => {
    return Array.from({ length: DAYS + 1 }, (_, d) => [
      toX(d),
      toY(sprintPoints * (1 - d / DAYS), maxPts),
    ]);
  }, [sprintPoints, maxPts]);

  const actualPoints = useMemo<[number, number][]>(() => {
    const pts: [number, number][] = [];
    let remaining = sprintPoints;
    pts.push([toX(0), toY(remaining, maxPts)]);

    for (let d = 1; d <= DAYS; d++) {
      const dailyBurn = (sprintPoints / DAYS) * (isOvercommitted ? 0.6 : 0.85);

      if (hasChaos && d === 5) {
        remaining = Math.min(remaining + sprintPoints * 0.15, sprintPoints * 1.2);
      }
      remaining = Math.max(0, remaining - dailyBurn);
      pts.push([toX(d), toY(remaining, maxPts)]);
    }
    return pts;
  }, [sprintPoints, maxPts, hasChaos, isOvercommitted]);

  const idealPath = pts2path(idealPoints);
  const actualPath = pts2path(actualPoints);

  const yLabels = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(maxPts * f));

  return (
    <section className="rounded-2xl border border-border/70 bg-surface p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-brand">Section 10</p>
          <h2 className="text-xl font-bold text-fg">Sprint Burndown Chart</h2>
          <p className="mt-1 text-sm text-muted">
            Visualize how your sprint progresses. The gap between ideal and actual reveals planning accuracy.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="h-0.5 w-6 bg-brand/60 rounded" />
            <span>Ideal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-0.5 w-6 bg-amber-400 rounded" />
            <span>Actual</span>
          </div>
          {hasChaos && (
            <div className="flex items-center gap-1.5">
              <div className="h-0.5 w-6 border-t-2 border-dashed border-red-400" />
              <span>Scope creep</span>
            </div>
          )}
        </div>
      </div>

      {sprintPoints === 0 ? (
        <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed border-border/50 bg-elevated">
          <div className="text-center">
            <TrendingDown className="mx-auto mb-2 h-8 w-8 text-muted/40" />
            <p className="text-sm text-muted">Add stories to the sprint to see the burndown.</p>
          </div>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            style={{ minWidth: 320 }}
          >
            {/* Grid lines */}
            {yLabels.map((label) => {
              const y = toY(label, maxPts);
              return (
                <g key={label}>
                  <line
                    x1={PAD.left}
                    y1={y}
                    x2={W - PAD.right}
                    y2={y}
                    stroke="rgba(148,152,170,0.15)"
                    strokeWidth={1}
                  />
                  <text
                    x={PAD.left - 6}
                    y={y}
                    textAnchor="end"
                    dominantBaseline="middle"
                    fill="rgba(148,152,170,0.8)"
                    fontSize={10}
                  >
                    {label}
                  </text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {Array.from({ length: DAYS + 1 }, (_, d) => (
              <text
                key={d}
                x={toX(d)}
                y={H - PAD.bottom + 18}
                textAnchor="middle"
                fill="rgba(148,152,170,0.8)"
                fontSize={10}
              >
                {d === 0 ? "Start" : d === DAYS ? "End" : `D${d}`}
              </text>
            ))}

            {/* Axes */}
            <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom} stroke="rgba(148,152,170,0.3)" strokeWidth={1} />
            <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} stroke="rgba(148,152,170,0.3)" strokeWidth={1} />

            {/* Chaos spike marker */}
            {hasChaos && (
              <g>
                <line
                  x1={toX(5)}
                  y1={PAD.top}
                  x2={toX(5)}
                  y2={H - PAD.bottom}
                  stroke="rgba(239,68,68,0.4)"
                  strokeWidth={1}
                  strokeDasharray="4 3"
                />
                <text
                  x={toX(5)}
                  y={PAD.top + 8}
                  textAnchor="middle"
                  fill="rgba(239,68,68,0.8)"
                  fontSize={9}
                >
                  ⚡ Chaos
                </text>
              </g>
            )}

            {/* Capacity reference line */}
            <line
              x1={PAD.left}
              y1={toY(totalCapacity, maxPts)}
              x2={W - PAD.right}
              y2={toY(totalCapacity, maxPts)}
              stroke="rgba(99,102,241,0.3)"
              strokeWidth={1}
              strokeDasharray="6 3"
            />

            {/* Ideal burndown line */}
            <motion.path
              d={idealPath}
              fill="none"
              stroke="rgba(99,102,241,0.5)"
              strokeWidth={1.5}
              strokeDasharray="6 3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {/* Actual burndown area */}
            <motion.path
              d={`${actualPath} L ${toX(DAYS)} ${H - PAD.bottom} L ${toX(0)} ${H - PAD.bottom} Z`}
              fill="rgba(251,191,36,0.06)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            />

            {/* Actual burndown line */}
            <motion.path
              d={actualPath}
              fill="none"
              stroke="rgba(251,191,36,0.85)"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
            />

            {/* Dots on actual line */}
            {actualPoints.filter((_, i) => i % 2 === 0).map(([x, y], i) => (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r={3}
                fill="rgb(251,191,36)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + i * 0.15 }}
              />
            ))}
          </svg>
        </div>
      )}

      {/* Insights below chart */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          {
            label: "Sprint Points",
            value: String(sprintPoints),
            sub: "planned",
            color: isOvercommitted ? "text-red-400" : "text-fg",
          },
          {
            label: "Capacity",
            value: String(totalCapacity),
            sub: "available",
            color: "text-brand",
          },
          {
            label: "Delivery Confidence",
            value: `${healthScore}%`,
            sub: healthScore >= 70 ? "on track" : healthScore >= 40 ? "at risk" : "critical",
            color: healthScore >= 70 ? "text-green-400" : healthScore >= 40 ? "text-amber-400" : "text-red-400",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border/50 bg-elevated px-4 py-3 text-center"
          >
            <p className="text-xs text-muted">{stat.label}</p>
            <motion.p
              key={stat.value}
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              className={`text-2xl font-bold ${stat.color}`}
            >
              {stat.value}
            </motion.p>
            <p className="text-xs text-muted">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-lg border border-brand/20 bg-brand/5 px-3 py-2">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
        <p className="text-xs text-muted">
          <span className="font-semibold text-fg">Why burndown charts matter:</span>{" "}
          The gap between ideal and actual is your early warning system. A flat actual line means the team is blocked, not burning down work.
        </p>
      </div>
    </section>
  );
}
