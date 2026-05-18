"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import {
  AUTH_EVENTS,
  identifyUser,
  resetAnalytics,
  track,
} from "@/lib/analytics";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  /** True until the initial session has been resolved. */
  loading: boolean;
  signInWithGoogle: (redirectedFrom?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  /** Hydrated from the server so the first paint already knows the user. */
  initialUser?: User | null;
}) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [user, setUser] = useState<User | null>(initialUser);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(!initialUser);
  const identifiedRef = useRef<string | null>(null);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);

      const u = nextSession?.user;
      if (u && identifiedRef.current !== u.id) {
        identifiedRef.current = u.id;
        identifyUser(u.id, {
          email: u.email,
          name:
            u.user_metadata?.full_name ?? u.user_metadata?.name ?? undefined,
          provider: u.app_metadata?.provider,
        });
        if (event === "SIGNED_IN") {
          track(AUTH_EVENTS.loginSuccess, { provider: "google" });
        }
      }

      // Keep Server Components in sync with the new auth state.
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        router.refresh();
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const signInWithGoogle = useCallback(
    async (redirectedFrom?: string) => {
      track(AUTH_EVENTS.loginStarted, { provider: "google" });

      const callbackUrl = new URL(
        "/auth/callback",
        window.location.origin
      );
      if (redirectedFrom) {
        callbackUrl.searchParams.set("redirectedFrom", redirectedFrom);
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl.toString(),
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        track(AUTH_EVENTS.authError, {
          provider: "google",
          message: error.message,
        });
        throw error;
      }
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    track(AUTH_EVENTS.logout);
    await supabase.auth.signOut();
    resetAnalytics();
    identifiedRef.current = null;
    router.replace("/login");
    router.refresh();
  }, [supabase, router]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, session, loading, signInWithGoogle, signOut }),
    [user, session, loading, signInWithGoogle, signOut]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within an <AuthProvider>");
  }
  return ctx;
}
