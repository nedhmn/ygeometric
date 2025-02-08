import { CardRow, INITIAL_CARD_ROW } from "@/types/deck-calculator";
import { useEffect, useState } from "react";

export function useDeckCalculator() {
  const [deckSize, setDeckSize] = useState("");
  const [handSize, setHandSize] = useState("");
  const [miscAmount, setMiscAmount] = useState(0);
  const [cardRows, setCardRows] = useState<CardRow[]>([INITIAL_CARD_ROW]);
  const [nextId, setNextId] = useState(2);

  useEffect(() => {
    let totalCardAmount = 0;
    cardRows.forEach((row) => {
      totalCardAmount += Number.parseInt(row.amount) || 0;
    });

    const effectiveDeckSize = Number.parseInt(deckSize) || 0;
    setMiscAmount(effectiveDeckSize - totalCardAmount);
  }, [deckSize, cardRows]);

  const addRow = () => {
    const newRow: CardRow = {
      id: nextId,
      name: "",
      amount: "",
      min: "",
      max: "",
    };
    setCardRows([...cardRows, newRow]);
    setNextId(nextId + 1);
  };

  const removeRow = (id: number) => {
    if (cardRows.length > 1) {
      setCardRows(cardRows.filter((row) => row.id !== id));
    }
  };

  const updateRow = (index: number, field: keyof CardRow, value: string) => {
    const newRows = cardRows.map((row, i) => {
      if (i === index) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setCardRows(newRows);
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
