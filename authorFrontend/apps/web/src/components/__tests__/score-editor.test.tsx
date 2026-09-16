import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminProvider } from "../../context/admin-context";
import { ScoreEditor } from "../score-editor";
import { INITIAL_BROKERS } from "../../data/admin-data";

describe("ScoreEditor Component (120-Point Calculator)", () => {
  it("renders 120-point framework steppers, delta badges, and evidence selector", () => {
    const broker = INITIAL_BROKERS[0];

    render(
      <AdminProvider>
        <ScoreEditor broker={broker} />
      </AdminProvider>
    );

    expect(screen.getByText(/120-POINT FRAMEWORK/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Safety & Regulation/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Trading Costs & Spreads/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Platforms & Execution/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Deposit & Withdrawal/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Customer Support/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Attach Supporting Evidence Vault Record/i)).toBeInTheDocument();
  });
});
