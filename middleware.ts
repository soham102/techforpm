import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on every route EXCEPT:
     *  - Next.js internals (_next/static, _next/image)
     *  - the favicon
     *  - common static asset extensions
     * Everything else (/, /login, /api-module, /databases, …) is gated.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
