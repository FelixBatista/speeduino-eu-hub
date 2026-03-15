import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import GetStartedSection from "@/components/GetStartedSection";

export default function GetStarted() {
  return (
    <>
      <SEOHead
        title="Get Started with Speeduino ECU — Step-by-Step Guide for Europe"
        description="How to get started with a Speeduino aftermarket ECU. From unboxing to first start: firmware, wiring, sensors, TunerStudio setup. Practical guide for European builders."
        canonical="/get-started"
      />
      <div className="container max-w-3xl pt-24 pb-20">
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

        <GetStartedSection showHeader={false} />
      </div>
    </>
  );
}
