export type AdminRole =
  | "super_admin"
  | "admin"
  | "research_analyst"
  | "compliance_reviewer"
  | "moderator"
  | "editorial_manager"
  | "support_ops";

export interface RoleDefinition {
  id: AdminRole;
  name: string;
  description: string;
  badgeColor: string;
  permissions: string[];
}

export type VerificationStatus = "verified" | "pending" | "rejected" | "expired" | "needs_review" | "unverified";
export type PublishingStatus = "draft" | "in_review" | "fact_checked" | "compliance_approved" | "scheduled" | "published" | "archived";
export type RegulationTier = "Tier-1" | "Tier-2" | "Tier-3" | "Unregulated";
export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface BrokerLicenseAdmin {
  id: string;
  regulatorCode: string;
  regulatorName: string;
  jurisdiction: string;
  tier: RegulationTier;
  licenseNumber: string;
  licenseeEntity: string;
  status: VerificationStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  officialRegisterUrl: string;
  evidenceId?: string;
  compensationScheme?: string;
  maxLeverage: string;
  negativeBalanceProtection: boolean;
  segregatedAccounts: boolean;
}

export interface RatingPillarBreakdown {
  pillarId: string;
  name: string;
  weightPercentage: number;
  maxPoints: number;
  score: number;
  evidenceIds: string[];
  notes: string;
  metrics: {
    key: string;
    label: string;
    value: string | number;
    benchmarkScore: number;
  }[];
}

export interface BrokerAccountType {
  id: string;
  name: string;
  minDeposit: number;
  spreadFrom: number;
  commission: number;
  maxLeverage: string;
  executionType: string;
  currencies: string[];
}

export interface BrokerAdmin {
  id: string;
  slug: string;
  name: string;
  legalEntity: string;
  logo: string;
  website: string;
  foundedYear: number;
  hqCountry: string;
  status: "active" | "draft" | "suspended" | "archived";
  verificationStatus: VerificationStatus;
  publishingStatus: PublishingStatus;
  lastVerifiedDate: string;
  verifiedBy: string;
  
  // Regulation
  primaryRegulator: string;
  tier: RegulationTier;
  licenses: BrokerLicenseAdmin[];
  
  // Ratings
  editorialScore: number; // 0 - 100 or 0 - 120 scale
  starRating: number; // 0 - 5.0
  communityScore: number;
  reviewCount: number;
  complaintCount: number;
  pillars: RatingPillarBreakdown[];
  
  // Trading Specs
  eurUsdSpread: number;
  gbpUsdSpread: number;
  commissionPerLot: number;
  allInCostEurUsd: number;
  minDeposit: number;
  maxLeverage: string;
  executionModel: "ECN/STP" | "STP" | "Market Maker" | "DMA/ECN" | "Hybrid";
  platforms: string[];
  depositMethods: string[];
  tradableAssetsCount: number;

  // Platforms & Latency Extras
  executionSpeedMs?: number;
  dataCenterLocation?: string;
  vpsAvailable?: boolean;
  copyTradingSupported?: boolean;
  fixApiSupported?: boolean;

  // Account Types
  accountTypes?: BrokerAccountType[];
  
  // Editorial & SEO
  pros: string[];
  cons: string[];
  summary: string;
  seoTitle: string;
  seoDescription: string;
  schemaType?: string;
  targetKeywords?: string[];
  
  // Admin Meta
  updatedAt: string;
  updatedBy: string;
  draftChangesCount?: number;
}

export interface RegulatorAdmin {
  id: string;
  code: string;
  name: string;
  jurisdiction: string;
  flag: string;
  tier: RegulationTier;
  status: "active" | "warning" | "defunct";
  officialWebsite: string;
  registerSearchUrl: string;
  compensationScheme: string;
  maxCoverageFormatted: string;
  activeBrokersCount: number;
  lastVerifiedDate: string;
  verificationOwner: string;
  description: string;
  powers: string[];
}

export interface EvidenceItem {
  id: string;
  title: string;
  type: "regulatory_register" | "broker_legal_doc" | "spread_test" | "screenshot" | "trading_statement" | "broker_response" | "complaint_proof" | "research_source";
  relatedEntityType: "broker" | "license" | "review" | "complaint" | "guide";
  relatedEntityId: string;
  relatedEntityName: string;
  uploadedBy: string;
  uploadedAt: string;
  fileFormat: string;
  fileSizeBytes: number;
  status: VerificationStatus;
  expiryDate?: string;
  reviewer?: string;
  reviewedAt?: string;
  checksum: string;
  sourceUrl?: string;
  notes: string;
}

export interface LicenseVerificationItem {
  id: string;
  brokerId: string;
  brokerName: string;
  regulatorCode: string;
  regulatorName: string;
  licenseNumber: string;
  licenseeEntity: string;
  jurisdiction: string;
  officialRegisterUrl: string;
  evidenceId: string;
  submittedAt: string;
  submittedBy: string;
  status: VerificationStatus;
  analystNotes: string;
  confidenceScore: number;
  reviewerNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface RatingChangeProposal {
  id: string;
  brokerId: string;
  brokerName: string;
  pillarId: string;
  pillarName: string;
  currentScore: number;
  proposedScore: number;
  scoreDelta: number;
  currentTotalRating: number;
  proposedTotalRating: number;
  reason: string;
  evidenceId: string;
  proposedBy: string;
  proposedAt: string;
  status: "pending_review" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedAt?: string;
  complianceNotes?: string;
}

export interface ReviewModerationItem {
  id: string;
  brokerId: string;
  brokerName: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userEmail: string;
  isVerifiedTrader: boolean;
  tradeAccountType?: string;
  rating: number;
  title: string;
  content: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected" | "flagged" | "needs_clarification";
  riskFlag: "none" | "suspected_bot" | "abusive_language" | "unverified_slippage_claim" | "promotional_spam";
  evidenceAttached: boolean;
  evidenceIds: string[];
  assignedModerator?: string;
  moderatorNotes?: string;
  brokerResponse?: {
    author: string;
    officialRole: string;
    submittedAt: string;
    content: string;
    status: "pending_review" | "approved" | "rejected";
  };
}

export interface ComplaintAdmin {
  id: string;
  caseNumber: string;
  brokerId: string;
  brokerName: string;
  userId: string;
  userName: string;
  userEmail: string;
  isVerifiedTrader: boolean;
  claimTitle: string;
  claimDescription: string;
  claimAmount: number;
  currency: string;
  category: "delayed_withdrawal" | "unauthorized_trade" | "excessive_slippage" | "account_freeze" | "misleading_bonus" | "other";
  status: "submitted" | "under_review" | "broker_contacted" | "broker_responded" | "evidence_review" | "resolved" | "rejected" | "closed";
  submittedAt: string;
  updatedAt: string;
  evidenceIds: string[];
  timeline: {
    id: string;
    timestamp: string;
    actor: string;
    role: string;
    title: string;
    description: string;
  }[];
  brokerResponse?: {
    submittedAt: string;
    contactPerson: string;
    content: string;
    resolutionOffer?: string;
  };
  resolutionNotes?: string;
  settledAmount?: number;
}

export interface EditorialGuide {
  id: string;
  slug: string;
  title: string;
  category: "Beginner Guide" | "Trading Costs" | "Regulation & Safety" | "Platform Comparison" | "Trading Strategies";
  authorName: string;
  authorRole: string;
  status: PublishingStatus;
  readingTimeMinutes: number;
  summary: string;
  content: string;
  sourcesCount: number;
  sourcesList: string[];
  featuredBrokers: string[];
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
  factCheckedBy?: string;
  factCheckedAt?: string;
  complianceSignedBy?: string;
  complianceSignedAt?: string;
  publishedAt?: string;
}

export interface UserAdmin {
  id: string;
  name: string;
  email: string;
  role: AdminRole | "trader";
  isVerifiedTrader: boolean;
  tradingExperienceYears: number;
  country: string;
  status: "active" | "suspended" | "pending_verification" | "banned";
  reviewsCount: number;
  complaintsCount: number;
  createdAt: string;
  lastActiveAt: string;
  verifiedDepositSlipEvidenceId?: string;
}

export interface DataQualityIssue {
  id: string;
  entityType: "broker" | "license" | "evidence" | "guide" | "regulator";
  entityId: string;
  entityName: string;
  severity: "critical" | "high" | "medium" | "low";
  issueType: "missing_license_evidence" | "stale_verification" | "expired_evidence" | "missing_seo_fields" | "broken_url" | "duplicate_license";
  description: string;
  detectedAt: string;
  assignedTo?: string;
  resolved: boolean;
}

export interface JobQueueItem {
  id: string;
  jobName: string;
  jobType: "spread_sync" | "regulator_register_crawl" | "sitemap_generation" | "evidence_integrity_check" | "outbound_click_aggregation" | "seo_cache_purge";
  status: "queued" | "running" | "completed" | "failed" | "retrying";
  startedAt: string;
  durationMs?: number;
  attempts: number;
  maxAttempts: number;
  errorMessage?: string;
  recordsProcessed?: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: AdminRole;
  action: "CREATE" | "UPDATE" | "VERIFY" | "REJECT" | "APPROVE" | "PUBLISH" | "ARCHIVE" | "RESOLVE" | "SCORE_CHANGE";
  entityType: "broker" | "license" | "evidence" | "rating" | "review" | "complaint" | "guide" | "user" | "setting";
  entityId: string;
  entityName: string;
  summary: string;
  beforeValue?: string;
  afterValue?: string;
  reason?: string;
  evidenceId?: string;
  ipAddress: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "verification_request" | "moderation_task" | "compliance_alert" | "evidence_expired" | "job_failed" | "system_notice";
  priority: "high" | "medium" | "low";
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}
