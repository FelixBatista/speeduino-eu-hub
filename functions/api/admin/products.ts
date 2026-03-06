import { jsonResponse, errorResponse } from "../../lib/json";
import { setInventory } from "../../lib/db";

function requireAdmin(request: Request, env: Env): Response | null {
  const token = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "").trim();
  const adminToken = (env as Record<string, unknown>).ADMIN_TOKEN as string | undefined;
  if (!adminToken || token !== adminToken) return errorResponse("Unauthorized", 401);
  return null;
}

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
    specs: JSON.parse((row.specs as string) || "{}"),
    sortOrder: row.sort_order,
    active: row.active === 1,
  };
}

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const authErr = requireAdmin(request, env);
  if (authErr) return authErr;
  const { DB } = env;
  if (!DB) return errorResponse("Database not configured", 500);

  const { results } = await DB.prepare("SELECT * FROM products ORDER BY sort_order, name").all();
  return jsonResponse({ products: (results ?? []).map((r) => mapRow(r as ProductRow)) });
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const authErr = requireAdmin(request, env);
  if (authErr) return authErr;
  const { DB } = env;
  if (!DB) return errorResponse("Database not configured", 500);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return errorResponse("Invalid JSON", 400);
  }

  const id = body.id as string;
  const slug = body.slug as string;
  if (!id || !slug) return errorResponse("id and slug are required", 400);

  try {
    await DB.prepare(`INSERT INTO products (id, slug, name, short_name, description, long_description, price_eur, category, board_compatibility, connects_to, requirement_level, show_conditions, skill_level, lead_time_days, included, not_included, badge, featured, in_stock, specs, sort_order, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`)
      .bind(
        id,
        slug,
        (body.name as string) || "",
        (body.shortName as string) || "",
        (body.description as string) || "",
        (body.longDescription as string) || "",
        Math.round(((body.priceEUR as number) || 0) * 100),
        (body.category as string) || "accessory",
        JSON.stringify(body.boardCompatibility || []),
        (body.connectsTo as string) || "",
        (body.requirementLevel as string) || "optional",
        JSON.stringify(body.showConditions || []),
        (body.skillLevel as string) || "Beginner",
        (body.leadTimeDays as string) || "3-7",
        JSON.stringify(body.included || []),
        JSON.stringify(body.notIncluded || []),
        (body.badge as string) || null,
        body.featured ? 1 : 0,
        body.inStock !== false ? 1 : 0,
        JSON.stringify(body.specs || {}),
        (body.sortOrder as number) || 0
      )
      .run();

    await setInventory(DB, id, 0);
    return jsonResponse({ ok: true, id }, 201);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("UNIQUE")) return errorResponse("Product with that id or slug already exists", 409);
    return errorResponse("Failed to create product", 500);
  }
}

export async function onRequestPatch(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const authErr = requireAdmin(request, env);
  if (authErr) return authErr;
  const { DB } = env;
  if (!DB) return errorResponse("Database not configured", 500);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return errorResponse("Invalid JSON", 400);
  }

  const id = body.id as string;
  if (!id) return errorResponse("id is required", 400);

  const sets: string[] = [];
  const vals: unknown[] = [];

  const fieldMap: Record<string, { col: string; transform?: (v: unknown) => unknown }> = {
    slug: { col: "slug" },
    name: { col: "name" },
    shortName: { col: "short_name" },
    description: { col: "description" },
    longDescription: { col: "long_description" },
    priceEUR: { col: "price_eur", transform: (v) => Math.round((v as number) * 100) },
    category: { col: "category" },
    boardCompatibility: { col: "board_compatibility", transform: (v) => JSON.stringify(v) },
    connectsTo: { col: "connects_to" },
    requirementLevel: { col: "requirement_level" },
    showConditions: { col: "show_conditions", transform: (v) => JSON.stringify(v) },
    skillLevel: { col: "skill_level" },
    leadTimeDays: { col: "lead_time_days" },
    included: { col: "included", transform: (v) => JSON.stringify(v) },
    notIncluded: { col: "not_included", transform: (v) => JSON.stringify(v) },
    badge: { col: "badge" },
    featured: { col: "featured", transform: (v) => (v ? 1 : 0) },
    inStock: { col: "in_stock", transform: (v) => (v ? 1 : 0) },
    imageUrl: { col: "image_url" },
    specs: { col: "specs", transform: (v) => JSON.stringify(v) },
    sortOrder: { col: "sort_order" },
    active: { col: "active", transform: (v) => (v ? 1 : 0) },
  };

  for (const [key, { col, transform }] of Object.entries(fieldMap)) {
    if (key in body && key !== "id") {
      sets.push(`${col} = ?`);
      vals.push(transform ? transform(body[key]) : body[key]);
    }
  }

  if (sets.length === 0) return errorResponse("No fields to update", 400);
  sets.push("updated_at = datetime('now')");
  vals.push(id);

  await DB.prepare(`UPDATE products SET ${sets.join(", ")} WHERE id = ?`).bind(...vals).run();
  return jsonResponse({ ok: true });
}

export async function onRequestDelete(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const authErr = requireAdmin(request, env);
  if (authErr) return authErr;
  const { DB } = env;
  if (!DB) return errorResponse("Database not configured", 500);

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return errorResponse("id query parameter required", 400);

  await DB.prepare("UPDATE products SET active = 0, updated_at = datetime('now') WHERE id = ?").bind(id).run();
  return jsonResponse({ ok: true });
}
