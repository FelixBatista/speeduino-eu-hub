import Stripe from "stripe";
import { createOrderAndDecrementInventory } from "../lib/db";
import { jsonResponse, errorResponse } from "../lib/json";

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const { DB, STRIPE_WEBHOOK_SECRET, STRIPE_SECRET_KEY } = env;
  if (!STRIPE_WEBHOOK_SECRET || !STRIPE_SECRET_KEY) return errorResponse("Server configuration error", 500);
  if (!DB) return errorResponse("Database not configured", 500);

  const signature = request.headers.get("stripe-signature");
  if (!signature) return errorResponse("Missing signature", 400);

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return errorResponse("Invalid body", 400);
  }

  let event: Stripe.Event;
  try {
    event = Stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return errorResponse("Invalid signature", 400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const cartStr = session.metadata?.cart;
    const currency = (session.metadata?.currency as string) || "EUR";
    if (!cartStr) return jsonResponse({ received: true });

    let cart: { productId: string; quantity: number }[];
    try {
      cart = JSON.parse(cartStr) as { productId: string; quantity: number }[];
    } catch {
      return jsonResponse({ received: true });
    }

    const orderId = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const stripeSessionId = session.id;
    const stripePaymentIntent = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;
    const customerEmail = session.customer_email ?? session.customer_details?.email ?? null;
    const amountTotal = session.amount_total ?? 0;

    const { getProductById, getUnitAmount } = await import("../lib/catalog");
    const items: { productId: string; qty: number; unitAmount: number; lineAmount: number }[] = [];
    for (const row of cart) {
      const product = getProductById(row.productId);
      if (!product) continue;
      const unitAmount = getUnitAmount(product, currency === "SEK" ? "SEK" : "EUR");
      const qty = Math.max(1, Math.min(20, Math.floor(row.quantity)));
      items.push({ productId: row.productId, qty, unitAmount, lineAmount: unitAmount * qty });
    }
    if (items.length === 0) return jsonResponse({ received: true });

    try {
      await createOrderAndDecrementInventory(DB, orderId, stripeSessionId, stripePaymentIntent, customerEmail, currency, amountTotal, items);
    } catch (e) {
      console.error("Webhook createOrder failed", e);
      return errorResponse("Order processing failed", 500);
    }
  }

  return jsonResponse({ received: true });
}
