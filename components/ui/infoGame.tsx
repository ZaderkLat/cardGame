"use client";

import { useEffect, useRef } from "react";

type Log = {
    message: string;
    type?: "info" | "win" | "lose";
};

export default function GameLog({ info }: { info: Log[] }) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [info]);

    return (
        <div
            ref={containerRef}
            className="w-full h-150 overflow-y-auto font-mono text-sm p-3
             rounded-lg border dark:border-zinc-700 dark:bg-black dark:text-green-400
             bg-white border-zinc-700 text-green-700"
        >
            {info.map((log, index) => (
                <div
                    key={index}
                    className={`animate-fadeIn ${log.type === "win"
                        ? "text-green-400"
                        : log.type === "lose"
                            ? "text-red-400"
                            : "dark:text-zinc-300 text-black"
                        }`}
                >
                    {log.message}
                </div>
            ))}
        </div>
    );
}