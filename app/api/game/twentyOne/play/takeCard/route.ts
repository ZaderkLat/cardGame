import { NextResponse } from "next/server"
import { getGame, updateGame } from "@/lib/gameEngine/gameStore"
import {getNewCart, scoreGame, calculateHandValue} from "@/lib/gameEngine/twetyOne/twety_One"


export async function POST(req: Request) {
  const { gameId, remainingDeck, playerHand } = await req.json()

  const game = getGame(gameId)

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 })
  }
  const { newHand, newDeck } = getNewCart(remainingDeck, playerHand);

  game.handValue = calculateHandValue(newHand);

  game.playerHand = newHand
  game.deck = newDeck 
  game.turn = "enemy"
 

  updateGame(gameId, game)

  return NextResponse.json(game)
}