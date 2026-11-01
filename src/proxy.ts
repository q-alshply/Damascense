import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The admin area is not localized and is guarded by Supabase auth.
  if (pathname.startsWith("/admin")) {
    return updateSession(request);
  }

  return intlMiddleware(request) ?? NextResponse.next();
}

export const config = {
  // Match everything except Next internals and static files.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
