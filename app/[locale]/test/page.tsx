"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { card } from "@/interface/card";
import cardStyle from "@/components/ObjectsGame/cardStyle";
import { GameState, LogGame } from "@/interface/gameData";
import { dialogData } from "@/interface/dialog";
import InfoGame from "@/components/ui/infoGame";
import GameDialog from "@/components/ui/dialogGameMessaje";
import { isWinner } from "@/lib/gameEngine/twetyOne/twety_One";
import ReturnButton from "@/components/uiGame/returnButton";
import { MenuStatus } from "@/interface/menuStatus";
import { difficulties } from "@/interface/gameData";
import DialogSelectDifficult from "@/components/ui/dialogSelectDifficult";
import { Checkbox } from "@/components/ui/checkbox";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger
} from "@/components/ui/hover-card";

import FloatComponent from "@/components/ui/floatComponent";
import { useTranslations } from "next-intl";

interface TwentyOneTableProps {
    setMenuState: (state: MenuStatus) => void;

}
export default function Home({ setMenuState }: TwentyOneTableProps) {
    const t = useTranslations("twentyOne");
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

    const [textFloatComponent, setTextFloadComponent] = useState<string>("");

    //disable "end round" button
    const [endRoundButton, setEndRoundButton] = useState<boolean>(false);
    //disable "restart game" button
    const [restartGameButton, setRestarGameButton] = useState<boolean>(false);

    //Ask the server to start a new game and get the initial hand and deck
    const startGame = async () => {
        setRestarGameButton(true);
        setEndRoundButton(true);
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

        if (response.handValue === 21) {
            setTextFloadComponent("Good luck!!! Perfect Round!!!")
        }
        //set all data from response
        setHandValue(response.handValue);
        setScore(response.score);
        setHand(response.playerHand);
        setDeck(response.deck);
        //enable "end round" and restart game button when the game is ready
        setEndRoundButton(false);
        setRestarGameButton(false);



    }

    useEffect(() => {
        if (handValue === 21 && (GameData?.playerHand.length ?? 0) === 2) {
            setTextFloadComponent(t("perfectRound"));
            return;
        }
        if (handValue === 21 && (GameData?.playerHand.length ?? 0) > 2) {
            setTextFloadComponent(t("youWin"));
            return;
        }
        if (handValue > 21) {
            setTextFloadComponent(t("youLose"));
            return;
        }
    }, [handValue])

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
        //disable "end round" button
        setEndRoundButton(true);

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
            setEndRoundButton(false);


        } else {
            const { status, message } = isWinner(response.score, difficulty, response.countRound);
            openDialog({
                title: "Game Result",
                description: message + "\nScore: " + response.score + "\nDifficulty: " + difficulty,
                status: status,
            });


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
        <div className="flex flex-col min-h-full bg-zinc-50 dark:bg-black">

            {/* MAIN WRAPPER */}
            <div className="flex flex-col lg:flex-row flex-1 justify-center p-2 gap-4 w-full">

                {/* CENTER */}
                <div className="flex flex-col items-center justify-center w-full">

                    {/* TOP BAR */}
                    <div className="flex justify-between w-full px-2 relative">

                        {/* Score y Round */}
                        <div className="absolute left-2 top-2 w-full px-2 flex justify-between sm:justify-start sm:flex-col sm:w-auto">

                            <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                                {t("score")}: {`${score} / ${difficulties[difficulty].requerimentPoints * (GameData?.countRound ?? 0)}`}
                            </h1>

                            <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                                {t("round")}: {`${GameData?.round} / ${GameData?.countRound}`}
                            </h1>

                        </div>

                        {/* Title */}
                        <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 dark:text-white mx-auto pt-10 sm:pt-16 lg:pt-2">
                            {t("title")}
                        </h1>


                    </div>

                    {/* CARD BUTTON AREA */}
                    <div className="relative flex flex-1 flex-col items-center justify-center mt-6 w-full">
                        <FloatComponent isVisible={handValue >= 21}>
                            <div className="text-center">
                                <span>{textFloatComponent}</span>
                            </div>
                        </FloatComponent>

                        <button
                            onClick={handleTakeCard}
                            className={`w-20 h-32 sm:w-24 sm:h-36 lg:w-28 lg:h-40 overflow-hidden rounded
                             transition duration-200 hover:shadow-lg hover:shadow-gray-400/40 hover:scale-105
                              active:scale-95 disabled:opacity-50
                              ${handValue < 21 ? 'animate-breathe' : ''}`}
                            disabled={handValue >= 21}
                        >
                            <Image
                                src="/backCard.svg"
                                alt="Take card"
                                width={96}
                                height={144}
                                className="w-full h-full object-cover"
                            />
                        </button>

                        <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                            {t("clickToDraw")}
                        </p>


                    </div>

                    {/* BOTTOM HAND */}
                    <div className="relative flex flex-col items-center pb-6 border-2 px-4 sm:px-6 lg:px-10 rounded w-full max-w-2xl mt-6">

                        {/* Button over border*/}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <button
                                onClick={handleEndRound}
                                className={`
                                    px-3 sm:px-4 py-2 text-white rounded-lg
                                    ${handValue >= 21 ? 'animate-breathe' : ''} hover:shadow-[0_0_20px_rgba(192,192,192,0.8)] 
                                    ${endRoundButton ? 'bg-red-800' : 'bg-red-500'}
                                `}
                                disabled={endRoundButton}
                            >
                                {t("endRound")}
                            </button>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mt-6">
                            {t("playerHand")}:
                        </h2>

                        <div className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white mt-2">
                            {t("handValue")}: {handValue}
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

                {/* RIGHT PANEL */}
                <div className="w-full lg:w-1/4 h-auto lg:h-full mt-6 lg:mt-0">

                    <div className="hidden sm:flex-1 sm:flex sm:items-start sm:justify-center text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">
                        <InfoGame info={gameInfo} />
                    </div>

                    <div className="flex flex-col gap-2 pb-4 items-center">
                        <button
                            onClick={handleRestartGame}
                            className={`w-full lg:w-auto px-3 py-1  text-white rounded hover:shadow-[0_0_20px_rgba(59,130,246,0.8)]
                                ${restartGameButton ? 'bg-blue-800' : 'bg-blue-500'}
                            `}
                            disabled={restartGameButton}
                        >
                            {t("restartGame")}
                        </button>

                        <ReturnButton
                            setMenuState={setMenuState}
                            menuState={"select"}
                            className="w-full lg:w-auto dark:bg-gray-500 dark:hover:bg-gray-600 text-white bg-gray-400 rounded-lg hover:bg-gray-600"
                        >
                            <p className="text-lg font-bold text-white">
                                {t("exitGame")}
                            </p>
                        </ReturnButton>

                        <GameDialog
                            open={dialog.open}
                            onOpenChange={handleOpenChange}
                            title={dialog.title}
                            description={dialog.description}
                            status={dialog.status}
                            backButton={
                                <ReturnButton
                                    setMenuState={setMenuState}
                                    menuState={"select"}
                                    className="w-full lg:w-auto dark:bg-gray-500 dark:hover:bg-gray-600 text-white 
                                    bg-gray-400 rounded-lg hover:bg-gray-600"
                                >
                                    <p className="text-lg font-bold text-white">
                                        {t("exitGame")}
                                    </p>
                                </ReturnButton>
                            }
                        />

                        <DialogSelectDifficult
                            open={openDifficultDialog}
                            onOpenChange={setOpenDifficultDialog}
                            title={t("selectDifficulty")}
                            childrenBottom={
                                <div className="flex justify-center w-full">
                                    <ReturnButton
                                        setMenuState={setMenuState}
                                        menuState="select"
                                        className="w-full dark:bg-gray-500 dark:hover:bg-red-900
                                        text-white bg-gray-400 rounded-lg hover:bg-gray-600 font-bold"

                                    >
                                        {t("exitGame")}
                                    </ReturnButton>
                                </div>
                            }
                        >
                            <>
                                <div className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-6 text-center">
                                    {t("difficultyText")}
                                </div>

                                <div className="flex flex-row sm:flex-row justify-center border-2 gap-4 sm:gap-6 rounded-lg p-4 w-full">

                                    {difficulties &&
                                        Object.entries(difficulties).map(([key, value]) => (
                                            <label
                                                key={key}
                                                className="flex flex-row items-center justify-center sm:justify-start gap-2 cursor-pointer"
                                            >
                                                <Checkbox
                                                    checked={difficulty === key}
                                                    onCheckedChange={() => {
                                                        setDifficulty(key as keyof typeof difficulties);
                                                    }}
                                                />

                                                <div className="flex flex-row sm:flex-row gap-1 sm:gap-2 items-center text-center">
                                                    <span className="text-sm sm:text-lg font-medium text-gray-800 dark:text-white">
                                                        {value.name}
                                                    </span>

                                                    <HoverCard>
                                                        <HoverCardTrigger>
                                                            <span className="text-sm text-gray-500 dark:text-gray-300">
                                                                (?)
                                                            </span>
                                                        </HoverCardTrigger>

                                                        <HoverCardContent className="max-w-62.5 sm:max-w-xs">
                                                            <p className="text-sm">
                                                                {value.description}, you need{" "}
                                                                {value.requerimentPoints *
                                                                    (GameData?.countRound || 5)}{" "}
                                                                points to win.
                                                            </p>
                                                        </HoverCardContent>
                                                    </HoverCard>
                                                </div>
                                            </label>
                                        ))}
                                </div>
                            </>
                        </DialogSelectDifficult>

                    </div>
                </div>
            </div>
        </div>
    );
}