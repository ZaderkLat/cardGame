"use client";

import { useEffect, useState } from "react";
import { card } from "@/interface/card";
import cardStyle from "@/components/ObjectsGame/cardStyle";
import { GameState, LogGame } from "@/interface/gameData";
import { dialogData } from "@/interface/dialog";
import InfoGame from "@/components/ui/infoGame";
import GameDialog from "@/components/ui/dialogGameMessaje";
import { isWinner } from "@/lib/gameEngine/twetyOne/twety_One";
import { useUser } from "@/hooks/useUser";

import TwentyOneTable from "@/components/uiGame/twentyOneTable";

export default function Home() {
  //userData
  const { user, loading } = useUser();
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

  const [restartGame, setRestartGame] = useState<boolean>(false);

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



  const handleRestartGame = () => {
    setRestartGame(true);
  }



  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">

      {/* Container */}
      <div className="flex flex-row flex-1 justify-center p-4">

        {/* left container */}
        <div className="flex flex-col items-center justify-center w-1/4 h-full">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Score: {score}
          </h2>
        </div>

        {/* center container */}
        <div className="flex flex-col items-center justify-center w-1/2">
          <TwentyOneTable setGameInfo={setGameInfo} setRestartGame={setRestartGame} restartGame={restartGame} />
        </div>
        {/* right container */}
        <div className="flex flex-col w-1/4 h-full">

          {/* Top section: InfoGame takes most of the vertical space */}
          <div className="flex-1 flex items-start justify-center text-2xl font-bold text-gray-800 dark:text-white mb-4 ">
            <InfoGame info={gameInfo} />
          </div>

          {/* Bottom section: buttons aligned at the bottom */}
          <div className="flex flex-col gap-2 pb-4 items-center">
            <button
              onClick={handleRestartGame}
              className="px-3 py-1  bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Restart Game
            </button>

            <button
              onClick={getGameState}
              className="px-3 py-1  bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Get Data
            </button>

            <GameDialog
              open={dialog.open}
              onOpenChange={handleOpenChange}
              title={dialog.title}
              description={dialog.description}
              status={dialog.status}
            />




          </div>

        </div>




      </div>


    </div>
  );
}
