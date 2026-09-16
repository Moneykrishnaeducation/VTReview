export type RankingCategoryId =
  | "top-rated"
  | "safest"
  | "most-popular"
  | "best-forex"
  | "low-deposit"
  | "fast-withdrawal"
  | "copy-trading"
  | "prop-firms";

export interface RankingCategory {
  id: RankingCategoryId;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  badgeText: string;
}

export interface BrokerDimensionScores {
  safety: number; // e.g. 9.8
  fees: number; // e.g. 9.5
  platforms: number; // e.g. 9.6
  support: number; // e.g. 9.4
  withdrawals: number; // e.g. 9.7
}

export interface RankedBroker {
  rank: number;
  id: string;
  name: string;
  slug: string;
  logo: string;
  tagline: string;
  overallScore: number; // e.g. 9.6 / 10
  rating: number; // e.g. 4.9 / 5
  reviewsCount: number;
  established: string;
  headquarters: string;
  countryFlag: string;
  regulatoryStatus: "Tier-1 Regulated" | "Multi-Regulated" | "Verified" | "Regulated";
  regulators: string[]; // e.g. ["FCA", "ASIC", "CySEC"]
  minDeposit: number; // in USD
  maxLeverage: string; // e.g. "1:500"
  eurUsdSpread: string; // e.g. "0.0 pips (Raw)"
  tradingPlatforms: string[]; // e.g. ["MT4", "MT5", "cTrader", "TradingView"]
  withdrawalSpeed: string; // e.g. "Instant - 2 Hours"
  scores: BrokerDimensionScores;
  keyPros: string[];
  bestFor: string;
  websiteUrl: string;
  badgeLabel?: string; // e.g. "Best Overall 2026", "Lowest Spreads", "Top Prop Firm"
  categories: RankingCategoryId[];
}

export interface RankingFilterState {
  category: RankingCategoryId;
  searchQuery: string;
  platform: string;
  regulatorTier: string;
  depositRange: string;
  sortBy: "score" | "rating" | "reviews" | "deposit-low" | "spread-low";
  viewMode: "cards" | "table";
}
