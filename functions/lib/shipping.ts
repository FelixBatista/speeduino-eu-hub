/**
 * Shipping options: id, label, and price in cents (EUR) / öre (SEK).
 * Used for checkout line item and display.
 */
export interface ShippingOption {
  id: string;
  label: string;
  amountEUR: number; // cents
  amountSEK: number; // öre
}

export const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: "standard", label: "Standard delivery (5–7 days)", amountEUR: 500, amountSEK: 4900 },
  { id: "express", label: "Express delivery (2–3 days)", amountEUR: 1200, amountSEK: 12900 },
];

export function getShippingById(id: string): ShippingOption | undefined {
  return SHIPPING_OPTIONS.find((o) => o.id === id);
}

export function getShippingAmount(option: ShippingOption, currency: "EUR" | "SEK"): number {
  return currency === "EUR" ? option.amountEUR : option.amountSEK;
}
