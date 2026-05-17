"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Users, Scale, Server } from "lucide-react";
import { cn } from "@/lib/utils";

const SERVERS = [1, 2, 3, 4];

/**
 * Section 3 — the improved architecture. Requests no longer hit one server;
 * they pass through the load balancer, which fans them out evenly. The bars
 * show every server staying healthy instead of one melting down.
 */
export function LbArchitecture() {
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setTick((v) => v + 1), 1400);
    return () => clearInterval(t);
  }, [reduce]);

  // Gentle, healthy utilisation that breathes a little.
  const util = SERVERS.map(
    (s) => 34 + ((tick + s) % 4) * 7 + (s % 2 ? 4 : 0)
  );

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
      <div className="grid items-center gap-6 md:grid-cols-[auto_auto_auto_1fr]">
        {/* Users */}
        <div className="text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl border border-border bg-bg text-brand">
            <Users className="h-6 w-6" />
          </span>
          <p className="mt-2 text-xs font-medium text-muted">Users</p>
        </div>

        {/* Animated requests into balancer */}
        <div className="relative hidden h-16 w-16 md:block">
          {!reduce &&
            Array.from({ length: 4 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute left-0 top-1/2 h-2 w-2 rounded-full bg-brand"
                animate={{ x: [0, 64], opacity: [0, 1, 0] }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  delay: i * 0.28,
                }}
              />
            ))}
        </div>

        {/* Load balancer */}
        <div className="text-center">
          <motion.span
            animate={reduce ? {} : { scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="grid h-16 w-16 place-items-center rounded-2xl border border-brand/40 bg-brand-soft text-brand shadow-glow"
          >
            <Scale className="h-7 w-7" />
          </motion.span>
          <p className="mt-2 text-xs font-semibold text-brand">
            Load balancer
          </p>
        </div>

        {/* Servers */}
        <div className="grid gap-3 sm:grid-cols-2">
          {SERVERS.map((s, i) => (
            <div
              key={s}
              className="relative overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3"
            >
              {/* request lands pulse */}
              {!reduce && (
                <motion.span
                  className="absolute left-2 top-1/2 h-1.5 w-1.5 rounded-full bg-emerald-500"
                  animate={{ x: [-12, 4], opacity: [0, 1, 0] }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    delay: i * 0.22,
                  }}
                />
              )}
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium">Server {s}</span>
                <span className="ml-auto text-xs font-semibold tabular-nums text-emerald-500">
                  {util[i]}%
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
                <motion.div
                  className="h-full rounded-full bg-emerald-500"
                  animate={{ width: `${util[i]}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        {[
          {
            t: "Distributes intelligently",
            b: "Each new request is handed to a server with room to spare.",
          },
          {
            t: "Spreads the load",
            b: "No single server sees all the traffic, so none melts down.",
          },
          {
            t: "Keeps everything healthy",
            b: "Utilisation stays in a safe range even as users pour in.",
          },
        ].map((c) => (
          <div
            key={c.t}
            className="rounded-xl border border-border bg-bg p-4"
          >
            <p className="text-sm font-semibold">{c.t}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">
              {c.b}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="font-semibold text-brand">In plain terms: </span>
        The load balancer is a smart traffic manager. It sits in front of every
        server and decides, request by request, where traffic should go.
      </p>
    </div>
  );
}
