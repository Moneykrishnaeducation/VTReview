import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AdminProvider } from "../../../context/admin-context";
import SystemSettings from "../system-settings";

describe("System Configuration & Platform Governance (system-settings.tsx)", () => {
  it("renders governance control header, executive status cards, and disclosure forms", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <SystemSettings />
        </AdminProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/PLATFORM GOVERNANCE & LEGAL CONTROL/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /System Configuration, Disclosures & Global Telemetry/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/100% Compliant/i)).toBeInTheDocument();
    expect(screen.getByText(/4 \/ 4 Active/i)).toBeInTheDocument();
    expect(screen.getByText(/Mandatory Statutory High-Risk Investment Warning/i)).toBeInTheDocument();
    expect(screen.getByText(/Editorial Independence & Advertiser Compensation Disclosure/i)).toBeInTheDocument();
  });

  it("switches regional statutory warning presets", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <SystemSettings />
        </AdminProvider>
      </MemoryRouter>
    );

    const fcaPresetBtn = screen.getByRole("button", { name: /FCA UK \(81%\)/i });
    fireEvent.click(fcaPresetBtn);

    expect(screen.getByDisplayValue(/81% of retail investor accounts lose money/i)).toBeInTheDocument();

    const asicPresetBtn = screen.getByRole("button", { name: /ASIC Australia \(70-85%\)/i });
    fireEvent.click(asicPresetBtn);

    expect(screen.getByDisplayValue(/Product Disclosure Statement \(PDS\)/i)).toBeInTheDocument();
  });

  it("navigates across feature gates, scoring weights, edge CDN, and audit tabs", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <SystemSettings />
        </AdminProvider>
      </MemoryRouter>
    );

    // 1. Feature Gates Tab
    const featureTab = screen.getByRole("button", { name: /Feature Gates & Telemetry/i });
    fireEvent.click(featureTab);
    expect(screen.getByText(/Global Operational Feature Toggles/i)).toBeInTheDocument();
    expect(screen.getByText(/Live Spread Telemetry Sync/i)).toBeInTheDocument();
    expect(screen.getByText(/Automated Regulatory Clone Detector/i)).toBeInTheDocument();

    // 2. Scoring Weights Tab
    const scoringTab = screen.getByRole("button", { name: /Scoring Formula Weights/i });
    fireEvent.click(scoringTab);
    expect(screen.getByText(/120-Point Multi-Pillar Scoring Weight Matrix/i)).toBeInTheDocument();
    expect(screen.getByText(/Pillar 1: Regulatory Safety, Tiering & Capital Protection/i)).toBeInTheDocument();
    expect(screen.getByText(/Pillar 2: Real Trading Costs, Spreads & Commission Drag/i)).toBeInTheDocument();

    // 3. Edge CDN Tab
    const edgeTab = screen.getByRole("button", { name: /Edge CDN & Registry APIs/i });
    fireEvent.click(edgeTab);
    expect(screen.getByText(/Global Edge CDN Cache Management/i)).toBeInTheDocument();
    expect(screen.getByText(/FCA Register API \(UK\)/i)).toBeInTheDocument();

    // 4. Audit Ledger Tab
    const auditTab = screen.getByRole("button", { name: /Audit Ledger/i });
    fireEvent.click(auditTab);
    expect(screen.getByText(/Governance Configuration Revision Ledger/i)).toBeInTheDocument();
    expect(screen.getByText(/Updated ESMA risk percentage text to reflect 2026 Q3 audit disclosures/i)).toBeInTheDocument();
  });

  it("opens the live public preview modal and toggles device viewports", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <SystemSettings />
        </AdminProvider>
      </MemoryRouter>
    );

    const previewBtn = screen.getByRole("button", { name: /Live Preview/i });
    fireEvent.click(previewBtn);

    expect(screen.getByText(/Live Public Preview: Disclosures & Footers/i)).toBeInTheDocument();
    expect(screen.getByText(/High Risk Investment Notice/i)).toBeInTheDocument();

    const mobileBtn = screen.getByTitle(/Mobile View/i);
    fireEvent.click(mobileBtn);

    const closeBtn = screen.getByRole("button", { name: /Close Preview/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByText(/Live Public Preview: Disclosures & Footers/i)).not.toBeInTheDocument();
  });

  it("saves configuration and triggers success confirmation toast", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <SystemSettings />
        </AdminProvider>
      </MemoryRouter>
    );

    const saveButtons = screen.getAllByRole("button", { name: /Save Configuration|Save System Governance Configuration/i });
    fireEvent.click(saveButtons[0]);

    expect(screen.getByText(/System configuration synced across public web nodes/i)).toBeInTheDocument();
  });
});
