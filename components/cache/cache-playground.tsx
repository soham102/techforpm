"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Zap,
  Database,
  RotateCcw,
  Trash2,
  Flame,
  MousePointerClick,
  Check,
  X,
} from "lucide-react";
import { RESOURCES, type CacheResource, pct } from "@/lib/caching";
import { getIcon } from "@/lib/icons";
import { cn, sleep } from "@/lib/utils";

type Stage = "app" | "cache" | "db" | "done" | null;

interface LogEntry {
  id: number;
  resource: string;
  kind: "hit" | "miss";
  ms: number;
}

/**
 * Section 4 — the core interactive cache simulator. Pick a resource, then
 * First Visit / Reload / Clear Cache / Traffic Spike to feel the difference
 * between a cache hit and a cache miss in response time and database load.
 */
export function CachePlayground() {
  const [resource, setResource] = useState<CacheResource>(RESOURCES[0]);
  const [cached, setCached] = useState<Set<string>>(new Set());
  const [stage, setStage] = useState<Stage>(null);
  const [verdict, setVerdict] = useState<null | "hit" | "miss">(null);
  const [responseMs, setResponseMs] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [dbCalls, setDbCalls] = useState(0);
  const [log, setLog] = useState<LogEntry[]>([]);
  const idRef = useRef(0);

  const total = hits + misses;
  const hitRate = total === 0 ? 0 : Math.round((hits / total) * 100);

  function record(res: CacheResource, kind: "hit" | "miss", ms: number) {
    idRef.current += 1;
    setLog((l) =>
      [{ id: idRef.current, resource: res.label, kind, ms }, ...l].slice(0, 7)
    );
    if (kind === "hit") setHits((h) => h + 1);
    else {
      setMisses((m) => m + 1);
      setDbCalls((d) => d + 1);
    }
  }

  /** Run a single request against the current cache state. */
  async function request(res: CacheResource) {
    const isHit = cached.has(res.id);
    setVerdict(null);
    setResponseMs(null);

    setStage("app");
    await sleep(isHit ? 160 : 220);
    setStage("cache");
    await sleep(isHit ? 220 : 360);

    if (isHit) {
      setVerdict("hit");
      setResponseMs(res.cacheMs);
      setStage("done");
      record(res, "hit", res.cacheMs);
      await sleep(700);
      setStage(null);
      return;
    }

    // miss → fall through to the database, then backfill the cache
    setStage("db");
    await sleep(900);
    setCached((c) => new Set(c).add(res.id));
    setVerdict("miss");
    setResponseMs(res.dbMs);
    setStage("done");
    record(res, "miss", res.dbMs);
    await sleep(900);
    setStage(null);
  }

  async function firstVisit() {
    setBusy(true);
    // a genuine first visit: this resource has never been cached
    setCached((c) => {
      const next = new Set(c);
      next.delete(resource.id);
      return next;
    });
    await sleep(60);
    await request(resource);
    setBusy(false);
  }

  async function reload() {
    setBusy(true);
    await request(resource);
    setBusy(false);
  }

  function clearCache() {
    setCached(new Set());
    setVerdict(null);
    setResponseMs(null);
    setStage(null);
  }

  async function trafficSpike() {
    setBusy(true);
    // 6 users hit the same resource back-to-back; only the first pays full price
    for (let i = 0; i < 6; i++) {
      await request(resource);
      await sleep(120);
    }
    setBusy(false);
  }

  function resetStats() {
    setHits(0);
    setMisses(0);
    setDbCalls(0);
    setLog([]);
    clearCache();
  }

  const meterPct =
    responseMs == null ? 0 : pct((responseMs / 2700) * 100);
  const meterTone =
    responseMs == null
      ? "muted"
      : responseMs < 300
      ? "ok"
      : responseMs < 1200
      ? "warn"
      : "bad";

  return (
    <div className="space-y-5">
      {/* resource picker */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {RESOURCES.map((r) => {
          const Icon = getIcon(r.icon);
          const isSel = r.id === resource.id;
          const isCached = cached.has(r.id);
          return (
            <button
              key={r.id}
              onClick={() => !busy && setResource(r)}
              className={cn(
                "rounded-2xl border p-4 text-left transition-colors",
                isSel
                  ? "border-brand/50 bg-brand-soft"
                  : "border-border bg-surface hover:border-brand/30"
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-xl",
                    isSel ? "bg-brand text-white" : "bg-brand-soft text-brand"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                {isCached && (
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
                    cached
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm font-semibold leading-tight">
                {r.label}
              </p>
              <p className="text-[11px] text-muted">{r.sub}</p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        {/* request visualization */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <FlowNode
              icon={<Smartphone className="h-5 w-5" />}
              label="App"
              active={stage === "app"}
            />
            <Connector active={stage === "app" || stage === "cache"} />
            <FlowNode
              icon={<Zap className="h-5 w-5" />}
              label="Cache"
              active={stage === "cache"}
              tone={verdict === "hit" && stage !== null ? "ok" : "brand"}
            />
            <Connector
              active={stage === "db"}
              dim={verdict === "hit"}
              label="on miss"
            />
            <FlowNode
              icon={<Database className="h-5 w-5" />}
              label="Database"
              active={stage === "db"}
              tone="bad"
            />
          </div>

          {/* verdict + glowing fast response */}
          <div className="mt-7 min-h-[60px]">
            <AnimatePresence mode="wait">
              {verdict === "hit" && stage !== null && (
                <motion.div
                  key="hit"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative flex items-center gap-3 overflow-hidden rounded-xl border border-emerald-500/50 bg-emerald-500/10 px-4 py-3"
                >
                  <motion.span
                    className="absolute inset-0"
                    animate={{ opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    style={{
                      boxShadow: "inset 0 0 30px rgb(16 185 129 / 0.4)",
                    }}
                  />
                  <Check className="relative h-5 w-5 text-emerald-500" />
                  <p className="relative text-sm font-bold uppercase tracking-wide text-emerald-500">
                    Cache hit · fast response
                  </p>
                </motion.div>
              )}
              {verdict === "miss" && stage !== null && (
                <motion.div
                  key="miss"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3"
                >
                  <X className="h-5 w-5 text-amber-500" />
                  <p className="text-sm font-bold uppercase tracking-wide text-amber-500">
                    Cache miss · fetched from database, now cached
                  </p>
                </motion.div>
              )}
              {stage === null && verdict === null && (
                <motion.p
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-1 text-sm text-muted"
                >
                  Pick what to load, then try First Visit, then Reload.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* response time meter */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted">Response time</span>
              <span
                className={cn(
                  "font-bold tabular-nums",
                  meterTone === "ok" && "text-emerald-500",
                  meterTone === "warn" && "text-amber-500",
                  meterTone === "bad" && "text-rose-500",
                  meterTone === "muted" && "text-muted"
                )}
              >
                {responseMs == null
                  ? "—"
                  : responseMs < 1000
                  ? `${responseMs}ms`
                  : `${(responseMs / 1000).toFixed(1)}s`}
              </span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-border">
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  meterTone === "ok" && "bg-emerald-500",
                  meterTone === "warn" && "bg-amber-500",
                  meterTone === "bad" && "bg-rose-500",
                  meterTone === "muted" && "bg-border"
                )}
                animate={{ width: `${meterPct}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* action buttons */}
          <div className="mt-6 flex flex-wrap gap-2">
            <Action
              onClick={firstVisit}
              disabled={busy}
              icon={<MousePointerClick className="h-4 w-4" />}
              primary
            >
              First visit
            </Action>
            <Action
              onClick={reload}
              disabled={busy}
              icon={<RotateCcw className="h-4 w-4" />}
            >
              Reload page
            </Action>
            <Action
              onClick={clearCache}
              disabled={busy}
              icon={<Trash2 className="h-4 w-4" />}
            >
              Clear cache
            </Action>
            <Action
              onClick={trafficSpike}
              disabled={busy}
              icon={<Flame className="h-4 w-4" />}
            >
              Traffic spike
            </Action>
          </div>
        </div>

        {/* live stats + cache storage */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Cache hit rate
              </p>
              <button
                onClick={resetStats}
                className="text-[11px] font-medium text-brand hover:opacity-80"
              >
                Reset
              </button>
            </div>
            <p className="mt-2 text-3xl font-bold tabular-nums text-brand">
              {hitRate}
              <span className="text-base text-muted">%</span>
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <Stat label="Hits" value={hits} tone="ok" />
              <Stat label="Misses" value={misses} tone="warn" />
              <Stat label="DB calls" value={dbCalls} tone="bad" />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
              <Zap className="h-3.5 w-3.5 text-brand" />
              Cache storage
            </p>
            <div className="mt-3 min-h-[52px]">
              <AnimatePresence>
                {cached.size === 0 ? (
                  <motion.p
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-muted"
                  >
                    Empty — every request will hit the database.
                  </motion.p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(cached).map((id) => {
                      const r = RESOURCES.find((x) => x.id === id)!;
                      return (
                        <motion.span
                          key={id}
                          layout
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-500"
                        >
                          {r.label}
                        </motion.span>
                      );
                    })}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Request log
            </p>
            <div className="mt-3 space-y-1.5">
              <AnimatePresence initial={false}>
                {log.length === 0 && (
                  <p className="text-xs text-muted">No requests yet.</p>
                )}
                {log.map((e) => (
                  <motion.div
                    key={e.id}
                    layout
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between rounded-lg border border-border bg-bg px-2.5 py-1.5 text-[11px]"
                  >
                    <span className="truncate pr-2 text-muted">
                      {e.resource}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 font-semibold",
                        e.kind === "hit"
                          ? "text-emerald-500"
                          : "text-amber-500"
                      )}
                    >
                      {e.kind === "hit" ? "HIT" : "MISS"} ·{" "}
                      {e.ms < 1000 ? `${e.ms}ms` : `${(e.ms / 1000).toFixed(1)}s`}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <p className="rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">PM insight: </span>
        Caching dramatically improves app responsiveness. The first visit pays
        the full cost once; every visit after is served from a fast nearby
        copy — and the database is left alone.
      </p>
    </div>
  );
}

function FlowNode({
  icon,
  label,
  active,
  tone = "brand",
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  tone?: "brand" | "ok" | "bad";
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-2">
      <motion.div
        animate={active ? { scale: 1.08 } : { scale: 1 }}
        className={cn(
          "grid h-14 w-14 place-items-center rounded-2xl border transition-colors",
          !active && "border-border bg-bg text-muted",
          active && tone === "brand" && "border-brand/50 bg-brand-soft text-brand",
          active &&
            tone === "ok" &&
            "border-emerald-500/50 bg-emerald-500/10 text-emerald-500",
          active && tone === "bad" && "border-rose-500/50 bg-rose-500/10 text-rose-500"
        )}
      >
        {icon}
      </motion.div>
      <span className="text-[11px] font-medium text-muted">{label}</span>
    </div>
  );
}

function Connector({
  active,
  dim,
  label,
}: {
  active: boolean;
  dim?: boolean;
  label?: string;
}) {
  return (
    <div className="relative flex min-w-6 flex-1 flex-col items-center self-start pt-6">
      <div
        className={cn(
          "h-0.5 w-full",
          dim ? "bg-border/50" : "bg-border"
        )}
      >
        {active && (
          <motion.span
            className="absolute -top-[3px] h-2 w-2 rounded-full bg-brand"
            animate={{ left: ["0%", "100%"] }}
            transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>
      {label && (
        <span className="mt-1 text-[9px] uppercase tracking-wide text-muted">
          {label}
        </span>
      )}
    </div>
  );
}

function Action({
  onClick,
  disabled,
  icon,
  primary,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  icon: React.ReactNode;
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0",
        primary
          ? "bg-brand text-white shadow-soft"
          : "border border-border hover:border-brand/40"
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "ok" | "warn" | "bad";
}) {
  return (
    <div className="rounded-lg border border-border bg-bg px-2 py-2">
      <p
        className={cn(
          "text-lg font-bold tabular-nums",
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
