import { getInventoryAll } from "../lib/db";
import { jsonResponse, errorResponse } from "../lib/json";

/** GET /api/availability — returns product_id -> qty for all products (no auth). Used by shop/configurator to show stock. */
export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const { DB } = context.env;
  if (!DB) return errorResponse("Database not configured", 500);
  const rows = await getInventoryAll(DB);
  const availability: Record<string, number> = {};
  for (const r of rows) availability[r.product_id] = r.qty;
  return jsonResponse({ availability });
}
