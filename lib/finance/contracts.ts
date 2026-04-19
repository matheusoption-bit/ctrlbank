export type FinanceSignalLevel = "attention" | "risk" | "direction";

export type FinanceSignal = {
  level: FinanceSignalLevel;
  signal: string;
  source: string;
  explanation: string;
  nextStep: string;
};
