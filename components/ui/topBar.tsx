"use client";

import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ConfigMenu from "@/components/user/configMenu";
import { Skeleton } from "@/components/ui/skeleton";
import { ModeToggle } from "@/components/ui/modeToggle";

export function TopBar() {
    const { user, loading } = useUser();
    const router = useRouter();

    return (
        <div className="w-full h-16 px-6 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">

            {/* Left */}
            <h1 className="text-lg font-bold">
                🎮 Twenty One
            </h1>

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
                            Username:{" "}
                            <span className="font-semibold text-zinc-900 dark:text-white">
                                {user?.name}
                            </span>
                        </span>

                        {user?.isGuest ? (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    router.push("/auth/login");
                                }}
                            >
                                Login
                            </Button>
                        ) : (
                            <ConfigMenu />
                        )}
                    </>
                )}
                <ModeToggle />
            </div>
        </div>
    );
}