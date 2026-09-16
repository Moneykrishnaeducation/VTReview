import { createContext, useContext, useState, useEffect } from "react";
import type {
  AdminRole,
  RoleDefinition,
  BrokerAdmin,
  RegulatorAdmin,
  EvidenceItem,
  LicenseVerificationItem,
  RatingChangeProposal,
  ReviewModerationItem,
  ComplaintAdmin,
  EditorialGuide,
  UserAdmin,
  DataQualityIssue,
  JobQueueItem,
  AuditLogEntry,
  NotificationItem,
} from "../types/admin";
import {
  ROLES,
  INITIAL_BROKERS,
  INITIAL_REGULATORS,
  INITIAL_EVIDENCE,
  INITIAL_VERIFICATIONS,
  INITIAL_RATING_PROPOSALS,
  INITIAL_REVIEWS_MODERATION,
  INITIAL_COMPLAINTS,
  INITIAL_EDITORIAL_GUIDES,
  INITIAL_USERS,
  INITIAL_DATA_QUALITY_ISSUES,
  INITIAL_JOB_QUEUES,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from "../data/admin-data";

interface AdminContextType {
  // Role & RBAC
  activeRole: AdminRole;
  setActiveRole: (role: AdminRole) => void;
  activeRoleDef: RoleDefinition;
  hasPermission: (perm: string) => boolean;

  // Data Stores
  brokers: BrokerAdmin[];
  regulators: RegulatorAdmin[];
  evidenceList: EvidenceItem[];
  verifications: LicenseVerificationItem[];
  ratingProposals: RatingChangeProposal[];
  reviews: ReviewModerationItem[];
  complaints: ComplaintAdmin[];
  guides: EditorialGuide[];
  users: UserAdmin[];
  dataQualityIssues: DataQualityIssue[];
  jobQueues: JobQueueItem[];
  auditLogs: AuditLogEntry[];
  notifications: NotificationItem[];

  // Interactive Workflows
  verifyLicense: (id: string, notes: string) => void;
  rejectLicense: (id: string, notes: string) => void;
  submitRatingProposal: (proposal: Omit<RatingChangeProposal, "id" | "proposedAt" | "status">) => void;
  approveRatingProposal: (id: string, complianceNotes: string) => void;
  rejectRatingProposal: (id: string, complianceNotes: string) => void;
  moderateReview: (id: string, action: "approve" | "reject" | "flag" | "needs_clarification", notes?: string) => void;
  updateComplaintStatus: (id: string, status: ComplaintAdmin["status"], note: string) => void;
  publishGuide: (id: string) => void;
  addBroker: (broker: Omit<BrokerAdmin, "id" | "updatedAt" | "updatedBy">) => void;
  createGuide: (guide: Omit<EditorialGuide, "id" | "createdAt" | "updatedAt">) => EditorialGuide;
  updateGuide: (id: string, updates: Partial<EditorialGuide>) => void;
  updateBroker: (id: string, updates: Partial<BrokerAdmin>, reason?: string) => void;
  addEvidence: (evidence: Omit<EvidenceItem, "id" | "uploadedAt" | "uploadedBy" | "checksum"> & { checksum?: string }) => EvidenceItem;
  addRegulator: (regulator: Omit<RegulatorAdmin, "id" | "lastVerifiedDate" | "verificationOwner">) => RegulatorAdmin;
  addReview: (review: Omit<ReviewModerationItem, "id" | "submittedAt">) => void;
  addComplaint: (complaint: Omit<ComplaintAdmin, "id" | "caseNumber" | "submittedAt" | "updatedAt" | "timeline">) => void;
  addAuditLogEntry: (entry: Omit<AuditLogEntry, "id" | "timestamp" | "actorId" | "actorName" | "actorRole" | "ipAddress">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // UI Modals & Mobile Sidebar
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  selectedEvidenceModal: EvidenceItem | null;
  setSelectedEvidenceModal: (evidence: EvidenceItem | null) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (has: boolean) => void;

  // Quick Action Badge Counts
  pendingVerificationsCount: number;
  pendingReviewsCount: number;
  pendingComplaintsCount: number;
  pendingRatingsCount: number;
  unreadNotificationsCount: number;
  criticalIssuesCount: number;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRole] = useState<AdminRole>("super_admin");
  const [brokers, setBrokers] = useState<BrokerAdmin[]>(INITIAL_BROKERS);
  const [regulators, setRegulators] = useState<RegulatorAdmin[]>(INITIAL_REGULATORS);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>(INITIAL_EVIDENCE);
  const [verifications, setVerifications] = useState<LicenseVerificationItem[]>(INITIAL_VERIFICATIONS);
  const [ratingProposals, setRatingProposals] = useState<RatingChangeProposal[]>(INITIAL_RATING_PROPOSALS);
  const [reviews, setReviews] = useState<ReviewModerationItem[]>(INITIAL_REVIEWS_MODERATION);
  const [complaints, setComplaints] = useState<ComplaintAdmin[]>(INITIAL_COMPLAINTS);
  const [guides, setGuides] = useState<EditorialGuide[]>(INITIAL_EDITORIAL_GUIDES);
  const [users] = useState<UserAdmin[]>(INITIAL_USERS);
  const [dataQualityIssues] = useState<DataQualityIssue[]>(INITIAL_DATA_QUALITY_ISSUES);
  const [jobQueues] = useState<JobQueueItem[]>(INITIAL_JOB_QUEUES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // UI Modals & Mobile Sidebar
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedEvidenceModal, setSelectedEvidenceModal] = useState<EvidenceItem | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Active Role Def
  const activeRoleDef = ROLES.find((r) => r.id === activeRole) || ROLES[0];

  const hasPermission = (perm: string): boolean => {
    if (activeRoleDef.permissions.includes("*")) return true;
    return activeRoleDef.permissions.includes(perm);
  };

  // Helper to log audit entries
  const appendAuditLog = (entry: Omit<AuditLogEntry, "id" | "timestamp" | "actorId" | "actorName" | "actorRole" | "ipAddress">) => {
    const newLog: AuditLogEntry = {
      ...entry,
      id: `AUD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC",
      actorId: "usr-001",
      actorName: activeRoleDef.name,
      actorRole: activeRole,
      ipAddress: "192.168.1.42",
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Workflow A: Verify License
  const verifyLicense = (id: string, notes: string) => {
    const item = verifications.find((v) => v.id === id);
    if (!item) return;

    setVerifications((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status: "verified",
              reviewedBy: activeRoleDef.name,
              reviewedAt: new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC",
              reviewerNotes: notes,
            }
          : v
      )
    );

    // Update broker license status
    setBrokers((prev) =>
      prev.map((b) => {
        if (b.id === item.brokerId) {
          const updatedLicenses = b.licenses.map((lic) =>
            lic.licenseNumber === item.licenseNumber ? { ...lic, status: "verified" as const, verifiedBy: activeRoleDef.name } : lic
          );
          return { ...b, licenses: updatedLicenses, verificationStatus: "verified" as const, lastVerifiedDate: new Date().toISOString().split("T")[0] };
        }
        return b;
      })
    );

    appendAuditLog({
      action: "VERIFY",
      entityType: "license",
      entityId: id,
      entityName: `${item.brokerName} — ${item.regulatorCode} ${item.licenseNumber}`,
      summary: `Verified and certified ${item.regulatorCode} regulatory license.`,
      beforeValue: "Status: pending",
      afterValue: "Status: verified",
      reason: notes || "Direct regulatory register search verified.",
      evidenceId: item.evidenceId,
    });
  };

  // Reject License
  const rejectLicense = (id: string, notes: string) => {
    const item = verifications.find((v) => v.id === id);
    if (!item) return;

    setVerifications((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status: "rejected",
              reviewedBy: activeRoleDef.name,
              reviewedAt: new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC",
              reviewerNotes: notes,
            }
          : v
      )
    );

    appendAuditLog({
      action: "REJECT",
      entityType: "license",
      entityId: id,
      entityName: `${item.brokerName} — ${item.regulatorCode} ${item.licenseNumber}`,
      summary: `Rejected regulatory license verification application.`,
      beforeValue: "Status: pending",
      afterValue: "Status: rejected",
      reason: notes,
      evidenceId: item.evidenceId,
    });
  };

  // Workflow B: Submit Rating Proposal
  const submitRatingProposal = (proposalData: Omit<RatingChangeProposal, "id" | "proposedAt" | "status">) => {
    const newProp: RatingChangeProposal = {
      ...proposalData,
      id: `PROP-2026-${Math.floor(100 + Math.random() * 900)}`,
      proposedAt: new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC",
      status: "pending_review",
    };
    setRatingProposals((prev) => [newProp, ...prev]);

    appendAuditLog({
      action: "SCORE_CHANGE",
      entityType: "rating",
      entityId: newProp.brokerId,
      entityName: `${newProp.brokerName} (${newProp.pillarName})`,
      summary: `Proposed score change of ${newProp.scoreDelta > 0 ? "+" : ""}${newProp.scoreDelta} pts.`,
      beforeValue: `Pillar Score: ${newProp.currentScore}`,
      afterValue: `Proposed: ${newProp.proposedScore}`,
      reason: newProp.reason,
      evidenceId: newProp.evidenceId,
    });
  };

  // Approve Rating Proposal
  const approveRatingProposal = (id: string, complianceNotes: string) => {
    const prop = ratingProposals.find((p) => p.id === id);
    if (!prop) return;

    setRatingProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "approved", reviewedBy: activeRoleDef.name, reviewedAt: new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC", complianceNotes } : p))
    );

    // Apply score update to broker
    setBrokers((prev) =>
      prev.map((b) => {
        if (b.id === prop.brokerId) {
          const updatedPillars = b.pillars.map((pil) => (pil.pillarId === prop.pillarId ? { ...pil, score: prop.proposedScore } : pil));
          return {
            ...b,
            pillars: updatedPillars,
            editorialScore: prop.proposedTotalRating,
            starRating: Number(((prop.proposedTotalRating / 100) * 5).toFixed(1)),
            updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC",
            updatedBy: activeRoleDef.name,
          };
        }
        return b;
      })
    );

    appendAuditLog({
      action: "APPROVE",
      entityType: "rating",
      entityId: prop.brokerId,
      entityName: `${prop.brokerName} (${prop.pillarName})`,
      summary: `Approved rating change from ${prop.currentScore} to ${prop.proposedScore} pts. Total score updated to ${prop.proposedTotalRating}.`,
      beforeValue: `Total Score: ${prop.currentTotalRating}`,
      afterValue: `Total Score: ${prop.proposedTotalRating}`,
      reason: complianceNotes || "Compliance approval granted.",
      evidenceId: prop.evidenceId,
    });
  };

  // Reject Rating Proposal
  const rejectRatingProposal = (id: string, complianceNotes: string) => {
    setRatingProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "rejected", reviewedBy: activeRoleDef.name, reviewedAt: new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC", complianceNotes } : p))
    );
  };

  // Workflow C: Moderate Review
  const moderateReview = (id: string, action: "approve" | "reject" | "flag" | "needs_clarification", notes?: string) => {
    const rev = reviews.find((r) => r.id === id);
    if (!rev) return;

    const statusMap = {
      approve: "approved" as const,
      reject: "rejected" as const,
      flag: "flagged" as const,
      needs_clarification: "needs_clarification" as const,
    };

    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: statusMap[action],
              assignedModerator: activeRoleDef.name,
              moderatorNotes: notes || r.moderatorNotes,
            }
          : r
      )
    );

    appendAuditLog({
      action: action === "approve" ? "APPROVE" : action === "reject" ? "REJECT" : "UPDATE",
      entityType: "review",
      entityId: id,
      entityName: `Review by ${rev.userName} on ${rev.brokerName}`,
      summary: `Moderation action: ${action.toUpperCase()}`,
      beforeValue: `Status: ${rev.status}`,
      afterValue: `Status: ${statusMap[action]}`,
      reason: notes || "Review triage completed.",
    });
  };

  // Workflow D: Update Complaint Status
  const updateComplaintStatus = (id: string, status: ComplaintAdmin["status"], note: string) => {
    const cmp = complaints.find((c) => c.id === id);
    if (!cmp) return;

    const newTimelineEntry = {
      id: `t-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC",
      actor: activeRoleDef.name,
      role: activeRoleDef.id,
      title: `Status updated to ${status.replace("_", " ").toUpperCase()}`,
      description: note,
    };

    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC",
              timeline: [newTimelineEntry, ...c.timeline],
            }
          : c
      )
    );

    appendAuditLog({
      action: status === "resolved" ? "RESOLVE" : "UPDATE",
      entityType: "complaint",
      entityId: id,
      entityName: `Complaint Case ${cmp.caseNumber} against ${cmp.brokerName}`,
      summary: `Dispute status changed to ${status}.`,
      beforeValue: `Status: ${cmp.status}`,
      afterValue: `Status: ${status}`,
      reason: note,
    });
  };

  // Workflow E: Publish Guide
  const publishGuide = (id: string) => {
    const gd = guides.find((g) => g.id === id);
    if (!gd) return;

    setGuides((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              status: "published",
              publishedAt: new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC",
              complianceSignedBy: activeRoleDef.name,
              complianceSignedAt: new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC",
            }
          : g
      )
    );

    appendAuditLog({
      action: "PUBLISH",
      entityType: "guide",
      entityId: id,
      entityName: gd.title,
      summary: `Published educational research guide to public platform.`,
      beforeValue: `Status: ${gd.status}`,
      afterValue: "Status: published",
      reason: "Editorial fact-check and compliance sign-off certified.",
    });
  };

  // Add New Broker
  const addBroker = (brokerData: Omit<BrokerAdmin, "id" | "updatedAt" | "updatedBy">) => {
    const slug = brokerData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const newBroker: BrokerAdmin = {
      ...brokerData,
      id: `brk-${slug}-${Math.floor(1000 + Math.random() * 9000)}`,
      slug: brokerData.slug || slug,
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC",
      updatedBy: activeRoleDef.name,
    };
    setBrokers((prev) => [newBroker, ...prev]);

    appendAuditLog({
      action: "CREATE",
      entityType: "broker",
      entityId: newBroker.id,
      entityName: newBroker.name,
      summary: `New broker research record created: ${newBroker.name}`,
      afterValue: `Status: ${newBroker.status} | Tier: ${newBroker.tier}`,
      reason: "Manual broker record creation by research team.",
    });
  };

  // Create Guide
  const createGuide = (guideData: Omit<EditorialGuide, "id" | "createdAt" | "updatedAt">): EditorialGuide => {
    const newId = `gd-${String(guides.length + 1).padStart(3, "0")}`;
    const now = new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC";
    const newGuide: EditorialGuide = {
      ...guideData,
      id: newId,
      createdAt: now,
      updatedAt: now,
    };
    setGuides((prev) => [newGuide, ...prev]);
    appendAuditLog({
      action: "CREATE",
      entityType: "guide",
      entityId: newId,
      entityName: newGuide.title,
      summary: `Created new editorial guide (${newGuide.category}).`,
      beforeValue: "N/A",
      afterValue: `Status: ${newGuide.status}`,
      reason: "Editorial workflow drafting initialized.",
    });
    return newGuide;
  };

  // Update Guide
  const updateGuide = (id: string, updates: Partial<EditorialGuide>) => {
    const gd = guides.find((g) => g.id === id);
    if (!gd) return;
    const now = new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC";
    setGuides((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates, updatedAt: now } : g))
    );
    appendAuditLog({
      action: "UPDATE",
      entityType: "guide",
      entityId: id,
      entityName: gd.title,
      summary: `Updated editorial research guide content/metadata.`,
      beforeValue: `Status: ${gd.status}`,
      afterValue: `Status: ${updates.status || gd.status}`,
      reason: "Editorial revision saved.",
    });
  };

  // Update Broker
  const updateBroker = (id: string, updates: Partial<BrokerAdmin>, reason?: string) => {
    const b = brokers.find((brk) => brk.id === id);
    if (!b) return;

    setBrokers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC", updatedBy: activeRoleDef.name } : item))
    );

    appendAuditLog({
      action: "UPDATE",
      entityType: "broker",
      entityId: id,
      entityName: b.name,
      summary: `Updated broker profile specifications.`,
      reason: reason || "Research audit data refreshed.",
    });
  };

  // Ingest New Evidence Item
  const addEvidence = (evidence: Omit<EvidenceItem, "id" | "uploadedAt" | "uploadedBy" | "checksum"> & { checksum?: string }): EvidenceItem => {
    const randomHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const newId = `EVD-2026-${String(evidenceList.length + 1).padStart(3, "0")}`;
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC";

    const newEvidence: EvidenceItem = {
      ...evidence,
      id: newId,
      uploadedAt: timestamp,
      uploadedBy: activeRoleDef.name,
      checksum: evidence.checksum || `sha256:${randomHash}`,
    };

    setEvidenceList((prev) => [newEvidence, ...prev]);

    appendAuditLog({
      action: "CREATE",
      entityType: "evidence",
      entityId: newId,
      entityName: newEvidence.title,
      summary: `Ingested new cryptographically hashed evidence record for ${newEvidence.relatedEntityName}.`,
      afterValue: `Status: ${newEvidence.status} | Checksum: ${newEvidence.checksum.substring(0, 16)}...`,
      reason: newEvidence.notes || "Auditor evidence ingestion.",
    });

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "New Evidence Ingested",
        message: `"${newEvidence.title}" linked to ${newEvidence.relatedEntityName} sealed with SHA-256 hash.`,
        type: "system_notice",
        priority: "medium",
        createdAt: "Just now",
        read: false,
        actionUrl: "/evidence",
      },
      ...prev,
    ]);

    return newEvidence;
  };

  // Register New Statutory Regulator Authority
  const addRegulator = (regulator: Omit<RegulatorAdmin, "id" | "lastVerifiedDate" | "verificationOwner">): RegulatorAdmin => {
    const cleanCode = regulator.code.toLowerCase().replace(/[^a-z0-9]/g, "");
    const newId = `reg-${cleanCode}-${Date.now().toString().slice(-4)}`;
    const today = new Date().toISOString().split("T")[0];

    const newRegulator: RegulatorAdmin = {
      ...regulator,
      id: newId,
      lastVerifiedDate: today,
      verificationOwner: activeRoleDef.name,
    };

    setRegulators((prev) => [newRegulator, ...prev]);

    appendAuditLog({
      action: "CREATE",
      entityType: "regulator" as any,
      entityId: newId,
      entityName: `${newRegulator.code} (${newRegulator.name})`,
      summary: `Registered new statutory regulatory authority in ${newRegulator.jurisdiction} (${newRegulator.tier}).`,
      afterValue: `Tier: ${newRegulator.tier} | Scheme: ${newRegulator.compensationScheme}`,
      reason: "Statutory jurisdiction catalog expansion.",
    });

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "New Regulatory Authority Registered",
        message: `${newRegulator.code} (${newRegulator.jurisdiction}) added to the global regulatory registry.`,
        type: "system_notice",
        priority: "medium",
        createdAt: "Just now",
        read: false,
        actionUrl: "/regulation/regulators",
      },
      ...prev,
    ]);

    return newRegulator;
  };

  // Add Trader Review
  const addReview = (reviewData: Omit<ReviewModerationItem, "id" | "submittedAt">) => {
    const newRev: ReviewModerationItem = {
      ...reviewData,
      id: `rev-${Date.now().toString().slice(-4)}`,
      submittedAt: new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC",
    };
    setReviews((prev) => [newRev, ...prev]);
    appendAuditLog({
      action: "CREATE",
      entityType: "review",
      entityId: newRev.id,
      entityName: `Review by ${newRev.userName} on ${newRev.brokerName}`,
      summary: `Logged community review: "${newRev.title}" (${newRev.rating}★).`,
      afterValue: `Status: ${newRev.status}`,
    });
  };

  // Add Dispute / Complaint Case
  const addComplaint = (
    complaintData: Omit<ComplaintAdmin, "id" | "caseNumber" | "submittedAt" | "updatedAt" | "timeline">
  ) => {
    const caseNum = `CMP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC";
    const newCmp: ComplaintAdmin = {
      ...complaintData,
      id: `cmp-${Date.now().toString().slice(-4)}`,
      caseNumber: caseNum,
      submittedAt: now,
      updatedAt: now,
      timeline: [
        {
          id: `t-${Date.now()}`,
          timestamp: now,
          actor: activeRoleDef.name,
          role: activeRoleDef.id,
          title: "Dispute Case Logged",
          description: `Dispute claim of ${complaintData.currency} ${complaintData.claimAmount} filed against ${complaintData.brokerName}.`,
        },
      ],
    };
    setComplaints((prev) => [newCmp, ...prev]);
    appendAuditLog({
      action: "CREATE",
      entityType: "complaint",
      entityId: newCmp.id,
      entityName: `Complaint Case ${caseNum} against ${newCmp.brokerName}`,
      summary: `Logged dispute case: ${newCmp.claimTitle}`,
      afterValue: `Status: ${newCmp.status}`,
    });
  };

  const addAuditLogEntry = appendAuditLog;

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Keyboard shortcut for Global Search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const pendingVerificationsCount = verifications.filter((v) => v.status === "pending").length;
  const pendingReviewsCount = reviews.filter((r) => r.status === "pending" || r.status === "flagged").length;
  const pendingComplaintsCount = complaints.filter((c) => c.status === "submitted" || c.status === "under_review" || c.status === "evidence_review").length;
  const pendingRatingsCount = ratingProposals.filter((p) => p.status === "pending_review").length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const criticalIssuesCount = dataQualityIssues.filter((d) => d.severity === "critical" && !d.resolved).length;

  return (
    <AdminContext.Provider
      value={{
        activeRole,
        setActiveRole,
        activeRoleDef,
        hasPermission,
        brokers,
        regulators,
        evidenceList,
        verifications,
        ratingProposals,
        reviews,
        complaints,
        guides,
        users,
        dataQualityIssues,
        jobQueues,
        auditLogs,
        notifications,
        verifyLicense,
        rejectLicense,
        submitRatingProposal,
        approveRatingProposal,
        rejectRatingProposal,
        moderateReview,
        updateComplaintStatus,
        publishGuide,
        addBroker,
        createGuide,
        updateGuide,
        updateBroker,
        addEvidence,
        addRegulator,
        addReview,
        addComplaint,
        addAuditLogEntry,
        markNotificationRead,
        markAllNotificationsRead,
        isSearchOpen,
        setIsSearchOpen,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        selectedEvidenceModal,
        setSelectedEvidenceModal,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        pendingVerificationsCount,
        pendingReviewsCount,
        pendingComplaintsCount,
        pendingRatingsCount,
        unreadNotificationsCount,
        criticalIssuesCount,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
