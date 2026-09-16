import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AdminProvider } from "../../../context/admin-context";
import EditorialCms from "../editorial-cms";

describe("Editorial Content Management & Research Publishing (Screen 10)", () => {
  it("renders editorial CMS with executive metrics, runway cards, and guide preview", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <EditorialCms />
        </AdminProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/EDITORIAL CONTENT MANAGEMENT SYSTEM/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Research Guides, Market Dispatches & Publishing Pipeline/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Published Guides/i)).toBeInTheDocument();
    expect(screen.getByText(/Primary Sources & Citations/i)).toBeInTheDocument();
    expect(screen.getAllByText(/The True Cost of Forex Trading/i).length).toBeGreaterThan(0);
  });

  it("filters guides by search query", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <EditorialCms />
        </AdminProvider>
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search guide title, author, slug/i);
    fireEvent.change(searchInput, { target: { value: "Regulatory License" } });

    expect(screen.getAllByText(/How to Verify a Forex Broker's Regulatory License/i).length).toBeGreaterThan(0);
  });

  it("opens create guide modal and publishes a new research guide", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <EditorialCms />
        </AdminProvider>
      </MemoryRouter>
    );

    const draftBtn = screen.getByRole("button", { name: /Draft New Research Guide/i });
    fireEvent.click(draftBtn);

    expect(screen.getAllByText(/Draft New Research Guide/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Institutional educational publishing workflow/i)).toBeInTheDocument();

    const titleInput = screen.getByPlaceholderText(/e.g. Navigating Negative Balance Protection/i);
    fireEvent.change(titleInput, { target: { value: "Negative Balance Protection Mechanics 2026" } });

    const summaryInput = screen.getByPlaceholderText(/Concise institutional summary/i);
    fireEvent.change(summaryInput, { target: { value: "Analysis of negative balance protection across ESMA and FCA." } });

    const submitBtn = screen.getByRole("button", { name: /Create & Publish Guide/i });
    fireEvent.click(submitBtn);

    // Verify success banner appears
    expect(screen.getAllByText(/Negative Balance Protection Mechanics 2026/i).length).toBeGreaterThan(0);
  });
});
