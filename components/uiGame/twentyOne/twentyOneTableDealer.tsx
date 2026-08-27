"use client";

import { useEffect, useState } from "react";

import cardStyle from "@/components/ObjectsGame/cardStyle";
import { GameState, LogGame } from "@/interface/gameData";
import { dialogData } from "@/interface/dialog";
import InfoGame from "@/components/ui/infoGame";
import GameDialog from "@/components/ui/dialogGameMessaje";
import ReturnButton from "@/components/uiGame/returnButton";
import { MenuStatus } from "@/interface/menuStatus";
import { PlayerInfo } from "@/interface/gameData";
import DialogSelectDifficult from "@/components/ui/dialogSelectDifficult";

import FloatComponent from "@/components/ui/floatComponent";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Maze from "@/components/uiGame/maze";

import QuantitySelector from "@/components/ui/quantitySelector";
import { calculateHandValue } from "@/lib/gameEngine/twetyOne/twety_One";
import { User } from "@/interface/userData";
interface TwentyOneTableProps {
    setMenuState: (state: MenuStatus) => void;
    rounds: number;
    setRounds: React.Dispatch<React.SetStateAction<number>>;
    gameTypeId: number
    user: User;
}

export default function TwentyOneTableDealer({ setMenuState, user,
    rounds, setRounds, gameTypeId }: TwentyOneTableProps) {
    const t = useTranslations("twentyOneDealer");
    //languaje path
    const locale = useLocale();
    //Game State

    const [gameInfo, setGameInfo] = useState<LogGame[]>([]);

    const [dialog, setDialog] = useState<dialogData>({
        open: false,
        title: "",
        description: "",
        status: "continue" as const,

    });


    //------------------------------//
    /*Game Data*/
    const [gameData, setGameData] = useState<GameState | null>(null);


    const [player, setPlayer] = useState<PlayerInfo>();
    const [dealer, setDealer] = useState<PlayerInfo>();


    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

    //Handler diffcult selection

    const [openDifficultDialog, setOpenDifficultDialog] = useState<boolean>(false);

    const [textFloatComponent, setTextFloadComponent] = useState<string>("");

    //disable "end round" button
    const [endRoundButton, setEndRoundButton] = useState<boolean>(true);
    //disable "restart game" button
    const [restartGameButton, setRestarGameButton] = useState<boolean>(true);
    //disable takeCark button
    const [takeCardButton, setTakeCardButton] = useState<boolean>(true)
    //control if show the button "Stand" or "endRound"
    const [isPlaying, setIsPlaying] = useState<boolean>(true)
    const [tieCount, setTieCount] = useState<number>(0);
    //Ask the server to start a new game and get the initial hand and deck

    const startGame = async () => {
        setTakeCardButton(true);
        setRestarGameButton(true);
        setEndRoundButton(true);
        setTakeCardButton(true);
        setTieCount(0);

        const players = ([
            {
                idPlayer: "dealer",
                userName: "Dealer",
            },
            {
                idPlayer: user.id,
                userName: user.name,
            },
        ]);

        const res = await fetch("/api/game/twentyOne/startGame", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                players: players,
                rounds: rounds
            }),
        });

        if (!res.ok) {
            throw new Error(t("errorStartGame"));
        }

        const response: GameState = await res.json();
        setGameData(response);
        //update dealer information
        setDealer(response.players[0])

        if (response.round === 1) {
            setGameInfo(prev => [
                ...prev,
                {
                    type: "info",
                    message: t("gameStarted") + "."
                }
            ]);
        } else {
            setGameInfo(prev => [
                ...prev,
                {
                    type: "info",
                    message: `${t("round")} ${response.round} ${t("started")}.`
                }
            ]);
        }

        setIsPlaying(true);
        setEndRoundButton(false);
        setRestarGameButton(false);
        setTakeCardButton(false);

    }

    useEffect(() => {

        if (!player) return;

        /**
         * resultRound is used when the player have a blackjack or lose, because en both cases
         * the dealer don't play, the victory (black jack) and lose (hand value > 21) is automatic
         */
        if (player.status == "blackJack") {
            setTextFloadComponent(t("perfectRound"));

            return;
        }
        if (player.status == "lose") {
            setTextFloadComponent(t("youLose"));

            return;
        }
        if (player.status == "win") {
            setTextFloadComponent(t("youWin"));
            return;
        }
        if (player.status == "stand") {
            setTextFloadComponent(t("waitingDealer"));
            return;
        }
        if (player.handValue == dealer?.handValue) {
            setTieCount(prev => prev + 1);
            setTextFloadComponent(t("tie"));
            return;
        }

    }, [player]);

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
    const getPlayer = (gameData: GameState) => {

        return gameData?.players.find(p => p.idPlayer === user.id)

    }
    //* -------------------------------------------------------------------- */
    const handleTakeCard = async () => {
        if (!gameData) return;

        setTakeCardButton(true);
        const response = await fetch(`/api/game/twentyOne/dealer/play/takeCard`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                gameId: gameData.id,
            })
        }).then(res => res.json()) as GameState;
        setGameData(response);
        const player = getPlayer(response);

        if (!player) return;

        const lastCard = player.hand.at(-1);

        setGameInfo(prev => [
            ...prev,
            {
                type: "info",
                message: `${player.userName}: ${t("cardTaken")} ${lastCard?.rank} ${t("of")} ${lastCard?.[`club_${locale}` as "club_es" | "club_en"] ?? ""
                    }`,
            },
        ]);
        setTakeCardButton(false);

    };
    const handleEndRound = async () => {

        if (!gameData) return;
        //disable "end round" and "take card" button
        setEndRoundButton(true);
        setTakeCardButton(true);
        const response = await fetch(`/api/game/twentyOne/dealer/play/endRound`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                gameId: gameData.id,
            })
        }).then(res => res.json()) as GameState;


        const playerResponse = getPlayer(response)
        if (!playerResponse) return;
        //* control the dialog when the game ends*/
        if (response.statusGame !== "finished") {
            setGameInfo(prev => [
                ...prev,
                {
                    type: "separate",
                    message: "",
                },
            ]
            )
            setGameInfo(prev => [
                ...prev,
                {
                    type: "info",
                    message: t("round") + ` ${response.round} ${t("started")}.`,
                },
            ]
            )

            setGameData(response);
            setDealer(response.players[0])
            setEndRoundButton(false);
            setTakeCardButton(false);
            setIsPlaying(true);

        }
        else {

            openDialog({
                title: t("gameResult"),
                description: ``,
                status: "win",
            });
            registerRecord(response);
            setPendingAction(() => () => {
                startGame();
            });

        }
    }

    /** ----------------DEALER PLAY--------------------*/
    const sleep = (ms: number) =>
        new Promise(resolve => setTimeout(resolve, ms));

    const handleDealer = async () => {
        if (!gameData) return;
        setTakeCardButton(true);
        setEndRoundButton(true);
        setIsPlaying(false);
        setTextFloadComponent(t("waitingDealer"));
        await sleep(1000);
        const response: GameState = await fetch(
            "/api/game/twentyOne/dealer/play/dealerPlay",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    gameId: gameData.id,
                    idPlayer: user.id
                })
            }
        ).then(res => res.json());
        //this detect if the dealer take cards
        const dealerInfo = response.players[0];
        //update the fist dealer card to turn visible
        setDealer(prevDealer => {
            if (!prevDealer) return dealerInfo;

            return {
                ...prevDealer,
                hand: dealerInfo.hand.slice(0, 2),
                handValue: calculateHandValue(dealerInfo.hand.slice(0, 2))
            };
        });
        const lastCard = response.players[0].hand[1];
        setGameInfo(prev => [
            ...prev,
            {
                type: "info",
                message: `${dealer?.userName}: ${t("cardTaken")} ${lastCard?.rank} ${t("of")} ${lastCard?.[`club_${locale}` as "club_es" | "club_en"] ?? ""
                    }`,
            },
        ]);
        await sleep(1000);
        for (let i = 2; i < dealerInfo.hand.length; i++) {




            setDealer((prevDealer) => {
                if (!prevDealer) {
                    return dealerInfo;
                }

                const updatedHand = [
                    ...prevDealer.hand,
                    dealerInfo.hand[i]
                ];



                return {
                    ...prevDealer,
                    hand: updatedHand,
                    handValue: calculateHandValue(updatedHand)
                };

            });
            setGameInfo(prev => [
                ...prev,
                {
                    type: "info",
                    message: `${dealer?.userName}: ${t("cardTaken")}: ${dealerInfo.hand[i].rank} ${t("of")} ${dealerInfo.hand[i][`club_${locale}` as "club_es" | "club_en"] ?? ""
                        }`,
                },
            ]);
            await sleep(1000);

        }
        setEndRoundButton(false);
        resultMessage(response);
        setGameData(response);
    }

    const resultMessage = (response: GameState) => {
        if (!gameData) return;
        setGameInfo(prev => [
            ...prev,
            {
                type: "info",
                message: t("results")
            }
        ])
        const dealerWon =
            response.players[0].roundsWin >
            gameData.players[0].roundsWin;

        const roundMessages: LogGame[] = response.players.map((player, index) => {
            const isDealer = index === 0;

            const points = isDealer
                ? (dealerWon ? 1 : 0)
                : (
                    player.status === "win" ||
                    player.status === "blackJack"
                )
                    ? 1
                    : 0;

            return {
                type: (points > 0 ? "win" : "lose") as "win" | "lose",
                message: `${player.userName}: ${t("won")} ${points} ${t("point")}.`
            };
        });

        setGameInfo(prev => [
            ...prev,
            ...roundMessages
        ]);
    }
    /** ----------------DEALER PLAY--------------------*/
    //end stament

    useEffect(() => {

        if (openDifficultDialog === false) {


            startGame();
        }

    }, [openDifficultDialog]);
    //create the user playerList when user charge

    //update player data and dealer
    useEffect(() => {
        if (!gameData) return;

        setPlayer(gameData.players.find(
            p => p.idPlayer === user.id)
        );

    }, [gameData])

    const handleRestartGame = () => {
        setOpenDifficultDialog(true);
    }
    const sortedPlayers = [...(gameData?.players ?? [])].sort(
        (a, b) => b.roundsWin - a.roundsWin
    );

    const maxWins = Math.max(
        ...(gameData?.players.map(p => p.roundsWin) ?? [0])
    );

    const registerRecord = async (gameData: GameState) => {
        //if the user is guest, it can't register a record
        if (user.isGuest) return;
        const player = getPlayer(gameData);
        const dealer = gameData.players[0];
        if (!player || !dealer) return;

        const statusText: Record<"win" | "lose" | "tie", { es: string; en: string }> = {
            win: {
                es: "Ganó",
                en: "Win",
            },
            lose: {
                es: "Perdió",
                en: "Lose",
            },
            tie: {
                es: "Empate",
                en: "Tie"
            }
        };
        const status: "win" | "lose" | "tie" =
            player.roundsWin > dealer.roundsWin
                ? "win"
                : player.roundsWin < dealer.roundsWin
                    ? "lose"
                    : "tie";

        const response = await fetch("/api/dataBase/record", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                rounds: gameData.round - 1,
                gameModeTypeId: gameTypeId,

                properties: {
                    roundsWin: {
                        es: player.roundsWin,
                        en: player.roundsWin,
                    },
                    dealer: {
                        es: dealer.userName,
                        en: dealer.userName
                    },
                    tie: {
                        es: tieCount,
                        en: tieCount,
                    },
                    status: {
                        es: statusText[status].es,
                        en: statusText[status].en
                    },
                    dealerWins: {
                        es: dealer.roundsWin,
                        en: dealer.roundsWin
                    }
                },
            }),
        });

        const data = await response.json();

    }
    return (
        <div className="flex flex-col flex-1 lg:h-full h-fit min-h-0 bg-zinc-50 dark:bg-black overflow-hidden">

            {/* MAIN WRAPPER */}
            <div className="flex flex-col lg:flex-row flex-1 justify-center p-2 pt-0 w-full h-full gap-4">
                {/*LEFT PANEL */}
                <div className="hidden lg:flex relative flex-col items-center justify-center w-1/5 ">
                    {/* Score y Round */}
                    <div className="flex flex-row absolute justify-between w-full mb-4 lg:absolute lg:left-0 lg:top-0 lg:flex-col lg:w-auto">

                        <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                            {t("round")}: {`${gameData?.round} / ${gameData?.countRound}`}
                        </h1>
                        <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                            {t("wonRounds")}: {`${player?.roundsWin}`}
                        </h1>

                    </div>

                    <button
                        onClick={handleTakeCard}
                        className={`w-20 h-32  lg:w-28 lg:h-40 overflow-hidden rounded
                             transition duration-200 hover:shadow-lg hover:shadow-gray-400/40 hover:scale-105
                              active:scale-95 disabled:opacity-50 
                              ${(player?.handValue ?? 0) < 21 ? 'animate-breathe' : ''}`}
                        disabled={(player?.handValue ?? 0) >= 21 || takeCardButton}
                    >
                        <Maze />
                    </button>
                    <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                        {t("clickToDraw")}
                    </p>

                </div>
                {/* CENTER PANEL*/}
                <div className="flex flex-col items-center justify-between w-full lg:w-3/5 order-1">


                    <div className="flex flex-col items-center justify-center w-full">
                        {/* BOTTOM ---DEALER--- HAND */}
                        <div className="relative flex flex-col items-center pb-1 lg:pb-6 border-2 border-zinc-400
                            dark:border-zinc-900 dark:border-2 px-4  lg:px-10 rounded w-full max-w-2xl mt-4">

                            {/* Button over border*/}

                            <h2 className="text-xl mt-2 lg:mt-4 lg:text-2xl font-bold text-gray-800 dark:text-white ">
                                {t("playerHand")}:
                            </h2>

                            <div className="text-lg lg:text-2xl font-bold text-gray-800 dark:text-white mt-2">
                                {t("handValue")}: {(dealer?.handValue ?? 0)}
                            </div>

                            <div className="flex flex-wrap justify-center gap-1 sm:gap-4 mt-0 lg:mt-4 max-w-full overflow-hidden">
                                {dealer?.hand.map((card, index) => (
                                    <div key={index} className="scale-80 lg:scale-100">
                                        {card.value == 0 ? (
                                            <div className="w-24 h-36 bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden">
                                                <Maze />
                                            </div>
                                        ) : (
                                            cardStyle(card)
                                        )}
                                    </div>
                                ))}
                            </div>

                        </div>

                    </div>
                    {/* MOBILE DRAW BUTTON */}
                    <div className="relative flex lg:hidden flex-col items-center mt-10 mb-6 w-full">

                        <div className="w-full flex justify-between px-4 mb-4 -top-8 text-xl absolute">
                            <h1 className="font-bold text-gray-800 dark:text-white">
                                {t("round")}: {`${gameData?.round} / ${gameData?.countRound}`}
                            </h1>

                            <h1 className="font-bold text-gray-800 dark:text-white">
                                {t("wonRounds")}: {player?.roundsWin}
                            </h1>
                        </div>
                        <div className="h-full w-full flex flex-col items-center ">
                            <button
                                onClick={handleTakeCard}
                                className={`w-20 h-32 rounded overflow-hidden
                                    flex items-center justify-center
                                    transition duration-200 hover:shadow-lg hover:shadow-gray-400/40
                                    hover:scale-105 active:scale-95 disabled:opacity-50 mb-1
                                    ${(player?.handValue ?? 0) < 21 ? "animate-breathe" : ""}`}
                                disabled={
                                    (player?.handValue ?? 0) >= 21 ||
                                    takeCardButton
                                }
                            >
                                <div className="w-full h-full flex items-center justify-center">
                                    <Maze />
                                </div>
                            </button>

                        </div>

                    </div>
                    {/* BOTTOM ---PLAYER--- HAND */}
                    <div className="relative flex flex-col items-center pb-1 lg:pb-6  border-2 border-zinc-400
                     dark:border-zinc-900 dark:border-2 px-4 sm:px-6 lg:px-10 rounded w-full max-w-2xl">

                        {/* Button over border*/}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            {
                                isPlaying ? (
                                    <button
                                        onClick={handleDealer}
                                        className={`
                                    px-3 sm:px-4 py-2 text-white rounded-lg
                                    ${(player?.handValue ?? 0) >= 21 ? 'animate-breathe' : ''} hover:shadow-[0_0_20px_rgba(192,192,192,0.8)] 
                                    ${endRoundButton ? 'bg-red-800' : 'bg-red-500'} transition-all hover:scale-105
                                `}
                                        disabled={endRoundButton}
                                    >
                                        {t("stand")}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleEndRound}
                                        className={`
                                    px-3 sm:px-4 py-2 text-white rounded-lg
                                    ${(!isPlaying && !endRoundButton) ? 'animate-breathe' : ''} hover:shadow-[0_0_20px_rgba(192,192,192,0.8)] 
                                    ${endRoundButton ? 'bg-red-800' : 'bg-red-500'} transition-all hover:scale-105
                                `}
                                        disabled={endRoundButton}
                                    >
                                        {t("endRound")}
                                    </button>
                                )
                            }


                        </div>

                        <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mt-6">
                            {t("playerHand")}:
                        </h2>

                        <div className="text-lg lg:text-2xl font-bold text-gray-800 dark:text-white mt-2 ">
                            {t("handValue")}: {(player?.handValue ?? 0)}
                        </div>

                        <FloatComponent isVisible={(player?.handValue ?? 0) >= 21 || !isPlaying}
                            position=" top-38 left-1/2 -translate-x-1/2 z-50 w-70 opacity-80">
                            <div className="text-center">
                                <span>{textFloatComponent}</span>
                            </div>
                        </FloatComponent>


                        <div className="flex flex-wrap justify-center gap-1 sm:gap-4 mt-0 max-w-full overflow-hidden">
                            {player?.hand.map((card, index) => (
                                <div key={index} className="scale-80  lg:scale-100">
                                    {cardStyle(card)}
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="w-full pt-6 lg:w-1/5 mt-6 lg:mt-0 flex flex-col min-h-0 h-full overflow-hidden order-3">
                    <div className="h-full w-full flex flex-col gap-2 overflow-hidden">

                        <div className="hidden lg:flex flex-1 min-h-0 overflow-hidden text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                            <InfoGame info={gameInfo} />
                        </div>

                        <div className="flex flex-col gap-2 pb-4 items-center shrink-0">
                            <button
                                onClick={handleRestartGame}
                                className={`w-full lg:w-auto px-3 py-1  text-white rounded hover:shadow-[0_0_20px_rgba(59,130,246,0.8)]
                                ${restartGameButton ? 'bg-blue-800' : 'bg-blue-500 transition-all hover:scale-105'}
                            `}
                                disabled={restartGameButton}
                            >
                                {t("restartGame")}
                            </button>

                            <ReturnButton
                                setMenuState={setMenuState}
                                menuState={"select"}
                                className="w-full lg:w-auto dark:bg-gray-500
                             dark:hover:bg-gray-600 text-white bg-gray-400 rounded-lg hover:bg-gray-600"
                            >
                                <p className="text-lg font-bold text-white transition-all hover:scale-105">
                                    {t("exitGame")}
                                </p>
                            </ReturnButton>
                        </div>


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
                                    className=" lg:w-auto transition-all hover:scale-105 bg-red-500 dark:bg-red-700 hover:bg-red-600
                                     dark:hover:bg-red-800 rounded-lg"
                                >
                                    <p className="text-sm sm:text-lg font-bold text-white">
                                        {t("exitGame")}
                                    </p>
                                </ReturnButton>
                            }

                        >
                            <div className="w-full overflow-x-auto overflow-auto rounded-xl border border-zinc-300 dark:border-zinc-700">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-zinc-100 dark:bg-zinc-800">
                                            <th className="px-4 py-3 text-left font-bold">
                                                {t("player")}
                                            </th>
                                            <th className="px-4 py-3 text-center font-bold">
                                                {t("status")}
                                            </th>
                                            <th className="px-4 py-3 text-center font-bold">
                                                {t("wins")}
                                            </th>
                                            <th className="px-4 py-3 text-center font-bold">
                                                {t("rounds")}
                                            </th>
                                            <th className="px-4 py-3 text-center font-bold">
                                                {t("tie")}
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {sortedPlayers.map((player, index) => {
                                            const winners = sortedPlayers.filter(
                                                p => p.roundsWin === maxWins
                                            );

                                            const status =
                                                player.roundsWin === maxWins
                                                    ? winners.length > 1
                                                        ? "draw"
                                                        : "win"
                                                    : "lose";

                                            const statusText = {
                                                win: locale === "es" ? "Ganador" : "Winner",
                                                lose: locale === "es" ? "Perdedor" : "Loser",
                                                draw: locale === "es" ? "Empate" : "Draw",
                                            };


                                            return (
                                                <tr
                                                    key={player.idPlayer}
                                                    className={` border-t border-zinc-200 dark:border-zinc-700
                                                        ${index % 2 === 0
                                                            ? "bg-white dark:bg-zinc-900"
                                                            : "bg-zinc-50 dark:bg-zinc-800/50"
                                                        }
                                                    `}
                                                >
                                                    <td className="px-4 py-3 font-medium whitespace-nowrap">
                                                        {player.userName}
                                                    </td>

                                                    <td className="px-4 py-3 text-center">
                                                        <span
                                                            className={`
                                                            px-2 py-1 rounded-full text-xs font-bold
                                                            ${status === "win"
                                                                    ? "bg-green-500/20 text-green-500"
                                                                    : status === "lose"
                                                                        ? "bg-red-500/20 text-red-500"
                                                                        : "bg-yellow-500/20 text-yellow-500"
                                                                }
                                                            `}
                                                        >
                                                            {statusText[status]}
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-3 text-center font-bold">
                                                        {player.roundsWin}
                                                    </td>

                                                    <td className="px-4 py-3 text-center">
                                                        {gameData?.countRound}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        {tieCount}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </GameDialog>

                        <DialogSelectDifficult
                            open={openDifficultDialog}
                            onOpenChange={setOpenDifficultDialog}
                            title={t("selectDifficulty")}
                            childrenBottom={
                                <div className="flex justify-center w-full">
                                    <ReturnButton
                                        setMenuState={setMenuState}
                                        menuState="select"
                                        className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-900
                                        text-white rounded-lg  font-bold
                                        transition-all hover:scale-105"

                                    >
                                        {t("exitGame")}
                                    </ReturnButton>
                                </div>
                            }
                        >
                            <div className="flex flex-col w-full h-full gap-5">
                                <div className="flex flex-col">

                                    <div className="flex flex-row items-center gap-4">
                                        <p className="text-base sm:text-lg font-bold text-gray-800 dark:text-white">
                                            {t("numberOfRounds")}:
                                        </p>

                                        <QuantitySelector
                                            value={rounds}
                                            onChange={setRounds}
                                        />

                                    </div>

                                </div>

                            </div>
                        </DialogSelectDifficult>

                    </div>
                </div>
            </div>
        </div >
    );
}