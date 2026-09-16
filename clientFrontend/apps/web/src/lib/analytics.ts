/**
 * Centralized, privacy-compliant event analytics and outbound affiliate click tracking.
 * Prevents hardcoding random analytics calls across individual UI components.
 */

export type AnalyticsEventType =
  | "broker_search"
  | "broker_viewed"
  | "broker_compared"
  | "comparison_tray_updated"
  | "finder_step_completed"
  | "finder_completed"
  | "calculator_computed"
  | "review_started"
  | "review_submitted"
  | "complaint_submitted"
  | "outbound_broker_clicked";

export interface AnalyticsPayload {
  brokerId?: string;
  brokerName?: string;
  category?: string;
  searchQuery?: string;
  selectedBrokersCount?: number;
  matchScore?: number;
  outboundUrl?: string;
  sourceScreen?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface AnalyticsEvent {
  event: AnalyticsEventType;
  timestamp: string;
  payload?: AnalyticsPayload;
}

export type AnalyticsListener = (event: AnalyticsEvent) => void;

class AnalyticsDispatcher {
  private listeners: AnalyticsListener[] = [];
  private eventHistory: AnalyticsEvent[] = [];
  private isEnabled = true;

  public subscribe(listener: AnalyticsListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public track(event: AnalyticsEventType, payload?: AnalyticsPayload): void {
    if (!this.isEnabled) return;

    const eventRecord: AnalyticsEvent = {
      event,
      timestamp: new Date().toISOString(),
      payload,
    };

    this.eventHistory.push(eventRecord);
    if (this.eventHistory.length > 100) {
      this.eventHistory.shift(); // Bound memory
    }

    this.listeners.forEach((listener) => {
      try {
        listener(eventRecord);
      } catch (err) {
        console.warn("[Analytics] Error in event listener", err);
      }
    });

    if (process.env.NODE_ENV === "development") {
      // In dev, trace to console
      // console.debug(`[Analytics Event] ${event}`, payload);
    }
  }

  /**
   * Dedicated helper for outbound broker link tracking.
   * Ensures transparent redirection logging without affecting editorial ratings.
   */
  public trackBrokerOutbound(brokerId: string, brokerName: string, outboundUrl: string, sourceScreen: string): void {
    this.track("outbound_broker_clicked", {
      brokerId,
      brokerName,
      outboundUrl,
      sourceScreen,
    });
  }

  public getHistory(): AnalyticsEvent[] {
    return [...this.eventHistory];
  }

  public clearHistory(): void {
    this.eventHistory = [];
  }
}

export const analytics = new AnalyticsDispatcher();
