import {
  getOrderById,
  updateOrderShipped,
  updateOrderDelivered,
  type OrderRow,
} from "../../../lib/db";
import { getProductById } from "../../../lib/catalog";
import { jsonResponse, errorResponse } from "../../../lib/json";
import {
  sendOrderShippedToCustomer,
  sendOrderDeliveredToCustomer,
  type OrderForEmail,
  type LineItemForEmail,
} from "../../../lib/email";

function requireAdmin(request: Request, env: Env): Response | null {
  const token = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "").trim();
  const adminToken = env.ADMIN_TOKEN;
  if (!adminToken || token !== adminToken) return errorResponse("Unauthorized", 401);
  return null;
}

function toOrderForEmail(order: OrderRow): OrderForEmail {
  return {
    id: order.id,
    created_at: order.created_at,
    status: order.status,
    currency: order.currency,
    amount_total: order.amount_total,
    customer_email: order.customer_email,
    shipped_at: order.shipped_at,
    delivered_at: order.delivered_at,
    tracking_number: order.tracking_number,
    tracking_carrier: order.tracking_carrier,
  };
}

export async function onRequestPatch(
  context: { request: Request; env: Env; params: { orderId?: string } }
): Promise<Response> {
  const auth = requireAdmin(context.request, context.env);
  if (auth) return auth;
  const { DB } = context.env;
  if (!DB) return errorResponse("Database not configured", 500);

  const orderId = context.params?.orderId;
  if (!orderId?.trim()) return errorResponse("Missing order ID", 400);

  let body: { status: string; tracking_number?: string; tracking_carrier?: string };
  try {
    body = (await context.request.json()) as typeof body;
  } catch {
    return errorResponse("Invalid JSON", 400);
  }
  const status = body?.status?.toUpperCase();
  if (status !== "SHIPPED" && status !== "DELIVERED") {
    return errorResponse("Body must include status: SHIPPED or DELIVERED", 400);
  }

  const data = await getOrderById(DB, orderId.trim());
  if (!data) return errorResponse("Order not found", 404);
  const { order, items } = data;

  if (status === "SHIPPED") {
    const updated = await updateOrderShipped(
      DB,
      orderId,
      body.tracking_number?.trim() || null,
      body.tracking_carrier?.trim() || null
    );
    if (!updated) return errorResponse("Failed to update order", 500);
    const after = await getOrderById(DB, orderId);
    if (after) {
      const itemsForEmail: LineItemForEmail[] = after.items.map((i) => ({
        product_id: i.product_id,
        name: getProductById(i.product_id)?.name ?? i.product_id,
        qty: i.qty,
        unit_amount: i.unit_amount,
        line_amount: i.line_amount,
      }));
      try {
        await sendOrderShippedToCustomer(
          context.env,
          toOrderForEmail(after.order),
          itemsForEmail
        );
      } catch (e) {
        console.error("Shipped email failed", e);
      }
    }
    return jsonResponse({ ok: true, status: "SHIPPED" });
  }

  if (status === "DELIVERED") {
    const updated = await updateOrderDelivered(DB, orderId);
    if (!updated) return errorResponse("Failed to update order", 500);
    const after = await getOrderById(DB, orderId);
    if (after) {
      try {
        await sendOrderDeliveredToCustomer(context.env, toOrderForEmail(after.order));
      } catch (e) {
        console.error("Delivered email failed", e);
      }
    }
    return jsonResponse({ ok: true, status: "DELIVERED" });
  }

  return errorResponse("Invalid status", 400);
}
