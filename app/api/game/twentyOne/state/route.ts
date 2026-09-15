import { NextResponse } from "next/server"

import { getStorageGame } from "@/lib/gameEngine/twentyOne/twenty_One"
export const runtime = "nodejs"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const gameId = searchParams.get("gameId")

  if (!gameId) {
    return NextResponse.json(
      { error: "Missing gameId" },
      { status: 400 }
    )
  }

  const game = await getStorageGame(gameId)

  if (!game) {
    return NextResponse.json(
      { error: "Game not found" },
      { status: 404 }
    )
  }
  //remove deck to send to the frontend
  game.deck = []
  return NextResponse.json(game)
}