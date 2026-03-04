-- Order tracking: shipped/delivered timestamps and tracking info
-- Run after schema.sql: wrangler d1 execute DB --remote --file=./db/schema-order-tracking.sql

ALTER TABLE orders ADD COLUMN shipped_at TEXT;
ALTER TABLE orders ADD COLUMN delivered_at TEXT;
ALTER TABLE orders ADD COLUMN tracking_number TEXT;
ALTER TABLE orders ADD COLUMN tracking_carrier TEXT;
