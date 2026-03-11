import { Link } from "react-router-dom";
import { Mail, MessageCircle, BookOpen, Youtube, Headphones, Cpu, ArrowRight, Download, ExternalLink } from "lucide-react";
import {
  SPEEDUINO_FORUM,
  SPEEDUINO_DISCORD,
  SPEEDUINO_WIKI,
  SPEEDUINO_TUNERSTUDIO,
  SPEEDUINO_SPEEDYLOADER,
  SPEEDUINO_YOUTUBE_SEARCH,
} from "@/data/speeduinoLinks";
import SEOHead from "@/components/SEOHead";

const software = [
  {
    icon: Cpu,
    title: "TunerStudio Lite",
    desc: "The tuning software every Speeduino build requires. Use it to configure engine constants, calibrate sensors, and monitor your engine in real time. The free Lite version covers everything you need for a standard install.",
    action: "Download TunerStudio",
    href: SPEEDUINO_TUNERSTUDIO,
  },
  {
    icon: Download,
    title: "SpeedyLoader",
    desc: "Flash the latest Speeduino firmware to your Arduino Mega 2560 with a single click. No IDE, no compiling — just connect and flash. Do this before you wire anything.",
    action: "Download SpeedyLoader",
    href: SPEEDUINO_SPEEDYLOADER,
  },
];

const docs = [
  {
    icon: BookOpen,
    title: "Official Wiki",
    desc: "The authoritative reference for everything Speeduino: wiring diagrams, sensor calibration, trigger patterns, and full configuration guides.",
    action: "Open Wiki",
    href: SPEEDUINO_WIKI,
  },
  {
    icon: MessageCircle,
    title: "Discord Community",
    desc: "The fastest way to get help from experienced builders. Great for quick questions, \"is this normal?\" checks, and real-time troubleshooting.",
    action: "Join Discord",
    href: SPEEDUINO_DISCORD,
  },
  {
    icon: MessageCircle,
    title: "Speeduino Forum",
    desc: "A searchable archive of detailed build logs, troubleshooting threads, and deep technical discussions. Excellent for complex or recurring issues.",
    action: "Browse Forum",
    href: SPEEDUINO_FORUM,
  },
  {
    icon: Youtube,
    title: "YouTube Tutorials",
    desc: "Community video guides covering builds, wiring walkthroughs, TunerStudio setup, and tuning sessions — useful for visual learners.",
    action: "Watch on YouTube",
    href: SPEEDUINO_YOUTUBE_SEARCH,
  },
];

const productSupport = [
  {
    icon: Mail,
    title: "Email Support",
    desc: "For order issues, missing items, shipping queries, or product-specific problems with hardware purchased from our shop. Typical response: 1–2 business days.",
    action: "support@wrenchoverwallet.com",
    href: "mailto:support@wrenchoverwallet.com",
  },
  {
    icon: Headphones,
    title: "Remote Tuning Review",
    desc: "Book a session for base map review, wiring check, or guided troubleshooting. Available by appointment.",
    action: "Coming soon",
    href: null,
  },
];

export default function Support() {
  return (
    <>
      <SEOHead
        title="Speeduino ECU Support — EU-Based Help for Your Build"
        description="EU-based support for Speeduino ECU builds. Step-by-step installation guide, TunerStudio, SpeedyLoader, official wiki, Discord, forum, and email support."
        canonical="/support"
      />
      <div className="container max-w-3xl pt-24 pb-20">
        <nav className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Support</span>
        </nav>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Support</h1>
        <p className="text-muted-foreground mb-12">
          Everything you need to get your Speeduino build running — from first boot to tuning.
        </p>

        {/* Section A: New buyer hero */}
        <section className="mb-12">
          <div className="card-motorsport p-8 bg-primary/5 border-primary/20">
            <p className="data-label text-primary mb-2">Just received your board?</p>
            <h2 className="font-display text-2xl font-bold text-foreground mb-3">
              Start here — From Box to First Start
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg">
              Our step-by-step guide walks you through unboxing, flashing firmware, wiring, configuring TunerStudio, and your first engine start — all linking directly to official documentation.
            </p>
            <Link to="/get-started" className="cta-primary inline-flex items-center gap-2">
              Open Installation Guide <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Section B: Essential Software */}
        <section className="mb-12">
          <h2 className="font-display text-xl font-bold text-foreground mb-1">Essential Software</h2>
          <p className="text-sm text-muted-foreground mb-5">
            You need both of these installed before you can use your Speeduino ECU.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {software.map((item, i) => (
              <div key={i} className="card-motorsport p-6 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-sm text-primary hover:underline font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                    {item.action}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section C: Documentation & Community */}
        <section className="mb-12">
          <h2 className="font-display text-xl font-bold text-foreground mb-1">Documentation & Community</h2>
          <p className="text-sm text-muted-foreground mb-5">
            The official wiki is your primary reference. The community is active and genuinely helpful.
          </p>
          <div className="space-y-4">
            {docs.map((item, i) => (
              <div key={i} className="card-motorsport p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{item.desc}</p>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                    {item.action}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section D: Product Support */}
        <section className="mb-12">
          <h2 className="font-display text-xl font-bold text-foreground mb-1">Product & Order Support</h2>
          <p className="text-sm text-muted-foreground mb-5">
            For issues with hardware or orders purchased from our shop.
          </p>
          <div className="space-y-4">
            {productSupport.map((item, i) => (
              <div key={i} className="card-motorsport p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{item.desc}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="font-mono text-sm text-primary hover:underline"
                    >
                      {item.action}
                    </a>
                  ) : (
                    <p className="font-mono text-sm text-muted-foreground">{item.action}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
