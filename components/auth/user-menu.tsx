"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LogOut, User as UserIcon, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

function Avatar({
  src,
  name,
  size = 32,
}: {
  src: string | null;
  name: string;
  size?: number;
}) {
  const [broken, setBroken] = useState(false);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (src && !broken) {
    return (
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        className="rounded-full ring-1 ring-border object-cover"
        onError={() => setBroken(true)}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <span
      className="grid place-items-center rounded-full bg-brand text-white text-xs font-semibold ring-1 ring-border"
      style={{ width: size, height: size }}
    >
      {initials || "PM"}
    </span>
  );
}

/**
 * Authenticated navbar control: avatar + name + dropdown with a
 * secure logout. Skeleton while the session resolves.
 */
export function UserMenu() {
  const { loading, isAuthenticated, displayName, email, avatarUrl, signOut } =
    useAuth();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 animate-pulse-soft rounded-full bg-elevated" />
        <div className="hidden h-4 w-20 animate-pulse-soft rounded bg-elevated sm:block" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  async function handleSignOut() {
    setSigningOut(true);
    await signOut();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-border/70 bg-surface/60 py-1 pl-1 pr-2.5 text-sm transition-colors hover:bg-elevated"
      >
        <Avatar src={avatarUrl} name={displayName} />
        <span className="hidden max-w-[9rem] truncate font-medium sm:block">
          {displayName}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            role="menu"
            className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-border bg-elevated shadow-soft-lg"
          >
            <div className="flex items-center gap-3 border-b border-border/70 px-4 py-3.5">
              <Avatar src={avatarUrl} name={displayName} size={40} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {displayName}
                </p>
                {email && (
                  <p className="truncate text-xs text-muted">{email}</p>
                )}
              </div>
            </div>

            <div className="p-1.5">
              <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted">
                <UserIcon className="h-4 w-4" />
                Signed in with Google
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-60"
              >
                {signingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                {signingOut ? "Signing out…" : "Log out"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
