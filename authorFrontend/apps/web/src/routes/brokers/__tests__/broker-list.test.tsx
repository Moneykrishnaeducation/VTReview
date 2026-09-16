import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AdminProvider } from "../../../context/admin-context";
import BrokerList from "../broker-list";

describe("Broker Profile & Governance Directory (Screen 01)", () => {
  it("renders broker directory with executive metrics, filters, and broker cards", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <BrokerList />
        </AdminProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/RESEARCH DATABASE/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Broker Profile & Governance Directory/i })).toBeInTheDocument();
    expect(screen.getByText(/Tracked Broker Catalog/i)).toBeInTheDocument();
    expect(screen.getByText(/Tier-1 Licensed Entities/i)).toBeInTheDocument();
    expect(screen.getAllByText(/IC Markets/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Pepperstone/i).length).toBeGreaterThan(0);
  });

  it("filters brokers by search query", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <BrokerList />
        </AdminProvider>
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search broker name, legal entity, regulator/i);
    fireEvent.change(searchInput, { target: { value: "Pepperstone" } });

    expect(screen.getAllByText(/Pepperstone/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/IC Markets/i)).not.toBeInTheDocument();
  });

  it("toggles between Table and Grid view", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <BrokerList />
        </AdminProvider>
      </MemoryRouter>
    );

    const gridBtn = screen.getByTitle(/Grid View/i);
    fireEvent.click(gridBtn);

    expect(screen.getAllByText(/Inspect 120-pt Audit/i).length).toBeGreaterThan(0);
  });
});
