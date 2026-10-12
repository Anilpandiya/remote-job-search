export type AssetClass =
  | "equity"
  | "fixed_income"
  | "private_equity"
  | "real_estate"
  | "cash";

export type Holding = {
  id: string;
  name: string;
  ticker: string;
  assetClass: AssetClass;
  region: string;
  marketValueUsd: number;
  weightPct: number;
  dayChangePct: number;
  ytdReturnPct: number;
};

export type InsightMetric = {
  id: string;
  label: string;
  value: string;
  deltaLabel: string;
  tone: "up" | "down" | "neutral";
};

export type PortfolioSnapshot = {
  asOf: string;
  currency: "USD";
  totalValueUsd: number;
  dayChangePct: number;
  metrics: InsightMetric[];
  holdings: Holding[];
};

export type ApiErrorBody = {
  error: string;
  code: string;
};
