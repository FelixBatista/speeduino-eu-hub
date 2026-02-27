export interface VehiclePage {
  slug: string;
  name: string;
  platform: string;
  engine: string;
  years: string;
  cylinders: number;
  induction: "NA" | "Turbo";
  fuelType: string;
  heroTitle: string;
  heroDescription: string;
  metaTitle: string;
  metaDescription: string;
  whySpeeduino: string[];
  installNotes: string[];
  recommendedBundleId: string;
  difficulty: "Easy" | "Moderate" | "Advanced";
  estimatedTime: string;
  communityBuilds: number;
  compatibilityNotes: string;
  seoKeywords: string[];
}

export const vehicles: VehiclePage[] = [
  {
    slug: "volvo-p2-5-cylinder-turbo",
    name: "Volvo P2 5-Cylinder Turbo",
    platform: "Volvo P2",
    engine: "B5254T / B5244T",
    years: "2001–2009",
    cylinders: 5,
    induction: "Turbo",
    fuelType: "Petrol / E85",
    heroTitle: "Speeduino for Volvo P2 5-Cylinder Turbo",
    heroDescription: "Run your S60, V70, or S80 B5254T on a fully open-source ECU. Sequential injection, coil-on-plug, boost control — all supported.",
    metaTitle: "Speeduino ECU Kit for Volvo P2 S60 V70 5-Cylinder Turbo | Speeduino.eu",
    metaDescription: "Affordable standalone ECU for Volvo P2 platform. Supports sequential injection, COP ignition, and electronic boost control on the B5254T 5-cylinder turbo.",
    whySpeeduino: [
      "Full sequential injection on all 5 cylinders",
      "Direct coil-on-plug support using OEM ignition coils",
      "Electronic boost control with closed-loop PID",
      "Flex fuel sensor support for E85 blends",
      "Community-tested wiring guides and base maps available",
      "Fraction of the cost vs Link, Haltech, or MaxxECU",
    ],
    installNotes: [
      "OEM coil-on-plug can be retained — no adapter needed",
      "Crank trigger uses the OEM 60-2 pattern",
      "Cam sensor provides sequential sync",
      "OEM MAP sensor can be reused or upgraded to 3-bar",
      "Recommend dedicated wideband O2 controller for tuning",
      "ETB (electronic throttle body) requires external controller or cable throttle conversion",
    ],
    recommendedBundleId: "volvo-p2-bundle",
    difficulty: "Moderate",
    estimatedTime: "2–3 weekends",
    communityBuilds: 15,
    compatibilityNotes: "The B5254T uses a 60-2 crank trigger and VVT cam. Speeduino supports the crank pattern natively. VVT control is available via firmware. Automatic transmissions require a separate TCU — Speeduino does not control the Aisin AW55-50/51 gearbox.",
    seoKeywords: ["speeduino volvo s60", "speeduino volvo p2", "standalone ecu volvo 5 cylinder", "speeduino b5254t", "open source ecu volvo turbo"],
  },
  {
    slug: "volvo-na-5-cylinder",
    name: "Volvo NA 5-Cylinder",
    platform: "Volvo P2 / P80",
    engine: "B5252 / B5244 (NA)",
    years: "1997–2009",
    cylinders: 5,
    induction: "NA",
    fuelType: "Petrol",
    heroTitle: "Speeduino for Volvo NA 5-Cylinder Engines",
    heroDescription: "Upgrade your naturally aspirated Volvo 5-cylinder with a modern standalone ECU. Perfect for turbo conversion projects or performance NA builds.",
    metaTitle: "Speeduino ECU for Volvo NA 5-Cylinder B5252 B5244 | Speeduino.eu",
    metaDescription: "Open-source ECU solution for Volvo naturally aspirated 5-cylinder engines. Ideal for turbo conversion prep or standalone engine management on a budget.",
    whySpeeduino: [
      "Perfect base for NA-to-turbo conversion projects",
      "Sequential injection capable on all 5 cylinders",
      "OEM sensor compatibility for easy swap",
      "Dramatically lower cost than commercial standalone ECUs",
      "Community support and base maps available",
      "Full data logging via TunerStudio",
    ],
    installNotes: [
      "Same crank trigger pattern as turbo variants (60-2)",
      "If converting to turbo, add MAP sensor upgrade and boost solenoid",
      "OEM injectors are sufficient for mild builds",
      "Wideband O2 recommended even on NA builds for optimal tuning",
      "Cable throttle models are simplest to convert",
    ],
    recommendedBundleId: "assembled-ecu",
    difficulty: "Moderate",
    estimatedTime: "2 weekends",
    communityBuilds: 8,
    compatibilityNotes: "NA 5-cylinder Volvos share the same crank trigger as turbo variants. The primary wiring differences are the absence of boost control and wastegate solenoid wiring. If planning a turbo conversion, consider the Volvo P2 Bundle which includes boost control hardware.",
    seoKeywords: ["speeduino volvo na", "standalone ecu volvo 5 cylinder na", "volvo b5252 ecu", "speeduino volvo turbo conversion"],
  },
  {
    slug: "4-cylinder-turbo-universal",
    name: "4-Cylinder Turbo (Universal)",
    platform: "Universal",
    engine: "Any 4-cyl turbo",
    years: "Any",
    cylinders: 4,
    induction: "Turbo",
    fuelType: "Petrol / E85",
    heroTitle: "Speeduino for 4-Cylinder Turbo Engines",
    heroDescription: "The most popular Speeduino configuration. Full sequential injection, COP ignition, and boost control for any 4-cylinder turbo engine.",
    metaTitle: "Speeduino ECU Kit for 4-Cylinder Turbo Engines | Speeduino.eu",
    metaDescription: "Universal Speeduino ECU kit for 4-cylinder turbo engines. Supports sequential injection, coil-on-plug, boost control, and flex fuel. Ships from the EU.",
    whySpeeduino: [
      "The most tested and community-supported configuration",
      "Full sequential injection on 4 channels",
      "Coil-on-plug with individual cylinder timing",
      "Closed-loop boost control included",
      "Hundreds of community builds and base maps",
      "Best value standalone ECU on the market",
    ],
    installNotes: [
      "Verify your crank trigger pattern (36-1, 60-2, etc.) is supported",
      "Most 4-cyl turbo engines work with minimal configuration",
      "Wideband O2 essential for turbo tuning",
      "Plan your idle control strategy (stepper vs PWM)",
      "Consider a relay board for fuel pump and fan control",
    ],
    recommendedBundleId: "assembled-ecu",
    difficulty: "Easy",
    estimatedTime: "1–2 weekends",
    communityBuilds: 200,
    compatibilityNotes: "4-cylinder engines are the primary development target for Speeduino. Nearly all common crank trigger patterns are supported. Both batch and sequential injection are available. Coil-on-plug and wasted spark ignition modes are fully supported.",
    seoKeywords: ["speeduino 4 cylinder", "standalone ecu 4 cylinder turbo", "budget ecu turbo", "speeduino turbo kit"],
  },
  {
    slug: "6-cylinder-universal",
    name: "6-Cylinder (Universal)",
    platform: "Universal",
    engine: "Any inline-6 or V6",
    years: "Any",
    cylinders: 6,
    induction: "NA",
    fuelType: "Petrol",
    heroTitle: "Speeduino for 6-Cylinder Engines",
    heroDescription: "Run your inline-6 or V6 on Speeduino. Sequential injection and individual coil control with the right hardware configuration.",
    metaTitle: "Speeduino ECU for 6-Cylinder Engines — Inline 6 & V6 | Speeduino.eu",
    metaDescription: "Speeduino ECU kits for 6-cylinder engines. Supports sequential injection with expansion, wasted spark and COP ignition. EU shipping.",
    whySpeeduino: [
      "Sequential injection possible with 6+ output hardware",
      "Wasted spark ignition (3 coils) or COP (6 coils)",
      "Community firmware actively developing 6-cyl support",
      "Significant cost savings vs commercial 6-cyl ECUs",
      "Full data logging and tuning via TunerStudio",
    ],
    installNotes: [
      "6 injector outputs may require expansion board or specific PCB variant",
      "Verify your trigger pattern is supported before ordering",
      "Wasted spark (3 coils) is simpler than full COP for initial setup",
      "Some V6 configurations require specific cam sync patterns",
    ],
    recommendedBundleId: "assembled-ecu",
    difficulty: "Advanced",
    estimatedTime: "3+ weekends",
    communityBuilds: 25,
    compatibilityNotes: "6-cylinder support depends on the specific hardware variant and firmware version. Inline-6 engines are generally more straightforward than V6 configurations. Verify your specific trigger pattern and injection requirements before ordering. Contact us if unsure.",
    seoKeywords: ["speeduino 6 cylinder", "speeduino inline 6", "speeduino v6", "standalone ecu 6 cylinder budget"],
  },
  {
    slug: "8-cylinder-v8-universal",
    name: "V8 (Universal)",
    platform: "Universal",
    engine: "Any V8",
    years: "Any",
    cylinders: 8,
    induction: "NA",
    fuelType: "Petrol",
    heroTitle: "Speeduino for V8 Engines",
    heroDescription: "Running a V8 on Speeduino is achievable with the right hardware. Batch or semi-sequential injection with wasted spark ignition.",
    metaTitle: "Speeduino ECU for V8 Engines | Speeduino.eu",
    metaDescription: "Speeduino ECU options for V8 engines. Batch and semi-sequential injection with wasted spark ignition support. Budget-friendly standalone ECU from the EU.",
    whySpeeduino: [
      "Batch or semi-sequential injection on 8 cylinders",
      "Wasted spark ignition (4 coils) well supported",
      "Dramatically cheaper than commercial V8-capable ECUs",
      "Active community development for V8 applications",
      "Full logging and tuning capabilities",
    ],
    installNotes: [
      "8 sequential outputs require specific hardware or expansion",
      "Batch fire (2 injectors per output) is the simplest starting point",
      "Wasted spark with 4 coil packs is most common",
      "GM LS and Ford 5.0 Coyote trigger patterns are supported",
      "Distributor-based V8s can use single ignition output mode",
    ],
    recommendedBundleId: "assembled-ecu",
    difficulty: "Advanced",
    estimatedTime: "3+ weekends",
    communityBuilds: 12,
    compatibilityNotes: "V8 support varies by firmware version and hardware variant. Batch injection with wasted spark is the most proven configuration. Full sequential injection on all 8 cylinders requires specific hardware with sufficient I/O. GM LS and Ford trigger patterns are well supported. Contact us for guidance on your specific engine.",
    seoKeywords: ["speeduino v8", "standalone ecu v8 budget", "speeduino ls swap", "speeduino ford 5.0"],
  },
];

export const getVehicleBySlug = (slug: string) => vehicles.find((v) => v.slug === slug);
