import { getInventoryAll, setInventory } from "../../lib/db";
import { jsonResponse, errorResponse } from "../../lib/json";

function requireAdmin(request: Request, env: Env): Response | null {
  const token = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "").trim();
  const adminToken = env.ADMIN_TOKEN;
  if (!adminToken || token !== adminToken) return errorResponse("Unauthorized", 401);
  return null;
}

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const auth = requireAdmin(context.request, context.env);
  if (auth) return auth;
  const { DB } = context.env;
  if (!DB) return errorResponse("Database not configured", 500);
  const inventory = await getInventoryAll(DB);
  return jsonResponse({ inventory });
}

export async function onRequestPatch(context: { request: Request; env: Env }): Promise<Response> {
  const auth = requireAdmin(context.request, context.env);
  if (auth) return auth;
  const { request, env } = context;
  const { DB } = env;
  if (!DB) return errorResponse("Database not configured", 500);
  let body: { product_id?: string; qty?: number };
  try {
    body = (await request.json()) as { product_id?: string; qty?: number };
  } catch {
    return errorResponse("Invalid JSON", 400);
  }
  const productId = body.product_id;
  const qty = typeof body.qty === "number" ? Math.max(0, Math.floor(body.qty)) : undefined;
  if (typeof productId !== "string" || productId === "" || qty === undefined) {
    return errorResponse("product_id and qty required", 400);
  }
  await setInventory(DB, productId, qty);
  return jsonResponse({ ok: true, product_id: productId, qty });
}
