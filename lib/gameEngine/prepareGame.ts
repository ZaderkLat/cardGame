import { shuffleDeck, getCards } from "./controllerMaze";
import { card } from "@/interface/card";
import { PlayersRequest } from "@/interface/gameData";

export function prepareGame(handSize: number, quantityPlayer: number) {

    let shuffledMaze = shuffleDeck();
    const hands: card[][] = [];

    for (let i = 0; i < quantityPlayer; i++) {
        const { cards: playerHand, deck: remainingDeck } = getCards(handSize, shuffledMaze);
        shuffledMaze = remainingDeck;
        hands.push(playerHand)
    }

    return { hands, shuffledMaze };
}


export function getCard(remainingDeck: card[], hand: card[]) {
    //take a card
    const { cards: newCard, deck: newDeck } = getCards(1, remainingDeck);
    //add the card to the hand
    const newHand = [...hand, ...newCard];
    return { newHand, newDeck };
}