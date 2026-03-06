import { getConfig, setConfig } from "../../lib/db";
import { getShippingOptions, getShippingAllowedCountries } from "../../lib/shipping";
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
  const options = await getShippingOptions(DB);
  const allowedCountries = await getShippingAllowedCountries(DB);
  return jsonResponse({
    shipping_options: options.map((o) => ({ id: o.id, label: o.label, amountEUR: o.amountEUR })),
    shipping_allowed_countries: allowedCountries,
  });
}

type ShippingOptionInput = { id: string; label: string; amountEUR: number };

export async function onRequestPatch(context: { request: Request; env: Env }): Promise<Response> {
  const auth = requireAdmin(context.request, context.env);
  if (auth) return auth;
  const { request, env } = context;
  const { DB } = env;
  if (!DB) return errorResponse("Database not configured", 500);
  let body: { shipping_options?: unknown; shipping_allowed_countries?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return errorResponse("Invalid JSON", 400);
  }
  if (body.shipping_options !== undefined) {
    const opts = body.shipping_options;
    if (!Array.isArray(opts)) return errorResponse("shipping_options must be an array", 400);
    const valid: ShippingOptionInput[] = [];
    for (const o of opts) {
      if (!o || typeof o.id !== "string" || typeof o.label !== "string") continue;
      const amountEUR = typeof o.amountEUR === "number" ? Math.round(o.amountEUR) : 0;
      if (o.id.trim() === "") continue;
      valid.push({ id: o.id.trim(), label: String(o.label).trim(), amountEUR });
    }
    if (valid.length === 0) return errorResponse("At least one shipping option with id and label is required", 400);
    await setConfig(DB, "shipping_options", JSON.stringify(valid));
  }
  if (body.shipping_allowed_countries !== undefined) {
    const countries = body.shipping_allowed_countries;
    if (!Array.isArray(countries)) return errorResponse("shipping_allowed_countries must be an array", 400);
    const valid = countries.filter((c): c is string => typeof c === "string" && c.length === 2);
    await setConfig(DB, "shipping_allowed_countries", JSON.stringify(valid));
  }
  return jsonResponse({ ok: true });
}
