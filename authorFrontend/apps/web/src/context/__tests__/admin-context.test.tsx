import React from "react";
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AdminProvider, useAdmin } from "../admin-context";

describe("AdminContext & RBAC System", () => {
  it("initializes with default super_admin role and data stores", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AdminProvider>{children}</AdminProvider>
    );

    const { result } = renderHook(() => useAdmin(), { wrapper });

    expect(result.current.activeRole).toBe("super_admin");
    expect(result.current.brokers.length).toBeGreaterThan(0);
    expect(result.current.regulators.length).toBeGreaterThan(0);
    expect(result.current.evidenceList.length).toBeGreaterThan(0);
    expect(result.current.hasPermission("manage:brokers")).toBe(true);
  });

  it("switches roles dynamically and gates permissions accordingly", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AdminProvider>{children}</AdminProvider>
    );

    const { result } = renderHook(() => useAdmin(), { wrapper });

    act(() => {
      result.current.setActiveRole("research_analyst");
    });

    expect(result.current.activeRole).toBe("research_analyst");
    expect(result.current.activeRoleDef.name).toBe("Research Analyst");
    expect(result.current.hasPermission("edit:ratings")).toBe(true);
    expect(result.current.hasPermission("verify:licenses")).toBe(false);
  });

  it("executes Workflow A: License Verification and logs an immutable audit event", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AdminProvider>{children}</AdminProvider>
    );

    const { result } = renderHook(() => useAdmin(), { wrapper });

    const initialAuditCount = result.current.auditLogs.length;

    act(() => {
      result.current.verifyLicense("VER-2026-001", "Verified against ASIC Connect database.");
    });

    const targetVerification = result.current.verifications.find((v) => v.id === "VER-2026-001");
    expect(targetVerification?.status).toBe("verified");
    expect(result.current.auditLogs.length).toBe(initialAuditCount + 1);
    expect(result.current.auditLogs[0].action).toBe("VERIFY");
  });

  it("executes Workflow B: Rating proposal submission and compliance approval", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AdminProvider>{children}</AdminProvider>
    );

    const { result } = renderHook(() => useAdmin(), { wrapper });

    act(() => {
      result.current.submitRatingProposal({
        brokerId: "brk-vtindex",
        brokerName: "VTIndex",
        pillarId: "safety",
        pillarName: "Safety & Regulation",
        currentScore: 27.0,
        proposedScore: 28.5,
        scoreDelta: 1.5,
        currentTotalRating: 91.8,
        proposedTotalRating: 93.3,
        reason: "Segregated accounts confirmed by Tier-1 audit.",
        evidenceId: "EVD-2026-00481",
        proposedBy: "Elena Rostova",
      });
    });

    const proposal = result.current.ratingProposals[0];
    expect(proposal.brokerName).toBe("VTIndex");
    expect(proposal.status).toBe("pending_review");

    act(() => {
      result.current.approveRatingProposal(proposal.id, "Compliance verified.");
    });

    const updatedProposal = result.current.ratingProposals.find((p) => p.id === proposal.id);
    expect(updatedProposal?.status).toBe("approved");

    const updatedBroker = result.current.brokers.find((b) => b.id === "brk-vtindex");
    expect(updatedBroker?.editorialScore).toBe(93.3);
  });

  it("executes Workflow C: Review moderation", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AdminProvider>{children}</AdminProvider>
    );

    const { result } = renderHook(() => useAdmin(), { wrapper });

    act(() => {
      result.current.moderateReview("rev-8491", "approve", "Statement verified.");
    });

    const review = result.current.reviews.find((r) => r.id === "rev-8491");
    expect(review?.status).toBe("approved");
  });

  it("executes Workflow D: Complaint status update", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AdminProvider>{children}</AdminProvider>
    );

    const { result } = renderHook(() => useAdmin(), { wrapper });

    act(() => {
      result.current.updateComplaintStatus("cmp-2026-090", "broker_contacted", "Dispatched formal inquiry.");
    });

    const complaint = result.current.complaints.find((c) => c.id === "cmp-2026-090");
    expect(complaint?.status).toBe("broker_contacted");
  });
});
