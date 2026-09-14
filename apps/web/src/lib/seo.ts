/**
 * SEO & Schema.org JSON-LD Structured Data Utilities for Review-Site
 */

export interface SeoMetadata {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: "website" | "article";
  ogImage?: string;
}

export function generatePageTitle(pageName?: string): string {
  const base = "VTReview — Independent Forex Broker Research & Discovery";
  if (!pageName) return base;
  return `${pageName} | VTReview`;
}

/**
 * Generates Schema.org FinancialProduct + AggregateRating JSON-LD schema for a broker review.
 */
export function generateBrokerJsonLd(broker: {
  name: string;
  editorialRating: number;
  userRating: number;
  reviewCount: number;
  primaryLicense: string;
  slug: string;
  hq: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: `${broker.name} Forex & CFD Brokerage`,
    description: `Independent audit and safety review of ${broker.name}. Regulated by ${broker.primaryLicense}.`,
    provider: {
      "@type": "FinancialService",
      name: broker.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: broker.hq,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: broker.editorialRating,
      bestRating: "5.0",
      worstRating: "1.0",
      ratingCount: broker.reviewCount,
    },
    url: `https://vtreview.com/brokers/${broker.slug}`,
  };
}

/**
 * Generates Schema.org FAQPage JSON-LD schema.
 */
export function generateFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
