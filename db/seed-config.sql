-- Default shipping config (run after schema.sql if you want initial options)
-- wrangler d1 execute DB --remote --file=./db/seed-config.sql

INSERT OR REPLACE INTO config (key, value) VALUES
  ('shipping_options', '[{"id":"standard","label":"Standard delivery (5–7 days)","amountEUR":500},{"id":"express","label":"Express delivery (2–3 days)","amountEUR":1200}]'),
  ('shipping_allowed_countries', '["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE","GB","NO","CH","IS","LI"]');
