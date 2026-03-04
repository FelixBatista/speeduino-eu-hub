import { SHIPPING_OPTIONS } from "../lib/shipping";
import { jsonResponse } from "../lib/json";

export async function onRequestGet(): Promise<Response> {
  return jsonResponse({
    options: SHIPPING_OPTIONS.map((o) => ({
      id: o.id,
      label: o.label,
      amountEUR: o.amountEUR,
      amountSEK: o.amountSEK,
    })),
  });
}
