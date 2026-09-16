import { type BrokerDomainModel } from "@/domain/broker";
import { type ComplaintDomainModel } from "@/domain/complaint";
import { BROKERS } from "@/data/broker-directory-data";
import { defaultApiClient, ApiError } from "./api-client";

export interface BrokerFilterCriteria {
  query?: string;
  tier1Only?: boolean;
  platforms?: string[];
  depositRange?: string;
  rawSpreadOnly?: boolean;
  tradingViewOnly?: boolean;
  sortBy?: "rating" | "spread" | "deposit" | "reviews";
}

export class BrokerService {
  private useMockData: boolean;

  constructor(useMockData = true) {
    this.useMockData = useMockData;
  }

  /**
   * Retrieves a list of brokers matching specified filter criteria.
   */
  public async getBrokers(filters?: BrokerFilterCriteria): Promise<BrokerDomainModel[]> {
    if (this.useMockData) {
      let results = [...(BROKERS as unknown as BrokerDomainModel[])];

      if (filters?.query) {
        const q = filters.query.toLowerCase().trim();
        results = results.filter(
          (b) =>
            b.name.toLowerCase().includes(q) ||
            b.primaryLicense.toLowerCase().includes(q) ||
            b.platforms.some((p) => p.toLowerCase().includes(q))
        );
      }

      if (filters?.tier1Only) {
        results = results.filter((b) => b.regulations.some((r) => r.tier === 1));
      }

      if (filters?.platforms && filters.platforms.length > 0) {
        results = results.filter((b) =>
          filters.platforms!.every((p) => b.platforms.includes(p))
        );
      }

      if (filters?.tradingViewOnly) {
        results = results.filter((b) => b.platforms.includes("TradingView"));
      }

      if (filters?.sortBy) {
        switch (filters.sortBy) {
          case "spread":
            results.sort((a, b) => a.eurUsdSpread - b.eurUsdSpread);
            break;
          case "deposit":
            results.sort((a, b) => a.minDeposit - b.minDeposit);
            break;
          case "reviews":
            results.sort((a, b) => b.reviewCount - a.reviewCount);
            break;
          case "rating":
          default:
            results.sort((a, b) => b.editorialRating - a.editorialRating);
            break;
        }
      }

      return results;
    }

    return defaultApiClient.get<BrokerDomainModel[]>("/brokers", filters as any);
  }

  /**
   * Retrieves single broker audit profile by slug or ID.
   */
  public async getBrokerBySlug(slug: string): Promise<BrokerDomainModel | null> {
    if (this.useMockData) {
      const match = (BROKERS as unknown as BrokerDomainModel[]).find(
        (b) => b.slug === slug || b.id === slug
      );
      return match || null;
    }

    try {
      return await defaultApiClient.get<BrokerDomainModel>(`/brokers/${slug}`);
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 404) {
        return null;
      }
      throw err;
    }
  }

  /**
   * Submits a new user review with evidence reference.
   */
  public async submitUserReview(reviewPayload: {
    brokerId: string;
    rating: number;
    headline: string;
    review: string;
    platform: string;
    experience: string;
  }): Promise<{ success: boolean; reviewId: string; status: "pending_moderation" }> {
    if (this.useMockData) {
      // Offline fixture simulation
      return {
        success: true,
        reviewId: `rev-sim-${Date.now()}`,
        status: "pending_moderation",
      };
    }

    return defaultApiClient.post("/reviews", reviewPayload);
  }
}

export const brokerService = new BrokerService(true);
