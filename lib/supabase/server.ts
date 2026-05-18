import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client for Server Components, Route Handlers
 * and Server Actions. Reads/writes the session from Next.js cookies.
 *
 * Note: when called from a Server Component the cookie `set` calls are
 * no-ops (RSCs cannot mutate cookies). Session refresh is handled in
 * `middleware.ts`, so that limitation is expected and safe.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — ignore. Middleware
            // refreshes the session cookie on every request.
          }
        },
      },
    }
  );
}
