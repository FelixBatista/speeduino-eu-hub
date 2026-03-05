-- Seed products, inventory, and mock orders (run after schema.sql)
-- Usage: wrangler d1 execute store_db --remote --file=./db/seed-inventory.sql
-- Local:  wrangler d1 execute store_db --local --file=./db/seed-inventory.sql

-- Products (from catalog: EUR cents, SEK öre)
INSERT OR REPLACE INTO products (id, slug, name, currency_prices, active) VALUES
  ('v03-pcb', 'speeduino-v03-pcb', 'Speeduino v0.3 PCB (DIY Kit)', '{"EUR":2100,"SEK":23900}', 1),
  ('v04-pcb', 'speeduino-v04-pcb', 'Speeduino v0.4 PCB (DIY Kit)', '{"EUR":2500,"SEK":28900}', 1),
  ('arduino-mega', 'arduino-mega-2560', 'Arduino Mega 2560 R3 (ATmega16U2)', '{"EUR":2500,"SEK":28900}', 1),
  ('vr-conditioner', 'vr-conditioner-max9926', 'VR Conditioner Module (MAX9926)', '{"EUR":3500,"SEK":39900}', 1),
  ('wideband-controller', 'wideband-controller-spartan', 'Wideband Controller (14Point7 Spartan 3 Lite)', '{"EUR":8900,"SEK":102900}', 1),
  ('ignition-driver', 'ignition-driver-4ch-211', 'Ignition Driver Module (4-Channel, Bosch 211 Style)', '{"EUR":4200,"SEK":47900}', 1),
  ('drv8825-stepper', 'drv8825-stepper-driver', 'Stepper Driver Module (DRV8825)', '{"EUR":700,"SEK":7900}', 1),
  ('ballast-resistor', 'ballast-resistor-pack', 'Injector Ballast Resistor Pack (4x4.7Ω)', '{"EUR":4900,"SEK":56900}', 1),
  ('map-sensor', 'map-sensor-mpx4250', 'MAP Sensor (MPX4250, 2.5 Bar)', '{"EUR":3500,"SEK":39900}', 1),
  ('iat-sensor', 'iat-sensor-gm', 'Intake Air Temperature Sensor (GM Open Element)', '{"EUR":1500,"SEK":17500}', 1),
  ('clt-sensor', 'clt-sensor-gm', 'Coolant Temperature Sensor (GM Style)', '{"EUR":1500,"SEK":17500}', 1),
  ('tps-sensor', 'tps-sensor-3wire', 'TPS Sensor (3-Wire Potentiometer)', '{"EUR":2500,"SEK":28900}', 1),
  ('wideband-o2', 'wideband-o2-lsu49', 'Wideband O2 Sensor (Bosch LSU 4.9)', '{"EUR":9900,"SEK":113900}', 1),
  ('flex-fuel-sensor', 'flex-fuel-sensor-gm', 'Flex Fuel Sensor (GM/Continental)', '{"EUR":16500,"SEK":189900}', 1),
  ('boost-solenoid', 'boost-control-solenoid-mac', 'Boost Control Solenoid (MAC 3-Port)', '{"EUR":7900,"SEK":90900}', 1),
  ('relay-pack', 'relay-pack-4x-30a', 'Relay Pack (4x Bosch 30A 5-Pin + Fuse Box)', '{"EUR":2500,"SEK":28900}', 1),
  ('idc40-plug', 'idc40-plug-pins-v04', 'IDC40 Plug + Pins (v0.4)', '{"EUR":600,"SEK":6900}', 1),
  ('lsu49-connector', 'lsu49-connector-6pin', 'LSU 4.9 Wideband Connector (6-Pin)', '{"EUR":800,"SEK":8900}', 1),
  ('coil-connector-pack', 'smart-coil-connector-pack', 'Smart Coil Connector Pack (4-Pin, VW/Audi Style)', '{"EUR":600,"SEK":6900}', 1);

-- Inventory: 100 units per product
INSERT OR REPLACE INTO inventory (product_id, qty, updated_at) VALUES
  ('v03-pcb', 100, datetime('now')),
  ('v04-pcb', 100, datetime('now')),
  ('arduino-mega', 100, datetime('now')),
  ('vr-conditioner', 100, datetime('now')),
  ('wideband-controller', 100, datetime('now')),
  ('ignition-driver', 100, datetime('now')),
  ('drv8825-stepper', 100, datetime('now')),
  ('ballast-resistor', 100, datetime('now')),
  ('map-sensor', 100, datetime('now')),
  ('iat-sensor', 100, datetime('now')),
  ('clt-sensor', 100, datetime('now')),
  ('tps-sensor', 100, datetime('now')),
  ('wideband-o2', 100, datetime('now')),
  ('flex-fuel-sensor', 100, datetime('now')),
  ('boost-solenoid', 100, datetime('now')),
  ('relay-pack', 100, datetime('now')),
  ('idc40-plug', 100, datetime('now')),
  ('lsu49-connector', 100, datetime('now')),
  ('coil-connector-pack', 100, datetime('now'));

-- Mock order 1 (EUR): v0.4 PCB + Arduino + MAP sensor + relays
INSERT OR REPLACE INTO orders (id, created_at, status, currency, amount_total, stripe_session_id, stripe_payment_intent, customer_email, shipping_json) VALUES
  ('ord_mock_001', '2025-02-15 10:30:00', 'PAID', 'EUR', 11000, 'cs_mock_001', 'pi_mock_001', 'customer@example.com', '{"name":"Test Customer","address":{"line1":"Example St 1","city":"Stockholm","postal_code":"11122","country":"SE"}}');

INSERT OR REPLACE INTO order_items (order_id, product_id, qty, unit_amount, line_amount) VALUES
  ('ord_mock_001', 'v04-pcb', 1, 2500, 2500),
  ('ord_mock_001', 'arduino-mega', 1, 2500, 2500),
  ('ord_mock_001', 'map-sensor', 1, 3500, 3500),
  ('ord_mock_001', 'relay-pack', 1, 2500, 2500);

-- Mock order 2 (SEK): v0.3 PCB + Arduino + VR conditioner + sensors
INSERT OR REPLACE INTO orders (id, created_at, status, currency, amount_total, stripe_session_id, stripe_payment_intent, customer_email, shipping_json) VALUES
  ('ord_mock_002', '2025-02-20 14:00:00', 'PAID', 'SEK', 125200, 'cs_mock_002', 'pi_mock_002', 'buyer@example.se', NULL);

INSERT OR REPLACE INTO order_items (order_id, product_id, qty, unit_amount, line_amount) VALUES
  ('ord_mock_002', 'v03-pcb', 1, 23900, 23900),
  ('ord_mock_002', 'arduino-mega', 1, 28900, 28900),
  ('ord_mock_002', 'vr-conditioner', 1, 39900, 39900),
  ('ord_mock_002', 'iat-sensor', 1, 17500, 17500),
  ('ord_mock_002', 'clt-sensor', 1, 17500, 17500);

-- Mock order 3 (EUR): Wideband setup
INSERT OR REPLACE INTO orders (id, created_at, status, currency, amount_total, stripe_session_id, stripe_payment_intent, customer_email, shipping_json) VALUES
  ('ord_mock_003', '2025-03-01 09:15:00', 'PAID', 'EUR', 19700, 'cs_mock_003', 'pi_mock_003', 'tuner@example.com', NULL);

INSERT OR REPLACE INTO order_items (order_id, product_id, qty, unit_amount, line_amount) VALUES
  ('ord_mock_003', 'wideband-controller', 1, 8900, 8900),
  ('ord_mock_003', 'wideband-o2', 1, 9900, 9900),
  ('ord_mock_003', 'lsu49-connector', 1, 800, 800);
