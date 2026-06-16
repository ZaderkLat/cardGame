'use client';

import cardStyle from "../ObjectsGame/cardStyle";
import { useEffect, useState } from "react";
import { card } from "@/interface/card";
import { GameState, LogGame } from "@/interface/gameData";
import { dialogData } from "@/interface/dialog";

import { isWinner } from "@/lib/gameEngine/twetyOne/twety_One";
import GameDialog from "../ui/dialogGameMessaje";

interface TwentyOneTableProps {
    setGameInfo: React.Dispatch<React.SetStateAction<LogGame[]>>;
    setRestartGame: React.Dispatch<React.SetStateAction<boolean>>;
    restartGame: boolean;
}

export default function TwentyOneTable({ setGameInfo, setRestartGame, restartGame }: TwentyOneTableProps) {
    const [hand, setHand] = useState<card[]>([]);
    const [deck, setDeck] = useState<card[]>([]);
    const [score, setScore] = useState<number>(0);

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


    //Ask the server to start a new game and get the initial hand and deck

    //delete
    const getGameState = async () => {
        if (!GameData) return;
        const res = await fetch(`/api/game/twentyOne/state?gameId=${GameData.id}`)
        const data = await res.json()



    };
    const startGame = async () => {
        console.log("Starting game...");
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
        console.log("Take Card:", response);
        setGameInfo(prev => [...prev, { type: "info", message: `Card taken: ${response.playerHand.at(-1)?.rank + " of " + response.playerHand.at(-1)?.club || 0}` }]);
        setHandValue(response.handValue);
        setHand(response.playerHand);
        setDeck(response.deck);

    }

    useEffect(() => {
        startGame();
    }, []);


    const handleEndRound = async () => {
        if (!GameData) return;
        const response = await fetch("/api/game/twentyOne/play/endRound", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ GameState: GameData })
        }).then(res => res.json()) as GameState;
        console.log("End Round:", response);

        if (response.score !== score) {
            setGameInfo(prev => [...prev, { type: "win", message: `Round ${response.round - 1} ended. Score obtained: ${response.score - score}` }]);
        } else {
            setGameInfo(prev => [...prev, { type: "lose", message: `Round ${response.round - 1} ended. No score obtained.` }]);
        }

        console.log(response.statusGame);
        //* control the dialog when the game ends*/
        if (response.statusGame !== "finished") {

            //after I make the system to select the difficulty level
            setGameData(response);
            setScore(response.score);
            setHandValue(response.handValue);
            setHand(response.playerHand);
            setDeck(response.deck);

        } else {
            console.log("Game finished");
            const { status, message, difficulty } = isWinner(response.score, "medium", response.countRound);
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

    useEffect(() => {
        if (restartGame) {
            setRestartGame(false);
            startGame();
        }
    }, [restartGame]);
    return (

        <div className="flex flex-col items-center justify-center w-1/2 h-full">
            <div className="flex justify-center pt-6">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                    Twenty One Game
                </h1>
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
            <GameDialog
                open={dialog.open}
                onOpenChange={handleOpenChange}
                title={dialog.title}
                description={dialog.description}
                status={dialog.status}
            />
        </div>
    );
}

