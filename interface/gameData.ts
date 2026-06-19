import { card } from "@/interface/card";


export type GameState = {
  id: string
  playerHand: card[]
  enemyHand: card[]
  score: number
  handValue: number
  deck: card[]
  turn: string
  round: number
  countRound: number
  statusGame: "continue" | "finished"
  lastUpdated: number
}

export type PlayerInfo = {
  idPlayer: string
  score: number
  hand: card[]
  handValue: number
  statusTurn: "continue" | "finished"
  turn: number
}
export type LogGame = {
  type: "info" | "win" | "lose"
  message: string
}



export const difficulties = {
  easy: { id: "easy", name: "Easy", description: "Beginner level ", requerimentPoints: 60 },
  medium: { id: "medium", name: "Medium", description: "Intermediate level", requerimentPoints: 75 },
  hard: { id: "hard", name: "Hard", description: "Expert level", requerimentPoints: 90 }
}