// ---------------------------------------------------------------------------
// Product types and configurator definitions
// Product DATA now lives in the D1 database, managed via Admin panel.
// This file contains only TypeScript types, configurator step definitions,
// and the isProductVisible() helper used by the Find My Kit wizard.
// ---------------------------------------------------------------------------

export type ProductCategory = "board" | "sensor" | "module" | "accessory";

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
  category: ProductCategory;
  boardCompatibility: ("v0.3" | "v0.4")[];
  connectsTo: string;
  requirementLevel: "required" | "recommended" | "optional";
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
// Configurator input types (used by the Find My Kit wizard)
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
// Helpers
// ---------------------------------------------------------------------------

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
