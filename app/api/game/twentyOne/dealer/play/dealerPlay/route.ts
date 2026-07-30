import { NextResponse } from "next/server"
import { getGame, updateGame } from "@/lib/gameEngine/gameStore"
import {
  getNewCard, calculateHandValue, getStorageGame, updateStorageGame, playerInTurn,
  handlerTurns, getPlayerState, playerById, scoreGame, assingWinner
} from "@/lib/gameEngine/twetyOne/twety_One"


export async function POST(req: Request) {
  const { gameId, idPlayer } = await req.json()

  const game = getGame(gameId)

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 })
  }
  const player = playerInTurn(game);
  if (!player) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 })
  }
  if (player.idPlayer != idPlayer) {
    return NextResponse.json({ error: "It's not your turn" }, { status: 404 })
  }
  //if player.handValue > 21 automatically the player lost
  //if player.status == "blacJack" automatically the player win
  if (player.handValue <= 21 && player.status != "blackJack") {
    //the turn "0" always is for dealer
    game.turn = 0
    const dealerData = playerInTurn(game);
    //just to avoid typescript error
    if (!dealerData) return NextResponse.json({ error: "Dealer not found" }, { status: 404 })

    while (dealerData.handValue < 17) {
      const { newHand, newDeck } = getNewCard(game.deck, dealerData.hand)
      game.deck = newDeck
      dealerData.hand = newHand
      dealerData.handValue = calculateHandValue(dealerData.hand)
    }
    //update the dealer data, index [0] it's always dealer
    game.players[0] = dealerData;
  }

  //assing the winners and losers
  const updatePlayers = assingWinner(game.players);
  // ensure TypeScript compatibility when assingWinner returns a loose "status" string
  game.players = updatePlayers
  updateGame(gameId, game)

  return NextResponse.json(game)
}