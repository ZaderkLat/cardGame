"use client";

import { useEffect, useState } from "react";

import { LogGame } from "@/interface/gameData";

import InfoGame from "@/components/ui/infoGame";

import TwentyOneTable from "@/components/uiGame/twentyOneTable";

export default function Home() {

  //Game State
  const [score, setScore] = useState<number>(0);

  const [gameInfo, setGameInfo] = useState<LogGame[]>([]);

  const [restartGame, setRestartGame] = useState<boolean>(false);

  const handleRestartGame = () => {

    setRestartGame(true);
  }



  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">

      {/* Container */}
      <div className="flex flex-row flex-1 justify-center">

        {/* left container */}
        <div className="flex flex-col items-baseline justify-baseline w-1/4 p-2" >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Score: {score}
          </h2>
          <div className="text-lg text-gray-600 dark:text-gray-300">
            posible chat
          </div>
        </div>

        {/* center container */}
        <div className="flex flex-col items-center justify-center w-1/2  border-l-2 border-r-2  ">
          <TwentyOneTable setGameInfo={setGameInfo} setRestartGame={setRestartGame} restartGame={restartGame} setScore={setScore} score={score} />
        </div>

        {/* right container */}
        <div className="flex flex-col w-1/4 h-full  p-2">

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


          </div>

        </div>




      </div>


    </div>
  );
}
