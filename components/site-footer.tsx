"use client";

import { usePathname } from "next/navigation";
import { Boxes, Mail } from "lucide-react";

const NAME = "Soham Chotalia";
const EMAIL = "sohamssb102@gmail.com";

export function SiteFooter() {
  const pathname = usePathname();

  // The login/auth screens are standalone, full-bleed experiences.
  if (pathname === "/login" || pathname.startsWith("/auth")) {
    return null;
  }

  return (
    <footer className="border-t border-border/70 bg-bg/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm sm:flex-row">
        <div className="flex items-center gap-2.5 text-muted">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand text-white">
            <Boxes className="h-4 w-4" />
          </span>
          <span>
            Created by{" "}
            <span className="font-semibold text-fg">{NAME}</span>
          </span>
        </div>

        <a
          href={`mailto:${EMAIL}`}
          className="inline-flex items-center gap-2 text-muted transition-colors hover:text-brand"
        >
          <Mail className="h-4 w-4" />
          {EMAIL}
        </a>
      </div>
    </footer>
  );
}
