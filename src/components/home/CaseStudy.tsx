import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import dynoChart from "@/assets/dyno-chart.jpg";
import { TrendingUp, Gauge, Fuel, Quote } from "lucide-react";

const metrics = [
  { icon: TrendingUp, value: "+18%", label: "Peak Power Gain" },
  { icon: Gauge, value: "< 2s", label: "Cold Start Time" },
  { icon: Fuel, value: "-12%", label: "Fuel Consumption (cruise)" },
];

export default function CaseStudy() {
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
          <p className="data-label text-primary mb-3">Case Study</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Real Results, Real Build
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Dyno chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="rounded-xl overflow-hidden border border-border">
              <img src={dynoChart} alt="Before and after dyno comparison chart" className="w-full" loading="lazy" />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center italic">
              Example dyno data — actual results vary by setup. Shown for illustration purposes.
            </p>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="font-display text-2xl font-bold text-foreground mb-4">
              Volvo S60 2.4T — From OEM to Open-Source
            </h3>
            <p className="text-muted-foreground mb-6">
              Converted from the factory ME7 ECU to Speeduino with sequential injection, coil-on-plug, and closed-loop boost control. Full wideband tuning on E85.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {metrics.map((m, i) => (
                <div key={i} className="card-motorsport p-4 text-center">
                  <m.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="font-mono text-xl font-bold text-foreground">{m.value}</p>
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="card-motorsport p-5 relative">
              <Quote className="w-8 h-8 text-primary/20 absolute top-3 right-3" />
              <p className="text-sm text-secondary-foreground italic mb-3">
                "Switching to an open-source ECU was the best decision for this build. Full control over every parameter, zero license fees, and the community support is incredible."
              </p>
              <p className="text-xs text-muted-foreground">— Builder from Stockholm, Sweden</p>
            </div>

            <div className="mt-6">
              <Link to="/shop" className="text-primary text-sm font-medium hover:underline">
                See more builds →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
