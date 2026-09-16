import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BrokerCard from "@/components/broker-card";

const BROKERS = [
  { name: "IC Markets", rating: 9.5, regulation: "Regulated", logo: "IC", country: "Australia", established: "2007" },
  { name: "Exness", rating: 9.2, regulation: "Regulated", logo: "EX", country: "Cyprus", established: "2008" },
  { name: "OctaFX", rating: 8.9, regulation: "Verified", logo: "OC", country: "St. Vincent", established: "2011" },
  { name: "XM", rating: 8.9, regulation: "Verified", logo: "XM", country: "Cyprus", established: "2009" },
  { name: "Tickmill", rating: 8.3, regulation: "Regulated", logo: "TM", country: "Seychelles", established: "2014" },
  { name: "Pepperstone", rating: 9.1, regulation: "Regulated", logo: "PS", country: "Australia", established: "2010" },
];

export default function Reviews() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Broker Reviews</h1>
          <p className="text-muted-foreground">
            Read comprehensive reviews and compare top forex and trading brokers.
          </p>
        </div>
        <div className="w-full md:w-auto flex gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search brokers..." 
              className="pl-9 bg-background"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {BROKERS.map((broker, i) => (
          <BrokerCard key={i} broker={broker} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button variant="outline" size="lg">
          Load More Brokers
        </Button>
      </div>
    </div>
  );
}
