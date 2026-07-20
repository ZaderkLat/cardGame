import { NextResponse } from "next/server"
import { getNewCard, calculateHandValue, getStorageGame, updateStorageGame, playerInTurn, handlerTurns, getPlayerState } from "@/lib/gameEngine/twetyOne/twety_One"


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
  player.hand = newHand
  player.handValue = calculateHandValue(newHand)
  //because, it's solo mode, if the hand value player it's 21, player win
  if (game.players.length > 1) {
    player.status = getPlayerState(player.handValue, player.hand.length)
  } else {
    player.status = (player.handValue == 21) ? "win" : getPlayerState(player.handValue, player.hand.length)
  }


  const updatedPlayers = game.players.map(p =>
    p.idPlayer === player.idPlayer
      ? {
        ...p,
        hand: player.hand,
        handValue: player.handValue,
        status: player.status
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