import { Star, ShieldCheck, Trophy, Target, Zap, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";

const CATEGORIES = [
  { name: "Top Rated Brokers", icon: <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" /> },
  { name: "Safest Brokers", icon: <ShieldCheck className="h-5 w-5 text-green-500" /> },
  { name: "Most Popular Brokers", icon: <Trophy className="h-5 w-5 text-amber-500" /> },
  { name: "Best Forex Brokers", icon: <Target className="h-5 w-5 text-blue-500" /> },
  { name: "Low Deposit Brokers", icon: <DollarSign className="h-5 w-5 text-emerald-500" /> },
  { name: "Fast Withdrawal Brokers", icon: <Zap className="h-5 w-5 text-purple-500" /> },
];

const RANKINGS = [
  { rank: 1, name: "IC Markets", rating: 9.5, regulation: "Regulated", reviews: 1250, logo: "IC" },
  { rank: 2, name: "Exness", rating: 9.2, regulation: "Regulated", reviews: 980, logo: "EX" },
  { rank: 3, name: "XM", rating: 8.9, regulation: "Verified", reviews: 760, logo: "XM" },
  { rank: 4, name: "OctaFX", rating: 8.5, regulation: "Verified", reviews: 540, logo: "OC" },
  { rank: 5, name: "Tickmill", rating: 8.3, regulation: "Regulated", reviews: 420, logo: "TM" },
];

export default function Rankings() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold">Broker Rankings</h1>
        <p className="text-muted-foreground text-center md:text-right max-w-md">
          Discover the best trading platforms ranked by overall score, safety, and user reviews.
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat, i) => (
          <Button key={i} variant={i === 0 ? "default" : "outline"} className="rounded-full h-10 px-4 flex items-center gap-2">
            {cat.icon}
            {cat.name}
          </Button>
        ))}
      </div>

      {/* Rankings List */}
      <div className="space-y-4">
        {RANKINGS.map((broker) => (
          <Card key={broker.rank} className="hover:border-primary transition-colors">
            <CardContent className="p-0 flex flex-col md:flex-row items-center">
              {/* Rank Number */}
              <div className="flex md:flex-col items-center justify-center w-full md:w-24 p-4 md:border-r bg-muted/20 text-3xl font-bold">
                <span className="text-muted-foreground text-sm font-medium mr-2 md:mr-0 md:mb-1">Rank</span>
                #{broker.rank}
              </div>
              
              {/* Info */}
              <div className="flex-1 p-6 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted text-2xl font-bold shrink-0">
                  {broker.logo}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{broker.name}</h3>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 text-yellow-500 font-medium">
                      <Star className="h-4 w-4 fill-yellow-500" /> {broker.rating}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      {broker.regulation}
                    </span>
                    <span>{broker.reviews} Reviews</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="w-full md:w-48 p-6 md:border-l flex flex-col gap-2">
                <Link to={`/broker/${broker.name.toLowerCase().replace(" ", "-")}`} className="w-full">
                  <Button className="w-full">View Review</Button>
                </Link>
                <Button variant="outline" className="w-full">Compare</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
