import { useState } from "react";
import { Mail, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function NewsNewsletterCard() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [frequency, setFrequency] = useState("daily");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubscribed(true);
    toast.success("Subscribed successfully!", {
      description: `You will now receive ${frequency} market and regulatory intelligence briefings at ${email}.`,
    });
  };

  return (
    <div className="rounded-xl border bg-gradient-to-br from-primary/15 via-card to-card p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
          <Mail className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-bold text-base text-foreground leading-none">
            VT Market Briefing
          </h3>
          <span className="text-[11px] text-primary font-medium">
            Over 45,000+ traders subscribed
          </span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
        Get daily curated forex analysis, regulatory alerts, scam broker blacklists, and high-impact macro forecasts sent directly to your inbox.
      </p>

      {isSubscribed ? (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
          <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto" />
          <div className="font-bold text-xs text-emerald-300">You're Subscribed!</div>
          <p className="text-[11px] text-muted-foreground">
            Check your inbox for our latest market analysis and broker safety digest.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder="Enter your email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 text-xs bg-background/90"
            required
          />

          <div className="flex gap-2 text-xs">
            <button
              type="button"
              onClick={() => setFrequency("daily")}
              className={`flex-1 py-1 px-2 rounded border text-[11px] font-medium transition-colors ${
                frequency === "daily"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/40 border-border/60 text-muted-foreground"
              }`}
            >
              Daily Pulse
            </button>
            <button
              type="button"
              onClick={() => setFrequency("urgent_only")}
              className={`flex-1 py-1 px-2 rounded border text-[11px] font-medium transition-colors ${
                frequency === "urgent_only"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/40 border-border/60 text-muted-foreground"
              }`}
            >
              Scam Alerts Only
            </button>
          </div>

          <Button type="submit" size="sm" className="w-full text-xs font-semibold gap-1.5 h-10">
            <Zap className="h-3.5 w-3.5" /> Subscribe Free
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            <span>Zero spam. Unsubscribe with 1-click anytime.</span>
          </div>
        </form>
      )}
    </div>
  );
}
