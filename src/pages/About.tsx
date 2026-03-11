import { Link } from "react-router-dom";
import { MapPin, Truck, Heart, Github } from "lucide-react";
import { SPEEDUINO_MAIN } from "@/data/speeduinoLinks";
import SEOHead from "@/components/SEOHead";

export default function About() {
  return (
    <>
      <SEOHead
        title="About Wrench over Wallet | EU-Based Open-Source ECU Shop"
        description="Wrench over Wallet is an EU-based shop (Sweden) making open-source Speeduino ECU kits accessible to European car enthusiasts. Affordable, transparent, community-driven."
        canonical="/about"
      />
      <div className="container max-w-3xl pt-24 pb-20">
        <nav className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">About</span>
        </nav>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">About Wrench over Wallet</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-secondary-foreground">
          <p className="text-lg">
            We're an EU-based shop dedicated to making open-source engine management accessible to European enthusiasts. Based in Sweden, we source, assemble, test, and ship Speeduino ECU kits across Europe. The official Speeduino project and community are at{" "}
            <a href={SPEEDUINO_MAIN} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">speeduino.com</a>
            {" "}— Wrench over Wallet is an independent EU shop.
          </p>

          <div className="grid md:grid-cols-2 gap-4 not-prose my-8">
            {[
              { icon: MapPin, title: "Based in Sweden", desc: "EU warehouse, no customs hassle for European customers." },
              { icon: Truck, title: "EU Shipping", desc: "3–7 business days within EU. All prices include VAT." },
              { icon: Github, title: "Open Source", desc: "We support the Speeduino open-source project and community." },
              { icon: Heart, title: "Enthusiast-Run", desc: "Built by tuners, for tuners. We use what we sell." },
            ].map((item, i) => (
              <div key={i} className="card-motorsport p-5">
                <item.icon className="w-5 h-5 text-primary mb-3" />
                <h3 className="font-display font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="font-display text-2xl font-bold text-foreground">Our Mission</h2>
          <p>
            We believe engine management should be transparent, affordable, and hackable. Commercial ECUs are excellent products, but not everyone needs — or wants — a closed ecosystem. Speeduino gives you full control over your engine, your data, and your budget.
          </p>
          <p>
            We focus on quality, documentation, and honest communication. Every kit we ship is something we'd put in our own car.
          </p>
        </div>
      </div>
    </>
  );
}
