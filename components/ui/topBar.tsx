"use client";

import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ConfigMenu from "@/components/user/configMenu";
import { Skeleton } from "@/components/ui/skeleton";

import { useTranslations } from "next-intl";
export function TopBar() {
    const { user, loading } = useUser();
    const router = useRouter();
    const t = useTranslations("topBar")

    return (
        <div className="w-full h-12 px-2 py-2 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">

            {/* Left */}
            <Button className="bg-transparent transition duration-500 hover:scale-115 flex justify-center items-center "
                onClick={() =>
                    window.location.href = "/"
                }

            >
                <h1 className="text-lg font-bold text-black dark:text-white">
                    🎮 {t("homePage")}
                </h1>
            </Button>


            {/* Right */}
            <div className="flex items-center gap-4">

                {loading ? (
                    <>
                        {/* Username skeleton */}
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-24" />
                        </div>

                        {/* Button skeleton */}
                        <Skeleton className="h-9 w-9 rounded-md" />
                    </>
                ) : (
                    <>
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            {t("username")}:{" "}
                            <span className="font-semibold text-zinc-900 dark:text-white">
                                {user?.name}
                            </span>
                        </span>

                        {user?.isGuest ? (
                            <div className="flex flex-row gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        router.push("/auth/login");
                                    }}
                                >
                                    {t("login")}
                                </Button>
                                <ConfigMenu />
                            </div>


                        ) : (
                            <ConfigMenu />
                        )}
                    </>
                )}

            </div>
        </div>
    );
}