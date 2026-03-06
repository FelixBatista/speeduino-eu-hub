import { getShippingOptions } from "../lib/shipping";
import { jsonResponse, errorResponse } from "../lib/json";

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const { DB } = context.env;
  if (!DB) return errorResponse("Database not configured", 500);
  const options = await getShippingOptions(DB);
  return jsonResponse({
    options: options.map((o) => ({
      id: o.id,
      label: o.label,
      amountEUR: o.amountEUR,
    })),
  });
}
