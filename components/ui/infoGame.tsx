"use client";

import { useEffect, useRef } from "react";
import { LogGame } from "@/interface/gameData";


export default function GameLog({ info }: { info: LogGame[] }) {
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
        <div className="
    flex-1 min-h-0 rounded-lg border h-full w-f
    dark:border-zinc-700
    overflow-hidden
">
            <div
                ref={containerRef}
                className="
            h-full overflow-y-auto p-3
            font-mono text-sm
            dark:bg-black dark:text-green-400
            bg-white text-green-700
        "
            >

                {info.map((log, index) => {
                    if (log.type === "separate") {
                        return (
                            <hr
                                key={index}
                                className="my-2 w-full border-zinc-500/50"
                            />
                        );
                    }

                    return (
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
                    );
                })}

            </div>
        </div>
    );
}