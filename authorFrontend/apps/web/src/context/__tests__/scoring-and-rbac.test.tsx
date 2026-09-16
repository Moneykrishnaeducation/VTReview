import { describe, it, expect } from "vitest";
import { ROLES, INITIAL_BROKERS } from "../../data/admin-data";
import type { AdminRole, VerificationStatus } from "../../types/admin";

describe("Scoring Model & Mathematical Equivalence Audit", () => {
  // Wireframe point scale: 35, 30, 20, 20, 15 (Total: 120)
  const wireframePillars = [
    { id: "safety", name: "Safety & Regulation", maxPoints: 35, expectedPct: (35 / 120) * 100 },
    { id: "costs", name: "Trading Costs & Spreads", maxPoints: 30, expectedPct: (30 / 120) * 100 },
    { id: "platforms", name: "Platforms & Execution", maxPoints: 20, expectedPct: (20 / 120) * 100 },
    { id: "banking", name: "Deposit & Withdrawal", maxPoints: 20, expectedPct: (20 / 120) * 100 },
    { id: "support", name: "Customer Support & Research", maxPoints: 15, expectedPct: (15 / 120) * 100 },
  ];

  // Canonical Public specification: 30%, 25%, 20%, 10%, 15% (Total: 100%)
  // Canonical 120-Point Exact Mapping: 36, 30, 24, 12, 18 (Total: 120)
  const canonicalPillars = [
    { id: "safety", name: "Safety & Regulation", targetWeightPct: 30, exact120Points: 36 },
    { id: "costs", name: "Trading Costs & Spreads", targetWeightPct: 25, exact120Points: 30 },
    { id: "platforms", name: "Platforms & Execution", targetWeightPct: 20, exact120Points: 24 },
    { id: "banking", name: "Deposit & Withdrawal", targetWeightPct: 10, exact120Points: 12 },
    { id: "support", name: "Customer Support & Research", targetWeightPct: 15, exact120Points: 18 },
  ];

  it("calculates total max points equal to 120 across all pillars", () => {
    const totalWireframe = wireframePillars.reduce((acc, p) => acc + p.maxPoints, 0);
    expect(totalWireframe).toBe(120);

    const totalCanonical = canonicalPillars.reduce((acc, p) => acc + p.exact120Points, 0);
    expect(totalCanonical).toBe(120);
  });

  it("verifies canonical 120-point distribution maps 1:1 to public percentage weights", () => {
    canonicalPillars.forEach((p) => {
      const computedPct = (p.exact120Points / 120) * 100;
      expect(computedPct).toBeCloseTo(p.targetWeightPct, 5);
    });
  });

  it("correctly converts 120-point score to 10.0 institutional scale and 5.0 star rating", () => {
    const testCases = [
      { raw120: 120, expected10: 10.0, expected5: 5.0 },
      { raw120: 114, expected10: 9.5, expected5: 4.75 },
      { raw120: 108, expected10: 9.0, expected5: 4.5 },
      { raw120: 96, expected10: 8.0, expected5: 4.0 },
      { raw120: 60, expected10: 5.0, expected5: 2.5 },
      { raw120: 0, expected10: 0.0, expected5: 0.0 },
    ];

    testCases.forEach(({ raw120, expected10, expected5 }) => {
      const score10 = Number(((raw120 / 120) * 10).toFixed(1));
      const score5 = Number(((raw120 / 120) * 5).toFixed(2));
      expect(score10).toBe(expected10);
      expect(score5).toBe(expected5);
    });
  });
});

describe("RBAC Permissions Matrix Audit across 7 Personas", () => {
  const roles: AdminRole[] = [
    "super_admin",
    "admin",
    "research_analyst",
    "compliance_reviewer",
    "moderator",
    "editorial_manager",
    "support_ops",
  ];

  it("ensures all 7 roles are defined in ROLES", () => {
    expect(ROLES.length).toBe(7);
    const roleIds = ROLES.map((r) => r.id);
    roles.forEach((r) => expect(roleIds).toContain(r));
  });

  it("validates super_admin possesses wildcard permissions", () => {
    const superAdmin = ROLES.find((r) => r.id === "super_admin");
    expect(superAdmin).toBeDefined();
    expect(superAdmin?.permissions).toContain("*");
  });

  it("validates moderator role contains review moderation but not broker rating or settings permissions", () => {
    const moderator = ROLES.find((r) => r.id === "moderator");
    expect(moderator).toBeDefined();
    expect(moderator?.permissions.some((p) => p.includes("reviews"))).toBe(true);
    expect(moderator?.permissions.includes("approve:ratings")).toBe(false);
    expect(moderator?.permissions.includes("settings:edit")).toBe(false);
  });

  it("validates compliance_reviewer role contains license verification permissions", () => {
    const compliance = ROLES.find((r) => r.id === "compliance_reviewer");
    expect(compliance).toBeDefined();
    expect(compliance?.permissions.some((p) => p.includes("licenses"))).toBe(true);
  });
});

describe("Broker License State Transitions Audit", () => {
  const validStatuses: VerificationStatus[] = [
    "verified",
    "pending",
    "rejected",
    "expired",
    "needs_review",
    "unverified",
  ];

  it("validates mock broker licenses conform to valid verification lifecycle states", () => {
    INITIAL_BROKERS.forEach((broker) => {
      broker.licenses.forEach((lic) => {
        expect(validStatuses).toContain(lic.status);
        expect(lic.licenseNumber.length).toBeGreaterThan(0);
        expect(lic.officialRegisterUrl.startsWith("http")).toBe(true);
      });
    });
  });
});
