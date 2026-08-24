"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { MenuStatus } from "@/interface/menuStatus";
import ReturnButton from "./returnButton";
import { ArrowLeft } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import CardSelectGame from "./cardSelectGame";
import DialogHowToPlay21Game from "@/components/uiGame/twentyOne/dialogHowToPlay21Game";
import { ScrollArea } from "@/components/ui/scroll-area";
import { gameModeDTO } from "@/interface/responseDB";
import { useEffect, useState } from "react";

//I need change this to a more generic function, like a dictionary, because I'm gonna use a date base, for example:
/**
 * Table parameters:
 * Id : number for example 1
 * code: games
 * datatype: 
 * value : twenty_one
 * label_en: Twenty One//agregar a base de datos
 * label_es: Ventiuno//agregar a base de datos
 * parent_id: null
 */

const howToPlayMap = {
    game_twenty_one: DialogHowToPlay21Game,
    aim_trainer: null,
} as const;

interface SelectGameMenuProps {
    menuState: MenuStatus;
    setMenuState: (state: MenuStatus) => void;
    setGameModeId: (state: number) => void;
}
export default function SelectGameMenu({ setMenuState, setGameModeId }: SelectGameMenuProps) {

    const locale = useLocale()
    const t = useTranslations("selectGameMenu");
    const [gameMode, setGameMode] = useState<gameModeDTO[]>([]);

    useEffect(() => {
        const fetchGameModes = async () => {
            try {
                const response = await fetch(`/api/dataBase/gameMode?locale=${locale}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch game modes");
                }
                const data: gameModeDTO[] = await response.json();

                setGameMode(data);
            } catch (error) {
                console.error("Error fetching game modes:", error);
            }
        };

        fetchGameModes();
    }, []);

    return (
        <div className="flex items-center justify-center w-full h-full p-4">
            <Card className="relative w-full max-w-6xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl">

                <ReturnButton
                    className=" absolute top-0 left-1 border h-1 w-1 border-gray-300 dark:border-gray-600 hover:bg-gray-100
                     dark:hover:bg-gray-700 transition-colors rounded-full
          "
                    setMenuState={setMenuState}
                    menuState="main"
                >
                    <ArrowLeft />
                </ReturnButton>

                <CardHeader className="pt-9 sm:pt-6 pb-6 mb-2 text-center border-b">
                    <CardTitle className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">
                        {t("title")}
                    </CardTitle>

                    <CardDescription className="mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        {t("description")}
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-4 sm:px-8 lg:px-12 pb-8">
                    <ScrollArea className="h-100 pr-4 rounded-lg">
                        <div className="flex flex-wrap justify-center gap-x-30 gap-y-8">
                            {gameMode.map((game) => {
                                const HowToPlay =
                                    howToPlayMap[game.value as keyof typeof howToPlayMap];

                                if (!HowToPlay) {
                                    console.warn(`No HowToPlay component for ${game.value}`);
                                    return null;
                                }

                                return (
                                    <CardSelectGame
                                        key={game.game_mode_id}
                                        id={game.game_mode_id}
                                        name={game.title}
                                        image={game.image}
                                        setMenuState={setMenuState}
                                        menuState={game.value as MenuStatus}
                                        setGameModeId={setGameModeId}
                                        HowToPlay={HowToPlay}
                                    />
                                );
                            })}
                        </div>
                    </ScrollArea>
                </CardContent>

            </Card>

        </div>
    );
}