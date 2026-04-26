import { NextResponse } from "next/server"
import { createGame } from "@/lib/gameEngine/gameStore"
import { randomUUID } from "crypto"
import { prepareGame } from "@/lib/gameEngine/prepareGame"
import { calculateHandValue } from "@/lib/gameEngine/twetyOne/twety_One"

export async function POST() {
    const { playerHand, remainingDeck } = prepareGame(2)

    const game = {
        id: randomUUID(),
        playerHand: playerHand,
        enemyHand: playerHand,
        score : 0,
        deck: remainingDeck,
        turn: "player",
        round: 1,
        countRound: 5,
        statusGame: "continue" as const,
        handValue: calculateHandValue(playerHand),
        lastUpdated: Date.now()
    }

    createGame(game)

    return NextResponse.json(game)
}

