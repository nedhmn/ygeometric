"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NumericInput from "@/components/numeric-input";
import { CardRow } from "@/types/deck-calculator";
import { Trash2 } from "lucide-react";

interface CardRowInputProps {
  row: CardRow;
  index: number;
  updateRow: (index: number, field: keyof CardRow, value: string) => void;
  removeRow: (id: number) => void;
  cardRowsLength: number;
}

export function CardRowInput({
  row,
  index,
  updateRow,
  removeRow,
}: CardRowInputProps) {
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center">
      <Input
        placeholder="Card Name"
        value={row.name}
        onChange={(e) => updateRow(index, "name", e.target.value)}
        className="w-full text-right placeholder:text-right bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg"
      />
      <NumericInput
        placeholder="3"
        value={row.amount}
        onChange={(value) => updateRow(index, "amount", value)}
        className="w-full text-center bg-white/5 border-white/10 text-white rounded-lg placeholder:text-gray-500"
      />
      <NumericInput
        placeholder="1"
        value={row.min}
        onChange={(value) => updateRow(index, "min", value)}
        className="w-full text-center bg-white/5 border-white/10 text-white rounded-lg placeholder:text-gray-500"
      />
      <NumericInput
        placeholder="3"
        value={row.max}
        onChange={(value) => updateRow(index, "max", value)}
        className="w-full text-center bg-white/5 border-white/10 text-white rounded-lg placeholder:text-gray-500"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => removeRow(row.id)}
        className="text-gray-400 hover:text-red-500 disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
