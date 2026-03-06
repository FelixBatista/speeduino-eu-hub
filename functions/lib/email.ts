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
  shipping_json?: string | null;
};

export type LineItemForEmail = {
  product_id: string;
  name: string;
  qty: number;
  unit_amount: number;
  line_amount: number;
  included?: string[];
};

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
  env: {
    RESEND_API_KEY?: string;
    MAIL_FROM?: string;
    SELLER_EMAIL?: string;
    APP_URL?: string;
    SENDER_NAME?: string;
    SENDER_LINE1?: string;
    SENDER_LINE2?: string;
    SENDER_CITY?: string;
    SENDER_POSTAL_CODE?: string;
    SENDER_COUNTRY?: string;
  },
  order: OrderForEmail,
  items: LineItemForEmail[]
): Promise<{ ok: true } | { ok: false; error: string }> {
  const to = env.SELLER_EMAIL;
  if (!to?.trim()) return { ok: false, error: "SELLER_EMAIL not set" };
  const apiKey = env.RESEND_API_KEY;
  const from = env.MAIL_FROM;
  if (!apiKey || !from) return { ok: false, error: "Email not configured" };

  const totalStr = formatMoney(order.amount_total, order.currency);

  // Parse shipping info
  let shipping: {
    name?: string | null;
    email?: string | null;
    address?: {
      line1?: string | null;
      line2?: string | null;
      city?: string | null;
      state?: string | null;
      postal_code?: string | null;
      country?: string | null;
    } | null;
    shipping_option_label?: string | null;
  } | null = null;
  if (order.shipping_json) {
    try { shipping = JSON.parse(order.shipping_json); } catch { /* ignore */ }
  }

  const recipientName = shipping?.name?.trim() || null;
  const recipientEmail = shipping?.email?.trim() || order.customer_email?.trim() || null;
  const addr = shipping?.address;
  const recipientLines = [
    addr?.line1,
    addr?.line2,
    addr?.city && addr?.postal_code ? `${addr.postal_code} ${addr.city}` : (addr?.city || addr?.postal_code),
    addr?.state,
    addr?.country,
  ].filter(Boolean) as string[];

  // Sender block from env
  const senderName = env.SENDER_NAME?.trim() || null;
  const senderLines = [
    env.SENDER_LINE1,
    env.SENDER_LINE2,
    env.SENDER_CITY && env.SENDER_POSTAL_CODE ? `${env.SENDER_POSTAL_CODE} ${env.SENDER_CITY}` : (env.SENDER_CITY || env.SENDER_POSTAL_CODE),
    env.SENDER_COUNTRY,
  ].filter(Boolean) as string[];
  const hasSender = senderName || senderLines.length > 0;

  // Shipping label HTML
  const senderBlock = hasSender
    ? `<div style="font-size:11px;color:#444;margin-bottom:8px;">
        <span style="font-weight:700;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#888;">FROM</span><br>
        ${senderName ? `<strong>${escapeHtml(senderName)}</strong><br>` : ""}
        ${senderLines.map((l) => `${escapeHtml(l)}<br>`).join("")}
      </div>`
    : `<div style="font-size:10px;color:#aaa;margin-bottom:8px;font-style:italic;">Set SENDER_* env vars to show your return address here.</div>`;

  const recipientBlock = recipientName || recipientLines.length > 0
    ? `<div style="font-size:14px;color:#111;">
        <span style="font-weight:700;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#888;">TO</span><br>
        ${recipientName ? `<strong style="font-size:16px;">${escapeHtml(recipientName)}</strong><br>` : ""}
        ${recipientEmail ? `<span style="color:#555;font-size:12px;">${escapeHtml(recipientEmail)}</span><br>` : ""}
        ${recipientLines.map((l) => `${escapeHtml(l)}<br>`).join("")}
      </div>`
    : `<div style="font-size:12px;color:#aaa;font-style:italic;">Address not collected at checkout.</div>`;

  const shippingMethodBlock = shipping?.shipping_option_label
    ? `<div style="margin-top:10px;padding-top:10px;border-top:1px dashed #ccc;font-size:11px;color:#555;">
        <strong>Shipping method:</strong> ${escapeHtml(shipping.shipping_option_label)}
      </div>`
    : "";

  const shippingLabel = `
<div style="border:2px solid #111;border-radius:6px;padding:16px 20px;max-width:420px;margin:24px 0;background:#fff;page-break-inside:avoid;">
  <div style="font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#bbb;margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:8px;">
    Shipping Label — Order ${escapeHtml(order.id)}
  </div>
  ${senderBlock}
  <div style="border-top:1px solid #ddd;margin:12px 0;"></div>
  ${recipientBlock}
  ${shippingMethodBlock}
</div>`;

  // Order summary table
  const orderRows = items
    .map((i) => `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee;">${escapeHtml(i.name)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:center;">${i.qty}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right;">${formatMoney(i.line_amount, order.currency)}</td></tr>`)
    .join("");

  // Packing checklist
  const checklistSections = items.map((item) => {
    const productLabel = `${escapeHtml(item.name)} × ${item.qty}`;
    const componentLines = (item.included && item.included.length > 0)
      ? item.included.map((component) =>
          `<li style="margin:4px 0;list-style:none;display:flex;align-items:center;gap:8px;">
            <span style="display:inline-block;width:16px;height:16px;border:2px solid #333;border-radius:3px;flex-shrink:0;"></span>
            <span>${escapeHtml(component)}</span>
          </li>`
        ).join("")
      : `<li style="margin:4px 0;list-style:none;color:#888;font-style:italic;">— (check product page for contents)</li>`;
    return `
<div style="margin-bottom:16px;page-break-inside:avoid;">
  <div style="font-weight:700;font-size:13px;color:#111;margin-bottom:6px;padding:4px 0;border-bottom:1px solid #ddd;">${productLabel}</div>
  <ul style="margin:0;padding:0 0 0 4px;">${componentLines}</ul>
</div>`;
  }).join("");

  // QR code pointing to /get-started page
  const getStartedUrl = encodeURIComponent((env.APP_URL ?? "https://speeduino.eu") + "/get-started");
  const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&margin=6&data=${getStartedUrl}`;

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>New sale — ${escapeHtml(order.id)}</title>
<style>
  @media print {
    body { margin: 0; padding: 0; }
    .no-print { display: none !important; }
    .page-break { page-break-before: always; }
  }
</style>
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; color: #111;">

  <!-- Header -->
  <div class="no-print" style="background:#f4f4f4;border-radius:6px;padding:16px 20px;margin-bottom:24px;">
    <h1 style="margin:0 0 6px;font-size:1.25rem;">New sale — ${escapeHtml(order.id)}</h1>
    <p style="margin:0;color:#555;font-size:0.9rem;">
      <strong>Total:</strong> ${totalStr} &nbsp;|&nbsp;
      <strong>Date:</strong> ${new Date(order.created_at).toLocaleString("en-GB")}
    </p>
    <p style="margin:6px 0 0;"><a href="${escapeHtml((env.APP_URL ?? "") + "/admin")}" style="color:#0066cc;">Open Admin →</a></p>
  </div>

  <!-- Customer info summary -->
  <div class="no-print" style="margin-bottom:20px;">
    <h2 style="font-size:1rem;margin:0 0 8px;border-bottom:1px solid #eee;padding-bottom:6px;">Customer Info</h2>
    <p style="margin:2px 0;"><strong>Name:</strong> ${escapeHtml(recipientName ?? "—")}</p>
    <p style="margin:2px 0;"><strong>Email:</strong> ${escapeHtml(recipientEmail ?? "—")}</p>
    ${recipientLines.length > 0
      ? `<p style="margin:2px 0;"><strong>Address:</strong> ${recipientLines.map(escapeHtml).join(", ")}</p>`
      : `<p style="margin:2px 0;color:#888;"><strong>Address:</strong> not collected</p>`}
    ${shipping?.shipping_option_label ? `<p style="margin:2px 0;"><strong>Shipping:</strong> ${escapeHtml(shipping.shipping_option_label)}</p>` : ""}
  </div>

  <!-- Order items summary -->
  <div class="no-print" style="margin-bottom:24px;">
    <h2 style="font-size:1rem;margin:0 0 8px;border-bottom:1px solid #eee;padding-bottom:6px;">Order Items</h2>
    <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
      <thead><tr style="background:#f9f9f9;"><th style="text-align:left;padding:6px 8px;">Item</th><th style="padding:6px 8px;text-align:center;">Qty</th><th style="padding:6px 8px;text-align:right;">Amount</th></tr></thead>
      <tbody>${orderRows}</tbody>
      <tfoot><tr><td colspan="2" style="padding:8px;font-weight:700;text-align:right;">Total</td><td style="padding:8px;font-weight:700;text-align:right;">${totalStr}</td></tr></tfoot>
    </table>
  </div>

  <hr class="no-print" style="border:none;border-top:2px dashed #ccc;margin:0 0 20px;">
  <p class="no-print" style="font-size:0.75rem;color:#aaa;margin:0 0 16px;">↓ Print everything below this line and attach to the parcel.</p>

  <!-- PRINTABLE SECTION -->

  <!-- Shipping label -->
  <h2 style="font-size:1rem;margin:0 0 4px;">Shipping Label</h2>
  ${shippingLabel}

  <!-- Packing checklist + QR code side by side -->
  <div class="page-break" style="margin-top:28px;">
    <h2 style="font-size:1rem;margin:0 0 12px;border-bottom:2px solid #111;padding-bottom:6px;">Packing Checklist — Order ${escapeHtml(order.id)}</h2>
    <div style="display:flex;gap:24px;align-items:flex-start;">
      <div style="flex:1;">${checklistSections}</div>
      <div style="flex-shrink:0;text-align:center;padding:12px;border:1px solid #ddd;border-radius:6px;background:#fafafa;">
        <img src="${qrImgUrl}" alt="QR code: Get Started" width="140" height="140" style="display:block;margin:0 auto;">
        <p style="margin:8px 0 0;font-size:10px;color:#555;line-height:1.4;">Scan for step-by-step<br>installation guide</p>
      </div>
    </div>
  </div>

  <p style="margin-top:28px;font-size:0.75rem;color:#aaa;">Speeduino EU Hub</p>
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

export async function sendWaitlistAlertToSeller(
  env: { RESEND_API_KEY?: string; MAIL_FROM?: string; SELLER_EMAIL?: string; APP_URL?: string },
  productId: string,
  productName: string,
  customerEmail: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const to = env.SELLER_EMAIL;
  if (!to?.trim()) return { ok: false, error: "SELLER_EMAIL not set" };
  const apiKey = env.RESEND_API_KEY;
  const from = env.MAIL_FROM;
  if (!apiKey || !from) return { ok: false, error: "Email not configured" };

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Waitlist signup</title></head>
<body style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h1 style="font-size: 1.25rem;">📋 New waitlist signup</h1>
  <p><strong>${escapeHtml(customerEmail)}</strong> signed up for back-in-stock notifications.</p>
  <table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #e5e7eb; border-radius: 8px;">
    <tr style="background: #f9fafb;"><td style="padding: 10px 14px; font-weight: 600; border-bottom: 1px solid #e5e7eb;">Product</td><td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(productName)}</td></tr>
    <tr><td style="padding: 10px 14px; font-weight: 600;">Product ID</td><td style="padding: 10px 14px; font-family: monospace;">${escapeHtml(productId)}</td></tr>
  </table>
  <p>When you restock this item, email them or use the waitlist in your <a href="${escapeHtml((env.APP_URL ?? "") + "/admin")}">Admin panel</a>.</p>
  <p style="color: #6b7280; font-size: 0.875rem;">Speeduino EU Hub</p>
</body>
</html>`;
  return sendEmail(apiKey, from, to.trim(), `[Waitlist] ${productName} — ${customerEmail}`, html);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
