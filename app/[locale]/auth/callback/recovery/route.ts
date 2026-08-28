import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/server";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);

    const code = requestUrl.searchParams.get("code");

    const locale = requestUrl.pathname.startsWith("/en")
        ? "en"
        : "es";

    if (!code) {
        return NextResponse.redirect(
            new URL(
                `/${locale}/auth/error?error=Missing%20code`,
                request.url
            )
        );
    }

    const supabase = await createClient();

    const { error } =
        await supabase.auth.exchangeCodeForSession(code);

    if (error) {
        return NextResponse.redirect(
            new URL(
                `/${locale}/auth/error?error=${encodeURIComponent(error.message)}`,
                request.url
            )
        );
    }

    return NextResponse.redirect(
        new URL(
            `/${locale}/auth/update-password`,
            request.url
        )
    );
}