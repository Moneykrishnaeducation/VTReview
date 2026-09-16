import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AdminProvider } from "../../../context/admin-context";
import ComplaintManagement from "../complaint-management";

describe("Trader Complaints & Financial Dispute Mediation (Screen 09)", () => {
  it("renders dispute mediation console with executive metrics, tabs, and queue cards", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <ComplaintManagement />
        </AdminProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Trader Complaints & Financial Dispute Mediation/i)).toBeInTheDocument();
    expect(screen.getByText(/DISPUTE ARBITRATION CONSOLE/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Claim Exposure/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Disputes/i)).toBeInTheDocument();
    expect(screen.getByText(/Settled Funds Recovered/i)).toBeInTheDocument();
    expect(screen.getByText(/Mediation Recovery Rate/i)).toBeInTheDocument();
    expect(screen.getAllByText(/CMP-2026-089/i).length).toBeGreaterThan(0);
  });

  it("filters dispute cases by search query", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <ComplaintManagement />
        </AdminProvider>
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search case #, broker, trader, email, or keywords/i);
    fireEvent.change(searchInput, { target: { value: "Liam O'Connor" } });

    expect(screen.getAllByText(/Liam O'Connor/i).length).toBeGreaterThan(0);
  });

  it("executes status update to dispatch broker notice", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <ComplaintManagement />
        </AdminProvider>
      </MemoryRouter>
    );

    const dispatchBtn = screen.getByRole("button", { name: /Dispatch Broker Notice/i });
    fireEvent.click(dispatchBtn);

    // Verify success banner and timeline entry appear
    expect(screen.getAllByText(/updated to BROKER CONTACTED/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Case #CMP-2026-089 updated to BROKER CONTACTED/i)).toBeInTheDocument();
  });
});
