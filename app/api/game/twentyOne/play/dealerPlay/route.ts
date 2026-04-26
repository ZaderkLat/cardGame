import { NextResponse } from "next/server"
import { getGame, updateGame } from "@/lib/gameEngine/gameStore"

export async function POST(req: Request) {
  const { gameId, card } = await req.json()

  const game = getGame(gameId)

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 })
  }

  // turno jugador
  game.playerHand = game.playerHand.filter(c => c !== card)
  game.turn = "enemy"

  // turno enemigo (simple)
  const enemyCard = game.enemyHand.pop()
  console.log("Enemy played:", enemyCard)

  game.turn = "player"

  updateGame(gameId, game)

  return NextResponse.json(game)
}