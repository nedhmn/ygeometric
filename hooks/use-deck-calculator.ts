import { CardRow, INITIAL_CARD_ROW } from "@/types/deck-calculator";
import { useEffect, useState } from "react";

export function useDeckCalculator() {
  const [deckSize, setDeckSize] = useState("");
  const [handSize, setHandSize] = useState("");
  const [miscAmount, setMiscAmount] = useState(0);
  const [cardRows, setCardRows] = useState<CardRow[]>([INITIAL_CARD_ROW]);

  useEffect(() => {
    const totalCardAmount = cardRows.reduce(
      (sum, row) => sum + (Number.parseInt(row.amount) || 0),
      0
    );
    const effectiveDeckSize = Number.parseInt(deckSize) || 0;
    setMiscAmount(effectiveDeckSize - totalCardAmount);
  }, [deckSize, cardRows]);

  const addRow = () => {
    const newRow: CardRow = {
      id: cardRows.length + 1,
      name: "",
      amount: "",
      min: "",
      max: "",
    };
    setCardRows([...cardRows, newRow]);
  };

  const removeRow = () => {
    if (cardRows.length > 1) {
      setCardRows(cardRows.slice(0, -1));
    }
  };

  const updateRow = (index: number, field: keyof CardRow, value: string) => {
    setCardRows(
      cardRows.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  return {
    deckSize,
    setDeckSize,
    handSize,
    setHandSize,
    miscAmount,
    cardRows,
    addRow,
    removeRow,
    updateRow,
  };
}
