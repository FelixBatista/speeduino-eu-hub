import { Link } from "react-router-dom";
import { ExternalLink, Package, Cpu, Cable, Settings, Rocket, BookOpen } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import {
  SPEEDUINO_GETTING_STARTED,
  SPEEDUINO_WIKI_FIRMWARE,
  SPEEDUINO_WIKI_WIRING,
  SPEEDUINO_WIKI_CONFIGURATION,
  SPEEDUINO_WIKI_FIRST_START,
  SPEEDUINO_TUNERSTUDIO,
  SPEEDUINO_SPEEDYLOADER,
  SPEEDUINO_WIKI,
  SPEEDUINO_FORUM,
  SPEEDUINO_DISCORD,
} from "@/data/speeduinoLinks";

const steps = [
  {
    icon: Package,
    number: "01",
    title: "Unbox and verify your kit",
    desc: "Check all components against your order, inspect the PCB, and read the quick-start overview before touching anything else.",
    links: [
      { label: "Getting Started — official wiki overview", href: SPEEDUINO_GETTING_STARTED },
    ],
  },
  {
    icon: Cpu,
    number: "02",
    title: "Upload firmware to the Arduino",
    desc: "Flash the latest Speeduino firmware to your Arduino Mega 2560 using SpeedyLoader before wiring anything. Verify it connects to TunerStudio.",
    links: [
      { label: "Installing Firmware — official wiki", href: SPEEDUINO_WIKI_FIRMWARE },
      { label: "SpeedyLoader (firmware flasher)", href: SPEEDUINO_SPEEDYLOADER },
      { label: "TunerStudio MS (tuning software)", href: SPEEDUINO_TUNERSTUDIO },
    ],
  },
  {
    icon: Cable,
    number: "03",
    title: "Wire the ECU to your engine",
    desc: "Follow the official wiring guide carefully. Use star grounding, shielded sensor wires, and label every connection. This step takes the most time — don't rush it.",
    links: [
      { label: "Wiring Overview — official wiki", href: SPEEDUINO_WIKI_WIRING },
    ],
  },
  {
    icon: Settings,
    number: "04",
    title: "Configure engine constants in TunerStudio",
    desc: "Set your cylinder count, displacement, injector size, trigger pattern, and all sensor calibrations before attempting to start.",
    links: [
      { label: "Engine Configuration — official wiki", href: SPEEDUINO_WIKI_CONFIGURATION },
    ],
  },
  {
    icon: Rocket,
    number: "05",
    title: "First start procedure",
    desc: "Prime the fuel system, verify all sensors read correctly, set base ignition timing, then crank. Most builds start on the first try with good preparation.",
    links: [
      { label: "First Start — official wiki", href: SPEEDUINO_WIKI_FIRST_START },
    ],
  },
];

const resources = [
  { label: "Speeduino Wiki (full manual)", href: SPEEDUINO_WIKI },
  { label: "Community Forum", href: SPEEDUINO_FORUM },
  { label: "Discord (real-time help)", href: SPEEDUINO_DISCORD },
];

export default function GetStarted() {
  return (
    <>
      <SEOHead
        title="Get Started with Speeduino ECU — Step-by-Step Guide for Europe"
        description="How to get started with a Speeduino aftermarket ECU. From unboxing to first start: firmware, wiring, sensors, TunerStudio setup. Practical guide for European builders."
        canonical="/get-started"
      />
      <div className="container max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Get Started</span>
        </nav>

        <div className="mb-10">
          <p className="data-label text-primary mb-3">Installation Guide</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            From Box to First Start
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Follow these official Speeduino resources to prepare your board and install it in your car.
            Every link below goes directly to the authoritative official documentation.
          </p>
        </div>

        <div className="space-y-4 mb-14">
          {steps.map((step, i) => (
            <div key={i} className="card-motorsport p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{step.number}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-lg font-bold text-foreground mb-1">{step.title}</h2>
                  <p className="text-sm text-muted-foreground mb-3">{step.desc}</p>
                  <ul className="space-y-1">
                    {step.links.map((link, j) => (
                      <li key={j}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                        >
                          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card-motorsport p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-foreground mb-1">More Resources</h2>
              <p className="text-sm text-muted-foreground mb-3">
                The Speeduino community is active and helpful. Use these for build logs, detailed threads, and real-time support.
              </p>
              <ul className="space-y-1">
                {resources.map((r, i) => (
                  <li key={i}>
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                    >
                      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                      {r.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-10 text-xs text-muted-foreground text-center">
          All installation steps link to the official{" "}
          <a href={SPEEDUINO_WIKI} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Speeduino Wiki
          </a>
          . We keep this page as a curated index only — the content lives on the official project.
        </p>
      </div>
    </>
  );
}
