import { NextResponse } from "next/server"
import { getGame, updateGame } from "@/lib/gameEngine/gameStore"
import {
  getNewCard, calculateHandValue, getStorageGame, updateStorageGame, playerInTurn,
  handlerTurns, getPlayerState
} from "@/lib/gameEngine/twetyOne/twety_One"

export async function POST(req: Request) {
  const { gameId, card } = await req.json()

  const game = getGame(gameId)

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 })
  }
  //the turn "0" always is for dealer
  game.turn = 0
  const dealerData = playerInTurn(game);
  console.log(dealerData)
  updateGame(gameId, game)

  return NextResponse.json(game)
}