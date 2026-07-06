"use client";

import Image from "next/image";
import { useState, ComponentType } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

import { CircleHelp } from "lucide-react";

import { MenuStatus } from "@/interface/menuStatus";

interface CardSelectGameProps {
    name: string;
    image: string;
    setMenuState: (state: MenuStatus) => void;
    menuState: MenuStatus;
    HowToPlay: ComponentType<{
        open21: boolean;
        onOpenChange21: (open: boolean) => void;
    }>;
}

export default function CardSelectGame({
    name,
    image,
    setMenuState,
    menuState,
    HowToPlay,
}: CardSelectGameProps) {
    const t = useTranslations("CardSelectGame");

    const [open, setOpen] = useState(false);

    return (
        <>
            <Card
                className="w-44 overflow-hidden rounded-2xl border-gray-300 border shadow-md
        dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:scale-105 hover:shadow-xl"
            >
                <CardHeader>
                    <CardTitle className="text-center text-2xl text-gray-900 font-bold dark:text-white">
                        {name}
                    </CardTitle>
                </CardHeader>

                <CardContent className="relative p-0">
                    <Image
                        src={image}
                        alt={name}
                        width={400}
                        height={400}
                        className="h-44 w-full object-cover"
                    />
                </CardContent>

                <CardFooter className="relative justify-center">
                    <div className="absolute right-2 z-10">
                        <HoverCard>
                            <HoverCardTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    onClick={() => setOpen(true)}
                                    className="rounded-full shadow-md text-zinc-800 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all"
                                >
                                    <CircleHelp className="h-5 w-5" />
                                </Button>
                            </HoverCardTrigger>

                            <HoverCardContent className="w-80">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {t("instructions")} <strong>{name}</strong>.
                                </p>
                            </HoverCardContent>
                        </HoverCard>
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => setMenuState(menuState)}
                        className="rounded-full px-8 border-gray-300 bg-blue-500 text-white
                                hover:bg-blue-600 hover:text-white dark:border-zinc-600 dark:bg-transparent
                                dark:text-white dark:hover:bg-zinc-800 transition-all hover:scale-105"
                    >
                        {t("play")}
                    </Button>
                </CardFooter>
            </Card>

            <HowToPlay
                open21={open}
                onOpenChange21={setOpen}
            />
        </>
    );
}