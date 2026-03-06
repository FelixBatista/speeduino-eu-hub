/**
 * Server-side product helpers — reads from D1 database.
 * Used by checkout and webhook for price validation and Stripe line items.
 */
export interface ServerProduct {
  id: string;
  name: string;
  slug: string;
  unitAmountEUR: number; // cents
}

export async function getProductById(db: D1Database, id: string): Promise<ServerProduct | null> {
  const row = await db
    .prepare("SELECT id, name, slug, price_eur FROM products WHERE id = ? AND active = 1")
    .bind(id)
    .first<{ id: string; name: string; slug: string; price_eur: number }>();
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    unitAmountEUR: row.price_eur,
  };
}

/** Returns the product's `included` array for packing checklist purposes. Falls back to [] if not found or parse fails. */
export async function getProductIncluded(db: D1Database, id: string): Promise<string[]> {
  const row = await db
    .prepare("SELECT included FROM products WHERE id = ?")
    .bind(id)
    .first<{ included: string }>();
  if (!row?.included) return [];
  try {
    return JSON.parse(row.included) as string[];
  } catch {
    return [];
  }
}

export function getUnitAmount(product: ServerProduct, currency: "EUR" = "EUR"): number {
  return product.unitAmountEUR;
}
