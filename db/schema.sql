-- Speeduino EU Hub – D1 schema for products, inventory, orders
-- Run: wrangler d1 execute DB --remote --file=./db/schema.sql

-- Product catalog snapshot (optional; server-truth prices are in code via catalog.ts)
-- Useful for admin and order display
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  currency_prices TEXT NOT NULL, -- JSON: {"EUR":8900,"SEK":99900} (cents/öre)
  active INTEGER NOT NULL DEFAULT 1
);

-- Inventory per product
CREATE TABLE IF NOT EXISTS inventory (
  product_id TEXT PRIMARY KEY,
  qty INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Orders (created by webhook on checkout.session.completed)
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  status TEXT NOT NULL,
  currency TEXT NOT NULL,
  amount_total INTEGER NOT NULL,
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent TEXT,
  customer_email TEXT,
  shipping_json TEXT
);

-- Order line items
CREATE TABLE IF NOT EXISTS order_items (
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  qty INTEGER NOT NULL,
  unit_amount INTEGER NOT NULL,
  line_amount INTEGER NOT NULL,
  PRIMARY KEY (order_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id ON orders(stripe_session_id);
