import { CheckCircle, Shield, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          About <span className="text-primary">VTINDEX</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We are the world's most trusted independent broker review and comparison platform, dedicated to bringing transparency to the online trading industry.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="grid md:grid-cols-2 gap-12 mb-20">
        <div className="bg-muted/30 p-8 rounded-2xl border border-border/50">
          <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-xl mb-6">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our mission is to protect traders from scams and provide them with the unbiased, comprehensive data they need to choose the best trading platforms. We believe that transparency is the key to a fair financial market.
          </p>
        </div>
        <div className="bg-muted/30 p-8 rounded-2xl border border-border/50">
          <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-xl mb-6">
            <Globe className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="text-muted-foreground leading-relaxed">
            To become the global standard for broker verification and trader education. We aim to foster a trading environment where investors can operate with confidence, knowing their broker is fully vetted and highly rated.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-extrabold text-primary mb-2">10K+</div>
            <div className="text-sm font-medium text-muted-foreground">Brokers Reviewed</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-primary mb-2">100K+</div>
            <div className="text-sm font-medium text-muted-foreground">Trader Reviews</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-primary mb-2">50+</div>
            <div className="text-sm font-medium text-muted-foreground">Regulators Tracked</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-primary mb-2">1M+</div>
            <div className="text-sm font-medium text-muted-foreground">Monthly Visitors</div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-10 text-center">Why Traders Trust Us</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "100% Independent", desc: "Our reviews and ratings are strictly objective and unaffected by broker sponsorships.", icon: Shield },
            { title: "Data-Driven Ratings", desc: "We use a rigorous 50-point checklist covering fees, platforms, safety, and support.", icon: CheckCircle },
            { title: "Community Powered", desc: "Thousands of verified user reviews help us uncover the real trading experience.", icon: Users },
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="bg-muted p-4 rounded-full mb-4">
                <feature.icon className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground rounded-3xl p-10 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to start trading safely?</h2>
        <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
          Explore our extensive database of regulated brokers and find the perfect match for your trading style.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/reviews">
            <Button size="lg" variant="secondary">Browse Brokers</Button>
          </Link>
          <Link to="/search">
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">Contact Us</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
