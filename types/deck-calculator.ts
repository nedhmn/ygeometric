export interface CardRow {
  id: number;
  name: string;
  amount: string;
  min: string;
  max: string;
}

export const INITIAL_CARD_ROW: CardRow = {
  id: 1,
  name: "",
  amount: "",
  min: "",
  max: "",
};
