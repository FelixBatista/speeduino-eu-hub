import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
const ecuProduct = "/assets/ecu-product.jpg";
import { Cpu, Shield, Plug, Thermometer, Expand, Wrench } from "lucide-react";

const features = [
  { icon: Plug, label: "Ampseal Connectors", desc: "Automotive-grade, weather-resistant connections" },
  { icon: Shield, label: "Protected Outputs", desc: "Flyback diodes and fused driver circuits" },
  { icon: Thermometer, label: "Thermal Design", desc: "Designed for under-hood temperatures" },
  { icon: Cpu, label: "ATmega2560", desc: "Proven processor with extensive library support" },
  { icon: Expand, label: "I/O Expansion", desc: "GPIO expanders, CAN bus, Bluetooth add-ons" },
  { icon: Wrench, label: "Serviceable", desc: "Through-hole components you can replace" },
];

export default function ElectronicsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-5, 5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 0.95]);

  return (
    <section className="py-20 md:py-32 relative overflow-hidden" ref={ref}>
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Animated ECU */}
          <motion.div style={{ y, rotate, scale }} className="relative">
            <div className="relative aspect-square max-w-md mx-auto">
              <img
                src={ecuProduct}
                alt="Speeduino ECU board closeup"
                className="w-full h-full object-cover rounded-2xl"
                loading="lazy"
              />
              <div className="absolute inset-0 rounded-2xl glow-racing opacity-30" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="data-label text-primary mb-3">Under the Hood</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Engineering You Can Inspect
            </h2>
            <p className="text-muted-foreground mb-8">
              Every component is chosen for reliability in automotive environments. Open schematics mean you can verify every design decision.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <f.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{f.label}</p>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
