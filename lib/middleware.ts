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
  // Primero deja que next-intl resuelva el idioma
  const response = handleI18nRouting(request);

  // Luego actualiza la sesión de Supabase utilizando
  // la misma respuesta para conservar las cookies.
  return await updateSession(request, response);
}

export const config = {
  matcher: [
    // all rutes except:
    // - /api
    // - /_next
    // - /_vercel
    // - archivos estáticos (favicon.ico, imágenes, etc.)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};