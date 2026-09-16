import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AdminProvider } from "../../context/admin-context";
import { AdminHeader } from "../admin-header";

describe("AdminHeader Navigation Bar", () => {
  it("renders header with search trigger, role switcher, notification bell, and user avatar", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <AdminHeader isSidebarCollapsed={false} />
        </AdminProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Search brokers, licenses, users/i)).toBeInTheDocument();
    expect(screen.getByText(/Super Admin/i)).toBeInTheDocument();
    expect(screen.getByText(/Marcus Vance/i)).toBeInTheDocument();
  });

  it("opens the role simulator menu on click", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <AdminHeader isSidebarCollapsed={false} />
        </AdminProvider>
      </MemoryRouter>
    );

    const roleBtn = screen.getByTitle(/Switch Simulated Administrative Role/i);
    fireEvent.click(roleBtn);

    expect(screen.getByText(/Simulate Operational Role/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Compliance Reviewer/i).length).toBeGreaterThan(0);
  });

  it("opens the notifications dropdown menu on click", () => {
    render(
      <MemoryRouter>
        <AdminProvider>
          <AdminHeader isSidebarCollapsed={false} />
        </AdminProvider>
      </MemoryRouter>
    );

    const notifBtn = screen.getByTitle(/Notifications & System Alerts/i);
    fireEvent.click(notifBtn);

    expect(screen.getByText(/Alerts & Notifications/i)).toBeInTheDocument();
  });
});
