"use client";

import { AnimatePresence, motion } from "motion/react";
import cardStyle from "@/components/ObjectsGame/cardStyle";
import Maze from "@/components/uiGame/maze";

interface FlyingCardProps {
    isDealing: boolean;
    isFlipping: boolean;
    card: any;
    animation: {
        startPosition: {
            x: number;
            y: number;
        };
        endPosition: {
            x: number;
            y: number;
        };
        size: {
            width: number;
            height: number;
        };
    };
}

export default function FlyingCard({
    isDealing,
    isFlipping,
    card,
    animation: { startPosition, endPosition, size },
}: FlyingCardProps) {
    return (
        <AnimatePresence>
            {isDealing && (
                <motion.div
                    className="fixed z-9999 pointer-events-none"
                    style={{
                        perspective: 1000,
                        width: size.width,
                        height: size.height,
                    }}
                    initial={{
                        left: startPosition.x,
                        top: startPosition.y,
                    }}
                    animate={{
                        left: endPosition.x,
                        top: endPosition.y,
                    }}
                    transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                    }}
                >
                    <motion.div
                        className="relative w-full h-full"
                        style={{
                            transformStyle: "preserve-3d",
                        }}
                        animate={{
                            rotateY: isFlipping ? 180 : 0,
                        }}
                        transition={{
                            duration: 0.5,
                            ease: "easeInOut",
                        }}
                    >
                        {/* BACK */}
                        <div
                            className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-xl"
                            style={{
                                backfaceVisibility: "hidden",
                            }}
                        >
                            <Maze />
                        </div>

                        {/* FRONT */}
                        <div
                            className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-xl"
                            style={{
                                backfaceVisibility: "hidden",
                                transform: "rotateY(180deg)",
                            }}
                        >
                            {card && cardStyle(card)}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}