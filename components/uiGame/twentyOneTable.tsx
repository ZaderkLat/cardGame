"use client";

import { useEffect, useState } from "react";
import { card } from "@/interface/card";
import cardStyle from "@/components/ObjectsGame/cardStyle";
import { GameState, LogGame } from "@/interface/gameData";
import { dialogData } from "@/interface/dialog";
import InfoGame from "@/components/ui/infoGame";
import GameDialog from "@/components/ui/dialogGameMessaje";
import { isWinner } from "@/lib/gameEngine/twetyOne/twety_One";
import ReturnButton from "./returnButton";
import { MenuStatus } from "@/interface/menuStatus";
import { difficulties } from "@/interface/gameData";
import DialogSelectDifficult from "@/components/ui/dialogSelectDifficult";
import { Checkbox } from "@/components/ui/checkbox";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger
} from "@/components/ui/hover-card";
interface TwentyOneTableProps {
    setMenuState: (state: MenuStatus) => void;

}
export default function Home({ setMenuState }: TwentyOneTableProps) {
    //Game State
    const [score, setScore] = useState<number>(0);
    const [hand, setHand] = useState<card[]>([]);
    const [deck, setDeck] = useState<card[]>([]);
    const [gameInfo, setGameInfo] = useState<LogGame[]>([]);

    const [dialog, setDialog] = useState<dialogData>({
        open: false,
        title: "",
        description: "",
        status: "continue" as const,

    });

    const [handValue, setHandValue] = useState<number>(0);
    /*Game Data*/
    const [GameData, setGameData] = useState<GameState | null>(null);


    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

    //Handler diffcult selection
    const [difficulty, setDifficulty] = useState<keyof typeof difficulties>("medium");
    const [openDifficultDialog, setOpenDifficultDialog] = useState<boolean>(true);

    //Ask the server to start a new game and get the initial hand and deck
    const startGame = async () => {
        const response = await fetch("/api/game/twentyOne/startGame", {
            method: "POST"
        }).then(res => res.json()) as GameState;
        setGameData(response);

        if (response.round === 1) {
            setGameInfo(prev => [...prev, { type: "info", message: `Game Started.` }]);
        } else {
            setGameInfo(prev => [...prev, { type: "info", message: `Round ${response.round} started.` }]);
            setGameInfo(prev => [...prev, { type: "info", message: `Score obtained: ${response.score - score}` }]);
        }
        //set all data from response
        setHandValue(response.handValue);
        setScore(response.score);
        setHand(response.playerHand);
        setDeck(response.deck);


    }

    //* Control the dialog data and its open and close states */
    const openDialog = (data: Omit<dialogData, "open">) => {
        setDialog({
            open: true,
            ...data,
        });
    };
    const handleOpenChange = (open: boolean) => {
        setDialog((prev) => ({
            ...prev,
            open,
        }));
        if (!open && pendingAction) {
            pendingAction();
            setPendingAction(null);
        }
    };
    //* -------------------------------------------------------------------- */
    const handleTakeCard = async () => {
        if (!GameData) return;
        const response = await fetch("/api/game/twentyOne/play/takeCard", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                gameId: GameData.id,
                remainingDeck: deck,
                playerHand: hand
            })
        }).then(res => res.json()) as GameState;
        setGameData(response);

        setGameInfo(prev => [...prev, { type: "info", message: `Card taken: ${response.playerHand.at(-1)?.rank + " of " + response.playerHand.at(-1)?.club || 0}` }]);
        setHandValue(response.handValue);
        setHand(response.playerHand);
        setDeck(response.deck);

    }

    useEffect(() => {
        if (openDifficultDialog === false) {
            startGame();
        }

    }, [openDifficultDialog]);

    const handleRestartGame = () => {
        startGame();
    }

    const handleEndRound = async () => {
        if (!GameData) return;
        const response = await fetch("/api/game/twentyOne/play/endRound", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ GameState: GameData })
        }).then(res => res.json()) as GameState;


        if (response.score !== score) {
            setGameInfo(prev => [...prev, { type: "win", message: `Round ${response.round - 1} ended. Score obtained: ${response.score - score}` }]);
        } else {
            setGameInfo(prev => [...prev, { type: "lose", message: `Round ${response.round - 1} ended. No score obtained.` }]);
        }


        //* control the dialog when the game ends*/
        if (response.statusGame !== "finished") {
            //after I make the system to select the difficulty level
            setGameData(response);
            setScore(response.score);
            setHandValue(response.handValue);
            setHand(response.playerHand);
            setDeck(response.deck);

        } else {
            const { status, message } = isWinner(response.score, difficulty, response.countRound);
            openDialog({
                title: "Game Result",
                description: message + "\nScore: " + response.score + "\nDifficulty: " + difficulty,
                status: status,
            });
            setGameInfo(prev => [...prev, { type: status, message: `${message} with ${response.score} points.` }]);

            setPendingAction(() => () => {
                setGameInfo(prev => [
                    ...prev,
                    { type: status, message: `${message} with ${response.score} points.` },
                ]);

                setGameData(null);
                setScore(0);
                setHand([]);
                setDeck([]);
                setHandValue(0);

                startGame();
            });


        }
    }

    return (
        <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black h-full">

            {/* Container */}
            <div className="relative flex flex-row flex-1 justify-center p-2">


                {/* center container */}
                <div className="flex flex-col items-center justify-center w-full">
                    <div className="flex justify-center w-full">

                        <div className="flex justify-baseline mb-4 absolute top-5 left-4">
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white ">
                                Score: {`${score} / ${difficulties[difficulty].requerimentPoints * (GameData?.countRound ?? 0)}`}
                            </h1>
                        </div>
                        <div className="flex justify-center pt-6">
                            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                                Twenty One Game
                            </h1>
                        </div>
                    </div>


                    <div className="flex flex-col items-center justify-center flex-1">
                        <div className="text-2xl font-bold text-gray-800 dark:text-white">
                            Hand Value: {handValue}
                        </div>

                    </div>

                    {/* BOTTOM */}
                    <div className="flex flex-col items-center pb-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                            Player Hand:
                        </h2>

                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={handleTakeCard}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Take card
                            </button>

                            <button
                                onClick={handleEndRound}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                End Round
                            </button>

                        </div>

                        <div className="flex gap-4 mt-4">
                            {hand.map((card, index) => (
                                <div key={index}>{cardStyle(card)}</div>
                            ))}
                        </div>
                    </div>

                </div>
                {/* right container */}
                <div className="flex flex-col w-1/4 h-full">

                    {/* Top section: InfoGame takes most of the vertical space */}
                    <div className="flex-1 flex items-start justify-center text-2xl font-bold text-gray-800 dark:text-white mb-4 ">
                        <InfoGame info={gameInfo} />
                    </div>

                    {/* Bottom section: buttons aligned at the bottom */}
                    <div className="relative flex flex-col gap-2 pb-4 items-center">
                        <button
                            onClick={handleRestartGame}
                            className="px-3 py-1  bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Restart Game
                        </button>

                        <ReturnButton setMenuState={setMenuState} menuState={"select"} className="dark:bg-gray-500 dark:hover:bg-gray-600 text-white bg-gray-400 rounded-lg hover:bg-gray-600">
                            <p className="text-lg font-bold text-gray-800 dark:text-white">
                                Exit Game
                            </p>
                        </ReturnButton>

                        <GameDialog
                            open={dialog.open}
                            onOpenChange={handleOpenChange}
                            title={dialog.title}
                            description={dialog.description}
                            status={dialog.status}
                        />

                        <DialogSelectDifficult
                            open={openDifficultDialog}
                            onOpenChange={setOpenDifficultDialog}
                            title="Select Difficulty"
                            childrenBottom={<div className="flex justify-center">
                                <ReturnButton
                                    setMenuState={setMenuState}
                                    menuState="select"
                                    className="w-full h-full dark:bg-gray-500 dark:hover:bg-red-900
                                        text-white bg-gray-400 rounded-lg hover:bg-gray-600 font-bold"
                                >
                                    Exit Game
                                </ReturnButton>
                            </div>}
                        >
                            <div className="text-lg font-bold text-gray-800 dark:text-white mb-4 justify-center flex">
                                Please select the difficulty level:
                            </div>
                            <div className="flex flex-row justify-center border-2 gap-6 rounded-lg p-4">
                                {difficulties && Object.entries(difficulties).map(([key, value]) => (
                                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                                        <Checkbox
                                            checked={difficulty === key}
                                            onCheckedChange={() => {
                                                setDifficulty(key as keyof typeof difficulties);

                                            }}
                                        />
                                        <div className="flex flex-row gap-2 items-center text-center justify-center">
                                            <span className="text-lg font-medium text-gray-800 dark:text-white">
                                                {value.name}
                                            </span>
                                            <HoverCard>
                                                <HoverCardTrigger>
                                                    <span className="text-sm text-gray-500 dark:text-gray-300">
                                                        (?)
                                                    </span>
                                                </HoverCardTrigger>
                                                <HoverCardContent>
                                                    <p>{value.description}, you need {value.requerimentPoints * (GameData?.countRound || 5)} points to win.</p>
                                                </HoverCardContent>
                                            </HoverCard>

                                        </div>

                                    </label>
                                ))}
                            </div>
                        </DialogSelectDifficult>


                    </div>

                </div >




            </div >


        </div >
    );
}