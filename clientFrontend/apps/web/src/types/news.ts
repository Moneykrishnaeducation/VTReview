export type NewsCategory =
  | "All"
  | "Forex"
  | "Crypto"
  | "Stocks & Indices"
  | "Commodities"
  | "Regulation & Alerts"
  | "Broker Investigations"
  | "Central Banks & Economy";

export type MarketSentiment = "Bullish" | "Bearish" | "Neutral" | "High Alert";

export interface NewsAuthor {
  name: string;
  role: string;
  avatar: string;
}

export interface NewsComment {
  id: string;
  author: string;
  avatar: string;
  date: string;
  content: string;
  likes: number;
}

export interface TaggedBroker {
  name: string;
  slug: string;
  rating: number;
  status: "Regulated" | "Unregulated" | "Warning" | "Suspicious";
  logo: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: NewsCategory;
  sentiment: MarketSentiment;
  publishedAt: string;
  readTime: string;
  imageUrl: string;
  imageCaption?: string;
  isFeatured?: boolean;
  isBreaking?: boolean;
  isTrending?: boolean;
  author: NewsAuthor;
  summary: string;
  contentParagraphs: string[];
  keyTakeaways: string[];
  tags: string[];
  views: number;
  likes: number;
  commentsCount: number;
  comments?: NewsComment[];
  taggedBroker?: TaggedBroker;
  relatedArticleIds?: string[];
}

export interface EconomicEvent {
  id: string;
  time: string;
  currency: string;
  flag: string;
  event: string;
  impact: "High" | "Medium" | "Low";
  actual?: string;
  forecast: string;
  previous: string;
}

export interface RegulatoryWarning {
  id: string;
  regulator: string;
  country: string;
  flag: string;
  brokerName: string;
  domain: string;
  warningType: "Clone Firm" | "Unlicensed FX" | "Ponzi Scheme" | "License Revoked";
  date: string;
  details: string;
}

export interface MarketTickerItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
  category: "forex" | "crypto" | "commodity" | "index";
}
