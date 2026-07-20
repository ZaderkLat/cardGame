import { NextResponse } from "next/server"

import { scoreGame, updateStorageGame, endRound, getStorageGame, playerInTurn, handlerTurns, isWinner } from "@/lib/gameEngine/twetyOne/twety_One"
import { GameState } from "@/interface/gameData"

export async function POST(req: Request) {

    const { gameId } = await req.json()

    const gameData = getStorageGame(gameId)

    if (!gameData) {
        return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    const currentRound = gameData.round + 1

    if (currentRound > gameData.countRound) {
        gameData.statusGame = "finished"
    }

    const player = playerInTurn(gameData);
    if (!player) {
        return NextResponse.json({ error: "Player not Found" }, { status: 404 })
    }
    const roundScore = scoreGame(player.hand)

    const { playersInfo, shuffledMaze } = endRound(gameData)

    const updatedPlayers = playersInfo.map(p =>
        p.idPlayer === player.idPlayer
            ? {
                ...p,
                score: roundScore + player.score
            }
            : p
    );

    const nextTurn = handlerTurns(gameData);


    const game: GameState = {
        id: gameData.id,
        players: updatedPlayers,
        deck: shuffledMaze,
        turn: nextTurn,
        round: currentRound,
        countRound: 5,
        statusGame: gameData.statusGame,
        lastUpdated: Date.now()
    }

    updateStorageGame(gameData.id, game)

    return NextResponse.json(game)
}

