export interface BlogPost {
  slug: string;
  title: string;
  intro: string;
  outline: string[];
  category: string;
  readTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "speeduino-in-europe",
    title: "Speeduino in Europe: What to Buy and How to Start",
    intro: "A practical guide for European enthusiasts looking to start with Speeduino. We cover what to order, where to source parts, and how EU shipping and VAT work for aftermarket ECU components.",
    outline: ["Why Speeduino is gaining traction in Europe", "What you need to order (and what you probably already have)", "EU-friendly sourcing for sensors and harnesses", "VAT and shipping considerations", "Getting started: your first weekend with Speeduino"],
    category: "Getting Started",
    readTime: "8 min",
  },
  {
    slug: "aftermarket-ecu-comparison",
    title: "Aftermarket ECU Comparison: What Actually Matters",
    intro: "Not all ECU comparisons are created equal. We break down the dimensions that actually affect your build — cost, flexibility, community support, and real-world usability — without the marketing hype.",
    outline: ["The dimensions that matter (and the ones that don't)", "Open-source vs closed-source: practical implications", "Total cost of ownership", "Community and learning resources", "Matching the ECU to your goals"],
    category: "Comparisons",
    readTime: "10 min",
  },
  {
    slug: "wiring-basics",
    title: "Wiring Basics: Grounds, Shielding, and Noise",
    intro: "Poor wiring causes more aftermarket ECU problems than anything else. Learn the fundamentals of engine bay wiring — grounding strategy, shielded cables, and keeping electrical noise away from your sensors.",
    outline: ["Why wiring matters more than you think", "Star grounding explained", "Shielding sensor wires", "Separating power and signal circuits", "Common mistakes and how to test your harness"],
    category: "Guides",
    readTime: "7 min",
  },
  {
    slug: "turbo-control-basics",
    title: "Turbo Control Basics with an Aftermarket ECU",
    intro: "Boost control is one of the most rewarding features of a standalone ECU. Here's how it works on Speeduino — from solenoid wiring to closed-loop PID tuning.",
    outline: ["How electronic boost control works", "Open-loop vs closed-loop", "Solenoid selection and wiring", "Setting up boost control in TunerStudio", "Safety: overboost protection and fuel cut"],
    category: "Guides",
    readTime: "9 min",
  },
  {
    slug: "choosing-sensors",
    title: "Choosing Sensors: MAP, IAT, CLT, and Wideband",
    intro: "The right sensors make tuning easier and your engine safer. We explain what each sensor does, what specifications to look for, and which ones we recommend for Speeduino builds.",
    outline: ["Required vs optional sensors", "MAP sensors: 1-bar, 2-bar, 3-bar", "Temperature sensors: NTC characteristics and calibration", "Wideband O2: why it's essential for tuning", "Sensor placement best practices"],
    category: "Guides",
    readTime: "8 min",
  },
  {
    slug: "first-start-checklist",
    title: "First Start Checklist: Before You Turn the Key",
    intro: "The moment before first start is exciting — but also where mistakes happen. Use this checklist to verify wiring, sensor readings, fuel pressure, and base map settings before cranking.",
    outline: ["Pre-start wiring verification", "Sensor readings sanity check", "Fuel system priming", "Base map essentials", "First crank procedure", "What to do if it doesn't start"],
    category: "Getting Started",
    readTime: "6 min",
  },
  {
    slug: "base-maps-explained",
    title: "Base Maps: What They Are and What They Are NOT",
    intro: "A base map gets your engine running — but it's not a tune. Understanding the difference will save you time, frustration, and potentially your engine.",
    outline: ["What a base map actually contains", "Why no base map is perfect for your engine", "How to adjust VE and spark tables", "When to use auto-tune", "The path from base map to proper tune"],
    category: "Tuning",
    readTime: "7 min",
  },
  {
    slug: "common-tuning-mistakes",
    title: "Common Tuning Mistakes and How to Avoid Them",
    intro: "Even experienced builders make tuning mistakes. We cover the most common pitfalls — from incorrect sensor calibration to chasing AFR numbers without understanding why.",
    outline: ["Incorrect sensor calibration", "Ignoring coolant and IAT corrections", "Over-relying on auto-tune", "Spark timing safety margins", "Not logging enough data", "When to ask for help"],
    category: "Tuning",
    readTime: "9 min",
  },
];
