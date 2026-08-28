import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function updateSession(
    request: NextRequest,
    response: NextResponse
) {
    const supabaseResponse = response;

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },

                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );

                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const { data } = await supabase.auth.getClaims();

    const isLoggedIn = !!data;

    const isRecovery =
        data?.claims.amr?.some(
            (item) =>
                typeof item !== "string" &&
                item.method === "recovery"
        ) ?? false;

    const pathname = request.nextUrl.pathname;

    const locale = pathname.startsWith("/en") ? "en" : "es";

    // ----------------------------------------
    // Routes
    // ----------------------------------------

    const loginPath = `/${locale}/auth/login`;
    const signUpPath = `/${locale}/auth/sign-up`;
    const signUpSuccessPath = `/${locale}/auth/sign-up-success`;
    const forgotPasswordPath = `/${locale}/auth/forgot-password`;
    const updatePasswordPath = `/${locale}/auth/update-password`;
    const isLoginPath = `/${locale}/auth/is-login`;
    const protectedPath = `/${locale}/protected`;
    const accountRegisterPath = `/${locale}/auth/account-register`

    // Routes accessible without authentication
    const publicAuthRoutes = [
        loginPath,
        signUpPath,
        forgotPasswordPath,
    ];

    // Routes that require a normal authenticated session
    const authenticatedOnlyRoutes = [
        isLoginPath,
        signUpSuccessPath,
        updatePasswordPath,
        protectedPath,
        accountRegisterPath
    ];

    const isPublicAuthRoute = publicAuthRoutes.includes(pathname);
    const isAuthenticatedOnlyRoute =
        authenticatedOnlyRoutes.includes(pathname);

    // ----------------------------------------
    // 1. User is recovering password
    // ----------------------------------------

    if (isRecovery) {
        // During recovery, the user can ONLY access update-password
        if (pathname !== updatePasswordPath) {
            const url = request.nextUrl.clone();

            url.pathname = updatePasswordPath;

            return NextResponse.redirect(url);
        }

        return supabaseResponse;
    }

    // ----------------------------------------
    // 2. User is logged in normally
    // ----------------------------------------

    if (isLoggedIn) {
        // Auth pages and pages that should not be
        // accessible after authentication
        if (
            isPublicAuthRoute ||
            pathname === signUpSuccessPath ||
            pathname === updatePasswordPath
        ) {
            const url = request.nextUrl.clone();

            url.pathname = isLoginPath;

            return NextResponse.redirect(url);
        }

        // is-login is allowed for authenticated users
        return supabaseResponse;
    }

    // ----------------------------------------
    // 3. User isn't logged in
    // ----------------------------------------

    // Routes that require authentication
    if (isAuthenticatedOnlyRoute) {
        const url = request.nextUrl.clone();

        url.pathname = loginPath;

        return NextResponse.redirect(url);
    }

    // Public routes are allowed
    return supabaseResponse;
}