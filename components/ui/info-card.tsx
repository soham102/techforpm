"use client";

import { motion } from "framer-motion";
import { getIcon, type IconName } from "@/lib/icons";

export interface InfoCardData {
  icon: IconName;
  title: string;
  body: string;
}

/** Reusable icon + title + body card for explanatory grids. */
export function InfoCard({
  data,
  index = 0,
}: {
  data: InfoCardData;
  index?: number;
}) {
  const Icon = getIcon(data.icon);
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      className="rounded-2xl border border-border bg-surface p-6 shadow-soft transition-shadow hover:shadow-soft-lg"
    >
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-base font-semibold">{data.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{data.body}</p>
    </motion.div>
  );
}
