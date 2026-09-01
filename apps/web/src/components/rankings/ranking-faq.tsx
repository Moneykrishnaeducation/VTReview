import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { RANKING_FAQS } from "@/data/rankings-data";

export default function RankingFAQ() {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section className="mb-14">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center justify-center gap-2">
          <HelpCircle className="h-6 w-6 text-primary" /> Frequently Asked Questions
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Everything you need to know about broker ratings, safety tiers, and regulation compliance.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {RANKING_FAQS.map((faq, index) => {
          const isOpen = openIndices.includes(index);

          return (
            <div
              key={index}
              className="rounded-2xl border border-border/70 bg-card/60 overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleIndex(index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-foreground hover:text-primary transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground ${
                    isOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3 animate-in fade-in-50 duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
