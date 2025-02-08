export interface DistributionParams {
  amt: number;
  min: number;
  max: number;
}

export interface HypergeometricParams {
  deckSize: number; // population size (N)
  handSize: number; // sample size (n)
  cardTypes: DistributionParams[]; // success states
  miscMax: number; // maximum for remaining elements
  miscAmt: number; // number of remaining elements
}
