import React, { useState } from "react";
import { useAdmin } from "../../context/admin-context";
import type { RegulatorAdmin } from "../../types/admin";
import { DataTable, type Column } from "../../components/data-table";
import { StatusBadge } from "../../components/status-badge";
import { Scale, ShieldCheck, ExternalLink, Building2, Plus, Download } from "lucide-react";

export default function RegulatorsList() {
  const { regulators } = useAdmin();
  const [selectedRegulator, setSelectedRegulator] = useState<RegulatorAdmin | null>(null);

  const columns: Column<RegulatorAdmin>[] = [
    {
      header: "Regulator & Jurisdiction",
      accessorKey: "name",
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span className="text-xl">{row.flag}</span>
          <div>
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>{row.code}</span>
              <span className="text-slate-400 font-normal">({row.name})</span>
            </div>
            <div className="text-[11px] text-slate-400">{row.jurisdiction}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Tier Classification",
      accessorKey: "tier",
      sortable: true,
      cell: (row) => <StatusBadge status={row.tier} size="sm" />,
    },
    {
      header: "Compensation Scheme",
      accessorKey: "compensationScheme",
      cell: (row) => (
        <div className="text-[11px] text-slate-300">
          <div className="font-medium">{row.compensationScheme}</div>
          <div className="font-mono text-emerald-400 text-[10px] font-bold">{row.maxCoverageFormatted}</div>
        </div>
      ),
    },
    {
      header: "Active Brokers",
      accessorKey: "activeBrokersCount",
      sortable: true,
      cell: (row) => <span className="font-mono font-bold text-amber-400">{row.activeBrokersCount} Verified</span>,
    },
    {
      header: "Last Audit",
      accessorKey: "lastVerifiedDate",
      sortable: true,
      cell: (row) => (
        <div className="text-[11px] font-mono text-slate-400">
          <div>{row.lastVerifiedDate}</div>
          <div className="text-[10px] text-slate-500 truncate max-w-[120px]">{row.verificationOwner}</div>
        </div>
      ),
    },
    {
      header: "Official Register",
      cell: (row) => (
        <a
          href={row.registerSearchUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 hover:underline text-xs font-semibold"
        >
          <span>Search Portal</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-400 font-mono text-[11px] mb-1">
            <Scale className="h-3.5 w-3.5 text-blue-400" />
            <span>GLOBAL REGULATORY REGISTRY ({regulators.length} Authorities)</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Statutory Regulators & Compensation Schemes
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold border border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer">
            <Download className="h-3.5 w-3.5" />
            <span>Export Registry</span>
          </button>
        </div>
      </div>

      {/* Regulators Table */}
      <DataTable
        data={regulators}
        columns={columns}
        searchPlaceholder="Search regulator code, country, compensation scheme..."
        searchKey="name"
        onRowClick={(row) => setSelectedRegulator(row)}
      />

      {/* Regulator Detail Drawer/Modal */}
      {selectedRegulator && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-xs space-y-4 animate-in fade-in">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedRegulator.flag}</span>
              <div>
                <h3 className="text-base font-bold text-white">
                  {selectedRegulator.name} ({selectedRegulator.code})
                </h3>
                <div className="text-slate-400">{selectedRegulator.jurisdiction} • {selectedRegulator.tier}</div>
              </div>
            </div>
            <button
              onClick={() => setSelectedRegulator(null)}
              className="text-slate-400 hover:text-white font-bold"
            >
              ✕ Close
            </button>
          </div>

          <p className="text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
            {selectedRegulator.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-slate-200">Statutory Compensation Protection</div>
              <div className="text-slate-400">{selectedRegulator.compensationScheme}</div>
              <div className="font-mono text-emerald-400 font-bold">{selectedRegulator.maxCoverageFormatted}</div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-slate-200">Statutory Enforcement Powers</div>
              <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                {selectedRegulator.powers.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
