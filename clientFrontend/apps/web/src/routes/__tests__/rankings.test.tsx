// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Rankings from "../rankings";

describe("Rankings Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders category filters and search input", () => {
    render(
      <MemoryRouter>
        <Rankings />
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: /Top Rated Brokers/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search broker name, country, or regulation/i)).toBeInTheDocument();
    expect(screen.getByText(/Displaying/i)).toBeInTheDocument();
  });

  it("renders scientific methodology section and FAQ", () => {
    render(
      <MemoryRouter>
        <Rankings />
      </MemoryRouter>
    );

    expect(screen.getByText(/How VTINDEX Evaluates & Ranks Brokers/i)).toBeInTheDocument();
    expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument();
  });
});
