import { getOrderBySessionId } from "../lib/db";
import { jsonResponse, errorResponse } from "../lib/json";
import { getProductById } from "../lib/catalog";

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const { DB } = env;
  if (!DB) return errorResponse("Database not configured", 500);

  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  if (!sessionId || !sessionId.trim()) return errorResponse("Missing session_id", 400);

  const data = await getOrderBySessionId(DB, sessionId.trim());
  if (!data) return errorResponse("Order not found", 404);

  const itemsWithNames = data.items.map((item) => {
    const product = getProductById(item.product_id);
    return {
      product_id: item.product_id,
      name: product?.name ?? item.product_id,
      qty: item.qty,
      unit_amount: item.unit_amount,
      line_amount: item.line_amount,
    };
  });

  return jsonResponse({
    order: data.order,
    items: itemsWithNames,
  });
}
