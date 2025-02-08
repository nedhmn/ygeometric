import { CardHeader } from "@/components/ui/card";

export function DeckCalculatorHeader() {
  return (
    <CardHeader className="text-center border-b border-white/10 space-y-4 pb-8">
      <div className="uppercase tracking-[0.2em] text-sm text-gray-400 font-medium">
        Calculator
      </div>
      <h1 className="text-3xl font-medium text-white tracking-tight">
        Yu-Gi-Oh Deck Probability
      </h1>
      <p className="text-gray-400 text-sm max-w-md mx-auto">
        Easily improve your deck with the power of math! Make better decisions
        during deck-building.
      </p>
    </CardHeader>
  );
}
