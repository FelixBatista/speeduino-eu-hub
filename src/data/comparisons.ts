export interface ComparisonRow {
  dimension: string;
  speeduino: string;
  megasquirt: string;
  link: string;
  haltech: string;
  ecumaster: string;
  maxxecu: string;
}

export type FilterCategory = "all" | "street" | "track" | "rally" | "budget" | "advanced";

export const comparisonDimensions: ComparisonRow[] = [
  {
    dimension: "Approximate starting price (EUR)",
    speeduino: "~€129 (DIY) / ~€299 (assembled)",
    megasquirt: "~€350–500",
    link: "~€800–1500",
    haltech: "~€1200–2500",
    ecumaster: "~€600–1200",
    maxxecu: "~€900–1800",
  },
  {
    dimension: "Open-source hardware",
    speeduino: "Yes — fully open",
    megasquirt: "Partially (older versions)",
    link: "No",
    haltech: "No",
    ecumaster: "No",
    maxxecu: "No",
  },
  {
    dimension: "Open-source firmware",
    speeduino: "Yes — community-driven",
    megasquirt: "Partially",
    link: "No",
    haltech: "No",
    ecumaster: "No",
    maxxecu: "No",
  },
  {
    dimension: "Tuning software cost",
    speeduino: "Free (TunerStudio Lite)",
    megasquirt: "Free (TunerStudio Lite)",
    link: "Included",
    haltech: "Included",
    ecumaster: "Included",
    maxxecu: "Included",
  },
  {
    dimension: "Community & support",
    speeduino: "Large open community, forums, wiki",
    megasquirt: "Large community, forums",
    link: "Official support + community",
    haltech: "Official support + community",
    ecumaster: "Growing community",
    maxxecu: "Official support (EU-based)",
  },
  {
    dimension: "Sequential injection",
    speeduino: "Yes (with cam sensor)",
    megasquirt: "Yes",
    link: "Yes",
    haltech: "Yes",
    ecumaster: "Yes",
    maxxecu: "Yes",
  },
  {
    dimension: "Coil-on-plug",
    speeduino: "Yes (up to 8 outputs)",
    megasquirt: "Yes",
    link: "Yes",
    haltech: "Yes",
    ecumaster: "Yes",
    maxxecu: "Yes",
  },
  {
    dimension: "Boost control",
    speeduino: "Yes (open/closed-loop)",
    megasquirt: "Yes",
    link: "Yes",
    haltech: "Yes",
    ecumaster: "Yes",
    maxxecu: "Yes",
  },
  {
    dimension: "Data logging",
    speeduino: "Basic (via TunerStudio / SD)",
    megasquirt: "Yes (SD card)",
    link: "Advanced (built-in)",
    haltech: "Advanced (built-in)",
    ecumaster: "Yes",
    maxxecu: "Advanced",
  },
  {
    dimension: "CAN bus",
    speeduino: "With add-on shield",
    megasquirt: "Built-in (MS3)",
    link: "Built-in",
    haltech: "Built-in",
    ecumaster: "Built-in",
    maxxecu: "Built-in",
  },
  {
    dimension: "Expandability / modularity",
    speeduino: "High — add any I/O via hardware mods",
    megasquirt: "Moderate",
    link: "Moderate (within product line)",
    haltech: "Moderate",
    ecumaster: "Moderate",
    maxxecu: "Moderate",
  },
  {
    dimension: "Learning resources",
    speeduino: "Extensive (wiki, YouTube, forums)",
    megasquirt: "Extensive",
    link: "Good (official docs + community)",
    haltech: "Good (official + YouTube)",
    ecumaster: "Growing",
    maxxecu: "Good (official docs)",
  },
];

export const comparisonDisclaimer = "Features vary by specific model, firmware version, and configuration. Always verify capabilities for your application. Prices are approximate and may vary by region and retailer. This comparison is provided for informational purposes.";
