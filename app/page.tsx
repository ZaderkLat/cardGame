"use client";
import Image from "next/image";
import { getHand, calculateHandValue, isWinner, getNewCart } from "@/lib/gameEngine/twetyOne/twety_One";
import React, { use, useEffect, useState } from "react";
import { card } from "@/interface/card";
import cardStyle from "@/components/ObjectsGame/cardStyle";
import { ModeToggle } from "@/components/ui/modeToggle";


export default function Home() {

  const { playerHand, remainingDeck } = getHand();
  const [hand, setHand] = useState<card[]>([]);
  const [deck, setDeck] = useState<card[]>([]);
  const [isWin, setIsWin] = useState<string>("");
  const [handValue, setHandValue] = useState<number>(0);

  const takeCard = () => {
    const { newHand, newDeck } = getNewCart(deck, hand);
    setHand(newHand);
    setDeck(newDeck);

    const handValue = calculateHandValue(hand);

    setIsWin(isWinner(calculateHandValue(hand)));

  }
  const restartGame = () => {
    setHand(playerHand);
    setDeck(remainingDeck);
    setIsWin("");
    setHandValue(0);
  }

  useEffect(() => {
    setHandValue(calculateHandValue(hand));
  }, [hand]);

  useEffect(() => {
    setHand(playerHand);
    setDeck(remainingDeck);
  }, []);

  useEffect(() => {
    const handValue = calculateHandValue(hand);
    setIsWin(isWinner(handValue));
  }, [hand]);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans dark:bg-black">
      {/* Container */}
      <div className="flex flex-row justify-center p-4 min-h-screen">

        {/* left container */}
        <div className="flex flex-col items-center justify-center w-1/4 h-full">

        </div>

        {/* center container */}
        <div className="flex flex-col items-center justify-center w-1/2 h-100%">
          <div className="flex justify-center pt-6">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              Twenty One Game
            </h1>
          </div>

          <div className="flex flex-col items-center justify-center flex-1">
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              Hand Value: {handValue}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Game Result:
            </h2>
            <span className="text-xl font-bold">{isWin}</span>
          </div>

          {/* BOTTOM */}
          <div className="flex flex-col items-center pb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Player Hand:
            </h2>

            <div className="flex gap-4 mt-4">
              <button
                onClick={takeCard}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Take card
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
        <div className="flex flex-col items-center justify-start w-1/4 h-100%">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Remaining Deck:
          </h2>
          <button
                onClick={restartGame}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Restart Game
              </button>

              <ModeToggle />

        </div>




      </div>


    </div>
  );
}
