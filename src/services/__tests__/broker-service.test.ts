import { describe, it, expect } from "vitest";
import { brokerService } from "../broker-service";

describe("BrokerService Data Access & Domain Queries", () => {
  it("fetches full broker list", async () => {
    const brokers = await brokerService.getBrokers();
    expect(brokers.length).toBeGreaterThan(0);
    expect(brokers[0]).toHaveProperty("name");
    expect(brokers[0]).toHaveProperty("editorialRating");
    expect(brokers[0]).toHaveProperty("regulations");
  });

  it("filters brokers by search query", async () => {
    const results = await brokerService.getBrokers({ query: "Pepperstone" });
    expect(results.length).toBe(1);
    expect(results[0].name).toBe("Pepperstone");
  });

  it("filters brokers by Tier-1 regulation", async () => {
    const results = await brokerService.getBrokers({ tier1Only: true });
    expect(results.every((b) => b.regulations.some((r) => r.tier === 1))).toBe(true);
  });

  it("sorts brokers by spread ascending", async () => {
    const results = await brokerService.getBrokers({ sortBy: "spread" });
    expect(results[0].eurUsdSpread).toBeLessThanOrEqual(results[results.length - 1].eurUsdSpread);
  });

  it("retrieves individual broker by slug", async () => {
    const broker = await brokerService.getBrokerBySlug("pepperstone");
    expect(broker).not.toBeNull();
    expect(broker?.name).toBe("Pepperstone");
    expect(broker?.ratingsBreakdown).toBeDefined();

    const vtindex = await brokerService.getBrokerBySlug("vtindex");
    expect(vtindex).not.toBeNull();
    expect(vtindex?.name).toBe("VTIndex");
    expect(vtindex?.affiliateUrl).toBe("https://vtindex.com");
  });

  it("returns null for non-existent broker slug", async () => {
    const broker = await brokerService.getBrokerBySlug("non-existent-broker-xyz");
    expect(broker).toBeNull();
  });
});
