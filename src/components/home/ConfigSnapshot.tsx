import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { supportedConfigs } from "@/data/compatibility";
import { Link } from "react-router-dom";
import { Cpu, Fuel, Zap, Gauge, Settings, ArrowRight } from "lucide-react";

const highlights = [
  { icon: Cpu, label: "Cylinders", value: supportedConfigs.cylinders.range, note: supportedConfigs.cylinders.notes },
  { icon: Fuel, label: "Injection Modes", value: supportedConfigs.injectors.modes.join(", "), note: supportedConfigs.injectors.notes },
  { icon: Zap, label: "Ignition Modes", value: supportedConfigs.ignition.modes.join(", "), note: supportedConfigs.ignition.notes },
  { icon: Gauge, label: "Boost Control", value: supportedConfigs.control.boost.type, note: "" },
  { icon: Settings, label: "Idle Control", value: supportedConfigs.control.idle.type, note: "" },
];

export default function ConfigSnapshot() {
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
          className="text-center mb-12"
        >
          <p className="data-label text-primary mb-3">Supported Configurations</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
            What Your ECU Can Run
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
          {highlights.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
              className="card-motorsport p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                  <h.icon className="w-4 h-4 text-primary" />
                </div>
                <p className="font-display text-sm font-bold text-foreground uppercase">{h.label}</p>
              </div>
              <p className="text-sm text-secondary-foreground mb-1">{h.value}</p>
              {h.note && <p className="text-xs text-muted-foreground">{h.note}</p>}
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/find-my-kit" className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:underline">
            View full compatibility details <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
