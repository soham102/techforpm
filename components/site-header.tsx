"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./auth/user-menu";

export function SiteHeader() {
  const pathname = usePathname();

  // The login screen is a full-bleed standalone experience.
  if (pathname === "/login" || pathname.startsWith("/auth")) {
    return null;
  }

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
            PMverse
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-fg sm:block"
          >
            Tech Concepts
          </Link>
          <Link
            href="/sql-for-pms"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-fg sm:block"
          >
            SQL for PMs
          </Link>
          <Link
            href="/interview-prep"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-fg sm:block"
          >
            Interview Prep
          </Link>
          <Link
            href="/contact"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-fg sm:block"
          >
            Contact
          </Link>
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </motion.header>
  );
}
