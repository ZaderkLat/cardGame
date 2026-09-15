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
//change this type only produce errors in lib/gameEngine/twetyOne/twety_One.ts
//only add the new data in the function startGame and endGame
export type PlayerInfo = {
  idPlayer: string
  userName: string
  score: number
  hand: card[]
  handValue: number
  turn: number
  roundsWin: number
  status: "continue" | "stand" | "lose" | "win" | "blackJack" | "push"
}
//this object is send by frontend to make PlayerInfo object
export interface PlayersRequest {
  idPlayer: string;
  userName: string;
}

export type LogGame = {
  type: "info" | "win" | "lose" | "separate"
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
  John: { id: "dealer", name: "John", value: 0.5 },
  Carlos: { id: "dealer", name: "Carlos", value: 0.8 },
  Valeria: { id: "dealer", name: "Valeria", value: 1 },
  Fernanda: { id: "dealer", name: "Fernanda", value: 1.3 }
}
//Styles for the floating text component, which is used to show the status of the player in the game.
export const statusStyles = {
  continue: {
    color: "",
    background: "",
    border: "",
    shadow: "",
  },

  stand: {
    color: "text-blue-500 dark:text-blue-400",
    background: "bg-blue-500/10 dark:bg-blue-950/70",
    border: "border-blue-400/40 dark:border-blue-700/50",
    shadow: "shadow-[0_0_20px_rgba(59,130,246,0.25)]",
  },

  lose: {
    color: "text-red-500 dark:text-red-400",
    background: "bg-red-500/10 dark:bg-red-950/70",
    border: "border-red-400/40 dark:border-red-700/50",
    shadow: "shadow-[0_0_20px_rgba(239,68,68,0.25)]",
  },

  win: {
    color: "text-green-500 dark:text-green-400",
    background: "bg-green-500/10 dark:bg-green-950/70",
    border: "border-green-400/40 dark:border-green-700/50",
    shadow: "shadow-[0_0_20px_rgba(34,197,94,0.25)]",
  },

  blackJack: {
    color: "text-yellow-500 dark:text-yellow-400",
    background: "bg-yellow-500/10 dark:bg-yellow-950/70",
    border: "border-yellow-400/40 dark:border-yellow-700/50",
    shadow: "shadow-[0_0_20px_rgba(234,179,8,0.25)]",
  },

  push: {
    color: "text-purple-500 dark:text-purple-400",
    background: "bg-purple-500/10 dark:bg-purple-950/70",
    border: "border-purple-400/40 dark:border-purple-700/50",
    shadow: "shadow-[0_0_20px_rgba(168,85,247,0.25)]",
  },
};