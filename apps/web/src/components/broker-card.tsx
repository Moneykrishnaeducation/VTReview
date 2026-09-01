import { ShieldCheck, Calendar, Globe, Star } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

interface BrokerProps {
  name: string;
  rating: number;
  regulation: string;
  established: string;
  country: string;
  logo: string;
}

export default function BrokerCard({ broker }: { broker: BrokerProps }) {
  const isVerified = broker.regulation.toLowerCase().includes("verified") || broker.regulation.toLowerCase().includes("regulated");

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted text-2xl font-bold mb-4">
          {broker.logo}
        </div>
        <h3 className="font-semibold text-lg line-clamp-1">{broker.name}</h3>
        <div className="flex items-center gap-1 text-yellow-500 font-medium">
          <Star className="h-4 w-4 fill-yellow-500" />
          <span>{broker.rating.toFixed(1)} / 5</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className={`h-4 w-4 ${isVerified ? "text-green-500" : "text-muted-foreground"}`} />
          <span className="text-muted-foreground">Regulation:</span>
          <span className={`font-medium ${isVerified ? "text-green-600 dark:text-green-400" : ""}`}>{broker.regulation}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Established:</span>
          <span className="font-medium">{broker.established}</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Country:</span>
          <span className="font-medium">{broker.country}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <Link to={`/broker/${broker.name.toLowerCase().replace(/\s+/g, "-")}`} className="w-full">
          <Button className="w-full" variant="outline">
            View Review
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
