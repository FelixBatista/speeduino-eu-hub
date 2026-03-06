import Stripe from "stripe";
import { getProductById, getUnitAmount } from "../lib/catalog";
import { getInventory } from "../lib/db";
import { getShippingOptions, getShippingById, getShippingAmount, getShippingAllowedCountries } from "../lib/shipping";
import { jsonResponse, errorResponse } from "../lib/json";

const MIN_QTY = 1;
const MAX_QTY = 20;

type CheckoutBody = {
  items: { productId: string; quantity: number }[];
  currency: "EUR" | "SEK";
  shippingOptionId: string;
};

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const { DB, APP_URL, STRIPE_SECRET_KEY } = env;
  if (!DB || !APP_URL || !STRIPE_SECRET_KEY) return errorResponse("Server configuration error", 500);

  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return errorResponse("Invalid JSON", 400);
  }

  const { items, currency, shippingOptionId } = body;
  if (!Array.isArray(items) || items.length === 0 || (currency !== "EUR" && currency !== "SEK")) {
    return errorResponse("Invalid input: items array and currency (EUR|SEK) required", 400);
  }
  const shippingOptions = await getShippingOptions(DB);
  const shippingOption = getShippingById(shippingOptions, shippingOptionId);
  if (!shippingOption) return errorResponse("Invalid shipping option", 400);

  const stripe = new Stripe(STRIPE_SECRET_KEY, { httpClient: Stripe.createFetchHttpClient() });

  const lineItems: { productId: string; quantity: number; product: Awaited<ReturnType<typeof getProductById>> }[] = [];
  for (const item of items) {
    if (typeof item.productId !== "string" || typeof item.quantity !== "number") {
      return errorResponse("Invalid item: productId and quantity required", 400);
    }
    const qty = Math.floor(item.quantity);
    if (qty < MIN_QTY || qty > MAX_QTY) return errorResponse(`Quantity must be between ${MIN_QTY} and ${MAX_QTY}`, 400);
    const product = await getProductById(DB, item.productId);
    if (!product) return errorResponse(`Unknown product: ${item.productId}`, 400);
    const available = await getInventory(DB, item.productId);
    if (available < qty) return errorResponse("Insufficient stock for one or more items", 409);
    lineItems.push({ productId: item.productId, quantity: qty, product });
  }

  const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    ...lineItems.map(({ product, quantity }) => ({
      price_data: {
        currency: currency.toLowerCase(),
        product_data: { name: product!.name },
        unit_amount: getUnitAmount(product!, currency),
      },
      quantity,
    })),
    {
      price_data: {
        currency: currency.toLowerCase(),
        product_data: { name: `Shipping: ${shippingOption.label}` },
        unit_amount: getShippingAmount(shippingOption, currency),
      },
      quantity: 1,
    },
  ];

  const allowedCountries = await getShippingAllowedCountries(DB);
  // Compact format "id:qty|id:qty" keeps the value well under Stripe's 500-char metadata limit.
  const cartMetadata = lineItems.map((i) => `${i.productId}:${i.quantity}`).join("|");
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: stripeLineItems,
      success_url: `${APP_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/checkout`,
      metadata: { cart: cartMetadata, currency, shipping_option_id: shippingOption.id, shipping_option_label: shippingOption.label },
      shipping_address_collection: { allowed_countries: allowedCountries.length > 0 ? allowedCountries : ["AT"] },
    });
    const url = session.url;
    if (!url) return errorResponse("Failed to create checkout session", 500);
    return jsonResponse({ url });
  } catch (e) {
    console.error("Stripe checkout.sessions.create failed:", e);
    return errorResponse("Payment service error", 500);
  }
}
