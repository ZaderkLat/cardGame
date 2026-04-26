import { GameState } from "@/interface/gameData";


const globalForGames = globalThis as unknown as {
  games: Map<string, GameState>
}

export const games =
  globalForGames.games || new Map<string, GameState>()

if (!globalForGames.games) {
  globalForGames.games = games
}

const EXPIRATION_TIME = 1000 * 60 * 30 // 30 min

export function createGame(game: GameState) {
  games.set(game.id, game)
}

export function getGame(id: string) {
  const game = games.get(id)

  if (!game) return null

  if (Date.now() - game.lastUpdated > EXPIRATION_TIME) {
    games.delete(id)
    return null
  }

  return game
}

export function updateGame(id: string, game: GameState) {
  
  game.lastUpdated = Date.now()
  games.set(id, game)
}

export function deleteGame(id: string) {
  games.delete(id)
}