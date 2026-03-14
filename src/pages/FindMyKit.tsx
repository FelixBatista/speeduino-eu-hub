import { Link } from "react-router-dom";
import { supportedConfigs } from "@/data/compatibility";
import CompatibilityWizard from "@/components/home/CompatibilityWizard";
import { motion } from "framer-motion";
import { Check, X, Info } from "lucide-react";
import SEOHead from "@/components/SEOHead";

export default function FindMyKit() {
  const { sensors, control, transmission } = supportedConfigs;

  return (
    <>
      <SEOHead
        title="ECU Kit Finder — Which Speeduino Kit Fits Your Engine?"
        description="Find the right aftermarket ECU kit for your engine. Answer a few questions about cylinders, induction, and sensors — get a personalised Speeduino kit recommendation shipped from the EU."
        canonical="/find-my-kit"
      />
      <div className="container max-w-3xl pt-24 pb-20">
        <nav className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Find My Kit</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Find My Kit
          </h1>
          <p className="text-muted-foreground max-w-2xl mb-12">
            Answer a few questions about your engine setup. We'll show you exactly which components you need, recommend, and can optionally add.
          </p>
        </motion.div>

        <CompatibilityWizard />

        <section className="mt-20 max-w-4xl mx-auto space-y-12">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">Sensors</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {(["required", "recommended", "optional"] as const).map((cat) => (
                <div key={cat} className="card-motorsport p-5">
                  <h3 className="data-label text-primary mb-3 capitalize">{cat}</h3>
                  <ul className="space-y-2 text-sm">
                    {sensors[cat].map((s, i) => (
                      <li key={i} className="flex items-center gap-2 text-secondary-foreground">
                        <Check className="w-3.5 h-3.5 text-primary" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">Control Outputs</h2>
            <div className="space-y-2">
              {Object.entries(control).map(([key, val]) => (
                <div key={key} className="flex justify-between items-center py-3 border-b border-border/30 text-sm">
                  <span className="text-foreground font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-right max-w-xs">{val.type}</span>
                    {val.supported ? <Check className="w-4 h-4 text-primary" /> : <X className="w-4 h-4 text-destructive" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">Transmission</h2>
            <div className="space-y-2">
              {Object.entries(transmission).map(([key, val]) => (
                <div key={key} className="flex justify-between items-start py-3 border-b border-border/30 text-sm">
                  <span className="text-foreground font-medium capitalize">{key}</span>
                  <div className="text-right max-w-sm">
                    <div className="flex items-center gap-2 justify-end">
                      {val.supported ? <Check className="w-4 h-4 text-primary" /> : <X className="w-4 h-4 text-destructive" />}
                      <span className={val.supported ? "text-primary" : "text-destructive"}>
                        {val.supported ? "Supported" : "Not controlled by ECU"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{val.notes}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" /> Always verify compatibility for your specific vehicle and transmission combination.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
