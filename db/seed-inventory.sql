-- Seed products and inventory (run after schema.sql)
-- Usage: wrangler d1 execute DB --remote --file=./db/seed-inventory.sql
-- Replace DB with your database name (e.g. speeduino-eu-hub-db)

INSERT OR REPLACE INTO products (id, slug, name, currency_prices, active) VALUES
  ('diy-kit', 'speeduino-diy-kit', 'Speeduino DIY Kit (Unsoldered PCB + Components)', '{"EUR":8900,"SEK":99900}', 1),
  ('assembled-ecu', 'speeduino-assembled-ecu', 'Speeduino Assembled & Tested ECU', '{"EUR":22900,"SEK":249900}', 1),
  ('harness-kit', 'speeduino-wiring-harness-kit', 'Universal Wiring Harness + Sensor Starter Pack', '{"EUR":14900,"SEK":159900}', 1),
  ('sensor-pack', 'speeduino-sensor-pack', 'Sensor Upgrade Pack', '{"EUR":19900,"SEK":219900}', 1),
  ('volvo-p2-bundle', 'speeduino-volvo-p2-bundle', 'Volvo P2 5-Cylinder Turbo Starter Bundle', '{"EUR":39900,"SEK":429900}', 1);

INSERT OR REPLACE INTO inventory (product_id, qty, updated_at) VALUES
  ('diy-kit', 5, datetime('now')),
  ('assembled-ecu', 5, datetime('now')),
  ('harness-kit', 5, datetime('now')),
  ('sensor-pack', 5, datetime('now')),
  ('volvo-p2-bundle', 5, datetime('now'));
