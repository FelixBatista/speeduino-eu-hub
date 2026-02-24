import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Package, Cable, Zap, BarChart3, Settings, Headphones, BookOpen, Users } from "lucide-react";

const steps = [
  { icon: Package, title: "Choose Your Kit", desc: "Use the wizard or browse bundles — pick the hardware that matches your build." },
  { icon: Cable, title: "Wiring", desc: "Follow our harness guide. Star grounds, shielded sensors, labeled connections." },
  { icon: Zap, title: "First Start", desc: "Load a base map, prime fuel, verify sensors, and crank. Most builds start on the first try." },
  { icon: BarChart3, title: "Base Map Tuning", desc: "Use TunerStudio to adjust VE and spark tables. Auto-tune gets you close; logs refine it." },
  { icon: Settings, title: "Fine Tuning", desc: "Dial in idle, cold start, transient enrichment, and boost targets for your specific setup." },
];

const supportOptions = [
  { icon: Headphones, label: "Base map review", desc: "We'll review your map and sensor data" },
  { icon: BookOpen, label: "Wiring guides", desc: "Step-by-step harness documentation" },
  { icon: Users, label: "Community", desc: "Forums, Discord, and YouTube resources" },
];

export default function InstallSteps() {
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
          className="text-center mb-14"
        >
          <p className="data-label text-primary mb-3">Installation</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
            From Box to First Start
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Most builds go from unboxing to first start in a single weekend. Here's the path.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-2xl mx-auto mb-16">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
              className="flex gap-4 mb-6 last:mb-0"
            >
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                {i < steps.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
              </div>
              <div className="pb-6">
                <p className="font-display text-lg font-bold text-foreground">{step.title}</p>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Support options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          {supportOptions.map((opt, i) => (
            <div key={i} className="card-motorsport p-5 text-center">
              <opt.icon className="w-6 h-6 text-primary mx-auto mb-3" />
              <p className="font-medium text-foreground text-sm mb-1">{opt.label}</p>
              <p className="text-xs text-muted-foreground">{opt.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
