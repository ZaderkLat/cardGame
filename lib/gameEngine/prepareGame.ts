import { shuffleDeck, getCards} from "./controllerMaze";
import { card } from "@/interface/card";

export function prepareGame(handSize: number) {

    const shuffledMaze= shuffleDeck();
    const { cards: playerHand, deck: remainingDeck } = getCards(handSize, shuffledMaze);
   

    return { playerHand, remainingDeck };
}


export function getCart(remainingDeck: card[], hand: card[]) {
    //take a cart
    const { cards: newCart, deck: newDeck } = getCards(1, remainingDeck);
    //add the cart to the hand
    const newHand = [...hand, ...newCart];
    return { newHand, newDeck };
}