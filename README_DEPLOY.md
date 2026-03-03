# Speeduino EU Hub — Deployment & Setup

This guide covers deploying the frontend to **Cloudflare Pages**, wiring **Stripe Checkout** and **D1**, and configuring the **admin** area.

---

## 1. Cloudflare Pages (frontend + functions)

### Build settings

- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** (leave default, or `/`)

### Wrangler / D1

1. Install Wrangler if needed: `npm i -g wrangler` or use `npx wrangler`.
2. Create a Pages project in the [Cloudflare dashboard](https://dash.cloudflare.com/) (Pages → Create project → Connect to Git), or via CLI:
   ```bash
   npx wrangler pages project create speeduino-eu-hub
   ```
3. Create a D1 database:
   ```bash
   npx wrangler d1 create speeduino-eu-hub-db
   ```
   Copy the `database_id` from the output.

4. In the repo root, open `wrangler.toml` and set:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "speeduino-eu-hub-db"
   database_id = "<paste-database_id-here>"
   ```

5. Apply the schema and seed (run from repo root):
   ```bash
   npx wrangler d1 execute speeduino-eu-hub-db --remote --file=./db/schema.sql
   npx wrangler d1 execute speeduino-eu-hub-db --remote --file=./db/seed-inventory.sql
   ```
   If your database name differs, replace `speeduino-eu-hub-db` with the name you used in `wrangler d1 create`.

6. Deploy:
   - **Via Git:** Push to the connected branch; Pages will build and deploy.
   - **Via CLI:** `npx wrangler pages deploy dist --project-name=speeduino-eu-hub` (after `npm run build`). For full app + Functions, use the dashboard’s “Create with Workers” or connect the repo so that the `/functions` directory is included in the build.

### Environment variables (Cloudflare dashboard)

In **Pages → your project → Settings → Environment variables**, add:

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_URL` | Public URL of the site (used for Stripe redirects) | `https://speeduino-eu-hub.pages.dev` |
| `STRIPE_SECRET_KEY` | Stripe secret key (live or test) | `sk_live_...` or `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (see Stripe section below) | `whsec_...` |
| `ADMIN_TOKEN` | Secret token to access `/admin` | Any long random string |
| `DEFAULT_CURRENCY` | (Optional) Default currency | `EUR` or `SEK` |

Do **not** put these in client code or commit them to git.

---

## 2. Stripe

### API keys

1. Go to [Stripe Dashboard → Developers → API keys](https://dashboard.stripe.com/apikeys).
2. Use **Test** keys while developing; switch to **Live** for production.
3. Copy the **Secret key** and set it as `STRIPE_SECRET_KEY` in Cloudflare.

### Checkout (no Payment Links required)

This app uses **Stripe Checkout Sessions** with server-computed `price_data`. You do **not** need to create Products or Payment Links in the Dashboard for the main flow. The backend builds line items from the server catalog and creates a session on `POST /api/checkout`.

### Webhook

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks).
2. **Add endpoint:**  
   URL: `https://<your-pages-domain>/api/stripe-webhook`  
   Events to send: `checkout.session.completed` (and optionally `checkout.session.expired`).
3. After creating the endpoint, open that endpoint and reveal the **Signing secret** (starts with `whsec_...`). Set that value as `STRIPE_WEBHOOK_SECRET` in Cloudflare — not your API key (`sk_...`), only this endpoint’s signing secret.

Stripe will send `checkout.session.completed` after a successful payment. The webhook handler will:

- Create an order in D1
- Insert order items
- Decrement inventory in the same transaction

---

## 3. D1 database

### Schema

- **Location:** `db/schema.sql`
- **Tables:** `products`, `inventory`, `orders`, `order_items`
- **Apply:** `npx wrangler d1 execute <db-name> --remote --file=./db/schema.sql`

### Seed inventory

- **File:** `db/seed-inventory.sql`
- **Apply:** `npx wrangler d1 execute <db-name> --remote --file=./db/seed-inventory.sql`
- This inserts product rows and sets inventory (e.g. 5 units per product). Adjust quantities in the SQL or later via the admin panel.

### Local development

- Create a local D1 DB: `npx wrangler d1 create speeduino-eu-hub-db --local` (or use the same name as remote).
- In `wrangler.toml` you can add a `[env.local]` section with a local D1 binding if needed.
- Run schema + seed against local DB:  
  `npx wrangler d1 execute speeduino-eu-hub-db --local --file=./db/schema.sql`  
  `npx wrangler d1 execute speeduino-eu-hub-db --local --file=./db/seed-inventory.sql`

---

## 4. Admin area

- **URL:** `https://<your-domain>/admin`
- **Auth:** The page prompts for a token. Set `ADMIN_TOKEN` in Cloudflare; users must enter that value (store in sessionStorage for the session).
- **Features:** List recent orders and inventory; edit inventory quantities via PATCH `/api/admin/inventory`.
- **Security:** This is a simple MVP (token in header). For production, consider [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/) or another auth layer.

---

## 5. Local development

### Frontend only (no API)

```bash
npm install
npm run dev
```

Runs the Vite app. Calls to `/api/*` will 404 unless proxied or run with Functions.

### Frontend + Cloudflare Pages Functions (and D1)

1. Ensure `wrangler.toml` has the correct D1 binding and that the DB exists (local or remote).
2. Run:
   ```bash
   npx wrangler pages dev dist --compatibility-date=2024-01-01
   ```
   You must build first (`npm run build`). Alternatively use a setup that runs Vite in dev mode and proxies `/api` to a local Workers/Functions process if you have one.

3. Set env vars for local: create `.dev.vars` in the repo root (do not commit):
   ```
   APP_URL=http://localhost:8788
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ADMIN_TOKEN=dev-admin-token
   ```
   Wrangler will load these for local runs.

### Testing the webhook locally

Use the [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward events:

```bash
stripe listen --forward-to http://localhost:8788/api/stripe-webhook
```

Use the printed webhook signing secret in `.dev.vars` as `STRIPE_WEBHOOK_SECRET`.

---

## 6. SEO

- **robots.txt:** In `public/robots.txt`, replace `https://your-domain.com` in the Sitemap line with your real domain.
- **sitemap.xml:** In `public/sitemap.xml`, replace all `https://your-domain.com` with your real domain. You can regenerate this at build time if needed (e.g. from product slugs in `src/data/products.ts`).

---

## 7. Troubleshooting

### "Server configuration error" when clicking Pay / checkout

This means the **checkout** API (`POST /api/checkout`) is missing one or more of:

| Required | Where to set it |
|----------|-----------------|
| **DB** (D1) | **Pages → your project → Settings → Functions** → scroll to **D1 database bindings** → add a binding: Variable name = `DB`, D1 database = your database (e.g. `store_db`). If you deploy via Git, `wrangler.toml` may provide this automatically; if not, add the binding in the dashboard. |
| **APP_URL** | **Pages → Settings → Environment variables** → add `APP_URL` = your site URL (e.g. `https://speeduino-eu-hub.pages.dev` or your custom domain). Apply to **Production** (and **Preview** if you test preview deploys). |
| **STRIPE_SECRET_KEY** | **Pages → Settings → Environment variables** → add `STRIPE_SECRET_KEY` = your Stripe secret key (`sk_test_...` or `sk_live_...`). Prefer **Encrypt** so it’s stored as a secret. |

Redeploy or wait for the next deployment after changing env vars or bindings. If you use a custom domain, set `APP_URL` to that (e.g. `https://yourdomain.com`).

### Webhook returns 400 "Invalid signature" → "Order not found" after payment

Payment succeeds in Stripe but the webhook fails with **400 Bad Request** and response `{"error": "Invalid signature"}`. Then the success page can’t find the order because it was never written to D1.

**Cause:** `STRIPE_WEBHOOK_SECRET` in Cloudflare does not match the **Signing secret** for that webhook endpoint in Stripe.

**Fix:**

1. In Stripe go to [Developers → Webhooks](https://dashboard.stripe.com/webhooks).
2. Open the endpoint whose URL is `https://speeduino-eu-hub.pages.dev/api/stripe-webhook` (or your domain).
3. In **Signing secret**, click **Reveal** and copy the value (it starts with `whsec_`).  
   Do **not** use your API secret key (`sk_...`) here — only the webhook signing secret.
4. In Cloudflare **Pages → your project → Settings → Environment variables**, set **`STRIPE_WEBHOOK_SECRET`** to that exact value (no extra spaces). Use **Encrypt** if you want. Apply to **Production** (and **Preview** if you use it).
5. Redeploy or wait for the next deployment so the new secret is used.

If you recreated the webhook endpoint in Stripe, a new signing secret was generated — update Cloudflare with that new `whsec_...` value.

**If the secret is correct and it still fails:** Cloudflare Pages runs on the Workers (edge) runtime, which uses the Web Crypto API. The webhook handler uses Stripe’s **async** verification (`constructEventAsync` + `createSubtleCryptoProvider`) so signature verification works in that environment. After pulling the latest code, redeploy so the updated handler is live.

---

## 8. Checklist

- [x] Cloudflare Pages project created and connected to repo (or deploy via CLI).
- [x] D1 database created; `wrangler.toml` updated with `database_id`.
- [x] Schema and seed applied to D1 (remote and/or local).
- [x] Env vars set in Cloudflare: `APP_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `ADMIN_TOKEN`.
- [x] Stripe webhook endpoint added with URL `https://<your-domain>/api/stripe-webhook`, event `checkout.session.completed`.
- [x] `robots.txt` and `sitemap.xml` updated with your domain.
