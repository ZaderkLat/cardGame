import maze from "@/objects/maze.json";
import { card } from "@/interface/card";

export function shuffleDeck() {
  const shuffled = [...maze]; // copy array

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    // swap
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export function getCards(count: number, deck: card[]) {
  const drawn = []

  for (let i = 0; i < count; i++) {
    const card = deck.pop()
    if (!card) break
    drawn.push(card)
  }

  return {
    cards: drawn,
    deck
  }
}
