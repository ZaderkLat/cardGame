"use client";

import { useEffect, useState } from "react";
import { GameState, LogGame } from "@/interface/gameData";
import { dialogData } from "@/interface/dialog";
import InfoGame from "@/components/ui/infoGame";
import GameDialog from "@/components/ui/dialogGameMessaje";
import ReturnButton from "@/components/uiGame/returnButton";
import { MenuStatus } from "@/interface/menuStatus";
import { PlayerInfo } from "@/interface/gameData";
import DialogSelectDifficult from "@/components/ui/dialogSelectDifficult";
import AnimationFloatingLabel from "@/components/uiGame/twentyOne/animationFloatingLabel";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Maze from "@/components/uiGame/maze";
import { useRef } from "react";
import QuantitySelector from "@/components/ui/quantitySelector";
import { calculateHandValue } from "@/lib/gameEngine/twentyOne/twenty_One";
import { User } from "@/interface/userData";
import { PlayerHand } from "@/components/uiGame/twentyOne/playerHand";
import FlyingCard from "@/components/uiGame/twentyOne/animationMazeToHand";
import { useCardDealAnimation } from "@/hooks/useCardDealAnimation";
import { DealerHand } from "@/components/uiGame/twentyOne/dealerHand";
import { statusStyles } from "@/interface/gameData";
import { card } from "@/interface/card";


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
    // language path
    const locale = useLocale();
    //Game State

    const [gameInfo, setGameInfo] = useState<LogGame[]>([]);

    const [dialog, setDialog] = useState<dialogData>({
        open: false,
        title: "",
        description: "",
        status: "continue" as const,

    });
    const [drawnCard, setDrawnCard] = useState<any>(null);
    const [isFlippingCard, setIsFlippingCard] = useState(false);
    const [isDealingCard, setIsDealingCard] = useState(false);
    //------------------------------//
    /*Game Data*/
    const [gameData, setGameData] = useState<GameState | null>(null);


    const [player, setPlayer] = useState<PlayerInfo>();
    const [dealer, setDealer] = useState<PlayerInfo>();

    const [floatStyle, setFloatStyle] = useState({
        text: "",
        color: "",
        background: "",
        border: "",
        shadow: "",
    });
    const [showMessaje, setShowMessaje] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

    // Function index (quick lookup):
    // - startGame: initialize the game and request initial hands from server
    // - handleTakeCard: player draws a card (handles animation + backend request)
    // - handleDealer: triggers the dealer's play sequence (animations + logic)
    // - handleEndRound: ends the current round and advances the game
    // - animateDealerCard: animate a single dealer card being dealt
    // - registerRecord: persist the final game record to the database
    // Handler difficult selection

    const [openDifficultDialog, setOpenDifficultDialog] = useState<boolean>(false);
    //disable "end round" button
    const [endRoundButton, setEndRoundButton] = useState<boolean>(true);
    //disable "restart game" button
    const [gameControlsDisabled, setGameControlsDisabled] = useState(true);
    //disable takeCark button
    const [takeCardButton, setTakeCardButton] = useState<boolean>(true)
    //control if show the button "Stand" or "endRound"
    const [isPlaying, setIsPlaying] = useState<boolean>(true)
    const [tieCount, setTieCount] = useState<number>(0);
    /** References for animations */
    const deckRef = useRef<HTMLButtonElement>(null);
    const deckRefCenter = useRef<HTMLButtonElement>(null);
    const handRef = useRef<HTMLDivElement>(null);


    const [dealerDrawnCard, setDealerDrawnCard] = useState<any>(null);

    const [isDealerDealing, setIsDealerDealing] = useState(false);
    const [isDealerFlipping, setIsDealerFlipping] = useState(false);


    const [isDealerHiddenCardFlipping, setIsDealerHiddenCardFlipping] = useState(false);
    const [dealerHiddenCardRevealed, setDealerHiddenCardRevealed] =
        useState(false);
    // ---------------------- Layout & refs end / Game actions ----------------------

    /**Card Deal Animation */
    const playerAnimation = useCardDealAnimation();
    const dealerAnimation = useCardDealAnimation();
    //It's function is control the animation velocity, only chance in dealing of cards {startGame and handlerEndRound}
    const [cardFlylingDuration, setCardFlylingDuration] = useState<number>(0.5);
    //Ask the server to start a new game and get the initial hand and deck
    const updatePlayersWithoutCards = (gameData: GameState) => {

        if (!gameData) return;

        const playerInfo = getPlayer(gameData);
        if (!playerInfo) return;
        setDealer({
            ...gameData.players[0],
            hand: [],
            handValue: 0,
        });
        setPlayer({
            ...playerInfo,
            hand: [],
            handValue: 0,
            status: "continue"
        });
    }
    const updatePlayerStatus = (gameData: GameState) => {

        if (!gameData) return;

        const playerInfo = getPlayer(gameData);
        if (!playerInfo) return;

        setPlayer(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                status: playerInfo.status
            };
        });
    }
    const startGame = async () => {

        setTakeCardButton(true);
        setGameControlsDisabled(true);
        setEndRoundButton(true);
        setTakeCardButton(true);
        setDealerHiddenCardRevealed(false);
        setIsDealerHiddenCardFlipping(false);
        setShowMessaje(false);
        setIsDealerDealing(false);
        setIsDealerFlipping(false);
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
        setCardFlylingDuration(0.3);
        const response: GameState = await res.json();

        const playerInfo = getPlayer(response)

        if (!playerInfo) return;

        // player without cards
        updatePlayersWithoutCards(response);



        await addInitialCards(response);
        //update player's status
        updatePlayerStatus(response);

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
        setGameData(response);
        setIsPlaying(true);
        setEndRoundButton(false);
        setGameControlsDisabled(false);
        setTakeCardButton(false);
        setCardFlylingDuration(0.5);
    }
    const floatMessage = () => {
        if (!player || player.status === "continue") return;

        if (player.handValue == dealer?.handValue) {
            setTieCount(prev => prev + 1);
            setFloatStyle({
                text: t("tie"),
                ...statusStyles["push"],
            });

        } else {
            setFloatStyle({
                text: t(`${player.status}`),
                ...statusStyles[player.status],
            });
        }

        const show = player.status == "win" || player.status == "lose" || player.status == "blackJack" || player.status == "push";
        setShowMessaje(show);
    }

    useEffect(() => {

        floatMessage();

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
    const getPlayer = (gameData: GameState) => {

        return gameData?.players.find(p => p.idPlayer === user.id)

    }


    const handleTakeCard = async () => {
        if (!gameData) return;

        const deckElement =
            deckRef.current?.offsetWidth
                ? deckRef.current
                : deckRefCenter.current;

        if (!deckElement) return;

        try {
            setGameControlsDisabled(true);
            setEndRoundButton(true);
            setTakeCardButton(true);


            await playerAnimation.prepareAnimation(deckElement);

            setIsDealingCard(true);

            const responsePromise = fetch(
                "/api/game/twentyOne/dealer/play/takeCard",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        gameId: gameData.id,
                        idPlayer: player?.idPlayer,
                    }),
                }
            ).then(res => res.json());

            const [response] = await Promise.all([
                responsePromise,
                sleep(500),
            ]);

            const updatedPlayer = getPlayer(response);

            if (!updatedPlayer) return;

            const lastCard = updatedPlayer.hand.at(-1);

            if (!lastCard) {
                throw new Error("El servidor no devolvió una carta");
            }

            setDrawnCard(lastCard);

            await sleep(100);

            setIsFlippingCard(true);

            await sleep(500);

            setGameData(response);

            setIsFlippingCard(false);
            setIsDealingCard(false);
            setPlayer(updatedPlayer)
            playerAnimation.reset();

        } catch (error) {
            console.error("Error al tomar carta:", error);

            setIsFlippingCard(false);
            setIsDealingCard(false);

            playerAnimation.reset();

        } finally {
            setTakeCardButton(false);
            setEndRoundButton(false);
            setGameControlsDisabled(false);
            setEndRoundButton(false);
        }
    };
    //isFlippingCard is necesary for the function addInitialCards, because, in the first dealing of cards
    //is needed that the card don't flip, so isFlippingCard is false, in the other cases is true
    const animateDealerCard = async (card: card, isFlippingCard: boolean) => {
        const deckElement =
            deckRef.current?.offsetWidth
                ? deckRef.current
                : deckRefCenter.current;

        if (!deckElement) return;

        await dealerAnimation.prepareAnimation(deckElement);

        setDealerDrawnCard(card);
        setIsDealerDealing(true);

        await sleep(500);

        setIsDealerFlipping(isFlippingCard);

        await sleep(500);

        setIsDealerFlipping(false);
        setIsDealerDealing(false);

        dealerAnimation.reset();
    };

    const handleEndRound = async () => {

        if (!gameData) return;
        setCardFlylingDuration(0.3);
        //disable "end round" and "take card" button
        setGameControlsDisabled(true);
        setEndRoundButton(true);
        setTakeCardButton(true);

        const response = await fetch(`/api/game/twentyOne/dealer/play/endRound`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                gameId: gameData.id,
            })
        }).then(res => res.json()) as GameState;
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
            setDealerHiddenCardRevealed(false)
            setShowMessaje(false);
            setIsDealerHiddenCardFlipping(false);
            setIsDealerDealing(false);
            setIsDealerFlipping(false);





            updatePlayersWithoutCards(response);

            await addInitialCards(response)
            updatePlayerStatus(response);
            setGameControlsDisabled(false);
            setIsPlaying(true);
            setEndRoundButton(false);
            setTakeCardButton(false);
            setGameData(response);
            setCardFlylingDuration(0.5);
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
    const sleep = (ms: number) =>
        new Promise(resolve => setTimeout(resolve, ms));

    // ---------------- DEALER PLAY (animations & dealer flow) ----------------

    const handleDealer = async () => {
        if (!gameData || !player) return;
        setGameControlsDisabled(true);
        setEndRoundButton(true);
        setTakeCardButton(true);

        setIsPlaying(false);


        if (player.handValue < 21) {
            setFloatStyle({
                text: (t("stand")),
                ...statusStyles["stand"],
            });
        }

        setShowMessaje(true);
        // Ensure the second card starts hidden
        setDealerHiddenCardRevealed(false);
        setIsDealerHiddenCardFlipping(false);

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

        const dealerInfo = response.players[0];

        // -----------------------------------------
        // 1. SHOW THE TWO CARDS
        // -----------------------------------------
        setIsDealerHiddenCardFlipping(true);
        setDealer({
            ...dealerInfo,
            hand: dealerInfo.hand.slice(0, 2),
            handValue: calculateHandValue(
                dealerInfo.hand.slice(0, 2)
            )
        });

        // Wait so the user can see the two cards, with the second one hidden.
        await sleep(700);


        // The card remains permanently revealed
        setDealerHiddenCardRevealed(true);
        setIsDealerHiddenCardFlipping(false);

        await sleep(700);

        // -----------------------------------------
        // 3. ADDITIONAL CARDS
        // -----------------------------------------

        for (let i = 2; i < dealerInfo.hand.length; i++) {

            const card = dealerInfo.hand[i];

            await animateDealerCard(card, true);

            // Add the card to the real hand
            setDealer(prev => {
                if (!prev) return dealerInfo;

                const updatedHand = [
                    ...prev.hand,
                    card
                ];

                return {
                    ...prev,
                    hand: updatedHand,
                    handValue: calculateHandValue(updatedHand)
                };
            });

            setGameInfo(prev => [
                ...prev,
                {
                    type: "info",
                    message:
                        `${dealerInfo.userName}: ${t("cardTaken")}: ` +
                        `${card.rank} ${t("of")} ` +
                        `${card[`club_${locale}` as "club_es" | "club_en"] ?? ""}`
                }
            ]);

            await sleep(500);
        }

        // -----------------------------------------
        // 4. FINAL
        // -----------------------------------------

        setIsDealerHiddenCardFlipping(false);

        setEndRoundButton(false);

        resultMessage(response);

        setGameData(response);
        const playerInfo = getPlayer(response)

        if (!playerInfo) return;

        setPlayer(playerInfo);

        setEndRoundButton(false);

        setGameControlsDisabled(false);
        floatMessage();
    };

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
    // ---------------- DEALER PLAY (summary) ----------------

    useEffect(() => {

        if (openDifficultDialog === false) {


            startGame();
        }

    }, [openDifficultDialog]);
    // Create the user player list when the user loads
    const animatePlayerCard = async (card: card) => {
        const deckElement =
            deckRef.current?.offsetWidth
                ? deckRef.current
                : deckRefCenter.current;

        if (!deckElement) return;

        await playerAnimation.prepareAnimation(deckElement);

        setDrawnCard(card);
        setIsDealingCard(true);

        await sleep(500);

        setIsFlippingCard(true);

        await sleep(500);

        setIsFlippingCard(false);
        setIsDealingCard(false);

        playerAnimation.reset();
    };
    const addDealerCard = async (card: card, isFlipping: boolean) => {

        await animateDealerCard(card, isFlipping);

        setDealer(prev => {
            if (!prev) return prev;

            const updatedHand = [
                ...prev.hand,
                card,
            ];

            return {
                ...prev,
                hand: updatedHand,
                handValue: calculateHandValue(updatedHand),
            };
        });

        await sleep(10);
    };
    const addPlayerCard = async (card: any) => {
        await animatePlayerCard(card);

        setPlayer(prev => {
            if (!prev) return prev;

            const updatedHand = [
                ...prev.hand,
                card,
            ];

            return {
                ...prev,
                hand: updatedHand,
                handValue: calculateHandValue(updatedHand),
            };
        });

        await sleep(10);
    };
    const addPlayerCards = async (gameData: GameState) => {
        const playerInfo = gameData.players.find(
            p => p.idPlayer === user.id
        );

        if (!playerInfo) return;

        for (const card of playerInfo.hand.slice(0, 2)) {
            await addPlayerCard(card);
        }
    };
    //update player data and dealer

    const addInitialCards = async (gameData: GameState) => {
        const playerInfo = getPlayer(gameData);
        const dealerInfo = gameData.players[0];

        if (!playerInfo || !dealerInfo) return;

        const playerCards = playerInfo.hand.slice(0, 2);
        const dealerCards = dealerInfo.hand.slice(0, 2);

        for (let i = 0; i < 2; i++) {

            await Promise.all([
                addPlayerCard(playerCards[i]),
                //(i === 0) is true only at the first dealer card, so, only this card flipping
                //the second one still hidden
                addDealerCard(dealerCards[i], (i === 0)),
            ]);
        }
    };
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
        <>
            <div className="flex flex-col flex-1 w-full lg:h-full h-fit min-h-0 overflow-hidden">

                <div className="flex h-full w-full flex-col flex-1 bg-zinc-50 dark:bg-black ">

                    {/* MAIN WRAPPER */}
                    <div className="flex flex-col lg:flex-row flex-1 justify-center p-2 pt-0 w-full h-full gap-4 ">
                        {/*LEFT PANEL */}
                        <div className="hidden lg:flex relative flex-col items-center justify-center w-1/5 ">
                            {/* Score and Round */}
                            <div className="flex flex-row absolute justify-between w-full mb-4 lg:absolute lg:left-0 lg:top-0 lg:flex-col lg:w-auto">

                                <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                                    {t("round")}: {`${gameData?.round} / ${gameData?.countRound}`}
                                </h1>
                                <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                                    {t("wonRounds")}: {`${player?.roundsWin}`}
                                </h1>

                            </div>
                            <div className="relative">


                                <button
                                    ref={deckRef}
                                    onClick={handleTakeCard}
                                    className={`w-20 h-32 lg:w-28 lg:h-40 overflow-hidden rounded
                                transition duration-200 hover:shadow-lg hover:shadow-gray-400/40
                                hover:scale-105 active:scale-95 disabled:opacity-50
                                ${((player?.handValue ?? 0) < 21) && !takeCardButton ? 'animate-breathe' : ''}`}
                                    disabled={
                                        (player?.handValue ?? 0) >= 21 || takeCardButton
                                    }
                                >
                                    <Maze />
                                </button>
                            </div>

                            <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                                {t("clickToDraw")}
                            </p>

                        </div>
                        {/* CENTER PANEL*/}
                        <div

                            className="flex flex-col items-center justify-between w-full lg:w-3/5 order-1 relative">


                            <div className="flex flex-col items-center justify-center w-full">
                                {/* BOTTOM ---DEALER--- HAND */}
                                <div className="relative flex flex-col items-center pb-1 lg:pb-6 border-2 border-zinc-400
                                    dark:border-zinc-900 dark:border-2 px-4  lg:px-10 rounded w-full max-w-2xl mt-4">

                                    {/* Button over border*/}

                                    <h2 className="text-xl mt-2 lg:mt-4 lg:text-2xl font-bold text-gray-800 dark:text-white ">
                                        {t("dealerHand")}:
                                    </h2>

                                    <div className="text-lg lg:text-2xl font-bold text-gray-800 dark:text-white mt-2">
                                        {t("handValue")}: {(dealer?.handValue ?? 0)}
                                    </div>
                                    <DealerHand
                                        dealerHand={dealer?.hand || []}
                                        placeholderCard={dealerAnimation.placeholder}
                                        dealerScrollRef={dealerAnimation.scrollRef}
                                        centerRef={dealerAnimation.targetRef}
                                        isHiddenCardFlipping={isDealerHiddenCardFlipping}
                                        hiddenCardRevealed={dealerHiddenCardRevealed}
                                    />


                                </div>



                            </div>
                            <AnimationFloatingLabel
                                show={showMessaje}
                                text={floatStyle.text}
                                color={floatStyle.color}
                                background={floatStyle.background}
                                border={floatStyle.border}
                                shadow={floatStyle.shadow}
                            />

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
                                        ref={deckRefCenter}
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
                            <div
                                ref={handRef}
                                className="relative flex flex-col items-center pb-1 lg:pb-6  border-2 border-zinc-400
                                    dark:border-zinc-900 dark:border-2 px-4 sm:px-6 lg:px-10 rounded w-full max-w-2xl
                                    ">

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
                                                {t("standButton")}
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
                                                {t("endRoundButton")}
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



                                {/*player cards*/}
                                <PlayerHand
                                    playerHand={player?.hand || []}
                                    placeholderCard={playerAnimation.placeholder}
                                    playerScrollRef={playerAnimation.scrollRef}
                                    centerRef={playerAnimation.targetRef}
                                />

                            </div>
                        </div>

                        {/* RIGHT PANEL */}
                        <div className="w-full lg:pt-6 pt-0 lg:w-1/5 mt-0 flex flex-col min-h-0 h-full overflow-hidden order-3">
                            <div className="h-full w-full flex flex-col gap-2 overflow-hidden">

                                <div className="hidden lg:flex flex-1 min-h-0 overflow-hidden text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                                    <InfoGame info={gameInfo} />
                                </div>

                                <div className="flex flex-col gap-2 pb-4 items-center shrink-0">
                                    <button
                                        onClick={handleRestartGame}
                                        className={`w-full lg:w-auto px-3 py-1 text-white rounded
                                                hover:shadow-[0_0_20px_rgba(59,130,246,0.8)]
                                            ${gameControlsDisabled
                                                ? "bg-blue-800"
                                                : "bg-blue-500 transition-all hover:scale-105"
                                            }`}
                                        disabled={gameControlsDisabled}
                                    >
                                        {t("restartGame")}
                                    </button>

                                    <ReturnButton
                                        setMenuState={setMenuState}
                                        menuState="select"
                                        className={`w-full lg:w-auto rounded-lg text-white
                                                ${gameControlsDisabled
                                                ? "dark:bg-gray-700 bg-gray-600"
                                                : "dark:bg-gray-500 dark:hover:bg-gray-600 bg-gray-400 hover:bg-gray-600 transition-all hover:scale-105"
                                            }`}
                                        disabled={gameControlsDisabled}
                                    >
                                        <p className="text-lg font-bold text-white">
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

            </div>
            {/**Player Animations */}
            <FlyingCard
                isDealing={isDealingCard}
                isFlipping={isFlippingCard}
                card={drawnCard}
                animation={playerAnimation}
                duration={cardFlylingDuration}
            />
            {/**Dealer Animations */}
            <FlyingCard
                isDealing={isDealerDealing}
                isFlipping={isDealerFlipping}
                card={dealerDrawnCard}
                animation={dealerAnimation}
                duration={cardFlylingDuration}
            />
        </>
    );

}

