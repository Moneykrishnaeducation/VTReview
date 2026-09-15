import { useState } from "react";
import { NavLink, Link } from "react-router";
import {
  Shield,
  ShieldCheck,
  Globe,
  Mail,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="border-t bg-card text-foreground transition-colors">
      {/* 1. Newsletter & Regulatory Intelligence Strip */}
      <div className="border-b bg-muted/30 py-10 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <h3 className="font-extrabold text-base sm:text-lg text-foreground">
                Get Instant Regulatory Blacklist Alerts
              </h3>
            </div>
            <p className="text-xs text-muted-foreground max-w-lg">
              Receive breaking clone broker warnings, FCA/ASIC enforcement notices, and spread benchmark reports directly to your inbox.
            </p>
          </div>

          {subscribed ? (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 rounded-xl">
              <CheckCircle2 className="h-4 w-4" /> Subscribed to Weekly Regulatory Bulletins!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto items-center gap-2 max-w-md">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full h-11 pl-10 pr-4 text-xs rounded-xl bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>
              <Button type="submit" className="h-11 px-5 text-xs font-bold rounded-xl shrink-0 shadow-sm">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* 2. Main Footer Links Columns */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 text-white font-black text-lg shadow-sm">
                VT
              </div>
              <span className="font-extrabold text-xl tracking-tight text-foreground">
                VTINDEX
              </span>
            </Link>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              VTINDEX is the premier independent broker intelligence and safety verification platform. We evaluate forex, CFD, and proprietary trading platforms with scientific rigor.
            </p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>All 54 Regulatory Surveillance Nodes Online</span>
            </div>
          </div>

          {/* Broker Rankings */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground mb-3">
              Broker Rankings
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link to="/rankings" className="hover:text-primary transition-colors">
                  Top Rated Overall
                </Link>
              </li>
              <li>
                <Link to="/rankings" className="hover:text-primary transition-colors">
                  Lowest Raw Spreads
                </Link>
              </li>
              <li>
                <Link to="/rankings" className="hover:text-primary transition-colors">
                  Safest Tier-1 Regulated
                </Link>
              </li>
              <li>
                <Link to="/rankings" className="hover:text-primary transition-colors">
                  Low Deposit ($5-$10)
                </Link>
              </li>
              <li>
                <Link to="/rankings" className="hover:text-primary transition-colors">
                  Top Prop Trading Firms
                </Link>
              </li>
            </ul>
          </div>

          {/* Market Intelligence */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground mb-3">
              Intelligence
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link to="/news" className="hover:text-primary transition-colors">
                  Forex Market News
                </Link>
              </li>
              <li>
                <Link to="/news?category=Regulation+%26+Alerts" className="hover:text-primary transition-colors">
                  Regulatory Blacklist
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-primary transition-colors">
                  Head-to-Head Compare
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-primary transition-colors">
                  Broker Directory
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-primary transition-colors">
                  Surveillance Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Regulatory Authorities */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground mb-3">
              Key Regulators
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link to="/search?q=FCA" className="hover:text-primary transition-colors">
                  🇬🇧 FCA (UK)
                </Link>
              </li>
              <li>
                <Link to="/search?q=ASIC" className="hover:text-primary transition-colors">
                  🇦🇺 ASIC (Australia)
                </Link>
              </li>
              <li>
                <Link to="/search?q=CySEC" className="hover:text-primary transition-colors">
                  🇨🇾 CySEC (Cyprus)
                </Link>
              </li>
              <li>
                <Link to="/search?q=SEC" className="hover:text-primary transition-colors">
                  🇺🇸 SEC / CFTC (US)
                </Link>
              </li>
              <li>
                <Link to="/search?q=BaFin" className="hover:text-primary transition-colors">
                  🇩🇪 BaFin (Germany)
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* 3. Mandatory Risk Disclaimer */}
        <div className="mt-12 pt-8 border-t space-y-4 text-[11px] text-muted-foreground leading-relaxed">
          <p>
            <strong>High Risk Investment Warning:</strong> Trading Foreign Exchange (Forex) and Contracts for Difference (CFDs) on margin carries a high level of risk and may not be suitable for all investors. Between 74% and 89% of retail investor accounts lose money when trading CFDs. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your capital.
          </p>
          <p>
            <strong>Disclaimer:</strong> VTINDEX provides independent financial information, research, and comparative ratings for educational purposes only. VTINDEX does not offer financial advice, portfolio management, or direct brokerage services. Always verify license credentials directly with the relevant statutory regulatory body before transferring funds.
          </p>
        </div>

        {/* 4. Copyright & Legal */}
        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()} VTINDEX Global Media Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-foreground cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-foreground cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-foreground cursor-pointer">Editorial Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

