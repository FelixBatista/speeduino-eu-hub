/** JSON response helper; no leaking of internal errors to client */
export function jsonResponse(data: unknown, status = 200, extraHeaders?: HeadersInit): Response {
  const headers = new Headers(extraHeaders);
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify(data), { status, headers });
}

export function errorResponse(message: string, status: number): Response {
  return jsonResponse({ error: message }, status);
}
