import { NextResponse, NextRequest } from "next/server"
import { randomUUID } from "crypto"
import { starGame, calculateHandValue, storageGame, assignTurn } from "@/lib/gameEngine/twetyOne/twety_One"
import type { GameState, PlayerInfo, PlayersRequest } from "@/interface/gameData"

export async function POST(request: NextRequest) {

    const playersGame: PlayersRequest[] = await request.json();
    /*getPlayerState return
        lose: if playerHandValue > 21
        stand: if playerHandValue == 21
        continue: if playerHandValue < 21
        blackJack: if playerHandValue == 21 & playerHand.length ==2 
        NOTE: Only LOSE is possible in takeCard function
      */
    const { playersInfo, shuffledMaze } = starGame(playersGame)

    const game: GameState = {
        id: randomUUID(),
        players: playersInfo,
        deck: shuffledMaze,
        turn: 1,
        round: 1,
        countRound: 5,
        statusGame: "continue" as const,
        lastUpdated: Date.now()
    }

    storageGame(game)

    return NextResponse.json(game)
}

