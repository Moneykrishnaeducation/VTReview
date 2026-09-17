import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AdminProvider } from "../../../context/admin-context";
import AdminUsersPage from "../admin-users";
import TraderUsersPage from "../trader-users";
import RolesPermissions from "../roles-permissions";

describe("Admin Staff & Security Officers Page (/users, /users/admins)", () => {
  it("renders admin staff directory with governance header, KPI stats, and officer table", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <AdminUsersPage />
        </AdminProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/ADMINISTRATIVE GOVERNANCE/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Admin Staff & Security Officers/i })).toBeInTheDocument();
    expect(screen.getByText(/Marcus Vance/i)).toBeInTheDocument();
    expect(screen.getByText(/Elena Rostova/i)).toBeInTheDocument();
    expect(screen.getByText(/Open Platform Traders Directory/i)).toBeInTheDocument();
  });

  it("filters admin officers by search query", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <AdminUsersPage />
        </AdminProvider>
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search officer name, email, role, or country/i);
    fireEvent.change(searchInput, { target: { value: "Elena Rostova" } });

    expect(screen.getByText(/Elena Rostova/i)).toBeInTheDocument();
  });

  it("opens invite admin officer modal", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <AdminUsersPage />
        </AdminProvider>
      </MemoryRouter>
    );

    const inviteBtn = screen.getByRole("button", { name: /Invite Admin Officer/i });
    fireEvent.click(inviteBtn);

    expect(screen.getByText(/Invite Administrative Staff/i)).toBeInTheDocument();
  });
});

describe("Platform Traders & Public Viewers Page (/users/traders, /traders)", () => {
  it("renders platform traders directory with header, stats, and trader rows", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <TraderUsersPage />
        </AdminProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /Platform Traders & Public Viewers/i })).toBeInTheDocument();
    expect(screen.getAllByText(/PLATFORM TRADERS/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/SimonB_FX/i)).toBeInTheDocument();
    expect(screen.getByText(/Open Admin Staff Directory/i)).toBeInTheDocument();
  });

  it("filters traders by search query", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <TraderUsersPage />
        </AdminProvider>
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search trader name, email, or country/i);
    fireEvent.change(searchInput, { target: { value: "SimonB_FX" } });

    expect(screen.getByText(/SimonB_FX/i)).toBeInTheDocument();
  });

  it("opens user reviews modal and lists all reviews posted by the user", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <TraderUsersPage />
        </AdminProvider>
      </MemoryRouter>
    );

    // Click on Reviews button for SimonB_FX
    const reviewButtons = screen.getAllByRole("button", { name: /Reviews/i });
    fireEvent.click(reviewButtons[0]);

    expect(screen.getByText(/Trader Reviews & Testimonials/i)).toBeInTheDocument();
    expect(screen.getByText(/All broker reviews, ratings, and moderation records submitted by this trader/i)).toBeInTheDocument();

    // Verify all reviews are listed (Review #1, Review #2, Review #3, Review #4)
    expect(screen.getByText(/Review #1 of 4/i)).toBeInTheDocument();
    expect(screen.getByText(/Review #2 of 4/i)).toBeInTheDocument();
    expect(screen.getByText(/Review #3 of 4/i)).toBeInTheDocument();
    expect(screen.getByText(/Review #4 of 4/i)).toBeInTheDocument();
    expect(screen.getByText(/Consistently tight spreads on EUR\/USD/i)).toBeInTheDocument();
    expect(screen.getByText(/Superior cTrader execution speed/i)).toBeInTheDocument();
  });

  it("toggles block login access for a trader user", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <TraderUsersPage />
        </AdminProvider>
      </MemoryRouter>
    );

    // Find block buttons and click block on the first trader
    const blockButtons = screen.getAllByRole("button", { name: /Block/i });
    fireEvent.click(blockButtons[0]);

    // Confirmation alert should indicate login access is blocked
    expect(screen.getByText(/Login access BLOCKED/i)).toBeInTheDocument();
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
