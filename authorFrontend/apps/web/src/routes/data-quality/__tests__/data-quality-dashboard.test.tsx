import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AdminProvider } from "../../../context/admin-context";
import DataQualityDashboard from "../data-quality-dashboard";

describe("Data Quality & Stale Verification Dashboard (data-quality-dashboard.tsx)", () => {
  it("renders data quality header, executive health index, and anomalies list", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <DataQualityDashboard />
        </AdminProvider>
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /Data Quality, Stale Verification & Crawler Radar/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Data Health Index/i)).toBeInTheDocument();
    expect(screen.getByText(/Critical Anomalies/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Triage Items/i)).toBeInTheDocument();
    expect(screen.getByText(/Background Runners/i)).toBeInTheDocument();
  });

  it("filters anomalies by search query", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <DataQualityDashboard />
        </AdminProvider>
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search issue ID, entity name, description, assigned officer.../i);
    fireEvent.change(searchInput, { target: { value: "VTIndex" } });

    expect(screen.getAllByText(/VTIndex/i).length).toBeGreaterThan(0);
  });

  it("navigates across background workers and stale verification radar tabs", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <DataQualityDashboard />
        </AdminProvider>
      </MemoryRouter>
    );

    // 1. Workers tab
    const jobsTab = screen.getByRole("button", { name: /Background Worker Queues/i });
    fireEvent.click(jobsTab);
    expect(screen.getByText(/Scheduled Background Workers & Registry Scrapers/i)).toBeInTheDocument();
    expect(screen.getByText(/Live Spread Feed Telemetry Sync/i)).toBeInTheDocument();

    // 2. Stale Radar tab
    const radarTab = screen.getByRole("button", { name: /Stale Verification Radar/i });
    fireEvent.click(radarTab);
    expect(screen.getByText(/Stale License Verification & Registry Freshness Radar/i)).toBeInTheDocument();

    // 3. Back to Issues tab
    const issuesTab = screen.getByRole("button", { name: /Integrity Anomalies/i });
    fireEvent.click(issuesTab);
    expect(screen.getByText(/Detected Sanity Anomalies/i)).toBeInTheDocument();
  });

  it("opens anomaly inspection modal and resolves issue", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <DataQualityDashboard />
        </AdminProvider>
      </MemoryRouter>
    );

    const inspectButtons = screen.getAllByRole("button", { name: /Inspect/i });
    fireEvent.click(inspectButtons[0]);

    expect(screen.getByText(/Sanity Anomaly Inspection/i)).toBeInTheDocument();
    expect(screen.getByText(/Description & Automated Diagnosis/i)).toBeInTheDocument();

    const resolveBtn = screen.getByRole("button", { name: /Acknowledge & Mark Resolved/i });
    fireEvent.click(resolveBtn);

    expect(screen.getByText(/resolved successfully/i)).toBeInTheDocument();
  });

  it("runs automated sanity sweep", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <DataQualityDashboard />
        </AdminProvider>
      </MemoryRouter>
    );

    const scanBtn = screen.getByRole("button", { name: /Run Sanity Sweep/i });
    fireEvent.click(scanBtn);

    expect(screen.getByText(/Scanning Matrix.../i)).toBeInTheDocument();
  });
});
