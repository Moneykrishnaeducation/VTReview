// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import NewsPage from "../news";

describe("NewsPage Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the News Page heading and market ticker", () => {
    render(
      <MemoryRouter>
        <NewsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /Forex & Market News/i })).toBeInTheDocument();
    expect(screen.getByText(/Market Pulse:/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^Economic Calendar$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^Regulator Blacklist$/i })).toBeInTheDocument();
  });

  it("renders category filters and search input", () => {
    render(
      <MemoryRouter>
        <NewsPage />
      </MemoryRouter>
    );

    expect(
      screen.getByPlaceholderText(/Search news, brokers, pairs/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Forex$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Crypto$/i })).toBeInTheDocument();
  });
});
