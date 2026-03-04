/** Get config value by key. Returns null if not set. */
export async function getConfig(db: D1Database, key: string): Promise<string | null> {
  const row = await db.prepare("SELECT value FROM config WHERE key = ?").bind(key).first<{ value: string }>();
  return row?.value ?? null;
}

/** Set config value (insert or replace). */
export async function setConfig(db: D1Database, key: string, value: string): Promise<void> {
  await db.prepare("INSERT INTO config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind(key, value).run();
}

export async function getInventory(db: D1Database, productId: string): Promise<number> {
  const row = await db.prepare("SELECT qty FROM inventory WHERE product_id = ?").bind(productId).first<{ qty: number }>();
  return row?.qty ?? 0;
}

export async function getInventoryAll(db: D1Database): Promise<{ product_id: string; qty: number; updated_at: string }[]> {
  const { results } = await db.prepare("SELECT product_id, qty, updated_at FROM inventory ORDER BY product_id").all();
  return (results ?? []) as { product_id: string; qty: number; updated_at: string }[];
}

export async function decrementInventory(
  db: D1Database,
  productId: string,
  by: number
): Promise<{ success: boolean; newQty?: number }> {
  const r = await db.prepare("UPDATE inventory SET qty = qty - ?, updated_at = datetime('now') WHERE product_id = ? AND qty >= ? RETURNING qty").bind(by, productId, by).first<{ qty: number }>();
  return r ? { success: true, newQty: r.qty } : { success: false };
}

export async function setInventory(db: D1Database, productId: string, qty: number): Promise<void> {
  await db.prepare("INSERT INTO inventory (product_id, qty, updated_at) VALUES (?, ?, datetime('now')) ON CONFLICT(product_id) DO UPDATE SET qty = ?, updated_at = datetime('now')").bind(productId, qty, qty).run();
}

export async function createOrderAndDecrementInventory(
  db: D1Database,
  orderId: string,
  stripeSessionId: string,
  stripePaymentIntent: string | null,
  customerEmail: string | null,
  currency: string,
  amountTotal: number,
  items: { productId: string; qty: number; unitAmount: number; lineAmount: number }[],
  shippingJson: string | null = null
): Promise<void> {
  await db.batch([
    db.prepare(
      "INSERT INTO orders (id, status, currency, amount_total, stripe_session_id, stripe_payment_intent, customer_email, shipping_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(orderId, "PAID", currency, amountTotal, stripeSessionId, stripePaymentIntent ?? null, customerEmail ?? null, shippingJson ?? null),
    ...items.flatMap((item) => [
      db.prepare("INSERT INTO order_items (order_id, product_id, qty, unit_amount, line_amount) VALUES (?, ?, ?, ?, ?)").bind(orderId, item.productId, item.qty, item.unitAmount, item.lineAmount),
      db.prepare("UPDATE inventory SET qty = qty - ?, updated_at = datetime('now') WHERE product_id = ?").bind(item.qty, item.productId),
    ]),
  ]);
}

const orderSelectCols =
  "id, created_at, status, currency, amount_total, customer_email, shipping_json, shipped_at, delivered_at, tracking_number, tracking_carrier";

export type OrderRow = {
  id: string;
  created_at: string;
  status: string;
  currency: string;
  amount_total: number;
  customer_email: string | null;
  shipping_json: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  tracking_number: string | null;
  tracking_carrier: string | null;
};

export async function getOrderBySessionId(
  db: D1Database,
  stripeSessionId: string
): Promise<{ order: OrderRow; items: { product_id: string; qty: number; unit_amount: number; line_amount: number }[] } | null> {
  const orderRow = await db
    .prepare(`SELECT ${orderSelectCols} FROM orders WHERE stripe_session_id = ?`)
    .bind(stripeSessionId)
    .first();
  if (!orderRow) return null;
  const order = orderRow as OrderRow;
  const { results: itemRows } = await db.prepare("SELECT product_id, qty, unit_amount, line_amount FROM order_items WHERE order_id = ? ORDER BY product_id").bind(order.id).all();
  const items = (itemRows ?? []) as { product_id: string; qty: number; unit_amount: number; line_amount: number }[];
  return { order, items };
}

export async function getOrderById(
  db: D1Database,
  orderId: string
): Promise<{ order: OrderRow; items: { product_id: string; qty: number; unit_amount: number; line_amount: number }[] } | null> {
  const orderRow = await db.prepare(`SELECT ${orderSelectCols} FROM orders WHERE id = ?`).bind(orderId).first();
  if (!orderRow) return null;
  const order = orderRow as OrderRow;
  const { results: itemRows } = await db.prepare("SELECT product_id, qty, unit_amount, line_amount FROM order_items WHERE order_id = ? ORDER BY product_id").bind(order.id).all();
  const items = (itemRows ?? []) as { product_id: string; qty: number; unit_amount: number; line_amount: number }[];
  return { order, items };
}

export async function getRecentOrders(
  db: D1Database,
  limit: number
): Promise<(OrderRow & { stripe_session_id: string })[]> {
  const { results } = await db
    .prepare(`SELECT ${orderSelectCols}, stripe_session_id FROM orders ORDER BY created_at DESC LIMIT ?`)
    .bind(limit)
    .all();
  return (results ?? []) as (OrderRow & { stripe_session_id: string })[];
}

export async function updateOrderShipped(
  db: D1Database,
  orderId: string,
  trackingNumber?: string | null,
  trackingCarrier?: string | null
): Promise<boolean> {
  const r = await db
    .prepare(
      "UPDATE orders SET status = ?, shipped_at = datetime('now'), tracking_number = ?, tracking_carrier = ? WHERE id = ?"
    )
    .bind("SHIPPED", trackingNumber ?? null, trackingCarrier ?? null, orderId)
    .run();
  const meta = r as { meta?: { changes?: number; rows_written?: number } };
  return (meta.meta?.changes ?? meta.meta?.rows_written ?? 0) > 0;
}

export async function updateOrderDelivered(db: D1Database, orderId: string): Promise<boolean> {
  const r = await db
    .prepare("UPDATE orders SET status = ?, delivered_at = datetime('now') WHERE id = ?")
    .bind("DELIVERED", orderId)
    .run();
  const meta = r as { meta?: { changes?: number; rows_written?: number } };
  return (meta.meta?.changes ?? meta.meta?.rows_written ?? 0) > 0;
}

/** Subscribe an email for newsletter/starter guide. Idempotent: same email can re-submit (no error). */
export async function subscribeEmail(db: D1Database, email: string, source = "starter_guide"): Promise<{ ok: true } | { ok: false; error: "invalid" }> {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return { ok: false, error: "invalid" };
  try {
    await db.prepare("INSERT INTO subscribers (email, source) VALUES (?, ?)").bind(trimmed, source).run();
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("UNIQUE") || msg.includes("unique")) return { ok: true };
    throw e;
  }
}
