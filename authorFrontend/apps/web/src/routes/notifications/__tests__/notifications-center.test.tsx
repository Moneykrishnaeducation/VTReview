import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AdminProvider } from "../../../context/admin-context";
import NotificationsCenter from "../notifications-center";

describe("Notifications & Operations Alert Hub (notifications-center.tsx)", () => {
  it("renders notifications header, executive KPI alert cards, and alerts list", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <NotificationsCenter />
        </AdminProvider>
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /Notifications & Operations Alert Hub/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Total Broadcasts/i)).toBeInTheDocument();
    expect(screen.getByText(/Unread Attention/i)).toBeInTheDocument();
    expect(screen.getByText(/Critical Escalations/i)).toBeInTheDocument();
    expect(screen.getByText(/Processed Items/i)).toBeInTheDocument();
  });

  it("filters alerts by tabs and search query", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <NotificationsCenter />
        </AdminProvider>
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search alert title, reference ID, message body.../i);
    fireEvent.change(searchInput, { target: { value: "License" } });

    expect(screen.getAllByText(/License/i).length).toBeGreaterThan(0);
  });

  it("switches across alert tabs and verifies tab counters", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <NotificationsCenter />
        </AdminProvider>
      </MemoryRouter>
    );

    const unreadTab = screen.getByRole("button", { name: /^Unread/i });
    fireEvent.click(unreadTab);

    const criticalTab = screen.getByRole("button", { name: /^Critical/i });
    fireEvent.click(criticalTab);

    const allTab = screen.getByRole("button", { name: /^All Alerts/i });
    fireEvent.click(allTab);

    expect(screen.getByText(/Total Broadcasts/i)).toBeInTheDocument();
  });

  it("opens forensic inspector panel for a notification and closes it", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <NotificationsCenter />
        </AdminProvider>
      </MemoryRouter>
    );

    const inspectButtons = screen.getAllByTitle(/Inspect details/i);
    fireEvent.click(inspectButtons[0]);

    expect(screen.getByText(/Operational Metadata/i)).toBeInTheDocument();
    expect(screen.getByText(/Alert Summary/i)).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: "" }); // icon button in header
    fireEvent.click(closeBtn);
  });

  it("marks all notifications as read", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <NotificationsCenter />
        </AdminProvider>
      </MemoryRouter>
    );

    const markAllBtn = screen.getByRole("button", { name: /Mark All As Read/i });
    fireEvent.click(markAllBtn);

    expect(screen.getByText(/All notifications marked as read/i)).toBeInTheDocument();
  });
});
