"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Play,
  CheckCircle2,
  XCircle,
  Eye,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Table2,
  Code2,
  BookOpen,
  Sparkles,
  Award,
  Clock,
  ChevronRight,
  Terminal,
  Plus,
  Cpu,
} from "lucide-react";
import type { Scenario, ChartPoint } from "./data";
import { cn } from "@/lib/utils";

// ─── SQL Validator ────────────────────────────────────────────────────────────
type ValidationResult = { ok: true } | { ok: false; error: string };

function stripComments(sql: string): string {
  return sql.replace(/--[^\n]*/g, "").trim();
}

// Returns the set of structural SQL clauses used in a query.
// Used to compare what the ideal solution requires vs what the user wrote.
function getStructuralElements(sql: string): Set<string> {
  const u = stripComments(sql).toUpperCase().replace(/\s+/g, " ");
  const s = new Set<string>();
  if (/\bWHERE\b/.test(u)) s.add("WHERE");
  if (/\bGROUP\s+BY\b/.test(u)) s.add("GROUP BY");
  if (/\bHAVING\b/.test(u)) s.add("HAVING");
  if (/\bORDER\s+BY\b/.test(u)) s.add("ORDER BY");
  if (/\bLIMIT\b/.test(u)) s.add("LIMIT");
  if (/\bLEFT\s+(OUTER\s+)?JOIN\b/.test(u)) s.add("LEFT JOIN");
  else if (/\bJOIN\b/.test(u)) s.add("JOIN");
  if (/\bDISTINCT\b/.test(u)) s.add("DISTINCT");
  if (/\bCOUNT\s*\(/.test(u)) s.add("COUNT");
  if (/\bSUM\s*\(/.test(u)) s.add("SUM");
  if (/\bAVG\s*\(/.test(u)) s.add("AVG");
  if (/\b(MAX|MIN)\s*\(/.test(u)) s.add("MAX_MIN");
  if (/\bLIKE\b/.test(u)) s.add("LIKE");
  if (/\bBETWEEN\b/.test(u)) s.add("BETWEEN");
  if (/\bIS\s+(NOT\s+)?NULL\b/.test(u)) s.add("IS_NULL");
  if (/\bCASE\s+WHEN\b/.test(u)) s.add("CASE_WHEN");
  if (/\bIN\s*\(/.test(u)) s.add("IN");
  return s;
}

const ELEMENT_HINT: Record<string, string> = {
  "WHERE":     "Add a WHERE clause to filter rows as the question requires.",
  "GROUP BY":  "Group your results with GROUP BY.",
  "HAVING":    "Filter grouped results with HAVING.",
  "ORDER BY":  "Sort your results with ORDER BY.",
  "LIMIT":     "Cap the result count with LIMIT.",
  "JOIN":      "You need to JOIN another table for this query.",
  "LEFT JOIN": "Use LEFT JOIN to include all rows from the left table.",
  "DISTINCT":  "Use DISTINCT to remove duplicate values.",
  "COUNT":     "Count rows using COUNT().",
  "SUM":       "Total the values using SUM().",
  "AVG":       "Calculate the average using AVG().",
  "MAX_MIN":   "Find the extreme value using MAX() or MIN().",
  "LIKE":      "Match text patterns using LIKE with % wildcards.",
  "BETWEEN":   "Filter a range using BETWEEN x AND y.",
  "IS_NULL":   "Check for missing values using IS NULL or IS NOT NULL.",
  "CASE_WHEN": "Use CASE WHEN ... THEN ... END for conditional output.",
  "IN":        "Match multiple values using IN (...).",
};

function validateSQL(query: string, scenario: Scenario): ValidationResult {
  const stripped = stripComments(query);
  const upper = stripped.toUpperCase().replace(/\s+/g, " ").trim();

  // 1. Basic syntax
  if (!stripped) {
    return { ok: false, error: "Query is empty — write a SQL SELECT statement to continue." };
  }
  if (!/^SELECT\b/.test(upper)) {
    return { ok: false, error: `SQL must start with SELECT — found "${stripped.split(/\s/)[0]}" instead.` };
  }
  if (!upper.includes(" FROM ") && !/\bFROM$/.test(upper)) {
    return { ok: false, error: "Missing FROM clause — specify which table to query." };
  }
  const opens = (stripped.match(/\(/g) ?? []).length;
  const closes = (stripped.match(/\)/g) ?? []).length;
  if (opens !== closes) {
    return { ok: false, error: `Unmatched parentheses — ${opens} opening '(' vs ${closes} closing ')'.` };
  }

  // 2. Concept fast-fail for foundation scenarios
  if (scenario.sqlConcept) {
    const conceptRe: Record<string, { re: RegExp; hint: string }> = {
      "SELECT *":       { re: /SELECT\s+\*/,                  hint: "Use SELECT * to retrieve all columns." },
      "SELECT columns": { re: /SELECT\s+\w/,                  hint: "Name specific columns after SELECT." },
      "WHERE":          { re: /\bWHERE\b/,                    hint: "Filter rows with a WHERE clause." },
      "AND/OR":         { re: /\b(AND|OR)\b/,                 hint: "Combine conditions with AND or OR." },
      "ORDER BY":       { re: /\bORDER\s+BY\b/,               hint: "Sort results with ORDER BY." },
      "LIMIT":          { re: /\bLIMIT\b/,                    hint: "Cap results with LIMIT." },
      "COUNT":          { re: /\bCOUNT\s*\(/,                hint: "Count rows with COUNT()." },
      "SUM":            { re: /\bSUM\s*\(/,                   hint: "Total a column with SUM()." },
      "AVG":            { re: /\bAVG\s*\(/,                   hint: "Calculate the average with AVG()." },
      "MAX/MIN":        { re: /\b(MAX|MIN)\s*\(/,             hint: "Find extremes with MAX() or MIN()." },
      "DISTINCT":       { re: /\bDISTINCT\b/,                hint: "Use SELECT DISTINCT to remove duplicates." },
      "GROUP BY":       { re: /\bGROUP\s+BY\b/,              hint: "Aggregate rows with GROUP BY." },
      "HAVING":         { re: /\bHAVING\b/,                   hint: "Filter grouped results with HAVING." },
      "LIKE":           { re: /\bLIKE\b/,                    hint: "Match text with LIKE and % wildcards." },
      "IN":             { re: /\bIN\s*\(/,                    hint: "Match a list of values with IN (...)." },
      "BETWEEN":        { re: /\bBETWEEN\b/,                hint: "Filter a range with BETWEEN x AND y." },
      "IS NULL":        { re: /\bIS\s+(NOT\s+)?NULL\b/,      hint: "Check missing data with IS NULL." },
      "CASE WHEN":      { re: /\bCASE\s+WHEN\b/,            hint: "Use CASE WHEN ... THEN ... END." },
      "INNER JOIN":     { re: /\bJOIN\b/,                    hint: "Combine tables with JOIN tableName ON condition." },
      "LEFT JOIN":      { re: /\bLEFT\s+(OUTER\s+)?JOIN\b/, hint: "Include all left-table rows with LEFT JOIN." },
    };
    const cr = conceptRe[scenario.sqlConcept];
    if (cr && !cr.re.test(upper)) {
      return { ok: false, error: `Incorrect query — ${cr.hint}` };
    }
  }

  // 3. Solution-based structural check
  // Every SQL clause present in the ideal solution must appear in the user's query.
  // This catches e.g. writing SELECT * without the required WHERE clause.
  const required = getStructuralElements(scenario.challenge.solution);
  const provided = getStructuralElements(query);
  for (const el of Array.from(required)) {
    if (!provided.has(el)) {
      return {
        ok: false,
        error: `Incomplete query — ${ELEMENT_HINT[el] ?? `Missing ${el}.`}`,
      };
    }
  }

  return { ok: true };
}

// ─── SVG Line Chart ───────────────────────────────────────────────────────────
function LineChart({ data }: { data: ChartPoint[] }) {
  const W = 320;
  const H = 100;
  const pad = { t: 8, r: 8, b: 28, l: 36 };
  const iW = W - pad.l - pad.r;
  const iH = H - pad.t - pad.b;
  const vals = data.map((d) => d.value);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const pts = data.map((d, i) => ({
    x: pad.l + (i / (data.length - 1)) * iW,
    y: pad.t + (1 - (d.value - min) / range) * iH,
    label: d.label,
    value: d.value,
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${pts[pts.length - 1].x},${H - pad.b} L${pts[0].x},${H - pad.b}Z`;

  const yStep = range / 3;
  const yTicks = [0, 1, 2, 3].map((i) => ({
    val: (min + i * yStep).toFixed(1),
    y: pad.t + (1 - (i * yStep) / range) * iH,
  }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(129 140 248)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="rgb(129 140 248)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Y axis ticks */}
      {yTicks.map((t) => (
        <g key={t.val}>
          <line
            x1={pad.l}
            y1={t.y}
            x2={W - pad.r}
            y2={t.y}
            stroke="rgb(39 41 54)"
            strokeWidth="0.5"
          />
          <text x={pad.l - 4} y={t.y + 3} textAnchor="end" fontSize="7" fill="rgb(107 114 128)">
            {t.val}
          </text>
        </g>
      ))}
      {/* Area fill */}
      <motion.path
        d={area}
        fill="url(#lineGrad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      {/* Line */}
      <motion.path
        d={line}
        fill="none"
        stroke="rgb(129 140 248)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      {/* Dots + labels */}
      {pts.map((p, i) => (
        <g key={i}>
          <motion.circle
            cx={p.x}
            cy={p.y}
            r="2.5"
            fill="rgb(129 140 248)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 + i * 0.05 }}
          />
          <text x={p.x} y={H - 8} textAnchor="middle" fontSize="7.5" fill="rgb(107 114 128)">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ─── SVG Bar Chart ────────────────────────────────────────────────────────────
function BarChart({ data }: { data: ChartPoint[] }) {
  const W = 320;
  const H = 100;
  const pad = { t: 8, r: 8, b: 28, l: 8 };
  const iW = W - pad.l - pad.r;
  const iH = H - pad.t - pad.b;
  const max = Math.max(...data.map((d) => d.value));
  const slotW = iW / data.length;
  const barW = slotW * 0.55;
  const gap = (slotW - barW) / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      {data.map((d, i) => {
        const barH = (d.value / max) * iH;
        const x = pad.l + i * slotW + gap;
        const y = pad.t + iH - barH;
        return (
          <g key={i}>
            <motion.rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx="2"
              fill="rgb(129 140 248)"
              fillOpacity="0.75"
              initial={{ scaleY: 0, originY: 1 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: "easeOut" }}
            />
            <text
              x={x + barW / 2}
              y={H - 8}
              textAnchor="middle"
              fontSize="7"
              fill="rgb(107 114 128)"
            >
              {d.label.length > 6 ? d.label.slice(0, 5) + "…" : d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── KPI Card ────────────────────────────────────────────────────────────────
function KPICard({ kpi }: { kpi: { label: string; value: string; delta: string; up: boolean } }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3.5 shadow-soft">
      <p className="text-xs text-muted">{kpi.label}</p>
      <p className="mt-1 text-xl font-bold tracking-tight">{kpi.value}</p>
      <p
        className={cn(
          "mt-0.5 flex items-center gap-1 text-xs font-medium",
          kpi.up ? "text-emerald-500" : "text-rose-500"
        )}
      >
        {kpi.up ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        {kpi.delta}
      </p>
    </div>
  );
}

// ─── Schema viewer ────────────────────────────────────────────────────────────
function SchemaViewer({ tables }: { tables: Scenario["challenge"]["schema"] }) {
  const [open, setOpen] = useState<string | null>(tables[0]?.name ?? null);
  return (
    <div className="space-y-2">
      {tables.map((table) => (
        <div key={table.name} className="rounded-xl border border-border overflow-hidden">
          <button
            onClick={() => setOpen(open === table.name ? null : table.name)}
            className="flex w-full items-center justify-between px-3 py-2.5 bg-elevated text-left"
          >
            <span className="flex items-center gap-2 text-xs font-semibold text-muted">
              <Table2 className="h-3.5 w-3.5 text-brand" />
              <span className="font-mono text-fg">{table.name}</span>
              <span className="text-muted/60">({table.cols.length} cols)</span>
            </span>
            {open === table.name ? (
              <ChevronUp className="h-3.5 w-3.5 text-muted" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-muted" />
            )}
          </button>

          <AnimatePresence initial={false}>
            {open === table.name && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-3 pb-3 pt-2">
                  {/* Column list */}
                  <div className="mb-2 space-y-1">
                    {table.cols.map((col) => (
                      <div key={col.name} className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-brand">{col.name}</span>
                        <span className="text-muted/60">{col.type}</span>
                      </div>
                    ))}
                  </div>
                  {/* Sample rows */}
                  <div className="rounded-lg border border-border/50 bg-bg/60 overflow-x-auto">
                    <table className="min-w-full text-[10px]">
                      <thead>
                        <tr className="border-b border-border/50">
                          {table.cols.slice(0, 4).map((c) => (
                            <th
                              key={c.name}
                              className="px-2 py-1.5 text-left font-mono font-medium text-muted/70"
                            >
                              {c.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.sampleRows.map((row, ri) => (
                          <tr key={ri} className="border-b border-border/30 last:border-0">
                            {row.slice(0, 4).map((cell, ci) => (
                              <td key={ci} className="px-2 py-1.5 font-mono text-muted">
                                {cell.length > 12 ? cell.slice(0, 12) + "…" : cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// ─── SQL Editor ───────────────────────────────────────────────────────────────
function SQLEditor({
  value,
  onChange,
  placeholder = "-- Write your SQL query here...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const lines = value.split("\n");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = textareaRef.current!;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newVal = value.substring(0, start) + "  " + value.substring(end);
      onChange(newVal);
      setTimeout(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[#09090e] font-mono text-xs">
      {/* Editor chrome */}
      <div className="flex items-center justify-between border-b border-border/50 bg-surface/30 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <span className="ml-2 text-[10px] text-muted/60">query.sql</span>
        </div>
        <Terminal className="h-3.5 w-3.5 text-muted/50" />
      </div>

      {/* Code area */}
      <div className="flex">
        {/* Line numbers */}
        <div
          aria-hidden
          className="select-none border-r border-border/30 bg-black/20 px-3 py-3 text-right leading-[1.6rem] text-muted/40"
          style={{ minWidth: 36 }}
        >
          {lines.map((_, i) => (
            <div key={i} style={{ fontSize: 10 }}>
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-[220px] flex-1 resize-none bg-transparent p-3 text-[11px] leading-[1.6rem] text-emerald-300/90 outline-none placeholder:text-muted/40"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
        />
      </div>
    </div>
  );
}

// ─── Hint panel ───────────────────────────────────────────────────────────────
function HintPanel({ hints }: { hints: string[] }) {
  const [revealed, setRevealed] = useState(0);

  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5">
      <div className="flex items-center gap-2 border-b border-amber-500/20 px-4 py-3">
        <Lightbulb className="h-4 w-4 text-amber-400" />
        <span className="text-xs font-semibold text-amber-400">Hint System</span>
        <span className="ml-auto text-xs text-muted">
          {revealed}/{hints.length} revealed
        </span>
      </div>
      <div className="space-y-2 p-3">
        {hints.map((hint, i) => (
          <div key={i}>
            {i < revealed ? (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-amber-500/10 px-3 py-2.5 text-xs leading-relaxed text-amber-200/80"
              >
                <span className="mr-1.5 font-semibold text-amber-400">Hint {i + 1}:</span>
                {hint}
              </motion.div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-xs text-muted/50">
                <span className="font-medium">Hint {i + 1}</span>
                <span className="flex-1 text-center">— locked —</span>
              </div>
            )}
          </div>
        ))}
        {revealed < hints.length && (
          <button
            onClick={() => setRevealed((r) => r + 1)}
            className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg border border-amber-500/30 py-2 text-xs font-medium text-amber-400 transition-colors hover:bg-amber-500/10"
          >
            <Plus className="h-3.5 w-3.5" />
            Reveal Hint {revealed + 1}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Results table ────────────────────────────────────────────────────────────
function ResultsTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-500/5"
    >
      <div className="flex items-center gap-2 border-b border-emerald-500/20 px-4 py-2.5">
        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        <span className="text-xs font-semibold text-emerald-400">
          Query Results — {rows.length} rows
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="border-b border-emerald-500/10">
              {headers.map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 text-left font-mono font-medium text-emerald-400/70"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={ri}
                className="border-b border-border/20 transition-colors last:border-0 hover:bg-emerald-500/5"
              >
                {row.map((cell, ci) => (
                  <td key={ci} className="px-3 py-2 font-mono text-muted">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// ─── PM Question ──────────────────────────────────────────────────────────────
function PMQuestion({
  question,
  choices,
  correctIndex,
  explanation,
  onSubmit,
}: {
  question: string;
  choices: { text: string }[];
  correctIndex: number;
  explanation: string;
  onSubmit: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    setTimeout(() => onSubmit(selected === correctIndex), 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-brand/25 bg-brand-soft"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-brand/20 px-5 py-4">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white">
          <Cpu className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">
            PM Thinking Challenge
          </p>
          <p className="text-xs text-muted">Think like a Product Manager, not just a data analyst</p>
        </div>
      </div>

      <div className="p-5">
        <p className="text-sm font-medium leading-relaxed">{question}</p>

        <div className="mt-4 space-y-2.5">
          {choices.map((choice, i) => {
            const isCorrect = i === correctIndex;
            const isSelected = i === selected;
            let style = "border-border bg-surface hover:border-brand/40";
            if (submitted) {
              if (isCorrect) style = "border-emerald-500/50 bg-emerald-500/10 text-emerald-200";
              else if (isSelected && !isCorrect)
                style = "border-rose-500/50 bg-rose-500/10 text-rose-200";
              else style = "border-border/50 bg-surface/50 opacity-50";
            } else if (isSelected) {
              style = "border-brand/60 bg-brand/10";
            }

            return (
              <button
                key={i}
                disabled={submitted}
                onClick={() => !submitted && setSelected(i)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all",
                  style
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-full border text-xs font-bold",
                    submitted && isCorrect
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : submitted && isSelected && !isCorrect
                      ? "border-rose-500 bg-rose-500 text-white"
                      : isSelected
                      ? "border-brand bg-brand text-white"
                      : "border-border text-muted"
                  )}
                >
                  {submitted && isCorrect ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : submitted && isSelected && !isCorrect ? (
                    <XCircle className="h-3 w-3" />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                <span className="leading-relaxed">{choice.text}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 overflow-hidden rounded-xl border border-brand/25 bg-bg/60 p-4"
            >
              <p className="mb-1.5 text-xs font-semibold text-brand">Why this answer?</p>
              <p className="text-sm leading-relaxed text-muted">{explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {!submitted && (
          <button
            disabled={selected === null}
            onClick={handleSubmit}
            className="mt-5 w-full rounded-xl bg-brand py-3 text-sm font-semibold text-white shadow-glow transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:opacity-90 active:scale-[0.98]"
          >
            Submit PM Answer
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Insight review ───────────────────────────────────────────────────────────
function InsightReview({
  scenario,
  isCorrect,
  onReset,
}: {
  scenario: Scenario;
  isCorrect: boolean;
  onReset: () => void;
}) {
  const { challenge } = scenario;
  const [tab, setTab] = useState<"sql" | "breakdown" | "recs">("sql");

  const tabs = [
    { key: "sql" as const, label: "Ideal SQL", icon: Code2 },
    { key: "breakdown" as const, label: "Business Breakdown", icon: BookOpen },
    { key: "recs" as const, label: "PM Recommendations", icon: Sparkles },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Score banner */}
      <div
        className={cn(
          "flex flex-wrap items-center gap-4 rounded-2xl border px-5 py-4 sm:flex-nowrap sm:px-6 sm:py-5",
          isCorrect
            ? "border-emerald-500/30 bg-emerald-500/10"
            : "border-amber-500/30 bg-amber-500/10"
        )}
      >
        <span className="text-4xl">{isCorrect ? "🎯" : "💡"}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base">
            {isCorrect ? "Excellent PM Thinking!" : "Good Attempt — Here's the PM Perspective"}
          </h3>
          <p className="mt-0.5 text-xs sm:text-sm text-muted">
            {isCorrect
              ? "You identified the right business lever. Here's the full senior PM review."
              : "Not quite — but this is exactly how you build PM instinct. Read the full breakdown."}
          </p>
        </div>
        <div className="flex flex-col items-center ml-auto">
          <span
            className={cn(
              "text-2xl font-bold",
              isCorrect ? "text-emerald-400" : "text-amber-400"
            )}
          >
            +{isCorrect ? "150" : "75"} XP
          </span>
          <span className="text-xs text-muted">earned</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-2xl border border-border bg-surface shadow-soft">
        <div className="flex border-b border-border overflow-x-auto">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                "flex flex-1 flex-shrink-0 items-center justify-center gap-2 py-3.5 text-xs font-semibold transition-colors whitespace-nowrap px-3",
                tab === key
                  ? "border-b-2 border-brand text-brand"
                  : "text-muted hover:text-fg"
              )}
            >
              <Icon className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <div className="p-5">
          <AnimatePresence mode="wait">
            {tab === "sql" && (
              <motion.div
                key="sql"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <p className="text-xs text-muted">
                  This is the complete, optimized solution. Study the structure — especially how CTEs, JOINs, and aggregations work together.
                </p>
                <div className="overflow-hidden rounded-xl border border-border bg-[#09090e] font-mono text-[11px]">
                  <div className="flex items-center gap-2 border-b border-border/50 bg-surface/20 px-4 py-2">
                    <div className="flex gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-rose-500/60" />
                      <div className="h-2 w-2 rounded-full bg-amber-500/60" />
                      <div className="h-2 w-2 rounded-full bg-emerald-500/60" />
                    </div>
                    <span className="ml-2 text-[10px] text-muted/50">ideal-solution.sql</span>
                  </div>
                  <pre className="overflow-x-auto p-4 leading-relaxed text-emerald-300/90">
                    {challenge.solution}
                  </pre>
                </div>
              </motion.div>
            )}
            {tab === "breakdown" && (
              <motion.div
                key="breakdown"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <p className="text-xs text-muted">
                  What a senior PM sees in this data — the business insight behind the numbers.
                </p>
                {challenge.insightBreakdown.map((insight, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3 rounded-xl border border-border bg-elevated px-4 py-3.5"
                  >
                    <span className="mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-brand/20 text-[10px] font-bold text-brand">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-muted">{insight}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
            {tab === "recs" && (
              <motion.div
                key="recs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <p className="text-xs text-muted">
                  What a PM should actually do next — concrete, prioritized actions.
                </p>
                {challenge.pmRecommendations.map((rec, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3 rounded-xl border border-brand/20 bg-brand-soft px-4 py-3.5"
                  >
                    <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
                    <p className="text-sm leading-relaxed">{rec}</p>
                  </motion.div>
                ))}

                {/* Stakeholder challenge */}
                <div className="mt-4 rounded-xl border border-violet-500/25 bg-violet-500/10 px-4 py-4">
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-violet-400">
                    Stakeholder Challenge
                  </p>
                  <p className="text-sm leading-relaxed text-muted/90 italic">
                    "{challenge.stakeholderQuestion}"
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    Think through your answer — this is the kind of question you'd face in a real PM review meeting.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Reset button */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-2.5 text-sm font-medium text-muted transition-colors hover:text-fg"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>
        <div className="flex items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-6 py-2.5 text-sm font-semibold text-brand">
          <Award className="h-4 w-4" />
          Scenario Completed
        </div>
      </div>
    </motion.div>
  );
}

// ─── XP Progress Bar ──────────────────────────────────────────────────────────
function XPBar({ xp }: { xp: number }) {
  const level = Math.floor(xp / 500) + 1;
  const progress = ((xp % 500) / 500) * 100;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2.5 shadow-soft">
      <Award className="h-4 w-4 text-brand" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-fg">Level {level}</span>
          <span className="text-xs text-muted">{xp} XP</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-elevated">
          <motion.div
            className="h-full rounded-full bg-brand"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Active Simulator ─────────────────────────────────────────────────────────
type Phase = "solving" | "pm-question" | "review";

export function ActiveSimulator({ scenario }: { scenario: Scenario }) {
  const { challenge } = scenario;
  const initialQuery = scenario.sqlConcept ? "" : challenge.starterQuery;
  const [query, setQuery] = useState(initialQuery);
  const [phase, setPhase] = useState<Phase>("solving");
  const [running, setRunning] = useState(false);
  const [queryRan, setQueryRan] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [xp, setXP] = useState(() => {
    if (typeof window === "undefined") return 0;
    return parseInt(localStorage.getItem("pmlab_xp") ?? "0", 10);
  });

  // Persist XP
  useEffect(() => {
    localStorage.setItem("pmlab_xp", String(xp));
  }, [xp]);

  const handleQueryChange = (v: string) => {
    setQuery(v);
    if (queryError) setQueryError(null);
  };

  const handleRunQuery = () => {
    const result = validateSQL(query, scenario);
    if (!result.ok) {
      setQueryError(result.error);
      return;
    }
    setQueryError(null);
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setQueryRan(true);
      setXP((prev) => prev + 50);
    }, 1200);
  };

  const handleShowSolution = () => {
    setQuery(challenge.solution);
    setShowSolution(true);
  };

  const handlePMSubmit = (correct: boolean) => {
    setIsCorrect(correct);
    setXP((prev) => prev + (correct ? 150 : 75));
    setTimeout(() => setPhase("review"), 200);
  };

  const handleReset = () => {
    setQuery(initialQuery);
    setPhase("solving");
    setQueryRan(false);
    setShowSolution(false);
    setQueryError(null);
  };

  return (
    <div className="space-y-6">
      {/* Scenario header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "grid h-12 w-12 place-items-center rounded-xl text-2xl shadow-soft",
              scenario.accentBg
            )}
          >
            {scenario.emoji}
          </span>
          <div>
            <p
              className={cn(
                "text-xs font-semibold uppercase tracking-wider",
                scenario.accentText
              )}
            >
              {scenario.industry} · {scenario.estimatedMinutes} min
            </p>
            <h2 className="text-xl font-semibold tracking-tight">
              {scenario.company} — Analytics Simulation
            </h2>
          </div>
        </div>
        <div className="w-full sm:w-64">
          <XPBar xp={xp} />
        </div>
      </div>

      {/* Business problem banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "rounded-2xl border px-5 py-4",
          scenario.accentBorder,
          scenario.accentBg
        )}
      >
        <p className="text-sm font-semibold leading-relaxed">{challenge.businessProblem}</p>
        <p className="mt-1 text-xs text-muted">
          Analyze the dashboard below, write your SQL query, then answer the PM question.
        </p>
      </motion.div>

      {/* ── Two-panel layout ── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">

        {/* LEFT: Dashboard */}
        <div className="space-y-4">
          {/* KPI grid */}
          <div>
            <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
              <TrendingUp className="h-3.5 w-3.5" />
              Live Metrics
            </p>
            <div className="grid grid-cols-2 gap-3">
              {scenario.kpis.map((kpi) => (
                <KPICard key={kpi.label} kpi={kpi} />
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-xl border border-border bg-surface p-4 shadow-soft">
            <p className="mb-3 text-xs font-semibold text-muted">{scenario.chartLabel}</p>
            {scenario.chartType === "line" ? (
              <LineChart data={scenario.chartData} />
            ) : (
              <BarChart data={scenario.chartData} />
            )}
          </div>

          {/* Schema viewer */}
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
              <Table2 className="h-3.5 w-3.5" />
              Schema Reference
            </p>
            <SchemaViewer tables={challenge.schema} />
          </div>
        </div>

        {/* RIGHT: SQL Editor */}
        <div className="space-y-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
            <Code2 className="h-3.5 w-3.5" />
            SQL Editor
          </p>

          <SQLEditor
            value={query}
            onChange={handleQueryChange}
            placeholder={
              scenario.sqlConcept
                ? `-- ${scenario.sqlConcept} practice\n-- Write your query here and click Run Query`
                : undefined
            }
          />

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRunQuery}
              disabled={running || queryRan}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white shadow-glow transition-all active:scale-[0.98]",
                queryRan
                  ? "cursor-default bg-emerald-600"
                  : "bg-brand hover:opacity-90 disabled:opacity-60"
              )}
            >
              {running ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                  >
                    ⟳
                  </motion.span>
                  Running…
                </>
              ) : queryRan ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Query Executed
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run Query
                </>
              )}
            </button>

            {!showSolution && (
              <button
                onClick={handleShowSolution}
                className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-3 text-sm text-muted transition-colors hover:text-fg"
              >
                <Eye className="h-4 w-4" />
                Show Solution
              </button>
            )}
          </div>

          {/* Query error */}
          <AnimatePresence>
            {queryError && (
              <motion.div
                key="query-error"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/8 px-4 py-3"
              >
                <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-400" />
                <div>
                  <p className="text-xs font-semibold text-rose-400">SQL Error</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-rose-200/80">{queryError}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* XP hint for running */}
          {!queryRan && !queryError && (
            <p className="text-center text-xs text-muted/60">
              Run your query to see the results · +50 XP
            </p>
          )}

          {/* Hint panel */}
          <HintPanel hints={challenge.hints} />

          {/* Skills in this challenge */}
          <div className="flex flex-wrap gap-1.5">
            {scenario.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-border/60 bg-elevated px-2.5 py-1 text-[10px] font-medium text-muted"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Results table (appears after running) */}
      <AnimatePresence>
        {queryRan && (
          <ResultsTable
            headers={challenge.outputHeaders}
            rows={challenge.outputRows}
          />
        )}
      </AnimatePresence>

      {/* PM Question (appears after results) */}
      <AnimatePresence>
        {queryRan && phase === "solving" && (
          <motion.div
            key="pm-q"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
              <Clock className="h-3.5 w-3.5" />
              Next Step — PM Interpretation
            </div>
            <PMQuestion
              question={challenge.pmQuestion}
              choices={challenge.pmChoices}
              correctIndex={challenge.correctPMIndex}
              explanation={challenge.pmExplanation}
              onSubmit={handlePMSubmit}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Insight Review (appears after PM answer) */}
      <AnimatePresence>
        {phase === "review" && (
          <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              Senior PM Review
            </div>
            <InsightReview
              scenario={scenario}
              isCorrect={isCorrect}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

