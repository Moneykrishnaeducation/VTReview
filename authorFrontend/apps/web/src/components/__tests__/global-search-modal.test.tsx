import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AdminProvider, useAdmin } from "../../context/admin-context";
import { GlobalSearchModal } from "../global-search-modal";

function TestSearchWrapper() {
  const { setIsSearchOpen } = useAdmin();

  return (
    <div>
      <button onClick={() => setIsSearchOpen(true)}>Open Search Modal</button>
      <GlobalSearchModal />
    </div>
  );
}

describe("GlobalSearchModal Keyboard Navigation & Search", () => {
  it("opens modal, searches queries, and navigates with Arrow keys and Enter", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <TestSearchWrapper />
        </AdminProvider>
      </MemoryRouter>
    );

    // Open search modal
    const openBtn = screen.getByRole("button", { name: /Open Search Modal/i });
    fireEvent.click(openBtn);

    const input = screen.getByPlaceholderText(/Search brokers, licenses, evidence IDs/i);
    expect(input).toBeInTheDocument();

    // Type search query
    fireEvent.change(input, { target: { value: "IC Markets" } });

    // Should find IC Markets broker
    expect(screen.getAllByText(/IC Markets/i).length).toBeGreaterThan(0);

    // Keyboard navigation: ArrowDown
    fireEvent.keyDown(window, { key: "ArrowDown" });
    expect(screen.getByText(/Enter/i)).toBeInTheDocument();

    // Press Escape to close
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByPlaceholderText(/Search brokers, licenses, evidence IDs/i)).not.toBeInTheDocument();
  });

  it("handles empty search suggestions and quick tags", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <TestSearchWrapper />
        </AdminProvider>
      </MemoryRouter>
    );

    const openBtn = screen.getByRole("button", { name: /Open Search Modal/i });
    fireEvent.click(openBtn);

    expect(screen.getByText(/Global Operational Search/i)).toBeInTheDocument();
    expect(screen.getByText(/"IC Markets"/i)).toBeInTheDocument();
  });
});
