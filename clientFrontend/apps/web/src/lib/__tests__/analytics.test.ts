import { describe, it, expect, beforeEach } from "vitest";
import { analytics, type AnalyticsEvent } from "../analytics";

describe("Analytics & Outbound Tracker Dispatcher", () => {
  beforeEach(() => {
    analytics.clearHistory();
  });

  it("dispatches and records broker view events", () => {
    analytics.track("broker_viewed", {
      brokerId: "pepperstone",
      brokerName: "Pepperstone",
      sourceScreen: "directory",
    });

    const history = analytics.getHistory();
    expect(history.length).toBe(1);
    expect(history[0].event).toBe("broker_viewed");
    expect(history[0].payload?.brokerName).toBe("Pepperstone");
  });

  it("notifies subscribed event listeners", () => {
    const received: AnalyticsEvent[] = [];
    const unsubscribe = analytics.subscribe((evt) => received.push(evt));

    analytics.trackBrokerOutbound("ic-markets", "IC Markets", "https://icmarkets.com", "broker_review");

    expect(received.length).toBe(1);
    expect(received[0].event).toBe("outbound_broker_clicked");
    expect(received[0].payload?.brokerId).toBe("ic-markets");

    unsubscribe();
    analytics.track("broker_search", { searchQuery: "FCA" });
    expect(received.length).toBe(1); // No new events after unsubscribe
  });
});
