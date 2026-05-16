"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  UserPlus,
  RefreshCw,
  Trash2,
  CheckCircle2,
  RotateCcw,
  Pizza,
} from "lucide-react";
import {
  TABLES,
  SEED_DATA,
  NEW_USER_ROW,
  type TableId,
  type Row,
} from "@/lib/databases";
import { getIcon } from "@/lib/icons";
import { cn, sleep } from "@/lib/utils";

interface FeedItem {
  time: string;
  msg: string;
}

type Tone = "ok" | "info" | "warn";
type Toast = { msg: string; tone: Tone } | null;

const clone = (): Record<TableId, Row[]> =>
  JSON.parse(JSON.stringify(SEED_DATA));

function stamp() {
  return new Date().toLocaleTimeString("en-GB");
}

export function DatabasePlayground() {
  const [data, setData] = useState<Record<TableId, Row[]>>(clone);
  const [active, setActive] = useState<TableId>("users");
  const [query, setQuery] = useState("");
  const [writing, setWriting] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [glowId, setGlowId] = useState<string | null>(null);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const meta = TABLES[active];
  const keyCol = meta.columns[0];
  const rows = data[active];
  const filtered = query
    ? rows.filter((r) =>
        Object.values(r).some((v) =>
          v.toLowerCase().includes(query.toLowerCase())
        )
      )
    : rows;

  function logFeed(msg: string) {
    setFeed((f) => [{ time: stamp(), msg }, ...f].slice(0, 6));
  }
  function flash(msg: string, tone: Tone) {
    setToast({ msg, tone });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  async function writeBurst() {
    setWriting(true);
    await sleep(650);
    setWriting(false);
  }

  /* ---- guided scenarios ---- */

  async function scenarioInsert() {
    setActive("users");
    setQuery("");
    await writeBurst();
    if (data.users.some((r) => r.id === NEW_USER_ROW.id)) {
      flash("Priya already exists in Users", "info");
      return;
    }
    setData((d) => ({ ...d, users: [...d.users, { ...NEW_USER_ROW }] }));
    setGlowId(NEW_USER_ROW.id);
    flash("New customer saved to Users", "ok");
    logFeed("INSERT → Users · Priya Nair signed up");
    setTimeout(() => setGlowId(null), 1600);
  }

  async function scenarioUpdate() {
    setActive("orders");
    setQuery("");
    await writeBurst();
    setData((d) => ({
      ...d,
      orders: d.orders.map((r) =>
        r.orderId === "ORD-4815"
          ? { ...r, status: "Out for Delivery", eta: "16 min" }
          : r
      ),
    }));
    setGlowId("ORD-4815");
    flash("Order status updated live", "ok");
    logFeed("UPDATE → Orders · ORD-4815 Preparing → Out for Delivery");
    setTimeout(() => setGlowId(null), 1800);
  }

  async function scenarioDelete() {
    setActive("restaurants");
    setQuery("");
    await writeBurst();
    setData((d) => ({
      ...d,
      restaurants: d.restaurants.filter((r) => r.id !== "R-4"),
    }));
    flash("Unavailable restaurant removed", "warn");
    logFeed("DELETE → Restaurants · Pizza Central removed");
  }

  async function scenarioSearch() {
    setActive("restaurants");
    setQuery("Pizza");
    await sleep(300);
    flash("Query: results filtered for “Pizza”", "info");
    logFeed("SELECT → Restaurants WHERE cuisine LIKE 'Pizza'");
  }

  function deleteRow(id: string) {
    setData((d) => ({
      ...d,
      [active]: d[active].filter((r) => r[keyCol] !== id),
    }));
    logFeed(`DELETE → ${meta.name} · ${id} removed`);
    flash("Record deleted", "warn");
  }

  function resetAll() {
    setData(clone());
    setQuery("");
    setActive("users");
    setFeed([]);
    setToast(null);
    setGlowId(null);
  }

  return (
    <div className="space-y-5">
      {/* status bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-5 py-3 shadow-soft">
        <div className="flex items-center gap-2 text-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="font-semibold">QuickBite DB</span>
          <span className="text-muted">
            {writing ? "· writing…" : "· online"}
          </span>
        </div>
        <button
          onClick={resetAll}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-brand/40"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset data
        </button>
      </div>

      {/* guided scenario buttons */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <ScenarioBtn
          icon={<UserPlus className="h-4 w-4" />}
          title="New signup"
          sub="Insert into Users"
          tone="emerald"
          onClick={scenarioInsert}
        />
        <ScenarioBtn
          icon={<RefreshCw className="h-4 w-4" />}
          title="Status change"
          sub="Update an Order"
          tone="sky"
          onClick={scenarioUpdate}
        />
        <ScenarioBtn
          icon={<Trash2 className="h-4 w-4" />}
          title="Remove item"
          sub="Delete a Restaurant"
          tone="rose"
          onClick={scenarioDelete}
        />
        <ScenarioBtn
          icon={<Pizza className="h-4 w-4" />}
          title='Search "Pizza"'
          sub="Query Restaurants"
          tone="amber"
          onClick={scenarioSearch}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        {/* table panel */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
          {/* tabs */}
          <div className="flex flex-wrap gap-1 border-b border-border p-2">
            {(Object.keys(TABLES) as TableId[]).map((id) => {
              const t = TABLES[id];
              const Icon = getIcon(t.icon);
              const on = id === active;
              return (
                <button
                  key={id}
                  onClick={() => {
                    setActive(id);
                    setQuery("");
                  }}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                    on
                      ? "bg-brand text-white"
                      : "text-muted hover:bg-bg hover:text-fg"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.name}
                </button>
              );
            })}
          </div>

          {/* search */}
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <Search className="h-4 w-4 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${meta.name.toLowerCase()}…`}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-muted hover:text-fg"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                  {meta.columns.map((c) => (
                    <th key={c} className="px-4 py-2.5 font-medium">
                      {c}
                    </th>
                  ))}
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {filtered.map((row) => {
                    const id = row[keyCol];
                    const glow = glowId === id;
                    return (
                      <motion.tr
                        key={id}
                        layout
                        initial={{ opacity: 0, backgroundColor: "rgba(99,102,241,0.18)" }}
                        animate={{
                          opacity: 1,
                          backgroundColor: glow
                            ? "rgba(99,102,241,0.16)"
                            : "rgba(0,0,0,0)",
                        }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.45 }}
                        className="border-b border-border/70 last:border-0"
                      >
                        {meta.columns.map((c) => (
                          <td key={c} className="px-4 py-2.5">
                            <Cell
                              value={row[c]}
                              query={query}
                              emphasize={glow && c === "status"}
                            />
                          </td>
                        ))}
                        <td className="px-4 py-2.5 text-right">
                          <button
                            onClick={() => deleteRow(id)}
                            aria-label="Delete row"
                            className="text-muted transition-colors hover:text-rose-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-muted">
                No records match “{query}”.
              </p>
            )}
          </div>
        </div>

        {/* activity feed */}
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Live activity
          </p>
          <div className="mt-3 space-y-2">
            <AnimatePresence initial={false}>
              {feed.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-muted"
                >
                  Run a scenario to see the database react in real time.
                </motion.p>
              )}
              {feed.map((f) => (
                <motion.div
                  key={f.time + f.msg}
                  layout
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-lg border border-border bg-bg px-3 py-2"
                >
                  <p className="font-mono text-[10px] text-muted">{f.time}</p>
                  <p className="mt-0.5 text-xs">{f.msg}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-elevated px-4 py-2.5 text-sm font-medium shadow-soft-lg"
          >
            <CheckCircle2
              className={cn(
                "h-4 w-4",
                toast.tone === "ok" && "text-emerald-500",
                toast.tone === "info" && "text-sky-500",
                toast.tone === "warn" && "text-amber-500"
              )}
            />
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Cell({
  value,
  query,
  emphasize,
}: {
  value: string;
  query: string;
  emphasize: boolean;
}) {
  const match =
    query && value.toLowerCase().includes(query.toLowerCase());
  return (
    <span
      className={cn(
        "transition-colors",
        match && "rounded bg-amber-400/30 px-1 font-medium",
        emphasize && "font-semibold text-brand"
      )}
    >
      {value}
    </span>
  );
}

function ScenarioBtn({
  icon,
  title,
  sub,
  tone,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  tone: "emerald" | "sky" | "rose" | "amber";
  onClick: () => void;
}) {
  const tones: Record<string, string> = {
    emerald: "text-emerald-500",
    sky: "text-sky-500",
    rose: "text-rose-500",
    amber: "text-amber-500",
  };
  return (
    <button
      onClick={onClick}
      className="group rounded-xl border border-border bg-surface p-3 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand/40"
    >
      <span className={cn("inline-flex", tones[tone])}>{icon}</span>
      <p className="mt-2 text-sm font-semibold">{title}</p>
      <p className="text-[11px] text-muted">{sub}</p>
    </button>
  );
}
