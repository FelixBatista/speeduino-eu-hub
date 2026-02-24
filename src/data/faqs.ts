export interface FAQ {
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    question: "Is Speeduino reliable enough for a daily driver?",
    answer: "Yes. Thousands of Speeduino-powered vehicles are driven daily around the world. The platform has been in active development since 2015, and the firmware is mature and well-tested. Like any aftermarket ECU, reliability depends on proper wiring, sensor installation, and tuning. We provide wiring guides and base maps to help you get a reliable result.",
  },
  {
    question: "What engines and cylinder counts does Speeduino support?",
    answer: "Speeduino supports 1 to 8 cylinder engines, including inline, V, flat (boxer), and rotary configurations. The most common setups are 4-cylinder and 5-cylinder (Volvo), but 6 and 8-cylinder builds are well documented. The system works with petrol (gasoline) and E85/flex fuel setups.",
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
    answer: "Speeduino controls the engine only — it does not control automatic transmissions. In most vehicles, the existing transmission control unit (TCU) continues to operate independently. Some vehicles may need additional work to ensure the TCU communicates correctly without the original engine ECU. Manual transmission vehicles have no special requirements.",
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
    answer: "We offer EU-based email support for products purchased from our shop. The Speeduino community is also very active, with forums, a wiki, Discord servers, and YouTube channels with build guides. For hands-on help, we offer optional base map review and remote support sessions.",
  },
  {
    question: "Do you ship to all EU countries?",
    answer: "Yes. We ship from within the EU, so there are no customs duties for EU customers. Standard shipping typically takes 3–7 business days within the EU, and 5–10 days for Sweden/Scandinavia. Express shipping options are available at checkout.",
  },
  {
    question: "What is your return and warranty policy?",
    answer: "We offer a 14-day return policy for unused items in original packaging, in accordance with EU consumer protection regulations. Assembled ECUs come with a 12-month warranty covering manufacturing defects. DIY kits are not covered by warranty once soldered, but we're happy to help troubleshoot.",
  },
  {
    question: "How does Speeduino compare to Megasquirt, Link, or Haltech?",
    answer: "Speeduino offers a fully open-source alternative at a fraction of the cost. While premium ECUs like Link and Haltech offer more integrated features (built-in CAN, advanced data logging), Speeduino provides the core functionality most enthusiasts need. See our detailed comparison page for a feature-by-feature breakdown. Features vary by configuration and firmware; verify for your application.",
  },
  {
    question: "Can I use Speeduino for a track car or rally car?",
    answer: "Yes. Many track and rally builds use Speeduino successfully. For competition use, we recommend the full sensor pack (including wideband, knock sensor, and boost control), proper shielded wiring, and thorough testing before race day. Our Track/Rally bundle includes everything you need to get started.",
  },
];
