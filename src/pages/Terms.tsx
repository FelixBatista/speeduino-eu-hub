import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";

export default function Terms() {
  return (
    <>
      <SEOHead
        title="Terms & Conditions | Wrench over Wallet"
        description="Terms and conditions for purchasing from wrenchoverwallet.com. EU consumer rights, order process, and seller information."
        canonical="/terms"
        noIndex={true}
      />
      <div className="container max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground">Home</Link><span className="mx-2">/</span><span className="text-foreground">Terms & Conditions</span>
        </nav>
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">Terms & Conditions</h1>
        <div className="space-y-6 text-sm text-secondary-foreground leading-relaxed">
          <p><strong className="text-foreground">Last updated:</strong> [Date]</p>
          <h2 className="font-display text-xl font-bold text-foreground mt-8">General</h2>
          <p>By placing an order through Wrench over Wallet, you agree to these terms. Products are sold for off-road/educational/hobby use unless otherwise stated. It is the buyer's responsibility to ensure compliance with local regulations regarding engine modifications and emissions.</p>
          <h2 className="font-display text-xl font-bold text-foreground mt-8">Products</h2>
          <p>Products are described as accurately as possible. Speeduino is an open-source project; firmware features may vary by version. We do not guarantee compatibility with every vehicle or configuration — please use the compatibility wizard and contact us with questions before ordering.</p>
          <h2 className="font-display text-xl font-bold text-foreground mt-8">Pricing & Payment</h2>
          <p>All prices are in EUR and include VAT for EU customers. Payment is processed securely via Stripe. We reserve the right to update prices without prior notice.</p>
          <h2 className="font-display text-xl font-bold text-foreground mt-8">Limitation of Liability</h2>
          <p>Wrench over Wallet is not liable for damages resulting from improper installation, wiring, tuning, or use of products. Engine management modifications carry inherent risk — always verify your work and test in a safe environment.</p>
          <h2 className="font-display text-xl font-bold text-foreground mt-8">Governing Law</h2>
          <p>These terms are governed by the laws of Sweden. EU consumer protection regulations apply.</p>
        </div>
      </div>
    </main>
    </>
  );
}
