// ---------------------------------------------------------------------------
// Product catalog — DIY-first Speeduino component shop
// ---------------------------------------------------------------------------
// Configurator inputs that drive product visibility:
//   boardFamily:       "v0.3" | "v0.4"
//   crankSignal:       "hall_5v" | "vr"
//   camSignal:         "none" | "hall_5v" | "vr"
//   o2:                "none" | "narrowband" | "wideband"
//   idleControl:       "none" | "pwm_2wire" | "pwm_3wire" | "stepper_4wire"
//   boostControl:      "yes" | "no"
//   flexFuel:          "yes" | "no"
//   injectors:         "highZ" | "lowZ"
//   ignitionHardware:  "smart_coils" | "dumb_coils_need_driver"
// ---------------------------------------------------------------------------

export type ProductCategory = "board" | "sensor" | "module" | "accessory";

/**
 * A single condition set where every field must match (AND).
 * The product is shown if ANY ShowCondition in the array matches (OR).
 * An empty object {} always matches (unconditional).
 */
export interface ShowCondition {
  [field: string]: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  longDescription: string;
  priceEUR: number;
  priceSEK: number;
  category: ProductCategory;
  boardCompatibility: ("v0.3" | "v0.4")[];
  connectsTo: string;
  requirementLevel: "required" | "recommended" | "optional";
  /** OR-array of AND-condition sets. Empty array or omitted = always visible. */
  showConditions?: ShowCondition[];
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  leadTimeDays: string;
  included: string[];
  notIncluded?: string[];
  badge?: string;
  featured: boolean;
  inStock: boolean;
  images: string[];
  specs: Record<string, string>;
  stripePaymentLink?: string;
}

// ---------------------------------------------------------------------------
// Configurator input types (used by the configurator UI)
// ---------------------------------------------------------------------------
export interface ConfiguratorInputs {
  boardFamily: "v0.3" | "v0.4";
  crankSignal: "hall_5v" | "vr";
  camSignal: "none" | "hall_5v" | "vr";
  o2: "none" | "narrowband" | "wideband";
  idleControl: "none" | "pwm_2wire" | "pwm_3wire" | "stepper_4wire";
  boostControl: "yes" | "no";
  flexFuel: "yes" | "no";
  injectors: "highZ" | "lowZ";
  ignitionHardware: "smart_coils" | "dumb_coils_need_driver";
}

export const configuratorSteps: {
  field: keyof ConfiguratorInputs;
  label: string;
  description: string;
  options: { value: string; label: string; hint?: string }[];
}[] = [
  {
    field: "boardFamily",
    label: "Board Version",
    description: "Which Speeduino board will you build?",
    options: [
      { value: "v0.3", label: "v0.3", hint: "Screw terminals, prototype-friendly" },
      { value: "v0.4", label: "v0.4", hint: "IDC40 connector, enclosure-friendly, stepper mount" },
    ],
  },
  {
    field: "crankSignal",
    label: "Crank Signal Type",
    description: "What type of crank position sensor does your engine use?",
    options: [
      { value: "hall_5v", label: "Hall / 5V digital" },
      { value: "vr", label: "VR (variable reluctance)", hint: "Needs VR conditioner module" },
    ],
  },
  {
    field: "camSignal",
    label: "Cam Signal",
    description: "Do you have a cam position sensor? (needed for sequential injection)",
    options: [
      { value: "none", label: "No cam sensor" },
      { value: "hall_5v", label: "Hall / 5V digital" },
      { value: "vr", label: "VR (variable reluctance)", hint: "Needs VR conditioner module" },
    ],
  },
  {
    field: "o2",
    label: "O2 Sensor",
    description: "What lambda/O2 feedback will you use?",
    options: [
      { value: "none", label: "None" },
      { value: "narrowband", label: "Narrowband (OEM)", hint: "Basic, on/off reading" },
      { value: "wideband", label: "Wideband", hint: "Strongly recommended for tuning" },
    ],
  },
  {
    field: "idleControl",
    label: "Idle Control",
    description: "How will you control idle speed?",
    options: [
      { value: "none", label: "None / manual" },
      { value: "pwm_2wire", label: "PWM 2-wire valve" },
      { value: "pwm_3wire", label: "PWM 3-wire valve" },
      { value: "stepper_4wire", label: "Stepper motor (4-wire)", hint: "v0.4 has DRV8825 mount" },
    ],
  },
  {
    field: "boostControl",
    label: "Boost Control",
    description: "Do you need electronic boost control?",
    options: [
      { value: "no", label: "No" },
      { value: "yes", label: "Yes", hint: "Requires boost control solenoid" },
    ],
  },
  {
    field: "flexFuel",
    label: "Flex Fuel",
    description: "Will you run a flex fuel sensor for ethanol content?",
    options: [
      { value: "no", label: "No" },
      { value: "yes", label: "Yes", hint: "GM/Continental frequency sensor" },
    ],
  },
  {
    field: "injectors",
    label: "Injector Type",
    description: "What impedance are your fuel injectors?",
    options: [
      { value: "highZ", label: "High impedance (>8 Ω)", hint: "Most modern injectors" },
      { value: "lowZ", label: "Low impedance (<5 Ω)", hint: "Needs ballast resistor pack" },
    ],
  },
  {
    field: "ignitionHardware",
    label: "Ignition Hardware",
    description: "What type of ignition coils will you use?",
    options: [
      { value: "smart_coils", label: "Smart coils (built-in driver)", hint: "VW/Audi, most modern COP" },
      { value: "dumb_coils_need_driver", label: "Dumb coils (need external driver)", hint: "Older coil packs, requires ignition driver module" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Product catalog
// ---------------------------------------------------------------------------
export const products: Product[] = [
  // ── BOARDS ──────────────────────────────────────────────────────────────
  {
    id: "v03-pcb",
    slug: "speeduino-v03-pcb",
    name: "Speeduino v0.3 PCB (DIY Kit)",
    shortName: "v0.3 Board",
    description: "Screw-terminal ECU shield — prototype-friendly, easy to debug. Ideal for first builds.",
    longDescription: "The v0.3 Speeduino shield uses screw terminals for all I/O connections, making it the easiest board to wire and troubleshoot. Perfect for bench testing, learning, and prototype builds. Requires an Arduino Mega 2560 (sold separately or as a bundle).",
    priceEUR: 21,
    priceSEK: 239,
    category: "board",
    boardCompatibility: ["v0.3"],
    connectsTo: "Stacks onto Arduino Mega 2560",
    requirementLevel: "required",
    showConditions: [{ boardFamily: ["v0.3"] }],
    skillLevel: "Intermediate",
    leadTimeDays: "3–7",
    included: ["Speeduino v0.3 PCB", "Through-hole component kit", "Assembly guide (PDF)"],
    notIncluded: ["Arduino Mega 2560", "Sensors", "Wideband controller", "Enclosure"],
    featured: true,
    inStock: true,
    images: [],
    specs: {
      "Board version": "v0.3",
      "I/O connection": "Screw terminals",
      "Injector outputs": "4 (batch / semi-sequential)",
      "Ignition outputs": "4 (wasted spark / COP)",
      "VR conditioner socket": "Yes (IC3)",
      "Stepper IAC mount": "No",
    },
  },
  {
    id: "v04-pcb",
    slug: "speeduino-v04-pcb",
    name: "Speeduino v0.4 PCB (DIY Kit)",
    shortName: "v0.4 Board",
    description: "IDC40-based ECU shield — enclosure-friendly with stepper IAC mount. The most popular board.",
    longDescription: "The v0.4 board routes all I/O through a single IDC40 header (except 12V power), making it ideal for enclosures and interface boards. Includes a DRV8825 stepper driver mount for 4-wire IAC valves. Supports up to 8 cylinders on v0.4.4c+.",
    priceEUR: 25,
    priceSEK: 289,
    category: "board",
    boardCompatibility: ["v0.4"],
    connectsTo: "Stacks onto Arduino Mega 2560",
    requirementLevel: "required",
    showConditions: [{ boardFamily: ["v0.4"] }],
    skillLevel: "Intermediate",
    leadTimeDays: "3–7",
    included: ["Speeduino v0.4 PCB", "Through-hole component kit", "Assembly guide (PDF)"],
    notIncluded: ["Arduino Mega 2560", "IDC40 plug", "Sensors", "Wideband controller", "Enclosure"],
    badge: "Most Popular",
    featured: true,
    inStock: true,
    images: [],
    specs: {
      "Board version": "v0.4.x",
      "I/O connection": "IDC40 header",
      "Injector outputs": "Up to 8 (v0.4.4c+)",
      "Ignition outputs": "Up to 8 (v0.4.4c+)",
      "VR conditioner socket": "Yes (IC3)",
      "Stepper IAC mount": "Yes (DRV8825)",
    },
  },
  {
    id: "arduino-mega",
    slug: "arduino-mega-2560",
    name: "Arduino Mega 2560 R3 (ATmega16U2)",
    shortName: "Arduino Mega",
    description: "The controller board for Speeduino. ATmega16U2 USB chip recommended over CH340 clones.",
    longDescription: "The Arduino Mega 2560 is the brain of every Speeduino build. The official ATmega16U2 variant is recommended by the Speeduino documentation for reliable USB communication. CH340-based clones may require additional drivers and can cause connectivity issues.",
    priceEUR: 25,
    priceSEK: 289,
    category: "board",
    boardCompatibility: ["v0.3", "v0.4"],
    connectsTo: "Base board — Speeduino shield stacks on top",
    requirementLevel: "required",
    skillLevel: "Beginner",
    leadTimeDays: "3–5",
    included: ["Arduino Mega 2560 R3", "USB cable"],
    badge: "Essential",
    featured: true,
    inStock: true,
    images: [],
    specs: {
      "Processor": "ATmega2560 @ 16 MHz",
      "USB chip": "ATmega16U2 (recommended)",
      "Flash": "256 KB",
      "SRAM": "8 KB",
      "Digital I/O": "54 pins",
      "Analog inputs": "16 pins",
    },
  },

  // ── MODULES & DRIVERS ───────────────────────────────────────────────────
  {
    id: "vr-conditioner",
    slug: "vr-conditioner-max9926",
    name: "VR Conditioner Module (MAX9926)",
    shortName: "VR Conditioner",
    description: "Converts VR crank/cam sine wave to 0–5V square wave. Required for engines with VR sensors.",
    longDescription: "Variable reluctance (VR) sensors output a sine wave that the Arduino cannot read directly. This dual-channel MAX9926-based conditioner converts the VR signal into a clean 0–5V square wave. Plugs into the IC3 socket on both v0.3 and v0.4 boards.",
    priceEUR: 35,
    priceSEK: 399,
    category: "module",
    boardCompatibility: ["v0.3", "v0.4"],
    connectsTo: "IC3 socket on the Speeduino board",
    requirementLevel: "required",
    showConditions: [{ crankSignal: ["vr"] }, { camSignal: ["vr"] }],
    skillLevel: "Beginner",
    leadTimeDays: "3–7",
    included: ["MAX9926 dual VR conditioner module"],
    featured: false,
    inStock: true,
    images: [],
    specs: {
      "IC": "MAX9926 dual VR conditioner",
      "Channels": "2 (crank + cam)",
      "Output": "0–5V square wave",
      "Mount": "IC3 DIP socket on board",
    },
  },
  {
    id: "wideband-controller",
    slug: "wideband-controller-spartan",
    name: "Wideband Controller (14Point7 Spartan 3 Lite)",
    shortName: "Wideband Controller",
    description: "External wideband AFR controller with 0–5V analog output. Essential for tuning.",
    longDescription: "Speeduino cannot read wideband O2 sensors directly — an external controller is required. The 14Point7 Spartan 3 Lite reads a Bosch LSU 4.9 sensor and outputs a 0–5V analog signal that Speeduino can read. The single most important tuning tool.",
    priceEUR: 89,
    priceSEK: 1029,
    category: "module",
    boardCompatibility: ["v0.3", "v0.4"],
    connectsTo: "O2 analog input on the Speeduino board (0–5V)",
    requirementLevel: "recommended",
    showConditions: [{ o2: ["wideband"] }],
    skillLevel: "Beginner",
    leadTimeDays: "5–10",
    included: ["14Point7 Spartan 3 Lite controller"],
    notIncluded: ["Bosch LSU 4.9 sensor (sold separately)", "LSU 4.9 connector (sold separately)"],
    badge: "Tuning Essential",
    featured: true,
    inStock: true,
    images: [],
    specs: {
      "Sensor compatibility": "Bosch LSU 4.9",
      "Output": "0–5V analog (linear)",
      "AFR range": "7.35:1 to free air",
      "Power": "12V DC",
    },
  },
  {
    id: "ignition-driver",
    slug: "ignition-driver-4ch-211",
    name: "Ignition Driver Module (4-Channel, Bosch 211 Style)",
    shortName: "Ignition Driver",
    description: "Required for dumb coils — amplifies Speeduino's low-power ignition signals. Do NOT drive dumb coils directly.",
    longDescription: "Speeduino's ignition outputs are low-power 5V signals. 'Dumb' coils (without built-in igniters) need an external driver module to switch the high current. Driving dumb coils directly WILL damage the Arduino. This 4-channel Bosch 211-style module handles up to 4 coils.",
    priceEUR: 42,
    priceSEK: 479,
    category: "module",
    boardCompatibility: ["v0.3", "v0.4"],
    connectsTo: "Between ECU ignition outputs and coil packs",
    requirementLevel: "required",
    showConditions: [{ ignitionHardware: ["dumb_coils_need_driver"] }],
    skillLevel: "Intermediate",
    leadTimeDays: "5–10",
    included: ["4-channel ignition driver module", "Connector pins"],
    featured: false,
    inStock: true,
    images: [],
    specs: {
      "Channels": "4",
      "Style": "Bosch BIP373 / 211 compatible",
      "Input": "5V logic from ECU",
      "Output": "Switched ground to coil negative",
      "Max dwell": "Configurable in TunerStudio",
    },
  },
  {
    id: "drv8825-stepper",
    slug: "drv8825-stepper-driver",
    name: "Stepper Driver Module (DRV8825)",
    shortName: "DRV8825 Stepper",
    description: "Stepper motor driver for 4-wire IAC valves. Mounts directly on the v0.4 board.",
    longDescription: "The DRV8825 stepper motor driver module plugs into the dedicated mount on the v0.4 board, enabling control of 4-wire stepper-type idle air control (IAC) valves. Includes a heatsink for reliable operation.",
    priceEUR: 7,
    priceSEK: 79,
    category: "module",
    boardCompatibility: ["v0.4"],
    connectsTo: "DRV8825 mount on v0.4 board",
    requirementLevel: "required",
    showConditions: [{ idleControl: ["stepper_4wire"], boardFamily: ["v0.4"] }],
    skillLevel: "Beginner",
    leadTimeDays: "3–5",
    included: ["DRV8825 stepper driver module", "Heatsink"],
    featured: false,
    inStock: true,
    images: [],
    specs: {
      "IC": "Texas Instruments DRV8825",
      "Max current": "2.5A per coil",
      "Microstepping": "Up to 1/32",
      "Mount": "Dedicated socket on v0.4 board",
    },
  },
  {
    id: "ballast-resistor",
    slug: "ballast-resistor-pack",
    name: "Injector Ballast Resistor Pack (4 × 4.7 Ω)",
    shortName: "Ballast Resistors",
    description: "Required for low-impedance injectors. Prevents overcurrent damage to Speeduino driver circuits.",
    longDescription: "Speeduino's injector drivers are designed for high-impedance (>8 Ω) injectors. Low-impedance injectors (<5 Ω) draw too much current and will damage the driver circuits. This ballast resistor pack wires in series with each injector to raise the effective impedance to safe levels.",
    priceEUR: 49,
    priceSEK: 569,
    category: "module",
    boardCompatibility: ["v0.3", "v0.4"],
    connectsTo: "Inline with each fuel injector",
    requirementLevel: "required",
    showConditions: [{ injectors: ["lowZ"] }],
    skillLevel: "Intermediate",
    leadTimeDays: "5–10",
    included: ["4 × 4.7 Ω ceramic resistors", "Mounting hardware"],
    featured: false,
    inStock: true,
    images: [],
    specs: {
      "Resistance": "4.7 Ω per channel",
      "Channels": "4",
      "Power rating": "25W per resistor",
      "Purpose": "Raise low-Z injectors to safe impedance for Speeduino drivers",
    },
  },

  // ── SENSORS ─────────────────────────────────────────────────────────────
  {
    id: "map-sensor",
    slug: "map-sensor-mpx4250",
    name: "MAP Sensor (MPX4250, 2.5 Bar)",
    shortName: "MAP Sensor",
    description: "Recommended MAP sensor for Speeduino. 2.5 bar range covers NA and boosted engines.",
    longDescription: "The MPX4250 is the recommended MAP sensor in the Speeduino documentation. With a 2.5 bar range it covers naturally aspirated engines and most turbo/supercharged setups. Can be mounted directly on some board variants or remotely via a vacuum hose.",
    priceEUR: 35,
    priceSEK: 399,
    category: "sensor",
    boardCompatibility: ["v0.3", "v0.4"],
    connectsTo: "MAP sensor input on the board (onboard mount or remote)",
    requirementLevel: "recommended",
    skillLevel: "Beginner",
    leadTimeDays: "3–7",
    included: ["MPX4250AP MAP sensor"],
    featured: true,
    inStock: true,
    images: [],
    specs: {
      "Type": "Absolute pressure",
      "Range": "20–250 kPa (2.5 bar)",
      "Output": "0.2–4.9V (ratiometric)",
      "Connector": "3-pin",
    },
  },
  {
    id: "iat-sensor",
    slug: "iat-sensor-gm",
    name: "Intake Air Temperature Sensor (GM Open Element)",
    shortName: "IAT Sensor",
    description: "Fast-response open element IAT sensor. Required temp input for accurate fuelling.",
    longDescription: "A 2-wire GM-style open-element intake air temperature sensor. Required for accurate fuel calculations — the ECU adjusts injector pulse width based on air density. The open element design provides fast response times, ideal for turbocharged applications.",
    priceEUR: 15,
    priceSEK: 175,
    category: "sensor",
    boardCompatibility: ["v0.3", "v0.4"],
    connectsTo: "IAT input on the Speeduino board",
    requirementLevel: "recommended",
    skillLevel: "Beginner",
    leadTimeDays: "3–5",
    included: ["GM open element IAT sensor"],
    featured: false,
    inStock: true,
    images: [],
    specs: {
      "Type": "NTC thermistor (2-wire)",
      "Style": "GM open element",
      "Response": "Fast (open element)",
      "Thread": "3/8\" push-in or bung mount",
    },
  },
  {
    id: "clt-sensor",
    slug: "clt-sensor-gm",
    name: "Coolant Temperature Sensor (GM Style)",
    shortName: "CLT Sensor",
    description: "2-wire GM-style coolant temp sensor. Required for cold-start enrichment and fan control.",
    longDescription: "A 2-wire GM-style coolant temperature sensor (NTC thermistor). Required for cold-start enrichment, warm-up curves, and temperature-based fan relay activation. The GM calibration is pre-configured in TunerStudio's default Speeduino settings.",
    priceEUR: 15,
    priceSEK: 175,
    category: "sensor",
    boardCompatibility: ["v0.3", "v0.4"],
    connectsTo: "CLT input on the Speeduino board",
    requirementLevel: "recommended",
    skillLevel: "Beginner",
    leadTimeDays: "3–5",
    included: ["GM-style CLT sensor"],
    featured: false,
    inStock: true,
    images: [],
    specs: {
      "Type": "NTC thermistor (2-wire)",
      "Style": "GM compatible",
      "Thread": "3/8\" NPT (common adapter sizes available)",
      "Calibration": "Pre-configured in TunerStudio",
    },
  },
  {
    id: "tps-sensor",
    slug: "tps-sensor-3wire",
    name: "TPS Sensor (3-Wire Potentiometer)",
    shortName: "TPS Sensor",
    description: "3-wire throttle position sensor. Must be potentiometer type — on/off switches won't work.",
    longDescription: "Speeduino requires a 3-wire potentiometer-type throttle position sensor (5V, signal, ground). On/off switch-type TPS sensors are NOT compatible. Essential for acceleration enrichment, idle validation, and flood-clear mode. Common on swap builds and individual throttle body (ITB) setups.",
    priceEUR: 25,
    priceSEK: 289,
    category: "sensor",
    boardCompatibility: ["v0.3", "v0.4"],
    connectsTo: "TPS input on the Speeduino board",
    requirementLevel: "recommended",
    skillLevel: "Beginner",
    leadTimeDays: "3–7",
    included: ["3-wire potentiometer TPS"],
    featured: false,
    inStock: true,
    images: [],
    specs: {
      "Type": "Linear potentiometer (3-wire)",
      "Output": "0–5V proportional to throttle angle",
      "Wiring": "5V supply, signal, ground",
      "Note": "On/off switch type NOT compatible",
    },
  },
  {
    id: "wideband-o2",
    slug: "wideband-o2-lsu49",
    name: "Wideband O2 Sensor (Bosch LSU 4.9)",
    shortName: "WB O2 Sensor",
    description: "Bosch LSU 4.9 wideband lambda sensor. Pairs with the wideband controller for AFR tuning.",
    longDescription: "The Bosch LSU 4.9 is the industry standard wideband lambda sensor. It pairs with the Spartan 3 Lite controller (or any LSU 4.9-compatible controller) to provide accurate air-fuel ratio readings across the full operating range. Essential for proper tuning.",
    priceEUR: 99,
    priceSEK: 1139,
    category: "sensor",
    boardCompatibility: ["v0.3", "v0.4"],
    connectsTo: "Wideband controller (not directly to ECU)",
    requirementLevel: "recommended",
    showConditions: [{ o2: ["wideband"] }],
    skillLevel: "Beginner",
    leadTimeDays: "5–10",
    included: ["Bosch LSU 4.9 wideband O2 sensor"],
    notIncluded: ["Wideband controller (sold separately)", "Exhaust bung"],
    featured: false,
    inStock: true,
    images: [],
    specs: {
      "Type": "Bosch LSU 4.9 (wide-range lambda)",
      "Connector": "6-pin (controller-specific)",
      "Thread": "M18 × 1.5",
      "Cable length": "~1 m",
    },
  },
  {
    id: "flex-fuel-sensor",
    slug: "flex-fuel-sensor-gm",
    name: "Flex Fuel Sensor (GM/Continental)",
    shortName: "Flex Fuel Sensor",
    description: "GM/Continental frequency-based ethanol content sensor. 50–150 Hz output for E0–E100.",
    longDescription: "A GM/Continental flex fuel sensor that measures ethanol content via a frequency output (50 Hz = E0, 150 Hz = E100). Speeduino reads this frequency input and automatically adjusts fuel and ignition maps. Enables running any gasoline/ethanol blend from pump gas to E85+.",
    priceEUR: 165,
    priceSEK: 1899,
    category: "sensor",
    boardCompatibility: ["v0.3", "v0.4"],
    connectsTo: "Flex fuel input (configured in TunerStudio)",
    requirementLevel: "optional",
    showConditions: [{ flexFuel: ["yes"] }],
    skillLevel: "Intermediate",
    leadTimeDays: "5–10",
    included: ["GM/Continental flex fuel sensor"],
    notIncluded: ["Fuel line fittings (engine-specific)"],
    featured: false,
    inStock: true,
    images: [],
    specs: {
      "Type": "Frequency-based (GM/Continental)",
      "Output": "50–150 Hz (E0–E100)",
      "Fuel line": "3/8\" or 5/16\" (check fitment)",
      "Power": "12V",
    },
  },

  // ── ACCESSORIES ─────────────────────────────────────────────────────────
  {
    id: "boost-solenoid",
    slug: "boost-control-solenoid-mac",
    name: "Boost Control Solenoid (MAC 3-Port)",
    shortName: "Boost Solenoid",
    description: "MAC 3-port boost control solenoid. PWM-driven by the ECU for open or closed-loop boost.",
    longDescription: "A MAC valve 3-port boost control solenoid for electronic boost control. The ECU drives it via PWM to regulate boost pressure — supports both open-loop and closed-loop (PID) strategies in TunerStudio. The v0.4 board has a dedicated boost output pin.",
    priceEUR: 79,
    priceSEK: 909,
    category: "accessory",
    boardCompatibility: ["v0.3", "v0.4"],
    connectsTo: "Boost control output on the ECU → solenoid → wastegate",
    requirementLevel: "optional",
    showConditions: [{ boostControl: ["yes"] }],
    skillLevel: "Intermediate",
    leadTimeDays: "5–10",
    included: ["MAC 3-port boost solenoid"],
    notIncluded: ["Vacuum hose", "Fittings"],
    featured: false,
    inStock: true,
    images: [],
    specs: {
      "Type": "3-port / 2-way PWM solenoid",
      "Voltage": "12V",
      "Port size": "1/8\" NPT",
      "Control": "PWM from ECU boost output",
    },
  },
  {
    id: "relay-pack",
    slug: "relay-pack-4x-30a",
    name: "Relay Pack (4 × Bosch 30A 5-Pin + Fuse Box)",
    shortName: "Relay Pack",
    description: "4 × 30A relays + mini fuse box. For fuel pump, ignition, fan, and auxiliary outputs.",
    longDescription: "Speeduino's outputs are low-current logic signals — high-current loads like fuel pumps, radiator fans, and ignition power MUST be switched through relays. This pack includes 4 Bosch-style 30A relays and a compact mini-blade fuse box for a clean power distribution setup.",
    priceEUR: 25,
    priceSEK: 289,
    category: "accessory",
    boardCompatibility: ["v0.3", "v0.4"],
    connectsTo: "ECU relay outputs → relay coils → load power",
    requirementLevel: "recommended",
    skillLevel: "Beginner",
    leadTimeDays: "3–5",
    included: ["4 × Bosch-style 30A 5-pin relays", "Mini blade fuse box", "Relay socket base"],
    featured: false,
    inStock: true,
    images: [],
    specs: {
      "Relay rating": "30A @ 12V",
      "Relay type": "Bosch-style 5-pin (SPDT)",
      "Fuse box": "4-way mini blade",
      "Typical use": "Fuel pump, ignition, fan, auxiliary",
    },
  },
  {
    id: "idc40-plug",
    slug: "idc40-plug-pins-v04",
    name: "IDC40 Plug + Pins (v0.4)",
    shortName: "IDC40 Plug",
    description: "40-pin connector plug for the v0.4 board. Required to wire the board to your engine.",
    longDescription: "The v0.4 board routes all I/O through a single IDC40 header. This plug + pins set is the #1 'I can't install it' blocker for v0.4 builds. Without it, you cannot wire the board to your engine. Crimp pins are included.",
    priceEUR: 6,
    priceSEK: 69,
    category: "accessory",
    boardCompatibility: ["v0.4"],
    connectsTo: "IDC40 header on the v0.4 board",
    requirementLevel: "required",
    showConditions: [{ boardFamily: ["v0.4"] }],
    skillLevel: "Intermediate",
    leadTimeDays: "3–5",
    included: ["IDC40 plug housing", "40 × crimp pins"],
    featured: false,
    inStock: true,
    images: [],
    specs: {
      "Connector": "IDC40 (40-pin)",
      "Pins": "Crimp-style (included)",
      "Compatibility": "Speeduino v0.4.3, v0.4.4, v0.4.4c",
    },
  },
  {
    id: "lsu49-connector",
    slug: "lsu49-connector-6pin",
    name: "LSU 4.9 Wideband Connector (6-Pin)",
    shortName: "WB Connector",
    description: "Connector pigtail for the Bosch LSU 4.9 wideband sensor. Saves sourcing hassle.",
    longDescription: "A pre-wired 6-pin connector pigtail that mates with the Bosch LSU 4.9 wideband O2 sensor. Eliminates the friction of sourcing the correct connector separately. Short pigtail leads for splicing into your wideband controller wiring.",
    priceEUR: 8,
    priceSEK: 89,
    category: "accessory",
    boardCompatibility: ["v0.3", "v0.4"],
    connectsTo: "Bosch LSU 4.9 sensor → wideband controller",
    requirementLevel: "optional",
    showConditions: [{ o2: ["wideband"] }],
    skillLevel: "Beginner",
    leadTimeDays: "3–5",
    included: ["6-pin LSU 4.9 connector pigtail (~15 cm leads)"],
    featured: false,
    inStock: true,
    images: [],
    specs: {
      "Pins": "6",
      "Compatibility": "Bosch LSU 4.9",
      "Lead length": "~15 cm",
    },
  },
  {
    id: "coil-connector-pack",
    slug: "smart-coil-connector-pack",
    name: "Smart Coil Connector Pack (4-Pin, VW/Audi Style)",
    shortName: "Coil Connectors",
    description: "4 × connector pigtails for common smart coils (VW/Audi 4-pin). Optional add-on.",
    longDescription: "A pack of 4 pre-wired connector pigtails for the ubiquitous VW/Audi-style 4-pin smart ignition coils. These coils are the most commonly used aftermarket COP solution for Speeduino builds. Saves time vs sourcing connectors individually.",
    priceEUR: 6,
    priceSEK: 69,
    category: "accessory",
    boardCompatibility: ["v0.3", "v0.4"],
    connectsTo: "VW/Audi-style smart coils → ECU ignition outputs",
    requirementLevel: "optional",
    skillLevel: "Beginner",
    leadTimeDays: "3–5",
    included: ["4 × 4-pin coil connector pigtails (~15 cm leads)"],
    featured: false,
    inStock: true,
    images: [],
    specs: {
      "Quantity": "4 connectors",
      "Compatibility": "VW/Audi 4-pin smart coils",
      "Lead length": "~15 cm",
    },
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const getFeaturedProducts = () => products.filter((p) => p.featured);
export const getProductsByCategory = (cat: ProductCategory) => products.filter((p) => p.category === cat);

/** Returns true if the product should be visible given the current configurator inputs. */
export function isProductVisible(product: Product, inputs: Partial<ConfiguratorInputs>): boolean {
  if (!product.showConditions || product.showConditions.length === 0) return true;

  return product.showConditions.some((condition) => {
    const fields = Object.keys(condition);
    if (fields.length === 0) return true;
    return fields.every((field) => {
      const accepted = condition[field];
      const current = inputs[field as keyof ConfiguratorInputs];
      if (!current) return false;
      return accepted.includes(current);
    });
  });
}
