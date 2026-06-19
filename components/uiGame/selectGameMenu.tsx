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
export default function SelectGameMenu({ setMenuState, menuState }: SelectGameMenuProps) {

    return (
        <div className="flex items-center justify-center h-full mb-16">
            <Card className="relative w-full max-w-6xl min-h-175 p-16 m-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">

                <ReturnButton className="absolute top-4 left-4 border border-gray-300 dark:border-gray-600 
                hover:bg-gray-200 dark:hover:bg-gray-600"
                    setMenuState={setMenuState}
                    menuState={"main"}>
                    <ArrowLeft />
                </ReturnButton>

                <CardHeader className="text-center align-baseline">
                    <CardTitle className="text-5xl font-extrabold mb-6">
                        <h1 className="text-5xl font-extrabold">
                            Select Game
                        </h1>
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600 dark:text-gray-400 border-b pb-4 mb-2">
                        Choose a game to play and have fun!
                    </CardDescription>
                </CardHeader>
                <CardContent >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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