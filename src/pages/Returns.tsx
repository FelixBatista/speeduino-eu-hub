import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";

export default function Returns() {
  return (
    <>
      <SEOHead
        title="Returns & Warranty | Wrench over Wallet"
        description="14-day return policy and 12-month warranty for ECU products from Wrench over Wallet. EU consumer protection applies. Easy returns from anywhere in Europe."
        canonical="/returns"
        noIndex={true}
      />
      <div className="container max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground">Home</Link><span className="mx-2">/</span><span className="text-foreground">Returns & Warranty</span>
        </nav>
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">Returns & Warranty</h1>
        <div className="space-y-6 text-sm text-secondary-foreground leading-relaxed">
          <h2 className="font-display text-xl font-bold text-foreground">Returns</h2>
          <p>We offer a 14-day right of withdrawal in accordance with EU consumer protection regulations. Items must be unused, in original packaging, and returned at the buyer's expense. Contact support@wrenchoverwallet.com to initiate a return.</p>
          <h2 className="font-display text-xl font-bold text-foreground mt-8">Warranty</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong className="text-foreground">PCBs & DIY Kits:</strong> Components are warranted as delivered. Once soldered, assembly quality is the buyer's responsibility. We're happy to help troubleshoot.</li>
            <li><strong className="text-foreground">Sensors & Modules:</strong> 12-month warranty covering manufacturing defects. Does not cover damage from improper wiring, incorrect voltage, or physical damage.</li>
            <li><strong className="text-foreground">Connectors & Accessories:</strong> Warranted as delivered. No returns on crimp pins once used.</li>
          </ul>
          <h2 className="font-display text-xl font-bold text-foreground mt-8">How to Claim</h2>
          <p>Email support@wrenchoverwallet.com with your order number, a description of the issue, and photos if applicable. We'll respond within 2 business days.</p>
        </div>
      </div>
    </main>
    </>
  );
}
