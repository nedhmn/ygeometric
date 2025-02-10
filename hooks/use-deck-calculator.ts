// hooks/use-deck-calculator.ts
import { HypergeometricCalculator } from "@/lib/hypergeometric-calculator";
import { CardRow } from "@/types/deck-calculator";
import { HypergeometricParams } from "@/types/hypergeometric";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const INITIAL_CARD_ROW: CardRow = {
  id: 1,
  name: "Thunder Dragon",
  amount: "3",
  min: "1",
  max: "3",
};

export function useDeckCalculator() {
  const [deckState, setDeckState] = useState({
    deckSize: 40 as number | "",
    handSize: 6 as number | "",
    cardRows: [INITIAL_CARD_ROW] as CardRow[],
  });

  const [miscAmount, setMiscAmount] = useState(37);
  const [miscMax, setMiscMax] = useState(5);
  const [probability, setProbability] = useState<number | "">(39.43);
  const nextIdRef = useRef(2);

  const cardAmounts = useMemo(() => {
    return deckState.cardRows.map((row) => ({
      amount: Number.parseInt(row.amount) || 0,
      min: Number.parseInt(row.min) || 0,
    }));
  }, [deckState.cardRows]);

  const { totalAmount, totalMin } = useMemo(() => {
    return {
      totalAmount: cardAmounts.reduce((sum, card) => sum + card.amount, 0),
      totalMin: cardAmounts.reduce((sum, card) => sum + card.min, 0),
    };
  }, [cardAmounts]);

  useEffect(() => {
    const effectiveDeckSize =
      typeof deckState.deckSize === "number" ? deckState.deckSize : 0;
    const effectiveHandSize =
      typeof deckState.handSize === "number" ? deckState.handSize : 0;

    setMiscAmount(effectiveDeckSize - totalAmount);
    setMiscMax(effectiveHandSize - totalMin);
  }, [deckState.deckSize, deckState.handSize, totalAmount, totalMin]);

  const calculatorInputs = useCallback((): HypergeometricParams => {
    if (deckState.cardRows.length === 0) {
      throw new Error();
    }

    const deckSizeInput = Number(deckState.deckSize);
    const handSizeInput = Number(deckState.handSize);

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

    const cardTypesInput = deckState.cardRows.map((row) => {
      const amt = Number(row.amount);
      const min = Number(row.min);
      const max = Number(row.max);

      if (amt < 0 || min < 0 || max < 0 || max > amt || min > max) {
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
  }, [deckState, miscAmount, miscMax]);

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

  const updateRow = useCallback(
    (index: number, field: keyof CardRow, value: string) => {
      setDeckState((prev) => ({
        ...prev,
        cardRows: prev.cardRows.map((row, i) =>
          i === index
            ? {
                ...row,
                [field]:
                  field === "name"
                    ? value
                    : String(Math.max(0, Number(value) || 0)),
              }
            : row
        ),
      }));
    },
    []
  );

  const handleNumberChange = useCallback(
    (index: number, field: "amount" | "min" | "max", value: string) => {
      const parsed = Math.max(0, Number(value) || 0);
      if (!isNaN(parsed)) {
        updateRow(index, field, String(parsed));
      }
    },
    [updateRow]
  );

  const addRow = useCallback(() => {
    const newRow: CardRow = {
      id: nextIdRef.current,
      name: "",
      amount: "",
      min: "",
      max: "",
    };
    nextIdRef.current += 1;
    setDeckState((prev) => ({
      ...prev,
      cardRows: [...prev.cardRows, newRow],
    }));
  }, []);

  const removeRow = useCallback((id: number) => {
    setDeckState((prev) => ({
      ...prev,
      cardRows: prev.cardRows.filter((row) => row.id !== id),
    }));
  }, []);

  const handleDeckSizeChange = useCallback((value: string) => {
    const newSize = value === "" ? "" : Math.max(0, parseInt(value) || 0);
    setDeckState((prev) => ({
      ...prev,
      deckSize: newSize,
      handSize:
        typeof newSize === "number" && typeof prev.handSize === "number"
          ? Math.min(prev.handSize, newSize)
          : prev.handSize,
    }));
  }, []);

  const handleHandSizeChange = useCallback((value: string) => {
    const newSize = value === "" ? "" : Math.max(0, parseInt(value) || 0);
    setDeckState((prev) => ({
      ...prev,
      handSize:
        typeof prev.deckSize === "number"
          ? Math.min(newSize as number, prev.deckSize)
          : newSize,
    }));
  }, []);

  return {
    ...deckState,
    miscAmount,
    miscMax,
    probability,
    addRow,
    removeRow,
    updateRow,
    handleNumberChange,
    handleDeckSizeChange,
    handleHandSizeChange,
  };
}
