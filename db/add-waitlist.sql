-- Migration: add waitlist table for out-of-stock notifications
-- Run on existing deployments:
-- wrangler d1 execute store_db --remote --file=./db/add-waitlist.sql
-- wrangler d1 execute store_db --local  --file=./db/add-waitlist.sql

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
