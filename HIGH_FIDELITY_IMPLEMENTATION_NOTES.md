# Review-Site — High-Fidelity Implementation Notes

**Domain:** Forex Broker Review, Comparison & Discovery Platform  
**Target Codebase:** `apps/web`  
**Date:** September 2026  

---

## 1. Architecture & File Structure Overview

The high-fidelity implementation in `apps/web` builds directly upon the validated mid-fidelity prototype architecture, refining styling, typography, component reusability, and trust primitives across all 14 screens.

### 1.1 Key File Manifest
- **Design Tokens & Theme:** [`apps/web/src/index.css`](file:///C:/VTReview/apps/web/src/index.css)
- **High-Fidelity Research Components:** [`apps/web/src/components/ui/wireframe-components.tsx`](file:///C:/VTReview/apps/web/src/components/ui/wireframe-components.tsx)
- **Global Header & Mega Menus:** [`apps/web/src/components/global-header.tsx`](file:///C:/VTReview/apps/web/src/components/global-header.tsx)
- **Global Footer & Disclosures:** [`apps/web/src/components/global-footer.tsx`](file:///C:/VTReview/apps/web/src/components/global-footer.tsx)
- **Sticky Comparison Dock:** [`apps/web/src/components/sticky-comparison-tray.tsx`](file:///C:/VTReview/apps/web/src/components/sticky-comparison-tray.tsx)
- **Design System Benchmark Screen:** [`apps/web/src/routes/broker-review-detail.tsx`](file:///C:/VTReview/apps/web/src/routes/broker-review-detail.tsx)
- **Comparison Engine Screen:** [`apps/web/src/routes/comparison-builder.tsx`](file:///C:/VTReview/apps/web/src/routes/comparison-builder.tsx)
- **Broker Directory & Filters:** [`apps/web/src/routes/broker-directory.tsx`](file:///C:/VTReview/apps/web/src/routes/broker-directory.tsx)
- **Guided Finder Wizard:** [`apps/web/src/routes/broker-finder-wizard.tsx`](file:///C:/VTReview/apps/web/src/routes/broker-finder-wizard.tsx)
- **Tools & Quantitative Calculators:** [`apps/web/src/routes/tools-dashboard.tsx`](file:///C:/VTReview/apps/web/src/routes/tools-dashboard.tsx)

---

## 2. Key High-Fidelity Engineering Decisions

### 2.1 Tabular Numerals & Monospace Discipline
Financial figures—such as spreads (`0.1 pips`), commissions (`$6.00/lot`), leverage (`1:30`), and registration numbers (`#583261`)—now use `.tabular-nums` (`font-variant-numeric: tabular-nums`). This prevents jitter in dynamically updating tables and improves vertical column scanning.

### 2.2 Strict Editorial vs Community Separation
In accordance with institutional financial research standards, the editorial score (derived algorithmically from 120 criteria) is isolated into a separate card component (`ScoreCardDual`) alongside verified user reviews. This guarantees users never mistake commercial or aggregated opinion for independent technical audits.

### 2.3 Difference Highlighting in Comparison Matrix
The Comparison Builder features an active diff engine with amber tinting across differing values, allowing users to scan 40+ broker metrics in seconds without missing subtle variations in execution model or overnight swap rates.

### 2.4 Mobile Ergonomics
On mobile devices (`<768px`), all long-form pages include persistent sticky bottom action bars, providing immediate access to `[Visit Broker ↗]` and `[+ Compare]` without obstructing content or forcing repetitive scrolling.

---

## 3. Build & Test Verification

- **Vite / Rolldown Build:** Passed with 0 errors (output bundles `dist/assets/index-*.js`, `dist/assets/index-*.css`).
- **Vitest Unit & Integration Suites:** 100% tests passing across route components.
- **TypeScript:** Strict type compliance with zero unresolved type diagnostics.
