/**
 * Pure, deterministic quantitative financial calculator engine.
 * Separated from UI rendering to ensure testability, precision, and architectural separation.
 */

export interface PipValueParams {
  pair: string;
  lotSize?: number; // Standard lot = 1.0 (100,000 units)
  accountCurrency?: string;
  exchangeRate?: number;
}

export interface CostCalculationParams {
  spreadPips: number;
  commissionPerLot: number;
  lots: number;
  pair?: string;
  pipValuePerStandardLot?: number;
}

export interface PositionSizeParams {
  accountBalance: number;
  riskPercentage: number; // e.g. 1.0 = 1%
  stopLossPips: number;
  pipValuePerStandardLot?: number;
}

export interface MarginParams {
  lots: number;
  leverage: number; // e.g. 30 for 1:30
  contractSize?: number; // default 100,000
  assetPrice?: number; // e.g. 1.0850 for EUR/USD
}

/**
 * Calculates pip value in account currency.
 * For standard 4-decimal currency pairs (e.g. EUR/USD), 1 pip = 0.0001.
 * For JPY pairs (2-decimals), 1 pip = 0.01.
 */
export function calculatePipValue(params: PipValueParams): number {
  const lotSize = Math.max(0, params.lotSize ?? 1.0);
  const pair = params.pair.toUpperCase();
  const isJpy = pair.includes("JPY");

  // Base contract standard size = 100,000 units
  const units = lotSize * 100000;
  const pipMultiplier = isJpy ? 0.01 : 0.0001;

  let basePipValue = units * pipMultiplier;

  // If quote currency differs from account currency and an exchange rate is provided
  if (params.exchangeRate && params.exchangeRate > 0) {
    basePipValue = basePipValue / params.exchangeRate;
  }

  return Number(basePipValue.toFixed(4));
}

/**
 * Computes exact round-turn spread friction cost.
 */
export function calculateSpreadCost(spreadPips: number, lots: number, pipValue = 10.0): number {
  if (spreadPips < 0 || lots <= 0) return 0;
  return Number((spreadPips * pipValue * lots).toFixed(2));
}

/**
 * Computes round-turn commission.
 */
export function calculateCommissionCost(commissionPerLot: number, lots: number): number {
  if (commissionPerLot < 0 || lots <= 0) return 0;
  return Number((commissionPerLot * lots).toFixed(2));
}

/**
 * Calculates total all-in round-turn trading friction (Spread + Commission).
 */
export function calculateAllInTradingCost(params: CostCalculationParams): {
  spreadCost: number;
  commissionCost: number;
  totalCost: number;
  costPerStandardLot: number;
} {
  const lots = Math.max(0, params.lots);
  const spreadPips = Math.max(0, params.spreadPips);
  const commission = Math.max(0, params.commissionPerLot);
  const pipValue = params.pipValuePerStandardLot ?? 10.0;

  const spreadCost = Number((spreadPips * pipValue * lots).toFixed(2));
  const commissionCost = Number((commission * lots).toFixed(2));
  const totalCost = Number((spreadCost + commissionCost).toFixed(2));
  const costPerStandardLot = lots > 0 ? Number((totalCost / lots).toFixed(2)) : 0;

  return {
    spreadCost,
    commissionCost,
    totalCost,
    costPerStandardLot,
  };
}

/**
 * Calculates recommended position size based on defined account risk.
 */
export function calculatePositionSize(params: PositionSizeParams): {
  monetaryRisk: number;
  recommendedLots: number;
  units: number;
} {
  if (params.accountBalance <= 0 || params.riskPercentage <= 0 || params.stopLossPips <= 0) {
    return { monetaryRisk: 0, recommendedLots: 0, units: 0 };
  }

  const monetaryRisk = Number(((params.accountBalance * params.riskPercentage) / 100).toFixed(2));
  const pipValue = params.pipValuePerStandardLot ?? 10.0;

  // Formula: Risk Amount / (Stop Loss Pips * Pip Value per standard lot)
  const rawLots = monetaryRisk / (params.stopLossPips * pipValue);
  const recommendedLots = Number(Math.max(0.01, Math.floor(rawLots * 100) / 100).toFixed(2));
  const units = Math.round(recommendedLots * 100000);

  return {
    monetaryRisk,
    recommendedLots,
    units,
  };
}

/**
 * Calculates required margin for a position.
 */
export function calculateRequiredMargin(params: MarginParams): number {
  if (params.lots <= 0 || params.leverage <= 0) return 0;
  const contractSize = params.contractSize ?? 100000;
  const assetPrice = params.assetPrice ?? 1.0;

  const notionalValue = params.lots * contractSize * assetPrice;
  const requiredMargin = notionalValue / params.leverage;

  return Number(requiredMargin.toFixed(2));
}
