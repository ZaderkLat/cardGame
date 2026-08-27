"use client";

import { useTranslations } from "next-intl";
import { useRouter } from '@/i18n/navigation'
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
export function IsLogin() {
    const t = useTranslations("isLogin");
    const router = useRouter();

    const { user, loading } = useUser();

    const handleLogin = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/auth/login");
    };

    const handleLogOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/");
    };

    const handleHome = () => {
        router.push("/");
    };

    if (loading) {
        return (
            <div className="rounded-xl border bg-card p-6 text-center shadow-sm md:p-8">
                <Skeleton className="mx-auto h-8 w-64" />

                <div className="mt-3 space-y-2">
                    <Skeleton className="mx-auto h-4 w-full max-w-sm" />
                    <Skeleton className="mx-auto h-4 w-4/5 max-w-sm" />
                </div>

                <div className="mt-6 flex flex-col gap-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border bg-card p-6 text-center shadow-sm md:p-8">
            <h1 className="text-2xl font-bold tracking-tight">
                {t("title")}
            </h1>

            <p className="mt-3 text-sm text-muted-foreground">
                {t("description", {
                    name: user?.name ?? "",
                })}
            </p>

            <div className="mt-6 flex flex-col gap-3">
                <Button
                    onClick={() => handleLogin()}
                    className="h-12 shadow-xl dark:text-white text-lg font-semibold bg-blue-500
                    hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 
                     transition-all hover:scale-105"

                >
                    {t("login")}
                </Button>

                <Button
                    type="button"
                    onClick={handleLogOut}
                    className="h-12 shadow-xl dark:text-white  text-lg font-semibold bg-red-500
                    hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition-all hover:scale-105"
                >
                    {t("logOut")}
                </Button>

                <Button
                    type="button"
                    onClick={handleHome}
                    className="h-12 shadow-xl dark:text-white text-lg font-semibold border-border bg-background
                     hover:bg-zinc-200 text-zinc-800 dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
                    variant="animation"
                >
                    {t("home")}
                </Button>
            </div>
        </div>
    );
}