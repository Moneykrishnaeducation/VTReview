import { ShieldCheck, Percent, Zap, Wallet, Users, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function RankingMethodology() {
  const pillars = [
    {
      icon: <ShieldCheck className="h-5 w-5 text-emerald-400" />,
      title: "Regulatory Oversight & Fund Segregation",
      weight: "35% Weight",
      desc: "Verification of Tier-1 licenses (FCA, ASIC, CySEC), segregated client bank accounts, statutory compensation schemes, and operational longevity.",
    },
    {
      icon: <Percent className="h-5 w-5 text-primary" />,
      title: "Raw Spreads & Total Trading Costs",
      weight: "25% Weight",
      desc: "Live algorithmic auditing of EUR/USD, GBP/USD, and Gold raw spreads, swap overnight rates, commission per lot, and hidden account maintenance fees.",
    },
    {
      icon: <Zap className="h-5 w-5 text-sky-400" />,
      title: "Execution Velocity & Slippage",
      weight: "15% Weight",
      desc: "Latency testing to major Equinix LD4/NY4 data centers, order fill rejection rates, and slippage frequency during volatile news releases.",
    },
    {
      icon: <Wallet className="h-5 w-5 text-amber-400" />,
      title: "Deposit & Withdrawal Velocity",
      weight: "15% Weight",
      desc: "Hands-on testing of deposit gateways, automated instant payout channels, processing latency, and banking transfer reliability.",
    },
    {
      icon: <Users className="h-5 w-5 text-purple-400" />,
      title: "Trader Sentiment & 24/7 Support",
      weight: "10% Weight",
      desc: "Multilingual customer service responsiveness, resolution of exposure disputes, and verified trader satisfaction reviews.",
    },
  ];

  return (
    <section className="rounded-2xl border bg-card/60 p-6 sm:p-10 mb-14 shadow-sm">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <Badge variant="info" className="mb-2">
          Scientific Evaluation Framework
        </Badge>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          How VTINDEX Evaluates & Ranks Brokers
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2">
          Our scoring methodology combines live algorithmic transaction auditing, automated regulatory registry scrapers, and verified community sentiment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {pillars.map((pillar, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-muted/20 border border-border/50 hover:border-primary/40 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-muted/60 border">{pillar.icon}</div>
                <span className="text-xs font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                  {pillar.weight}
                </span>
              </div>
              <h4 className="font-bold text-sm text-foreground mb-2">{pillar.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          </div>
        ))}

        {/* 6th Tile: Zero Conflict of Interest guarantee */}
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              <span className="font-extrabold text-sm text-emerald-300">
                100% Unbiased & Independent
              </span>
            </div>
            <h4 className="font-bold text-sm text-foreground mb-2">
              Audits Conducted Monthly
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ranking positions in this directory cannot be bought. Our research analysts open real capital accounts monthly to verify pricing, spreads, and payout integrity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
