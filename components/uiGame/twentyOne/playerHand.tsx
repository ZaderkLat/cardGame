"use client";

import cardStyle from "@/components/ObjectsGame/cardStyle";
import { motion } from "motion/react";
import { card } from "@/interface/card";


interface PlayerHandProps {
    playerHand: card[];
    placeholderCard: boolean;
    playerScrollRef: React.RefObject<HTMLDivElement | null>;
    centerRef: React.RefObject<HTMLDivElement | null>;
}
export function PlayerHand({ playerHand, placeholderCard, playerScrollRef, centerRef }: PlayerHandProps) {
    return (
        <div
            ref={playerScrollRef}
            className="w-full overflow-x-auto overflow-y-hidden"
        >
            <motion.div
                layout
                className="flex flex-row justify-center items-center gap-2 sm:gap-4 mt-0 px-2 w-max min-w-full"
            >
                {playerHand.map((card, index) => (
                    <motion.div
                        key={index}
                        layout
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                        }}
                        className="shrink-0 "
                    >
                        {cardStyle(card)}
                    </motion.div>
                ))}

                {placeholderCard && (
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