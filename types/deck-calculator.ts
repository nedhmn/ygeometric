export interface CardRow {
  id: number;
  name: string;
  amount: string;
  min: string;
  max: string;
}

export interface DeckState {
  deckSize: number | "";
  handSize: number | "";
  cardRows: CardRow[];
}
