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
import { useTranslations } from "next-intl";
import CardSelectGame from "./cardSelectGame";
import DialogHowToPlay21Game from "@/components/uiGame/twentyOne/dialogHowToPlay21Game";
import { ScrollArea } from "@/components/ui/scroll-area";

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
const games = [
    {
        name: "Twenty One",
        image: "/21logo.png",
        state: "game_twenty_one" as const,
        howToPlay: DialogHowToPlay21Game,
    }
];

interface SelectGameMenuProps {
    menuState: MenuStatus;
    setMenuState: (state: MenuStatus) => void;
}
export default function SelectGameMenu({ setMenuState }: SelectGameMenuProps) {


    const t = useTranslations("selectGameMenu");
    return (
        <div className="flex items-center justify-center w-full h-full p-4">
            <Card className="relative w-full max-w-6xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl">

                <ReturnButton
                    className=" absolute top-4 left-4 border border-gray-300 dark:border-gray-600 hover:bg-gray-100
                     dark:hover:bg-gray-700 transition-colors rounded-full
          "
                    setMenuState={setMenuState}
                    menuState="main"
                >
                    <ArrowLeft />
                </ReturnButton>

                <CardHeader className="pt-6 pb-6 mb-2 text-center border-b">
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
                            {games.map((game) => (
                                <CardSelectGame
                                    key={game.name}
                                    name={game.name}
                                    image={game.image}
                                    setMenuState={setMenuState}
                                    menuState={game.state}
                                    HowToPlay={game.howToPlay}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>

            </Card>

        </div>
    );
}