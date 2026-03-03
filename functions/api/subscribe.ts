import { subscribeEmail } from "../lib/db";
import { jsonResponse, errorResponse } from "../lib/json";

type SubscribeBody = { email?: string };

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const { DB } = env;
  if (!DB) return errorResponse("Server configuration error", 500);

  let body: SubscribeBody;
  try {
    body = (await request.json()) as SubscribeBody;
  } catch {
    return errorResponse("Invalid JSON", 400);
  }

  const email = typeof body?.email === "string" ? body.email : "";
  const result = await subscribeEmail(DB, email, "starter_guide");
  if (!result.ok) return errorResponse("Please enter a valid email address.", 400);
  return jsonResponse({ success: true });
}
