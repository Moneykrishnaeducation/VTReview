import { Link } from "react-router";
import { ShieldCheck, Calendar, Globe, Star, ArrowUpRight, Scale, Zap, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface BrokerCardData {
  id?: string;
  slug?: string;
  name: string;
  rating: number;
  overallScore?: number;
  regulation?: string;
  regulatoryStatus?: string;
  regulators?: string[];
  established: string;
  country?: string;
  headquarters?: string;
  countryFlag?: string;
  logo: string;
  minDeposit?: number | string;
  maxLeverage?: string;
  eurUsdSpread?: string;
  tagline?: string;
  bestFor?: string;
}

export default function BrokerCard({ broker }: { broker: BrokerCardData }) {
  const brokerId = broker.slug || broker.id || broker.name.toLowerCase().replace(/\s+/g, "-");
  const regStatus = broker.regulatoryStatus || broker.regulation || "Regulated";
  const isVerified =
    regStatus.toLowerCase().includes("verified") ||
    regStatus.toLowerCase().includes("regulated") ||
    regStatus.toLowerCase().includes("tier-1");

  const score = broker.overallScore || (broker.rating > 5 ? broker.rating : broker.rating * 2);
  const location = broker.country || broker.headquarters || "Global";

  return (
    <Card className="flex flex-col h-full bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-200 group relative overflow-hidden">
      {/* Top Accent Gradient Border */}
      <div className="h-1 w-full bg-gradient-to-r from-primary/60 via-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />

      <CardHeader className="pb-3 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 via-primary/5 to-muted text-primary text-xl font-extrabold border border-primary/20 shadow-xs group-hover:scale-105 transition-transform">
              {broker.logo}
            </div>
            <div>
              <Link to={`/broker/${brokerId}`}>
                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5 line-clamp-1">
                  {broker.name}
                  <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                </h3>
              </Link>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span>{broker.countryFlag || "📍"} {location}</span>
                <span>•</span>
                <span>Est. {broker.established}</span>
              </div>
            </div>
          </div>

          {/* Rating Badge */}
          <div className="text-right shrink-0">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold text-sm">
              <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
              {score.toFixed(1)}
              <span className="text-[10px] font-normal text-muted-foreground">/10</span>
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              {broker.rating <= 5 ? `${broker.rating.toFixed(1)} / 5 Rating` : "Trust Score"}
            </div>
          </div>
        </div>

        {broker.tagline && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-2 pt-1 border-t border-border/40">
            {broker.tagline}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-3 text-xs pt-1">
        {/* Regulation Pill */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border/40">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <ShieldCheck className={`h-4 w-4 ${isVerified ? "text-emerald-500" : "text-muted-foreground"}`} />
            <span>Regulation</span>
          </div>
          <div className="flex items-center gap-1">
            <Badge
              variant="outline"
              className={`text-[11px] font-semibold ${
                isVerified
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
              }`}
            >
              {regStatus}
            </Badge>
          </div>
        </div>

        {/* Key Specs Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2 rounded-lg bg-muted/20 border border-border/30">
            <div className="text-[10px] text-muted-foreground">Min. Deposit</div>
            <div className="font-bold text-foreground mt-0.5">
              {typeof broker.minDeposit === "number" ? `$${broker.minDeposit}` : broker.minDeposit || "$10"}
            </div>
          </div>

          <div className="p-2 rounded-lg bg-muted/20 border border-border/30">
            <div className="text-[10px] text-muted-foreground">Max. Leverage</div>
            <div className="font-bold text-foreground mt-0.5">
              {broker.maxLeverage || "1:500"}
            </div>
          </div>
        </div>

        {broker.regulators && broker.regulators.length > 0 && (
          <div className="flex flex-wrap gap-1 items-center pt-1">
            <span className="text-[10px] text-muted-foreground mr-1">Licenses:</span>
            {broker.regulators.slice(0, 4).map((reg) => (
              <span
                key={reg}
                className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground"
              >
                {reg}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-3 border-t bg-muted/10 flex gap-2">
        <Link to={`/broker/${brokerId}`} className="flex-1">
          <Button className="w-full h-9 text-xs font-semibold" variant="outline">
            Full Review
          </Button>
        </Link>
        <Link to={`/compare`}>
          <Button size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground hover:text-foreground" title="Compare Broker">
            <Scale className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

