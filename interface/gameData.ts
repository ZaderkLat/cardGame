import { card } from "@/interface/card";


export type GameState = {
  id: string
  players: PlayerInfo[]
  deck: card[]
  turn: number
  round: number
  countRound: number
  statusGame: "continue" | "finished"
  lastUpdated: number
}

export type PlayerInfo = {
  idPlayer: string
  userName: string
  score: number
  hand: card[]
  handValue: number
  turn: number
}
//this object is send by frontend to make PlayerInfo object
export interface PlayersRequest {
  idPlayer: string;
  userName: string;
}

export type LogGame = {
  type: "info" | "win" | "lose"
  message: string
}

export type Mode = {
  label_es: string
  label_en: string
  value: string
}

export const difficulties = {
  easy: { id: "easy", name_en: "Easy", name_es: "Fácil", description_en: "Beginner level ", description_es: "Nivel para novatos", requerimentPoints: 60 },
  medium: { id: "medium", name_en: "Medium", name_es: "Normal", description_en: "Intermediate level", description_es: "Nivel para intermedio", requerimentPoints: 75 },
  hard: { id: "hard", name_en: "Hard", name_es: "Difícil", description_en: "Expert level", description_es: "Nivel para expertos", requerimentPoints: 90 }
}
//Possible dealers, in the future, want to add "personalities", such as different phrases and ways to play, for this is "value".
export const dealears = {
  John: { id: "john", name: "John", value: 0.5 },
  Carlos: { id: "carlos", name: "Carlos", value: 0.8 },
  Valeria: { id: "valeria", name: "Valeria", value: 1 },
  Fernanda: { id: "fernanda", name: "Fernanda", value: 1.3 }
}