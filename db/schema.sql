-- Speeduino EU Hub – D1 schema for products, inventory, orders
-- Run: wrangler d1 execute DB --remote --file=./db/schema.sql

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  long_description TEXT NOT NULL DEFAULT '',
  price_eur INTEGER NOT NULL DEFAULT 0,       -- cents
  category TEXT NOT NULL DEFAULT 'accessory', -- board | sensor | module | accessory
  board_compatibility TEXT NOT NULL DEFAULT '[]',   -- JSON string array
  connects_to TEXT NOT NULL DEFAULT '',
  requirement_level TEXT NOT NULL DEFAULT 'optional', -- required | recommended | optional
  show_conditions TEXT NOT NULL DEFAULT '[]',  -- JSON: array of condition objects
  skill_level TEXT NOT NULL DEFAULT 'Beginner',
  lead_time_days TEXT NOT NULL DEFAULT '3-7',
  included TEXT NOT NULL DEFAULT '[]',         -- JSON string array
  not_included TEXT NOT NULL DEFAULT '[]',     -- JSON string array
  badge TEXT,
  featured INTEGER NOT NULL DEFAULT 0,
  in_stock INTEGER NOT NULL DEFAULT 1,
  image_url TEXT,
  specs TEXT NOT NULL DEFAULT '{}',            -- JSON key-value object
  sort_order INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS inventory (
  product_id TEXT PRIMARY KEY,
  qty INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

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

CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL DEFAULT 'starter_guide',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON subscribers(created_at DESC);

CREATE TABLE IF NOT EXISTS config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS waitlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_waitlist_product_email ON waitlist(product_id, email);
CREATE INDEX IF NOT EXISTS idx_waitlist_product_id ON waitlist(product_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);
