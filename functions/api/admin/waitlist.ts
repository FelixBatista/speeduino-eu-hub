import { jsonResponse, errorResponse } from "../../lib/json";
import { getWaitlistEntries } from "../../lib/db";

function requireAdmin(request: Request, env: Env): Response | null {
  const token = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "").trim();
  const adminToken = (env as Record<string, unknown>).ADMIN_TOKEN as string | undefined;
  if (!adminToken || token !== adminToken) return errorResponse("Unauthorized", 401);
  return null;
}

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const authErr = requireAdmin(request, env);
  if (authErr) return authErr;
  const { DB } = env;
  if (!DB) return errorResponse("Database not configured", 500);

  const entries = await getWaitlistEntries(DB);
  return jsonResponse({ waitlist: entries });
}
