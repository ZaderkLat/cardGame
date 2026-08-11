"use client";

import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface RoundsSelectorProps {
    value: number;
    onChange: React.Dispatch<React.SetStateAction<number>>;
}

export default function QuantitySelector({
    value,
    onChange,
}: RoundsSelectorProps) {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const changeValue = (delta: number) => {
        onChange(prev =>
            Math.min(15, Math.max(1, prev + delta))
        );
    };

    const startChanging = (delta: number) => {
        // Primer cambio instantáneo
        changeValue(delta);

        // Espera un poco antes de empezar la repetición
        timeoutRef.current = setTimeout(() => {
            intervalRef.current = setInterval(() => {
                changeValue(delta);
            }, 75);
        }, 350);
    };

    const stopChanging = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    return (
        <div className="flex items-center gap-3">
            <Button
                variant="outline"
                onMouseDown={() => startChanging(-1)}
                onMouseUp={stopChanging}
                onMouseLeave={stopChanging}
                onTouchStart={() => startChanging(-1)}
                onTouchEnd={stopChanging}
            >
                -
            </Button>

            <input
                type="number"
                min={1}
                max={15}
                value={value}
                onChange={(e) => {
                    const raw = e.target.value;

                    if (raw === "") return;

                    const parsed = Number(raw);

                    if (!Number.isNaN(parsed)) {
                        onChange(
                            Math.min(15, Math.max(1, parsed))
                        );
                    }
                }}
                className="
                    no-spinner
                    w-16
                    rounded-md
                    border
                    bg-background
                    px-2
                    py-1
                    text-center
                    font-bold
                "
            />

            <Button
                variant="outline"
                onMouseDown={() => startChanging(1)}
                onMouseUp={stopChanging}
                onMouseLeave={stopChanging}
                onTouchStart={() => startChanging(1)}
                onTouchEnd={stopChanging}
            >
                +
            </Button>
        </div>
    );
}