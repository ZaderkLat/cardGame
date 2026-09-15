
"use client";

import cardStyle from "@/components/ObjectsGame/cardStyle";
import { motion } from "motion/react";
import { card } from "@/interface/card";
import Maze from "@/components/uiGame/maze";

interface DealerHandProps {
    dealerHand: card[];
    placeholderCard: boolean;
    dealerScrollRef: React.RefObject<HTMLDivElement | null>;
    centerRef: React.RefObject<HTMLDivElement | null>;

    // Estado de la carta oculta
    isHiddenCardFlipping: boolean;
    hiddenCardRevealed: boolean;
}

export function DealerHand({
    dealerHand,
    placeholderCard,
    dealerScrollRef,
    centerRef,
    isHiddenCardFlipping,
    hiddenCardRevealed,
}: DealerHandProps) {
    return (
        <div
            ref={dealerScrollRef}
            className="w-full overflow-x-auto overflow-y-hidden"
        >
            <motion.div
                layout
                className="flex flex-row justify-center gap-1 sm:gap-4 mt-0 px-2 w-max min-w-full"
            >
                {dealerHand.map((card, index) => (
                    <motion.div
                        key={index}
                        layout
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                        }}
                        className="shrink-0"
                    >
                        {index === 1 ? (
                            // CARTA OCULTA DEL DEALER
                            <motion.div
                                className="relative w-18 h-27 lg:w-24 lg:h-36"
                                style={{
                                    perspective: 1000,
                                }}
                            >
                                <motion.div
                                    className="relative w-full h-full"
                                    style={{
                                        transformStyle: "preserve-3d",
                                    }}
                                    animate={{
                                        rotateY:
                                            isHiddenCardFlipping ||
                                                hiddenCardRevealed
                                                ? 180
                                                : 0,
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        ease: "easeInOut",
                                    }}
                                >
                                    {/* BACK */}
                                    <div
                                        className="absolute inset-0 rounded-xl overflow-hidden shadow-lg"
                                        style={{
                                            backfaceVisibility: "hidden",
                                        }}
                                    >
                                        <Maze />
                                    </div>

                                    {/* FRONT */}
                                    <div
                                        className="absolute inset-0 rounded-xl overflow-hidden shadow-lg"
                                        style={{
                                            backfaceVisibility: "hidden",
                                            transform: "rotateY(180deg)",
                                        }}
                                    >
                                        {cardStyle(card)}
                                    </div>
                                </motion.div>
                            </motion.div>
                        ) : (

                            cardStyle(card)
                        )}
                    </motion.div>
                ))}

                {/* Animation Target*/}
                {(placeholderCard || dealerHand.length === 0) && (
                    <motion.div
                        layout
                        className="shrink-0"
                    >
                        <div
                            ref={centerRef}
                            className="w-18 h-27 lg:w-24 lg:h-36 bg-transparent rounded-xl shadow-lg overflow-hidden"
                        />
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

