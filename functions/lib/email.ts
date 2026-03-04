/**
 * Order notifications via Resend (https://resend.com).
 * Requires env: RESEND_API_KEY, MAIL_FROM, SELLER_EMAIL, APP_URL.
 */

const RESEND_API = "https://api.resend.com/emails";

export type OrderForEmail = {
  id: string;
  created_at: string;
  status: string;
  currency: string;
  amount_total: number;
  customer_email: string | null;
  shipped_at?: string | null;
  delivered_at?: string | null;
  tracking_number?: string | null;
  tracking_carrier?: string | null;
};

export type LineItemForEmail = { product_id: string; name: string; qty: number; unit_amount: number; line_amount: number };

function formatMoney(amount: number, currency: string): string {
  if (currency === "SEK") return `${(amount / 100).toLocaleString("sv-SE")} SEK`;
  return `€${(amount / 100).toLocaleString("de-DE", { minimumFractionDigits: 2 })}`;
}

async function sendEmail(
  apiKey: string,
  from: string,
  to: string,
  subject: string,
  html: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });
  if (!res.ok) {
    const body = await res.text();
    return { ok: false, error: `${res.status}: ${body}` };
  }
  return { ok: true };
}

export async function sendOrderConfirmationToCustomer(
  env: { RESEND_API_KEY?: string; MAIL_FROM?: string; APP_URL?: string },
  order: OrderForEmail,
  items: LineItemForEmail[]
): Promise<{ ok: true } | { ok: false; error: string }> {
  const email = order.customer_email;
  if (!email?.trim()) return { ok: true };
  const apiKey = env.RESEND_API_KEY;
  const from = env.MAIL_FROM;
  if (!apiKey || !from) return { ok: false, error: "Email not configured" };

  const totalStr = formatMoney(order.amount_total, order.currency);
  const rows = items
    .map(
      (i) =>
        `<tr><td>${escapeHtml(i.name)}</td><td>${i.qty}</td><td>${formatMoney(i.line_amount, order.currency)}</td></tr>`
    )
    .join("");
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Order confirmation</title></head>
<body style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h1 style="font-size: 1.5rem;">Order confirmed</h1>
  <p>Thank you for your order. We've received your payment.</p>
  <p><strong>Order ID:</strong> ${escapeHtml(order.id)}</p>
  <p><strong>Total:</strong> ${totalStr}</p>
  <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
    <thead><tr style="border-bottom: 1px solid #ccc;"><th style="text-align: left;">Item</th><th>Qty</th><th style="text-align: right;">Amount</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <p>You'll receive another email when your order is shipped.</p>
  <p style="color: #666; font-size: 0.875rem;">Speeduino EU Hub · ${env.APP_URL ?? ""}</p>
</body>
</html>`;
  return sendEmail(apiKey, from, email.trim(), `Order confirmed — ${order.id}`, html);
}

export async function sendNewSaleAlertToSeller(
  env: { RESEND_API_KEY?: string; MAIL_FROM?: string; SELLER_EMAIL?: string; APP_URL?: string },
  order: OrderForEmail,
  items: LineItemForEmail[]
): Promise<{ ok: true } | { ok: false; error: string }> {
  const to = env.SELLER_EMAIL;
  if (!to?.trim()) return { ok: false, error: "SELLER_EMAIL not set" };
  const apiKey = env.RESEND_API_KEY;
  const from = env.MAIL_FROM;
  if (!apiKey || !from) return { ok: false, error: "Email not configured" };

  const totalStr = formatMoney(order.amount_total, order.currency);
  const rows = items
    .map(
      (i) =>
        `<tr><td>${escapeHtml(i.name)}</td><td>${i.qty}</td><td>${formatMoney(i.line_amount, order.currency)}</td></tr>`
    )
    .join("");
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New sale</title></head>
<body style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h1 style="font-size: 1.25rem;">New sale — ${escapeHtml(order.id)}</h1>
  <p><strong>Customer:</strong> ${escapeHtml(order.customer_email ?? "—")}</p>
  <p><strong>Total:</strong> ${totalStr}</p>
  <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
    <thead><tr style="border-bottom: 1px solid #ccc;"><th style="text-align: left;">Item</th><th>Qty</th><th style="text-align: right;">Amount</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <p><a href="${escapeHtml((env.APP_URL ?? "") + "/admin")}">Open Admin</a> to mark as shipped when ready.</p>
  <p style="color: #666; font-size: 0.875rem;">Speeduino EU Hub</p>
</body>
</html>`;
  return sendEmail(apiKey, from, to.trim(), `[Sale] ${order.id} — ${totalStr}`, html);
}

export async function sendOrderShippedToCustomer(
  env: { RESEND_API_KEY?: string; MAIL_FROM?: string; APP_URL?: string },
  order: OrderForEmail,
  _items: LineItemForEmail[]
): Promise<{ ok: true } | { ok: false; error: string }> {
  const email = order.customer_email;
  if (!email?.trim()) return { ok: true };
  const apiKey = env.RESEND_API_KEY;
  const from = env.MAIL_FROM;
  if (!apiKey || !from) return { ok: false, error: "Email not configured" };

  let trackingBlock = "";
  if (order.tracking_number?.trim()) {
    const carrier = order.tracking_carrier?.trim() || "Carrier";
    trackingBlock = `<p><strong>Tracking:</strong> ${escapeHtml(carrier)} — ${escapeHtml(order.tracking_number)}</p>`;
  }
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Order shipped</title></head>
<body style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h1 style="font-size: 1.5rem;">Your order has shipped</h1>
  <p>Order <strong>${escapeHtml(order.id)}</strong> is on its way.</p>
  ${trackingBlock}
  <p style="color: #666; font-size: 0.875rem;">Speeduino EU Hub · ${env.APP_URL ?? ""}</p>
</body>
</html>`;
  return sendEmail(apiKey, from, email.trim(), `Order shipped — ${order.id}`, html);
}

export async function sendOrderDeliveredToCustomer(
  env: { RESEND_API_KEY?: string; MAIL_FROM?: string; APP_URL?: string },
  order: OrderForEmail
): Promise<{ ok: true } | { ok: false; error: string }> {
  const email = order.customer_email;
  if (!email?.trim()) return { ok: true };
  const apiKey = env.RESEND_API_KEY;
  const from = env.MAIL_FROM;
  if (!apiKey || !from) return { ok: false, error: "Email not configured" };

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Order delivered</title></head>
<body style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h1 style="font-size: 1.5rem;">Order delivered</h1>
  <p>Order <strong>${escapeHtml(order.id)}</strong> has been marked as delivered. We hope you enjoy your purchase.</p>
  <p style="color: #666; font-size: 0.875rem;">Speeduino EU Hub · ${env.APP_URL ?? ""}</p>
</body>
</html>`;
  return sendEmail(apiKey, from, email.trim(), `Order delivered — ${order.id}`, html);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
