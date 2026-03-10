import { Link } from "react-router-dom";
import { comparisonDimensions, comparisonDisclaimer } from "@/data/comparisons";
import { motion } from "framer-motion";
import { Info, CheckCircle2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";

export default function Compare() {
  return (
    <>
      <SEOHead
        title="Aftermarket ECU Comparison: Speeduino vs Haltech vs Link vs MaxxECU vs ECUMaster"
        description="Honest side-by-side comparison of aftermarket ECUs for Europe. Speeduino vs Haltech, Link ECU, MaxxECU, ECUMaster, and Megasquirt — price, features, open-source, and community."
        canonical="/compare"
      />
    <main className="pt-24 pb-20">
      <div className="container">
        <nav className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Compare ECUs</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Speeduino vs Aftermarket ECUs
          </h1>
          <p className="text-muted-foreground max-w-2xl mb-10">
            An honest, side-by-side comparison of Speeduino with popular aftermarket ECU options. We believe in transparency — see the data and decide for yourself.
          </p>
        </motion.div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 data-label w-48">Feature</th>
                <th className="text-left py-4 px-4 data-label text-primary">Speeduino</th>
                <th className="text-left py-4 px-4 data-label">Megasquirt</th>
                <th className="text-left py-4 px-4 data-label">Link</th>
                <th className="text-left py-4 px-4 data-label">Haltech</th>
                <th className="text-left py-4 px-4 data-label">ECUMaster</th>
                <th className="text-left py-4 px-4 data-label">MaxxECU</th>
              </tr>
            </thead>
            <tbody>
              {comparisonDimensions.map((row, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 text-muted-foreground font-medium">{row.dimension}</td>
                  <td className="py-3 px-4 text-foreground">
                    <span className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {row.speeduino}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-secondary-foreground">{row.megasquirt}</td>
                  <td className="py-3 px-4 text-secondary-foreground">{row.link}</td>
                  <td className="py-3 px-4 text-secondary-foreground">{row.haltech}</td>
                  <td className="py-3 px-4 text-secondary-foreground">{row.ecumaster}</td>
                  <td className="py-3 px-4 text-secondary-foreground">{row.maxxecu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex items-start gap-2 text-xs text-muted-foreground max-w-3xl">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>{comparisonDisclaimer}</p>
        </div>

        <div className="mt-12 text-center">
          <Link to="/find-my-kit" className="cta-primary">Find My Kit</Link>
        </div>
      </div>
    </main>
    </>
  );
}
