import { NextResponse } from "next/server"
import { getNewCard, calculateHandValue, getStorageGame, updateStorageGame, playerInTurn, handlerTurns } from "@/lib/gameEngine/twetyOne/twety_One"


export async function POST(req: Request) {
  const { gameId } = await req.json()

  const game = getStorageGame(gameId)

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 })
  }
  const player = playerInTurn(game);
  if (!player) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 })
  }
  const { newHand, newDeck } = getNewCard(game.deck, player?.hand);

  const updatedPlayers = game.players.map(p =>
    p.idPlayer === player.idPlayer
      ? {
        ...p,
        hand: newHand,
        handValue: calculateHandValue(newHand)
      }
      : p
  );

  game.players = updatedPlayers;
  game.deck = newDeck
  /* this dont change here
  game.turn = handlerTurns(game);
*/

  updateStorageGame(gameId, game)

  return NextResponse.json(game)
}