import { NextResponse, NextRequest } from "next/server"
import { randomUUID } from "crypto"
import { starGame, calculateHandValue, storageGame, assignTurn } from "@/lib/gameEngine/twetyOne/twety_One"
import type { GameState, PlayerInfo, PlayersRequest } from "@/interface/gameData"

export async function POST(request: NextRequest) {

    const playersGame: PlayersRequest[] = await request.json();

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

