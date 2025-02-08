import { CardRow, INITIAL_CARD_ROW } from "@/types/deck-calculator";
import { useEffect, useState, useCallback } from "react";
import { HypergeometricCalculator } from "@/lib/hypergeometric-calculator";
import { HypergeometricParams } from "@/types/hypergeometric";

export function useDeckCalculator() {
  const [deckSize, setDeckSize] = useState<number | "">("");
  const [handSize, setHandSize] = useState<number | "">("");
  const [miscAmount, setMiscAmount] = useState(0);
  const [miscMax, setMiscMax] = useState(0);
  const [cardRows, setCardRows] = useState<CardRow[]>([INITIAL_CARD_ROW]);
  const [nextId, setNextId] = useState(2);
  const [probability, setProbability] = useState<number | "">("");

  // Calculate miscAmount and miscMax whenever relevant values change
  useEffect(() => {
    // Calculate miscAmount
    let totalCardAmount = 0;
    cardRows.forEach((row) => {
      totalCardAmount += Number.parseInt(row.amount) || 0;
    });
    const effectiveDeckSize = typeof deckSize === "number" ? deckSize : 0;
    setMiscAmount(effectiveDeckSize - totalCardAmount);

    // Calculate miscMax
    let totalMinCards = 0;
    cardRows.forEach((row) => {
      totalMinCards += Number.parseInt(row.min) || 0;
    });
    const effectiveHandSize = typeof handSize === "number" ? handSize : 0;
    setMiscMax(effectiveHandSize - totalMinCards);
  }, [cardRows, deckSize, handSize]);

  const calculatorInputs = useCallback((): HypergeometricParams => {
    const deckSizeInput = Number(deckSize);
    const handSizeInput = Number(handSize);

    if (
      deckSizeInput <= 0 ||
      handSizeInput <= 0 ||
      handSizeInput > deckSizeInput
    ) {
      throw new Error();
    }

    const miscAmtInput = Number(miscAmount);
    const miscMaxInput = Number(miscMax);

    if (miscAmtInput < 0 || miscMaxInput < 0) {
      throw new Error();
    }

    const cardTypesInput = cardRows.map((row) => {
      const amt = Number(row.amount);
      const min = Number(row.min);
      const max = Number(row.max);

      if (amt === 0 || min === 0 || max === 0 || max > amt || min > max) {
        throw new Error();
      }

      return { amt, min, max };
    });

    return {
      deckSize: deckSizeInput,
      handSize: handSizeInput,
      cardTypes: cardTypesInput,
      miscAmt: miscAmtInput,
      miscMax: miscMaxInput,
    };
  }, [deckSize, handSize, cardRows, miscAmount, miscMax]); // Added miscMax to dependencies

  useEffect(() => {
    const calculator = new HypergeometricCalculator();

    try {
      const params = calculatorInputs();
      const probability = calculator.calculateProbability(params);

      if (probability > 100) {
        throw new Error();
      }

      setProbability(probability);
    } catch (error) {
      setProbability("");
    }
  }, [calculatorInputs]);

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
    miscMax,
    cardRows,
    addRow,
    removeRow,
    updateRow,
    probability,
  };
}
