import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AdminProvider } from "../../../context/admin-context";
import UserManagement from "../user-management";
import RolesPermissions from "../roles-permissions";

describe("User Directory & Trader Verification (Screen 11)", () => {
  it("renders user directory with header, stats, and user table", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <UserManagement />
        </AdminProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/USER & TRADER IDENTITY/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /User Directory & Trader Verification/i })).toBeInTheDocument();
    expect(screen.getByText(/Verified Live Traders/i)).toBeInTheDocument();
    expect(screen.getByText(/Marcus Vance/i)).toBeInTheDocument();
    expect(screen.getByText(/SimonB_FX/i)).toBeInTheDocument();
  });

  it("filters users by search query", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <UserManagement />
        </AdminProvider>
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search user name, email, role, country/i);
    fireEvent.change(searchInput, { target: { value: "Elena Rostova" } });

    expect(screen.getByText(/Elena Rostova/i)).toBeInTheDocument();
  });
});

describe("Role-Based Access Control (RBAC) Matrix (Screen 12)", () => {
  it("renders RBAC governance header, simulator cards, and module matrix", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <RolesPermissions />
        </AdminProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/ACCESS GOVERNANCE & RBAC/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Role-Based Access Control \(RBAC\) & Governance Matrix/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/System Roles Defined/i)).toBeInTheDocument();
    expect(screen.getByText(/4-Eyes Principle/i)).toBeInTheDocument();
    expect(screen.getByText(/Broker Specifications & Research/i)).toBeInTheDocument();
  });

  it("simulates switching active administrative role", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <RolesPermissions />
        </AdminProvider>
      </MemoryRouter>
    );

    // Click on Compliance Reviewer simulator card
    const reviewerCards = screen.getAllByText(/Compliance Reviewer/i);
    fireEvent.click(reviewerCards[0]);

    // Notice alert should confirm switch
    expect(screen.getByText(/Switched active simulated session to: Compliance Reviewer/i)).toBeInTheDocument();
  });
});
