"use client";

import { useAuthContext } from "@/components/auth/auth-provider";

/**
 * Primary auth hook for the app.
 *
 * @example
 * const { user, loading, signInWithGoogle, signOut } = useAuth();
 */
export function useAuth() {
  const { user, session, loading, signInWithGoogle, signOut } =
    useAuthContext();

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "Learner";

  const avatarUrl =
    (user?.user_metadata?.avatar_url as string | undefined) ??
    (user?.user_metadata?.picture as string | undefined) ??
    null;

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    displayName,
    avatarUrl,
    email: user?.email ?? null,
    signInWithGoogle,
    signOut,
  };
}
