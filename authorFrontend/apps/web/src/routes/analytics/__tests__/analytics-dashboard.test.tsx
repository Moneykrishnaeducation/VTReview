import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import AnalyticsDashboard from "../analytics-dashboard";

describe("Telemetry & Conversion Analytics Dashboard (analytics-dashboard.tsx)", () => {
  it("renders analytics header, executive KPI cards, and conversion funnel", () => {
    render(
      <MemoryRouter>
        <AnalyticsDashboard />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /Telemetry & Conversion Analytics Dashboard/i })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Directory Impressions/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Comparison Runs/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Finder Quiz Runs/i)).toBeInTheDocument();
    expect(screen.getByText(/Dispute Settlement/i)).toBeInTheDocument();
    expect(screen.getByText(/Outbound Referral Conversion Share/i)).toBeInTheDocument();
    expect(screen.getByText(/Research Conversion Funnel/i)).toBeInTheDocument();
  });

  it("switches timeframe range between 7 Days, 30 Days, and 90 Days", () => {
    render(
      <MemoryRouter>
        <AnalyticsDashboard />
      </MemoryRouter>
    );

    const sevenDaysBtn = screen.getByRole("button", { name: /7 Days/i });
    fireEvent.click(sevenDaysBtn);
    expect(screen.getAllByText(/112,600/i).length).toBeGreaterThan(0);

    const ninetyDaysBtn = screen.getByRole("button", { name: /90 Days/i });
    fireEvent.click(ninetyDaysBtn);
    expect(screen.getAllByText(/1,118,920/i).length).toBeGreaterThan(0);

    const thirtyDaysBtn = screen.getByRole("button", { name: /30 Days/i });
    fireEvent.click(thirtyDaysBtn);
    expect(screen.getAllByText(/418,920/i).length).toBeGreaterThan(0);
  });

  it("filters chart metrics series", () => {
    render(
      <MemoryRouter>
        <AnalyticsDashboard />
      </MemoryRouter>
    );

    const searchesBtn = screen.getByRole("button", { name: /Searches/i });
    fireEvent.click(searchesBtn);

    const comparesBtn = screen.getByRole("button", { name: /Compares/i });
    fireEvent.click(comparesBtn);

    const clicksBtn = screen.getByRole("button", { name: /Outbound Clicks/i });
    fireEvent.click(clicksBtn);

    const allMetricsBtn = screen.getByRole("button", { name: /All Metrics/i });
    fireEvent.click(allMetricsBtn);

    expect(screen.getByText(/Discovery & Conversion Telemetry Trends/i)).toBeInTheDocument();
  });

  it("renders search queries breakdown and regulatory jurisdiction distribution", () => {
    render(
      <MemoryRouter>
        <AnalyticsDashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Top Research Search Queries/i)).toBeInTheDocument();
    expect(screen.getByText(/Lowest spread ECN brokers/i)).toBeInTheDocument();
    expect(screen.getByText(/Traffic by Regulatory Jurisdiction/i)).toBeInTheDocument();
    expect(screen.getByText(/FCA \(United Kingdom\)/i)).toBeInTheDocument();
  });
});
