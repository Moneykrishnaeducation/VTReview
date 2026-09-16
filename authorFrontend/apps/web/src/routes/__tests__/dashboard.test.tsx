import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AdminProvider } from "../../context/admin-context";
import Dashboard from "../dashboard";

describe("Admin Dashboard Screen (Screen 01)", () => {
  it("renders operations console title, queues, and metric cards", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <Dashboard />
        </AdminProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Pending Licenses/i)).toBeInTheDocument();
    expect(screen.getByText(/Regulatory Verification Queue/i)).toBeInTheDocument();
    expect(screen.getByText(/Live Audit Ledger/i)).toBeInTheDocument();
    expect(screen.getByText(/Review Queue/i)).toBeInTheDocument();
    expect(screen.getAllByText(/active dispute claims/i).length).toBeGreaterThan(0);
  });
});
