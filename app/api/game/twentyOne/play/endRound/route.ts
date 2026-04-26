import { NextResponse } from "next/server"
import { createGame, updateGame } from "@/lib/gameEngine/gameStore"
import { randomUUID } from "crypto"
import { prepareGame } from "@/lib/gameEngine/prepareGame"
import { calculateHandValue, scoreGame } from "@/lib/gameEngine/twetyOne/twety_One"


export async function POST(req: Request) {

    const { GameState: gameData } = await req.json()

    const currentRound = gameData.round + 1

    if (currentRound > gameData.countRound) {
        gameData.statusGame = "finished"
    }
    const roundScore = scoreGame(gameData.playerHand)
    const { playerHand, remainingDeck } = prepareGame(2)


    const game = {
        id: gameData.id,
        playerHand: playerHand,
        enemyHand: playerHand,
        score: gameData.score += roundScore,
        deck: remainingDeck,
        turn: "player",
        round: currentRound,
        countRound: 5,
        statusGame: gameData.statusGame,
        handValue: calculateHandValue(playerHand),
        lastUpdated: Date.now()
    }

    updateGame(gameData.id, game)

    return NextResponse.json(game)
}

