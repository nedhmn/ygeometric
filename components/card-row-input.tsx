import { Input } from "@/components/ui/input";
import { CardRow } from "@/types/deck-calculator";

interface CardRowInputProps {
  row: CardRow;
  index: number;
  updateRow: (index: number, field: keyof CardRow, value: string) => void;
}

export function CardRowInput({ row, index, updateRow }: CardRowInputProps) {
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 items-center">
      <Input
        placeholder="Card Name"
        value={row.name}
        onChange={(e) => updateRow(index, "name", e.target.value)}
        className="w-full text-right placeholder:text-right bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg"
      />
      <Input
        placeholder="3"
        value={row.amount}
        type="number"
        onChange={(e) => updateRow(index, "amount", e.target.value)}
        className="w-full text-center bg-white/5 border-white/10 text-white rounded-lg placeholder:text-gray-500"
      />
      <Input
        placeholder="1"
        value={row.min}
        type="number"
        onChange={(e) => updateRow(index, "min", e.target.value)}
        className="w-full text-center bg-white/5 border-white/10 text-white rounded-lg placeholder:text-gray-500"
      />
      <Input
        placeholder="3"
        value={row.max}
        type="number"
        onChange={(e) => updateRow(index, "max", e.target.value)}
        className="w-full text-center bg-white/5 border-white/10 text-white rounded-lg placeholder:text-gray-500"
      />
    </div>
  );
}
