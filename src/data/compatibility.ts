// All compatibility data is editable from this single file.
// Change values here to update the wizard, specs page, and product recommendations.

export interface CompatibilityOption {
  id: string;
  label: string;
  description?: string;
  supported: boolean;
  notes?: string;
}

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  options: CompatibilityOption[];
  multiSelect?: boolean;
}

export const wizardSteps: WizardStep[] = [
  {
    id: "cylinders",
    title: "Engine Cylinders",
    description: "How many cylinders does your engine have?",
    options: [
      { id: "4cyl", label: "4 Cylinders", supported: true },
      { id: "5cyl", label: "5 Cylinders", supported: true, notes: "Popular for Volvo applications" },
      { id: "6cyl", label: "6 Cylinders", supported: true },
      { id: "8cyl", label: "8 Cylinders", supported: true, notes: "Requires v0.4.4c or later board" },
    ],
  },
  {
    id: "fuel",
    title: "Fuel Type",
    description: "What fuel will you run?",
    options: [
      { id: "petrol", label: "Petrol (Gasoline)", supported: true },
      { id: "e85", label: "E85 / Flex Fuel", supported: true, notes: "Flex fuel sensor input supported" },
    ],
  },
  {
    id: "induction",
    title: "Induction",
    description: "Naturally aspirated or forced induction?",
    options: [
      { id: "na", label: "Naturally Aspirated", supported: true },
      { id: "turbo", label: "Turbo", supported: true, notes: "Boost control solenoid output included" },
      { id: "supercharged", label: "Supercharged", supported: true, notes: "MAP sensor range may need adjustment" },
    ],
  },
  {
    id: "injection",
    title: "Injection Mode",
    description: "What injection mode do you want?",
    options: [
      { id: "batch", label: "Batch Fire", supported: true, description: "Simplest wiring, good for most builds" },
      { id: "semi-seq", label: "Semi-Sequential", supported: true, description: "Paired injection, good balance" },
      { id: "sequential", label: "Full Sequential", supported: true, description: "Best atomization, requires cam sync", notes: "Requires cam position sensor" },
    ],
  },
  {
    id: "ignition",
    title: "Ignition Type",
    description: "What ignition system will you use?",
    options: [
      { id: "wasted-spark", label: "Wasted Spark", supported: true, description: "Simple, reliable, no cam sensor needed" },
      { id: "cop", label: "Coil-on-Plug (COP)", supported: true, description: "One coil per cylinder, best spark energy" },
      { id: "distributor", label: "Distributor", supported: true, description: "Single ignition output" },
    ],
  },
  {
    id: "extras",
    title: "Additional Features",
    description: "Select any additional features you need",
    multiSelect: true,
    options: [
      { id: "idle-control", label: "Idle Air Control", supported: true, description: "PWM or stepper IAC valve" },
      { id: "boost-control", label: "Boost Control", supported: true, description: "Closed-loop boost control via solenoid" },
      { id: "wideband", label: "Wideband O2", supported: true, description: "Highly recommended for tuning" },
      { id: "knock", label: "Knock Detection", supported: true, description: "Requires knock sensor + filtering", notes: "Hardware knock input on v0.4.4c+" },
    ],
  },
  {
    id: "transmission",
    title: "Transmission",
    description: "What type of transmission?",
    options: [
      { id: "manual", label: "Manual", supported: true, description: "No special ECU requirements" },
      { id: "automatic", label: "Automatic", supported: false, description: "ECU does not control transmission", notes: "Speeduino controls engine only. Automatic transmissions typically retain their own TCU (transmission control unit). Some vehicles may need additional work to ensure compatibility." },
    ],
  },
  {
    id: "goals",
    title: "Your Goals",
    description: "What's your primary goal?",
    options: [
      { id: "reliable", label: "Just Run Reliably", supported: true, description: "Daily driver, smooth idle, easy starting" },
      { id: "street-performance", label: "Performance Street", supported: true, description: "More power, E85, boost" },
      { id: "track-rally", label: "Track / Rally", supported: true, description: "Maximum performance, data logging, launch control" },
    ],
  },
];

// Supported configurations summary (for specs page & homepage)
export const supportedConfigs = {
  cylinders: { range: "1–8", common: ["4", "5", "6", "8"], notes: "Most common: 4-cylinder" },
  injectors: { maxOutputs: 8, modes: ["Batch fire", "Semi-sequential", "Full sequential"], notes: "Sequential requires cam position sensor" },
  ignition: { maxOutputs: 8, modes: ["Wasted spark", "Coil-on-plug", "Single coil + distributor"], notes: "COP recommended for best performance" },
  sensors: {
    required: ["Crank position (VR or Hall)", "MAP or TPS", "Coolant temperature (CLT)", "Intake air temperature (IAT)"],
    recommended: ["Wideband O2", "Cam position (for sequential)"],
    optional: ["Knock sensor", "Flex fuel sensor", "Barometric pressure", "EGT (via external)"],
  },
  control: {
    boost: { supported: true, type: "Open-loop or closed-loop via PWM solenoid" },
    idle: { supported: true, type: "PWM 2-wire or stepper motor (firmware dependent)" },
    fan: { supported: true, type: "Relay output, temperature-triggered" },
    fuelPump: { supported: true, type: "Relay output with prime pulse" },
    launchControl: { supported: true, type: "RPM-limited, configurable via TunerStudio" },
  },
  expansion: {
    description: "Additional I/O available via GPIO expanders or secondary boards",
    options: ["CAN bus (with shield)", "Bluetooth (HC-05)", "SD card logging"],
  },
  transmission: {
    manual: { supported: true, notes: "No special requirements from ECU side" },
    automatic: { supported: false, notes: "Speeduino controls the engine only — it does not control automatic transmissions. Some vehicles can retain the factory transmission control unit (TCU), but compatibility depends heavily on the transmission and vehicle electronics. Older or simpler automatics may continue to work with the original TCU if it still receives the signals it needs. Many newer electronically controlled automatics require additional integration, such as throttle/RPM/load signals, torque reduction, or CAN communication with the engine ECU. Manual transmission vehicles generally have no special transmission-control requirements." },
  },
};
