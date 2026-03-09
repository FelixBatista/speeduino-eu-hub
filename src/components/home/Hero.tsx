import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Truck, Github, Headphones, FileSearch } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const trustItems = [
  { icon: Truck, label: "EU Shipping" },
  { icon: Github, label: "Open-Source Ecosystem" },
  { icon: Headphones, label: "Tuning Support Available" },
  { icon: FileSearch, label: "Transparent Specs" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Motorsport garage with engine bay and rally car"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* HUD elements */}
      <div className="hud-element top-24 right-8 w-32 h-32 rounded opacity-20 hidden lg:block" />
      <div className="hud-element bottom-32 left-12 w-20 h-20 rounded opacity-15 hidden lg:block" />
      <div className="absolute top-1/3 right-16 w-px h-24 bg-primary/10 hidden lg:block" />

      {/* Content */}
      <div className="container relative z-10 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <p className="data-label text-primary mb-4">Open-Source Engine Management</p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.05] mb-6">
            The ECU You Can{" "}
            <span className="text-gradient">Actually Own</span>
          </h1>
          <p className="text-lg md:text-xl text-secondary-foreground/80 mb-10 max-w-xl leading-relaxed">
            Open hardware, open firmware, no license fees.
            From 4 to 8 cylinders, batch to sequential, NA to turbo. Built for enthusiasts who want transparency, not lock-in.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-14">
            <Link to="/find-my-kit" className="cta-primary">
              Find My Kit
            </Link>
            <Link to="/shop" className="cta-secondary">
              Shop Bundles
            </Link>
          </div>

          {/* Trust bar */}
          <div className="flex flex-wrap gap-3">
            {trustItems.map((item) => (
              <div key={item.label} className="trust-badge">
                <item.icon className="w-4 h-4 text-primary" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
