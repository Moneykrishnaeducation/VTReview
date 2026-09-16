import type { EvidenceItem } from "../types/admin";
import { StatusBadge } from "./status-badge";
import { FileText, ShieldCheck, Download, ExternalLink, Calendar, Hash, Eye } from "lucide-react";
import { useAdmin } from "../context/admin-context";

interface EvidenceCardProps {
  evidence: EvidenceItem;
  onInspect?: () => void;
}

export function EvidenceCard({ evidence, onInspect }: EvidenceCardProps) {
  const { setSelectedEvidenceModal } = useAdmin();

  const handleInspect = () => {
    if (onInspect) onInspect();
    else setSelectedEvidenceModal(evidence);
  };

  const getTypeLabel = (type: EvidenceItem["type"]) => {
    switch (type) {
      case "regulatory_register":
        return "Regulatory Register Snapshot";
      case "spread_test":
        return "Live Spread Telemetry Log";
      case "trading_statement":
        return "Trader Account Statement";
      case "broker_response":
        return "Official Broker Defense";
      case "complaint_proof":
        return "Wire Slip / Dispute Proof";
      default:
        return "Research Documentation";
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 text-xs space-y-3 transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] text-amber-400 font-bold bg-amber-950/40 border border-amber-800/60 px-2 py-0.5 rounded">
            <FileText className="h-3 w-3" />
            <span>{evidence.id}</span>
          </div>
          <StatusBadge status={evidence.status} size="sm" />
        </div>

        <h4 className="font-bold text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-2 mb-1">
          {evidence.title}
        </h4>

        <div className="text-[11px] text-slate-400 font-medium mb-2">
          {getTypeLabel(evidence.type)} • <span className="text-slate-300 font-bold">{evidence.relatedEntityName}</span>
        </div>

        <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2 bg-slate-950/60 p-2 rounded border border-slate-800/80 mb-3">
          {evidence.notes}
        </p>
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 font-mono">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{evidence.uploadedAt.split(" ")[0]}</span>
          </div>
          <div className="flex items-center gap-1">
            <Hash className="h-3 w-3" />
            <span className="truncate max-w-[100px]">{evidence.checksum.substring(0, 14)}...</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleInspect}
            className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5 text-amber-400" />
            <span>Inspect Evidence</span>
          </button>

          {evidence.sourceUrl && (
            <a
              href={evidence.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg hover:text-white transition-colors"
              title="Open Official Register Source"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
