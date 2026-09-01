import { useState } from "react";
import { Search as SearchIcon, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BrokerCard from "@/components/broker-card";

const MOCK_RESULTS = [
  { name: "IC Markets", rating: 9.5, regulation: "Regulated", logo: "IC", country: "Australia", established: "2007" },
  { name: "Exness", rating: 9.2, regulation: "Regulated", logo: "EX", country: "Cyprus", established: "2008" },
  { name: "XM", rating: 8.9, regulation: "Verified", logo: "XM", country: "Belize", established: "2009" },
  { name: "OctaFX", rating: 8.5, regulation: "Regulated", logo: "OC", country: "Cyprus", established: "2011" },
];

export default function Search() {
  const [query, setQuery] = useState("");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Broker Search</h1>
          <p className="text-muted-foreground">Find and compare trusted brokers worldwide.</p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative w-full md:w-80">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search brokers by name..." 
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Regulation Status</h3>
            <div className="space-y-2">
              {["Regulated", "Verified", "Offshore", "Unregulated"].map(status => (
                <label key={status} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded border-gray-300" /> {status}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Minimum Deposit</h3>
            <div className="space-y-2">
              {["No Minimum", "$10 - $50", "$100 - $500", "$1000+"].map(range => (
                <label key={range} className="flex items-center gap-2 text-sm">
                  <input type="radio" name="deposit" className="rounded border-gray-300" /> {range}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="md:col-span-3">
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {MOCK_RESULTS.length} results
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {MOCK_RESULTS.filter(b => b.name.toLowerCase().includes(query.toLowerCase())).map((broker, i) => (
              <BrokerCard key={i} broker={broker} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
