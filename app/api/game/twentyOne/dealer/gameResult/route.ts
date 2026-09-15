import { NextResponse } from "next/server"
import { assingWinner, getStorageGame } from "@/lib/gameEngine/twentyOne/twenty_One"
export async function POST(req: Request) {
    const gameId = await req.json();
    const game = await getStorageGame(gameId);

    if (!game) {
        return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    const updatePlayers = assingWinner(game.players);


    game.players = updatePlayers;


}