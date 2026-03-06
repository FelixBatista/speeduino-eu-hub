import Stripe from "stripe";
import { createOrderAndDecrementInventory } from "../lib/db";
import { jsonResponse, errorResponse } from "../lib/json";
import { sendOrderConfirmationToCustomer, sendNewSaleAlertToSeller } from "../lib/email";

// Cloudflare Workers/Pages use Web Crypto (async). Sync constructEvent can fail verification;
// use constructEventAsync + createSubtleCryptoProvider so signature verification works on the edge.
const webCrypto = Stripe.createSubtleCryptoProvider();

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
    event = await Stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      STRIPE_WEBHOOK_SECRET,
      undefined,
      webCrypto
    );
  } catch (err) {
    return errorResponse("Invalid signature", 400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const cartStr = session.metadata?.cart;
    const currency = (session.metadata?.currency as string) || "EUR";
    if (!cartStr) return jsonResponse({ received: true });

    let cart: { productId: string; quantity: number }[];
    if (cartStr.startsWith("[")) {
      // Legacy JSON format
      try {
        cart = JSON.parse(cartStr) as { productId: string; quantity: number }[];
      } catch {
        return jsonResponse({ received: true });
      }
    } else {
      // Compact format: "id:qty|id:qty"
      cart = cartStr
        .split("|")
        .map((entry) => {
          const colon = entry.lastIndexOf(":");
          return { productId: entry.slice(0, colon), quantity: parseInt(entry.slice(colon + 1), 10) || 1 };
        })
        .filter((e) => e.productId);
    }

    const orderId = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const stripeSessionId = session.id;
    const stripePaymentIntent = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;
    const customerEmail = session.customer_email ?? session.customer_details?.email ?? null;
    const amountTotal = session.amount_total ?? 0;

    const details = session.customer_details;
    const address = details?.address;
    const shippingOptionId = (session.metadata?.shipping_option_id as string) || null;
    const shippingOptionLabel = (session.metadata?.shipping_option_label as string) || null;
    const shippingJson =
      details || address || shippingOptionId
        ? JSON.stringify({
            name: details?.name ?? null,
            email: customerEmail,
            address: address
              ? {
                  line1: address.line1 ?? null,
                  line2: address.line2 ?? null,
                  city: address.city ?? null,
                  state: address.state ?? null,
                  postal_code: address.postal_code ?? null,
                  country: address.country ?? null,
                }
              : null,
            shipping_option_id: shippingOptionId,
            shipping_option_label: shippingOptionLabel,
          })
        : null;

    const { getProductById, getUnitAmount, getProductIncluded } = await import("../lib/catalog");
    const items: { productId: string; qty: number; unitAmount: number; lineAmount: number }[] = [];
    for (const row of cart) {
      const product = await getProductById(DB, row.productId);
      if (!product) continue;
      const unitAmount = getUnitAmount(product, "EUR");
      const qty = Math.max(1, Math.min(20, Math.floor(row.quantity)));
      items.push({ productId: row.productId, qty, unitAmount, lineAmount: unitAmount * qty });
    }
    if (items.length === 0) return jsonResponse({ received: true });

    try {
      await createOrderAndDecrementInventory(DB, orderId, stripeSessionId, stripePaymentIntent, customerEmail, currency, amountTotal, items, shippingJson);
    } catch (e) {
      console.error("Webhook createOrder failed", e);
      return errorResponse("Order processing failed", 500);
    }

    // Emails: confirmation to customer, new-sale alert to seller (non-blocking best-effort)
    const orderForEmail = {
      id: orderId,
      created_at: new Date().toISOString(),
      status: "PAID",
      currency,
      amount_total: amountTotal,
      customer_email: customerEmail,
      shipping_json: shippingJson,
    };
    const itemsForEmail = await Promise.all(items.map(async (item) => {
      const product = await getProductById(DB, item.productId);
      const included = await getProductIncluded(DB, item.productId);
      return {
        product_id: item.productId,
        name: product?.name ?? item.productId,
        qty: item.qty,
        unit_amount: item.unitAmount,
        line_amount: item.lineAmount,
        included,
      };
    }));
    try {
      await Promise.all([
        sendOrderConfirmationToCustomer(env, orderForEmail, itemsForEmail),
        sendNewSaleAlertToSeller(env, orderForEmail, itemsForEmail),
      ]);
    } catch (e) {
      console.error("Order emails failed", e);
    }
  }

  return jsonResponse({ received: true });
}
