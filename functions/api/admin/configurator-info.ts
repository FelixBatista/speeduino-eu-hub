import { getConfig, setConfig } from "../../lib/db";
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

export async function onRequestPatch(context: { request: Request; env: Env }): Promise<Response> {
  const auth = requireAdmin(context.request, context.env);
  if (auth) return auth;
  const { request, env } = context;
  const { DB } = env;
  if (!DB) return errorResponse("Database not configured", 500);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON", 400);
  }
  if (typeof body !== "object" || body === null) {
    return errorResponse("Body must be a JSON object", 400);
  }
  await setConfig(DB, "configurator_info", JSON.stringify(body));
  return jsonResponse({ ok: true });
}
