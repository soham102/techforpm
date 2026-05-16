"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lightbulb } from "lucide-react";
import { TABLES, SEED_DATA, type TableId } from "@/lib/databases";
import { getIcon } from "@/lib/icons";

/**
 * Section 2 — four clickable QuickBite tables. Selecting one opens a
 * modal with its stored data, why it exists and how the app uses it.
 */
export function TableExplorer() {
  const [open, setOpen] = useState<TableId | null>(null);
  const meta = open ? TABLES[open] : null;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(Object.keys(TABLES) as TableId[]).map((id, i) => {
          const t = TABLES[id];
          const Icon = getIcon(t.icon);
          return (
            <motion.button
              key={id}
              type="button"
              onClick={() => setOpen(id)}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -5 }}
              className="group rounded-2xl border border-border bg-surface p-5 text-left shadow-soft transition-colors hover:border-brand/40 hover:shadow-soft-lg"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand transition-transform group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-4 text-sm font-semibold">{t.name} table</p>
              <p className="mt-1 text-xs text-muted">
                {SEED_DATA[id].length} records · {t.columns.length} columns
              </p>
              <p className="mt-3 text-xs font-medium text-brand">
                Click to open →
              </p>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {meta && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpen(null)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ scale: 0.92, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 8, opacity: 0 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className="relative w-full max-w-lg rounded-2xl border border-border bg-elevated p-6 shadow-soft-lg"
            >
              <button
                onClick={() => setOpen(null)}
                aria-label="Close"
                className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-fg"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = getIcon(meta.icon);
                  return (
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand">
                      <Icon className="h-5 w-5" />
                    </span>
                  );
                })()}
                <h4 className="text-lg font-semibold">{meta.name} table</h4>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Stored data
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {meta.columns.map((c) => (
                    <span
                      key={c}
                      className="rounded-md bg-brand-soft px-2 py-1 font-mono text-[11px] text-brand"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <div className="mt-3 overflow-hidden rounded-xl border border-border">
                  <table className="w-full text-left text-[11px]">
                    <tbody>
                      {SEED_DATA[meta.id].slice(0, 2).map((row, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-border last:border-0"
                        >
                          {meta.columns.map((c) => (
                            <td
                              key={c}
                              className="px-2.5 py-1.5 text-muted"
                            >
                              {row[c]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Block label="Why it exists" body={meta.why} />
                <Block label="How the app uses it" body={meta.appUse} />
              </div>

              <div className="mt-4 flex gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <p className="text-sm leading-relaxed">{meta.insight}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Block({ label, body }: { label: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3">
      <p className="text-xs font-semibold text-brand">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">{body}</p>
    </div>
  );
}
