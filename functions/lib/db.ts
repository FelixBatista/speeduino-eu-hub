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
  items: { productId: string; qty: number; unitAmount: number; lineAmount: number }[]
): Promise<void> {
  await db.batch([
    db.prepare(
      "INSERT INTO orders (id, status, currency, amount_total, stripe_session_id, stripe_payment_intent, customer_email) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind(orderId, "PAID", currency, amountTotal, stripeSessionId, stripePaymentIntent ?? null, customerEmail ?? null),
    ...items.flatMap((item) => [
      db.prepare("INSERT INTO order_items (order_id, product_id, qty, unit_amount, line_amount) VALUES (?, ?, ?, ?, ?)").bind(orderId, item.productId, item.qty, item.unitAmount, item.lineAmount),
      db.prepare("UPDATE inventory SET qty = qty - ?, updated_at = datetime('now') WHERE product_id = ?").bind(item.qty, item.productId),
    ]),
  ]);
}

export async function getOrderBySessionId(
  db: D1Database,
  stripeSessionId: string
): Promise<{ order: { id: string; created_at: string; status: string; currency: string; amount_total: number; customer_email: string | null }; items: { product_id: string; qty: number; unit_amount: number; line_amount: number }[] } | null> {
  const orderRow = await db.prepare("SELECT id, created_at, status, currency, amount_total, customer_email FROM orders WHERE stripe_session_id = ?").bind(stripeSessionId).first();
  if (!orderRow) return null;
  const order = orderRow as { id: string; created_at: string; status: string; currency: string; amount_total: number; customer_email: string | null };
  const { results: itemRows } = await db.prepare("SELECT product_id, qty, unit_amount, line_amount FROM order_items WHERE order_id = ? ORDER BY product_id").bind(order.id).all();
  const items = (itemRows ?? []) as { product_id: string; qty: number; unit_amount: number; line_amount: number }[];
  return { order, items };
}

export async function getRecentOrders(db: D1Database, limit: number): Promise<{ id: string; created_at: string; status: string; currency: string; amount_total: number; stripe_session_id: string; customer_email: string | null }[]> {
  const { results } = await db.prepare("SELECT id, created_at, status, currency, amount_total, stripe_session_id, customer_email FROM orders ORDER BY created_at DESC LIMIT ?").bind(limit).all();
  return (results ?? []) as { id: string; created_at: string; status: string; currency: string; amount_total: number; stripe_session_id: string; customer_email: string | null }[];
}
