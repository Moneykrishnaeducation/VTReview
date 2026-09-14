export interface RegulatoryLicense {
  regulator: string;
  jurisdiction: string;
  licenseNumber: string;
  entityName: string;
  verified: boolean;
  tier: 1 | 2 | 3;
  registerUrl: string;
}

export interface UserReview {
  id: string;
  author: string;
  country: string;
  rating: number;
  date: string;
  experience: string;
  accountType: string;
  platform: string;
  verifiedLiveAccount: boolean;
  headline: string;
  review: string;
  pros: string;
  cons: string;
  helpfulCount: number;
}

export interface AccountType {
  name: string;
  minDeposit: string;
  spreadFrom: string;
  commission: string;
  leverage: string;
  bestFor: string;
}

export interface SpreadRow {
  pair: string;
  rawSpread: string;
  standardSpread: string;
  commission: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Broker {
  id: string;
  name: string;
  slug: string;
  logoText: string;
  founded: number;
  hq: string;
  parentCompany: string;
  trustScore: number; // 0-100
  editorialRating: number; // 0.0 - 5.0
  editorialClass: "Exceptional / Safe" | "Very Safe" | "Moderate Risk" | "High Risk";
  userRating: number; // 0.0 - 5.0
  reviewCount: number;
  factCheckedDate: string;
  primaryLicense: string;
  regulations: RegulatoryLicense[];
  minDeposit: number;
  minDepositFormatted: string;
  eurUsdSpread: number; // in pips
  gbpUsdSpread: number;
  usdJpySpread: number;
  xauUsdSpread: number;
  commissionPerLot: number;
  commissionText: string;
  allInCostEurUsd: number;
  maxLeverageRetail: string;
  maxLeveragePro: string;
  platforms: string[];
  executionModel: string;
  executionSpeedMs: number;
  slippagePositivePct: number;
  tradableMarketsCount: number;
  inactivityFee: string;
  depositMethods: string[];
  withdrawalSpeed: string;
  swapFreeAvailable: boolean;
  scalpingAllowed: boolean;
  eaAllowed: boolean;
  copyTrading: boolean;
  negativeBalanceProtection: boolean;
  categoryBadges: string[];
  bestForTags: string[];
  verdictSummary: string;
  bestForSummary: string[];
  notIdealForSummary: string[];
  pros: string[];
  cons: string[];
  ratingsBreakdown: {
    safety: number;
    costs: number;
    platforms: number;
    banking: number;
    support: number;
  };
  accountTypes: AccountType[];
  spreadsTable: SpreadRow[];
  faqs: FAQItem[];
  userReviews: UserReview[];
  affiliateUrl: string;
  similarityScoreAgainstA?: number;
}

export const BROKERS: Broker[] = [
  {
    id: "pepperstone",
    name: "Pepperstone",
    slug: "pepperstone",
    logoText: "PEPPERSTONE",
    founded: 2010,
    hq: "Melbourne, Australia",
    parentCompany: "Pepperstone Group Ltd",
    trustScore: 99,
    editorialRating: 4.9,
    editorialClass: "Exceptional / Safe",
    userRating: 4.8,
    reviewCount: 1420,
    factCheckedDate: "September 2026",
    primaryLicense: "FCA #684312",
    regulations: [
      {
        regulator: "FCA",
        jurisdiction: "United Kingdom",
        licenseNumber: "684312",
        entityName: "Pepperstone UK Limited",
        verified: true,
        tier: 1,
        registerUrl: "https://register.fca.org.uk/",
      },
      {
        regulator: "ASIC",
        jurisdiction: "Australia",
        licenseNumber: "414530",
        entityName: "Pepperstone Group Limited",
        verified: true,
        tier: 1,
        registerUrl: "https://asic.gov.au/",
      },
      {
        regulator: "CySEC",
        jurisdiction: "Cyprus / EU",
        licenseNumber: "388/20",
        entityName: "Pepperstone EU Ltd",
        verified: true,
        tier: 1,
        registerUrl: "https://cysec.gov.cy/",
      },
      {
        regulator: "BaFin",
        jurisdiction: "Germany",
        licenseNumber: "151148",
        entityName: "Pepperstone GmbH",
        verified: true,
        tier: 1,
        registerUrl: "https://bafin.de/",
      },
    ],
    minDeposit: 0,
    minDepositFormatted: "$0 (No minimum)",
    eurUsdSpread: 0.1,
    gbpUsdSpread: 0.3,
    usdJpySpread: 0.2,
    xauUsdSpread: 0.12,
    commissionPerLot: 3.5,
    commissionText: "$3.50 per side ($7.00 round turn)",
    allInCostEurUsd: 0.7,
    maxLeverageRetail: "1:30 (UK/EU/ASIC)",
    maxLeveragePro: "1:500 (Pro / SCB)",
    platforms: ["MetaTrader 4", "MetaTrader 5", "cTrader", "TradingView"],
    executionModel: "No Dealing Desk (NDD) / True ECN",
    executionSpeedMs: 31,
    slippagePositivePct: 96,
    tradableMarketsCount: 1200,
    inactivityFee: "$0 (No fee)",
    depositMethods: ["Visa/Mastercard", "Bank Wire", "PayPal", "Neteller", "Skrill", "Apple Pay"],
    withdrawalSpeed: "Instant – 24 Hours",
    swapFreeAvailable: true,
    scalpingAllowed: true,
    eaAllowed: true,
    copyTrading: true,
    negativeBalanceProtection: true,
    categoryBadges: ["Best Overall 2026", "Best for Scalping", "Best TradingView"],
    bestForTags: ["Scalpers", "Algo/EA Traders", "TradingView Users", "Low Spreads"],
    verdictSummary:
      "Pepperstone is an industry-leading multi-regulated broker renowned for ultra-tight raw spreads, rapid execution speed (<35ms), and native TradingView & cTrader integrations. Its lack of minimum deposit and non-existent inactivity fee make it our top recommendation for 2026.",
    bestForSummary: [
      "Algorithmic traders and Expert Advisors (EAs)",
      "High-frequency scalpers needing low latency",
      "Traders executing directly from TradingView charts",
      "Cost-sensitive active intraday traders",
    ],
    notIdealForSummary: [
      "Traders wanting guaranteed stop losses (GSLO)",
      "Traders needing physical stock share dealing accounts",
      "US Resident traders (due to CFTC rules)",
    ],
    pros: [
      "Ultra-competitive Raw spreads averaging 0.1 pips on EUR/USD",
      "Direct integration with TradingView, cTrader, MT4, and MT5",
      "Four Tier-1 licenses: FCA (UK), ASIC (AU), CySEC (EU), BaFin (DE)",
      "Zero deposit, withdrawal, or inactivity fees",
      "Audited average fill time under 32 milliseconds",
    ],
    cons: [
      "No proprietary beginner-oriented web terminal",
      "Telephone customer support is closed on weekends",
      "Standard account spread mark-up is higher than raw tier",
    ],
    ratingsBreakdown: {
      safety: 5.0,
      costs: 4.9,
      platforms: 5.0,
      banking: 4.8,
      support: 4.7,
    },
    accountTypes: [
      {
        name: "Razor Account (Raw ECN)",
        minDeposit: "$0",
        spreadFrom: "0.0 pips",
        commission: "$3.50 / side ($7 RT)",
        leverage: "1:30 (Retail) / 1:500 (Pro)",
        bestFor: "Scalpers, Algo Traders, Day Traders",
      },
      {
        name: "Standard Account",
        minDeposit: "$0",
        spreadFrom: "0.8 pips",
        commission: "$0.00 (Spread markup)",
        leverage: "1:30 (Retail) / 1:500 (Pro)",
        bestFor: "Discretionary Swing Traders, Beginners",
      },
    ],
    spreadsTable: [
      { pair: "EUR / USD", rawSpread: "0.1 pips", standardSpread: "0.8 pips", commission: "$7.00 RT" },
      { pair: "GBP / USD", rawSpread: "0.3 pips", standardSpread: "1.1 pips", commission: "$7.00 RT" },
      { pair: "USD / JPY", rawSpread: "0.2 pips", standardSpread: "0.9 pips", commission: "$7.00 RT" },
      { pair: "XAU / USD (Gold)", rawSpread: "0.12 pips", standardSpread: "0.28 pips", commission: "$7.00 RT" },
      { pair: "BTC / USD", rawSpread: "$12.00", standardSpread: "$28.00", commission: "$0.00" },
    ],
    faqs: [
      {
        question: "Is Pepperstone safe and properly regulated?",
        answer:
          "Yes. Pepperstone holds Tier-1 regulatory licenses from the UK Financial Conduct Authority (FCA #684312), the Australian Securities and Investments Commission (ASIC #414530), CySEC in Europe (#388/20), and BaFin in Germany. Client funds are strictly segregated in Tier-1 banks.",
      },
      {
        question: "What is the minimum deposit required at Pepperstone?",
        answer: "There is no minimum deposit required ($0). Traders can start by funding any amount that satisfies margin requirements.",
      },
      {
        question: "Can I use TradingView directly with Pepperstone?",
        answer: "Yes, Pepperstone offers full native TradingView broker integration, allowing direct trade placement from TradingView charts.",
      },
      {
        question: "Does Pepperstone charge an inactivity fee?",
        answer: "No. Unlike many competitors, Pepperstone does not charge any monthly maintenance or inactivity fees for dormant accounts.",
      },
    ],
    userReviews: [
      {
        id: "rev-101",
        author: "Marcus K.",
        country: "United Kingdom",
        rating: 5,
        date: "18 Aug 2026",
        experience: "4 Years",
        accountType: "Razor ECN",
        platform: "TradingView & MT5",
        verifiedLiveAccount: true,
        headline: "Flawless execution and zero slippage on major news releases",
        review:
          "I have been using Pepperstone Razor account with cTrader and TradingView for 3 years. Spreads are genuinely 0.0-0.1 pips on London open. My £4,500 withdrawal last Monday was in my Lloyds account in under 3 hours.",
        pros: "Instant withdrawals, TradingView connection, zero deposit fees",
        cons: "Support is email-only on Sunday mornings",
        helpfulCount: 38,
      },
      {
        id: "rev-102",
        author: "Sarah L.",
        country: "Australia",
        rating: 5,
        date: "04 Aug 2026",
        experience: "2 Years",
        accountType: "Razor",
        platform: "cTrader",
        verifiedLiveAccount: true,
        headline: "The benchmark cTrader broker in Australia",
        review: "ASIC regulated, ultra-fast fill times, and no hidden spread widening. Very transparent fee structure.",
        pros: "Fast support, transparent fees",
        cons: "None found so far",
        helpfulCount: 19,
      },
    ],
    affiliateUrl: "https://pepperstone.com",
    similarityScoreAgainstA: 100,
  },
  {
    id: "ic-markets",
    name: "IC Markets",
    slug: "ic-markets",
    logoText: "IC MARKETS",
    founded: 2007,
    hq: "Sydney, Australia",
    parentCompany: "International Capital Markets Pty Ltd",
    trustScore: 98,
    editorialRating: 4.8,
    editorialClass: "Exceptional / Safe",
    userRating: 4.7,
    reviewCount: 2150,
    factCheckedDate: "September 2026",
    primaryLicense: "ASIC #335692",
    regulations: [
      {
        regulator: "ASIC",
        jurisdiction: "Australia",
        licenseNumber: "335692",
        entityName: "International Capital Markets Pty Ltd",
        verified: true,
        tier: 1,
        registerUrl: "https://asic.gov.au/",
      },
      {
        regulator: "CySEC",
        jurisdiction: "Cyprus / EU",
        licenseNumber: "362/18",
        entityName: "IC Markets (EU) Ltd",
        verified: true,
        tier: 1,
        registerUrl: "https://cysec.gov.cy/",
      },
      {
        regulator: "FSA",
        jurisdiction: "Seychelles",
        licenseNumber: "SD018",
        entityName: "Raw Trading Ltd",
        verified: true,
        tier: 3,
        registerUrl: "https://fsaseychelles.sc/",
      },
    ],
    minDeposit: 200,
    minDepositFormatted: "$200",
    eurUsdSpread: 0.0,
    gbpUsdSpread: 0.2,
    usdJpySpread: 0.1,
    xauUsdSpread: 0.11,
    commissionPerLot: 3.0,
    commissionText: "$3.00 / side ($6.00 round turn on cTrader)",
    allInCostEurUsd: 0.6,
    maxLeverageRetail: "1:30 (ASIC/EU)",
    maxLeveragePro: "1:500 (Offshore / Pro)",
    platforms: ["MetaTrader 4", "MetaTrader 5", "cTrader", "TradingView"],
    executionModel: "True ECN / Raw Liquidity",
    executionSpeedMs: 29,
    slippagePositivePct: 95,
    tradableMarketsCount: 2250,
    inactivityFee: "$0 (No fee)",
    depositMethods: ["Visa/Mastercard", "Bank Wire", "PayPal", "Neteller", "Skrill", "Poli", "Bpay"],
    withdrawalSpeed: "12 – 24 Hours",
    swapFreeAvailable: true,
    scalpingAllowed: true,
    eaAllowed: true,
    copyTrading: true,
    negativeBalanceProtection: true,
    categoryBadges: ["Lowest Spread Broker", "Best MT5 Broker", "Best for ECN"],
    bestForTags: ["High Volume Scalpers", "Algo/EA Automated", "cTrader Fans"],
    verdictSummary:
      "IC Markets is one of the largest true ECN forex brokers globally by volume, routing orders to 25+ Tier-1 liquidity providers in the NY4 data center. Its average EUR/USD spread is frequently zero, making it unmatched for volume scalpers.",
    bestForSummary: [
      "Ultra-low cost high-frequency scalpers",
      "Automated robot (EA) traders needing raw liquidity",
      "Traders needing high institutional CFD variety (2,250+ assets)",
    ],
    notIdealForSummary: [
      "Traders looking for sub-$50 deposits (Requires $200 min)",
      "Beginners seeking simplified educational portals",
    ],
    pros: [
      "Benchmark 0.0 pip raw spreads on EUR/USD during peak liquidity",
      "Over $1 Trillion monthly volume providing deep order books",
      "cTrader commission is discounted to $6.00 per round lot",
      "Free London & New York VPS for active traders",
    ],
    cons: [
      "$200 minimum initial deposit barrier",
      "Website interface feels dense with technical financial terms",
      "No FCA UK license entity directly available",
    ],
    ratingsBreakdown: {
      safety: 4.8,
      costs: 5.0,
      platforms: 4.9,
      banking: 4.7,
      support: 4.5,
    },
    accountTypes: [
      {
        name: "Raw Spread Account (cTrader)",
        minDeposit: "$200",
        spreadFrom: "0.0 pips",
        commission: "$3.00 / side ($6 RT)",
        leverage: "1:30 (ASIC) / 1:500",
        bestFor: "cTrader Algorithmic Scalpers",
      },
      {
        name: "Raw Spread Account (MetaTrader)",
        minDeposit: "$200",
        spreadFrom: "0.0 pips",
        commission: "$3.50 / side ($7 RT)",
        leverage: "1:30 (ASIC) / 1:500",
        bestFor: "MT4 / MT5 EAs and Expert Users",
      },
      {
        name: "Standard Account",
        minDeposit: "$200",
        spreadFrom: "0.8 pips",
        commission: "$0.00",
        leverage: "1:30 / 1:500",
        bestFor: "Discretionary swing traders",
      },
    ],
    spreadsTable: [
      { pair: "EUR / USD", rawSpread: "0.0 pips", standardSpread: "0.8 pips", commission: "$6.00 RT" },
      { pair: "GBP / USD", rawSpread: "0.2 pips", standardSpread: "1.0 pips", commission: "$6.00 RT" },
      { pair: "USD / JPY", rawSpread: "0.1 pips", standardSpread: "0.9 pips", commission: "$6.00 RT" },
      { pair: "XAU / USD (Gold)", rawSpread: "0.11 pips", standardSpread: "0.25 pips", commission: "$6.00 RT" },
    ],
    faqs: [
      {
        question: "Is IC Markets an ECN or a Market Maker?",
        answer:
          "IC Markets operates a True ECN execution model with pricing streamed directly from external liquidity providers. IC Markets does not run a B-book dealing desk against its clients.",
      },
      {
        question: "What is the difference between cTrader and MT4 commissions at IC Markets?",
        answer: "cTrader charges $3.00 per $100k traded ($6.00 round turn), while MT4/MT5 charges $3.50 per lot ($7.00 round turn).",
      },
    ],
    userReviews: [
      {
        id: "rev-201",
        author: "David R.",
        country: "Australia",
        rating: 5,
        date: "02 Sep 2026",
        experience: "7 Years",
        accountType: "Raw cTrader",
        platform: "cTrader Desktop",
        verifiedLiveAccount: true,
        headline: "Deepest liquidity on Gold and EURUSD",
        review:
          "Running an automated scalping bot executing 80 trades daily. Slippage is neutral or positive on 95% of orders. ASIC segregated account gives peace of mind.",
        pros: "Lowest all-in cost, robust servers",
        cons: "Live chat can have a 5-minute queue during NY open",
        helpfulCount: 45,
      },
    ],
    affiliateUrl: "https://icmarkets.com",
    similarityScoreAgainstA: 96,
  },
  {
    id: "ig",
    name: "IG",
    slug: "ig",
    logoText: "IG GROUP",
    founded: 1974,
    hq: "London, United Kingdom",
    parentCompany: "IG Group Holdings plc (FTSE 250)",
    trustScore: 99,
    editorialRating: 4.9,
    editorialClass: "Exceptional / Safe",
    userRating: 4.6,
    reviewCount: 3800,
    factCheckedDate: "September 2026",
    primaryLicense: "FCA #195355",
    regulations: [
      {
        regulator: "FCA",
        jurisdiction: "United Kingdom",
        licenseNumber: "195355",
        entityName: "IG Markets Ltd",
        verified: true,
        tier: 1,
        registerUrl: "https://register.fca.org.uk/",
      },
      {
        regulator: "CFTC / NFA",
        jurisdiction: "United States",
        licenseNumber: "0509630",
        entityName: "IG US LLC",
        verified: true,
        tier: 1,
        registerUrl: "https://www.nfa.futures.org/",
      },
      {
        regulator: "ASIC",
        jurisdiction: "Australia",
        licenseNumber: "515106",
        entityName: "IG Australia Pty Ltd",
        verified: true,
        tier: 1,
        registerUrl: "https://asic.gov.au/",
      },
      {
        regulator: "BaFin",
        jurisdiction: "Germany / EU",
        licenseNumber: "148759",
        entityName: "IG Europe GmbH",
        verified: true,
        tier: 1,
        registerUrl: "https://bafin.de/",
      },
    ],
    minDeposit: 0,
    minDepositFormatted: "$0 (Card / Wire)",
    eurUsdSpread: 0.6,
    gbpUsdSpread: 0.9,
    usdJpySpread: 0.7,
    xauUsdSpread: 0.3,
    commissionPerLot: 0,
    commissionText: "$0.00 Commission (All-in spread)",
    allInCostEurUsd: 0.6,
    maxLeverageRetail: "1:30 (UK/EU/US 1:50)",
    maxLeveragePro: "1:222 (Professional)",
    platforms: ["IG Web Platform", "MetaTrader 4", "ProRealTime", "L2 Dealer (DMA)"],
    executionModel: "Market Maker / DMA (L2 Dealer)",
    executionSpeedMs: 14,
    slippagePositivePct: 98,
    tradableMarketsCount: 17000,
    inactivityFee: "$12/mo after 24 months",
    depositMethods: ["Debit/Credit Card", "Bank Wire", "PayPal"],
    withdrawalSpeed: "Instant – 24 Hours",
    swapFreeAvailable: false,
    scalpingAllowed: true,
    eaAllowed: true,
    copyTrading: false,
    negativeBalanceProtection: true,
    categoryBadges: ["Best for Beginners", "Best for US Traders", "Highest Trust 99/100"],
    bestForTags: ["Beginners", "US Forex Traders", "Multi-Asset Traders (17,000+ Mkts)", "ProRealTime"],
    verdictSummary:
      "Publicly traded on the London Stock Exchange (LSE: IGG) with over 50 years of heritage, IG is arguably the safest retail broker in existence. Offering access to over 17,000 global markets and accepting US clients, it is an institutional-grade titan.",
    bestForSummary: [
      "Beginners wanting an award-winning web app and 24/7 phone support",
      "US Forex traders (IG is CFTC/NFA registered)",
      "Multi-asset traders trading shares, indices, options & forex from 1 balance",
    ],
    notIdealForSummary: [
      "Traders needing cTrader platform",
      "Islamic swap-free account seekers",
    ],
    pros: [
      "Publicly traded FTSE 250 parent company with 50+ year track record",
      "Accepts US forex traders legally under NFA regulation",
      "Huge asset catalogue with 17,000+ tradable instruments",
      "Award-winning proprietary web interface with built-in ProRealTime charts",
    ],
    cons: [
      "No cTrader or MT5 platform support (MT4 and Web only)",
      "Inactivity fee kicked in after 2 years of zero trades",
    ],
    ratingsBreakdown: {
      safety: 5.0,
      costs: 4.7,
      platforms: 4.9,
      banking: 4.9,
      support: 5.0,
    },
    accountTypes: [
      {
        name: "IG Standard CFD Account",
        minDeposit: "$0",
        spreadFrom: "0.6 pips",
        commission: "$0.00",
        leverage: "1:30 (UK/EU) / 1:50 (USA)",
        bestFor: "All Discretionary & Retail Traders",
      },
      {
        name: "L2 Dealer (DMA Direct Market Access)",
        minDeposit: "$1,000",
        spreadFrom: "0.1 pips",
        commission: "Tiered volume",
        leverage: "1:30 / 1:222",
        bestFor: "Institutional & Volume DMA Traders",
      },
    ],
    spreadsTable: [
      { pair: "EUR / USD", rawSpread: "0.6 pips (All-in)", standardSpread: "0.6 pips", commission: "$0.00" },
      { pair: "GBP / USD", rawSpread: "0.9 pips (All-in)", standardSpread: "0.9 pips", commission: "$0.00" },
      { pair: "USD / JPY", rawSpread: "0.7 pips (All-in)", standardSpread: "0.7 pips", commission: "$0.00" },
      { pair: "XAU / USD (Gold)", rawSpread: "0.30 pips", standardSpread: "0.30 pips", commission: "$0.00" },
    ],
    faqs: [
      {
        question: "Does IG accept US forex clients?",
        answer: "Yes, IG US LLC is a CFTC-registered Retail Foreign Exchange Dealer and member of the National Futures Association (NFA #0509630).",
      },
    ],
    userReviews: [
      {
        id: "rev-301",
        author: "Thomas B.",
        country: "United States",
        rating: 5,
        date: "22 Aug 2026",
        experience: "3 Years",
        accountType: "IG US Forex",
        platform: "Web & Mobile",
        verifiedLiveAccount: true,
        headline: "The most trusted US forex broker by far",
        review: "Clean platform, reliable execution, and immediate customer service when calling by phone.",
        pros: "US legal, reliable charts, no deposit fee",
        cons: "Max 1:50 leverage due to US laws",
        helpfulCount: 52,
      },
    ],
    affiliateUrl: "https://ig.com",
    similarityScoreAgainstA: 92,
  },
  {
    id: "xm",
    name: "XM Group",
    slug: "xm",
    logoText: "XM GROUP",
    founded: 2009,
    hq: "Limassol, Cyprus",
    parentCompany: "Trading Point Group",
    trustScore: 94,
    editorialRating: 4.7,
    editorialClass: "Very Safe",
    userRating: 4.6,
    reviewCount: 3100,
    factCheckedDate: "September 2026",
    primaryLicense: "CySEC #120/10",
    regulations: [
      {
        regulator: "CySEC",
        jurisdiction: "Cyprus / EU",
        licenseNumber: "120/10",
        entityName: "Trading Point of Financial Instruments Ltd",
        verified: true,
        tier: 1,
        registerUrl: "https://cysec.gov.cy/",
      },
      {
        regulator: "ASIC",
        jurisdiction: "Australia",
        licenseNumber: "443670",
        entityName: "Trading Point of Financial Instruments Pty",
        verified: true,
        tier: 1,
        registerUrl: "https://asic.gov.au/",
      },
      {
        regulator: "FSC",
        jurisdiction: "Belize",
        licenseNumber: "000261/397",
        entityName: "XM Global Limited",
        verified: true,
        tier: 3,
        registerUrl: "https://fscbelize.gov.bz/",
      },
    ],
    minDeposit: 5,
    minDepositFormatted: "$5 (Ultra Low Entry)",
    eurUsdSpread: 0.6,
    gbpUsdSpread: 1.0,
    usdJpySpread: 0.8,
    xauUsdSpread: 0.25,
    commissionPerLot: 0,
    commissionText: "$0.00 (Ultra Low Spread Account)",
    allInCostEurUsd: 0.6,
    maxLeverageRetail: "1:30 (EU/ASIC)",
    maxLeveragePro: "1:1000 (Non-EU Global)",
    platforms: ["MetaTrader 4", "MetaTrader 5", "XM Mobile App"],
    executionModel: "Market Maker / STP (Strict No Re-quotes)",
    executionSpeedMs: 40,
    slippagePositivePct: 92,
    tradableMarketsCount: 1400,
    inactivityFee: "$5/mo after 90 days",
    depositMethods: ["Credit/Debit Card", "Bank Wire", "Skrill", "Neteller", "Local Bank Transfers"],
    withdrawalSpeed: "Instant – 24 Hours",
    swapFreeAvailable: true,
    scalpingAllowed: true,
    eaAllowed: true,
    copyTrading: true,
    negativeBalanceProtection: true,
    categoryBadges: ["Best $5 Min Deposit", "Best Live Education", "Best Micro/Cent Accounts"],
    bestForTags: ["Beginners with <$50", "Micro/Cent Lot Traders", "Daily Live Webinar Viewers"],
    verdictSummary:
      "XM Group is an established international brokerage celebrated for its $5 minimum deposit, micro-lot options, and free daily live interactive education rooms with market analysts.",
    bestForSummary: [
      "Beginners starting with $5 to $100 capital",
      "Traders wanting micro lot sizing and cent accounts",
      "Traders who utilize live daily trading webinars and analysis rooms",
    ],
    notIdealForSummary: [
      "Pure raw ECN scalpers wanting cTrader",
      "Traders needing TradingView charting integration",
    ],
    pros: [
      "Ultra-low entry barrier with $5 minimum deposit",
      "XM Ultra Low account offers 0.6 pip EUR/USD spreads with zero commission",
      "Live educational analysis rooms in 30+ languages daily",
      "Strict zero re-quote execution policy (99.35% orders filled under 1s)",
    ],
    cons: [
      "No cTrader or TradingView integration",
      "Inactivity fee begins earlier than peers (after 90 days)",
    ],
    ratingsBreakdown: {
      safety: 4.7,
      costs: 4.6,
      platforms: 4.5,
      banking: 4.9,
      support: 4.8,
    },
    accountTypes: [
      {
        name: "XM Ultra Low Account",
        minDeposit: "$5",
        spreadFrom: "0.6 pips",
        commission: "$0.00",
        leverage: "1:30 / 1:1000",
        bestFor: "Zero-commission cost seekers",
      },
      {
        name: "Micro Account (Cent)",
        minDeposit: "$5",
        spreadFrom: "1.0 pips",
        commission: "$0.00",
        leverage: "1:30 / 1:1000",
        bestFor: "Beginners testing real funds safely",
      },
    ],
    spreadsTable: [
      { pair: "EUR / USD", rawSpread: "0.6 pips", standardSpread: "1.2 pips", commission: "$0.00" },
      { pair: "GBP / USD", rawSpread: "1.0 pips", standardSpread: "1.5 pips", commission: "$0.00" },
      { pair: "USD / JPY", rawSpread: "0.8 pips", standardSpread: "1.4 pips", commission: "$0.00" },
      { pair: "XAU / USD (Gold)", rawSpread: "0.25 pips", standardSpread: "0.45 pips", commission: "$0.00" },
    ],
    faqs: [
      {
        question: "Does XM charge deposit or withdrawal fees?",
        answer: "No. All deposits and withdrawals via card or electronic wallets are 100% free of charge with zero fees.",
      },
    ],
    userReviews: [
      {
        id: "rev-401",
        author: "Carlos M.",
        country: "Spain",
        rating: 5,
        date: "14 Jul 2026",
        experience: "1 Year",
        accountType: "Ultra Low",
        platform: "MT5 Mobile",
        verifiedLiveAccount: true,
        headline: "Great starter broker with instant card withdrawals",
        review: "Started with 50 Euros. The webinars every morning are very educational.",
        pros: "$5 deposit, fast card payouts",
        cons: "Spreads widen slightly during rollover",
        helpfulCount: 22,
      },
    ],
    affiliateUrl: "https://xm.com",
    similarityScoreAgainstA: 88,
  },
  {
    id: "tickmill",
    name: "Tickmill",
    slug: "tickmill",
    logoText: "TICKMILL",
    founded: 2014,
    hq: "London, United Kingdom",
    parentCompany: "Tickmill UK Ltd",
    trustScore: 96,
    editorialRating: 4.8,
    editorialClass: "Exceptional / Safe",
    userRating: 4.7,
    reviewCount: 980,
    factCheckedDate: "September 2026",
    primaryLicense: "FCA #717270",
    regulations: [
      {
        regulator: "FCA",
        jurisdiction: "United Kingdom",
        licenseNumber: "717270",
        entityName: "Tickmill UK Ltd",
        verified: true,
        tier: 1,
        registerUrl: "https://register.fca.org.uk/",
      },
      {
        regulator: "CySEC",
        jurisdiction: "Cyprus / EU",
        licenseNumber: "278/15",
        entityName: "Tickmill Europe Ltd",
        verified: true,
        tier: 1,
        registerUrl: "https://cysec.gov.cy/",
      },
      {
        regulator: "FSCA",
        jurisdiction: "South Africa",
        licenseNumber: "FSP 49464",
        entityName: "Tickmill South Africa Pty",
        verified: true,
        tier: 2,
        registerUrl: "https://fsca.co.za/",
      },
    ],
    minDeposit: 100,
    minDepositFormatted: "$100",
    eurUsdSpread: 0.1,
    gbpUsdSpread: 0.3,
    usdJpySpread: 0.2,
    xauUsdSpread: 0.14,
    commissionPerLot: 2.0,
    commissionText: "$2.00 / side ($4.00 round turn — Lowest in industry)",
    allInCostEurUsd: 0.5,
    maxLeverageRetail: "1:30 (FCA/CySEC)",
    maxLeveragePro: "1:500 (Pro/Global)",
    platforms: ["MetaTrader 4", "MetaTrader 5", "Tickmill WebTrader"],
    executionModel: "True STP / ECN",
    executionSpeedMs: 25,
    slippagePositivePct: 97,
    tradableMarketsCount: 650,
    inactivityFee: "$0 (No fee)",
    depositMethods: ["Visa/Mastercard", "Bank Transfer", "Skrill", "Neteller", "WebMoney"],
    withdrawalSpeed: "Same Day / 24h",
    swapFreeAvailable: true,
    scalpingAllowed: true,
    eaAllowed: true,
    copyTrading: true,
    negativeBalanceProtection: true,
    categoryBadges: ["Lowest ECN Commission ($4 RT)", "Best for Algo/VPS", "Top FCA Broker"],
    bestForTags: ["High Frequency EAs", "Low Commission Scalpers", "Bonds & FX Traders"],
    verdictSummary:
      "Tickmill delivers the lowest raw ECN commission on the market ($4.00 round turn vs $6-$7 standard), backed by FCA regulation and rapid Equinix execution under 25ms.",
    bestForSummary: [
      "Scalpers and EA developers wanting the lowest possible commission",
      "Traders seeking verified FCA client fund protection",
    ],
    notIdealForSummary: ["Traders requiring TradingView or cTrader software"],
    pros: [
      "Cheapest ECN commission in the industry: $2 per side ($4 round turn)",
      "Zero account dormancy or inactivity fees",
      "Audited execution speeds under 25 milliseconds",
    ],
    cons: ["Asset catalogue is focused (650 instruments, fewer equities)"],
    ratingsBreakdown: {
      safety: 4.9,
      costs: 5.0,
      platforms: 4.6,
      banking: 4.8,
      support: 4.6,
    },
    accountTypes: [
      {
        name: "Pro Account",
        minDeposit: "$100",
        spreadFrom: "0.0 pips",
        commission: "$2.00 / side ($4 RT)",
        leverage: "1:30 / 1:500",
        bestFor: "Scalpers & Day Traders",
      },
    ],
    spreadsTable: [
      { pair: "EUR / USD", rawSpread: "0.1 pips", standardSpread: "1.1 pips", commission: "$4.00 RT" },
      { pair: "GBP / USD", rawSpread: "0.3 pips", standardSpread: "1.3 pips", commission: "$4.00 RT" },
    ],
    faqs: [
      {
        question: "Is Tickmill's commission really only $4 round turn?",
        answer: "Yes, the Tickmill Pro Account charges 2 currency units per side ($4 per standard lot round turn).",
      },
    ],
    userReviews: [],
    affiliateUrl: "https://tickmill.com",
    similarityScoreAgainstA: 95,
  },
];

export interface RegulatorGuide {
  id: string;
  name: string;
  shortName: string;
  country: string;
  flag: string;
  tier: 1 | 2 | 3;
  tierLabel: string;
  established: number;
  website: string;
  compensationLimit: string;
  retailLeverageCap: string;
  segregationMandatory: boolean;
  negativeBalanceProtection: boolean;
  summary: string;
  verificationSteps: string[];
  keyProtections: string[];
  brokerCount: number;
}

export const REGULATORS: RegulatorGuide[] = [
  {
    id: "fca",
    name: "Financial Conduct Authority",
    shortName: "FCA",
    country: "United Kingdom",
    flag: "🇬🇧",
    tier: 1,
    tierLabel: "Tier-1 (Strictest)",
    established: 2013,
    website: "https://register.fca.org.uk",
    compensationLimit: "Up to £85,000 per person via FSCS",
    retailLeverageCap: "1:30 for major forex pairs",
    segregationMandatory: true,
    negativeBalanceProtection: true,
    summary:
      "The UK Financial Conduct Authority is globally regarded as the benchmark of regulatory rigor. Authorized brokers must maintain £730k in base capital, undergo daily segregated client fund audits, and provide statutory FSCS insolvency protection.",
    verificationSteps: [
      "Locate the 6-digit FCA Reference Number in the broker's website footer (e.g. 583261).",
      "Navigate directly to the official Financial Services Register (register.fca.org.uk).",
      "Confirm that the status is listed as 'Authorised' and check permitted trading activities.",
      "Check the 'Trading names' and approved domain URLs to avoid clone scam websites.",
    ],
    keyProtections: [
      "Statutory FSCS compensation scheme covering eligible claims up to £85,000",
      "Mandatory client money segregation in Tier-1 UK/EU banking institutions",
      "Strict ban on credit card funding bonuses and promotional inducements",
      "Mandatory negative balance protection preventing traders from owing debt",
    ],
    brokerCount: 48,
  },
  {
    id: "asic",
    name: "Australian Securities and Investments Commission",
    shortName: "ASIC",
    country: "Australia",
    flag: "🇦🇺",
    tier: 1,
    tierLabel: "Tier-1 (Strictest)",
    established: 1998,
    website: "https://asic.gov.au",
    compensationLimit: "AFCA Dispute Resolution & Segregation",
    retailLeverageCap: "1:30 for major forex pairs",
    segregationMandatory: true,
    negativeBalanceProtection: true,
    summary:
      "ASIC provides world-class financial oversight across the Asia-Pacific region. Australian Financial Services (AFS) licensees must hold sufficient net tangible assets and participate in AFCA external dispute resolution.",
    verificationSteps: [
      "Find the 6-digit AFSL (Australian Financial Services Licence) number.",
      "Search the ASIC Professional Registers database.",
      "Verify that the authorized entity matches the broker's operating corporate entity.",
    ],
    keyProtections: [
      "Strict Australian client money handling rules preventing broker operational use",
      "Australian Financial Complaints Authority (AFCA) binding dispute adjudication",
      "1:30 maximum retail leverage limiting catastrophic retail drawdowns",
    ],
    brokerCount: 36,
  },
  {
    id: "cysec",
    name: "Cyprus Securities and Exchange Commission",
    shortName: "CySEC",
    country: "Cyprus / European Union",
    flag: "🇨🇾",
    tier: 1,
    tierLabel: "Tier-1 (EU Passporting)",
    established: 2001,
    website: "https://cysec.gov.cy",
    compensationLimit: "Up to €20,000 via Investor Compensation Fund (ICF)",
    retailLeverageCap: "1:30 (ESMA compliant)",
    segregationMandatory: true,
    negativeBalanceProtection: true,
    summary:
      "CySEC operates under EU MiFID II directives, enabling regulated investment firms to legally passport CFD and forex services across all European Economic Area (EEA) member states.",
    verificationSteps: [
      "Locate the CySEC licence number in format XXX/YY (e.g. 188/13).",
      "Verify the licence status on the official cysec.gov.cy portal.",
      "Confirm approved cross-border EEA service registrations.",
    ],
    keyProtections: [
      "Investor Compensation Fund (ICF) covering up to €20,000 per client",
      "EU MiFID II standard client suitability and appropriateness checks",
      "Segregated accounts at European credit institutions",
    ],
    brokerCount: 62,
  },
  {
    id: "bafin",
    name: "Federal Financial Supervisory Authority",
    shortName: "BaFin",
    country: "Germany",
    flag: "🇩🇪",
    tier: 1,
    tierLabel: "Tier-1 (Germany)",
    established: 2002,
    website: "https://bafin.de",
    compensationLimit: "Up to €20,000 via EdW",
    retailLeverageCap: "1:30",
    segregationMandatory: true,
    negativeBalanceProtection: true,
    summary: "BaFin is Germany's autonomous federal supervisor renowned for strict financial solvency standards and zero tolerance for non-compliance.",
    verificationSteps: ["Look up company on BaFin Unternehmensdatenbank database."],
    keyProtections: ["EdW statutory compensation", "Strict marketing guidelines"],
    brokerCount: 22,
  },
];

export interface ComplaintItem {
  id: string;
  brokerId: string;
  brokerName: string;
  issueCategory: "Withdrawal Delay" | "Execution / Slippage" | "Account Freeze" | "Bonus Dispute" | "Spreads Widening";
  amountClaimed: string;
  status: "Under Review" | "Broker Responded" | "Resolved ✓" | "Unresolved / Escalated";
  date: string;
  traderCountry: string;
  headline: string;
  details: string;
  brokerResponse?: string;
  hasEvidenceAttachments: boolean;
}

export const MOCK_COMPLAINTS: ComplaintItem[] = [
  {
    id: "comp-101",
    brokerId: "xm",
    brokerName: "XM Group",
    issueCategory: "Withdrawal Delay",
    amountClaimed: "$3,400 USD",
    status: "Resolved ✓",
    date: "28 Aug 2026",
    traderCountry: "Italy",
    headline: "Wire transfer withdrawal delayed past 5 business days",
    details:
      "Requested a bank wire payout on August 20. Took 7 business days due to intermediary correspondent bank compliance checks. Funds were released following platform inquiry.",
    brokerResponse: "Case investigated. Delay was caused by recipient bank AML verification. Funds confirmed settled on Aug 29.",
    hasEvidenceAttachments: true,
  },
  {
    id: "comp-102",
    brokerId: "pepperstone",
    brokerName: "Pepperstone",
    issueCategory: "Execution / Slippage",
    amountClaimed: "$850 USD",
    status: "Resolved ✓",
    date: "14 Aug 2026",
    traderCountry: "United Kingdom",
    headline: "Stop Loss slippage on Gold during US CPI release",
    details: "Experienced 18 pips slippage during heavy news volatility. Pepperstone audit team analyzed the log and provided detailed tick book data.",
    brokerResponse: "Full execution report provided from liquidity provider showing legitimate market gap across interbank market.",
    hasEvidenceAttachments: true,
  },
  {
    id: "comp-103",
    brokerId: "ic-markets",
    brokerName: "IC Markets",
    issueCategory: "Account Freeze",
    amountClaimed: "$12,000 USD",
    status: "Broker Responded",
    date: "02 Sep 2026",
    traderCountry: "Germany",
    headline: "ID re-verification requested prior to large withdrawal",
    details: "Account flagged for periodic KYC refresh during a 5-figure withdrawal. Document re-submission took 48 hours.",
    brokerResponse: "Routine regulatory AML refresh triggered. Verification cleared and withdrawal queue processed.",
    hasEvidenceAttachments: true,
  },
];
