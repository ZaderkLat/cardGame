import { NextResponse } from "next/server"

import { scoreGame, updateStorageGame, endRound, getStorageGame, playerInTurn, hideDealerCard } from "@/lib/gameEngine/twentyOne/twenty_One"
import { GameState } from "@/interface/gameData"

export async function POST(req: Request) {

    const { gameId } = await req.json()

    const gameData = await getStorageGame(gameId)

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
                score: roundScore + player.score,
                status: "stand" as const
            }
            : p
    );



    const game: GameState = {
        id: gameData.id,
        players: updatedPlayers,
        deck: shuffledMaze,
        turn: 1,
        round: currentRound,
        countRound: gameData.countRound,
        statusGame: gameData.statusGame,
        lastUpdated: Date.now()
    }

    await updateStorageGame(gameData.id, game)
    const gameResponse = hideDealerCard(game);
    //remove deck to send to the frontend
    game.deck = []
    return NextResponse.json(gameResponse)
}

