import { getConfig } from "../lib/db";
import { jsonResponse, errorResponse } from "../lib/json";

export async function onRequestGet(context: { env: Env }): Promise<Response> {
  const { DB } = context.env;
  if (!DB) return errorResponse("Database not configured", 500);
  const raw = await getConfig(DB, "configurator_info");
  let info: unknown = {};
  if (raw) {
    try {
      info = JSON.parse(raw);
    } catch {
      info = {};
    }
  }
  return jsonResponse({ info });
}
