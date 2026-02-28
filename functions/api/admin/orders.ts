import { getRecentOrders } from "../../lib/db";
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
  const orders = await getRecentOrders(DB, 50);
  return jsonResponse({ orders });
}
