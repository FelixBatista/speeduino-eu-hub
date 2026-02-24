import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { comparisonDimensions, comparisonDisclaimer } from "@/data/comparisons";
import { CheckCircle2, Info } from "lucide-react";

const quickCompare = [
  { label: "vs Megasquirt", href: "/compare?vs=megasquirt" },
  { label: "vs Link", href: "/compare?vs=link" },
  { label: "vs Haltech", href: "/compare?vs=haltech" },
  { label: "vs ECUMaster", href: "/compare?vs=ecumaster" },
  { label: "vs MaxxECU", href: "/compare?vs=maxxecu" },
];

export default function ComparisonSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [showAll, setShowAll] = useState(false);

  const rows = showAll ? comparisonDimensions : comparisonDimensions.slice(0, 6);

  return (
    <section className="py-20 md:py-32 relative" ref={ref}>
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="data-label text-primary mb-3">How We Compare</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Honest, Side-by-Side Comparison
          </h2>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {quickCompare.map((c) => (
              <Link key={c.label} to={c.href} className="trust-badge hover:border-primary/30 transition-colors text-xs">
                {c.label}
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="overflow-x-auto"
        >
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 data-label">Feature</th>
                <th className="text-left py-3 px-4 data-label text-primary">Speeduino</th>
                <th className="text-left py-3 px-4 data-label">Megasquirt</th>
                <th className="text-left py-3 px-4 data-label hidden lg:table-cell">Link</th>
                <th className="text-left py-3 px-4 data-label hidden xl:table-cell">Haltech</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 text-muted-foreground font-medium">{row.dimension}</td>
                  <td className="py-3 px-4 text-foreground">
                    <span className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {row.speeduino}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-secondary-foreground">{row.megasquirt}</td>
                  <td className="py-3 px-4 text-secondary-foreground hidden lg:table-cell">{row.link}</td>
                  <td className="py-3 px-4 text-secondary-foreground hidden xl:table-cell">{row.haltech}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <div className="mt-6 flex flex-col items-center gap-4">
          {!showAll && (
            <button onClick={() => setShowAll(true)} className="cta-secondary !px-6 !py-2 !text-sm">
              Show All Comparisons
            </button>
          )}
          <Link to="/compare" className="text-primary text-sm hover:underline">View full comparison page →</Link>
          <p className="text-xs text-muted-foreground max-w-2xl text-center flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            {comparisonDisclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
