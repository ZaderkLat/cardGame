import { NextResponse } from "next/server"

import { scoreGame, updateStorageGame, endRound, getStorageGame, playerInTurn, handlerTurns, isWinner, getPlayerState } from "@/lib/gameEngine/twetyOne/twety_One"
import { GameState } from "@/interface/gameData"

export async function POST(req: Request) {

    const { gameId } = await req.json()

    const gameData = getStorageGame(gameId)

    if (!gameData) {
        return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    const player = playerInTurn(gameData);

    if (!player) {
        return NextResponse.json({ error: "Player not Found" }, { status: 404 })
    }

    const roundScore = scoreGame(player.hand)
    //player.status = getPlayerState();

    const updatedPlayers = gameData.players.map(p =>
        p.idPlayer === player.idPlayer
            ? {
                ...p,
                score: roundScore + player.score,
                status: "stand" as const
            }
            : p
    );



    const game: GameState = {
        id: gameData.id,
        players: updatedPlayers,
        deck: gameData.deck,
        turn: 0,
        round: gameData.round,
        countRound: gameData.countRound,
        statusGame: gameData.statusGame,
        lastUpdated: Date.now()
    }

    updateStorageGame(gameData.id, game)

    return NextResponse.json(game)
}

