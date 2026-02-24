import { Link } from "react-router-dom";

export default function Shipping() {
  return (
    <main className="pt-24 pb-20">
      <div className="container max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground">Home</Link><span className="mx-2">/</span><span className="text-foreground">Shipping</span>
        </nav>
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">Shipping Information</h1>
        <div className="space-y-6 text-sm text-secondary-foreground leading-relaxed">
          <h2 className="font-display text-xl font-bold text-foreground">EU Shipping</h2>
          <p>We ship from within the EU (Sweden). No customs duties or import fees for EU customers.</p>
          <div className="card-motorsport p-5 my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 data-label">Region</th>
                  <th className="text-left py-2 data-label">Standard</th>
                  <th className="text-left py-2 data-label">Express</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/30"><td className="py-2 text-foreground">Sweden</td><td>3–5 days</td><td>1–2 days</td></tr>
                <tr className="border-b border-border/30"><td className="py-2 text-foreground">Scandinavia (NO, DK, FI)</td><td>4–7 days</td><td>2–3 days</td></tr>
                <tr className="border-b border-border/30"><td className="py-2 text-foreground">Western Europe</td><td>5–8 days</td><td>2–4 days</td></tr>
                <tr><td className="py-2 text-foreground">Eastern Europe</td><td>7–12 days</td><td>3–5 days</td></tr>
              </tbody>
            </table>
          </div>
          <h2 className="font-display text-xl font-bold text-foreground mt-8">Free Shipping</h2>
          <p>Free standard shipping on orders over €250 within the EU.</p>
          <h2 className="font-display text-xl font-bold text-foreground mt-8">Non-EU Shipping</h2>
          <p>We can ship outside the EU on request. Import duties and VAT may apply depending on your country. Contact us for a quote.</p>
          <h2 className="font-display text-xl font-bold text-foreground mt-8">Order Processing</h2>
          <p>Orders are typically processed within 1–2 business days. Assembled ECUs may take 3–5 additional business days for build and testing. You'll receive a tracking number once shipped.</p>
        </div>
      </div>
    </main>
  );
}
