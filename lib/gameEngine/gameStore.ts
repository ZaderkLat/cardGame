import { GameState } from "@/interface/gameData";
import { redis } from "@/lib/redis";

const EXPIRATION_TIME = 60 * 30; // 30 minutos

function getGameKey(id: string) {
  return `game:${id}`;
}

export async function createGame(game: GameState) {

  await redis.set(
    getGameKey(game.id),
    game,
    {
      ex: EXPIRATION_TIME,
    }
  );

}

export async function getGame(id: string): Promise<GameState | null> {

  const game = await redis.get<GameState>(
    getGameKey(id)
  );

  if (!game) {
    return null;
  }

  return game;

}

export async function updateGame(
  id: string,
  game: GameState
) {

  game.lastUpdated = Date.now();

  await redis.set(
    getGameKey(id),
    game,
    {
      ex: EXPIRATION_TIME,
    }
  );

}

export async function deleteGame(id: string) {

  await redis.del(
    getGameKey(id)
  );

}