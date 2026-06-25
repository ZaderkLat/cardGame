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
import Image from "next/image";
import CardSelectGame from "./cardSelectGame";

const games = [
    {
        name: "Twenty One",
        image: "/21logo.png",
        state: "game_twenty_one" as const,
    },
];
interface SelectGameMenuProps {
    menuState: MenuStatus;
    setMenuState: (state: MenuStatus) => void;
}
export default function SelectGameMenu({ setMenuState }: SelectGameMenuProps) {

    return (
        <div className="flex items-center justify-center w-full h-full p-4">
            <Card className="relative w-full max-w-6xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl">

                <ReturnButton
                    className="
                absolute top-4 left-4
                border border-gray-300 dark:border-gray-600
                hover:bg-gray-100 dark:hover:bg-gray-700
                transition-colors
            "
                    setMenuState={setMenuState}
                    menuState="main"
                >
                    <ArrowLeft />
                </ReturnButton>

                <CardHeader className="pt-6 pb-6 text-center border-b">
                    <CardTitle className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">
                        Select Game
                    </CardTitle>

                    <CardDescription className="
                mt-3
                text-base sm:text-lg
                text-gray-600 dark:text-gray-400
                max-w-md mx-auto
            ">
                        Choose a game to play and have fun!
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-4 sm:px-8 lg:px-12 pb-8">
                    <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-6
            ">
                        {games.map((game) => (
                            <CardSelectGame
                                key={game.name}
                                name={game.name}
                                image={game.image}
                                setMenuState={setMenuState}
                                menuState={game.state}
                            />
                        ))}
                    </div>
                </CardContent>

            </Card>
        </div>
    );
}