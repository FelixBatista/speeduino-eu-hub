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
  { id: "diy-kit", slug: "speeduino-diy-kit", name: "Speeduino DIY Kit (Unsoldered PCB + Components)", unitAmountEUR: 8900, unitAmountSEK: 99900 },
  { id: "assembled-ecu", slug: "speeduino-assembled-ecu", name: "Speeduino Assembled & Tested ECU", unitAmountEUR: 22900, unitAmountSEK: 249900 },
  { id: "harness-kit", slug: "speeduino-wiring-harness-kit", name: "Universal Wiring Harness + Sensor Starter Pack", unitAmountEUR: 14900, unitAmountSEK: 159900 },
  { id: "sensor-pack", slug: "speeduino-sensor-pack", name: "Sensor Upgrade Pack", unitAmountEUR: 19900, unitAmountSEK: 219900 },
  { id: "volvo-p2-bundle", slug: "speeduino-volvo-p2-bundle", name: "Volvo P2 5-Cylinder Turbo Starter Bundle", unitAmountEUR: 39900, unitAmountSEK: 429900 },
];

export function getProductById(id: string): ServerProduct | undefined {
  return SERVER_CATALOG.find((p) => p.id === id);
}

export function getUnitAmount(product: ServerProduct, currency: "EUR" | "SEK"): number {
  return currency === "EUR" ? product.unitAmountEUR : product.unitAmountSEK;
}
