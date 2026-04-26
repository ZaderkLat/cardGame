import { NextResponse } from "next/server"
import { getGame } from "@/lib/gameEngine/gameStore"

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

  const game = getGame(gameId)

  if (!game) {
    return NextResponse.json(
      { error: "Game not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(game)
}