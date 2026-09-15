
"use client";

import { AnimatePresence, motion } from "motion/react";

interface AnimationFloatingLabelProps {
    text: string;
    show: boolean;
    color?: string;
    background?: string;
    border?: string;
    shadow?: string;
}

export default function AnimationFloatingLabel({
    text,
    show,
    color = "text-green-500 dark:text-green-400",
    background = "bg-black/75 dark:bg-zinc-950/90",
    border = "border-white/20 dark:border-white/10",
    shadow = "shadow-[0_0_20px_rgba(0,0,0,0.4)]",
}: AnimationFloatingLabelProps) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    key="game-status"
                    initial={{
                        opacity: 0,
                        scale: 0.2,
                        rotate: -8,
                    }}
                    animate={{
                        opacity: 1,
                        scale: [0.2, 1.15, 0.95, 1],
                        rotate: [-8, 3, -1, 0],
                    }}
                    exit={{
                        opacity: 0,
                        scale: 0.5,
                        y: -10,
                    }}
                    transition={{
                        duration: 0.65,
                        ease: "easeOut",
                        scale: {
                            times: [0, 0.55, 0.8, 1],
                        },
                        rotate: {
                            times: [0, 0.55, 0.8, 1],
                        },
                    }}
                    className="
                        absolute inset-0
                        flex items-center justify-center
                        pointer-events-none
                        z-50
                    "
                >
                    <motion.div
                        animate={{
                            y: [0, -3, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className={`
                            px-4 py-2
                            rounded-xl
                            backdrop-blur-sm
                            border
                            whitespace-nowrap
                            ${background}
                            ${border}
                            ${shadow}
                        `}
                    >
                        <span
                            className={`
                                text-xl sm:text-2xl lg:text-3xl
                                font-black
                                ${color}
                            `}
                        >
                            {text}
                        </span>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
