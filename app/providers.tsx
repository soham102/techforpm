"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { AuthProvider } from "@/components/auth/auth-provider";

export function Providers({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
}) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || (posthog as { __loaded?: boolean }).__loaded) return;

    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: true,
      capture_pageleave: true,
      // We call posthog.identify() ourselves from the AuthProvider.
      person_profiles: "identified_only",
    });
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
    </PostHogProvider>
  );
}
