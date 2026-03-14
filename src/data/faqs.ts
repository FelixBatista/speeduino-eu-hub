export interface FAQ {
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    question: "Is Speeduino reliable enough for a daily driver?",
    answer: "Yes. Thousands of Speeduino-powered vehicles are driven daily around the world. The platform has been in active development since 2015, and the firmware is mature and well-tested. Like any aftermarket ECU, reliability depends on proper wiring, sensor installation, and tuning. Speeduino official materials provide wiring guides and base maps to help you get a reliable result.",
  },
  {
    question: "What engines and cylinder counts does Speeduino support?",
    answer: "Speeduino supports 1 to 8 cylinder engines, including inline, V, flat (boxer), and rotary configurations. The most common setup is 4-cylinder, though 5, 6, and 8-cylinder builds are well documented. The system works with petrol (gasoline) and E85/flex fuel setups.",
  },
  {
    question: "Can I run full sequential fuel injection?",
    answer: "Yes. Full sequential injection is supported when a cam position sensor is installed. This gives you the best fuel atomization and control. If you don't have a cam sensor, you can still run batch fire or semi-sequential injection with excellent results.",
  },
  {
    question: "Does Speeduino support coil-on-plug (COP) ignition?",
    answer: "Yes. Speeduino supports up to 8 individual ignition outputs for coil-on-plug setups, as well as wasted-spark and single-coil distributor configurations. Most modern COP coils (like those from Volvo, VAG, or aftermarket) work well with the appropriate driver circuits.",
  },
  {
    question: "Can Speeduino handle turbo and boost control?",
    answer: "Absolutely. Speeduino includes open-loop and closed-loop boost control via a 3-port PWM solenoid. You can set boost targets, ramp rates, and overboost protection through TunerStudio. Many turbo builds — including high-power setups — run successfully on Speeduino.",
  },
  {
    question: "What about automatic transmission compatibility?",
    answer: "Speeduino controls the engine only — it does not control automatic transmissions. Some vehicles can retain the factory transmission control unit (TCU), but compatibility depends heavily on the transmission and vehicle electronics. Older or simpler automatics may continue to work with the original TCU if it still receives the signals it needs. Many newer electronically controlled automatics require additional integration, such as throttle/RPM/load signals, torque reduction, or CAN communication with the engine ECU. Manual transmission vehicles generally have no special transmission-control requirements.",
  },
  {
    question: "What sensors do I need?",
    answer: "At minimum, you need a crank position sensor (VR or Hall effect), a MAP or TPS sensor, and coolant/intake air temperature sensors. We strongly recommend adding a wideband O2 sensor for proper tuning. Optional sensors include knock sensor, cam position sensor (for sequential), flex fuel sensor, and barometric pressure sensor.",
  },
  {
    question: "Is Speeduino road legal?",
    answer: "Legality depends on your country and region. In many EU countries, aftermarket engine management is permitted for vehicles that are not required to meet current emission standards (typically older or modified vehicles). It is your responsibility to check local regulations regarding emissions testing, vehicle inspections, and modifications. We recommend consulting local authorities or automotive inspection services.",
  },
  {
    question: "What tuning software does Speeduino use?",
    answer: "Speeduino uses TunerStudio, which is available in a free Lite version and a paid full version. TunerStudio provides a full dashboard, real-time data logging, VE table editing, and auto-tune capability. It runs on Windows, macOS, and Linux.",
  },
  {
    question: "What kind of support is available?",
    answer: "We offer EU-based email support for products purchased from our shop. The Speeduino community is also very active, with forums, a wiki, Discord servers, and YouTube channels with build guides. For hands-on help, we will offer optional base map review and remote support sessions in the future for a fee.",
  },
  {
    question: "Do you ship to all EU countries?",
    answer: "Yes. We ship from within the EU, so there are no customs duties for EU customers. Standard shipping typically takes 3–7 business days. Express shipping options are available at checkout.",
  },
  {
    question: "What is your return and warranty policy?",
    answer: "We offer a 14-day return policy for unused items in original packaging, in accordance with EU consumer protection regulations. Assembled ECUs come with a 12-month warranty covering manufacturing defects. DIY kits are not covered by warranty once soldered, but we're happy to help troubleshoot.",
  },
  {
    question: "How does Speeduino compare to Haltech, Link ECU, MaxxECU, and ECUMaster?",
    answer: "Speeduino is Europe's most affordable standalone ECU — starting at €149 vs €900–2,500 for commercial alternatives. It delivers the same core engine management features: sequential injection, coil-on-plug, boost control, flex fuel, and data logging. Haltech, Link ECU, MaxxECU, and ECUMaster have advantages in advanced driver aids, plug-and-play harnesses, and professional support. Speeduino is the open-source alternative for budget-conscious builders. See our detailed comparison page for a feature-by-feature breakdown.",
  },
  {
    question: "Is Speeduino a good alternative to Haltech in Europe?",
    answer: "Yes. Speeduino covers all the core features of the Haltech Elite series (sequential injection, COP ignition, boost control, wideband integration) at approximately 80% lower cost — from €149 vs €1,200+ for Haltech. It ships from within the EU with no customs duties. The trade-off is that Speeduino requires more DIY involvement and doesn't have manufacturer warranty support. For most European project car builds, it's an excellent alternative to Haltech.",
  },
  {
    question: "How does Speeduino compare to MaxxECU?",
    answer: "Both Speeduino and MaxxECU are popular in Europe, particularly Scandinavia. MaxxECU offers a polished commercial experience with the MaxxTune software and advanced driver aids, starting at ~€900. Speeduino is fully open-source and starts at €149 — about 80% cheaper. Both ship from Sweden/EU. Speeduino is the budget open-source alternative; MaxxECU is the premium commercial choice.",
  },
  {
    question: "Can I use Speeduino for a track car or rally car?",
    answer: "Yes. Many track and rally builds use Speeduino successfully. For competition use, we recommend the full sensor pack (including wideband, knock sensor, and boost control), proper shielded wiring, and thorough testing before race day.",
  },
  {
    question: "What is the cheapest aftermarket ECU I can buy in Europe?",
    answer: "Speeduino is the most affordable standalone ECU option for European builders. DIY kits start at €149 including VAT, shipped from Sweden within the EU. A complete working setup (board, Arduino, core sensors, and wideband) typically costs €400–700 — compared to €1,500–3,000+ for commercial alternatives like Haltech, Link ECU, MaxxECU, or ECUMaster.",
  },
  {
    question: "Does Speeduino work with common European engines?",
    answer: "Yes. Speeduino is widely used with European engines. Documented builds include: Volvo 5-cylinder (B5254T, B5244T, B5252, B5244), BMW inline-6, VAG 4-cylinder turbo (EA113, EA888), Ford Duratec and Zetec, Opel/Vauxhall 4-cylinder, Renault 4-cylinder, and many more. The Speeduino community has base maps and wiring guides for many common European engine configurations.",
  },
];
