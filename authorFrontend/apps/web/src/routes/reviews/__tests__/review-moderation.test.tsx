import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AdminProvider } from "../../../context/admin-context";
import ReviewModeration from "../review-moderation";

describe("Trader Review Moderation & Proof Inspection (Screen 08)", () => {
  it("renders review moderation workspace with header, stats, and review cards", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <ReviewModeration />
        </AdminProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Trader Review Moderation & Proof Inspection/i)).toBeInTheDocument();
    expect(screen.getByText(/COMMUNITY GOVERNANCE & PROOF TRIAGE/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Pending Triage/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/With Trade Proof/i).length).toBeGreaterThan(0);
  });

  it("filters reviews by searching text query", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <ReviewModeration />
        </AdminProvider>
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search trader, email, broker/i);
    fireEvent.change(searchInput, { target: { value: "SimonB_FX" } });

    expect(screen.getAllByText(/SimonB_FX/i).length).toBeGreaterThan(0);
  });

  it("executes an approval action on a review item", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <ReviewModeration />
        </AdminProvider>
      </MemoryRouter>
    );

    const approveButtons = screen.getAllByRole("button", { name: /Approve & Publish/i });
    fireEvent.click(approveButtons[0]);

    // Verify success alert appears
    expect(screen.getByText(/Approved & Published to public community feed/i)).toBeInTheDocument();
  });
});
