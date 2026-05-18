import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginScreen } from "@/components/auth/login-screen";

export const metadata: Metadata = {
  title: "Sign in · PMverse",
  description:
    "Sign in with Google to access interactive technical learning modules built for Product Managers.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirectedFrom?: string; error?: string };
}) {
  // Defense-in-depth: middleware already bounces authed users, but if
  // a session exists by the time this renders, skip the login screen.
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(searchParams.redirectedFrom || "/");
  }

  return (
    <LoginScreen
      redirectedFrom={searchParams.redirectedFrom}
      error={searchParams.error}
    />
  );
}
