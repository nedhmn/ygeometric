import {
  DistributionParams,
  HypergeometricParams,
} from "@/types/hypergeometric";

export class HypergeometricCalculator {
  private factorialCache: { [key: number]: number } = {};

  private factorial(x: number): number {
    const parsed = parseInt(String(x), 10);
    if (isNaN(parsed) || parsed <= 0) return 1;
    if (parsed > 170) return Infinity;

    // Check cache first
    if (this.factorialCache[parsed]) {
      return this.factorialCache[parsed];
    }

    // Calculate and cache result
    let result = 1;
    for (let i = 2; i <= parsed; i++) {
      result *= i;
    }
    this.factorialCache[parsed] = result;
    return result;
  }

  private combinations(n: number, k: number): number {
    const nParsed = parseInt(String(n), 10) || 0;
    const kParsed = parseInt(String(k), 10) || 0;

    const nValue = Math.max(0, nParsed);
    const kValue = Math.max(0, kParsed);

    return (
      this.factorial(nValue) /
      (this.factorial(kValue) * this.factorial(nValue - kValue))
    );
  }

  private recursiveCalculate(
    currentHand: number[],
    currentHandSize: number,
    distributions: DistributionParams[],
    populationSize: number,
    sampleSize: number,
    remainingElements: number
  ): number {
    if (distributions.length === 0 || currentHandSize >= sampleSize) {
      if (currentHandSize === sampleSize) {
        if (distributions.some((dist) => dist.min !== 0)) {
          return 0;
        }
      } else if (currentHandSize > sampleSize) {
        return 0;
      }

      let probability = 1;
      for (let i = 0; i < currentHand.length; i += 2) {
        probability *= this.combinations(currentHand[i], currentHand[i + 1]);
      }

      if (currentHandSize < sampleSize) {
        probability *= this.combinations(
          remainingElements,
          sampleSize - currentHandSize
        );
      }

      return probability;
    }

    const dist = distributions.pop();
    if (!dist) return 0;

    let totalProbability = 0;

    for (let i = dist.min; i <= dist.max; i++) {
      currentHand.push(dist.amt, i);
      totalProbability += this.recursiveCalculate(
        currentHand,
        currentHandSize + i,
        distributions,
        populationSize,
        sampleSize,
        remainingElements
      );
      currentHand.pop();
      currentHand.pop();
    }

    distributions.push(dist);
    return totalProbability;
  }

  public calculateProbability({
    deckSize,
    handSize,
    cardTypes,
    miscMax = 0,
    miscAmt = 0,
  }: HypergeometricParams): number {
    if (miscMax === 0 && deckSize === handSize) {
      return 100;
    }

    const probability = this.recursiveCalculate(
      [],
      0,
      [...cardTypes],
      deckSize,
      handSize,
      miscAmt
    );

    return (probability / this.combinations(deckSize, handSize)) * 100;
  }
}
