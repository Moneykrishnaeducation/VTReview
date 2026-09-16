# REVIEW-SITE ADMIN — PUBLIC/ADMIN DATA CONTRACT & SCORING AUDIT

**Target:** Public Platform (`clientFrontend/apps/web`) ↔ Research Operations Console (`authorFrontend/apps/web`)  
**Domain:** Financial Broker Directory, 120-Point Quantitative Scoring & Regulatory Compliance  
**Date:** September 16, 2026  
**Auditor:** Principal Financial Data Architect & Systems Engineer  
**Classification:** **HIGH PRIORITY DATA-CONTRACT SPECIFICATION & RECONCILIATION**

---

## 1. CRITICAL SCORING MODEL DISCREPANCY & RECONCILIATION

### 1.1 The Identified Discrepancy
An architectural discrepancy was identified between the public editorial specification and the initial administrative wireframe stepper points:

| Pillar / Evaluation Category | Public Editorial Methodology (`rating-methodology.tsx`) | Initial Admin Wireframe (`score-editor.tsx`) | Implied Wireframe Weight (%) | Discrepancy / Drift |
|---|:---:|:---:|:---:|:---:|
| **1. Safety & Regulation** | **30%** | 35 points | 29.17% | -0.83% |
| **2. Trading Costs & Spreads** | **25%** | 30 points | 25.00% | Exact Match (0.00%) |
| **3. Platforms & Execution** | **20%** | 20 points | 16.67% | -3.33% |
| **4. Deposit & Withdrawal Speed** | **10%** | 20 points | 16.67% | **+6.67%** (Overweighted) |
| **5. Customer Support & Research** | **15%** | 15 points | 12.50% | -2.50% |
| **TOTAL** | **100%** | **120 points** | **100.00%** | — |

### 1.2 Impact Analysis
1. **Risk of Rating Drift:** If a broker has high Deposit/Withdrawal capabilities (e.g. 20/20) but mediocre Platforms (e.g. 10/20), the wireframe calculation would award them a higher overall score than the public 30/25/20/10/15 methodology prescribes.
2. **Authoritative Specification:** `Struture.md`, `wireframes_and_ux_system.md`, and `clientFrontend/apps/web/src/routes/rating-methodology.tsx` define the canonical public editorial weighting standard (30% / 25% / 20% / 10% / 15%).

### 1.3 The Canonical 120-Point Exact Mapping Formula
To preserve the 120-point granular evaluation framework while achieving **100.00% mathematical parity** with the public 30/25/20/10/15 weighting, the exact points per category are reconciled as follows:

$$\text{Pillar Points} = 120 \times \text{Weight Percentage}$$

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        CANONICAL 120-POINT RECONCILED ALLOCATION                       │
├──────────────────────────────────┬───────────────┬──────────────┬──────────────────────┤
│ Evaluation Pillar                │ Public Weight │ Max Points   │ Formula Proof        │
├──────────────────────────────────┼───────────────┼──────────────┼──────────────────────┤
│ 1. Safety & Regulation           │ 30%           │ 36.0 pts     │ 120 × 0.30 = 36.0    │
│ 2. Trading Costs & Spreads       │ 25%           │ 30.0 pts     │ 120 × 0.25 = 30.0    │
│ 3. Platforms & Execution         │ 20%           │ 24.0 pts     │ 120 × 0.20 = 24.0    │
│ 4. Deposit & Withdrawal Speed    │ 10%           │ 12.0 pts     │ 120 × 0.10 = 12.0    │
│ 5. Customer Support & Research   │ 15%           │ 18.0 pts     │ 120 × 0.15 = 18.0    │
├──────────────────────────────────┼───────────────┼──────────────┼──────────────────────┤
│ TOTAL                            │ 100%          │ 120.0 pts    │ 120 × 1.00 = 120.0   │
└──────────────────────────────────┴───────────────┴──────────────┴──────────────────────┘
```

### 1.4 Rating Normalization Functions

```typescript
// Canonical Score Conversion Engine
export function calculateOverallRating(p: {
  safety: number;   // 0 - 36
  costs: number;    // 0 - 30
  platforms: number;// 0 - 24
  banking: number;  // 0 - 12
  support: number;  // 0 - 18
}): {
  total120: number;
  score10: number;
  starRating5: number;
  trustScore100: number;
} {
  const total120 = p.safety + p.costs + p.platforms + p.banking + p.support;
  const normalizedFraction = total120 / 120.0;
  
  return {
    total120: Number(total120.toFixed(1)),
    score10: Number((normalizedFraction * 10.0).toFixed(1)),
    starRating5: Number((normalizedFraction * 5.0).toFixed(2)),
    trustScore100: Math.round(normalizedFraction * 100),
  };
}
```

---

## 2. DOMAIN ENTITY COMPATIBILITY MATRIX

| Domain Model | Public Entity (`clientFrontend`) | Admin Entity (`authorFrontend`) | Contract Status | Harmonization Requirement |
|---|---|---|:---:|---|
| **Broker Identity** | `Broker` (`broker-directory-data.ts`) | `BrokerAdmin` (`types/admin.ts`) | 🟢 Compatible | Public uses flat summary metrics; Admin adds `publishingStatus`, `verificationStatus`, `legalEntity`, and `verifiedBy`. |
| **Regulation & License** | `RegulatoryLicense` | `BrokerLicenseAdmin` | 🟢 Compatible | Admin extends with `evidenceId`, `verifiedAt`, `verifiedBy`, and granular `tier: "Tier-1" \| "Tier-2" \| "Tier-3" \| "Unregulated"`. |
| **User Reviews** | `UserReview` | `ReviewModerationItem` | 🟢 Compatible | Admin introduces moderation fields: `moderationStatus: "pending" \| "approved" \| "flagged" \| "spam"`, `ipAddress`, and `sentiment`. |
| **Trader Disputes** | Not exposed directly (community reviews) | `ComplaintAdmin` | 🟢 Compatible | Admin models formal dispute arbitration lifecycle (`NEW` → `UNDER_REVIEW` → `RESOLVED` / `DISMISSED`) with claimed amounts and chronological timelines. |
| **Evidence Records** | N/A (implicit register URLs) | `EvidenceItem` | 🟢 Compatible | SHA-256 hash-backed evidence records linking certificates, register URLs, and screenshots to specific broker licenses. |
| **Audit Log Entries** | N/A | `AuditLogEntry` | 🟢 Compatible | Immutable changelog format capturing actor, role, entity, action, pre-state diff, post-state diff, and timestamp. |

---

## 3. UNIFIED BACKEND API DTO SPECIFICATION

To ensure seamless production API integration between `apps/web` and the Admin backend service, the following canonical JSON schemas are established:

### 3.1 Broker Published Read DTO (`GET /api/v1/brokers/:slug`)
```json
{
  "id": "pepperstone",
  "slug": "pepperstone",
  "name": "Pepperstone",
  "legalEntity": "Pepperstone Group Ltd",
  "foundedYear": 2010,
  "hqCountry": "Melbourne, Australia",
  "trustScore": 99,
  "editorialRating": 4.9,
  "score10": 9.8,
  "ratingsBreakdown": {
    "safety": 35.5,
    "costs": 29.5,
    "platforms": 23.5,
    "banking": 11.8,
    "support": 17.5,
    "maxPoints": 120.0
  },
  "licenses": [
    {
      "regulatorCode": "ASIC",
      "regulatorName": "Australian Securities and Investments Commission",
      "licenseNumber": "414530",
      "tier": "Tier-1",
      "status": "verified",
      "verifiedAt": "2026-09-01T10:00:00Z",
      "officialRegisterUrl": "https://connectonline.asic.gov.au"
    }
  ]
}
```

### 3.2 Admin Rating Change Proposal DTO (`POST /api/v1/admin/ratings/proposals`)
```json
{
  "brokerId": "pepperstone",
  "proposedBy": "usr-analyst-1",
  "reason": "Audited Q3 live ECN spreads and verified updated ASIC capital disclosures.",
  "evidenceIds": ["ev-asic-414530", "ev-spreads-q3-2026"],
  "previousScore120": 115.0,
  "proposedScore120": 117.8,
  "pillarScores": {
    "safety": 35.5,
    "costs": 29.5,
    "platforms": 23.5,
    "banking": 11.8,
    "support": 17.5
  }
}
```

---

## 4. RESOLUTION & SIGN-OFF
- The canonical 120-point breakdown ($36 / 30 / 24 / 12 / 18$) is verified as mathematically exact.
- Both public and admin interfaces are structured to ingest and emit this harmonized model without data drift.
