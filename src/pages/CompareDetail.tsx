import { useParams, Link } from "react-router-dom";
import { getCompetitorComparisonBySlug } from "@/data/competitorComparisons";
import { comparisonDimensions } from "@/data/comparisons";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight, ChevronDown, ChevronUp, Info } from "lucide-react";
import { useState } from "react";
import SEOHead from "@/components/SEOHead";

export default function CompareDetail() {
  const { slug } = useParams<{ slug: string }>();
  const comparison = getCompetitorComparisonBySlug(slug || "");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!comparison) {
    return (
      <main className="pt-32 pb-20 container text-center">
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">Comparison Not Found</h1>
        <Link to="/compare" className="text-primary hover:underline">← All Comparisons</Link>
      </main>
    );
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: comparison.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const competitorKey = comparison.competitor.toLowerCase().replace(/\s+/g, "") as keyof (typeof comparisonDimensions)[0];
  const filteredDimensions =
    comparison.slug === "best-aftermarket-ecu-europe"
      ? comparisonDimensions
      : comparisonDimensions.filter(() => true);

  return (
    <>
      <SEOHead
        title={comparison.metaTitle}
        description={comparison.metaDescription}
        canonical={`/compare/${comparison.slug}`}
        schema={faqSchema}
      />
      <main className="pt-24 pb-20">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/compare" className="hover:text-foreground">Compare ECUs</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{comparison.heroTitle}</span>
          </nav>

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              {comparison.heroTitle}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-8">{comparison.heroSubtitle}</p>

            {/* Price comparison cards */}
            <div className="grid md:grid-cols-2 gap-4 mb-12 max-w-2xl">
              <div className="card-motorsport p-6 border-primary/40">
                <p className="data-label text-primary text-xs mb-2">Speeduino (from Wrench over Wallet)</p>
                <p className="font-display text-3xl font-bold text-foreground">{comparison.priceSpeeduino}</p>
                <p className="text-sm text-muted-foreground mt-1">inc. VAT, EU shipping</p>
              </div>
              <div className="card-motorsport p-6 opacity-70">
                <p className="data-label text-xs mb-2">{comparison.competitorFullName}</p>
                <p className="font-display text-3xl font-bold text-foreground">{comparison.priceCompetitor}</p>
                <p className="text-sm text-muted-foreground mt-1">typical market price</p>
              </div>
            </div>

            <div className="inline-block bg-primary/10 border border-primary/20 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-10">
              {comparison.savings}
            </div>
          </motion.div>

          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-3xl mb-12"
          >
            <p className="text-secondary-foreground leading-relaxed">{comparison.intro}</p>
          </motion.div>

          {/* Advantages grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="card-motorsport p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                Why Choose Speeduino
              </h2>
              <ul className="space-y-3">
                {comparison.speeduinoAdvantages.map((adv, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-secondary-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    {adv}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-motorsport p-6 opacity-80">
              <h2 className="font-display text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                <Info className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                When {comparison.competitor} Makes Sense
              </h2>
              <ul className="space-y-3">
                {comparison.competitorAdvantages.map((adv, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-secondary-foreground">
                    <XCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    {adv}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feature comparison table (subset) */}
          {comparison.slug !== "best-aftermarket-ecu-europe" && (
            <div className="mb-16">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Feature Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 data-label w-56">Feature</th>
                      <th className="text-left py-3 px-4 data-label text-primary">Speeduino</th>
                      <th className="text-left py-3 px-4 data-label">{comparison.competitor}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDimensions.map((row, i) => {
                      const competitorValue = row[competitorKey as keyof typeof row] as string | undefined;
                      return (
                        <tr key={i} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                          <td className="py-3 px-4 text-muted-foreground font-medium">{row.dimension}</td>
                          <td className="py-3 px-4 text-foreground">
                            <span className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              {row.speeduino}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-secondary-foreground">
                            {competitorValue || "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground max-w-2xl">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>Features vary by specific model and firmware version. Always verify for your application.</p>
              </div>
            </div>
          )}

          {/* Verdict */}
          <div className="card-motorsport p-8 mb-16 max-w-3xl border-primary/20">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">Our Verdict</h2>
            <p className="text-secondary-foreground leading-relaxed">{comparison.verdict}</p>
          </div>

          {/* FAQ Section */}
          {comparison.faqs.length > 0 && (
            <div className="mb-16 max-w-3xl">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Common Questions: Speeduino vs {comparison.competitor}
              </h2>
              <div className="space-y-3">
                {comparison.faqs.map((faq, i) => (
                  <div key={i} className="card-motorsport overflow-hidden">
                    <button
                      className="w-full text-left px-6 py-4 flex items-start justify-between gap-4"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="font-medium text-foreground text-sm">{faq.question}</span>
                      {openFaq === i ? (
                        <ChevronUp className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      )}
                    </button>
                    {openFaq === i && (
                      <div className="px-6 pb-4 text-sm text-secondary-foreground leading-relaxed border-t border-border/30 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/find-my-kit" className="cta-primary">
              Find My Kit
            </Link>
            <Link to="/shop" className="cta-secondary">
              Shop Speeduino Parts <ArrowRight className="w-4 h-4 inline ml-1" />
            </Link>
            <Link to="/compare" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Full ECU Comparison Table
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
