import { card } from "@/interface/card";
import { prepareGame, getCard } from "@/lib/gameEngine/prepareGame";
import { difficulties, GameState, dealears } from "@/interface/gameData";
import { createGame, getGame, updateGame } from "@/lib/gameEngine/gameStore"
import { PlayersRequest, PlayerInfo } from "@/interface/gameData";
import { playerTurnData, nextTurn } from "@/lib/gameEngine/handlerTurns"
import next from "next";
/*
    This class create the conextion between the API and the class @/lib/gameEngine/prepareGame(this class control the game)
     and @/lib/gameEngine/gameStore(this class save the game state in the server), both classes have the function to control
     the game fluid, like take card, create new game, refresh game state, etc
*/

/** Make the players objects with its turns and hand and the maze for the game */
export function starGame(players: PlayersRequest[]) {
    const { hands, shuffledMaze } = prepareGame(2, players.length);

    const turns = assignTurn(players.length);
    const dealer = dealerChoose();
    const playersInfo: PlayerInfo[] = players.map((player, index) => (
        {
            idPlayer: player.idPlayer === "dealer" ? dealer.id : player.idPlayer,
            userName: player.idPlayer === "dealer" ? dealer.name : player.userName,
            score: 0,
            hand: hands[index],
            handValue: calculateHandValue(hands[index]),
            turn: turns[index],
        }));

    return {
        playersInfo,
        shuffledMaze,
    };
}
export function playerInTurn(game: GameState) {
    return playerTurnData(game);
}
export function handlerTurns(game: GameState) {
    return nextTurn(game)
}

export function storageGame(game: GameState) {
    createGame(game);
}
export function getStorageGame(gameId: string) {
    return getGame(gameId);
}
export function updateStorageGame(gameId: string, game: GameState) {
    updateGame(gameId, game)
}

export function calculateHandValue(hand: card[]) {
    return hand.reduce((total, card) => {
        //validate if the card is an ace, if it is, check if adding 11 would bust the hand, if it does, add 1 instead
        if (card.rank === "A") {
            if (total + 11 > 21) {
                return total + 1;
            }
            return total + 11;
        }
        if (card.value >= 10) {
            return total + 10;
        }
        return total + card.value;
    }, 0);
}
export function dealerChoose() {

    const dealersArray = Object.values(dealears);

    return dealersArray[Math.floor(Math.random() * dealersArray.length)];


}
//algorit Fisher-Yates Shuffle to assign players turns randomly
export function assignTurn(quantity: number) {
    const numbers = Array.from({ length: quantity }, (_, i) => i + 1);

    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    return numbers;
}
//determine if the player is a winner based on the score and the difficulty level, if taken into account the total rounds played to determine the score needed to win
export function isWinner(score: number, difficulty: keyof typeof difficulties, totalRounds: number) {
    let isWin = false;
    const requiredScore = difficulties[difficulty].requerimentPoints * totalRounds;
    isWin = score >= requiredScore;

    //response with label name in messages/en.json|es.json
    if (isWin) {
        return {
            message: "youWin",
            status: "win" as const,

        }
    } else {
        return {
            message: "youLose",
            status: "lose" as const,

        }
    }
}


export function getNewCard(remainingDeck: card[], hand: card[]) {
    //returns a new hand with a new card and the remaining deck without the new card
    return getCard(remainingDeck, hand);
}

//this function calcule the points gain for round
export function scoreGame(finalHand: card[]) {
    const handValue = calculateHandValue(finalHand);

    if (handValue > 21) return 0;

    let score = 0;

    score += Math.floor((handValue / 21) * 100);

    if (handValue === 21) {
        score += 10;
    }

    score -= Math.max(0, finalHand.length - 2) * 2;

    return score;
}
