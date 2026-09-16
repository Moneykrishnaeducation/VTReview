import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AdminProvider } from "../../../context/admin-context";
import VerificationQueue from "../verification-queue";

describe("Regulatory License Verification Queue (Screen 04)", () => {
  it("renders verification desk header, queue applications, and inspector panel", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <VerificationQueue />
        </AdminProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Regulatory License Verification Queue/i)).toBeInTheDocument();
    expect(screen.getByText(/COMPLIANCE CERTIFICATION DESK/i)).toBeInTheDocument();
    expect(screen.getByText(/License Applications/i)).toBeInTheDocument();
    expect(screen.getByText(/Forensic Discrepancy Matrix/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Verify & Stamp License/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reject \/ Flag Clone/i })).toBeInTheDocument();
  });

  it("filters queue items by search query", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <VerificationQueue />
        </AdminProvider>
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search broker, license #, entity\.\.\./i);
    fireEvent.change(searchInput, { target: { value: "VTIndex" } });

    expect(screen.getAllByText(/VTIndex/i).length).toBeGreaterThan(0);
  });

  it("applies preset note and executes verification stamp", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <VerificationQueue />
        </AdminProvider>
      </MemoryRouter>
    );

    // Click quick preset note button
    const presetBtn = screen.getByText(/Direct official register cross-check confirms active authorized status/i);
    fireEvent.click(presetBtn);

    // Verify textarea populated
    const textarea = screen.getByPlaceholderText(/Record verification methodology/i) as HTMLTextAreaElement;
    expect(textarea.value).toContain("Direct official register cross-check");

    // Click verify
    const verifyBtn = screen.getByRole("button", { name: /Verify & Stamp License/i });
    fireEvent.click(verifyBtn);

    // Verify success banner appears
    expect(screen.getByText(/Certified and stamped license/i)).toBeInTheDocument();
  });
});
