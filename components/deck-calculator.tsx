// components/DeckCalculator.tsx
"use client";

import { CardRowInput } from "@/components/card-row-input";
import { DeckCalculatorHeader } from "@/components/deck-calculator-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDeckCalculator } from "@/hooks/use-deck-calculator";

export default function DeckCalculator() {
  const {
    deckSize,
    setDeckSize,
    handSize,
    setHandSize,
    miscAmount,
    cardRows,
    addRow,
    removeRow,
    updateRow,
  } = useDeckCalculator();

  return (
    <>
      <Card className="max-w-2xl mx-auto bg-zinc-950/40 border-white/10 backdrop-blur-xl rounded-xl overflow-hidden">
        <DeckCalculatorHeader />
        <CardContent className="space-y-8 p-8">
          {/* Deck Size and Hand Size Inputs */}
          <div className="grid grid-cols-[auto_1fr] gap-6 items-center max-w-xs mx-auto">
            <label
              htmlFor="deckSize"
              className="font-medium text-gray-300 text-sm"
            >
              Deck Size
            </label>
            <Input
              id="deckSize"
              placeholder="40"
              value={deckSize}
              type="number"
              onChange={(e) => setDeckSize(e.target.value)}
              className="w-32 bg-white/5 border-white/10 text-white rounded-lg"
            />

            <label
              htmlFor="handSize"
              className="font-medium text-gray-300 text-sm"
            >
              Hand Size
            </label>
            <Input
              id="handSize"
              placeholder="6"
              value={handSize}
              type="number"
              onChange={(e) => setHandSize(e.target.value)}
              className="w-32 bg-white/5 border-white/10 text-white rounded-lg"
            />
          </div>

          <div className="mt-8">
            {/* Column Headers */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 mb-2 text-center">
              <div></div>
              <div className="font-medium text-gray-300 text-sm">Amt</div>
              <div className="font-medium text-gray-300 text-sm">Min</div>
              <div className="font-medium text-gray-300 text-sm">Max</div>
            </div>

            {/* Miscellaneous Cards Row */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 mb-6 items-center">
              <div className="font-medium text-right text-gray-300 text-sm">
                Miscellaneous Cards
              </div>
              <div
                className={`text-center ${
                  miscAmount < 0 ? "text-red-500" : "text-gray-300"
                }`}
              >
                {deckSize === "" ? "0" : miscAmount}
              </div>
              <div className="text-center text-gray-300">0</div>
              <div className="text-center text-gray-300">0</div>
            </div>

            {/* Card Rows */}
            <div className="space-y-4">
              {cardRows.map((row, index) => (
                <CardRowInput
                  key={row.id}
                  row={row}
                  index={index}
                  updateRow={updateRow}
                />
              ))}
            </div>

            {/* Add/Remove Row Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={addRow}
                className="border-white/10 text-white hover:bg-white/5 rounded-lg"
              >
                +
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={removeRow}
                disabled={cardRows.length === 1}
                className="border-white/10 text-white hover:bg-white/5 disabled:opacity-50 rounded-lg"
              >
                -
              </Button>
            </div>
          </div>

          {/* Probability Display */}
          <div className="text-center py-4 font-medium">
            <span className="text-gray-300">You have a </span>
            <span className="text-emerald-400">100.00%</span>
            <span className="text-gray-300"> chance to open this hand.</span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
