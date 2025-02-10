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
    deckSize: "40",
    handSize: "6",
    cardRows: [INITIAL_CARD_ROW] as CardRow[],
  });

  const nextIdRef = useRef(2);

  // Calculate card totals
  const totals = useMemo(() => {
    const amounts = deckState.cardRows.map((row) => Number(row.amount) || 0);
    const mins = deckState.cardRows.map((row) => Number(row.min) || 0);

    return {
      totalAmount: amounts.reduce((sum, amount) => sum + amount, 0),
      totalMin: mins.reduce((sum, min) => sum + min, 0),
    };
  }, [deckState.cardRows]);

  // Calculate misc amounts
  const misc = useMemo(() => {
    const deckSizeNum = Number(deckState.deckSize) || 0;
    const handSizeNum = Number(deckState.handSize) || 0;

    return {
      amount: deckSizeNum - totals.totalAmount,
      max: handSizeNum - totals.totalMin,
    };
  }, [deckState.deckSize, deckState.handSize, totals]);

  // Prepare calculator inputs and compute probability
  const [probability, setProbability] = useState<number | "">(39.43);

  useEffect(() => {
    const calculator = new HypergeometricCalculator();

    try {
      const deckSizeNum = Number(deckState.deckSize);
      const handSizeNum = Number(deckState.handSize);

      // Validate basic inputs
      if (
        !deckSizeNum ||
        !handSizeNum ||
        handSizeNum > deckSizeNum ||
        misc.amount < 0 ||
        misc.max < 0
      ) {
        throw new Error();
      }

      // Prepare card types
      const cardTypes = deckState.cardRows.map((row) => {
        const amt = Number(row.amount) || 0;
        const min = Number(row.min) || 0;
        const max = Number(row.max) || 0;

        if (amt < 0 || min < 0 || max < 0 || max > amt || min > max) {
          throw new Error();
        }

        return { amt, min, max };
      });

      const params: HypergeometricParams = {
        deckSize: deckSizeNum,
        handSize: handSizeNum,
        cardTypes,
        miscAmt: misc.amount,
        miscMax: misc.max,
      };

      const result = calculator.calculateProbability(params);
      setProbability(result > 100 ? "" : result);
    } catch {
      setProbability("");
    }
  }, [deckState, misc]);

  // Row management
  const updateRow = useCallback(
    (index: number, field: keyof CardRow, value: string) => {
      setDeckState((prev) => ({
        ...prev,
        cardRows: prev.cardRows.map((row, i) =>
          i === index ? { ...row, [field]: value } : row
        ),
      }));
    },
    []
  );

  const addRow = useCallback(() => {
    const newRow: CardRow = {
      id: nextIdRef.current++,
      name: "",
      amount: "",
      min: "",
      max: "",
    };
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

  // Size handlers
  const handleDeckSizeChange = useCallback((value: string) => {
    setDeckState((prev) => ({
      ...prev,
      deckSize: value,
      // Ensure hand size doesn't exceed deck size
      handSize: Number(value) < Number(prev.handSize) ? value : prev.handSize,
    }));
  }, []);

  const handleHandSizeChange = useCallback((value: string) => {
    setDeckState((prev) => ({
      ...prev,
      handSize: Number(value) > Number(prev.deckSize) ? prev.deckSize : value,
    }));
  }, []);

  return {
    ...deckState,
    miscAmount: misc.amount,
    miscMax: misc.max,
    probability,
    addRow,
    removeRow,
    updateRow,
    handleDeckSizeChange,
    handleHandSizeChange,
  };
}
