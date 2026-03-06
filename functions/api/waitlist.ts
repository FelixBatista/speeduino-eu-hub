import { jsonResponse, errorResponse } from "../lib/json";
import { addToWaitlist } from "../lib/db";
import { sendWaitlistAlertToSeller } from "../lib/email";

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const { DB } = env;
  if (!DB) return errorResponse("Database not configured", 500);

  let body: { productId?: string; productName?: string; email?: string };
  try {
    body = (await request.json()) as { productId?: string; productName?: string; email?: string };
  } catch {
    return errorResponse("Invalid JSON", 400);
  }

  const { productId, productName, email } = body;
  if (!productId || !email) return errorResponse("productId and email are required", 400);

  const result = await addToWaitlist(DB, productId, productName || productId, email);

  if (!result.ok) {
    if (result.error === "invalid") return errorResponse("Please enter a valid email address", 400);
  }

  if (!result.alreadyExists) {
    // Non-blocking: fire-and-forget seller notification
    sendWaitlistAlertToSeller(env, productId, productName || productId, email).catch((e) =>
      console.error("Waitlist email failed", e)
    );
  }

  return jsonResponse({ ok: true, alreadyExists: result.alreadyExists });
}
