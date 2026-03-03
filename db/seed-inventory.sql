-- Seed products, inventory (100 each), and mock orders (run after schema.sql)
-- Usage: wrangler d1 execute store_db --remote --file=./db/seed-inventory.sql
-- Local:  wrangler d1 execute store_db --local --file=./db/seed-inventory.sql

-- Products (from website/catalog: EUR cents, SEK öre)
INSERT OR REPLACE INTO products (id, slug, name, currency_prices, active) VALUES
  ('diy-kit', 'speeduino-diy-kit', 'Speeduino DIY Kit (Unsoldered PCB + Components)', '{"EUR":8900,"SEK":99900}', 1),
  ('assembled-ecu', 'speeduino-assembled-ecu', 'Speeduino Assembled & Tested ECU', '{"EUR":22900,"SEK":249900}', 1),
  ('harness-kit', 'speeduino-wiring-harness-kit', 'Universal Wiring Harness + Sensor Starter Pack', '{"EUR":14900,"SEK":159900}', 1),
  ('sensor-pack', 'speeduino-sensor-pack', 'Sensor Upgrade Pack', '{"EUR":19900,"SEK":219900}', 1),
  ('volvo-p2-bundle', 'speeduino-volvo-p2-bundle', 'Volvo P2 5-Cylinder Turbo Starter Bundle', '{"EUR":39900,"SEK":429900}', 1);

-- Inventory: 100 units per product
INSERT OR REPLACE INTO inventory (product_id, qty, updated_at) VALUES
  ('diy-kit', 100, datetime('now')),
  ('assembled-ecu', 100, datetime('now')),
  ('harness-kit', 100, datetime('now')),
  ('sensor-pack', 100, datetime('now')),
  ('volvo-p2-bundle', 100, datetime('now'));

-- Mock order 1 (EUR): 1x Assembled ECU + 1x Harness kit = 37800 cents
INSERT OR REPLACE INTO orders (id, created_at, status, currency, amount_total, stripe_session_id, stripe_payment_intent, customer_email, shipping_json) VALUES
  ('ord_mock_001', '2025-02-15 10:30:00', 'PAID', 'EUR', 37800, 'cs_mock_001', 'pi_mock_001', 'customer@example.com', '{"name":"Test Customer","address":{"line1":"Example St 1","city":"Stockholm","postal_code":"11122","country":"SE"}}');

INSERT OR REPLACE INTO order_items (order_id, product_id, qty, unit_amount, line_amount) VALUES
  ('ord_mock_001', 'assembled-ecu', 1, 22900, 22900),
  ('ord_mock_001', 'harness-kit', 1, 14900, 14900);

-- Mock order 2 (SEK): 1x DIY Kit + 1x Sensor Pack = 319800 öre
INSERT OR REPLACE INTO orders (id, created_at, status, currency, amount_total, stripe_session_id, stripe_payment_intent, customer_email, shipping_json) VALUES
  ('ord_mock_002', '2025-02-20 14:00:00', 'PAID', 'SEK', 319800, 'cs_mock_002', 'pi_mock_002', 'buyer@example.se', NULL);

INSERT OR REPLACE INTO order_items (order_id, product_id, qty, unit_amount, line_amount) VALUES
  ('ord_mock_002', 'diy-kit', 1, 99900, 99900),
  ('ord_mock_002', 'sensor-pack', 1, 219900, 219900);

-- Mock order 3 (EUR): Volvo P2 bundle only
INSERT OR REPLACE INTO orders (id, created_at, status, currency, amount_total, stripe_session_id, stripe_payment_intent, customer_email, shipping_json) VALUES
  ('ord_mock_003', '2025-03-01 09:15:00', 'PAID', 'EUR', 39900, 'cs_mock_003', 'pi_mock_003', 'volvo.fan@example.com', NULL);

INSERT OR REPLACE INTO order_items (order_id, product_id, qty, unit_amount, line_amount) VALUES
  ('ord_mock_003', 'volvo-p2-bundle', 1, 39900, 39900);
