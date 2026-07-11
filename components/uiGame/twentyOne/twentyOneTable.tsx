"use client";

import { useEffect, useState } from "react";

import { card } from "@/interface/card";
import cardStyle from "@/components/ObjectsGame/cardStyle";
import { GameState, LogGame, PlayersRequest, Mode } from "@/interface/gameData";
import { dialogData } from "@/interface/dialog";
import InfoGame from "@/components/ui/infoGame";
import GameDialog from "@/components/ui/dialogGameMessaje";
import { isWinner } from "@/lib/gameEngine/twetyOne/twety_One";
import ReturnButton from "@/components/uiGame/returnButton";
import { MenuStatus } from "@/interface/menuStatus";
import { difficulties, PlayerInfo } from "@/interface/gameData";
import DialogSelectDifficult from "@/components/ui/dialogSelectDifficult";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import FloatComponent from "@/components/ui/floatComponent";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Maze from "@/components/uiGame/maze";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"
import { SimpleCombobox } from "@/components/ui/simpleComboBox";
import { useUser } from "@/hooks/useUser";
interface TwentyOneTableProps {
    setMenuState: (state: MenuStatus) => void;

}

export default function Home({ setMenuState }: TwentyOneTableProps) {
    const t = useTranslations("twentyOne");
    const { user } = useUser();

    const [players, setPlayers] = useState<PlayersRequest[]>([])


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
    const modes: Mode[] = [
        { label_es: "Solitario", label_en: "Solo", value: "solo" },
        { label_es: "Contra Dealer", label_en: "VS Dealer", value: "dealer" }
    ] as const;
    const [mode, setMode] = useState("solo");
    //------------------------------//
    const [value, setValue] = useState<string | null>(null)
    /*Game Data*/
    const [gameData, setGameData] = useState<GameState | null>(null);

    const player = gameData?.players.find(
        p => p.idPlayer === user?.id
    );

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

        //create the player "dealer"<-CPU
        setRestarGameButton(true);
        setEndRoundButton(true);
        const res = await fetch("/api/game/twentyOne/startGame", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(players),
        });

        if (!res.ok) {
            throw new Error("Error al iniciar la partida");
        }

        const response: GameState = await res.json();
        setGameData(response);

        setGameData(response);

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

        setEndRoundButton(false);
        setRestarGameButton(false);

    }

    useEffect(() => {
        if (!player) return;

        if (player.handValue === 21 && player.hand.length === 2) {
            setTextFloadComponent(t("perfectRound"));
            return;
        }

        if (player.handValue === 21) {
            setTextFloadComponent(t("youWin"));
            return;
        }

        if (player.handValue > 21) {
            setTextFloadComponent(t("youLose"));
            return;
        }

    }, [player, t]);

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
    const getPlayer = () => {

        return gameData?.players.find(p => p.idPlayer === user?.id)

    }
    //* -------------------------------------------------------------------- */
    const handleTakeCard = async () => {
        if (!gameData || !user) return;

        const response = await fetch("/api/game/twentyOne/play/takeCard", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                gameId: gameData.id,
            })
        }).then(res => res.json()) as GameState;

        setGameData(response);

        const player = getPlayer();

        if (!player) return;

        const lastCard = player.hand.at(-1);

        setGameInfo(prev => [
            ...prev,
            {
                type: "info",
                message: `${t("cardTaken")}: ${lastCard?.rank} ${t("of")} ${lastCard?.[`club_${locale}` as "club_es" | "club_en"] ?? ""
                    }`,
            },
        ]);
    };
    const handleEndRound = async () => {
        //disable "end round" button
        setEndRoundButton(true);

        if (!gameData) return;
        const response = await fetch("/api/game/twentyOne/play/endRound", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ GameState: gameData })
        }).then(res => res.json()) as GameState;
        setGameData(response);
        setEndRoundButton(false);

        if (response.score !== score) {
            setGameInfo(prev => [...prev, { type: "win", message: `${t("round")} ${response.round - 1} ${t("scoreObtained")}: ${response.score - score}` }]);
        } else {
            setGameInfo(prev => [...prev, { type: "lose", message: `${t("round")}  ${response.round - 1} ${t("noScore")}.` }]);
        }


        //* control the dialog when the game ends*/
        if (response.statusGame !== "finished") {
            //after I make the system to select the difficulty level

            const { status, message } = isWinner(response.score, difficulty, response.countRound);

            openDialog({
                title: t("gameResult"),
                description: `${t(message)}\n${t("score")}: ${response.score}\n${t("difficult")}: ${difficulties[difficulty][`name_${locale}` as "name_es" | "name_en"]}`,
                status: status,
            });


            setPendingAction(() => () => {
                setGameInfo(prev => [
                    ...prev,
                    { type: status, message: `${t(message)} ${t("with")} ${response.score} ${t("points")}.` },
                ]);

                setGameData(null);



                startGame();
            });

        } else {



        }
    }
    useEffect(() => {
        if (openDifficultDialog === false) {
            startGame();
        }

    }, [openDifficultDialog]);

    const handleRestartGame = () => {
        setOpenDifficultDialog(true);
    }

    useEffect(() => {
        if (!user) return;

        setPlayers([
            {
                idPlayer: user.id,
                userName: user.name,
            },
        ]);
    }, [user]);

    useEffect(() => {
        setPlayers((prevPlayers) => {
            if (mode === "solo") {
                return prevPlayers.filter(
                    (player) => player.idPlayer !== "dealer"
                );
            }

            const dealerExists = prevPlayers.some(
                (player) => player.idPlayer === "dealer"
            );

            if (dealerExists) {
                return prevPlayers;
            }

            return [
                ...prevPlayers,
                {
                    idPlayer: "dealer",
                    userName: "Dealer",
                },
            ];
        });
    }, [mode]);



    return (
        <div className="flex flex-col min-h-full bg-zinc-50 dark:bg-black">

            {/* MAIN WRAPPER */}
            <div className="flex flex-col lg:flex-row flex-1 justify-center p-2 gap-4 w-full h-full">

                {/* CENTER */}
                <div className="flex flex-col items-center justify-center w-full">

                    {/* TOP BAR */}
                    <div className="flex justify-between w-full px-2 relative">

                        {/* Score y Round */}
                        <div className="absolute left-1 top-2 w-full px-2 flex justify-between sm:justify-start sm:flex-col sm:w-auto">

                            <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                                {t("score")}: {`${player?.score ?? 0} / ${difficulties[difficulty].requerimentPoints * (gameData?.countRound ?? 0)}`}
                            </h1>

                            <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                                {t("round")}: {`${gameData?.round} / ${gameData?.countRound}`}
                            </h1>

                        </div>

                        {/* Title */}
                        <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 dark:text-white mx-auto pt-10 sm:pt-16 lg:pt-2">
                            {t("title")}
                        </h1>


                    </div>

                    {/* CARD BUTTON AREA */}
                    <div className="relative flex flex-1 flex-col items-center justify-center mt-6 w-full">
                        <FloatComponent isVisible={(player?.handValue ?? 0) >= 21}>
                            <div className="text-center">
                                <span>{textFloatComponent}</span>
                            </div>
                        </FloatComponent>

                        <button
                            onClick={handleTakeCard}
                            className={`w-20 h-32 sm:w-24 sm:h-36 lg:w-28 lg:h-40 overflow-hidden rounded
                             transition duration-200 hover:shadow-lg hover:shadow-gray-400/40 hover:scale-105
                              active:scale-95 disabled:opacity-50 
                              ${(player?.handValue ?? 0) < 21 ? 'animate-breathe' : ''}`}
                            disabled={(player?.handValue ?? 0) >= 21}
                        >
                            <Maze />
                        </button>

                        <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                            {t("clickToDraw")}
                        </p>


                    </div>

                    {/* BOTTOM PLAYER HAND */}
                    <div className="relative flex flex-col items-center pb-6 border-2 border-zinc-400
                     dark:border-zinc-900 dark:border-2 px-4 sm:px-6 lg:px-10 rounded w-full max-w-2xl mt-6">

                        {/* Button over border*/}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <button
                                onClick={handleEndRound}
                                className={`
                                    px-3 sm:px-4 py-2 text-white rounded-lg
                                    ${(player?.handValue ?? 0) >= 21 ? 'animate-breathe' : ''} hover:shadow-[0_0_20px_rgba(192,192,192,0.8)] 
                                    ${endRoundButton ? 'bg-red-800' : 'bg-red-500'} transition-all hover:scale-105
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
                            {t("handValue")}: {(player?.handValue ?? 0)}
                        </div>

                        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4">
                            {player?.hand.map((card, index) => (
                                <div key={index} className="scale-90 sm:scale-100">
                                    {cardStyle(card)}
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="w-full lg:w-1/4 mt-6 lg:mt-0 flex flex-col min-h-0">

                    <div className="hidden sm:flex flex-1 min-h-0 text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">
                        <InfoGame info={gameInfo} />
                    </div>

                    <div className="flex flex-col gap-2 pb-4 items-center">
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
                                    className="w-full lg:w-auto transition-all hover:scale-105 bg-red-500 dark:bg-red-700 hover:bg-red-600
                                     dark:hover:bg-red-800 rounded-lg"
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
                                        className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-900
                                        text-white rounded-lg  font-bold
                                        transition-all hover:scale-105"

                                    >
                                        {t("exitGame")}
                                    </ReturnButton>
                                </div>
                            }
                        >
                            <>
                                <div className="flex flex-col">
                                    <p className="text-base sm:text-lg font-bold text-gray-800 pb-4 dark:text-white">
                                        Select mode:
                                    </p>
                                    <SimpleCombobox
                                        items={modes}
                                        value={mode}
                                        languaje={locale}
                                        onChange={setMode}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-base sm:text-lg font-bold text-gray-800 pb-4 dark:text-white text-center">
                                        <p>{t("difficultyText")}</p>
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
                                                        className=" border-gray-400 data-[state=checked]:bg-blue-600"
                                                    />

                                                    <div className="flex flex-row sm:flex-row gap-1 sm:gap-2 items-center text-center">
                                                        <span className="text-sm sm:text-lg font-medium text-gray-800 dark:text-white">
                                                            {value[`name_${locale}` as keyof typeof value]}
                                                        </span>

                                                        <Popover>
                                                            <PopoverTrigger>
                                                                <span className="text-sm text-gray-500 dark:text-gray-300">
                                                                    (?)
                                                                </span>
                                                            </PopoverTrigger>

                                                            <PopoverContent className="max-w-62.5 sm:max-w-xs">
                                                                <p className="text-sm">
                                                                    {value[`description_${locale}` as keyof typeof value]}, {`${t("youNeed")} `}
                                                                    {value.requerimentPoints *
                                                                        (gameData?.countRound || 5)}
                                                                    {` ${t("pointsTo")}.`}
                                                                </p>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>
                                                </label>
                                            ))}
                                    </div>
                                </div>

                            </>
                        </DialogSelectDifficult>

                    </div>
                </div>
            </div>
        </div>
    );
}