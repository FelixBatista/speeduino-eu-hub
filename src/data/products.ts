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
  priceSEK: number;
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
  docUrl?: string;
  options: { value: string; label: string; hint?: string; info: string }[];
}[] = [
  {
    field: "boardFamily",
    label: "Board Version",
    description: "Which Speeduino board will you build?",
    docUrl: "https://wiki.speeduino.com/en/boards",
    options: [
      {
        value: "v0.3",
        label: "v0.3",
        hint: "Screw terminals, prototype-friendly",
        info: "The v0.3 board connects every wire via individual screw terminals, making it very easy to wire up, modify, and troubleshoot. It's ideal if you're building your first Speeduino, experimenting with different setups, or just want a straightforward no-fuss board. No special connectors or crimping tools needed.",
      },
      {
        value: "v0.4",
        label: "v0.4",
        hint: "IDC40 connector, enclosure-friendly, stepper mount",
        info: "The v0.4 board uses an IDC40 ribbon connector for the main harness, making it much tidier inside an enclosure and closer to how a factory ECU is built. It also has a dedicated footprint for a DRV8825 stepper motor driver, which you'll need if you plan to use a stepper-type idle valve. Choose this if you want a cleaner install or plan to fit the board into a case.",
      },
    ],
  },
  {
    field: "crankSignal",
    label: "Crank Signal Type",
    description: "What type of crank position sensor does your engine use?",
    docUrl: "https://wiki.speeduino.com/en/configuration/Trigger_Patterns",
    options: [
      {
        value: "hall_5v",
        label: "Hall / 5V digital",
        info: "A Hall effect sensor outputs a clean square-wave signal (0V or 5V) and typically has 3 wires: ground, power, and signal. Most modern engines from the mid-1990s onward use Hall sensors, as do many aftermarket trigger wheels. If your crank sensor has 3 wires, it's almost certainly Hall effect. No extra hardware is needed — Speeduino can read it directly.",
      },
      {
        value: "vr",
        label: "VR (variable reluctance)",
        hint: "Needs VR conditioner module",
        info: "A Variable Reluctance (VR) sensor generates a small AC sine-wave signal from a toothed wheel. These sensors only have 2 wires (no power supply). Many older engines — including Ford EDIS, GM TBI/TPI, and most 1980s–early 1990s vehicles — use VR sensors. Because Speeduino's input circuitry expects a digital signal, you'll need a VR conditioner module to convert the AC wave into a clean digital pulse.",
      },
    ],
  },
  {
    field: "camSignal",
    label: "Cam Signal",
    description: "Do you have a cam position sensor? (needed for sequential injection)",
    docUrl: "https://wiki.speeduino.com/en/configuration/Trigger_Patterns",
    options: [
      {
        value: "none",
        label: "No cam sensor",
        info: "Without a cam signal, Speeduino can still control your engine in wasted-spark (2 cylinders share one coil) and batch-fire injection mode. This works well for most naturally-aspirated and basic turbo builds. You only need a cam sensor if you specifically want full sequential injection or sequential ignition, which can improve idle quality and response at the cost of more complexity.",
      },
      {
        value: "hall_5v",
        label: "Hall / 5V digital",
        info: "A Hall effect cam sensor provides a once-per-revolution reference signal that lets Speeduino know which cylinder is on its compression stroke. This enables true sequential fuel injection and ignition. It has 3 wires (ground, 5V power, signal) and is found on most modern engines. No extra hardware is required beyond wiring it to the correct Speeduino input pin.",
      },
      {
        value: "vr",
        label: "VR (variable reluctance)",
        hint: "Needs VR conditioner module",
        info: "A VR cam sensor works the same way as a VR crank sensor — it produces an AC sine wave from a lobe or tooth on the cam. Like the VR crank sensor, it only has 2 wires and requires a VR conditioner module to convert its signal before Speeduino can read it. This is less common on cam sensors than on crank sensors, but some older engines do use it.",
      },
    ],
  },
  {
    field: "o2",
    label: "O2 Sensor",
    description: "What lambda/O2 feedback will you use?",
    docUrl: "https://wiki.speeduino.com/en/configuration/Lambda",
    options: [
      {
        value: "none",
        label: "None",
        info: "Without an O2 sensor, Speeduino runs in open-loop mode — it delivers fuel based purely on your tune without any feedback from the exhaust. This is fine for carburettor-replacement builds, race engines, or situations where you're confident in your tune. However, without exhaust feedback your fuelling won't automatically correct for changes in temperature, fuel quality, or engine wear.",
      },
      {
        value: "narrowband",
        label: "Narrowband (OEM)",
        hint: "Basic, on/off reading",
        info: "A narrowband O2 sensor (the kind found on almost every OEM vehicle) produces a simple signal: roughly 0.1V when the mixture is lean and 0.9V when rich. Speeduino can use this for basic closed-loop correction to keep the engine around stoichiometric (14.7:1 AFR). It's fine for everyday driving but not precise enough for performance tuning, as it only tells you 'rich or lean', not by how much.",
      },
      {
        value: "wideband",
        label: "Wideband",
        hint: "Strongly recommended for tuning",
        info: "A wideband lambda sensor measures the exact air/fuel ratio across a wide range (typically 10:1 to 20:1 AFR). When paired with a wideband controller (e.g. AEM, Innovate, 14Point7), it sends a linear 0–5V signal to Speeduino that reflects the precise AFR. This is strongly recommended for anyone tuning their engine, as it lets you see exactly how rich or lean you are at every point in the map and correct accordingly.",
      },
    ],
  },
  {
    field: "idleControl",
    label: "Idle Control",
    description: "How will you control idle speed?",
    docUrl: "https://wiki.speeduino.com/en/configuration/Idle",
    options: [
      {
        value: "none",
        label: "None / manual",
        info: "With no electronic idle control, you set the idle speed manually using a throttle stop screw or by slightly cracking the throttle plate. Speeduino will not automatically adjust idle when the engine is cold or when electrical loads change. This is the simplest setup and works well on engines that had no idle valve originally, or where you're happy to set the idle manually.",
      },
      {
        value: "pwm_2wire",
        label: "PWM 2-wire valve",
        info: "A 2-wire PWM idle valve (also called an IAC solenoid) is opened and closed by varying the duty cycle of a 12V signal on a single wire. Speeduino controls the valve by rapidly switching power on and off. Many older Bosch-type and some domestic V8 engines use this style of valve. It offers good idle control without the complexity of a stepper motor.",
      },
      {
        value: "pwm_3wire",
        label: "PWM 3-wire valve",
        info: "A 3-wire PWM idle valve has a dedicated ground, switched 12V power, and a PWM control signal. It's common on many Japanese and European engines from the 1990s–2000s. The extra wire gives more reliable control compared to a 2-wire valve. Check your factory wiring diagram to confirm your idle valve type — if it has 3 wires going directly to the idle valve, this is likely your option.",
      },
      {
        value: "stepper_4wire",
        label: "Stepper motor (4-wire)",
        hint: "v0.4 has DRV8825 mount",
        info: "Stepper motor idle valves use 4 wires and move in precise steps, giving very accurate control of the air bypass. They're common on many Ford, GM, and Chrysler engines. Speeduino requires an external DRV8825 stepper driver module to control them. If you chose the v0.4 board, there's a dedicated footprint for this driver. If you're on v0.3, you'll need to wire the module externally.",
      },
    ],
  },
  {
    field: "boostControl",
    label: "Boost Control",
    description: "Do you need electronic boost control?",
    docUrl: "https://wiki.speeduino.com/en/configuration/Boost_Control",
    options: [
      {
        value: "no",
        label: "No",
        info: "If your engine is naturally aspirated (no turbo or supercharger), or if you manage boost pressure using a manual boost controller (a simple spring-loaded valve), you don't need electronic boost control. This keeps your build simpler — no additional solenoid wiring or tuning of a boost control table is needed.",
      },
      {
        value: "yes",
        label: "Yes",
        hint: "Requires boost control solenoid",
        info: "Electronic boost control lets Speeduino actively adjust your turbo's wastegate position by pulsing a solenoid valve. This gives you precise, map-controlled boost levels — for example, lower boost at low RPM for reliability and higher boost at high RPM for power. You'll need a 3-port boost control solenoid (commonly a MAC or Turbosmart unit) wired to one of Speeduino's auxiliary outputs.",
      },
    ],
  },
  {
    field: "flexFuel",
    label: "Flex Fuel",
    description: "Will you run a flex fuel sensor for ethanol content?",
    docUrl: "https://wiki.speeduino.com/en/configuration/Flex_Fuel",
    options: [
      {
        value: "no",
        label: "No",
        info: "If you run a fixed fuel (standard petrol/gasoline or a fixed ethanol blend), you don't need a flex fuel sensor. Your tune is written for one fuel type and Speeduino doesn't need to adapt on the fly. This is the case for the vast majority of builds.",
      },
      {
        value: "yes",
        label: "Yes",
        hint: "GM/Continental frequency sensor",
        info: "A flex fuel sensor measures the ethanol content of your fuel in real time (0% for pure petrol, up to 85% for E85) by measuring how quickly the fuel conducts electricity. Speeduino uses this reading to automatically adjust fuelling and ignition timing as ethanol content changes — useful if you want to run at a pump that may vary between E5 and E85. The standard sensor is the GM/Continental unit used on flex-fuel vehicles.",
      },
    ],
  },
  {
    field: "injectors",
    label: "Injector Type",
    description: "What impedance are your fuel injectors?",
    docUrl: "https://wiki.speeduino.com/en/hardware/injectors",
    options: [
      {
        value: "highZ",
        label: "High impedance (>8 Ω)",
        hint: "Most modern injectors",
        info: "High-impedance injectors (above 8 ohms) are the standard on most vehicles made from the mid-1990s onward. Their higher resistance naturally limits current draw, so Speeduino's built-in injector drivers can control them directly without any additional hardware. If you bought modern aftermarket injectors (Bosch EV14, Siemens Deka, etc.) they are almost certainly high impedance.",
      },
      {
        value: "lowZ",
        label: "Low impedance (<5 Ω)",
        hint: "Needs ballast resistor pack",
        info: "Low-impedance injectors (under 5 ohms) are typically found on older vehicles from the 1980s and early 1990s. Their low resistance allows them to open very quickly, but it also means they draw far more current than Speeduino's drivers can handle safely. You'll need a ballast resistor pack wired in series with each injector to limit the current. Not sure about your injectors? Look up the part number online or measure resistance across the two pins with a multimeter.",
      },
    ],
  },
  {
    field: "ignitionHardware",
    label: "Ignition Hardware",
    description: "What type of ignition coils will you use?",
    docUrl: "https://wiki.speeduino.com/en/configuration/Ignition_hardware",
    options: [
      {
        value: "smart_coils",
        label: "Smart coils (built-in driver)",
        hint: "VW/Audi, most modern COP",
        info: "Smart coils have their own built-in ignition driver (igniter) and accept a low-current 5V trigger signal directly from Speeduino. Most modern coil-on-plug (COP) coils are smart coils — including VW/Audi coils, Toyota D4 coils, and many others used on engines from the late 1990s onward. If you're sourcing coils specifically for a Speeduino build, choosing smart coils is the easiest and most reliable option.",
      },
      {
        value: "dumb_coils_need_driver",
        label: "Dumb coils (need external driver)",
        hint: "Older coil packs, requires ignition driver module",
        info: "Dumb coils (also called passive coils) have no built-in igniter — they rely on an external ignition module to switch the high current needed to charge the coil. Older coil packs, distributor coils, and many early 1990s coil-per-cylinder setups are dumb coils. To use them with Speeduino, you'll need a separate ignition driver module (such as the common IGBT-based modules). The configurator will include the appropriate driver in your kit.",
      },
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
