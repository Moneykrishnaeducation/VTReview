# Review-Site — High-Fidelity UI Design System

**Domain:** Independent Forex Broker Review, Comparison & Discovery Platform  
**Target Codebase:** `apps/web`  
**Version:** 1.0 (Production-Ready High-Fidelity Specification)  
**Date:** September 2026  

---

## 1. Core Design Principles

Review-Site is engineered around one inviolable product principle:

> **Independent financial research first. Broker discovery second. Monetization third.**

### 1.1 Brand Perception Attributes
- **Independent:** Relies on verifiable regulatory records, mathematical scoring formulas, and audited spread measurements.
- **Analytical & Evidence-Driven:** All ratings are accompanied by data points, testing dates, and calculation transparency.
- **Institutional Rigor:** Clean, uncluttered editorial layouts that feel like a serious research portal (e.g., Morningstar, FT Alphaville, BrokerChooser) rather than a retail trading terminal or casino-style affiliate wall.
- **Accessible & Transparent:** Clear, scannable hierarchies that novice traders can understand without losing depth for institutional or algorithmic traders.

---

## 2. Typography System

The typography system is engineered for dual modes: **deep editorial reading** and **rapid financial data scanning**.

### 2.1 Font Families
- **Primary Body & Display:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, `sans-serif`
- **Tabular Numerals & Monospace:** `JetBrains Mono`, `SF Mono`, `Menlo`, `Consolas`, `monospace` (enforces `font-variant-numeric: tabular-nums` for all financial figures, spreads, leverage ratios, and license numbers).

### 2.2 Scale & Hierarchy

| Role | Class / Size | Weight | Tracking / Leading | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display / Hero H1** | `text-3xl md:text-5xl` (30–48px) | `font-black` (900) | `tracking-tight leading-tight` | Hero headlines, major landing banners |
| **Section H1 / Title** | `text-2xl md:text-3xl` (24–30px) | `font-black` (900) | `tracking-tight leading-snug` | Broker review title, directory header |
| **Sub-section H2** | `text-lg md:text-xl` (18–20px) | `font-extrabold` (800) | `tracking-tight leading-normal` | Assessment sections, methodology pillars |
| **Card Header H3** | `text-sm md:text-base` (14–16px) | `font-bold` (700) | `tracking-normal leading-snug` | Broker card names, widget titles |
| **Eyebrow / Category** | `text-[10px]` to `text-[11px]` (10–11px) | `font-bold` (700) | `uppercase tracking-wider` | Section category tags, rating labels |
| **Body Standard** | `text-xs md:text-sm` (12–14px) | `font-normal` (400) / `font-medium` (500) | `leading-relaxed` | Editorial text, summaries, descriptions |
| **Data / Numeric** | `text-xs md:text-sm tabular-nums` | `font-bold` (700) / `font-black` (900) | `tracking-tight` | Spreads (0.1 pips), deposits ($0), commissions |
| **Microcopy / Legal** | `text-[10px]` to `text-[11px]` | `font-normal` (400) | `leading-normal text-muted-foreground` | Risk disclosures, last-checked timestamps |

---

## 3. Color Architecture & Semantic Palettes

The color system utilizes a neutral, high-contrast palette with strictly controlled functional accents. Color is never used as the sole conveyor of state.

### 3.1 Core Neutrals & Elevation
- **Background (`--background`):** `#F8FAFC` (Light Slate) / `#090D16` (Dark Obsidian)
- **Card Surface (`--card`):** `#FFFFFF` (Crisp White) / `#0F172A` (Deep Slate)
- **Sub-Surface (`--secondary` / `--muted`):** `#F1F5F9` (Subtle Slate) / `#1E293B` (Elevated Slate)
- **Borders (`--border`):** `#E2E8F0` / `#334155`
- **Text Primary (`--foreground`):** `#0F172A` / `#F8FAFC`
- **Text Secondary (`--muted-foreground`):** `#64748B` / `#94A3B8`

### 3.2 Semantic Financial Research Accents

```css
/* Tier-1 Regulatory Trust (FCA, ASIC, CySEC) */
--tier1-reg: #047857;          /* Emerald 700 */
--tier1-reg-bg: #ecfdf5;       /* Emerald 50 */
--tier1-reg-border: #6ee7b7;   /* Emerald 300 */

/* Tier-2 / Regional Oversight */
--tier2-reg: #b45309;          /* Amber 700 */
--tier2-reg-bg: #fffbeb;       /* Amber 50 */
--tier2-reg-border: #fde68a;   /* Amber 200 */

/* Mandatory Risk Warning / Offshore / High Risk */
--risk-warning: #be123c;       /* Rose 700 */
--risk-warning-bg: #fff1f2;    /* Rose 50 */
--risk-warning-border: #fecdd3;/* Rose 200 */

/* Editorial Research Primary */
--editorial-accent: #1d4ed8;   /* Blue 700 */
--editorial-accent-bg: #eff6ff;/* Blue 50 */

/* Score & Rating Badge */
--score-badge: #d97706;        /* Amber 600 */
--score-badge-bg: #fffbeb;     /* Amber 50 */
```

---

## 4. Trust Visual Language & Badging

Trust is a first-class component primitive in Review-Site.

### 4.1 Badge Tokens & Specifications

1. **`TrustBadge [variant="verified"]`**
   - Icon: `CheckCircle2` (Emerald 600)
   - Label: `Verified License FCA #583261`
   - Treatment: `#ecfdf5` background, `#a7f3d0` border, `#065f46` text.
2. **`TrustBadge [variant="tier1"]`**
   - Icon: `ShieldCheck` (Emerald 600)
   - Label: `Tier-1 Supervised`
   - Treatment: `#ecfdf5` background, `#6ee7b7` border, `#047857` text.
3. **`TrustBadge [variant="tier2"]`**
   - Icon: `AlertTriangle` (Amber 600)
   - Label: `Tier-2 Oversight`
   - Treatment: `#fffbeb` background, `#fde68a` border, `#b45309` text.
4. **`TrustBadge [variant="tested"]`**
   - Icon: `FileCheck2` (Blue 600)
   - Label: `Audited Real Spreads (0.1 p)`
   - Treatment: `#f1f5f9` background, `#e2e8f0` border, `#334155` text.
5. **`SampleDataNotice`**
   - Icon: `Info` (Slate 400)
   - Role: Institutional disclosure that prototype numbers represent sample data for interface evaluation.

---

## 5. Score Visualization & Rating Architecture

To protect research credibility, **Editorial Scores** and **Community User Ratings** are never conflated into a single ambiguous number.

```
+-------------------------------------------------------------------------------+
| DUAL SCORE SEPARATION ARCHITECTURE                                           |
+------------------------------------+------------------------------------------+
| 1. EDITORIAL SCORE (120-Point Alg)  | 2. TRADER RATING (Verified Community)   |
| [Award Icon]                       | [Users Icon]                             |
| ★ 4.9 / 5.0                        | ★ 4.7 / 5.0                              |
| Class: Exceptional (Tier-1 Leader) | 2,480 Verified Trader Reviews            |
| "Mathematical 5-Pillar Evaluation" | "Audited Proof-of-Account Submissions"   |
+------------------------------------+------------------------------------------+
```

### 5.1 Five Evaluation Pillars & Weightings
- **Safety & Regulation (30% weight):** Tier-1 licensing, negative balance protection, client fund segregation in Tier-1 banks, FSCS/ICF compensation schemes.
- **Trading Costs & Spreads (25% weight):** Live audited spread tests across EUR/USD, GBP/USD, gold, commission rates, and overnight financing fees.
- **Platforms & Execution (20% weight):** Sub-50ms execution speed, positive slippage %, TradingView integration, MT4/MT5/cTrader support.
- **Deposit & Withdrawal (10% weight):** Zero funding fees, same-day withdrawal processing times.
- **Customer Support (15% weight):** 24/5 responsive live chat, telephone support, multilingual helpdesks.

---

## 6. Action & CTA Hierarchy

Affiliate actions and conversion triggers remain strictly subordinate to independent research data.

| CTA Level | Action Pattern | Visual Treatment | Example |
| :--- | :--- | :--- | :--- |
| **Primary** | Major Conversion Trigger | Deep Slate / Dark Navy (`bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900`) | `Visit Broker ↗`, `Launch Finder Wizard` |
| **Secondary** | Direct Comparative Research | Clear Border (`border border-slate-300 dark:border-slate-700 hover:bg-slate-100`) | `+ Add to Compare`, `Read Full Review` |
| **Tertiary** | Secondary Navigation | Subtle Ghost / Text Link (`text-blue-600 hover:underline`) | `View Methodology →`, `Register Lookup` |

---

## 7. Component Library Catalog

All components in `apps/web/src/components/ui/` adhere to high-fidelity reusability standards:

1. **`GlobalHeader`:** Sticky top utility bar with advertiser disclosure modal, brand mark, instant global search typeahead with keyboard navigation, and responsive mega menus.
2. **`GlobalFooter`:** 5-column complete platform directory, regulatory risk notices, sample data notice, and copyright index.
3. **`BrokerResultCard`:** Standardized listing card with logo identity, verified badge, 4-metric grid, verdict summary, comparison checkbox, and primary/secondary CTAs.
4. **`ScoreCardDual`:** Side-by-side editorial vs community score visualizer.
5. **`RatingBreakdownBars`:** 5-pillar mathematical bar charts with percentage widths and descriptive notes.
6. **`ProsConsGrid`:** Segmented Emerald Advantages and Rose Drawbacks cards.
7. **`FaqAccordion`:** Accessible question-and-answer accordions with smooth chevron states.
8. **`StickyComparisonTray`:** Persistent bottom dock showing selected brokers with instant launch trigger.
9. **`MobileStickyActionBar`:** Touch-optimized bottom bar on mobile viewports for broker detail pages.

---

## 8. Viewport & Responsive Design Rules

| Breakpoint | Width | Layout Strategy | Table Strategy |
| :--- | :--- | :--- | :--- |
| **Desktop Max** | 1440px | 1240px centered container, 12-col grid | Full 8+ col tabular grid |
| **Desktop Std** | 1240px | 8:4 main-content / sticky sidebar split | Full 8+ col tabular grid |
| **Small Desktop** | 1024px | 2-col grids, responsive filter drawer triggers | 6-col scrollable table |
| **Tablet Portrait** | 768px | Single/2-col stacked layout, collapsible filters | Horizontal scroll with fixed first col |
| **Mobile Standard** | 390px | 100% width vertical card stack, 44px+ tap targets | Card reflow mode, sticky bottom CTA bar |
| **Small Mobile** | 375px | Compact padding (`px-3`), zero horizontal overflow | Card reflow mode, compact button group |

---

## 9. Accessibility & Standards Compliance

- **Contrast Ratios:** All text combinations exceed WCAG 2.1 AA minimums (4.5:1 for body text, 3:1 for large text).
- **Focus Rings:** Clear `focus-visible:ring-2 focus-visible:ring-blue-600` keyboard navigation indicators across all interactive elements.
- **Reduced Motion:** Fully compatible with `prefers-reduced-motion: reduce`.
- **Semantic DOM:** Strict adherence to `<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<footer>`, and `<table aria-label="...">` markup.
