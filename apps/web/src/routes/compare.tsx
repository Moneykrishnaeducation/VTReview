import { Search, ShieldCheck, X, Scale } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";

export default function Compare() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Scale className="h-8 w-8 text-primary" /> Compare Brokers
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Compare trading platforms side-by-side to find the broker that best fits your trading strategy.
        </p>
      </div>

      <div className="overflow-x-auto pb-8">
        <table className="w-full min-w-[800px] border-collapse bg-card rounded-xl overflow-hidden shadow-sm border">
          <thead>
            <tr>
              <th className="p-6 border-b border-r w-1/4 align-bottom">
                <div className="text-left font-bold text-lg text-muted-foreground">Attributes</div>
              </th>
              {/* Broker 1 */}
              <th className="p-6 border-b border-r w-1/4">
                <div className="relative mb-4">
                  <Input placeholder="Search Broker..." defaultValue="IC Markets" className="font-semibold text-center pr-8" />
                  <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-8 w-8"><X className="h-4 w-4" /></Button>
                </div>
                <div className="flex justify-center mb-2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted text-xl font-bold">IC</div>
                </div>
                <div className="text-center font-bold text-lg">IC Markets</div>
              </th>
              {/* Broker 2 */}
              <th className="p-6 border-b border-r w-1/4">
                <div className="relative mb-4">
                  <Input placeholder="Search Broker..." defaultValue="Exness" className="font-semibold text-center pr-8" />
                  <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-8 w-8"><X className="h-4 w-4" /></Button>
                </div>
                <div className="flex justify-center mb-2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted text-xl font-bold">EX</div>
                </div>
                <div className="text-center font-bold text-lg">Exness</div>
              </th>
              {/* Broker 3 */}
              <th className="p-6 border-b w-1/4 bg-muted/20">
                <div className="flex h-full items-center justify-center min-h-[160px]">
                  <Button variant="outline" className="border-dashed"><Search className="mr-2 h-4 w-4" /> Add Broker</Button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "Overall Score", v1: "9.5", v2: "9.2", v3: "-" },
              { label: "Regulation", v1: <span className="text-green-500 font-medium">Yes</span>, v2: <span className="text-green-500 font-medium">Yes</span>, v3: "-" },
              { label: "Minimum Deposit", v1: "$200", v2: "$10", v3: "-" },
              { label: "Max Leverage", v1: "1:500", v2: "1:2000", v3: "-" },
              { label: "MT4 Support", v1: "Yes", v2: "Yes", v3: "-" },
              { label: "MT5 Support", v1: "Yes", v2: "Yes", v3: "-" },
              { label: "Copy Trading", v1: "ZuluTrade, cTrader", v2: "Social Trading App", v3: "-" },
              { label: "User Rating", v1: "4.8", v2: "4.5", v3: "-" },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-muted/30 transition-colors">
                <td className="p-4 border-b border-r font-medium text-muted-foreground">{row.label}</td>
                <td className="p-4 border-b border-r text-center font-semibold">{row.v1}</td>
                <td className="p-4 border-b border-r text-center font-semibold">{row.v2}</td>
                <td className="p-4 border-b text-center text-muted-foreground">{row.v3}</td>
              </tr>
            ))}
            <tr>
              <td className="p-6 border-r"></td>
              <td className="p-6 border-r text-center">
                <Link to="/broker/ic-markets" className="w-full">
                  <Button className="w-full">View Details</Button>
                </Link>
              </td>
              <td className="p-6 border-r text-center">
                <Link to="/broker/exness" className="w-full">
                  <Button className="w-full">View Details</Button>
                </Link>
              </td>
              <td className="p-6"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
