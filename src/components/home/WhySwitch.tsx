import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { DollarSign, Lock, Eye } from "lucide-react";

const columns = [
  {
    icon: DollarSign,
    problem: "You're paying premium prices for a black box",
    want: "Fair pricing with no hidden costs",
    solve: "Starting from €129 (DIY). No license fees, no mandatory software subscriptions, no locked features.",
  },
  {
    icon: Lock,
    problem: "Vendor lock-in limits your options",
    want: "Freedom to modify, expand, and learn",
    solve: "Fully open-source hardware and firmware. Add features, swap components, or fork the code. It's yours.",
  },
  {
    icon: Eye,
    problem: "Specs are vague or hidden behind marketing",
    want: "Clear, honest technical documentation",
    solve: "Every schematic, every pin, every algorithm — published. Community-verified, not marketing-approved.",
  },
];

export default function WhySwitch() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-32 relative" ref={ref}>
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="data-label text-primary mb-3">Why people switch</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            You Deserve Better Than a Black Box
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {columns.map((col, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="card-motorsport p-6 lg:p-8 flex flex-col"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <col.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-4 flex-1">
                <div>
                  <p className="data-label mb-1">The Problem</p>
                  <p className="text-foreground font-medium">{col.problem}</p>
                </div>
                <div>
                  <p className="data-label mb-1">What You Want</p>
                  <p className="text-foreground font-medium">{col.want}</p>
                </div>
                <div className="pt-3 border-t border-border/50">
                  <p className="data-label text-primary mb-1">How We Solve It</p>
                  <p className="text-secondary-foreground text-sm leading-relaxed">{col.solve}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
