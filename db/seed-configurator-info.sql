-- Seed configurator help text into the config table.
-- Re-run this to reset to defaults; the admin panel can override individual values.
-- Structure: { [stepField]: { stepInfo, docUrl?, options: { [value]: { info, forMe } } } }

INSERT OR REPLACE INTO config (key, value) VALUES (
  'configurator_info',
  '{
    "boardFamily": {
      "stepInfo": "This is the physical Speeduino board you will build or buy. The version determines the connector style and what expansion hardware is directly compatible. Everything else in this configurator depends on whichever board you choose here.",
      "docUrl": "https://wiki.speeduino.com/en/boards",
      "options": {
        "v0.3": {
          "info": "Uses individual screw terminals — each wire plugs in independently, no special connectors or crimping tools needed.",
          "forMe": "Go with v0.3 if you are building your first Speeduino, prototyping, or want the freedom to change wiring easily at any time."
        },
        "v0.4": {
          "info": "Uses an IDC40 ribbon connector for a neater harness and includes a PCB footprint for a DRV8825 stepper idle driver.",
          "forMe": "Choose v0.4 if you want a cleaner, case-friendly install or if you plan to run a 4-wire stepper idle valve. Better suited to a permanent build."
        }
      }
    },
    "crankSignal": {
      "stepInfo": "Your crank position sensor tells Speeduino exactly where the engine is in its rotation cycle. The sensor type determines whether you can wire it directly or need an extra module to condition the signal first.",
      "docUrl": "https://wiki.speeduino.com/en/configuration/Trigger_Patterns",
      "options": {
        "hall_5v": {
          "info": "Outputs a clean 5V square-wave signal and has 3 wires: ground, 5V power, and signal.",
          "forMe": "Most engines from the mid-1990s onward use Hall sensors. If your crank sensor has 3 wires, this is almost certainly your type. No extra hardware needed."
        },
        "vr": {
          "info": "Generates an AC sine-wave from a toothed wheel and has only 2 wires — no power supply.",
          "forMe": "Common on older engines (Ford EDIS, GM TBI, most pre-1995 vehicles). If your sensor has just 2 wires, you likely have a VR sensor and will need a conditioner module."
        }
      }
    },
    "camSignal": {
      "stepInfo": "A cam signal lets Speeduino identify which cylinder is on its compression stroke, enabling true sequential injection and ignition. Without it the ECU still works but uses batch-fire injection and wasted-spark ignition instead.",
      "docUrl": "https://wiki.speeduino.com/en/configuration/Trigger_Patterns",
      "options": {
        "none": {
          "info": "No cam sensor — Speeduino runs wasted-spark ignition and batch-fire injection only.",
          "forMe": "Fine for most builds. Skip the cam sensor unless you specifically need sequential injection, for example on a high-performance build where idle quality and throttle response matter most."
        },
        "hall_5v": {
          "info": "A Hall effect cam sensor with 3 wires that provides a once-per-revolution reference pulse.",
          "forMe": "Use this if your engine already has a 3-wire cam sensor and you want full sequential injection and ignition. Required for sequential mode."
        },
        "vr": {
          "info": "A 2-wire Variable Reluctance cam sensor that produces an AC signal and needs a conditioner module.",
          "forMe": "Less common on cam sensors but present on some older platforms. If the cam sensor on your engine has 2 wires and no power feed, it is a VR type."
        }
      }
    },
    "o2": {
      "stepInfo": "An O2 sensor measures exhaust gases so Speeduino can automatically correct fuelling in real time. Without one, the ECU runs open-loop and cannot self-correct for temperature changes, fuel variation, or engine wear.",
      "docUrl": "https://wiki.speeduino.com/en/configuration/Lambda",
      "options": {
        "none": {
          "info": "No O2 feedback — Speeduino runs fully open-loop and delivers fuel based on the map only.",
          "forMe": "Acceptable for a race car with a carefully tuned map, or as a temporary setup. Not recommended for road use as fuelling will not adapt to real-world conditions."
        },
        "narrowband": {
          "info": "The standard OEM sensor found on most stock vehicles — outputs a simple rich/lean toggle signal.",
          "forMe": "Works for daily-driven cars at cruise. Cannot support proper tuning because it only says rich or lean, not by how much. Upgrade to wideband if you plan to tune the engine."
        },
        "wideband": {
          "info": "Measures the exact air/fuel ratio across the full range via a wideband controller (e.g. AEM, Innovate).",
          "forMe": "Strongly recommended for anyone who wants to tune their engine. Gives you the precise AFR at every operating point so you can correct fuelling accurately."
        }
      }
    },
    "idleControl": {
      "stepInfo": "Idle control hardware lets Speeduino adjust idle speed automatically for cold starts, air conditioning, and idle stabilisation. If your engine has no idle valve, or you are happy setting idle with a screw, you can skip this.",
      "docUrl": "https://wiki.speeduino.com/en/configuration/Idle",
      "options": {
        "none": {
          "info": "No electronic idle valve — idle is set manually with a throttle stop screw.",
          "forMe": "Fine for carb-replacement builds or engines that never had an idle valve. Idle will be fixed and will not compensate automatically for cold temperatures or electrical loads."
        },
        "pwm_2wire": {
          "info": "A 2-wire solenoid that Speeduino controls by pulsing 12V on and off at varying duty cycles.",
          "forMe": "Common on many older Bosch-type and domestic V8 engines. If your idle valve has exactly 2 wires, this is your type."
        },
        "pwm_3wire": {
          "info": "A 3-wire valve with a dedicated ground, 12V power, and a separate PWM control signal.",
          "forMe": "Common on many Japanese and European engines from the 1990s and 2000s. If 3 wires go directly to your idle valve, this is your type."
        },
        "stepper_4wire": {
          "info": "A stepper motor that moves in precise steps via 4 wires — requires a DRV8825 driver module.",
          "forMe": "Used on many Ford, GM, and Chrysler engines. The v0.4 board has a built-in socket for the driver. On v0.3 you will need to wire the driver externally."
        }
      }
    },
    "boostControl": {
      "stepInfo": "Electronic boost control lets Speeduino actively manage your turbo wastegate pressure, giving you map-based boost targets that can vary with RPM and load. Only relevant if you have a turbocharged engine.",
      "docUrl": "https://wiki.speeduino.com/en/configuration/Boost_Control",
      "options": {
        "no": {
          "info": "No electronic boost control — boost pressure is fixed by a manual valve or there is no turbo.",
          "forMe": "Choose this if your engine is naturally aspirated, or if you run a manual boost controller and do not need Speeduino to actively manage boost levels."
        },
        "yes": {
          "info": "Speeduino pulses a 3-port solenoid valve to control wastegate pressure based on RPM and load maps.",
          "forMe": "Choose this if you have a turbocharged engine and want variable boost — for example lower boost at low RPM for reliability and full boost at the top end."
        }
      }
    },
    "flexFuel": {
      "stepInfo": "A flex fuel sensor measures the ethanol percentage in your fuel so Speeduino can adapt fuelling and ignition timing automatically when the ethanol content varies between fill-ups.",
      "docUrl": "https://wiki.speeduino.com/en/configuration/Flex_Fuel",
      "options": {
        "no": {
          "info": "No flex fuel sensor — the tune is written for one fixed fuel type.",
          "forMe": "The right choice for the vast majority of builds. Choose this unless you specifically plan to run varying ethanol blends such as mixing E85 with standard pump petrol."
        },
        "yes": {
          "info": "The GM/Continental frequency sensor reads ethanol content continuously so the ECU can adjust on the fly.",
          "forMe": "Use this if you plan to fill up at pumps with varying ethanol content or deliberately blend E85 and petrol depending on what is available."
        }
      }
    },
    "injectors": {
      "stepInfo": "Fuel injector impedance determines how much current they draw when open. This matters because Speeduino has built-in drivers sized for high-impedance injectors. Low-impedance ones need an extra current-limiting component.",
      "docUrl": "https://wiki.speeduino.com/en/hardware/injectors",
      "options": {
        "highZ": {
          "info": "High-impedance injectors (above 8 ohms) naturally limit current draw and are driven directly by Speeduino.",
          "forMe": "Most vehicles from the mid-1990s onward use high-impedance injectors, as do virtually all modern aftermarket units (Bosch EV14, Siemens Deka, etc.). No extra hardware needed."
        },
        "lowZ": {
          "info": "Low-impedance injectors (under 5 ohms) draw too much current for Speeduino and need a ballast resistor pack in series.",
          "forMe": "Typically found on 1980s to early 1990s vehicles. Not sure? Measure resistance across the two injector pins with a multimeter: under 5 ohms means you need the ballast pack."
        }
      }
    },
    "ignitionHardware": {
      "stepInfo": "This tells Speeduino what kind of ignition coils you are using. Smart coils have their own internal switching circuit; dumb coils need an external driver module to fire them.",
      "docUrl": "https://wiki.speeduino.com/en/configuration/Ignition_hardware",
      "options": {
        "smart_coils": {
          "info": "Smart coils have a built-in igniter and accept a direct 5V logic signal from Speeduino.",
          "forMe": "Most modern coil-on-plug coils are smart coils — VW/Audi, Toyota, and the majority of COP coils from the late 1990s onward. If you are sourcing new coils, smart is the simplest option."
        },
        "dumb_coils_need_driver": {
          "info": "Dumb coils have no internal driver and require a separate high-current ignition module to switch them.",
          "forMe": "Used on older coil packs, distributor coils, and many early 1990s engines. If you are reusing original coils from an older vehicle, you most likely need a driver module."
        }
      }
    }
  }'
);
