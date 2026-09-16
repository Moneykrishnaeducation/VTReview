// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import CommunityConvocation from "../community-convocation";

describe("CommunityConvocation Page", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the hero banner, convocation title, and quick metrics", () => {
    render(
      <MemoryRouter>
        <CommunityConvocation />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/GLOBAL TRADER CONVOCATION & COMMUNITY ASSEMBLY 2026/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /The Global Assembly of Retail Traders/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/48,520\+/i)).toBeInTheDocument();
    expect(screen.getByText(/84 Experts/i)).toBeInTheDocument();
  });

  it("allows switching between Mainstage, Townhall, Speakers, Working Groups, and Charter tabs", () => {
    render(
      <MemoryRouter>
        <CommunityConvocation />
      </MemoryRouter>
    );

    // Switch to Townhall tab
    const townhallTab = screen.getByRole("button", { name: /Community Floor & Townhall/i });
    fireEvent.click(townhallTab);
    expect(screen.getByText(/Submit Question to the General Convocation Floor/i)).toBeInTheDocument();
    expect(screen.getByText(/Live Floor Resolution Vote/i)).toBeInTheDocument();

    // Switch to Speakers tab
    const speakersTab = screen.getByRole("button", { name: /Keynote Speakers/i });
    fireEvent.click(speakersTab);
    expect(screen.getByText(/Sir Arthur Pendelton/i)).toBeInTheDocument();
    expect(screen.getByText(/Dr. Elena Rostova/i)).toBeInTheDocument();

    // Switch to Charter tab
    const charterTab = screen.getByRole("button", { name: /Trader Convocation Charter/i });
    fireEvent.click(charterTab);
    expect(screen.getByText(/The Retail Forex Trader Bill of Rights/i)).toBeInTheDocument();
  });

  it("opens delegate registration modal and confirms booking", () => {
    render(
      <MemoryRouter>
        <CommunityConvocation />
      </MemoryRouter>
    );

    const claimPassBtn = screen.getByRole("button", { name: /Claim Virtual Delegate Pass/i });
    fireEvent.click(claimPassBtn);

    expect(screen.getByText(/Claim Convocation Delegate Pass/i)).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", { name: /Confirm Delegate Registration/i });
    fireEvent.click(confirmBtn);

    expect(screen.getByText(/Delegate Pass Confirmed!/i)).toBeInTheDocument();
  });
});
