export type ComplaintStatus =
  | "submitted"
  | "under_review"
  | "broker_notified"
  | "broker_responded"
  | "resolved"
  | "unresolved";

export interface DisputeTimelineEntry {
  date: string;
  status: ComplaintStatus;
  note: string;
  actor: "trader" | "broker_representative" | "independent_moderator";
}

export interface ComplaintDomainModel {
  id: string;
  brokerId: string;
  brokerName: string;
  traderAlias: string;
  country: string;
  amountClaimed: number;
  currency: string;
  category: "Withdrawal Delay" | "Execution / Slippage" | "Account Termination" | "Unauthorized Fees";
  headline: string;
  allegationDetails: string;
  status: ComplaintStatus;
  dateSubmitted: string;
  timeline: DisputeTimelineEntry[];
  brokerResponse?: {
    date: string;
    responder: string;
    statement: string;
  };
  resolutionNote?: string;
  isVerifiedIncident: boolean;
}
