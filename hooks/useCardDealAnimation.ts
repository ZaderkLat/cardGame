"use client";

import { useRef, useState } from "react";
import { nextFrame } from "@/lib/utils";

interface Position {
    x: number;
    y: number;
}

interface Size {
    width: number;
    height: number;
}

export function useCardDealAnimation() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const targetRef = useRef<HTMLDivElement>(null);

    const [placeholder, setPlaceholder] = useState(false);

    const [startPosition, setStartPosition] = useState<Position>({
        x: 0,
        y: 0,
    });

    const [endPosition, setEndPosition] = useState<Position>({
        x: 0,
        y: 0,
    });

    const [size, setSize] = useState<Size>({
        width: 0,
        height: 0,
    });

    const prepareAnimation = async (
        deckElement: HTMLElement
    ) => {
        if (!scrollRef.current) {
            throw new Error("No se encontró el scroll");
        }

        // 1. Show placeholder
        setPlaceholder(true);

        // 2. Wait next react render
        await nextFrame();

        const scrollElement = scrollRef.current;

        if (!targetRef.current) {
            throw new Error("No se encontró el target");
        }

        // 3. Scroll to the right
        scrollElement.scrollTo({
            left: scrollElement.scrollWidth,
            behavior: "smooth",
        });

        // 4. Wait for the scroll finished
        await new Promise<void>((resolve) => {
            const start = performance.now();

            const waitForScroll = () => {
                const elapsed = performance.now() - start;

                const maxScroll =
                    scrollElement.scrollWidth -
                    scrollElement.clientWidth;

                const reachedRight =
                    Math.abs(
                        scrollElement.scrollLeft - maxScroll
                    ) < 2;

                if (reachedRight || elapsed >= 400) {
                    resolve();
                    return;
                }

                requestAnimationFrame(waitForScroll);
            };

            requestAnimationFrame(waitForScroll);
        });

        // 5. Wait next react render, again
        await nextFrame();

        // 6. Get real positions
        const deckRect =
            deckElement.getBoundingClientRect();

        const targetRect =
            targetRef.current.getBoundingClientRect();

        // 7. Save positions
        setStartPosition({
            x: deckRect.left,
            y: deckRect.top,
        });

        setEndPosition({
            x: targetRect.left,
            y: targetRect.top,
        });

        setSize({
            width: targetRect.width,
            height: targetRect.height,
        });
    };

    const reset = () => {
        setPlaceholder(false);
    };

    return {
        scrollRef,
        targetRef,

        placeholder,

        startPosition,
        endPosition,
        size,

        prepareAnimation,
        reset,
    };
}