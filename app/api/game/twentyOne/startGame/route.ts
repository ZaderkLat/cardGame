import { NextResponse, NextRequest } from "next/server"
import { randomUUID } from "crypto"
import { starGame, storageGame, hideDealerCard } from "@/lib/gameEngine/twetyOne/twety_One"
import type { GameState } from "@/interface/gameData"
import { checkRateLimit, getClientIp } from "@/lib/security"

export async function POST(request: NextRequest) {
    const clientIp = getClientIp(request.headers)
    if (!checkRateLimit("game:start", 30, 60_000, clientIp)) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    let body: unknown
    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return NextResponse.json({ error: "Payload inválido" }, { status: 400 })
    }

    const { players, rounds } = body as Record<string, unknown>

    if (!Array.isArray(players) || players.length === 0) {
        return NextResponse.json({ error: "players debe ser un array no vacío" }, { status: 400 })
    }

    if (!Number.isInteger(rounds) || Number(rounds) < 1 || Number(rounds) > 100) {
        return NextResponse.json({ error: "rounds debe ser un entero entre 1 y 100" }, { status: 400 })
    }

    const invalidPlayer = players.some((player) => {
        if (!player || typeof player !== "object") return true
        const candidate = player as Record<string, unknown>
        return typeof candidate.idPlayer !== "string" || typeof candidate.userName !== "string"
    })

    if (invalidPlayer) {
        return NextResponse.json({ error: "players contiene datos inválidos" }, { status: 400 })
    }

    /*getPlayerState return
        lose: if playerHandValue > 21
        stand: if playerHandValue == 21
        continue: if playerHandValue < 21
        blackJack: if playerHandValue == 21 & playerHand.length ==2 
        NOTE: Only LOSE is possible in takeCard function
      */
    const { playersInfo, shuffledMaze } = starGame(players as Array<{ idPlayer: string; userName: string }>)

    const game: GameState = {
        id: randomUUID(),
        players: playersInfo,
        deck: shuffledMaze,
        turn: 1,
        round: 1,
        countRound: Number(rounds),
        statusGame: "continue" as const,
        lastUpdated: Date.now()
    }

    storageGame(game)

    const gameResponse = hideDealerCard(game);

    return NextResponse.json(gameResponse)
}

