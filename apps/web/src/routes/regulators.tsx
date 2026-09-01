import { Shield, ExternalLink, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";

const REGULATORS = [
  { 
    name: "Financial Conduct Authority (FCA)", 
    acronym: "FCA", 
    country: "United Kingdom", 
    flag: "🇬🇧", 
    trustScore: 9.8,
    tier: "Tier 1",
    description: "The FCA is one of the most respected regulatory bodies in the world, known for its strict enforcement of rules, protection of client funds, and up to £85,000 in compensation scheme (FSCS)." 
  },
  { 
    name: "Securities and Exchange Commission (SEC)", 
    acronym: "SEC", 
    country: "United States", 
    flag: "🇺🇸", 
    trustScore: 9.9,
    tier: "Tier 1",
    description: "The primary regulatory body in the US. highly stringent and focuses heavily on investor protection and fair, orderly, and efficient markets." 
  },
  { 
    name: "Australian Securities & Investments Commission", 
    acronym: "ASIC", 
    country: "Australia", 
    flag: "🇦🇺", 
    trustScore: 9.5,
    tier: "Tier 1",
    description: "ASIC enforces rigorous financial standards and conducts routine audits to ensure Australian brokers operate transparently." 
  },
  { 
    name: "Cyprus Securities and Exchange Commission", 
    acronym: "CySEC", 
    country: "Cyprus", 
    flag: "🇨🇾", 
    trustScore: 8.5,
    tier: "Tier 2",
    description: "A popular regulator for brokers operating in the European Economic Area (EEA), offering a balance of business-friendliness and investor protection." 
  },
  { 
    name: "Securities and Exchange Board of India", 
    acronym: "SEBI", 
    country: "India", 
    flag: "🇮🇳", 
    trustScore: 9.0,
    tier: "Tier 1",
    description: "SEBI strictly regulates the Indian securities and commodity market, ensuring retail investor protection and market integrity." 
  },
  { 
    name: "Financial Sector Conduct Authority", 
    acronym: "FSCA", 
    country: "South Africa", 
    flag: "🇿🇦", 
    trustScore: 8.0,
    tier: "Tier 2",
    description: "The FSCA is the market conduct regulator of financial institutions in South Africa. It's increasingly popular for offering flexible leverage while maintaining solid oversight." 
  },
];

export default function Regulators() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold mb-3">Global Regulators</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Learn about the regulatory authorities that oversee financial brokers, ensuring market integrity and the safety of your funds.
          </p>
        </div>
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search regulators..." className="pl-10 h-10" />
        </div>
      </div>

      {/* Regulators Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {REGULATORS.map((reg, index) => (
          <Card key={index} className="flex flex-col h-full hover:border-primary/50 transition-colors">
            <CardHeader className="pb-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <div className="text-4xl">{reg.flag}</div>
                <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-md font-semibold text-sm">
                  <Shield className="w-4 h-4" /> {reg.tier}
                </div>
              </div>
              <CardTitle className="text-xl">
                {reg.acronym}
                <span className="block text-sm font-normal text-muted-foreground mt-1 line-clamp-1" title={reg.name}>
                  {reg.name}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col">
              <div className="mb-4 text-sm flex justify-between items-center bg-muted/50 p-2 rounded-lg">
                <span className="text-muted-foreground">Trust Score</span>
                <span className="font-bold text-green-600 dark:text-green-400">{reg.trustScore} / 10</span>
              </div>
              <p className="text-sm text-muted-foreground flex-1 mb-6">
                {reg.description}
              </p>
              <Link to="/search" className="w-full mt-auto">
                <Button variant="outline" className="w-full flex items-center gap-2">
                  View Brokers Regulated <ExternalLink className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Explanation Section */}
      <div className="bg-muted/30 rounded-2xl p-8 md:p-12 border">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Why does regulation matter?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-2">Safety of Funds</h3>
            <p className="text-muted-foreground text-sm">Regulated brokers are often required to keep client funds in segregated bank accounts, protecting your money if the broker goes bankrupt.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Fair Trading</h3>
            <p className="text-muted-foreground text-sm">Authorities audit brokers to ensure transparent pricing, fair execution speeds, and to prevent market manipulation.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Dispute Resolution</h3>
            <p className="text-muted-foreground text-sm">If you face an issue with a regulated broker, you can escalate the complaint to the regulator or a financial ombudsman.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
