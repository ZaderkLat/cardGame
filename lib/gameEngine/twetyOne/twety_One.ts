import { card } from "@/interface/card";
import { prepareGame, getCart } from "@/lib/gameEngine/prepareGame";
import { difficulties } from "@/interface/gameData";
let playerHand: card[] = [];
let remainingDeck: card[] = [];

export function twetyOne() {
    const { playerHand: hand, remainingDeck: deck } = getHand();
    playerHand = hand;
    remainingDeck = deck;
}
export function getHand() {
    //returns a hand of 2 carts and the remaining deck
    return prepareGame(2);
}

export function calculateHandValue(hand: card[]) {
    return hand.reduce((total, cart) => {
        //validate if the cart is an ace, if it is, check if adding 11 would bust the hand, if it does, add 1 instead
        if (cart.rank === "A") {
            if (total + 11 > 21) {
                return total + 1;
            }
            return total + 11;
        }
        if (cart.value >= 10) {
            return total + 10;
        }
        return total + cart.value;
    }, 0);
}
//determine if the player is a winner based on the score and the difficulty level, if taken into account the total rounds played to determine the score needed to win
export function isWinner(score: number, difficulty: keyof typeof difficulties, totalRounds: number) {
    let isWin = false;
    const requiredScore = difficulties[difficulty].requerimentPoints * totalRounds;
    isWin = score >= requiredScore;
    /*
    switch (difficulty) {
        case "easy":
            isWin = score >= 60 * totalRounds;
            break;

        case "medium":
            isWin = score >= 75 * totalRounds;
            break;

        case "hard":
            isWin = score >= 90 * totalRounds;
            break;
        default:
            isWin = false;
            break;
    }*/

    if (isWin) {
        return {
            message: "You Win!",
            status: "win" as const,

        }
    } else {
        return {
            message: "You Lose!",
            status: "lose" as const,

        }
    }
}


export function getNewCart(remainingDeck: card[], hand: card[]) {
    //returns a new hand with a new cart and the remaining deck without the new cart
    return getCart(remainingDeck, hand);
}

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
