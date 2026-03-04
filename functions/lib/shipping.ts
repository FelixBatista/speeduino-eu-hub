/**
 * Shipping: types and config from DB (with fallback defaults).
 */
import { getConfig } from "./db";

export interface ShippingOption {
  id: string;
  label: string;
  amountEUR: number; // cents
  amountSEK: number; // öre
}

const DEFAULT_OPTIONS: ShippingOption[] = [
  { id: "standard", label: "Standard delivery (5–7 days)", amountEUR: 500, amountSEK: 4900 },
  { id: "express", label: "Express delivery (2–3 days)", amountEUR: 1200, amountSEK: 12900 },
];

const DEFAULT_ALLOWED_COUNTRIES = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT",
  "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "GB", "NO", "CH", "IS", "LI",
];

export async function getShippingOptions(db: D1Database): Promise<ShippingOption[]> {
  let raw: string | null = null;
  try {
    raw = await getConfig(db, "shipping_options");
  } catch {
    return DEFAULT_OPTIONS;
  }
  if (!raw?.trim()) return DEFAULT_OPTIONS;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return DEFAULT_OPTIONS;
    return parsed.filter(
      (o): o is ShippingOption =>
        o && typeof o.id === "string" && typeof o.label === "string" &&
        typeof o.amountEUR === "number" && typeof o.amountSEK === "number"
    );
  } catch {
    return DEFAULT_OPTIONS;
  }
}

export async function getShippingAllowedCountries(db: D1Database): Promise<string[]> {
  let raw: string | null = null;
  try {
    raw = await getConfig(db, "shipping_allowed_countries");
  } catch {
    return DEFAULT_ALLOWED_COUNTRIES;
  }
  if (!raw?.trim()) return DEFAULT_ALLOWED_COUNTRIES;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return DEFAULT_ALLOWED_COUNTRIES;
    return parsed.filter((c): c is string => typeof c === "string" && c.length === 2);
  } catch {
    return DEFAULT_ALLOWED_COUNTRIES;
  }
}

export function getShippingById(options: ShippingOption[], id: string): ShippingOption | undefined {
  return options.find((o) => o.id === id);
}

export function getShippingAmount(option: ShippingOption, currency: "EUR" | "SEK"): number {
  return currency === "EUR" ? option.amountEUR : option.amountSEK;
}
