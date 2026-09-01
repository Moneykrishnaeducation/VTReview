import { useParams } from "react-router";
import { ShieldCheck, Star, ExternalLink, MessageSquare, Scale, Globe, Calendar, Smartphone, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BrokerDetail() {
  const { id } = useParams();
  // In a real app, fetch broker details based on id
  const brokerName = id ? id.replace("-", " ").toUpperCase() : "EXNESS";

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Broker Header */}
      <Card className="mb-8 border-t-4 border-t-primary">
        <CardContent className="pt-8 pb-8 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-muted text-4xl font-bold shrink-0">
            {brokerName.substring(0, 2)}
          </div>
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-3xl font-bold">{brokerName}</h1>
              <div className="flex gap-2">
                <Button><ExternalLink className="mr-2 h-4 w-4" /> Visit Website</Button>
                <Button variant="outline"><MessageSquare className="mr-2 h-4 w-4" /> Write Review</Button>
                <Button variant="secondary"><Scale className="mr-2 h-4 w-4" /> Compare</Button>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm">
              <div className="flex items-center gap-1 text-yellow-500 font-medium text-lg">
                <Star className="h-5 w-5 fill-yellow-500" /> 4.8 / 5
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="mr-1 h-4 w-4" /> REGULATED
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t mt-4 text-sm">
              <div>
                <div className="text-muted-foreground flex items-center gap-1 mb-1"><Globe className="h-4 w-4" /> Country</div>
                <div className="font-medium">United Kingdom</div>
              </div>
              <div>
                <div className="text-muted-foreground flex items-center gap-1 mb-1"><Calendar className="h-4 w-4" /> Established</div>
                <div className="font-medium">2008 (15+ Years)</div>
              </div>
              <div>
                <div className="text-muted-foreground flex items-center gap-1 mb-1"><Smartphone className="h-4 w-4" /> Platforms</div>
                <div className="font-medium">MT4, MT5, WebTrader</div>
              </div>
              <div>
                <div className="text-muted-foreground flex items-center gap-1 mb-1"><Landmark className="h-4 w-4" /> Min Deposit</div>
                <div className="font-medium">$10</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Review Score Section */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: "Regulation", score: 4.9 },
                  { label: "Security", score: 4.8 },
                  { label: "Trading", score: 4.5 },
                  { label: "Support", score: 4.7 },
                  { label: "Reputation", score: 4.8 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="w-24 text-sm font-medium">{item.label}</span>
                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${(item.score / 5) * 100}%` }} />
                    </div>
                    <span className="w-8 text-right text-sm font-bold">{item.score}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Broker Overview */}
          <Card>
            <CardHeader>
              <CardTitle>About {brokerName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-muted-foreground leading-relaxed">
                {brokerName} is a globally recognized online trading platform offering access to a wide range of financial instruments including Forex, Commodities, Indices, and CFDs. Known for its ultra-low spreads and fast execution speeds.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Company Name:</span>
                  <span className="font-medium">{brokerName} Group Ltd</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Headquarters:</span>
                  <span className="font-medium">Cyprus, UK, Seychelles</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">support@{brokerName.toLowerCase()}.com</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Max Leverage:</span>
                  <span className="font-medium">1:2000 (Varies by region)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Reviews */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>User Reviews</CardTitle>
              <Button size="sm" variant="outline">Write a Review</Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { name: "John Doe", rating: 5, date: "2 days ago", content: "Excellent execution speed. Withdrawals are processed within hours." },
                { name: "Trader2026", rating: 4, date: "1 week ago", content: "Good platform, low spreads, but customer support took a while to respond during peak hours." }
              ].map((review, i) => (
                <div key={i} className="border-b last:border-0 pb-6 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs text-primary">
                        {review.name.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{review.name}</div>
                        <div className="text-xs text-muted-foreground">{review.date}</div>
                      </div>
                    </div>
                    <div className="flex">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} className={`h-4 w-4 ${star <= review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm mt-3">{review.content}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Regulation Section */}
          <Card>
            <CardHeader>
              <CardTitle>Regulation & License</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { org: "FCA", full: "Financial Conduct Authority", license: "123456", status: "Regulated", color: "text-green-500 bg-green-100" },
                { org: "CySEC", full: "Cyprus Securities and Exchange Commission", license: "120/10", status: "Regulated", color: "text-green-500 bg-green-100" },
                { org: "FSA", full: "Financial Services Authority (Seychelles)", license: "SD025", status: "Offshore Regulation", color: "text-yellow-600 bg-yellow-100" }
              ].map((reg, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2 font-bold text-lg">
                    <ShieldCheck className={`h-5 w-5 ${reg.color.split(" ")[0]}`} /> {reg.org}
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">{reg.full}</div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">License Number:</span>
                    <span className="font-medium">{reg.license}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={`font-semibold ${reg.color.split(" ")[0]}`}>{reg.status}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
