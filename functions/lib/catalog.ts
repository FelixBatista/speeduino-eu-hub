/**
 * Server-truth catalog: minimal product data for price validation and Stripe line items.
 * Do not import frontend src/data/products.ts (Workers build); duplicate minimal fields.
 */
export interface ServerProduct {
  id: string;
  name: string;
  slug: string;
  unitAmountEUR: number; // cents
  unitAmountSEK: number; // öre
}

export const SERVER_CATALOG: ServerProduct[] = [
  // Boards
  { id: "v03-pcb", slug: "speeduino-v03-pcb", name: "Speeduino v0.3 PCB (DIY Kit)", unitAmountEUR: 2100, unitAmountSEK: 23900 },
  { id: "v04-pcb", slug: "speeduino-v04-pcb", name: "Speeduino v0.4 PCB (DIY Kit)", unitAmountEUR: 2500, unitAmountSEK: 28900 },
  { id: "arduino-mega", slug: "arduino-mega-2560", name: "Arduino Mega 2560 R3 (ATmega16U2)", unitAmountEUR: 2500, unitAmountSEK: 28900 },
  // Modules & Drivers
  { id: "vr-conditioner", slug: "vr-conditioner-max9926", name: "VR Conditioner Module (MAX9926)", unitAmountEUR: 3500, unitAmountSEK: 39900 },
  { id: "wideband-controller", slug: "wideband-controller-spartan", name: "Wideband Controller (14Point7 Spartan 3 Lite)", unitAmountEUR: 8900, unitAmountSEK: 102900 },
  { id: "ignition-driver", slug: "ignition-driver-4ch-211", name: "Ignition Driver Module (4-Channel, Bosch 211 Style)", unitAmountEUR: 4200, unitAmountSEK: 47900 },
  { id: "drv8825-stepper", slug: "drv8825-stepper-driver", name: "Stepper Driver Module (DRV8825)", unitAmountEUR: 700, unitAmountSEK: 7900 },
  { id: "ballast-resistor", slug: "ballast-resistor-pack", name: "Injector Ballast Resistor Pack (4 × 4.7 Ω)", unitAmountEUR: 4900, unitAmountSEK: 56900 },
  // Sensors
  { id: "map-sensor", slug: "map-sensor-mpx4250", name: "MAP Sensor (MPX4250, 2.5 Bar)", unitAmountEUR: 3500, unitAmountSEK: 39900 },
  { id: "iat-sensor", slug: "iat-sensor-gm", name: "Intake Air Temperature Sensor (GM Open Element)", unitAmountEUR: 1500, unitAmountSEK: 17500 },
  { id: "clt-sensor", slug: "clt-sensor-gm", name: "Coolant Temperature Sensor (GM Style)", unitAmountEUR: 1500, unitAmountSEK: 17500 },
  { id: "tps-sensor", slug: "tps-sensor-3wire", name: "TPS Sensor (3-Wire Potentiometer)", unitAmountEUR: 2500, unitAmountSEK: 28900 },
  { id: "wideband-o2", slug: "wideband-o2-lsu49", name: "Wideband O2 Sensor (Bosch LSU 4.9)", unitAmountEUR: 9900, unitAmountSEK: 113900 },
  { id: "flex-fuel-sensor", slug: "flex-fuel-sensor-gm", name: "Flex Fuel Sensor (GM/Continental)", unitAmountEUR: 16500, unitAmountSEK: 189900 },
  // Accessories
  { id: "boost-solenoid", slug: "boost-control-solenoid-mac", name: "Boost Control Solenoid (MAC 3-Port)", unitAmountEUR: 7900, unitAmountSEK: 90900 },
  { id: "relay-pack", slug: "relay-pack-4x-30a", name: "Relay Pack (4 × Bosch 30A 5-Pin + Fuse Box)", unitAmountEUR: 2500, unitAmountSEK: 28900 },
  { id: "idc40-plug", slug: "idc40-plug-pins-v04", name: "IDC40 Plug + Pins (v0.4)", unitAmountEUR: 600, unitAmountSEK: 6900 },
  { id: "lsu49-connector", slug: "lsu49-connector-6pin", name: "LSU 4.9 Wideband Connector (6-Pin)", unitAmountEUR: 800, unitAmountSEK: 8900 },
  { id: "coil-connector-pack", slug: "smart-coil-connector-pack", name: "Smart Coil Connector Pack (4-Pin, VW/Audi Style)", unitAmountEUR: 600, unitAmountSEK: 6900 },
];

export function getProductById(id: string): ServerProduct | undefined {
  return SERVER_CATALOG.find((p) => p.id === id);
}

export function getUnitAmount(product: ServerProduct, currency: "EUR" | "SEK"): number {
  return currency === "EUR" ? product.unitAmountEUR : product.unitAmountSEK;
}
