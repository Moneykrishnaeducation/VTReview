import { describe, it, expect } from "vitest";
import {
  calculatePipValue,
  calculateSpreadCost,
  calculateCommissionCost,
  calculateAllInTradingCost,
  calculatePositionSize,
  calculateRequiredMargin,
} from "../calculators";

describe("Quantitative Financial Calculators Engine", () => {
  describe("calculatePipValue", () => {
    it("calculates standard 4-decimal currency pair pip value accurately", () => {
      // EUR/USD standard lot (1.0 = 100,000 units) => 1 pip (0.0001) = $10.00
      const pipVal = calculatePipValue({ pair: "EUR/USD", lotSize: 1.0 });
      expect(pipVal).toBe(10.0);
    });

    it("calculates mini and micro lot pip values", () => {
      const miniLot = calculatePipValue({ pair: "EUR/USD", lotSize: 0.1 });
      expect(miniLot).toBe(1.0);

      const microLot = calculatePipValue({ pair: "EUR/USD", lotSize: 0.01 });
      expect(microLot).toBe(0.1);
    });

    it("handles JPY 2-decimal pairs correctly", () => {
      // USD/JPY standard lot (100,000 units) => 1 pip (0.01) = 1,000 JPY
      const jpyPipVal = calculatePipValue({ pair: "USD/JPY", lotSize: 1.0 });
      expect(jpyPipVal).toBe(1000.0);
    });

    it("handles zero and negative lot sizes safely", () => {
      expect(calculatePipValue({ pair: "EUR/USD", lotSize: 0 })).toBe(0);
      expect(calculatePipValue({ pair: "EUR/USD", lotSize: -5 })).toBe(0);
    });
  });

  describe("calculateAllInTradingCost", () => {
    it("calculates all-in friction for Raw ECN account with tight spread and commission", () => {
      // 0.1 pip spread on EUR/USD ($1.00) + $6.00 round-turn commission = $7.00 per standard lot
      const result = calculateAllInTradingCost({
        pair: "EUR/USD",
        spreadPips: 0.1,
        commissionPerLot: 6.0,
        lots: 1.0,
      });

      expect(result.spreadCost).toBe(1.0);
      expect(result.commissionCost).toBe(6.0);
      expect(result.totalCost).toBe(7.0);
      expect(result.costPerStandardLot).toBe(7.0);
    });

    it("calculates all-in friction for Standard Zero-Commission account with markup spread", () => {
      // 0.9 pip spread ($9.00) + $0 commission = $9.00 per standard lot
      const result = calculateAllInTradingCost({
        pair: "EUR/USD",
        spreadPips: 0.9,
        commissionPerLot: 0.0,
        lots: 2.5,
      });

      expect(result.spreadCost).toBe(22.5);
      expect(result.commissionCost).toBe(0.0);
      expect(result.totalCost).toBe(22.5);
      expect(result.costPerStandardLot).toBe(9.0);
    });
  });

  describe("calculatePositionSize", () => {
    it("computes exact lot sizing based on 1% risk on a $10,000 account with 20 pips stop loss", () => {
      // Risk = $100. Stop loss = 20 pips. Pip value = $10. Lots = 100 / (20 * 10) = 0.50 lots
      const result = calculatePositionSize({
        accountBalance: 10000,
        riskPercentage: 1.0,
        stopLossPips: 20,
      });

      expect(result.monetaryRisk).toBe(100);
      expect(result.recommendedLots).toBe(0.5);
      expect(result.units).toBe(50000);
    });

    it("handles zero or invalid risk inputs gracefully", () => {
      expect(
        calculatePositionSize({ accountBalance: 0, riskPercentage: 1.0, stopLossPips: 20 })
      ).toEqual({ monetaryRisk: 0, recommendedLots: 0, units: 0 });

      expect(
        calculatePositionSize({ accountBalance: 10000, riskPercentage: 0, stopLossPips: 20 })
      ).toEqual({ monetaryRisk: 0, recommendedLots: 0, units: 0 });
    });
  });

  describe("calculateRequiredMargin", () => {
    it("computes margin for 1 standard lot with retail 1:30 FCA leverage", () => {
      // Notional = 100,000. Leverage = 30. Margin = 100,000 / 30 = $3,333.33
      const margin = calculateRequiredMargin({
        lots: 1.0,
        leverage: 30,
        assetPrice: 1.0,
      });
      expect(margin).toBe(3333.33);
    });

    it("computes margin for 1 standard lot with pro 1:500 leverage", () => {
      // Notional = 100,000. Leverage = 500. Margin = 100,000 / 500 = $200.00
      const margin = calculateRequiredMargin({
        lots: 1.0,
        leverage: 500,
        assetPrice: 1.0,
      });
      expect(margin).toBe(200.0);
    });
  });
});
