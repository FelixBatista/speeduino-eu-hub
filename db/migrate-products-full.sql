-- Migration: expand products table to full catalog schema
-- Run BEFORE seed-inventory.sql on existing deployments
-- Usage: wrangler d1 execute store_db --remote --file=./db/migrate-products-full.sql
-- Local:  wrangler d1 execute store_db --local --file=./db/migrate-products-full.sql

-- Drop old products table (order_items references product_id but no FK constraint)
DROP TABLE IF EXISTS products;

-- Recreate with full schema
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  long_description TEXT NOT NULL DEFAULT '',
  price_eur INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'accessory',
  board_compatibility TEXT NOT NULL DEFAULT '[]',
  connects_to TEXT NOT NULL DEFAULT '',
  requirement_level TEXT NOT NULL DEFAULT 'optional',
  show_conditions TEXT NOT NULL DEFAULT '[]',
  skill_level TEXT NOT NULL DEFAULT 'Beginner',
  lead_time_days TEXT NOT NULL DEFAULT '3-7',
  included TEXT NOT NULL DEFAULT '[]',
  not_included TEXT NOT NULL DEFAULT '[]',
  badge TEXT,
  featured INTEGER NOT NULL DEFAULT 0,
  in_stock INTEGER NOT NULL DEFAULT 1,
  image_url TEXT,
  specs TEXT NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Clear old inventory (product_ids have changed)
DELETE FROM inventory;
