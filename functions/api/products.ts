import { jsonResponse, errorResponse } from "../lib/json";

type ProductRow = Record<string, unknown>;

function mapRow(row: ProductRow) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortName: row.short_name,
    description: row.description,
    longDescription: row.long_description,
    priceEUR: (row.price_eur as number) / 100,
    priceSEK: (row.price_sek as number) / 100,
    category: row.category,
    boardCompatibility: JSON.parse((row.board_compatibility as string) || "[]"),
    connectsTo: row.connects_to,
    requirementLevel: row.requirement_level,
    showConditions: JSON.parse((row.show_conditions as string) || "[]"),
    skillLevel: row.skill_level,
    leadTimeDays: row.lead_time_days,
    included: JSON.parse((row.included as string) || "[]"),
    notIncluded: JSON.parse((row.not_included as string) || "[]"),
    badge: row.badge || null,
    featured: row.featured === 1,
    inStock: row.in_stock === 1,
    imageUrl: row.image_url || null,
    images: [],
    specs: JSON.parse((row.specs as string) || "{}"),
  };
}

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const { DB } = env;
  if (!DB) return errorResponse("Database not configured", 500);

  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");

  if (slug) {
    const row = await DB.prepare(
      "SELECT * FROM products WHERE slug = ? AND active = 1"
    ).bind(slug).first();
    if (!row) return errorResponse("Product not found", 404);
    return jsonResponse({ product: mapRow(row as ProductRow) });
  }

  const { results } = await DB.prepare(
    "SELECT * FROM products WHERE active = 1 ORDER BY sort_order, name"
  ).all();
  return jsonResponse({ products: (results ?? []).map((r) => mapRow(r as ProductRow)) });
}
