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
  easy: { id: "easy", name_en: "Easy", name_es: "Fácil", description_en: "Beginner level ", description_es: "Nivel para novatos", requerimentPoints: 60 },
  medium: { id: "medium", name_en: "Medium", name_es: "Normal", description_en: "Intermediate level", description_es: "Nivel para intermedio", requerimentPoints: 75 },
  hard: { id: "hard", name_en: "Hard", name_es: "Difícil", descriptio_en: "Expert level", description_es: "Nivel para expertos", requerimentPoints: 90 }
}