export interface BlogReference {
  label: string;
  url: string;
  type: "wiki" | "forum" | "tool";
}

export interface BlogPost {
  slug: string;
  title: string;
  intro: string;
  outline: string[];
  category: string;
  readTime: string;
  date: string;
  author: string;
  metaTitle: string;
  metaDescription: string;
  content: BlogSection[];
  references?: BlogReference[];
}

export interface BlogSection {
  heading: string;
  body: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "first-steps-with-speeduino",
    title: "Your First Speeduino Build: Complete Setup Guide",
    intro: "Everything you need to start your first Speeduino project — from hardware selection and software downloads through firmware flashing, TunerStudio configuration, and sensor calibration. Follow this before anything else.",
    outline: ["What is Speeduino?", "Choosing your board", "Software to download", "Flashing the firmware", "TunerStudio setup", "Engine constants and sensor calibration"],
    category: "Getting Started",
    readTime: "12 min",
    date: "2025-03-10",
    author: "Wrench over Wallet",
    metaTitle: "First Speeduino Build: Complete Setup Guide | Wrench over Wallet",
    metaDescription: "Step-by-step guide to your first Speeduino build. Board selection, SpeedyLoader firmware flashing, TunerStudio setup, engine constants, and sensor calibration — all from the official documentation.",
    content: [
      {
        heading: "What is Speeduino?",
        body: "Speeduino is an open-source engine management system (EMS) based on the Arduino Mega 2560 microcontroller, or the Teensy 3.5 for newer board variants like the Dropbear. Unlike commercial ECUs, the complete hardware designs, firmware source code, and tuning software are freely available — you can inspect, modify, and extend the system yourself without license fees or manufacturer restrictions.\n\nSpeeduino supports a wide range of engine configurations: 1–8 cylinders, 2-stroke and 4-stroke engines, naturally aspirated and forced induction. Fuelling strategies include speed-density (MAP-based) and alpha-N (TPS-based). The firmware handles sequential or batch injection, wasted-spark or sequential ignition, closed-loop boost control, VVT, flex fuel, knock sensing, and much more.\n\nFor European builders, Speeduino offers a practical path to standalone engine management at a fraction of the cost of commercial alternatives. DIY kits start from €149 including VAT, versus €800–2,500 and above for entry-level commercial ECUs."
      },
      {
        heading: "Choosing Your Board",
        body: "Speeduino hardware comes in several official variants:\n\n**v0.3** — The original reference design. Larger footprint with screw-terminal connections, making it clear and accessible for first-time builders. Has an IC3 socket for an optional VR conditioner module when using variable-reluctance crank sensors. Well-documented with the widest community experience.\n\n**v0.4** — A more compact design using a single 40-pin IDC connector for all I/O (excluding the 12V power input). Lower cost, smaller physical size. Like the v0.3, it runs on the Arduino Mega 2560. Note: the v0.4 is NOT a direct replacement for the v0.3 — both are designed with different goals. The v0.4 is better suited to builds where the IDC40 connector approach works well with your harness.\n\n**Dropbear** — The most advanced official board, based on the Teensy 3.5 microcontroller. Faster processor, built-in CAN bus support, and expanded I/O. Recommended for advanced builds requiring CAN bus communication or higher processing demands.\n\n**PNP (Plug-and-Play)** — Drop-in replacements designed to fit specific OEM ECU connectors. The official PNP board covers the Mazda Miata/MX5 NA (1989–1995).\n\n**3rd-party boards** — Many community-designed compatible boards exist with varying features and form factors. Check the [Speeduino wiki 3rd-party section](https://wiki.speeduino.com/en/3rd_party) for evaluated options.\n\nFor most first-time builds, the **v0.4** is the recommended starting point due to its compact size, cost, and broad documentation."
      },
      {
        heading: "What Else You Need",
        body: "Beyond the Speeduino PCB, your build requires:\n\n**Arduino Mega 2560 (v0.3 and v0.4 builds)** — Use a board with the ATMega16U2 USB serial chip rather than the cheaper CH340G clone. The 16U2 works without driver installation on Windows 7+ and macOS, and is more reliable for firmware uploads.\n\n**Crank position sensor** — Usually the OEM sensor. Hall effect and optical sensors output a clean 0–5V square wave and connect directly. VR (variable reluctance) sensors output a sine wave and require a VR conditioner module (there is an IC3 socket on both v0.3 and v0.4 for this purpose). Supported missing-tooth patterns include 4-1, 12-1, 36-1, and 60-2, among others.\n\n**MAP sensor** — The MPX4250 (0–250 kPa, up to approximately 1.5 bar boost) is the standard on-board MAP sensor integrated into both the v0.3 and v0.4 PCB designs. For higher-boost applications, external 2-bar, 3-bar, or 4-bar sensors can be connected to the MAP input pin — any 0–5V linear sensor is compatible.\n\n**Temperature sensors** — GM-style NTC thermistors with a 1/8\" NPT thread are the standard choice for coolant temperature (CLT) and intake air temperature (IAT). The standard Speeduino build uses a 2490 ohm bias resistor (R3) for these sensors.\n\n**Wideband O2 controller** — Required for tuning. Speeduino reads a 0–5V analog input from an external wideband controller; it **cannot** interface directly with a raw wideband sensor element. The Bosch LSU 4.9 sensor with a Spartan-type or equivalent controller is the most common setup.\n\n**Injectors** — Speeduino drives high-impedance (High-Z / saturated) injectors directly — typically above 8 ohms resistance. Low-impedance (peak-and-hold) injectors require series ballast resistors to limit current and protect the board.\n\n**Ignition** — Speeduino outputs low-level logic signals only. You must use smart coils (with integrated drivers) or an external igniter/IGBT module between Speeduino and the ignition coil. Connecting Speeduino ignition outputs directly to a passive (dumb) coil will damage the Arduino."
      },
      {
        heading: "Software to Download",
        body: "You need two applications before you can use Speeduino:\n\n**SpeedyLoader** — The recommended firmware installer. It downloads and flashes the latest stable Speeduino firmware to your Arduino Mega via USB, without requiring you to compile any code. It also downloads the INI definition file and a base tune that you will use in TunerStudio. Download from the [SpeedyLoader GitHub releases page](https://github.com/speeduino/SpeedyLoader/releases/latest):\n- Windows 64-bit: SpeedyLoader-x64.exe\n- Windows 32-bit: SpeedyLoader-ia32.exe\n- Mac: SpeedyLoader.dmg\n- Linux: SpeedyLoader.AppImage (mark as executable after downloading)\n- Raspberry Pi: SpeedyLoader-armv7l.AppImage\n\n**TunerStudio MS** — The tuning interface for Speeduino. All configuration, sensor calibration, fuel and ignition table editing, data logging, and autotune is done in TunerStudio. Download from [tunerstudio.com](https://www.tunerstudio.com/index.php/tuner-studio). The free version is fully functional for most tasks. The minimum required version is 3.0.7 — always use the latest available.\n\n**Optional: Arduino IDE** — Only needed if you intend to compile the firmware from source code or make custom code modifications. For the vast majority of builders, SpeedyLoader makes the Arduino IDE unnecessary."
      },
      {
        heading: "Step 1: Flash the Firmware with SpeedyLoader",
        body: "Complete this step before wiring anything to your vehicle:\n\n1. Plug your Arduino Mega into your computer via USB\n2. Open SpeedyLoader and wait for it to detect connected boards\n3. Select the latest stable firmware release from the dropdown list\n4. Click **Install** — SpeedyLoader downloads the firmware, INI definition file, and base tune, then flashes the board automatically\n5. When complete, verify the flash: open a serial terminal (the Arduino IDE Serial Monitor works) at **115200 baud**, type a capital S, and press Enter. The board should respond with the firmware version, for example: \"Speeduino 2024.03\"\n\nWindows note: if your Arduino Mega has a CH340G USB chip (identifiable by a rectangular IC near the USB port), you may need to install the WCH CH341 driver from the manufacturer's website before Windows recognises the board. ATMega16U2-based boards work without additional drivers.\n\nKeep the INI definition file and base tune that SpeedyLoader downloads — you will need both when creating your TunerStudio project. Never mix a firmware version with an INI file from a different version, as this causes communication errors and settings that do not make sense."
      },
      {
        heading: "Step 2: Set Up TunerStudio",
        body: "With firmware loaded on the board:\n\n1. Open TunerStudio and select **Create New Project**\n2. Enter a project name and choose a storage directory\n3. When prompted for the firmware definition file, click **Other / Browse** and select the **speeduino.ini** file that SpeedyLoader downloaded\n4. In the comms settings, select your serial/COM port and set the baud rate to **115200**\n5. Use **Test Port** or **Detect** (requires TunerStudio 3.0.60 or later) to confirm communication\n6. Once the project opens, load the base tune: **File → Load Tune (msq)** and select the base tune file SpeedyLoader downloaded. This ensures all parameters start at safe, sane values rather than zeros\n\nTunerStudio should now show a live dashboard. Most sensor readings will be incorrect at this stage — that is expected. Sensor calibration is the next step.\n\n**Important:** Every time you update the firmware, you must reload the matching INI file in your TunerStudio project via File → Project Properties. A mismatch between firmware version and INI file causes garbled data and incorrect settings."
      },
      {
        heading: "Step 3: Configure Engine Constants",
        body: "In TunerStudio, open **Settings → Constants** and fill in your engine's fundamental parameters:\n\n**Engine stroke:** 4-stroke or 2-stroke\n**Number of cylinders:** 1–8 (select 4 for rotary/Wankel engines)\n**Engine displacement:** total capacity in cc\n**Number of injectors:** typically matches cylinder count for port injection\n**Injector staging:** Alternating is recommended for most builds\n**Control algorithm:** Speed Density (MAP-based) is the standard starting point for most engines\n**Board layout:** Select your board variant (v0.3 or v0.4) so internal pin assignments match your hardware\n\nAfter entering these values, use the **Required Fuel calculator** at the top of the constants dialog. This calculates the theoretical base injection time at 100% VE and is the foundation of your entire fuel table — get it right before proceeding.\n\nFor **trigger configuration**, navigate to **Settings → Trigger Settings** and specify your crank trigger wheel pattern (e.g., 36-1, 60-2) and sensor type (Hall/optical or VR). Selecting the wrong trigger pattern is one of the most common reasons an engine cranks but fails to start. Refer to the [Trigger Patterns and Decoders wiki page](https://wiki.speeduino.com/en/decoders) for every supported pattern and its configuration."
      },
      {
        heading: "Step 4: Calibrate Your Sensors",
        body: "Sensor calibration is done via the **Tools** menu in TunerStudio and must be completed before attempting to start the engine. Incorrect calibration means every fuel and timing decision the ECU makes will be based on wrong data.\n\n**MAP sensor (Tools → Calibrate Pressure Sensors):** Select your sensor from the dropdown. The standard on-board MPX4250 is listed as 'MPX4250AP'. With the engine off, the MAP reading should show approximately 100 kPa (atmospheric pressure at sea level). Click **Burn** to save to the ECU.\n\n**Temperature sensors (Tools → Calibrate Thermistor Tables):** Select Coolant Temperature Sensor, then choose your sensor from the Common Sensor Values list. The standard Speeduino build uses a 2490 ohm bias resistor — GM-style sensors are calibrated for this value. Repeat for the Intake Air Temperature sensor. After calibration, both CLT and IAT should read close to ambient temperature when the engine is cold.\n\n**TPS (Tools → Calibrate TPS):** With the throttle closed, click **Get Current** for the closed throttle field. Open the throttle fully and click **Get Current** for the wide-open throttle field. The TPS must read 0% at idle and 100% at WOT for acceleration enrichment and all load-based tables to function correctly.\n\n**Wideband O2 (Tools → Calibrate AFR Sensor):** Select your wideband controller from the list, or select **Custom Linear WB** and enter the voltage-to-AFR mapping from your controller's manual. Most Spartan-type controllers use 0V = 7.35 AFR and 5V = 22.39 AFR as their default output calibration."
      },
      {
        heading: "What to Do Next",
        body: "With firmware flashed, TunerStudio connected, engine constants configured, and sensors calibrated, you are ready to move on to wiring — the most time-consuming part of any ECU installation. Work through these in order:\n\n**Wiring** — Follow the official wiring overview carefully. Star grounding, shielded sensor cables, and routing signal wires well away from ignition coils and spark plug leads are essential for a noise-free install. Read our Wiring Basics guide for the fundamentals.\n\n**First start preparation** — Before turning the key, go through the complete pre-start checklist: verify all sensor readings in TunerStudio, prime and inspect the fuel system for leaks, and load a conservative base ignition timing. See our First Start Checklist guide.\n\n**Tuning** — After first start, use your wideband O2 sensor and TunerStudio's autotune feature to rough in the VE table across normal driving conditions, then refine manually. Read our Base Maps guide before beginning any tuning.\n\nThe Speeduino community is active and genuinely helpful. For build-specific questions, search or post in the [official Speeduino forum](https://speeduino.com/forum/). For real-time help, the [Speeduino Discord](https://discord.gg/YWCEexaNDe) is very responsive."
      },
    ],
    references: [
      { label: "Getting Started — Official Wiki", url: "https://wiki.speeduino.com/en/Getting_Started", type: "wiki" },
      { label: "Hardware Requirements — Official Wiki", url: "https://wiki.speeduino.com/en/Hardware_requirements", type: "wiki" },
      { label: "Installing Firmware — Official Wiki", url: "https://wiki.speeduino.com/en/Installing_Firmware", type: "wiki" },
      { label: "Connecting to TunerStudio — Official Wiki", url: "https://wiki.speeduino.com/en/Connecting_to_TunerStudio", type: "wiki" },
      { label: "Engine Constants — Official Wiki", url: "https://wiki.speeduino.com/en/configuration/Engine_Constants", type: "wiki" },
      { label: "Sensor Calibration — Official Wiki", url: "https://wiki.speeduino.com/en/configuration/Sensor_Calibration", type: "wiki" },
      { label: "Trigger Patterns and Decoders — Official Wiki", url: "https://wiki.speeduino.com/en/decoders", type: "wiki" },
      { label: "SpeedyLoader — Firmware Installer (GitHub)", url: "https://github.com/speeduino/SpeedyLoader", type: "tool" },
      { label: "TunerStudio MS — Tuning Software", url: "https://www.tunerstudio.com/index.php/tuner-studio", type: "tool" },
      { label: "Forum: New to Speeduino — First Build Experience", url: "https://speeduino.com/forum/viewtopic.php?t=2651", type: "forum" },
    ],
  },
  {
    slug: "speeduino-in-europe",
    title: "Speeduino in Europe: What to Buy and How to Start",
    intro: "A practical guide for European enthusiasts looking to start with Speeduino. We cover what to order, where to source parts, and how EU shipping and VAT work for aftermarket ECU components.",
    outline: ["Why Speeduino is gaining traction in Europe", "What you need to order", "EU-friendly sourcing", "VAT and shipping", "Your first weekend"],
    category: "Getting Started",
    readTime: "8 min",
    date: "2025-01-15",
    author: "Wrench over Wallet",
    metaTitle: "Speeduino in Europe — Buying Guide & Getting Started | Wrench over Wallet",
    metaDescription: "Complete guide to buying and starting with Speeduino in Europe. EU shipping, VAT, sourcing sensors, and your first steps with open-source engine management.",
    content: [
      {
        heading: "Why Speeduino Is Gaining Traction in Europe",
        body: "The European automotive enthusiast community has traditionally relied on established commercial ECUs like Link, Haltech, MaxxECU, and ECUMaster. These are excellent products — but they come with significant cost. A typical standalone ECU setup can easily reach €1,500–3,000 before wiring and sensors.\n\nSpeeduino offers a different approach. As an open-source engine management system, it delivers core functionality — fuel injection, ignition control, boost management, data logging — at a fraction of the cost. With complete DIY kits starting from €149 (inc. VAT, shipped from the EU), it's accessible to hobbyists, students, and project car builders who might otherwise be priced out of standalone engine management.\n\nThe European Speeduino community has grown steadily, with builds spanning everything from Volvo 5-cylinders to BMW straight-sixes and classic VW air-cooled engines."
      },
      {
        heading: "What You Need to Order",
        body: "A complete Speeduino setup consists of several components:\n\n**The board** — a Speeduino PCB (v0.3 or v0.4) plus an Arduino Mega 2560. We sell both as DIY kits — you solder the board yourself. The v0.4 is more compact and uses a single IDC40 connector for all wiring. Advanced builders can also consider the Dropbear (Teensy-based, with CAN bus) for more demanding applications.\n\n**Wiring** — you build your own wiring from scratch. A relay pack, the correct board connector (IDC40 for v0.4), and good crimping tools are essential.\n\n**Core sensors** — MAP (manifold absolute pressure), IAT (intake air temperature), CLT (coolant temperature), and a wideband O2 controller for tuning. Some of these may already be on your engine. The MPX4250 MAP sensor is integrated on both v0.3 and v0.4 boards for naturally aspirated and mild-boost applications. We stock all sensors individually.\n\n**Optional extras** — boost control solenoid (for turbo builds), idle air control valve, knock sensor, flex fuel sensor for E85 builds, VR conditioner if your crank sensor is a variable-reluctance type."
      },
      {
        heading: "EU-Friendly Sourcing for Sensors and Components",
        body: "One of the advantages of ordering from Speeduino.eu is that all shipments originate within the EU. This means:\n\n- No customs duties or import fees\n- Fast shipping (typically 3–7 business days)\n- VAT is included in all displayed prices\n- Easy returns under EU consumer protection law\n\nFor sensors and connectors not included in our kits, we recommend sourcing from established EU-based automotive parts suppliers. GM-style sensors (widely used with Speeduino) are available from most well-stocked European auto parts retailers."
      },
      {
        heading: "VAT and Shipping Considerations",
        body: "All prices on Speeduino.eu include VAT for EU customers. For B2B purchases with a valid VAT ID, contact us for VAT-exempt pricing.\n\nShipping is free on orders over €250. Standard shipping within the EU typically takes 3–7 business days. Express shipping options are available at checkout.\n\nAll prices are displayed in EUR and include VAT for EU customers."
      },
      {
        heading: "Your First Weekend with Speeduino",
        body: "Once your kit arrives, here's a realistic timeline for getting started:\n\n**Day 1: Unbox and set up software** — Check all components against the included packing list. Download **SpeedyLoader** and flash the latest Speeduino firmware to your Arduino Mega via USB. Then download **TunerStudio MS**, create a new project using the INI file SpeedyLoader downloaded, and verify the board communicates correctly at 115200 baud. These are two separate steps — firmware flashing happens first, then TunerStudio for configuration.\n\n**Day 1–2: Wiring** — This is where most of the time goes. Follow the wiring guide carefully, paying special attention to grounding strategy (see our Wiring Basics guide). Don't rush this step.\n\n**Day 2: Configuration** — Load a base map for your engine type, configure sensor calibrations via the TunerStudio Tools menu, and verify all inputs read correctly before starting the engine.\n\nA realistic first-start target is the second weekend, assuming clean wiring and a cooperative engine."
      },
    ],
    references: [
      { label: "Getting Started — Official Wiki", url: "https://wiki.speeduino.com/en/Getting_Started", type: "wiki" },
      { label: "Installing Firmware — Official Wiki", url: "https://wiki.speeduino.com/en/Installing_Firmware", type: "wiki" },
      { label: "Hardware Requirements — Official Wiki", url: "https://wiki.speeduino.com/en/Hardware_requirements", type: "wiki" },
      { label: "SpeedyLoader — Firmware Installer (GitHub)", url: "https://github.com/speeduino/SpeedyLoader", type: "tool" },
      { label: "TunerStudio MS — Tuning Software", url: "https://www.tunerstudio.com/index.php/tuner-studio", type: "tool" },
      { label: "Forum: New to Speeduino — First Build Experience", url: "https://speeduino.com/forum/viewtopic.php?t=2651", type: "forum" },
    ],
  },
  {
    slug: "aftermarket-ecu-comparison",
    title: "Aftermarket ECU Comparison: What Actually Matters",
    intro: "Not all ECU comparisons are created equal. We break down the dimensions that actually affect your build — cost, flexibility, community support, and real-world usability — without the marketing hype.",
    outline: ["Dimensions that matter", "Open vs closed source", "Total cost of ownership", "Community resources", "Matching ECU to goals"],
    category: "Comparisons",
    readTime: "10 min",
    date: "2025-01-10",
    author: "Wrench over Wallet",
    metaTitle: "Aftermarket ECU Comparison — What Actually Matters | Wrench over Wallet",
    metaDescription: "Honest comparison of aftermarket ECUs: Speeduino, Megasquirt, Link, Haltech, MaxxECU. Focus on cost, flexibility, community, and real-world usability.",
    content: [
      {
        heading: "The Dimensions That Actually Matter",
        body: "When comparing standalone ECUs, marketing material tends to focus on peak specifications — maximum RPM capability, number of I/O pins, or processor speed. While these aren't irrelevant, they're rarely the deciding factor for most builds.\n\nThe dimensions that actually affect your experience are:\n\n- **Total cost** — ECU + harness + sensors + tuning software + ongoing support\n- **Flexibility** — Can you modify, extend, or troubleshoot the system yourself?\n- **Community** — Are there people running your engine/vehicle combination who can help?\n- **Learning curve** — How long until you're productive with the tuning software?\n- **Documentation** — Is there comprehensive, accessible documentation?"
      },
      {
        heading: "Open-Source vs Closed-Source: Practical Implications",
        body: "This isn't an ideological argument — it's practical. With an open-source ECU like Speeduino:\n\n- You can inspect, modify, and compile the firmware yourself\n- The community can fix bugs and add features without waiting for a manufacturer's update cycle\n- If the manufacturer disappears, the project continues\n- Tuning software (TunerStudio) has no license fee for the base version\n\nWith a closed-source ECU, you get:\n\n- Professional-grade support with warranty coverage\n- Certified and validated firmware releases\n- Potentially more polished software experience\n- Manufacturer accountability\n\nNeither approach is universally better. The right choice depends on your priorities and technical comfort level."
      },
      {
        heading: "Total Cost of Ownership",
        body: "Looking at just the ECU purchase price is misleading. Here's a more realistic comparison for a typical 4-cylinder turbo build:\n\n| Component | Speeduino (DIY) | Mid-range Commercial | Premium Commercial |\n|-----------|-----------|---------------------|-------------------|\n| ECU board + Arduino | ~€198 | €800–1,200 | €1,500–2,500 |\n| Wiring + connectors | €30–80 | €200–400 | €300–600 |\n| Sensors + wideband | €200–350 | €150–300 | €200–400 |\n| Software | Free | €0–200 | €0–300 |\n| **Total** | **~€500–700** | **~€1,350–2,100** | **~€2,000–3,800** |\n\nSpeeduino doesn't compete with premium ECUs on every feature. But for many builds, it offers excellent value with genuine capability."
      },
      {
        heading: "Community and Learning Resources",
        body: "The Speeduino community is one of its strongest assets. The official forum, Discord server, and various national communities provide peer support that's remarkably responsive.\n\nFor commercial ECUs, support typically means email tickets or phone calls to the manufacturer — professional, but sometimes slow and impersonal.\n\nSpeeduino's community-driven approach means you can often find someone who has already solved your specific problem on your specific engine. That's powerful."
      },
      {
        heading: "Matching the ECU to Your Goals",
        body: "Here's our honest assessment:\n\n**Choose Speeduino if:** You're budget-conscious, enjoy learning, have a common engine configuration, and want the flexibility to modify your setup over time.\n\n**Choose a commercial ECU if:** You need manufacturer support and warranty, have a professional racing application with certification requirements, or simply prefer a turnkey solution.\n\n**Consider both if:** You want to learn on Speeduino before potentially upgrading to a commercial ECU later — the tuning concepts transfer directly.\n\n*Disclaimer: Features and capabilities vary by configuration, firmware version, and hardware variant. Always verify compatibility for your specific application.*"
      },
    ],
    references: [
      { label: "Speeduino Wiki — Full Manual", url: "https://wiki.speeduino.com", type: "wiki" },
      { label: "Hardware Requirements — Official Wiki", url: "https://wiki.speeduino.com/en/Hardware_requirements", type: "wiki" },
      { label: "Speeduino Community Forum", url: "https://speeduino.com/forum/", type: "forum" },
    ],
  },
  {
    slug: "wiring-basics",
    title: "Wiring Basics: Grounds, Shielding, and Noise",
    intro: "Poor wiring causes more aftermarket ECU problems than anything else. Learn the fundamentals of engine bay wiring — grounding strategy, shielded cables, and keeping electrical noise away from your sensors.",
    outline: ["Why wiring matters", "Star grounding", "Shielding sensor wires", "Separating circuits", "Common mistakes"],
    category: "Guides",
    readTime: "7 min",
    date: "2025-01-05",
    author: "Wrench over Wallet",
    metaTitle: "Wiring Basics for Aftermarket ECU: Grounds, Shielding, Noise | Wrench over Wallet",
    metaDescription: "Essential wiring guide for Speeduino and aftermarket ECU installations. Star grounding, shielded cables, noise isolation, and common wiring mistakes to avoid.",
    content: [
      {
        heading: "Why Wiring Matters More Than You Think",
        body: "We see it constantly: builders spend weeks researching which ECU to buy, then rush through the wiring in a weekend. The result is almost always problems — erratic sensor readings, misfires, phantom errors, and frustrating debugging sessions.\n\nGood wiring is the foundation of a reliable engine management system. It's not glamorous, but it's the single most impactful investment of your time during an ECU install.\n\nAccording to forum experience across hundreds of builds, the majority of first-start and ongoing reliability problems trace back to wiring, not hardware or software issues. Get this right and everything else becomes much easier."
      },
      {
        heading: "Star Grounding Explained",
        body: "Star grounding means running individual ground wires from each sensor and actuator back to a single, central grounding point — rather than daisy-chaining grounds or using the engine block as a shared ground path.\n\nWhy? Because current flowing through a shared ground wire creates small voltage differences. Your ECU measures sensor voltages relative to its ground reference. If that reference is corrupted by noise from other circuits, your sensor readings become unreliable.\n\n**Best practice:** Run all sensor grounds to a dedicated ground point on the ECU connector. Run power grounds (injectors, coils, relays) to a separate dedicated ground point on the engine block. Never mix signal grounds with power grounds.\n\nThis is not optional — poor grounding is the most common source of noise-related issues in Speeduino builds. If your crank signal is erratic and you've checked everything else, check your grounds first."
      },
      {
        heading: "Shielding Sensor Wires",
        body: "Sensor wires carry small analog signals — often just millivolts. These are vulnerable to electromagnetic interference (EMI) from ignition coils, alternators, and other high-current devices in the engine bay.\n\nShielded cable has a braided or foil shield around the signal conductors. This shield should be connected to ground at **one end only** (typically the ECU end) to drain interference without creating ground loops. An ungrounded shield provides no protection at all.\n\nSensors that benefit most from shielded wiring: crank position sensor, cam position sensor, knock sensor, and wideband O2 signal.\n\nFor the crank sensor specifically: route the shielded cable away from ignition coils and spark plug leads whenever possible. If wiring must pass near these sources, cross at 90 degrees rather than running parallel. The Speeduino wiki recommends taking extra precautions for the crank and cam sensor wiring given how critical a clean trigger signal is for correct ignition timing."
      },
      {
        heading: "Separating Power and Signal Circuits",
        body: "Route your wiring harness with clear separation between:\n\n1. **High-current power wires** — injectors, ignition coils, fuel pump relay\n2. **Low-current signal wires** — sensor signals, ECU communication\n3. **High-voltage wires** — spark plug leads (keep maximum distance)\n\nNever bundle sensor wires alongside injector or coil driver wires. If they must cross, do so at 90 degrees to minimize coupling.\n\nUse suppressor-core spark plug wires (not solid-core) and resistor-type spark plugs to reduce ignition noise at the source. These are small costs that make a significant difference in signal quality."
      },
      {
        heading: "Common Mistakes and How to Test Your Harness",
        body: "**Mistake 1:** Using crimp connectors without proper crimping tools. A poor crimp is worse than a soldered joint — it creates intermittent connections that are nearly impossible to diagnose.\n\n**Mistake 2:** Not heat-shrinking or protecting connections in the engine bay. Heat, vibration, and moisture will find every weak point over time.\n\n**Mistake 3:** Running the harness too close to exhaust components. Heat degrades wire insulation over time, and flexible insulation that works initially may crack and fail after months of heat cycling.\n\n**Mistake 4:** Leaving shield drains unconnected. An ungrounded shield offers zero noise protection — connect it to signal ground at the ECU end.\n\n**Testing:** Before first start, verify every connection with a multimeter. Check continuity on every wire, measure resistance on all sensor circuits, and verify there are no shorts to ground or to 12V. This takes an hour and can save you days of debugging."
      },
    ],
    references: [
      { label: "Hardware Requirements (Wiring Section) — Official Wiki", url: "https://wiki.speeduino.com/en/Hardware_requirements", type: "wiki" },
      { label: "Forum: Electrical Noise — Causes and Solutions", url: "https://speeduino.com/forum/viewtopic.php?t=2971", type: "forum" },
      { label: "Forum: Strange Issues with Crank Signal", url: "https://speeduino.com/forum/viewtopic.php?t=2428", type: "forum" },
    ],
  },
  {
    slug: "turbo-control-basics",
    title: "Turbo Control Basics with an Aftermarket ECU",
    intro: "Boost control is one of the most rewarding features of a standalone ECU. Here's how it works on Speeduino — from solenoid wiring to open-loop and closed-loop PID tuning.",
    outline: ["How boost control works", "Open vs closed loop", "Solenoid wiring", "TunerStudio setup", "Safety features"],
    category: "Guides",
    readTime: "9 min",
    date: "2024-12-20",
    author: "Wrench over Wallet",
    metaTitle: "Turbo Boost Control Basics with Speeduino ECU | Wrench over Wallet",
    metaDescription: "Learn how to set up electronic boost control with Speeduino. Solenoid selection, wiring, open/closed loop control, Simple and Full PID modes, and overboost protection explained.",
    content: [
      {
        heading: "How Electronic Boost Control Works",
        body: "Electronic boost control replaces the mechanical wastegate actuator spring with a solenoid valve that the ECU controls. By varying the duty cycle of the solenoid, the ECU can bleed pressure from the wastegate actuator line, allowing the turbo to build more boost than the spring alone would permit.\n\nThe most common setup uses a 3-port MAC-type solenoid. Port 1 connects to the compressor housing (pressure source), port 2 connects to the wastegate actuator, and port 3 vents to atmosphere through a small filter.\n\nAt 0% duty cycle, full pressure reaches the wastegate actuator — this is your 'base' boost level (determined by the spring). As duty cycle increases, more pressure is vented, allowing the turbo to build higher boost.\n\nSpeeduino supports most 3-port and 4-port boost solenoids, with PWM frequencies between 15 Hz and 500 Hz supported by the firmware."
      },
      {
        heading: "Open-Loop vs Closed-Loop Control",
        body: "**Open-loop** boost control uses a fixed duty cycle table based on RPM and throttle position. It's simpler to set up but doesn't compensate for changing conditions (altitude, temperature, back-pressure). In open-loop mode, the duty cycle table values are the direct solenoid duty cycle percentages.\n\n**Closed-loop** control adds a PID (Proportional-Integral-Derivative) controller that compares actual boost to a target boost table and adjusts the solenoid duty cycle in real-time. This gives more consistent boost levels across conditions. In closed-loop mode, the boost map serves as a target table — values represent desired boost pressures in kPa.\n\nWe recommend starting with open-loop to establish baseline behaviour, then switching to closed-loop once you understand how your turbo system responds. Closed-loop control requires more careful PID tuning but delivers more consistent results."
      },
      {
        heading: "Solenoid Selection and Wiring",
        body: "The MAC 3-port solenoid is the most popular choice for Speeduino builds. It's affordable, reliable, and well-proven across many different turbo setups.\n\n**Wiring:** The solenoid needs a 12V supply (switched with ignition) and a ground controlled by the ECU through a high-current output. The v0.3 and v0.4 boards have medium-current MOSFET outputs capable of switching up to 3 amps directly — these are the correct outputs to use for the boost solenoid. The boost control output is configurable in TunerStudio.\n\n**Important:** Use a flyback diode across the solenoid terminals to protect the ECU's driver transistor from voltage spikes when the solenoid switches off. Many pre-wired solenoids already include this internally."
      },
      {
        heading: "Setting Up Boost Control in TunerStudio",
        body: "In TunerStudio, navigate to the boost control settings. Speeduino offers two PID modes:\n\n**Simple mode** — The ECU manages PID values internally, and you adjust a single sensitivity slider to control how aggressively the duty cycle responds. Easier to set up initially. Note that setting sensitivity too high risks overboost, while too low causes lag. Simple mode is a good starting point.\n\n**Full mode** — You specify the P (Proportional), I (Integral), and D (Derivative) gains individually, giving greater control over boost response. Start with conservative values (P=10–20, I=5–10, D=0) and tune incrementally.\n\nSetup procedure:\n1. Set the output pin assignment to match your solenoid wiring\n2. Configure the PWM frequency — between 15 Hz and 500 Hz is supported; for MAC-type solenoids, 30–40 Hz is typical\n3. In open-loop mode, populate your duty cycle table starting conservatively (low duty = low boost)\n4. In closed-loop mode, set your target boost table in kPa and configure PID values\n5. Enable the boost cut safety threshold\n\nAlways test boost control changes incrementally. Make small adjustments, log the results, and verify behaviour before increasing targets."
      },
      {
        heading: "Safety: Overboost Protection and Fuel Cut",
        body: "Overboost protection is critical for turbo engine safety. Configure these in Speeduino's boost settings:\n\n- **Boost cut:** Set a maximum boost threshold in kPa. If the MAP reading exceeds this level, the ECU cuts fuel and/or spark to protect the engine.\n- **Overboost duration:** Configure how long overboost must persist before triggering a cut — this prevents false triggers from brief boost spikes during gear changes.\n- **Recovery threshold:** Set a lower MAP value at which fuel cut recovery occurs.\n\nAlways set your boost cut threshold with a meaningful safety margin above your target boost. For example, if targeting 1.2 bar (220 kPa absolute), set the cut at 1.4–1.5 bar (240–250 kPa absolute).\n\n*Note: Boost control behaviour depends on your specific turbo, wastegate spring rate, and exhaust back-pressure. Always verify safe operation with careful data logging before pushing towards maximum boost targets.*"
      },
    ],
    references: [
      { label: "Boost Control — Official Wiki", url: "https://wiki.speeduino.com/en/configuration/Boost_Control", type: "wiki" },
      { label: "Forum: Boost Control — Open vs Closed Loop Discussion", url: "https://speeduino.com/forum/viewtopic.php?t=568", type: "forum" },
      { label: "Forum: Boost Control Setup and Troubleshooting", url: "https://speeduino.com/forum/viewtopic.php?t=2568", type: "forum" },
    ],
  },
  {
    slug: "choosing-sensors",
    title: "Choosing Sensors: MAP, IAT, CLT, and Wideband",
    intro: "The right sensors make tuning easier and your engine safer. We explain what each sensor does, what specifications to look for, and which ones work best with Speeduino builds.",
    outline: ["Required vs optional sensors", "MAP sensors explained", "Temperature sensors", "Wideband O2", "Placement tips"],
    category: "Guides",
    readTime: "8 min",
    date: "2024-12-15",
    author: "Wrench over Wallet",
    metaTitle: "Choosing Sensors for Speeduino: MAP, IAT, CLT, Wideband O2 | Wrench over Wallet",
    metaDescription: "Sensor selection guide for Speeduino ECU builds. MAP sensor sizing, temperature sensor calibration, wideband O2 selection, and sensor placement best practices.",
    content: [
      {
        heading: "Required vs Optional Sensors",
        body: "**Required for basic operation:**\n- Crank position sensor (usually OEM)\n- MAP or TPS (Speeduino supports both speed-density and alpha-N fuel strategies)\n- Coolant temperature (CLT) — for warmup enrichment and fan control\n- Intake air temperature (IAT) — for air density correction\n\n**Highly recommended:**\n- Wideband O2 — essential for tuning\n- Throttle position sensor (TPS) — for acceleration enrichment and alpha-N strategy\n\n**Optional but valuable:**\n- Cam position sensor — required for sequential injection\n- Knock sensor — for detonation protection\n- Flex fuel sensor — for E85 blends\n- Barometric pressure sensor — for altitude correction"
      },
      {
        heading: "MAP Sensors: Choosing the Right Range",
        body: "The MAP (Manifold Absolute Pressure) sensor measures intake manifold pressure and is fundamental to speed-density fuel calculation.\n\nThe **MPX4250** (0–250 kPa) is the standard on-board MAP sensor integrated directly onto both the Speeduino v0.3 and v0.4 PCBs. It covers naturally aspirated engines and boosted applications up to approximately 1.5 bar of boost (250 kPa absolute). For the vast majority of builds, this is the correct choice and requires no external sensor wiring.\n\nFor higher-boost applications (above approximately 1.5 bar), an external sensor can be connected to the MAP input pin on the board:\n- **2-bar sensors** measure 0–200 kPa (up to ~1 bar boost)\n- **3-bar sensors** measure 0–300 kPa (up to ~2 bar boost)\n- **4-bar sensors** measure 0–400 kPa (up to ~3 bar boost)\n\nAny 0–5V linear MAP sensor is compatible with Speeduino. TunerStudio has built-in calibration entries for many common sensors, or you can enter custom values. If your sensor is not listed, you can request it be added on the official forum.\n\nNote: MAF (mass air flow) sensors are **not supported** by Speeduino."
      },
      {
        heading: "Temperature Sensors: NTC Characteristics and Calibration",
        body: "Speeduino uses NTC (Negative Temperature Coefficient) thermistors for coolant and intake air temperature measurement. These sensors decrease in resistance as temperature increases.\n\nThe most common type is the GM-style sensor with a 1/8\" NPT thread. These are inexpensive, accurate, and have well-documented resistance curves built into TunerStudio's calibration tables.\n\nThe standard Speeduino v0.3 and v0.4 builds use a **2490 ohm bias resistor** (component R3) for temperature sensors. GM-style sensors are designed for this bias value and will read correctly with the pre-built TunerStudio calibration. If you use sensors from a different manufacturer, verify their required bias resistance — if it differs, you may need to change R3 or override the bias value in TunerStudio's thermistor calibration dialog.\n\n**Calibration is critical.** If your sensor's resistance curve doesn't match the calibration table in the ECU, your temperature readings will be wrong — leading to incorrect fuel enrichment during warmup and cold starts, and potentially engine damage. Always verify your sensor type and select the matching calibration in TunerStudio under Tools → Calibrate Thermistor Tables."
      },
      {
        heading: "Wideband O2: Why It's Essential and How to Connect It",
        body: "A wideband O2 sensor measures the air-fuel ratio across a wide range (typically 10:1 to 20:1 lambda), unlike the narrowband O2 sensors in OEM applications which only indicate whether mixture is richer or leaner than stoichiometric. For tuning, you need wideband accuracy — without it, you're guessing.\n\n**Important:** Speeduino **cannot** connect directly to a raw wideband sensor. You need an external wideband controller that processes the sensor signal and outputs a 0–5V analog voltage. Speeduino reads this analog signal and converts it to an AFR or lambda reading based on your calibration in TunerStudio. The Bosch LSU 4.9 is the current standard wideband sensor, used with controllers such as the Spartan, 14point7, or similar units.\n\nTo connect: run the controller's 0–5V analog output to the O2 input pin on the Speeduino board. Configure the calibration in TunerStudio under Tools → Calibrate AFR Sensor, selecting your controller from the list or entering custom linear calibration values.\n\nOur sensor pack includes a wideband controller with a 0–5V output, pre-configured for use with Speeduino."
      },
      {
        heading: "Sensor Placement Best Practices",
        body: "- **MAP sensor:** The on-board MPX4250 can be connected to the manifold via a small-diameter vacuum hose (typically 4mm ID). Keep hose length short. Add a small tee-piece or reservoir inline to dampen pulsations on 4-cylinder engines. If mounting an external MAP sensor, locate it in the cabin or away from engine heat.\n- **IAT sensor:** Place in the intake tract after any intercooler, before the throttle body. Avoid locations affected by heat soak from the engine or turbocharger.\n- **CLT sensor:** Install in a location that sees representative coolant temperature — typically the thermostat housing or the cylinder head water gallery.\n- **Wideband O2:** Install in the exhaust, 2–3 pipe diameters downstream of the collector merge. Angle the sensor 10° above horizontal to prevent condensation pooling around the sensor element. Some builders connect the wideband controller power to the main relay rather than ignition-switched power to allow gradual sensor warm-up before cranking.\n\n*Always use appropriate thread sealant on sensor threads and torque sensors to specification. Do not use Teflon tape on sensors with tapered NPT threads — it can enter the coolant system.*"
      },
    ],
    references: [
      { label: "Hardware Requirements — Official Wiki", url: "https://wiki.speeduino.com/en/Hardware_requirements", type: "wiki" },
      { label: "Sensor Calibration — Official Wiki", url: "https://wiki.speeduino.com/en/configuration/Sensor_Calibration", type: "wiki" },
      { label: "Forum: Does Speeduino Need a Controller for Wideband O2?", url: "https://speeduino.com/forum/viewtopic.php?t=6581", type: "forum" },
      { label: "Forum: MAP Sensor Calibration Discussion", url: "https://speeduino.com/forum/viewtopic.php?t=670", type: "forum" },
    ],
  },
  {
    slug: "first-start-checklist",
    title: "First Start Checklist: Before You Turn the Key",
    intro: "The moment before first start is exciting — but also where mistakes happen. Use this checklist to verify sensor calibration, wiring, fuel pressure, and base map settings before cranking.",
    outline: ["Sensor calibration check", "Pre-start wiring verification", "Sensor readings check", "Fuel system priming", "Base map essentials", "First crank procedure"],
    category: "Getting Started",
    readTime: "7 min",
    date: "2024-12-10",
    author: "Wrench over Wallet",
    metaTitle: "First Start Checklist for Speeduino ECU | Wrench over Wallet",
    metaDescription: "Complete first start checklist for Speeduino ECU installations. Sensor calibration, wiring verification, sensor sanity checks, fuel priming, and first crank procedure.",
    content: [
      {
        heading: "Sensor Calibration in TunerStudio",
        body: "Before checking wiring or attempting to start the engine, confirm that sensor calibrations are correct in TunerStudio via the Tools menu. Incorrect calibration is the most common cause of first-start problems — if the ECU is making fuel and timing decisions based on wrong sensor data, no amount of tuning will help.\n\n- **MAP (Tools → Calibrate Pressure Sensors):** Should read approximately 100 kPa with the engine off at sea level. Recalibrate and click Burn if incorrect.\n- **CLT and IAT (Tools → Calibrate Thermistor Tables):** Should read close to ambient temperature when cold. Select the correct sensor type from the Common Sensor Values list.\n- **TPS (Tools → Calibrate TPS):** Must read 0% at closed throttle and 100% at wide-open throttle. Recalibrate if out of range.\n- **Wideband O2 (Tools → Calibrate AFR Sensor):** Verify your controller's calibration matches the entry in TunerStudio.\n\nAlso verify you have loaded the correct INI definition file for your firmware version. A firmware/INI mismatch causes garbled sensor readings and settings that behave unpredictably."
      },
      {
        heading: "Pre-Start Wiring Verification",
        body: "Before anything else, verify every connection:\n\n- All sensor grounds connected to ECU sensor ground\n- All power grounds connected to engine block ground point\n- 12V supply to ECU is clean and fused\n- Injector wiring: correct firing order, proper resistance (high-Z injectors should read 8 ohms or more per injector)\n- Ignition coil wiring: correct firing order, flyback diodes in place if needed\n- Fuel pump relay: controlled by ECU output, primes on ignition on\n- No shorts to ground or 12V on any signal wire\n\nUse a multimeter to verify every circuit. This step alone prevents the majority of first-start problems."
      },
      {
        heading: "Sensor Readings Sanity Check",
        body: "With the ECU powered on (engine not running), verify in TunerStudio:\n\n- **CLT:** Should read ambient temperature (or engine temp if recently run)\n- **IAT:** Should read ambient temperature\n- **MAP:** Should read ~100 kPa (atmospheric pressure) with engine off\n- **TPS:** Should read ~0% at closed throttle, ~100% at WOT\n- **Battery voltage:** Should read ~12.4–12.8V\n\nIf any reading is obviously wrong (e.g., CLT reading -40°C or 150°C at ambient), stop and diagnose before proceeding. Common causes: wrong sensor selected in calibration, incorrect bias resistor value, open or short circuit in sensor wiring."
      },
      {
        heading: "Fuel System Priming",
        body: "Before cranking, prime the fuel system:\n\n1. Turn ignition on (ECU powered)\n2. Verify fuel pump runs briefly (priming pulse)\n3. Check for fuel leaks at the rail, injector seals, and feed/return lines\n4. Verify fuel pressure with a gauge if possible\n5. Cycle the ignition 2–3 times to fully pressurize the system\n\n**Critical:** Inspect every fuel connection for leaks before cranking. Fuel leaks in an engine bay are a fire hazard. Never skip this step."
      },
      {
        heading: "Base Map Essentials",
        body: "Your base map should have conservative settings:\n\n- **Fuel:** Rich rather than lean. Target 12.5:1 AFR for initial startup — it's easier to lean out a running engine than to diagnose why it won't start on a lean map.\n- **Ignition timing:** Conservative (e.g., 10° BTDC fixed) for first start. Verify this with a timing light once the engine is running.\n- **Cranking fuel:** Generous cranking pulse width\n- **Idle target RPM:** Set to your engine's typical warm idle (usually 800–900 RPM)\n- **Rev limiter:** Set a conservative limit well below your engine's maximum\n\nDon't try to optimise anything before the engine is running and idling. Get it started first, then tune."
      },
      {
        heading: "First Crank Procedure",
        body: "1. Clear any error codes in TunerStudio\n2. Start data logging — you will want to review this data regardless of outcome\n3. Crank the engine for 3–5 seconds. Do not hold the starter continuously\n4. Watch for: RPM signal (confirms crank sensor working), injector pulse width (confirms fuel delivery), and ignition output (confirms spark)\n5. If the engine fires briefly and dies, that is normal for a first start — adjust cranking fuel and try again\n6. If no RPM signal appears, stop and verify crank sensor wiring and trigger pattern settings\n\n**If it starts:** Let it warm up at idle, watching CLT and wideband AFR. Do not rev it yet — let coolant temperature stabilise and check for leaks.\n\n**If it does not start after 3–4 attempts:** Stop cranking, review your log data, and diagnose systematically. Common causes: wrong trigger pattern selected, incorrect injector polarity or wiring order, no spark due to coil driver issue, or cranking enrichment too lean or too rich."
      },
    ],
    references: [
      { label: "Getting Started — Official Wiki", url: "https://wiki.speeduino.com/en/Getting_Started", type: "wiki" },
      { label: "Sensor Calibration — Official Wiki", url: "https://wiki.speeduino.com/en/configuration/Sensor_Calibration", type: "wiki" },
      { label: "Connecting to TunerStudio — Official Wiki", url: "https://wiki.speeduino.com/en/Connecting_to_TunerStudio", type: "wiki" },
      { label: "Forum: New to Speeduino — First Start Experience", url: "https://speeduino.com/forum/viewtopic.php?t=2651", type: "forum" },
    ],
  },
  {
    slug: "base-maps-explained",
    title: "Base Maps: What They Are and What They Are NOT",
    intro: "A base map gets your engine running — but it's not a tune. Understanding the difference will save you time, frustration, and potentially your engine.",
    outline: ["What a base map contains", "Why no map is universal", "Adjusting VE and spark", "Auto-tune", "Path to a proper tune"],
    category: "Tuning",
    readTime: "7 min",
    date: "2024-12-05",
    author: "Wrench over Wallet",
    metaTitle: "Base Maps Explained: What They Are and Aren't | Wrench over Wallet",
    metaDescription: "Understanding Speeduino base maps. What they contain, why they're not a finished tune, and how to progress from base map to proper engine calibration.",
    content: [
      {
        heading: "What a Base Map Actually Contains",
        body: "A base map is a starting-point calibration that contains:\n\n- **VE (Volumetric Efficiency) table:** An estimate of how efficiently your engine fills its cylinders at various RPM and load points\n- **Ignition timing table:** Conservative spark advance values\n- **Sensor calibrations:** Pre-configured for common sensor types\n- **Cranking and warmup enrichment:** Values to get the engine started and running during warmup\n- **Idle control settings:** Basic idle speed targeting\n\nA base map is designed to get your engine running safely. It is NOT designed for optimal performance, fuel economy, or emissions.\n\nWhen you use SpeedyLoader to flash the firmware, it also downloads a base tune file (.msq) that matches your firmware version. Load this via File → Load Tune in TunerStudio before making any changes. Starting from a matched base tune avoids the problem of zeroed-out tables or incompatible default values."
      },
      {
        heading: "Why No Base Map Is Perfect for Your Engine",
        body: "Every engine is unique. Even two 'identical' engines will have different VE characteristics due to:\n\n- Intake and exhaust modifications\n- Injector flow rates and fuel pressure\n- Altitude and ambient conditions\n- Mechanical condition (compression, valve seal, etc.)\n- Sensor placement differences\n\nA base map from someone with a 'similar' engine is a better starting point than a generic map — but it's still not a tune for YOUR engine. Always treat borrowed base maps as a starting point, not a finished product."
      },
      {
        heading: "How to Adjust VE and Spark Tables",
        body: "After your engine is running on a base map:\n\n1. **VE tuning:** Compare your measured AFR (from wideband) to your target AFR at each operating point. If the mixture is too rich, decrease the VE value; too lean, increase it. TunerStudio's table tools allow you to adjust cells by percentage, making systematic changes easier.\n2. **Spark timing:** Advance timing gradually at each operating point while monitoring for knock. If using a knock sensor, the ECU can assist with this.\n3. **Work in zones:** Start with idle, then light cruise, then higher loads. Don't try to tune the entire map at once.\n\nAlways make small changes and log the results. Tuning is iterative — patience and methodical work produce better results than trying to fix everything at once."
      },
      {
        heading: "When to Use Auto-Tune",
        body: "Speeduino (via TunerStudio) supports auto-tune, which automatically adjusts VE table values based on wideband O2 feedback.\n\nAuto-tune is excellent for roughing in a VE table across a wide range of operating points. It works best during steady-state driving at consistent loads and RPMs.\n\n**However:** Auto-tune is not a substitute for understanding what's happening. It cannot optimise ignition timing. It can chase false readings if sensors are miscalibrated. It should not be relied upon for high-load, high-RPM tuning where margins are thin.\n\nUse auto-tune as a tool, not a solution. Always review cells that have been auto-adjusted — look for any values that seem inconsistent with surrounding cells, which can indicate the cell was adjusted during a transient rather than steady-state condition."
      },
      {
        heading: "The Path from Base Map to Proper Tune",
        body: "1. **Start with the matched base tune** — load the .msq file from SpeedyLoader, get the engine running and idling\n2. **Verify sensor calibrations** — ensure all readings are accurate before any tuning\n3. **Use auto-tune for VE roughing** — drive at various steady-state points across the load and RPM range\n4. **Manually refine VE** — focus on the cells you actually use in normal driving\n5. **Optimise ignition timing** — carefully advance timing at each load/RPM point, watching for knock\n6. **Tune transients** — acceleration enrichment, deceleration fuel cut\n7. **Validate on a dyno** — the only reliable way to confirm safe full-load tuning\n\nIf you're not comfortable with full-load tuning, consider a remote tune review or professional dyno session. We offer base map review services — see our Support page."
      },
    ],
    references: [
      { label: "Engine Constants — Official Wiki", url: "https://wiki.speeduino.com/en/configuration/Engine_Constants", type: "wiki" },
      { label: "Sensor Calibration — Official Wiki", url: "https://wiki.speeduino.com/en/configuration/Sensor_Calibration", type: "wiki" },
      { label: "Forum: Always Reload the Latest INI When Updating Firmware", url: "https://speeduino.com/forum/viewtopic.php?t=64", type: "forum" },
      { label: "Forum: New to Speeduino — First Tuning Experience", url: "https://speeduino.com/forum/viewtopic.php?t=2651", type: "forum" },
    ],
  },
  {
    slug: "common-tuning-mistakes",
    title: "Common Tuning Mistakes and How to Avoid Them",
    intro: "Even experienced builders make tuning mistakes. We cover the most common pitfalls — from incorrect sensor calibration to chasing AFR numbers without understanding why.",
    outline: ["Sensor calibration errors", "Ignoring corrections", "Over-relying on auto-tune", "Spark timing safety", "Not logging enough"],
    category: "Tuning",
    readTime: "9 min",
    date: "2024-11-30",
    author: "Wrench over Wallet",
    metaTitle: "Common Tuning Mistakes with Aftermarket ECUs | Wrench over Wallet",
    metaDescription: "Avoid these common Speeduino and aftermarket ECU tuning mistakes. Sensor calibration, ignition safety, auto-tune pitfalls, and data logging best practices.",
    content: [
      {
        heading: "Incorrect Sensor Calibration",
        body: "This is the #1 tuning mistake. If your sensor calibration tables don't match your actual sensors, every fuel and timing decision the ECU makes will be wrong from the start.\n\nCommon symptoms: engine runs rich or lean despite a 'correct' VE table, temperature corrections don't work properly, idle quality is poor despite correct idle settings, cold starts are difficult.\n\n**Fix:** Verify every sensor against known values before tuning anything. Compare CLT and IAT readings to a thermometer. Verify MAP sensor reads atmospheric pressure with the engine off (approximately 100 kPa at sea level). Check TPS reads 0% closed and 100% at WOT. Verify the wideband O2 controller calibration matches TunerStudio's AFR table settings.\n\nRecalibrate in TunerStudio under the Tools menu, and always reload the correct INI file if you have updated the firmware."
      },
      {
        heading: "Ignoring Coolant and IAT Corrections",
        body: "Your VE table is tuned at a specific operating temperature. The ECU uses warmup enrichment and IAT correction tables to compensate when conditions differ.\n\nIf these corrections are wrong:\n- Cold starts will be difficult or excessively rich\n- Hot intake air (heat soak) will cause lean conditions under high load\n- Seasonal temperature changes will make the car run differently between summer and winter\n\n**Fix:** Verify your warmup enrichment table by logging AFR during a cold start from ambient temperature. Adjust the enrichment until the engine maintains a reasonable target AFR throughout the warmup cycle. Check IAT correction values against how your car behaves on hot days versus cold days."
      },
      {
        heading: "Over-Relying on Auto-Tune",
        body: "Auto-tune adjusts VE values based on wideband feedback. It's useful, but it has real limitations:\n\n- It only corrects cells you're currently operating in — cells you never visit remain unchanged\n- Transient conditions (acceleration, deceleration, gear changes) confuse it and can produce wrong corrections\n- If your wideband calibration is wrong, auto-tune makes everything wrong in a consistent but incorrect direction\n- It cannot optimise ignition timing\n\n**Fix:** Use auto-tune only during steady-state driving at consistent throttle and RPM. Then manually review every cell that was adjusted — look for outliers that don't match surrounding values, which indicate corrections made during transient conditions. Pay particular attention to cells with few data points; these corrections may be based on a single reading."
      },
      {
        heading: "Spark Timing Safety Margins",
        body: "Advancing ignition timing increases power — until it causes detonation. Detonation destroys engines, sometimes in a single event at high load.\n\nCommon mistakes:\n- Copying ignition tables from the internet without understanding the context (different compression ratio, fuel quality, or cooling efficiency)\n- Advancing timing without any knock detection capability\n- Not accounting for fuel quality variations — pump petrol in Europe varies from 95 to 100 RON, which significantly affects the safe timing window\n\n**Fix:** Always advance timing conservatively. Verify your base ignition timing with a timing light against TunerStudio's displayed value — if these don't match, your trigger offset is wrong. Use a knock sensor if at all possible. When in doubt, run 2–3° less timing than you think MBT (Minimum spark for Best Torque) is. The small power loss is worth the safety margin.\n\n*High-load ignition tuning should ideally be performed on a chassis dynamometer with proper knock detection equipment.*"
      },
      {
        heading: "Not Logging Enough Data",
        body: "Data logging is your most powerful diagnostic tool, yet many builders only log when something seems wrong — by which point they've missed the context that would explain the problem.\n\n**Fix:** Log everything, always. Storage is free. Enable comprehensive logging in TunerStudio and save every session with a meaningful filename and date. When something goes wrong, you will have the data to understand why and when it started.\n\nKey channels to always log: RPM, MAP, TPS, AFR (wideband), spark advance, CLT, IAT, injector pulse width, battery voltage. If you have a knock sensor, log knock values too. TunerStudio allows you to define a custom log channel list — set this up once and leave it running.\n\nReview logs in MegaLogViewer for a clear visual of what the engine was doing across all channels simultaneously. Patterns become obvious in the visual representation that are impossible to see in raw numbers."
      },
    ],
    references: [
      { label: "Sensor Calibration — Official Wiki", url: "https://wiki.speeduino.com/en/configuration/Sensor_Calibration", type: "wiki" },
      { label: "Forum: How to Integrate a Knock Sensor for Ignition Tuning", url: "https://speeduino.com/forum/viewtopic.php?t=6852", type: "forum" },
      { label: "Forum: New to Speeduino — Common First-Time Issues", url: "https://speeduino.com/forum/viewtopic.php?t=2651", type: "forum" },
    ],
  },
];

export const getBlogPostBySlug = (slug: string) => blogPosts.find((p) => p.slug === slug);
