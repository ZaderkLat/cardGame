"use client";

import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/user/logout-button";
import { useRouter } from "next/navigation";
import { Router } from "lucide-react";

export function TopBar() {
    const { user, loading } = useUser();
    const router = useRouter();
    if (loading) return null;

    return (
        <div className="w-full h-16 px-6 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">

            {/* Left */}
            <h1 className="text-lg font-bold">
                🎮 Twenty One
            </h1>

            {/* Right */}
            <div className="flex items-center gap-4">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {user?.isGuest ? "Guest:" : "Player:"}{" "}
                    <span className="font-semibold text-zinc-900 dark:text-white">
                        {user?.name}
                    </span>
                </span>

                {user?.isGuest ? (
                    <Button
                         variant={"outline"}
                        onClick={() => {
                            router.push("/auth/login"); //
                            // Handle login action
                        }}
                    >
                        Login
                    </Button>
                ) : (
                    <LogoutButton />
                )}
            </div>
        </div>
    );
}