-- Set image_url for all non-board products
-- Modules
UPDATE products SET image_url = '/products/vr-conditioner.png'      WHERE id = 'vr-conditioner';
UPDATE products SET image_url = '/products/wideband-controller.png' WHERE id = 'wideband-controller';
UPDATE products SET image_url = '/products/ignition-driver.png'     WHERE id = 'ignition-driver';
UPDATE products SET image_url = '/products/drv8825-stepper.png'     WHERE id = 'drv8825-stepper';
UPDATE products SET image_url = '/products/ballast-resistor.png'    WHERE id = 'ballast-resistor';
UPDATE products SET image_url = '/products/iac-stepper-valve.png'   WHERE id = 'iac-stepper-valve';

-- Sensors
UPDATE products SET image_url = '/products/map-sensor.png'          WHERE id = 'map-sensor';
UPDATE products SET image_url = '/products/map-sensor-3bar.png'     WHERE id = 'map-sensor-3bar';
UPDATE products SET image_url = '/products/iat-sensor.png'          WHERE id = 'iat-sensor';
UPDATE products SET image_url = '/products/clt-sensor.png'          WHERE id = 'clt-sensor';
UPDATE products SET image_url = '/products/tps-sensor.png'          WHERE id = 'tps-sensor';
UPDATE products SET image_url = '/products/wideband-o2.png'         WHERE id = 'wideband-o2';
UPDATE products SET image_url = '/products/flex-fuel-sensor.png'    WHERE id = 'flex-fuel-sensor';
UPDATE products SET image_url = '/products/knock-sensor.png'        WHERE id = 'knock-sensor';
UPDATE products SET image_url = '/products/cam-sensor-hall.png'     WHERE id = 'cam-sensor-hall';

-- Accessories
UPDATE products SET image_url = '/products/boost-solenoid.png'      WHERE id = 'boost-solenoid';
UPDATE products SET image_url = '/products/relay-pack.png'          WHERE id = 'relay-pack';
UPDATE products SET image_url = '/products/idc40-plug.png'          WHERE id = 'idc40-plug';
UPDATE products SET image_url = '/products/lsu49-connector.png'     WHERE id = 'lsu49-connector';
UPDATE products SET image_url = '/products/coil-connector-pack.png' WHERE id = 'coil-connector-pack';
UPDATE products SET image_url = '/products/flyback-diode-pack.png'  WHERE id = 'flyback-diode-pack';
UPDATE products SET image_url = '/products/trigger-wheel-36-1.png'  WHERE id = 'trigger-wheel-36-1';
UPDATE products SET image_url = '/products/gm-pigtail-pack.png'     WHERE id = 'gm-pigtail-pack';
