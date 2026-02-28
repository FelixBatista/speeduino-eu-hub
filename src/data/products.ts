export interface Product {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  longDescription: string;
  priceEUR: number;
  priceSEK: number;
  category: "ecu" | "harness" | "sensors" | "bundle";
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  leadTimeDays: string;
  included: string[];
  notIncluded?: string[];
  badge?: string;
  featured: boolean;
  inStock: boolean;
  images: string[];
  specs: Record<string, string>;
  /** Stripe Payment Link URL — create in Stripe Dashboard → Payment Links */
  stripePaymentLink?: string;
}

export const products: Product[] = [
  {
    id: "diy-kit",
    slug: "speeduino-diy-kit",
    name: "Speeduino DIY Kit (Unsoldered PCB + Components)",
    shortName: "DIY Kit",
    description: "Full component kit with PCB — solder it yourself for the best price. Ideal for builders who want full control.",
    longDescription: "Everything you need to build your own Speeduino ECU from scratch. Includes the PCB, all SMD and through-hole components, connectors, and a detailed assembly guide. Perfect for experienced builders or anyone who wants to learn.",
    priceEUR: 89,
    priceSEK: 999,
    category: "ecu",
    skillLevel: "Advanced",
    leadTimeDays: "3–7",
    included: [
      "Speeduino PCB (v0.4.x series)",
      "All SMD & through-hole components",
      "Arduino MEGA 2560",
      "Ampseal connectors",
      "Assembly guide (PDF)",
    ],
    notIncluded: ["Enclosure", "Wiring harness", "Sensors", "Wideband controller"],
    badge: "Best Value",
    featured: true,
    inStock: true,
    images: [],
    specs: {
      "Processor": "ATmega2560 @ 16 MHz",
      "Injector outputs": "Up to 8 (batch/semi-seq/seq)",
      "Ignition outputs": "Up to 8 (wasted spark / COP)",
      "Inputs": "MAP, TPS, IAT, CLT, O2, Flex fuel",
      "Communication": "USB, Serial, Bluetooth-ready",
      "Enclosure": "Not included (available separately)",
    },
  },
  {
    id: "assembled-ecu",
    slug: "speeduino-assembled-ecu",
    name: "Speeduino Assembled & Tested ECU",
    shortName: "Assembled ECU",
    description: "Ready-to-wire ECU, fully assembled and bench-tested. The fastest way to get started.",
    longDescription: "A fully assembled, soldered, and bench-tested Speeduino ECU in a weather-resistant enclosure. Just wire it up, load a base map, and go. Every unit is tested before shipping.",
    priceEUR: 229,
    priceSEK: 2499,
    category: "ecu",
    skillLevel: "Beginner",
    leadTimeDays: "5–10",
    included: [
      "Assembled Speeduino ECU",
      "Aluminium enclosure",
      "Ampseal connector with pins",
      "USB cable",
      "Quick-start guide",
    ],
    notIncluded: ["Wiring harness", "Sensors", "Wideband controller"],
    badge: "Most Popular",
    featured: true,
    inStock: true,
    images: [],
    specs: {
      "Processor": "ATmega2560 @ 16 MHz",
      "Injector outputs": "Up to 8",
      "Ignition outputs": "Up to 8",
      "Enclosure": "IP54 aluminium, 120×90×35 mm",
      "Connector": "Ampseal 35-pin",
      "Testing": "Bench-tested before shipping",
    },
  },
  {
    id: "harness-kit",
    slug: "speeduino-wiring-harness-kit",
    name: "Universal Wiring Harness + Sensor Starter Pack",
    shortName: "Harness + Sensors",
    description: "Pre-terminated harness with core sensors included. Saves hours of wiring work.",
    longDescription: "A pre-made wiring harness with labeled connectors, designed to match the Speeduino pinout. Includes core sensors (MAP, IAT, CLT) and a wideband controller input connector.",
    priceEUR: 149,
    priceSEK: 1599,
    category: "harness",
    skillLevel: "Intermediate",
    leadTimeDays: "5–10",
    included: [
      "Pre-terminated wiring harness (2.5 m)",
      "MAP sensor (3-bar)",
      "IAT sensor (GM-style)",
      "CLT sensor (GM-style)",
      "Relay board (fuel pump, ignition, fan)",
      "Fuse box (mini blade)",
      "Wideband input connector",
    ],
    notIncluded: ["ECU", "Wideband controller + sensor", "Injector connectors (vehicle-specific)"],
    featured: true,
    inStock: true,
    images: [],
    specs: {
      "Harness length": "2.5 m main trunk",
      "Wire gauge": "20–22 AWG (Tefzel/TXL)",
      "MAP sensor": "3-bar, 5V analog",
      "Temp sensors": "GM-style NTC, 1/8 NPT",
      "Relay board": "4-channel, 30A relays",
    },
  },
  {
    id: "sensor-pack",
    slug: "speeduino-sensor-pack",
    name: "Sensor Upgrade Pack",
    shortName: "Sensor Pack",
    description: "Everything to go from basic to fully instrumented: wideband, knock sensor, flex fuel, and more.",
    longDescription: "Upgrade your Speeduino setup with high-quality sensors. Includes a wideband O2 controller, knock sensor, flex fuel sensor input, and all necessary adapters.",
    priceEUR: 199,
    priceSEK: 2199,
    category: "sensors",
    skillLevel: "Intermediate",
    leadTimeDays: "5–10",
    included: [
      "Wideband O2 controller + sensor",
      "Knock sensor (flat-response)",
      "Flex fuel sensor adapter",
      "Boost control solenoid (3-port MAC)",
      "Idle air control valve (2-wire PWM)",
      "Connectors & pigtails",
    ],
    featured: false,
    inStock: true,
    images: [],
    specs: {
      "Wideband": "LSU 4.9 compatible, 0–5V output",
      "Knock sensor": "Flat-response, wideband type",
      "Boost solenoid": "MAC 3-port, 12V PWM",
      "IAC valve": "2-wire PWM, 12V",
    },
  },
  {
    id: "volvo-p2-bundle",
    slug: "speeduino-volvo-p2-bundle",
    name: "Volvo P2 5-Cylinder Turbo Starter Bundle",
    shortName: "Volvo P2 Bundle",
    description: "A curated bundle for Volvo P2 (S60, V70, S80) 5-cylinder turbo conversions. ECU + harness + key sensors.",
    longDescription: "Built specifically for the Volvo P2 platform (2001–2009 S60, V70, S80 with B5254T turbo 5-cylinder). Includes an assembled ECU, platform-specific harness notes, and core sensors. An excellent starting point for your Volvo project.",
    priceEUR: 399,
    priceSEK: 4299,
    category: "bundle",
    skillLevel: "Intermediate",
    leadTimeDays: "7–14",
    included: [
      "Assembled & tested Speeduino ECU",
      "Universal harness (with P2-specific wiring guide)",
      "MAP sensor (3-bar)",
      "IAT & CLT sensors",
      "Wideband O2 controller + sensor",
      "Boost control solenoid",
      "Volvo P2 wiring reference PDF",
    ],
    notIncluded: ["Coil-on-plug adapters (use OEM)", "Injectors (use OEM or aftermarket)", "Tuning (base map provided)"],
    badge: "Platform Kit",
    featured: true,
    inStock: true,
    images: [],
    specs: {
      "Target platform": "Volvo P2 (S60/V70/S80) B5254T",
      "Cylinders": "5-cylinder",
      "Ignition": "Coil-on-plug (OEM coils supported)",
      "Injection": "Sequential-capable",
      "Boost control": "Included (3-port solenoid)",
    },
  },
];

export const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const getFeaturedProducts = () => products.filter((p) => p.featured);
