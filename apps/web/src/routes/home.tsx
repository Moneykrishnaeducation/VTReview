import { Link } from "react-router";
import { Search, ShieldCheck, Star, AlertTriangle, Scale, BookOpen, ChevronRight, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import BrokerCard from "@/components/broker-card";

const TOP_BROKERS = [
  { name: "IC Markets", rating: 9.5, regulation: "Regulated", logo: "IC", country: "Australia", established: "2007" },
  { name: "Exness", rating: 9.2, regulation: "Regulated", logo: "EX", country: "Cyprus", established: "2008" },
  { name: "OctaFX", rating: 8.9, regulation: "Verified", logo: "OC", country: "St. Vincent", established: "2011" },
];

const RANKING_LIST = [
  { rank: 1, name: "IC Markets", rating: 9.5, regulation: "Regulated", reviews: "1,250" },
  { rank: 2, name: "Exness", rating: 9.2, regulation: "Regulated", reviews: "980" },
  { rank: 3, name: "XM", rating: 8.9, regulation: "Verified", reviews: "760" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 2. Hero Section */}
      <section className="bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Find Trusted Forex & Trading Brokers
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Search, compare, review, and discover important information about trading brokers.
          </p>
          <div className="max-w-3xl mx-auto relative flex items-center mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search Broker Name" 
              className="w-full h-16 pl-14 pr-32 text-lg rounded-full shadow-sm"
            />
            <Link to="/search">
              <Button size="lg" className="absolute right-2 top-2 h-12 rounded-full px-8 text-base">
                Search
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">10,000+</div>
              <div className="text-sm font-medium text-muted-foreground mt-1">Brokers Reviewed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">50+</div>
              <div className="text-sm font-medium text-muted-foreground mt-1">Regulators Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">100,000+</div>
              <div className="text-sm font-medium text-muted-foreground mt-1">User Reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Search by Category */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: "🏦", label: "Forex Brokers" },
              { icon: "📈", label: "Stock Brokers" },
              { icon: "₿", label: "Crypto Platforms" },
              { icon: "💰", label: "CFD Brokers" },
              { icon: "🤖", label: "Prop Trading Firms" },
            ].map((item, i) => (
              <Card key={i} className="hover:border-primary cursor-pointer transition-colors text-center group">
                <CardContent className="pt-6 pb-6">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
                  <h3 className="font-semibold text-sm">{item.label}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Areas */}
      <section className="container mx-auto px-4 py-16 space-y-24">
        
        {/* 4. Top Broker Rankings */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h2 className="text-3xl font-bold">Top Rated Brokers</h2>
            <Link to="/rankings">
              <Button variant="outline">View All Rankings <ChevronRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="py-4 px-4 font-medium">Rank</th>
                  <th className="py-4 px-4 font-medium">Broker</th>
                  <th className="py-4 px-4 font-medium">Rating</th>
                  <th className="py-4 px-4 font-medium">Regulation</th>
                  <th className="py-4 px-4 font-medium text-right">Reviews</th>
                </tr>
              </thead>
              <tbody>
                {RANKING_LIST.map((b) => (
                  <tr key={b.rank} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-4 text-2xl">
                      {b.rank === 1 ? "🥇" : b.rank === 2 ? "🥈" : b.rank === 3 ? "🥉" : b.rank}
                    </td>
                    <td className="py-4 px-4 font-semibold">{b.name}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center text-yellow-500 font-medium">
                        <Star className="h-4 w-4 fill-yellow-500 mr-1" /> {b.rating}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {b.regulation}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right text-muted-foreground">{b.reviews}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Featured Broker Review Cards */}
        <div>
          <h2 className="text-3xl font-bold mb-8">Featured Broker Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOP_BROKERS.map((broker, i) => (
              <BrokerCard key={i} broker={broker} />
            ))}
          </div>
        </div>

        {/* 6. Broker Verification Section */}
        <div className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-10">Check Before You Trade</h2>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -z-10 -translate-y-1/2" />
            {[
              { num: "1️⃣", text: "Search Broker" },
              { num: "2️⃣", text: "Check Regulation" },
              { num: "3️⃣", text: "Read User Reviews" },
              { num: "4️⃣", text: "Make an Informed Decision" }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center bg-card p-4 rounded-xl shadow-sm border md:w-48">
                <div className="text-4xl mb-3">{step.num}</div>
                <div className="font-semibold text-sm">{step.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Detailed Review Categories */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">How We Review Brokers</h2>
            <p className="text-muted-foreground text-lg mb-6">
              Our comprehensive scoring system evaluates brokers across multiple critical dimensions to ensure you get the full picture before investing.
            </p>
            <Link to="/about">
              <Button>Learn about our methodology</Button>
            </Link>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Star className="h-5 w-5 fill-primary text-primary" /> Overall Rating
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Regulation & Safety", icon: "🛡️", score: 4 },
                { label: "Fees & Spreads", icon: "💰", score: 4 },
                { label: "Trading Platforms", icon: "📊", score: 5 },
                { label: "Customer Support", icon: "🤝", score: 4 },
                { label: "Deposit & Withdrawal", icon: "💳", score: 3 },
              ].map((cat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-medium">
                    <span>{cat.icon}</span> {cat.label}
                  </div>
                  <div className="flex text-yellow-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`h-4 w-4 ${star <= cat.score ? "fill-yellow-500" : "text-muted"}`} />
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* 8. Latest User Reviews & 9. Complaints (Side by side) */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">What Traders Are Saying</h2>
            </div>
            <div className="space-y-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex text-yellow-500 mb-3">
                    <Star className="h-4 w-4 fill-yellow-500" /><Star className="h-4 w-4 fill-yellow-500" /><Star className="h-4 w-4 fill-yellow-500" /><Star className="h-4 w-4 fill-yellow-500" /><Star className="h-4 w-4 fill-yellow-500" />
                  </div>
                  <p className="italic mb-4">"Good trading experience and fast support."</p>
                  <div className="text-sm font-medium">— Verified User <span className="text-muted-foreground ml-2">Broker: XYZ</span></div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex text-yellow-500 mb-3">
                    <Star className="h-4 w-4 fill-yellow-500" /><Star className="h-4 w-4 fill-yellow-500" /><Star className="h-4 w-4 fill-yellow-500" /><Star className="h-4 w-4 text-muted" /><Star className="h-4 w-4 text-muted" />
                  </div>
                  <p className="italic mb-4">"Platform is good, but withdrawal took longer."</p>
                  <div className="text-sm font-medium">— Verified User <span className="text-muted-foreground ml-2">Broker: ABC</span></div>
                </CardContent>
              </Card>
            </div>
            <div className="flex gap-4">
              <Link to="/reviews" className="flex-1">
                <Button variant="outline" className="w-full">Read All Reviews</Button>
              </Link>
              <Link to="/search" className="flex-1">
                <Button className="w-full">Write a Review</Button>
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6 text-red-400">Recent Trader Complaints & Issues</h2>
            <div className="space-y-4">
              {[
                { issue: "Withdrawal Issue", broker: "ScamBroker FX", status: "Under Review", statusColor: "text-amber-300 bg-amber-500/20 border border-amber-500/30" },
                { issue: "Account Issue", broker: "TradeFast", status: "Resolved", statusColor: "text-emerald-300 bg-emerald-500/20 border border-emerald-500/30" },
                { issue: "Customer Support Complaint", broker: "Global Trade", status: "Investigating", statusColor: "text-sky-300 bg-sky-500/20 border border-sky-500/30" },
              ].map((complaint, i) => (
                <Card key={i} className="border-l-4 border-l-red-500">
                  <CardContent className="pt-4 pb-4 flex justify-between items-center">
                    <div>
                      <div className="font-bold flex items-center gap-2 mb-1">
                        <AlertTriangle className="h-4 w-4 text-red-500" /> {complaint.issue}
                      </div>
                      <div className="text-sm text-muted-foreground">{complaint.broker}</div>
                    </div>
                    <div className={`text-xs font-medium px-2.5 py-1 rounded-full ${complaint.statusColor}`}>
                      {complaint.status}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* 10. Compare Brokers */}
        <div className="bg-muted/30 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Scale className="h-8 w-8 text-primary" /> Compare Brokers Before You Choose
            </h2>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-4xl mx-auto mb-8">
            <Input placeholder="Select Broker 1 ▼" className="h-14 text-center md:text-left text-lg bg-background" />
            <div className="font-bold text-muted-foreground">VS</div>
            <Input placeholder="Select Broker 2 ▼" className="h-14 text-center md:text-left text-lg bg-background" />
            <Link to="/compare">
              <Button size="lg" className="h-14 px-8 w-full md:w-auto">Compare Now</Button>
            </Link>
          </div>
          <div className="text-center text-sm text-muted-foreground flex flex-wrap justify-center gap-4">
            <span>Compare:</span>
            <span>Regulation</span> • <span>Rating</span> • <span>Trading Platform</span> • <span>Spreads</span> • <span>Leverage</span>
          </div>
        </div>

        {/* 11. Regulatory Authority Section */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h2 className="text-3xl font-bold">Check Broker Regulation</h2>
            <Link to="/regulators">
              <Button variant="ghost">View All Regulators <ChevronRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { flag: "🇬🇧", name: "FCA", country: "United Kingdom" },
              { flag: "🇺🇸", name: "SEC", country: "United States" },
              { flag: "🇦🇺", name: "ASIC", country: "Australia" },
              { flag: "🇨🇾", name: "CySEC", country: "Cyprus" },
              { flag: "🇮🇳", name: "SEBI", country: "India" },
            ].map((reg, i) => (
              <Card key={i} className="text-center hover:border-primary transition-colors cursor-pointer">
                <CardContent className="pt-6 pb-6">
                  <div className="text-4xl mb-2">{reg.flag}</div>
                  <h3 className="font-bold">{reg.name}</h3>
                  <div className="text-xs text-muted-foreground">{reg.country}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 12. Latest Financial News & 13. Educational Section */}
        <div className="grid md:grid-cols-2 gap-12">
          <div>
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-2xl font-bold">Latest News</h2>
               <Link to="/news">
                 <Button variant="ghost" size="sm">
                   View All News <ChevronRight className="ml-1 h-4 w-4" />
                 </Button>
               </Link>
             </div>
             <div className="space-y-4">
               {[
                 { icon: "📰", title: "Market News", desc: "Latest forex and financial updates", link: "/news" },
                 { icon: "📈", title: "Trading Insights", desc: "Market analysis and strategies", link: "/news" },
                 { icon: "🏦", title: "Broker Industry News", desc: "Broker and regulatory updates", link: "/news" },
               ].map((item, i) => (
                 <Link key={i} to={item.link} className="block">
                   <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors border border-transparent hover:border-border">
                     <div className="text-3xl">{item.icon}</div>
                     <div>
                       <h3 className="font-semibold">{item.title}</h3>
                       <p className="text-sm text-muted-foreground">{item.desc}</p>
                     </div>
                   </div>
                 </Link>
               ))}
             </div>
          </div>
          <div>
             <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
               <BookOpen className="h-6 w-6 text-primary" /> Learn Before You Trade
             </h2>
             <div className="grid grid-cols-2 gap-4">
               {[
                 "Forex Basics", "How to Choose a Broker", "Understanding Regulation",
                 "Risk Management", "Trading Platforms", "Avoiding Trading Scams"
               ].map((topic, i) => (
                 <div key={i} className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg text-sm font-medium hover:text-primary cursor-pointer transition-colors">
                   <CheckCircle2 className="h-4 w-4 text-primary" /> {topic}
                 </div>
               ))}
             </div>
          </div>
        </div>
      </section>

      {/* 14. Call to Action */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24 mt-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Find the Right Broker for Your Trading Journey</h2>
          <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of traders who use VTINDEX to make informed decisions and trade with confidence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/search">
              <Button size="lg" variant="secondary" className="h-14 px-8 text-base">
                <Search className="mr-2 h-5 w-5" /> Search a Broker
              </Button>
            </Link>
            <Link to="/reviews">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Browse Broker Reviews
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
