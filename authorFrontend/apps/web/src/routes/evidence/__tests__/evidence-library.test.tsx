import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AdminProvider } from "../../../context/admin-context";
import EvidenceLibrary from "../evidence-library";

describe("Evidence Library & Digital Audit Vault (Screen 06)", () => {
  it("renders the evidence library with vault header, broker filter, and evidence cards", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <EvidenceLibrary />
        </AdminProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Evidence Library & Digital Audit Vault/i)).toBeInTheDocument();
    expect(screen.getByText(/CENTRAL EVIDENCE VAULT & IMMUTABLE REGISTRY/i)).toBeInTheDocument();
    expect(screen.getByText(/All Brokers/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload New Evidence/i)).toBeInTheDocument();
  });

  it("filters evidence by selecting a specific broker", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <EvidenceLibrary />
        </AdminProvider>
      </MemoryRouter>
    );

    const selectElements = screen.getAllByRole("combobox");
    const brokerDropdown = selectElements[0]; // First dropdown is broker selector

    // Change broker filter to Pepperstone
    fireEvent.change(brokerDropdown, { target: { value: "Pepperstone" } });

    expect(screen.getByText(/Broker: Pepperstone/i)).toBeInTheDocument();
    expect(screen.getByText(/Clear all filters/i)).toBeInTheDocument();
  });

  it("opens the elevated upload modal and allows uploading new evidence", async () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <EvidenceLibrary />
        </AdminProvider>
      </MemoryRouter>
    );

    // Click Upload New Evidence button
    const uploadBtn = screen.getByRole("button", { name: /Upload New Evidence/i });
    fireEvent.click(uploadBtn);

    // Verify modal elements
    expect(screen.getByText(/Ingest New Evidence Document/i)).toBeInTheDocument();
    expect(screen.getByText(/SHA-256 IMMUTABLE INGESTION PIPELINE/i)).toBeInTheDocument();
    expect(screen.getByText(/Seal & Ingest Evidence/i)).toBeInTheDocument();

    // Fill in title
    const titleInput = screen.getByPlaceholderText(/e\.g\. FCA Register Screenshot for IC Markets UK/i);
    fireEvent.change(titleInput, { target: { value: "ASIC License Snapshot Test" } });

    // Click submit
    const submitBtn = screen.getByRole("button", { name: /Seal & Ingest Evidence/i });
    fireEvent.click(submitBtn);

    // Modal triggers submission
    expect(screen.getByText(/Ingesting & Sealing/i)).toBeInTheDocument();
  });
});
