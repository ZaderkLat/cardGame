import { PlayerInfo, GameState } from "@/interface/gameData"


export function playerTurnData(gameData: GameState) {

    return (
        gameData?.players.find(
            p => p.turn === gameData.turn
        )
    );
}
/**
 @param gameData turn = 1
(1 % 4) + 1 = 2

turn = 2
(2 % 4) + 1 = 3

turn = 3
(3 % 4) + 1 = 4

turn = 4
(4 % 4) + 1 = 1
@returns 
 */
export function nextTurn(gameData: GameState) {
    return (gameData.turn % gameData.players.length) + 1;
}