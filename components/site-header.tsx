"use client";

import Link from "next/link";
import { Boxes } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-border/70 bg-bg/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white shadow-glow">
            <Boxes className="h-[18px] w-[18px]" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            Tech Concepts{" "}
            <span className="text-muted">for PMs</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/api-module"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-fg sm:block"
          >
            API Module
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
