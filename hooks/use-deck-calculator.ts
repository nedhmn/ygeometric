import { CardRow, INITIAL_CARD_ROW } from "@/types/deck-calculator";
import { useEffect, useState } from "react";

export function useDeckCalculator() {
  const [deckSize, setDeckSize] = useState<number | "">("");
  const [handSize, setHandSize] = useState<number | "">("");
  const [miscAmount, setMiscAmount] = useState(0);
  const [cardRows, setCardRows] = useState<CardRow[]>([INITIAL_CARD_ROW]);
  const [nextId, setNextId] = useState(2);

  useEffect(() => {
    let totalCardAmount = 0;
    cardRows.forEach((row) => {
      totalCardAmount += Number.parseInt(row.amount) || 0;
    });

    const effectiveDeckSize = typeof deckSize === "number" ? deckSize : 0;
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
        const updatedValue =
          field === "name" ? value : Math.max(0, Number(value));
        return { ...row, [field]: updatedValue };
      }
      return row;
    });
    setCardRows(newRows);
  };

  const handleDeckSizeChange = (value: string) => {
    const newDeckSize = value === "" ? "" : Math.max(0, Number.parseInt(value));
    setDeckSize(newDeckSize);
    if (
      typeof handSize === "number" &&
      typeof newDeckSize === "number" &&
      handSize > newDeckSize
    ) {
      setHandSize(newDeckSize);
    }
  };

  const handleHandSizeChange = (value: string) => {
    const newHandSize = value === "" ? "" : Math.max(0, Number.parseInt(value));
    if (typeof deckSize === "number") {
      setHandSize(Math.min(newHandSize as number, deckSize));
    } else {
      setHandSize(newHandSize);
    }
  };

  return {
    deckSize,
    handleDeckSizeChange,
    handSize,
    handleHandSizeChange,
    miscAmount,
    cardRows,
    addRow,
    removeRow,
    updateRow,
  };
}
