import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { updateSession } from "@/lib/supabase/middleware";

const handleI18nRouting = createMiddleware({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "always",
});

export async function middlewareP(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/api")) {
    const response = NextResponse.next();
    return updateSession(request, response);
  }

  const response = handleI18nRouting(request);


  return await updateSession(request, response);
}

export const config = {
  matcher: [
    // all rutes except:
    // - /api
    // - /_next
    // - /_vercel
    // - (favicon.ico, images, etc.)
    // - robots
    // - sitemap
    "/((?!api|_next|_vercel|robots\\.txt|sitemap\\.xml|.*\\..*).*)",
  ],
};