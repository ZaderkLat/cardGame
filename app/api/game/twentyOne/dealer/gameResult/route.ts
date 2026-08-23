import { NextResponse } from "next/server"
import { getGame } from "@/lib/gameEngine/gameStore"
import { assingWinner } from "@/lib/gameEngine/twetyOne/twety_One"

export async function POST(req: Request) {
    const gameId = await req.json();
    const game = getGame(gameId);

    if (!game) {
        return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    const updatePlayers = assingWinner(game.players);


    game.players = updatePlayers;


}