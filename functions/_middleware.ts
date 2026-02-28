type PagesContext = { request: Request; env: Env; next: () => Promise<Response> };

function isAllowedOrigin(origin: string | null, appUrl: string | undefined): boolean {
  if (!origin) return false;
  if (appUrl && origin === appUrl) return true;
  try {
    const u = new URL(origin);
    if (u.hostname === "localhost" && (u.protocol === "http:" || u.protocol === "https:")) return true;
  } catch {
    return false;
  }
  return false;
}

function addCorsAndSecurity(response: Response, request: Request, appUrl: string | undefined): Response {
  const origin = request.headers.get("Origin");
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  if (isAllowedOrigin(origin, appUrl)) headers.set("Access-Control-Allow-Origin", origin!);
  headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export const onRequest = async (context: PagesContext) => {
  const { request, env } = context;
  const appUrl = env.APP_URL;

  if (request.method === "OPTIONS") {
    const headers = new Headers();
    headers.set("Access-Control-Max-Age", "86400");
    headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    const origin = request.headers.get("Origin");
    if (isAllowedOrigin(origin, appUrl)) headers.set("Access-Control-Allow-Origin", origin!);
    return new Response(null, { status: 204, headers });
  }

  const response = await context.next();
  return addCorsAndSecurity(response, request, appUrl);
};
