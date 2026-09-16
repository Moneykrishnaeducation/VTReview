import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Plus,
  Sliders,
  Database,
  Search,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const [pendingQueue, setPendingQueue] = useState([
    {
      id: "q1",
      broker: "AxiTrader Pro",
      regulator: "ASIC 318232",
      submittedBy: "Compliance Team",
      time: "10 mins ago",
      type: "License Verification",
    },
    {
      id: "q2",
      broker: "FXGlobe Prime",
      regulator: "CySEC 205/13",
      submittedBy: "Broker Partner",
      time: "35 mins ago",
      type: "New Broker Onboarding",
    },
    {
      id: "q3",
      broker: "CloneShield Portal",
      regulator: "Unlicensed",
      submittedBy: "Automated Web Crawler",
      time: "2 hours ago",
      type: "Scam Blacklist Flag",
    },
  ]);

  const [disputeQueue, setDisputeQueue] = useState([
    {
      id: "d1",
      user: "Trader_9812",
      broker: "QuantumFX Capital",
      issue: "Withdrawal Frozen ($3,450)",
      priority: "High",
      status: "Investigating",
    },
    {
      id: "d2",
      user: "FX_Pro_UK",
      broker: "FastTrade Global",
      issue: "Margin Stop-out Mismatch",
      priority: "Medium",
      status: "Awaiting Broker Response",
    },
  ]);

  const handleApprove = (id: string) => {
    setPendingQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const handleReject = (id: string) => {
    setPendingQueue((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> VTINDEX Core Operations
          </div>
          <h1 className="text-3xl font-extrabold text-foreground">Admin & Surveillance Console</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Monitor verified brokers, audit regulatory licenses, and process community disputes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs text-emerald-500 border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse" /> System Operational
          </Badge>
          <Button size="sm" className="font-bold text-xs rounded-xl h-9">
            <Plus className="mr-1.5 h-3.5 w-3.5" /> New Broker Entry
          </Button>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            title: "Total Monitored Brokers",
            value: "10,482",
            icon: TrendingUp,
            trend: "+14 this week",
            color: "text-primary",
          },
          {
            title: "Active Verified Traders",
            value: "254,190",
            icon: Users,
            trend: "+6.2% this month",
            color: "text-emerald-500",
          },
          {
            title: "Pending License Audits",
            value: `${pendingQueue.length}`,
            icon: ShieldCheck,
            trend: "Action required",
            color: "text-amber-500",
          },
          {
            title: "Active Dispute Tickets",
            value: `${disputeQueue.length}`,
            icon: AlertTriangle,
            trend: "1 high priority",
            color: "text-rose-500",
          },
        ].map((stat, i) => (
          <Card key={i} className="p-5 bg-card border hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold mb-2">
              <span>{stat.title}</span>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className="text-2xl font-black text-foreground">{stat.value}</div>
            <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1 font-medium">
              <ArrowUpRight className="h-3 w-3 text-emerald-500" /> {stat.trend}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Verification Queue (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between pb-4 border-b mb-4">
              <div>
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" /> Regulatory Audit Queue
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Brokers pending license cross-verification with FCA/ASIC/CySEC
                </p>
              </div>
              <Badge variant="secondary" className="text-xs font-bold">
                {pendingQueue.length} Pending
              </Badge>
            </div>

            {pendingQueue.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-xs">
                All verification queue items have been processed!
              </div>
            ) : (
              <div className="space-y-3">
                {pendingQueue.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-sm text-foreground flex items-center gap-2">
                        {item.broker}
                        <Badge variant="outline" className="text-[10px] font-normal">
                          {item.type}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground">
                        License Claim: <strong className="text-foreground">{item.regulator}</strong> • Source: {item.submittedBy}
                      </div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {item.time}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(item.id)}
                        className="h-8 px-3 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg gap-1"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(item.id)}
                        className="h-8 px-3 text-xs font-bold rounded-lg gap-1"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Active Trader Disputes & Mediation */}
          <Card className="p-6">
            <div className="flex items-center justify-between pb-4 border-b mb-4">
              <div>
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-rose-500" /> Active Trader Dispute Mediation
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Community exposure complaints requiring mediator review
                </p>
              </div>
              <Badge variant="destructive" className="text-xs font-bold">
                {disputeQueue.length} Open
              </Badge>
            </div>

            <div className="space-y-3 text-xs">
              {disputeQueue.map((disp) => (
                <div key={disp.id} className="p-4 rounded-xl border bg-card flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-foreground">{disp.issue}</div>
                    <div className="text-muted-foreground">
                      Trader: <strong className="text-foreground">{disp.user}</strong> • Against: <strong className="text-rose-500">{disp.broker}</strong>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant="outline" className="text-[10px] font-bold text-amber-500 border-amber-500/30">
                      {disp.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Admin Quick Tools (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-base text-foreground mb-4">Quick Admin Tasks</h3>
            <div className="space-y-2 text-xs">
              {[
                { label: "Trigger Automated License Sync", icon: Database },
                { label: "Update Regulatory Blacklist Feed", icon: ShieldCheck },
                { label: "Export Quarterly Broker Benchmark", icon: TrendingUp },
                { label: "Configure VT Score Weightings", icon: Sliders },
              ].map((task, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted text-left font-semibold text-foreground transition-colors border"
                >
                  <task.icon className="h-4 w-4 text-primary shrink-0" />
                  <span>{task.label}</span>
                </button>
              ))}
            </div>
          </Card>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-card border text-center space-y-2">
            <h4 className="font-bold text-sm text-foreground">Surveillance API Active</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Real-time webhook feeds connected to FCA, ASIC, and CySEC enforcement feeds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

