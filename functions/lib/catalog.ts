/**
 * Server-side product helpers — reads from D1 database.
 * Used by checkout and webhook for price validation and Stripe line items.
 */
export interface ServerProduct {
  id: string;
  name: string;
  slug: string;
  unitAmountEUR: number; // cents
  unitAmountSEK: number; // öre
}

export async function getProductById(db: D1Database, id: string): Promise<ServerProduct | null> {
  const row = await db
    .prepare("SELECT id, name, slug, price_eur, price_sek FROM products WHERE id = ? AND active = 1")
    .bind(id)
    .first<{ id: string; name: string; slug: string; price_eur: number; price_sek: number }>();
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    unitAmountEUR: row.price_eur,
    unitAmountSEK: row.price_sek,
  };
}

export function getUnitAmount(product: ServerProduct, currency: "EUR" | "SEK"): number {
  return currency === "EUR" ? product.unitAmountEUR : product.unitAmountSEK;
}
