import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AdminProvider } from "../../../context/admin-context";
import AuditLogs from "../audit-logs";

describe("Immutable Audit Trail & Regulatory Compliance Log (audit-logs.tsx)", () => {
  it("renders audit ledger header, executive metrics cards, and table data", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <AuditLogs />
        </AdminProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/IMMUTABLE SYSTEM LEDGER/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Immutable Audit Trail & Regulatory Compliance Log/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Total Logged Events/i)).toBeInTheDocument();
    expect(screen.getAllByText(/License Certifications/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Score Recalibrations/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Dispute Mediations/i).length).toBeGreaterThan(0);
  });

  it("filters audit records by search query and mutation action", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <AuditLogs />
        </AdminProvider>
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search audit ID, actor, entity, evidence, reason, IP.../i);
    fireEvent.change(searchInput, { target: { value: "VERIFY" } });

    expect(screen.getAllByText(/VERIFIED/i).length).toBeGreaterThan(0);
  });

  it("toggles between Table view and Timeline Stream view", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <AuditLogs />
        </AdminProvider>
      </MemoryRouter>
    );

    const timelineBtn = screen.getByRole("button", { name: /Timeline/i });
    fireEvent.click(timelineBtn);

    expect(screen.getByText(/Chronological Event Stream/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Inspect/i).length).toBeGreaterThan(0);

    const tableBtn = screen.getByRole("button", { name: /Table/i });
    fireEvent.click(tableBtn);

    expect(screen.queryByText(/Chronological Event Stream/i)).not.toBeInTheDocument();
  });

  it("opens forensic event dossier modal and views full details", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <AuditLogs />
        </AdminProvider>
      </MemoryRouter>
    );

    const timelineBtn = screen.getByRole("button", { name: /Timeline/i });
    fireEvent.click(timelineBtn);

    const inspectButtons = screen.getAllByRole("button", { name: /Inspect/i });
    fireEvent.click(inspectButtons[0]);

    expect(screen.getByText(/Audit Event Dossier/i)).toBeInTheDocument();
    expect(screen.getByText(/Cryptographic Block Signature \(SHA-256\)/i)).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: /Close Dossier/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByText(/Audit Event Dossier/i)).not.toBeInTheDocument();
  });

  it("toggles the live feed status button", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <AuditLogs />
        </AdminProvider>
      </MemoryRouter>
    );

    const feedBtn = screen.getByRole("button", { name: /Live Feed Active/i });
    fireEvent.click(feedBtn);

    expect(screen.getByText(/Feed Paused/i)).toBeInTheDocument();
  });
});
