import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AdminProvider } from "../../../context/admin-context";
import ConvocationManagement from "../convocation-management";

describe("Admin Convocation Management Console", () => {
  it("renders convocation operations header, quick stats, and moderation tabs", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <ConvocationManagement />
        </AdminProvider>
      </MemoryRouter>
    );

    expect(
      screen.getByText(/COMMUNITY SUMMIT & CONVOCATION OPERATIONS CONTROL/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Global Trader Convocation & Townhall Management/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/48,520/i)).toBeInTheDocument();
    expect(screen.getByText(/\$500,000/i)).toBeInTheDocument();
  });

  it("moderates floor questions by pushing to speaker podium", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <ConvocationManagement />
        </AdminProvider>
      </MemoryRouter>
    );

    // Click "Push to Podium" on one of the pending questions
    const pushBtns = screen.getAllByRole("button", { name: /Push to Podium/i });
    expect(pushBtns.length).toBeGreaterThan(0);
    fireEvent.click(pushBtns[0]);

    // Notice banner should appear
    expect(screen.getByText(/status updated to: PUSHED TO PODIUM/i)).toBeInTheDocument();
  });

  it("switches to sessions tab and toggles live stream broadcast", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <ConvocationManagement />
        </AdminProvider>
      </MemoryRouter>
    );

    const sessionsTab = screen.getByRole("button", { name: /Stage Streams & Agenda/i });
    fireEvent.click(sessionsTab);

    expect(screen.getByText(/Stage Broadcast Controls & Session Agenda/i)).toBeInTheDocument();
    expect(screen.getByText(/Plenary Hall A/i)).toBeInTheDocument();
  });
});
