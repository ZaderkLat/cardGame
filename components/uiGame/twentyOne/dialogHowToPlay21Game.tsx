"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"

import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import cardStyle from "@/components/ObjectsGame/cardStyle";
import { card } from "@/interface/card";
import Maze from "@/components/uiGame/maze";
import { useTranslations } from "next-intl";
export type GameDialogProps = {
    open21: boolean;
    onOpenChange21: (open: boolean) => void;

};
export default function DialogHowToPlay21Game({ open21, onOpenChange21 }: GameDialogProps) {
    const t = useTranslations("HowToPlay");
    const hand: card[] = [
        {
            rank: "K",
            club_en: "Hearts",
            club_es: "Corazones",
            value: 10,
        },
        {
            rank: "K",
            club_en: "Diamonds",
            club_es: "Diamantes",
            value: 10,
        },
    ];

    return (
        <Dialog open={open21} onOpenChange={onOpenChange21} >

            <DialogContent
                className={cn(
                    " w-full rounded-2xl p-4 shadow-xl ",
                    "bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800",
                    "duration-300 max-w-4xl ",

                    // Base animation
                    "data-[state=open]:animate-in",
                    "data-[state=closed]:animate-out",

                    // Variants
                    "data-[state=open]:fade-in",
                    "data-[state=open]:zoom-in-95",
                    "data-[state=closed]:fade-out",
                    "data-[state=closed]:zoom-out-95",
                    "justify-center items-center"
                )}
            >

                <DialogHeader className=" text-center">

                    <DialogTitle className="text-2xl font-bold tracking-tight">
                        {t("title")}
                    </DialogTitle>
                    <Separator className="mt-2" />
                </DialogHeader>

                <ScrollArea className="h-100 pr-4 rounded-lg">

                    <div className="space-y-4 text-left text-sm text-gray-700 dark:text-gray-300">
                        <DialogDescription className="flex flex-col gap-2 text-gray-700 dark:text-gray-300">
                            <span className="text-xl font-bold">{t("objectiveTitle")}</span>

                            <span className="text-gray-700 dark:text-gray-300">
                                {t("objectiveDescription")}
                            </span>
                        </DialogDescription>


                        <Separator className="my-2" />

                        <h1 className="text-xl font-bold mt-4">{t("rulesTitle")}</h1>

                        <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>
                                {t("rule1")}
                            </li>

                            <li>
                                {t("rule2")}
                            </li>

                            <li>
                                {t("rule3")}
                            </li>

                            <li>
                                {t("rule4")}
                            </li>

                            <li>
                                {t("rule5")}
                            </li>

                            <li>
                                {t("rule6")}
                            </li>
                        </ol>
                        <Separator className="my-2" />

                        <h1 className="text-xl font-bold mt-4">{t("actionsTitle")}</h1>

                        <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>
                                <div className="flex flex-col gap-2">
                                    <p>
                                        <span className="font-bold">{t("hitTitle")}: </span>{" "}
                                        <span>{t("hitDescription")}</span>
                                    </p>

                                    <div className="flex justify-center transition duration-200  hover:scale-105 active:scale-95">
                                        <Popover>
                                            <PopoverTrigger>
                                                <Maze />
                                            </PopoverTrigger>
                                            <PopoverContent side="top" className="w-40">
                                                <div className="flex justify-center">
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">{t("hitHover")}</p>
                                                </div>


                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                            </li>

                            <li>
                                <div className="flex flex-col gap-2">
                                    <p>
                                        <span className="font-bold">{t("endRoundTitle")}: </span>
                                        <span>{t("endRoundDescription")}</span>
                                    </p>

                                    <div className="flex justify-center transition duration-200  hover:scale-105 active:scale-95">
                                        <button className={`px-3 sm:px-4 py-2 text-white rounded-lg bg-red-500
                                         transition duration-200 hover:scale-105 active:scale-95`}

                                        >
                                            {t("endRoundButton")}
                                        </button>
                                    </div>
                                </div>
                            </li>

                            <li>
                                <div className="flex flex-col gap-2">
                                    <p>
                                        <span className="font-bold">{t("restartTitle")}: </span>
                                        <span>{t("restartDescription")}</span>
                                    </p>

                                    <div className="flex justify-center transition duration-200  hover:scale-105 active:scale-95">
                                        <button className={`px-3 sm:px-4 py-2 text-white rounded-lg bg-blue-500
                                         transition duration-200 hover:scale-105 active:scale-95`}

                                        >
                                            {t("restartButton")}
                                        </button>
                                    </div>
                                </div>
                            </li>

                            <li>
                                <div className="flex flex-col gap-2">
                                    <p>
                                        <span className="font-bold">{t("exitTitle")}: </span>
                                        <span>{t("exitDescription")}</span>
                                    </p>


                                    <div className="flex justify-center transition duration-200  hover:scale-105 active:scale-95">
                                        <button className={`px-3 sm:px-4 py-2 dark:bg-gray-500 dark:hover:bg-gray-600 text-white 
                                        bg-gray-400 rounded-lg hover:bg-gray-600
                                         transition duration-200 hover:scale-105 active:scale-95`}

                                        >
                                            {t("exitButton")}
                                        </button>
                                    </div>

                                </div>
                            </li>

                        </ol>
                        <Separator className="my-2" />

                        <h1 className="text-xl font-bold mt-4">{t("interfaceTitle")}</h1>

                        <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>
                                <div className="flex flex-col gap-2">
                                    <p>
                                        <span className="font-bold">{t("scoreTitle")}: </span>{" "}
                                        <span>{t("scoreDescription")}</span>
                                    </p>

                                    <div className="flex justify-center transition duration-200  hover:scale-105 active:scale-95">
                                        <div className="flex flex-col justify-center gap-4">
                                            <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                                                Score: 0 / 375
                                            </h1>

                                            <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                                                Round: 1 / 5
                                            </h1>
                                        </div>


                                    </div>
                                </div>

                            </li>

                            <li>
                                <div className="flex flex-col gap-2">
                                    <p>
                                        <span className="font-bold">{t("playerHandTitle")}: </span>
                                        <span>{t("playerHandDescription")}</span>
                                    </p>


                                    <div className="flex justify-center">
                                        <div className="relative flex flex-col items-center pb-6 border-2 px-4 sm:px-6 lg:px-10 rounded w-full max-w-2xl mt-6">

                                            {/* Button over border*/}
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                                <button
                                                    className={`px-3 sm:px-4 py-2 text-white rounded-lg animate-breathe
                                                        hover:shadow-[0_0_20px_rgba(192,192,192,0.8)] bg-red-500 `}>
                                                    {t("endRoundButton")}
                                                </button>
                                            </div>

                                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mt-6">
                                                {t("playerHandTitle")}
                                            </h2>

                                            <div className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white mt-2">
                                                {t("handValue")}: 20
                                            </div>

                                            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4">
                                                {hand.map((card, index) => (
                                                    <div key={index} className="scale-90 sm:scale-100">
                                                        {cardStyle(card)}
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    </div>
                                </div>

                            </li>
                        </ol>

                    </div>
                </ScrollArea>
                <DialogFooter className="mt-2 bg-transparent justify-center">
                    <DialogClose asChild>
                        <Button className="w-full ">
                            {t("closeButton")}
                        </Button>
                    </DialogClose>
                </DialogFooter>

            </DialogContent>
        </Dialog >
    );
}