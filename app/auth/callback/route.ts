import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth redirect target. Google sends the user back here with a
 * `code` which we exchange for a Supabase session cookie, then
 * forward the user to wherever they were originally headed.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectedFrom = searchParams.get("redirectedFrom") ?? "/";
  const oauthError = searchParams.get("error_description");

  // Only allow same-origin relative redirects.
  const safeNext =
    redirectedFrom.startsWith("/") && !redirectedFrom.startsWith("//")
      ? redirectedFrom
      : "/";

  if (oauthError) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(oauthError)}`
    );
  }

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }

    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`
    );
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent("Missing authorization code")}`
  );
}
