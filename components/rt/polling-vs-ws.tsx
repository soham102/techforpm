"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Zap, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Section 5 — polling vs WebSockets, side by side, on the same live cricket
 * match. The true score changes on its own; watch how each approach keeps up.
 */
export function PollingVsWs() {
  const [running, setRunning] = useState(true);
  const [trueScore, setTrueScore] = useState({ runs: 142, wkts: 3 });
  const [pollScore, setPollScore] = useState({ runs: 142, wkts: 3 });
  const [wsScore, setWsScore] = useState({ runs: 142, wkts: 3 });
  const [pollReqs, setPollReqs] = useState(0);
  const [pollFlash, setPollFlash] = useState(false);
  const [wsFlash, setWsFlash] = useState(false);
  const tick = useRef(0);
  const truth = useRef({ runs: 142, wkts: 3 });

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      tick.current += 1;

      // The real match advances roughly every ~1.6s.
      const scored = Math.random();
      const next = {
        runs:
          truth.current.runs +
          (scored > 0.55 ? (scored > 0.92 ? 6 : scored > 0.8 ? 4 : 1) : 0),
        wkts:
          truth.current.wkts +
          (scored < 0.06 && truth.current.wkts < 9 ? 1 : 0),
      };
      truth.current = next;
      setTrueScore(next);

      // WebSocket: pushed instantly, every tick.
      setWsScore(next);
      setWsFlash(true);
      setTimeout(() => setWsFlash(false), 300);

      // Polling: a request every tick, but the screen only refreshes
      // every 5th poll (~8s) — the rest return "no change".
      setPollReqs((r) => r + 1);
      if (tick.current % 5 === 0) {
        setPollScore(next);
        setPollFlash(true);
        setTimeout(() => setPollFlash(false), 300);
      }
    }, 1600);
    return () => clearInterval(id);
  }, [running]);

  const lag = trueScore.runs - pollScore.runs;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <span className="font-semibold">Live match · </span>
          <span className="text-muted">true score </span>
          <span className="font-bold tabular-nums text-fg">
            {trueScore.runs}/{trueScore.wkts}
          </span>
        </div>
        <button
          onClick={() => setRunning((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-medium transition-colors hover:border-brand/40"
        >
          {running ? (
            <>
              <Pause className="h-3.5 w-3.5" /> Pause
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" /> Resume
            </>
          )}
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Polling */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-amber-500">
            <RefreshCw className="h-4 w-4" />
            Polling
          </div>
          <p className="mt-1 text-[12px] text-muted">
            App asks “new score?” every few seconds
          </p>

          <div className="mt-4 flex items-end justify-between">
            <motion.p
              animate={pollFlash ? { scale: [1, 1.12, 1] } : {}}
              className="text-4xl font-bold tabular-nums"
            >
              {pollScore.runs}/{pollScore.wkts}
            </motion.p>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.span
                  key={i}
                  className="h-6 w-1.5 rounded-full bg-amber-500/40"
                  animate={
                    running
                      ? { opacity: [0.2, 1, 0.2] }
                      : { opacity: 0.3 }
                  }
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    delay: i * 0.32,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-center">
            <Mini label="Requests sent" value={`${pollReqs}`} tone="warn" />
            <Mini
              label="Behind by"
              value={lag > 0 ? `${lag} runs` : "in sync"}
              tone={lag > 0 ? "bad" : "ok"}
            />
          </div>
          <p className="mt-3 text-[12px] text-amber-500">
            Most requests return “no change” — and the score still lags.
          </p>
        </div>

        {/* WebSocket */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-emerald-500">
            <Zap className="h-4 w-4" />
            WebSocket
          </div>
          <p className="mt-1 text-[12px] text-muted">
            Server pushes the moment a ball is bowled
          </p>

          <div className="mt-4 flex items-end justify-between">
            <motion.p
              animate={wsFlash ? { scale: [1, 1.12, 1] } : {}}
              className="text-4xl font-bold tabular-nums text-emerald-500"
            >
              {wsScore.runs}/{wsScore.wkts}
            </motion.p>
            <span className="relative flex h-3 w-3">
              {running && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              )}
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-center">
            <Mini label="Requests sent" value="1 (then open)" tone="ok" />
            <Mini label="Behind by" value="in sync" tone="ok" />
          </div>
          <p className="mt-3 text-[12px] text-emerald-500">
            One connection, instant updates, no wasted calls.
          </p>
        </div>
      </div>

      <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">PM insight: </span>
        Real-time systems improve responsiveness and engagement. The polling
        score is always a few seconds stale while burning requests; the live
        one keeps users glued to the screen.
      </p>
    </div>
  );
}

function Mini({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "ok" | "warn" | "bad";
}) {
  return (
    <div className="rounded-lg border border-border bg-bg px-2 py-2">
      <p
        className={cn(
          "text-sm font-bold tabular-nums",
          tone === "ok" && "text-emerald-500",
          tone === "warn" && "text-amber-500",
          tone === "bad" && "text-rose-500"
        )}
      >
        {value}
      </p>
      <p className="text-[10px] text-muted">{label}</p>
    </div>
  );
}
