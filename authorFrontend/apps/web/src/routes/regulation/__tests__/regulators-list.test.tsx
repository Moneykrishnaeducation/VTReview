import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AdminProvider } from "../../../context/admin-context";
import RegulatorsList from "../regulators-list";

describe("Statutory Regulators & Compensation Schemes (Screen 05)", () => {
  it("renders regulators list with executive tiles, tier filter, and authorities cards", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <RegulatorsList />
        </AdminProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Statutory Regulators & Compensation Schemes/i)).toBeInTheDocument();
    expect(screen.getByText(/GLOBAL STATUTORY REGISTRY/i)).toBeInTheDocument();
    expect(screen.getByText(/Tier-1 Top Regulators/i)).toBeInTheDocument();
    expect(screen.getByText(/Export Registry \(\.CSV\)/i)).toBeInTheDocument();
  });

  it("filters authorities by searching regulator code or name", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <RegulatorsList />
        </AdminProvider>
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search regulator code/i);
    fireEvent.change(searchInput, { target: { value: "FCA" } });

    expect(screen.getAllByText(/FCA/i).length).toBeGreaterThan(0);
  });

  it("opens authority inspector modal when clicking on a regulator card", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <RegulatorsList />
        </AdminProvider>
      </MemoryRouter>
    );

    // Find and click on the ASIC authority card
    const asicHeading = screen.getByText("ASIC");
    fireEvent.click(asicHeading);

    // Verify modal elements
    expect(screen.getByText(/Statutory Scope & Legal Authority Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Statutory Compensation Protection/i)).toBeInTheDocument();
    expect(screen.getByText(/Open License Search Portal/i)).toBeInTheDocument();
  });

  it("opens the register new authority modal and adds a new regulator", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <RegulatorsList />
        </AdminProvider>
      </MemoryRouter>
    );

    // Click Register New Authority button
    const registerBtn = screen.getByRole("button", { name: /Register New Authority/i });
    fireEvent.click(registerBtn);

    // Verify modal elements
    expect(screen.getByText(/Register New Statutory Regulatory Authority/i)).toBeInTheDocument();
    expect(screen.getByText(/STATUTORY JURISDICTION CATALOG/i)).toBeInTheDocument();

    // Fill form
    const codeInput = screen.getByPlaceholderText(/e\.g\. FINMA, NFA, MAS, DFSA/i);
    fireEvent.change(codeInput, { target: { value: "FINMA" } });

    const nameInput = screen.getByPlaceholderText(/e\.g\. Swiss Financial Market Supervisory Authority/i);
    fireEvent.change(nameInput, { target: { value: "Swiss Financial Market Supervisory Authority" } });

    const jurisdictionInput = screen.getByPlaceholderText(/e\.g\. Switzerland, Singapore, United States/i);
    fireEvent.change(jurisdictionInput, { target: { value: "Switzerland" } });

    // Submit
    const submitBtn = screen.getByRole("button", { name: /Register Authority/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Registering Authority/i)).toBeInTheDocument();
  });
});
