import { type NextRequest } from "next/server";
import { middlewareP } from "@/lib/middleware"

export async function proxy(request: NextRequest) {
  return await middlewareP(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
