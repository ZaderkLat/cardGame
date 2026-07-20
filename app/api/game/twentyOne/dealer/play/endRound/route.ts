import { NextResponse } from "next/server"

import { scoreGame, updateStorageGame, endRound, getStorageGame, playerInTurn, handlerTurns, isWinner, getPlayerState } from "@/lib/gameEngine/twetyOne/twety_One"
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
    /*getPlayerState return
        lose: if playerHandValue > 21
        stand: if playerHandValue == 21
        continue: if playerHandValue < 21
        blackJack: if playerHandValue == 21 & playerHand.length ==2 
        NOTE: Only stand is possible in this EndPoint
    */
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
        //turn = 0 it's for dealer turn
        turn: 0,
        round: currentRound,
        countRound: gameData.countRound,
        statusGame: gameData.statusGame,
        lastUpdated: Date.now()
    }

    updateStorageGame(gameData.id, game)

    return NextResponse.json(game)
}

