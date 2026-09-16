/**
 * Core Domain Models for Review-Site
 * Independent Forex Broker Review, Comparison & Discovery Platform
 */

export type RegulatoryTier = 1 | 2 | 3 | "Offshore" | "Unregulated";

export interface BrokerRegulationRecord {
  regulator: string;
  tier: 1 | 2 | 3;
  jurisdiction: string;
  licenseNumber: string;
  entityName: string;
  registerUrl: string;
  verifiedAt: string; // ISO 8601 string or Date format
  isVerified: boolean;
  compensationScheme?: {
    available: boolean;
    name?: string;
    maxCoverage?: string;
  };
}

export interface RatingPillars {
  safety: number;     // 30% weight
  costs: number;      // 25% weight
  platforms: number;  // 20% weight
  support: number;    // 15% weight
  banking: number;    // 10% weight
}

export interface AccountTypeSpec {
  name: string;
  minDeposit: string;
  spreadFrom: string;
  commission: string;
  leverageMax: string;
  bestFor: string;
  executionModel: "Raw ECN" | "STP / Direct Market Access" | "Market Maker (Dealing Desk)" | "Hybrid";
  swapFreeAvailable: boolean;
}

export interface SpreadMeasurement {
  pair: string;
  rawSpread: string;
  standardSpread: string;
  commission: string;
  typicalAllInCost: string;
  lastRecordedAt?: string;
}

export interface ReviewEvidence {
  id: string;
  type: "account_statement" | "trade_ticket" | "deposit_receipt" | "withdrawal_receipt";
  verifiedAt?: string;
  status: "pending_audit" | "verified" | "rejected";
}

export interface BrokerUserReview {
  id: string;
  brokerId: string;
  author: string;
  country: string;
  rating: number; // 1 to 5
  headline: string;
  review: string;
  date: string;
  experience: "Beginner (<1yr)" | "Intermediate (1-3yrs)" | "Advanced (3+ yrs)" | "Institutional";
  platform: string;
  verifiedLiveAccount: boolean;
  evidence?: ReviewEvidence;
  helpfulCount: number;
  brokerResponse?: {
    author: string;
    date: string;
    message: string;
  };
}

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

export interface BrokerDomainModel {
  id: string;
  slug: string;
  name: string;
  logoText: string;
  logoUrl?: string;
  affiliateUrl: string;
  hq: string;
  founded: number;
  parentCompany: string;
  primaryLicense: string;
  
  // Dual-score separation
  editorialRating: number;   // Calculated out of 5.0 (from 120-point algorithmic framework)
  editorialScore100: number; // Normalized to 100
  editorialClass: "Exceptional" | "Superior" | "High Trust" | "Average" | "High Risk";
  userRating: number;        // Community star rating (1.0 - 5.0)
  reviewCount: number;

  // Key Trading Specs
  eurUsdSpread: number;
  minDeposit: number;
  minDepositFormatted: string;
  commissionPerLot: number;
  maxLeverageRetail: string;
  maxLeveragePro: string;
  executionModel: "ECN / STP" | "DMA / ECN" | "Market Maker / STP" | "Direct Market Access";
  executionSpeedMs: number;
  slippagePositivePct: number;
  platforms: string[];
  tradableMarketsCount: number;
  inactivityFee: string;
  categoryBadges: string[];
  bestForSummary: string[];
  notIdealForSummary: string[];
  verdictSummary: string;
  pros: string[];
  cons: string[];
  factCheckedDate: string;
  isRegulatedTier1: boolean;

  // Sub-structures
  ratingsBreakdown: RatingPillars;
  regulations: BrokerRegulationRecord[];
  spreadsTable: SpreadMeasurement[];
  accountTypes: AccountTypeSpec[];
  userReviews: BrokerUserReview[];
  faqs: FaqItem[];
}
